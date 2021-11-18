/* eslint-disable prefer-template */
/* eslint-disable prettier/prettier */
// Insert API Credentials
const myAccountID = 1606862;
const graphQLKey = 'NRAK-JT2K33ZJ9QPB2LFIPJ222D0MPFG';
const myInsertKey = '4358371303b443fa593950545136442e7e7008c4';
const touchpoints = [
  [
    {
      stage_index: 1,
      touchpoint_index: 1,
      type: 'PRC',
      timeout: 10,
      query: "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
      min_count: 10,
      measure_time: '15 minutes ago'
    },
    {
      stage_index: 1,
      touchpoint_index: 2,
      type: 'APP',
      timeout: 10,
      query: "SELECT filter(apdex(duration, t:0.028), WHERE 1=1) as apdex, filter( max(duration), WHERE 1=1) as response,filter(percentage(count(*), WHERE error is true), WHERE 1=1) as error from Transaction",
      min_apdex: 0.4,
      max_response_time: 0.5,
      max_error_percentage: 5,
      measure_time: '5 minutes ago'
    }
  ],
  [
    {
      stage_index: 1,
      touchpoint_index: 3,
      type: 'FRT',
      timeout: 10,
      query: "SELECT filter(apdex(duration, t:1), WHERE 1=1) as apdex, filter( max(duration), WHERE 1=1) as response,filter(percentage(count(*), WHERE error is true), WHERE 1=1) as error from PageView",
      min_apdex: 0.6,
      max_response_time: 1.2,
      max_error_percentage: 5,
      measure_time: '5 minutes ago'
    },
    {
      stage_index: 1,
      touchpoint_index: 4,
      type: 'SYN',
      timeout: 10,
      query: "SELECT filter(percentage(count(result),WHERE result='SUCCESS'),WHERE 1=1) as success, max(duration) as duration, max(longRunningTasksAvgTime) as request from SyntheticCheck,SyntheticRequest WHERE monitorName='Register Account'",
      max_avg_response_time: 0.7,
      max_total_check_time: 1.25,
      min_success_percentage: 98,
      measure_time: '3 hours ago'
    }
  ]
];

function GetTouchpoint(stage_index,touchpoint_index){
  let touchpoint = null;
  touchpoints.some( tp =>{
    let found = false;
    console.log('TP:',tp.stage_index,tp.touchpoint_index);
    if (tp.stage_index === stage_index && tp.touchpoint_index === touchpoint_index) {
      console.log('Encontre_el_TP:',stage_index,touchpoint_index)
      touchpoint = tp;
      found = true;
    }
    return found;
  });
  return touchpoint;
}

GetTouchpoint(1,1);

