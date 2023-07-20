import { NerdGraphQuery } from 'nr1';

export default class AlertIssues {
  constructor() {
    this.refreshDalay = 1; // value in seconds = 5 min
    this.timeWindow = 5; // time window por default de 5 min
    this.readyToMeasure = true;
    this.accountId = null;
    this.measureStartTime = 0;
    this.measureEndTime = 0;
    this.AlertTouchpoints = [];
    this.lastStagesStatus = null;
    this.SetTimeWindow(true);
    setTimeout(() => {
      this.PrepareToMeasure();
    }, this.refreshDalay * 1000 * 60);
  }

  PrepareToMeasure() {
    console.log('READY-TO-MEASURE-SET');
    this.readyToMeasure = true;
    setTimeout(() => {
      this.PrepareToMeasure();
    }, this.refreshDalay * 1000 * 60);
  }

  SetAccountId(accountId) {
    this.accountId = accountId;
  }

  SetStateFilter() {
    let states = '';
    this.AlertTouchpoints.forEach(tp => {
      tp.measure_points[0].state.forEach(st => {
        if (!states.includes(st)) {
          states += `--${st}--`;
        }
      });
    });
    console.log('STATES:', states);
    const statesCount = states.split('--');
    if (statesCount.length === 3) {
      return `states: ${statesCount[1]}`;
    }
    return '';
  }

  SetPriorityFilter() {
    let priorities = '';
    this.AlertTouchpoints.forEach(tp => {
      tp.measure_points[0].priority.forEach(pr => {
        if (!priorities.includes(pr)) {
          priorities += `--${pr}--`;
        }
      });
    });
    console.log('PRIORITIES:', priorities);
    const prioritiesCount = priorities.split('--');
    console.log('prioritiesCount', prioritiesCount.length)
    if (prioritiesCount.length === 3) {
      return `priority: "${prioritiesCount[1]}"`;
    }
    return '';
  }

  SetFilters() {
    const stateFilter = this.SetStateFilter();
    const priorityFilter = this.SetPriorityFilter();
    if (stateFilter !== '' && priorityFilter !== '') {
      return `filter: {${stateFilter}, ${priorityFilter}}`;
    }
    if (stateFilter !== '') {
      return `filter: {${stateFilter}}`;
    }
    if (priorityFilter !== '') {
      return `filter: {${priorityFilter}}`;
    }
    return '';
  }

  SetTimeWindow(resetTimeWindow) {
    const _now_as_miliseconds = Math.floor(Date.now());
    const time_start = _now_as_miliseconds - this.timeWindow * 60 * 1000;
    const time_end = _now_as_miliseconds;
    if (resetTimeWindow) {
      this.measureStartTime = time_start;
      this.measureEndTime = time_end;
    }
    return `timeWindow: { endTime: ${this.measureEndTime}, startTime: ${this.measureStartTime}}`;
  }

  SetGQL(cursor, resetTimeWindow) {
    console.log('TIME WINDOW:', this.SetTimeWindow(resetTimeWindow));
    const filter = this.SetFilters() === '' ? '' : `${this.SetFilters()}, `;
    return `{
      actor {
        account(id: ${this.accountId}) {
          aiIssues {
            issues(${filter}${this.SetTimeWindow(resetTimeWindow)}, cursor: "${cursor}") {
              issues {
                createdAt
                state
                priority
                totalIncidents
                conditionFamilyId
                issueId
                incidentIds
                conditionName
                activatedAt
                closedAt
              }
              nextCursor
            }
          }
        }
      }
    }`;
  }

  async NerdGraphGetIssues() {
    let cursor = '';
    let resetTimeWindow = true;
    let gql = this.SetGQL(cursor, resetTimeWindow);
    // console.log('GQL:', gql);
    resetTimeWindow = false;
    const issuesList = [];
    while (cursor !== null) {
      const { data, error } = await NerdGraphQuery.query({
        query: gql
      }).catch(errors => {
        console.log('ALERTS-GQL-ERROR:', errors);
        return { error: { errors: [errors] } };
      });
      if (data && data.actor) {
        cursor = data.actor.account.aiIssues.issues.nextCursor;
        data.actor.account.aiIssues.issues.issues.forEach(element => {
          if (element.conditionFamilyId) {
            issuesList.push(element);
          }
        });
      } else {
        cursor = null;
      }
      if (error && error.length > 0) {
        console.log('ERROR-LIST:', error);
      }
      if (cursor) {
        gql = this.SetGQL(cursor, resetTimeWindow);
      }
    }
    const NewIssuesList = await this.GetAdditionalDetails(issuesList);
    // console.log('ISSUES-LIST:', NewIssuesList);
    return NewIssuesList;
  }

