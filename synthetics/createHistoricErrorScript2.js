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
  data.footer += 'measure_${tp.stage_index}_${tp.touchpoint_index}: account(id: ${myAccountID}) { nrql(query: "${tp.query} SINCE ${tp.measure_time}", timeout:${tp.timeout}) {results}} ';
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
  console.log(raw);
  $http.post(graphqlpack, callback);
});


const responses = [];
let totalResponses = 0;
function callback(err, response, body) {
  const results = JSON.parse(body);
  responses.push(results);
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
        if (Object.prototype.hasOwnProperty.call(results,'session')){
          error =  results.session < tp.min_count;
          measure_results = {
            session_count: results.session
          }
        }
        break;
      case 'PCC':
        if (Object.prototype.hasOwnProperty.call(results,'count')){
          error = results.count < tp.min_count;
          measure_results = {
            transaction_count: results.count
          }
        }
        break;
      case 'APP':
      case 'FRT':
        if (Object.prototype.hasOwnProperty.call(results,'apdex') &&
          Object.prototype.hasOwnProperty.call(results,'score') &&
          Object.prototype.hasOwnProperty.call(results,'response') &&
          Object.prototype.hasOwnProperty.call(results,'error')
        ) {
          error = results.error > tp.max_error_percentage || results.score < tp.min_apdex || results.response > tp.max_response_time;
          measure_results = {
            apdex_value: results.score,
            response_value: results.response,
            error_percentage: results.error
          }
        }
        break;
      case 'SYN':
        if (Object.prototype.hasOwnProperty.call(results,'success') &&
        Object.prototype.hasOwnProperty.call(results,'duration') &&
        Object.prototype.hasOwnProperty.call(results,'request')
        ) {
          error = results.success < tp.min_success_percentage || results.request > tp.max_avg_response_time || results.duration > tp.max_total_check_time;
          measure_results = {
            success_percentage: results.success,
            max_duration: results.duration,
            max_request_time: results.request,
          }
        }
        break;
    }
    return {
      eventType: 'PathpointHistoricErrors',
      pathpoint_id: pathpointID,
      stage_index: stage_index,
      touchpoint_index: touchpoint_index,
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
