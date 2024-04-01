function historicErrorScript(pathpointID) {
  const data = {
    header: null,
    footer: null
  };
  const ppId = pathpointID.toUpperCase().replace(/-/g, '');
  data.header = `
  // Insert API Credentials
  const myAccountID = $secure.PATHPOINT_${ppId}_ACCOUNTID;
  const pathpointID = '${pathpointID}';
  const graphQLKey = $secure.PATHPOINT_${ppId}_USER_API_KEY;
  const myInsertKey = $secure.PATHPOINT_${ppId}_INGEST_LICENSE;

`;
  data.footer = `

  const graphQLdata = [];

touchpoints.forEach( tp_group => {
  let data = '{ actor { ';
  tp_group.forEach( tp =>{
    data +=  `;
  data.footer += String.fromCharCode(96);
  data.footer += 'measure_${tp.stage_index}_${tp.touchpoint_index}: account(id: ${tp.measure.accountID}) { nrql(query: "${tp.measure.query} SINCE ${tp.measure.measure_time}", timeout:10) {results}} ';
  data.footer += String.fromCharCode(96);
  data.footer += `;
  });
  data +='}}';
  const gql = { query: data , variables: ''};
  graphQLdata.push(gql);
});

graphQLdata.forEach( gql =>{
  const raw = JSON.stringify(gql);
  const graphqlpack = {
    headers: {
        "Content-Type": "application/json",
        "API-Key": graphQLKey
    },
    url: 'https://api.newrelic.com/graphql',
    body: raw
  };
  //console.log(raw);
  $http.post(graphqlpack, callback);
});


const responses = [];
let totalResponses = 0;
function callback(err, response, body) {
  const results = JSON.parse(body);
  responses.push(results);
  //responses.push(body);
  totalResponses++;
  console.log('Responses:',totalResponses);
  if (totalResponses === graphQLdata.length){
    ProcessData();
  }
}

function ProcessData() {
  console.log('Processing Responses...');
  const events = [];
  let event = null;
  let c = null;
  let stage_index = 0;
  let touchpoint_index = 0;
  responses.forEach( response =>{
    for (const [key, value] of Object.entries(response.data.actor)) {
      c = key.split("_");
      if (value.nrql && value.nrql.results && value.nrql.results != null) {
        stage_index = parseInt(c[1]);
        touchpoint_index = parseInt(c[2]);
        event = MakeEvent(value.nrql.results[0],stage_index,touchpoint_index);
        console.log(event);
        events.push(event);
      }
    }
  });
  const raw = JSON.stringify(events);
  const options = {
        url: "https://insights-collector.newrelic.com/v1/accounts/" + myAccountID + "/events",
        body: raw,
        headers: {
            'X-Insert-Key': myInsertKey,
            'Content-Type': 'application/json'
        }
    };
    $http.post(options, function (error, response, body) {
        console.log('Ingestionresponse code: ',response.statusCode);
        const info = JSON.parse(body);
        console.log(info);
    });
}

function MakeEvent(results,stage_index,touchpoint_index) {
    const tp = GetTouchpoint(stage_index,touchpoint_index);
    let error = true;
    let measure_results = null;
    switch (tp.type) {
      case 'PRC':
        if (Reflect.has(results,'session')){
          error =  results.session < tp.measure.min_count;
          measure_results = {
            session_count: results.session
          }
        }
        break;
      case 'PCC':
        if (Reflect.has(results,'count')){
          error = results.count < tp.measure.min_count;
          measure_results = {
            transaction_count: results.count
          }
        }
        break;
      case 'APP':
      case 'FRT':
      case 'API':
        if (Reflect.has(results,'apdex') &&
        Reflect.has(results,'response') &&
        Reflect.has(results,'error')
        ) {
          error = results.error > tp.measure.max_error_percentage || results.score < tp.measure.min_apdex || results.response > tp.measure.max_response_time;
          measure_results = {
            apdex_value: results.score ? results.score : results.apdex,
            response_value: results.response,
            error_percentage: results.error
          }
        }
        break;
      case 'SYN':
        if (Reflect.has(results,'success') &&
        Reflect.has(results,'duration') &&
        Reflect.has(results,'request')
        ) {
          error = results.success < tp.measure.min_success_percentage || results.request > tp.measure.max_avg_response_time || results.duration > tp.measure.max_total_check_time;
          measure_results = {
            success_percentage: results.success,
            max_duration: results.duration,
            max_request_time: results.request,
          }
        }
        break;
      case 'WLD':
        if (Reflect.has(results,'statusValue')) {
          error = results.status_value === 'DISRUPTED' || results.status_value === 'UNKNOWN' || results.status_value === 'NO-VALUE'
          measure_results = {
            status_value: results.status_value
          }
        }
        break;
      case 'DRP':
        if (Reflect.has(results,'count')) {
          error = false;
          measure_results = {
            value: results.count
          }
        }
        break;
      case 'APC':
        if (Reflect.has(results,'count')) {
          error = results.count < tp.measure.min_count;
          measure_results = {
            api_count: results.count
          }
        }
        break;
      case 'APS':
        if (Reflect.has(results,'percentage')) {
          error = results.percentage < tp.measure.min_success_percentage;
          measure_results = {
            success_percentage: results.percentage
          }
        }
        break;
      case 'VAL':
        if (Reflect.has(results,'value')) {
          error = results.value > tp.measure.max_value;
          measure_results = {
            value: results.value
          }
        }
        break;
    }
    return {
      eventType: 'PathpointHistoricErrors',
      pathpoint_id: pathpointID,
      stage_name: tp.stage_name,
      stage_index: stage_index,
      touchpoint_index: touchpoint_index,
      touchpoint_name: tp.touchpoint_name,
      touchpoint_type: tp.type,
      error: error,
      ...measure_results
    };
}

function GetTouchpoint(stage_index,touchpoint_index){
  let touchpoint = null;
  touchpoints.some( tpgroup =>{
    const foundg = tpgroup.some( tp => {
      let found = false;
      if (tp.stage_index === stage_index && tp.touchpoint_index === touchpoint_index) {
        touchpoint = tp;
        found = true;
      }
      return found;
    });
    return foundg;
  });
  return touchpoint;
}
`;

  return data;
}

export { historicErrorScript };