  async GetAdditionalDetails(issuesList) {
    const CompleteIssues = [];
    for (let x = 0; x < issuesList.length; x++) {
      let issueLink = '';
      let issueName = '';
      let n = 1;
      let alias = '';
      let gql = `{
        actor {
          account(id: ${this.accountId}) {
            nrql(timeout: 20, query: "SELECT title,issueLink FROM NrAiIssue where issueId='${issuesList[x].issueId}' since 15 days ago LIMIT 1") {
              results
            }
          }
        }
      }`;
      // console.log('GGGQL:', gql);
      const { data, error } = await NerdGraphQuery.query({
        query: gql
      }).catch(errors => {
        console.log('ISSUES-GQL-ERROR:', errors);
        return { error: { errors: [errors] } };
      });
      // console.log('DATA:', data);
      if (data && data.actor && data.actor.account.nrql.results.length > 0) {
        issueLink = data.actor.account.nrql.results[0].issueLink;
        issueName = data.actor.account.nrql.results[0].title;
      }
      const totalIncidents =
        issuesList[x].totalIncidents > 40 ? 40 : issuesList[x].totalIncidents;
      gql = `{
          actor {`;
      for (let ix = 0; ix < totalIncidents; ix++) {
        alias = `measure_${n}`;
        n += 1;
        gql += `${alias}: account(id: ${this.accountId}) {
          nrql(timeout: 20, query: "SELECT incidentId,incidentLink,title,priority,closeTime,openTime,event FROM NrAiIncident where incidentId='${issuesList[x].incidentIds[ix]}' SINCE 15 days ago LIMIT 1") {
            results
              }
          }`;
      }
      gql += `}}`;
      // console.log('AA-GQL:', gql);
      const incidents = [];
      if (totalIncidents > 0) {
        const { data, error } = await NerdGraphQuery.query({
          query: gql
        }).catch(errors => {
          return { error: { errors: [errors] } };
        });
        // console.log('DATA2:', data, 'ERRROR:', error);
        if (data && data.actor) {
          for (const [key, value] of Object.entries(data.actor)) {
            if (value.nrql && value.nrql.results) {
              incidents.push({
                incidentId: value.nrql.results[0].incidentId,
                incidentLink: value.nrql.results[0].incidentLink,
                incidentName: value.nrql.results[0].title,
                priority: value.nrql.results[0].priority,
                state: value.nrql.results[0].event,
                createdTime: this.GetIncidentTime(value.nrql.results[0])
              });
            }
          }
        }
      }
      CompleteIssues.push({
        ...issuesList[x],
        issueLink,
        issueName,
        incidents
      });
    }
    return CompleteIssues;
  }

  GetIncidentTime(data) {
    const time = data.event === 'close' ? data.closeTime : data.openTime;
    const fecha1 = new Date(time).getTime();
    const fecha2 = new Date().getTime();
    const minutes = Math.floor((fecha2 - fecha1) / 60000);
    return `${minutes}m ago`;
  }

  GetTouchpointByAlertId(alertId) {
    let result = null;
    this.AlertTouchpoints.some(tp => {
      let found = false;
      tp.measure_points[0].alertConditionId.some(id => {
        let found2 = false;
        if (id === alertId) {
          found2 = true;
          result = tp;
          found = true;
        }
        return found2;
      });
      return found;
    });
    return result;
  }

  FindAlertTrigger(issue, stages) {
    issue.conditionFamilyId.some(alertId => {
      let found = false;
      const touchpoint = this.GetTouchpointByAlertId(alertId);
      if (touchpoint) {
        found = true;
        stages = this.SetTouchpointError(touchpoint, stages, alertId, issue);
      }
      return found;
    });
    return stages;
  }

  CheckIssues(stages, issuesList) {
    issuesList.forEach(issue => {
      stages = this.FindAlertTrigger(issue, stages);
    });
    return stages;
  }

  GetAlertTouchpoints(touchpoints) {
    const alertTp = [];
    touchpoints[0].touchpoints.forEach(tp => {
      if (tp.measure_points[0].type === 'ALE') {
        alertTp.push(tp);
      }
    });
    return alertTp;
  }

  SetStatus(stages, stage_index, touchpoint_index, setStatus, alertId, issue) {
    const stage = stages.find(item => item.index === stage_index);
    if (stage) {
      const tp = stage.touchpoints.find(
        item => item.index === touchpoint_index
      );
      // console.log('ISSUE:', issue);
      if (alertId === '') {
        tp.alertId = '';
      } else if (tp.alertId !== '' && !tp.alertId.includes(alertId)) {
        tp.alertId = `${tp.alertId}|${alertId}`;
      } else {
        tp.alertId = `${alertId}`;
      }
      tp.type = 'ALE';
      tp.show_grey_square = false;
      tp.error = setStatus;
      tp.response_error = false;
      if (setStatus) {
        tp.issues.push(issue);
        // SET STEPS RELATED TO THIS TOUCHPOINT WITH ERROR
        stage.steps.forEach(step => {
          step.sub_steps.forEach(sub_step => {
            sub_step.relationship_touchpoints.forEach(value => {
              if (value === touchpoint_index) {
                sub_step.error = true;
              }
            });
          });
        });
      } else {
        tp.issues = [];
        console.log(`TP:${tp.value} CLEAR ISSUES`);
      }
    }
    return stages;
  }

