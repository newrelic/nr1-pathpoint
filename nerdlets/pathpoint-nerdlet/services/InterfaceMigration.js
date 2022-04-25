// INTERFACE MIGRATION CLASS
export default class InterfaceMigration {
  constructor(accountId) {
    this.accountId = accountId;
  }

  MigrateStagesInterface(stagesInterface, data) {
    const stages = [];
    let stageIndex = 1;
    let lineStep = 1;
    let stepOrder = 1;
    stagesInterface.forEach(stage => {
      if (stage.visible) {
        const steps = [];
        stage.steps.forEach(step => {
          if (step.visible) {
            const ss_values = [];
            step.sub_steps.forEach(sub_step => {
              ss_values.push({
                title: sub_step.value,
                id: `ST${stageIndex}-LINE${lineStep}-SS${stepOrder}`
              });
              stepOrder++;
            });
            steps.push({
              line: lineStep,
              values: ss_values
            });
            lineStep++;
            stepOrder = 1;
          }
        });
        const touchpoints = this.GetStageTouchpoints(steps, stage.touchpoints);
        stages.push({
          title: stage.title,
          type: stage.type,
          active_dotted: 'none',
          arrowMode: 'FLOW',
          steps: steps,
          touchpoints: touchpoints
        });
        stageIndex++;
        lineStep = 1;
      }
    });
    data.stages = [...stages];
    return data;
  }

  GetStageTouchpoints(steps, gui_touchpoints) {
    const touchpoints = [];
    gui_touchpoints.forEach(tp => {
      if (tp.visible) {
        touchpoints.push({
          title: tp.title,
          status_on_off: tp.status_on_off,
          dashboard_url: this.SetDashboard_url(tp.dashboard_url),
          related_steps: this.SetRelatedSteps(tp.subs, steps),
          queries: this.SetTouchpointQueries(tp.queryData)
        });
      }
    });
    return touchpoints;
  }

  SetDashboard_url(url) {
    if (url === '') {
      return false;
    }
    return [url];
  }

  SetRelatedSteps(subs, steps) {
    let relatedSteps = '';
    subs.forEach(sub => {
      steps.some(step => {
        let found = false;
        step.values.some(step_entry => {
          let found2 = false;
          if (sub === step_entry.title) {
            found = true;
            found2 = true;
            if (relatedSteps !== '') {
              relatedSteps += ',';
            }
            relatedSteps += step_entry.id;
          }
          return found2;
        });
        return found;
      });
    });
    return relatedSteps;
  }

  SetTouchpointQueries(queryData) {
    let qdata = {
      type: queryData.type,
      accountID: Number(queryData.accountID),
      query: queryData.query,
      query_timeout: Number(queryData.query_timeout),
      measure_time: queryData.measure_time
    };
    switch (queryData.type) {
      case 'Person-Count':
      case 'Process-Count':
      case 'API-Count':
        qdata = {
          ...qdata,
          min_count: Number(queryData.min_count),
          max_count: Number(queryData.max_count)
        };
        break;
      case 'Application-Performance':
      case 'FrontEnd-Performance':
      case 'API-Performance':
        qdata = {
          ...qdata,
          min_apdex: Number(queryData.min_apdex),
          max_response_time: Number(queryData.max_response_time),
          max_error_percentage: Number(queryData.max_error_percentage)
        };
        break;
      case 'Synthetics-Check':
        qdata = {
          ...qdata,
          max_avg_response_time: Number(queryData.max_avg_response_time),
          max_total_check_time: Number(queryData.max_total_check_time),
          min_success_percentage: Number(queryData.min_success_percentage)
        };
        break;
      case 'API-Status':
        qdata = {
          ...qdata,
          min_success_percentage: Number(queryData.min_success_percentage)
        };
        break;
    }
    return [qdata];
  }
}
