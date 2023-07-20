const fs = require('fs');
const { exit } = require('process');

const fileToTransform = 'Pathpoint_Json_v1.7.6.json';

// -----------------------------------------
function UpdateTouchpointsRelationship(touchPoints, stages) {
  touchPoints[0].touchpoints.forEach(touchpoint => {
    const indexList = [];
    let index = 0;
    touchpoint.relation_steps.forEach(value => {
      index = GetIndexStep(stages, touchpoint.stage_index, value);
      if (index !== 0) {
        indexList.push(index);
      }
    });
    touchpoint.relation_steps = indexList;
  });
  stages.forEach(stage => {
    stage.touchpoints.forEach(touchpoint => {
      const indexList = [];
      let index = 0;
      touchpoint.relation_steps.forEach(value => {
        index = GetIndexStep(stages, touchpoint.stage_index, value);
        if (index !== 0) {
          indexList.push(index);
        }
      });
      touchpoint.relation_steps = indexList;
      SetStepsRelationship(
        stages,
        touchpoint.stage_index,
        indexList,
        touchpoint.index
      );
    });
  });
}

function GetIndexStep(stages, stage_index, stepId) {
  let index = 0;
  stages[stage_index - 1].steps.some(step => {
    let found = false;
    step.sub_steps.some(sub_step => {
      if (sub_step.id === stepId) {
        index = sub_step.index;
        found = true;
      }
      return found;
    });
    return found;
  });
  return index;
}

function SetStepsRelationship(
  stages,
  stage_index,
  indexList,
  touchpoint_index
) {
  for (let i = 0; i < indexList.length; i++) {
    stages[stage_index - 1].steps.some(step => {
      let found = false;
      step.sub_steps.some(sub_step => {
        if (sub_step.index === indexList[i]) {
          sub_step.relationship_touchpoints.push(touchpoint_index);
          found = true;
        }
        return found;
      });
      return found;
    });
  }
}
// -----------------------------------------------

const fileExists = fs.existsSync(fileToTransform);
if (!fileExists) {
  console.log('The file: ', fileToTransform, ', is required to continue.');
  exit(0);
}

const rawdata = fs.readFileSync(fileToTransform);
const configurationJSON = JSON.parse(rawdata);

const measureNames = [
  'Person-Count',
  'Process-Count',
  'Application-Performance',
  'FrontEnd-Performance',
  'Synthetics-Check',
  'Workload-Status',
  'Drops-Count',
  'API-Performance',
  'API-Count',
  'API-Status',
  'Facet-Call-Counts',
  'Queue',
  'External-Service-Performance',
  'API-Service-Performance',
  'Application-Status-Check',
  'Regular-Queue-Message',
  'Backout-Queue-Message',
  'Alert-Check'
];