  SetTouchpointError(touchpoint, stages, alertId, issue) {
    return this.SetStatus(
      stages,
      touchpoint.stage_index,
      touchpoint.touchpoint_index,
      true,
      alertId,
      issue
    );
  }

  SetGreenAllAlertsTouchpoints(stages) {
    this.AlertTouchpoints.forEach(tp => {
      stages = this.SetStatus(
        stages,
        tp.stage_index,
        tp.touchpoint_index,
        false,
        '',
        null
      );
    });
    return stages;
  }

  ClearLastStagesStatus() {
    this.lastStagesStatus = null;
    this.readyToMeasure = true;
  }

  async Measure(stages, touchpoints, alertsTimeWindow, alertsRefreshDelay) {
    console.log('MEASURE: refreshTime:', alertsRefreshDelay);
    this.AlertTouchpoints = this.GetAlertTouchpoints(touchpoints);
    // console.log('AlertTouchpoints:', this.AlertTouchpoints);
    this.timeWindow = alertsTimeWindow;
    this.refreshDalay = alertsRefreshDelay;
    if (this.lastStagesStatus) {
      stages = JSON.parse(JSON.stringify(this.lastStagesStatus));
    }
    if (this.accountId === null) {
      return stages;
    }
    if (!this.readyToMeasure) {
      return stages;
    }
    this.readyToMeasure = false;
    if (this.AlertTouchpoints.length === 0) {
      return stages;
    }
    this.measureResults = await this.NerdGraphGetIssues();
    // TODO Que se hace con los datos leidos
    stages = this.SetGreenAllAlertsTouchpoints(stages);
    stages = this.CheckIssues(stages, this.measureResults);
    stages = this.LoadIssuesDetails(stages);
    this.lastStagesStatus = JSON.parse(JSON.stringify(stages));
    console.log('StageDATA:', stages);
    // console.log('MaxTime:', this.getMaxTime(this.measureResults));
    // console.log('MinTime:', this.getMinTime(this.measureResults));
    return stages;
  }

  LoadIssuesDetails(stages) {
    stages.forEach(stage => {
      stage.touchpoints.forEach(tp => {
        if (tp.type === 'ALE') {
          tp.data = this.InsertDataToIssues(tp);
        }
      });
    });
    return stages;
  }

  InsertDataToIssues(tp) {
    const data = {
      name: tp.value,
      totalIssues: tp.issues.length,
      totalIncidents: this.GetTotalIncidentes(tp.issues),
      alerts: []
    };
    // get All Condition IDs
    let conditions = '';
    tp.issues.forEach(issue => {
      const totalConditions = issue.conditionFamilyId.length;
      for (let condIndex = 0; condIndex < totalConditions; condIndex++) {
        if (
          conditions.search(String(issue.conditionFamilyId[condIndex])) === -1
        ) {
          conditions += `-${String(issue.conditionFamilyId[condIndex])}-`;
          data.alerts.push({
            conditionName: issue.conditionName[condIndex],
            conditionId: issue.conditionFamilyId[condIndex],
            issues: []
          });
        }
      }
    });
    // Loading ISSUES by conditionId
    data.alerts.forEach(alert => {
      tp.issues.forEach(issue => {
        // console.log('XXXX-ISSUE:',issue.issueName)
        if (issue.conditionFamilyId.find(item => item === alert.conditionId)) {
          alert.issues.push({
            priority: issue.priority,
            activatedDate: this.GetActivatedDate(issue),
            activatedTime: this.GetActivatedTime(issue),
            status: issue.state,
            issueName: issue.issueName,
            issueId: issue.issueId,
            issueLink: issue.issueLink,
            incidents: issue.incidents
          });
        }
      });
    });
    return data;
  }

  GetActivatedDate(issue) {
    const time = issue.activatedAt ? issue.activatedAt : issue.createdAt;
    const fecha = new Date(time).toLocaleString().split(',')[0];
    return fecha;
  }

  GetActivatedTime(issue) {
    const time = issue.activatedAt ? issue.activatedAt : issue.createdAt;
    const fecha1 = new Date(time).getTime();
    const fecha2 = new Date().getTime();
    const minutes = Math.floor((fecha2 - fecha1) / 60000);
    return `${minutes}m`;
  }

  GetTotalIncidentes(issues) {
    let total = 0;
    issues.forEach(issue => {
      total += issue.totalIncidents;
    });
    return total;
  }

  getMaxTime(data) {
    let time = 0;
    data.forEach(e => {
      if (e.createdAt > time) {
        time = e.createdAt;
      }
    });
    return time;
  }

  getMinTime(data) {
    let time = 9999999999990;
    data.forEach(e => {
      if (e.createdAt < time) {
        time = e.createdAt;
      }
    });
    return time;
  }
}