let stageDef = null;
let sub_stepDef = null;
let stepDef = null;
let tpDef = null;
let tpDef2 = null;
let measure = null;
let tpIndex = 1;
let stageIndex = 1;
let substepIndex = 1;
const stages = [];
const touchPoints = [];
const kpis = [];
let query_timeout = 10;
touchPoints.push({
  index: 0,
  country: 'PRODUCTION',
  touchpoints: []
});
let ikpi = null;
let index = 0;
let queryByCity = null;
const accountId = 1;
configurationJSON.kpis.forEach(kpi => {
  ikpi = {
    index: index,
    type: kpi.type,
    name: kpi.name,
    shortName: kpi.shortName,
    value_type: kpi.value_type,
    prefix: kpi.prefix,
    suffix: kpi.suffix
  };
  if (kpi.measure[0].accountID !== accountId) {
    queryByCity = [
      {
        accountID: kpi.measure[0].accountID,
        query: kpi.measure[0].query,
        link: kpi.measure[0].link
      }
    ];
  } else {
    queryByCity = [
      {
        query: kpi.measure[0].query,
        link: kpi.measure[0].link
      }
    ];
  }
  ikpi = { ...ikpi, queryByCity: queryByCity };
  index++;
  if (kpi.type === 100) {
    ikpi = { ...ikpi, value: 0 };
  } else {
    ikpi = {
      ...ikpi,
      value: {
        current: 0,
        previous: 0
      }
    };
  }
  if (index < 4) {
    ikpi = { ...ikpi, check: true };
  } else {
    ikpi = { ...ikpi, check: false };
  }
  kpis.push(ikpi);
});
configurationJSON.stages.forEach(stage => {
  stageDef = {
    index: stageIndex,
    title: stage.title,
    type: Reflect.has(stage, 'type') ? stage.type : 'People',
    latencyStatus: false,
    status_color: 'good',
    gout_enable: false,
    gout_quantity: 150,
    gout_money: 250,
    money_enabled: false,
    trafficIconType: 'traffic',
    money: '',
    icon_active: false,
    icon_description: 'star',
    icon_visible: false,
    congestion: {
      value: 0,
      percentage: 0
    },
    capacity: 0,
    capacity_link: '',
    total_count: 0,
    active_dotted: stage.active_dotted,
    active_dotted_color: '#828282',
    arrowMode: stage.arrowMode,
    steps: [],
    touchpoints: []
  };
  substepIndex = 1;
  stage.steps.forEach(step => {
    stepDef = {
      value: '',
      sub_steps: []
    };
    step.values.forEach(sub_step => {
      sub_stepDef = {
        index: substepIndex,
        id: sub_step.id,
        canary_state: false,
        latency: true,
        value: sub_step.title,
        dark: false,
        history_error: false,
        dotted: false,
        highlighted: false,
        error: false,
        index_stage: stageIndex,
        relationship_touchpoints: []
      };
      stepDef.sub_steps.push(sub_stepDef);
      substepIndex++;
    });
    stageDef.steps.push(stepDef);
  });
  stage.touchpoints.forEach(tp => {
    tpDef = {
      index: tpIndex,
      stage_index: stageIndex,
      status_on_off: tp.status_on_off,
      response_error: false,
      show_grey_square: false,
      active: false,
      value: tp.title,
      highlighted: false,
      error: false,
      history_error: false,
      countrys: [0],
      dashboard_url: tp.dashboard_url,
      relation_steps: tp.related_steps.split(','),
      type: '',
      alertId: ''
    };
    tpDef2 = {
      stage_index: stageIndex,
      value: tp.title,
      touchpoint_index: tpIndex,
      status_on_off: tp.status_on_off,
      relation_steps: tp.related_steps.split(','),
      measure_points: []
    };
    tp.queries.forEach(query => {
      query_timeout = 10;
      if (query.query_timeout) {
        query_timeout = query.query_timeout;
      }
      if (query.type === measureNames[0] || query.type === 'PRC-COUNT-QUERY') {
        measure = {
          type: 'PRC',
          query: query.query,
          timeout: query_timeout,
          min_count: query.min_count,
          max_count: Reflect.has(query, 'max_count')
            ? query.max_count
            : query.min_count * 1.5,
          session_count: 0
        };
      } else if (
        query.type === measureNames[1] ||
        query.type === 'PCC-COUNT-QUERY'
      ) {
        measure = {
          type: 'PCC',
          query: query.query,
          timeout: query_timeout,
          min_count: query.min_count,
          max_count: Reflect.has(query, 'max_count')
            ? query.max_count
            : query.min_count * 1.5,
          transaction_count: 0
        };
      } else if (
        query.type === measureNames[2] ||
        query.type === 'APP-HEALTH-QUERY'
      ) {
        measure = {
          type: 'APP',
          query: query.query,
          timeout: query_timeout,
          min_apdex: query.min_apdex,
          max_response_time: query.max_response_time,
          max_error_percentage: query.max_error_percentage,
          apdex_value: 0,
          response_value: 0,
          error_percentage: 0
        };
      } else if (
        query.type === measureNames[3] ||
        query.type === 'FRT-HEALTH-QUERY'
      ) {
        measure = {
          type: 'FRT',
          query: query.query,
          timeout: query_timeout,
          min_apdex: query.min_apdex,
          max_response_time: query.max_response_time,
          max_error_percentage: query.max_error_percentage,
          apdex_value: 0,
          response_value: 0,
          error_percentage: 0
        };
      } else if (
        query.type === measureNames[4] ||
        query.type === 'SYN-CHECK-QUERY'
      ) {
        measure = {
          type: 'SYN',
          query: query.query,
          timeout: query_timeout,
          max_avg_response_time: query.max_avg_response_time,
          max_total_check_time: query.max_total_check_time,
          min_success_percentage: query.min_success_percentage,
          success_percentage: 0,
          max_duration: 0,
          max_request_time: 0
        };
      } else if (
        query.type === measureNames[5] ||
        query.type === 'WORKLOAD-QUERY'
      ) {
        measure = {
          type: 'WLD',
          query: query.query,
          timeout: query_timeout,
          status_value: 'NO-VALUE'
        };
      } else if (
        query.type === measureNames[6] ||
        query.type === 'DROP-QUERY'
      ) {
        measure = {
          type: 'DRP',
          query: query.query,
          timeout: query_timeout,
          value: 0
        };
      } else if (query.type === measureNames[7]) {
        measure = {
          type: 'API',
          query: query.query,
          timeout: query_timeout,
          min_apdex: query.min_apdex,
          max_response_time: query.max_response_time,
          max_error_percentage: query.max_error_percentage,
          apdex_value: 0,
          response_value: 0,
          error_percentage: 0
        };
      } else if (query.type === measureNames[8]) {
        measure = {
          type: 'APC',
          query: query.query,
          timeout: query_timeout,
          min_count: query.min_count,
          max_count: query.max_count,
          api_count: 0
        };
      } else if (query.type === measureNames[9]) {
        measure = {
          type: 'APS',
          query: query.query,
          timeout: query_timeout,
          min_success_percentage: query.min_success_percentage,
          success_percentage: 0
        };
      } else if (query.type === measureNames[10]) {
        measure = {
          type: 'FCC',
          query: query.query,
          timeout: query_timeout,
          facet_options: query.facet_options,
          total_count: 0,
          min_value: 0,
          min_count_by_facet: query.min_count_by_facet
        };
      } else if (query.type === measureNames[11]) {
        measure = {
          type: 'QUE',
          query: query.query,
          timeout: query_timeout,
          status_min: query.status_min,
          status_max: query.status_max,
          backout_min: query.backout_min,
          backout_max: query.backout_max,
          regular_min: query.regular_min,
          regular_max: query.regular_max,
          status_value: 0,
          backout_value: 0,
          regular_value: 0
        };
      } else if (query.type === measureNames[12]) {
        measure = {
          type: 'EXP',
          query: query.query,
          timeout: query_timeout,
          min_apdex: query.min_apdex,
          max_response_time: query.max_response_time,
          max_error_percentage: query.max_error_percentage,
          apdex_value: 0,
          response_value: 0,
          error_percentage: 0
        };
      } else if (query.type === measureNames[13]) {
        measure = {
          type: 'ASP',
          query: query.query,
          timeout: query_timeout,
          max_response_time: query.max_response_time,
          max_requests: query.max_requests,
          response_time: 0,
          total_requests: 0
        };
      } else if (query.type === measureNames[14]) {
        measure = {
          type: 'ASC',
          query: query.query,
          timeout: query_timeout,
          min_percentage: query.min_percentage,
          found_error: 0
        };
      } else if (query.type === measureNames[15]) {
        measure = {
          type: 'RQM',
          query: query.query,
          timeout: query_timeout,
          max_threshold: query.max_threshold,
          min_threshold: query.min_threshold,
          found_error: 0
        };
      } else if (query.type === measureNames[16]) {
        measure = {
          type: 'BQM',
          query: query.query,
          timeout: query_timeout,
          max_threshold: query.max_threshold,
          found_error: 0
        };
      } else if (query.type === measureNames[17]) {
        // Alert-Check
        measure = {
          type: 'ALE',
          query: query.query,
          timeout: query_timeout,
          alertConditionId: query.alertConditionId,
          priority: query.priority,
          state: query.state,
          createdAt: 0,
          totalIncidents: 0,
          title: ''
        };
      }
      if (query.accountID !== accountId) {
        measure = { accountID: query.accountID, ...measure };
      }
      measure = { ...measure, measure_time: query.measure_time };
      tpDef2.measure_points.push(measure);
    });
    stageDef.touchpoints.push(tpDef);
    touchPoints[0].touchpoints.push(tpDef2);
    tpIndex++;
  });
  stages.push(stageDef);
  stageIndex++;
  tpIndex = 1;
});
UpdateTouchpointsRelationship(touchPoints, stages);
const viewJson = {
  colors: {
    background_capacity: [19, 72, 104],
    stage_capacity: [255, 255, 255],
    status_color: {
      danger: 1,
      warning: 2,
      good: 3
    },
    steps_touchpoints: [
      {
        select_color: [18, 167, 255],
        unselect_color: [189, 189, 189],
        error_color: [255, 76, 76],
        dark: [51, 51, 51],
        good: [10, 175, 119]
      }
    ]
  },
  alertsRefreshDelay: configurationJSON.alertsRefreshDelay,
  alertsTimeWindow: configurationJSON.alertsTimeWindow,
  canary_status: false,
  kpis: kpis,
  stages: stages
};
const viewJsonFile = JSON.stringify(viewJson, null, 2);
fs.writeFile(
  '../nerdlets/pathpoint-nerdlet/config/view.json',
  viewJsonFile,
  function(err) {
    if (err) return console.log(err);
    console.log('view.json file created');
  }
);
const touchpoints = JSON.stringify(touchPoints, null, 2);
fs.writeFile(
  '../nerdlets/pathpoint-nerdlet/config/touchPoints.json',
  touchpoints,
  function(err) {
    if (err) return console.log(err);
    console.log('touchPoints.json file created');
  }
);
