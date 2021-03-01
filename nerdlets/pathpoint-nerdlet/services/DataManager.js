// IMPORT LIBRARIES DEPENDENCIES
import NerdletData from '../../../nr1.json';
import TouchPoints from '../config/touchPoints.json';
import Capacity from '../config/capacity.json';
import Canary from '../config/canary_states.json';
import ViewData from '../config/view.json';
import appPackage from '../../../package.json';
import { historicErrorScript } from '../../../synthetics/createHistoricErrorScript';
import {
  AccountStorageMutation,
  AccountsQuery,
  AccountStorageQuery,
  NerdGraphQuery
} from 'nr1';

// DEFINE AND EXPORT CLASS
export default class DataManager {
  constructor() {
    this.minPercentageError = 100;
    this.historicErrorsDays = 8;
    this.historicErrorsHighLightPercentage = 26;
    this.version = null;
    this.accountId = null;
    this.graphQlmeasures = [];
    this.touchPointsCopy = null;
    this.city = 0;
    this.capacityUpdatePending = false;
    this.pathpointId = NerdletData.id;
    this.capacity = Capacity;
    this.touchPoints = TouchPoints;
    this.stages = [];
    this.lastStorageVersion = null;
    this.stepsByStage = [];
    this.dataCanary = Canary;
    this.configuration = {
      pathpointVersion: null,
      banner_kpis: [],
      stages: []
    };
    this.measureNames = [
      'STANDARD-APM-COUNT-AND',
      'ERROR-PERCENTAGE-QUERY',
      'APDEX-QUERY',
      'UNIQUE-SESSIONS-COUNT-QUERY',
      'COUNT-SESSIONS-FACET-QUERY',
      'FULL-OPEN-QUERY'
    ];
  }

  async BootstrapInitialData() {
    await this.GetAccountId();
    await this.CheckVersion();
    await this.GetCanaryData();
    this.version = appPackage.version;
    if (this.lastStorageVersion === appPackage.version) {
      this.colors = ViewData.colors;
      await this.GetInitialDataFromStorage();
      this.GetStorageTouchpoints();
    } else {
      this.stages = ViewData.stages;
      this.banner_kpis = ViewData.banner_kpis;
      this.colors = ViewData.colors;
      this.SetInitialDataViewToStorage();
      this.SetStorageTouchpoints();
      this.SetVersion();
    }
    this.stepsByStage = this.GetStepsByStage();
    return {
      stages: [...this.stages],
      banner_kpis: [...this.banner_kpis],
      colors: this.colors,
      accountId: this.accountId,
      version: this.version
    };
  }

  async GetAccountId() {
    try {
      const { data } = await AccountsQuery.query();
      this.accountId = data[0].id;
    } catch (error) {
      throw new Error(error);
    }
  }

  async CheckVersion() {
    try {
      const { data } = await AccountStorageQuery.query({
        accountId: this.accountId,
        collection: 'pathpoint',
        documentId: 'version'
      });
      if (data) {
        this.lastStorageVersion = data.Version;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async GetInitialDataFromStorage() {
    try {
      const { data } = await AccountStorageQuery.query({
        accountId: this.accountId,
        collection: 'pathpoint',
        documentId: 'newViewJSON'
      });
      if (data) {
        this.stages = data.ViewJSON;
        this.banner_kpis = data.BannerKpis;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  SetInitialDataViewToStorage() {
    try {
      AccountStorageMutation.mutate({
        accountId: this.accountId,
        actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection: 'pathpoint',
        documentId: 'newViewJSON',
        document: {
          ViewJSON: this.stages,
          BannerKpis: this.banner_kpis
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  GetStepsByStage() {
    const reply = [];
    let idx = 0;
    this.stages.forEach(stage => {
      idx = stage.steps[stage.steps.length - 1].sub_steps.length - 1;
      reply.push(stage.steps[stage.steps.length - 1].sub_steps[idx].index);
    });
    return reply;
  }

  async GetCanaryData() {
    try {
      const { data } = AccountStorageQuery.query({
        accountId: this.accountId,
        collection: 'pathpoint',
        documentId: 'dataCanary'
      });
      if (data) {
        this.dataCanary = data.dataCanary;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  SaveCanaryData(data) {
    try {
      AccountStorageMutation.mutate({
        accountId: this.accountId,
        actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection: 'pathpoint',
        documentId: 'dataCanary',
        document: {
          dataCanary: data
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async UpdateData(timeRange, city, getOldSessions, stages, banner_kpis) {
    if (this.accountId !== null) {
      this.timeRange = timeRange;
      this.city = city;
      this.getOldSessions = getOldSessions;
      this.stages = stages;
      this.banner_kpis = banner_kpis;
      await this.TouchPointsUpdate();
      await this.UpdateMerchatKpi();
      await this.CalculateUpdates();
      await this.UpdateMaxCapacity();
      return {
        stages: this.stages,
        banner_kpis: this.banner_kpis
      };
    }
  }

  async TouchPointsUpdate() {
    this.graphQlmeasures.length = 0;
    this.touchPoints.forEach(element => {
      if (element.index === this.city) {
        element.touchpoints.forEach(touchpoint => {
          if (touchpoint.status_on_off) {
            touchpoint.measure_points.forEach(measure => {
              this.FetchMeasure(measure);
            });
          }
        });
      }
    });
    if (this.graphQlmeasures.length > 0) {
      await this.NRDBQuery();
    }
  }

  FetchMeasure(measure) {
    if (measure.type === 0) {
      const query = `${measure.query} SINCE ${this.TimeRangeTransform(
        this.timeRange,
        false
      )}`;
      this.graphQlmeasures.push([measure, query]);
    } else if (measure.type === 1) {
      const query = `${measure.query} SINCE ${this.TimeRangeTransform(
        this.timeRange,
        false
      )}`;
      this.graphQlmeasures.push([measure, query]);
    } else if (measure.type === 2) {
      const query = `${measure.query} SINCE ${this.TimeRangeTransform(
        this.timeRange,
        false
      )}`;
      this.graphQlmeasures.push([measure, query]);
    } else if (measure.type === 3 && measure.query !== '') {
      const query = `${measure.query} SINCE ${this.TimeRangeTransform(
        this.timeRange,
        false
      )}`;
      this.graphQlmeasures.push([measure, query]);
    } else if (measure.type === 4 && measure.query !== '') {
      const query = `${measure.query} SINCE ${this.TimeRangeTransform(
        this.timeRange,
        true
      )}`;
      this.graphQlmeasures.push([measure, query]);
    } else if (measure.type === 20) {
      const query = `${measure.query} SINCE ${this.TimeRangeTransform(
        this.timeRange,
        false
      )}`;
      this.graphQlmeasures.push([measure, query]);
    }
  }

  TimeRangeTransform(timeRange, sessionsRange) {
    let time_start = 0;
    let time_end = 0;
    if (timeRange === '5 MINUTES AGO') {
      if (sessionsRange && this.getOldSessions) {
        time_start = Math.floor(Date.now() / 1000) - 10 * 59;
        time_end = Math.floor(Date.now() / 1000) - 5 * 58;
        return `${time_start} UNTIL ${time_end}`;
      }
      return timeRange;
    }
    switch (timeRange) {
      case '30 MINUTES AGO':
        time_start = Math.floor(Date.now() / 1000) - 40 * 60;
        time_end = Math.floor(Date.now() / 1000) - 30 * 60;
        break;
      case '60 MINUTES AGO':
        time_start = Math.floor(Date.now() / 1000) - 70 * 60;
        time_end = Math.floor(Date.now() / 1000) - 60 * 60;
        break;
      case '3 HOURS AGO':
        time_start = Math.floor(Date.now() / 1000) - 3 * 60 * 60 - 10 * 60;
        time_end = Math.floor(Date.now() / 1000) - 3 * 60 * 60;
        break;
      case '6 HOURS AGO':
        time_start = Math.floor(Date.now() / 1000) - 6 * 60 * 60 - 10 * 60;
        time_end = Math.floor(Date.now() / 1000) - 6 * 60 * 60;
        break;
      case '12 HOURS AGO':
        time_start = Math.floor(Date.now() / 1000) - 12 * 60 * 60 - 10 * 60;
        time_end = Math.floor(Date.now() / 1000) - 12 * 60 * 60;
        break;
      case '24 HOURS AGO':
        time_start = Math.floor(Date.now() / 1000) - 24 * 60 * 60 - 10 * 60;
        time_end = Math.floor(Date.now() / 1000) - 24 * 60 * 60;
        break;
      case '3 DAYS AGO':
        time_start = Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60 - 10 * 60;
        time_end = Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60;
        break;
      case '7 DAYS AGO':
        time_start = Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60 - 10 * 60;
        time_end = Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60;
        break;
      default:
        return timeRange;
    }
    if (sessionsRange && this.getOldSessions) {
      time_start = time_start - 10 * 59;
      time_end = time_end - 5 * 58;
    }
    return `${time_start} UNTIL ${time_end}`;
  }

  async NRDBQuery() {
    const { data, errors, n } = await this.EvaluateMeasures();
    if (n === 0) {
      return 0;
    }
    if (errors && errors.length > 0) {
      // TO DO
    }
    for (const [key, value] of Object.entries(data.actor)) {
      const c = key.split('_');
      if (c[0] === 'measure') {
        const measure = this.graphQlmeasures[Number(c[1])][0];
        if (measure.type === 0 && value.nrql !== null) {
          measure.count = value.nrql.results[0].count;
        } else if (measure.type === 1 && value.nrql !== null) {
          measure.error_percentage =
            value.nrql.results[0].percentage == null
              ? 0
              : value.nrql.results[0].percentage;
        } else if (measure.type === 2 && value.nrql !== null) {
          measure.apdex = value.nrql.results[0].score;
        } else if (measure.type === 3 && value.nrql !== null) {
          measure.count = value.nrql.results[0].session;
        } else if (measure.type === 4 && value.nrql !== null) {
          this.SetSessions(measure, value.nrql.results);
        } else if (measure.type === 20 && value.nrql !== null) {
          this.SetLogsMeasure(measure, value.nrql.results[0]);
        } else if (measure.type === 100 && value.nrql != null) {
          measure.value = value.nrql.results[0].value;
        }
      }
    }
  }

  async EvaluateMeasures() {
    let gql = `{
     actor {`;
    let alias = '';
    let n = 0;
    const itemsByPage = 60;
    if (this.graphQlmeasures.length > itemsByPage) {
      const dataReturn = {
        actor: {}
      };
      const errorsReturn = [];
      let control = 0;
      const pages = Math.ceil(this.graphQlmeasures.length / itemsByPage);
      for (let i = 0; i < pages; i++) {
        const dataSplit = this.graphQlmeasures.slice(
          control,
          control + itemsByPage
        );
        dataSplit.forEach(nrql => {
          alias = `measure_${n}`;
          n += 1;
          gql += `${alias}: account(id: ${this.accountId}) {
              nrql(query: "${nrql[1]}", timeout: 10) {
                  results
              }
          }`;
        });
        gql += `}}`;
        const { data, errors } = await NerdGraphQuery.query({ query: gql });
        dataReturn.actor = Object.assign(dataReturn.actor, data.actor);
        if (errors && errors.length > 0) errorsReturn.push(errors);
        gql = `{
            actor {`;
        alias = '';
        control += itemsByPage;
      }
      return {
        data: dataReturn, n, errors: errorsReturn
      }
    } else {
      this.graphQlmeasures.forEach(nrql => {
        alias = 'measure_' + n;
        n += 1;
        gql += `${alias}: account(id: ${this.accountId}) {
            nrql(query: "${nrql[1]}", timeout: 10) {
                results
            }
        }`;
      });
      gql += `}}`;
      const { data, errors } = await NerdGraphQuery.query({ query: gql });
      return { data, n, errors };
    }
  }

  SetSessions(measure, sessions) {
    const new_sessions = [];
    sessions.forEach(session => {
      new_sessions.push({
        id: session.facet,
        time: this.SetSessionTime(measure.sessions, session.facet)
      });
    });
    measure.sessions = new_sessions;
  }

  SetSessionTime(measure_sessions, sessionID) {
    let session_time = Math.floor(Date.now() / 1000);
    if (this.getOldSessions) {
      session_time = session_time - 5 * 58;
    }
    measure_sessions.some(m_sess => {
      let found = false;
      if (m_sess.id === sessionID) {
        session_time = m_sess.time;
        found = true;
      }
      return found;
    });
    return session_time;
  }

  SetLogsMeasure(measure, results) {
    const total = results.R1 + results.R2;
    measure.count = results.R1;
    if (total === 0) {
      measure.error_percentage = 0;
    } else {
      measure.error_percentage = Math.round((results.R2 / total) * 10000) / 100;
    }
  }

  async UpdateMerchatKpi() {
    this.graphQlmeasures.length = 0;
    for (let i = 0; i < this.banner_kpis.length; i++) {
      this.graphQlmeasures.push([
        this.banner_kpis[i],
        this.banner_kpis[i].query
      ]);
    }
    await this.NRDBQuery();
  }

  CalculateUpdates() {
    this.ClearTouchpointError();
    this.touchPoints.forEach(element => {
      if (element.index === this.city) {
        this.CountryCalculateUpdates(element);
      }
    });
  }

  ClearTouchpointError() {
    for (let i = 0; i < this.stages.length; i++) {
      this.stages[i].touchpoints.forEach(touchpoint => {
        touchpoint.error = false;
      });
      this.stages[i].steps.forEach(step => {
        step.sub_steps.forEach(sub_step => {
          sub_step.error = false;
        });
      });
    }
  }

  CountryCalculateUpdates(element) {
    const values = this.Getmeasures(element);
    let totalUse = values.total_count;
    totalUse = totalUse === 0 ? 1 : totalUse;
    for (let i = 0; i < this.stages.length; i++) {
      this.stages[i].status_color = 'good';
      this.stages[i].status_color = this.UpdateErrorCondition(
        this.stages[i].status_color,
        this.GetStageError(i + 1, element)
      );
      this.stages[i].total_count = values.count_by_stage[i];
      this.stages[i].congestion.value =
        Math.round((values.count_by_stage[i] / totalUse) * 10000) / 100;
      this.stages[i].capacity =
        (values.count_by_stage[i] /
          this.CheckMaxCapacity(values.count_by_stage[i], i)) *
        100;
      this.stages[i].congestion.percentage =
        (1 - values.apdex_by_stage[i]) * 100;
      if (values.sessions_by_stage[i] !== 0) {
        this.stages[i].trafficIconType = 'people';
        this.stages[i].total_count = values.sessions_by_stage[i];
        this.stages[i].congestion.value =
          Math.round(values.session_percentage_by_stage[i] * 10000) / 100;
      } else {
        this.stages[i].trafficIconType = 'traffic';
      }
      if (values.logmeasure_by_stage[i] !== 0) {
        this.stages[i].total_count =
          this.stages[i].total_count + values.logmeasure_by_stage[i];
      }
    }
    this.UpdateMaxLatencySteps(values.min_apdex_touchpoint_index_by_stage);
  }

  Getmeasures(element) {
    let total_count = 0;
    const count_by_stage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const sessions_by_stage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const session_percentage_by_stage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const apdex_by_stage = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    const min_apdex_touchpoint_index_by_stage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const logmeasure_by_stage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    element.touchpoints.forEach(touchpoint => {
      if (touchpoint.status_on_off) {
        touchpoint.measure_points.forEach(measure => {
          if (measure.type === 0) {
            total_count += measure.count;
            count_by_stage[touchpoint.stage_index - 1] += measure.count;
          } else if (
            measure.type === 2 &&
            apdex_by_stage[touchpoint.stage_index - 1] > measure.apdex
          ) {
            apdex_by_stage[touchpoint.stage_index - 1] = measure.apdex;
            min_apdex_touchpoint_index_by_stage[touchpoint.stage_index - 1] =
              touchpoint.touchpoint_index;
          } else if (measure.type === 3) {
            sessions_by_stage[touchpoint.stage_index - 1] += measure.count;
          } else if (measure.type === 4) {
            session_percentage_by_stage[
              touchpoint.stage_index - 1
            ] = this.GetSessionsPercentage(measure.sessions);
          } else if (measure.type === 20) {
            logmeasure_by_stage[touchpoint.stage_index - 1] += measure.count;
          }
        });
      }
    });
    return {
      total_count: total_count,
      count_by_stage: count_by_stage,
      sessions_by_stage: sessions_by_stage,
      session_percentage_by_stage: session_percentage_by_stage,
      apdex_by_stage: apdex_by_stage,
      min_apdex_touchpoint_index_by_stage: min_apdex_touchpoint_index_by_stage,
      logmeasure_by_stage: logmeasure_by_stage
    };
  }

  GetSessionsPercentage(sessions) {
    if (sessions.length === 0) {
      return 0;
    }
    let count = 0;
    const currentTime = Math.floor(Date.now() / 1000);
    sessions.forEach(session => {
      if (currentTime - session.time > 5 * 60) {
        count++;
      }
    });
    return count / sessions.length;
  }

  UpdateErrorCondition(actual, nextvalue) {
    if (actual === 'danger') {
      return actual;
    }
    if (nextvalue === 'danger') {
      return nextvalue;
    }
    if (actual === 'warning') {
      return actual;
    }
    if (nextvalue === 'warning') {
      return nextvalue;
    }
    return actual;
  }

  GetStageError(stage, element) {
    let count_touchpoints = 0;
    const steps_with_error = [];
    while (steps_with_error.length < this.stepsByStage[stage - 1]) {
      steps_with_error.push(0);
    }
    element.touchpoints.forEach(touchpoint => {
      if (touchpoint.stage_index === stage && touchpoint.status_on_off) {
        count_touchpoints += 1;
        touchpoint.measure_points.forEach(measure => {
          if (measure.type === 1) {
            if (measure.error_percentage > measure.error_threshold) {
              touchpoint.relation_steps.forEach(rel => {
                steps_with_error[rel - 1] = 1;
              });
              this.SetTouchpointError(
                touchpoint.stage_index,
                touchpoint.touchpoint_index
              );
            }
          } else if (measure.type === 2) {
            if (measure.apdex < 0.4) {
              touchpoint.relation_steps.forEach(rel => {
                steps_with_error[rel - 1] = 1;
              });
              this.SetTouchpointError(
                touchpoint.stage_index,
                touchpoint.touchpoint_index
              );
            }
          } else if (measure.type === 20) {
            if (measure.error_percentage > measure.error_threshold) {
              touchpoint.relation_steps.forEach(rel => {
                steps_with_error[rel - 1] = 1;
              });
              this.SetTouchpointError(
                touchpoint.stage_index,
                touchpoint.touchpoint_index
              );
            }
          }
        });
      }
    });
    if (count_touchpoints > 0) {
      const porcentage =
        this.GetTotalStepsWithError(steps_with_error) /
        this.stepsByStage[stage - 1];
      if (porcentage >= 0.5) {
        return 'danger';
      }
      if (porcentage >= 0.15) {
        return 'warning';
      }
      return 'good';
    } else {
      return 'good';
    }
  }

  SetTouchpointError(stage_index, touchpoint_index) {
    this.stages[stage_index - 1].touchpoints.forEach(touchpoint => {
      if (touchpoint.index === touchpoint_index) {
        touchpoint.error = true;
      }
    });
    this.stages[stage_index - 1].steps.forEach(step => {
      step.sub_steps.forEach(sub_step => {
        sub_step.relationship_touchpoints.forEach(value => {
          if (value === touchpoint_index) {
            sub_step.error = true;
          }
        });
      });
    });
  }

  GetTotalStepsWithError(steps_with_error) {
    let count = 0;
    let i = 0;
    while (i < steps_with_error.length) {
      count += steps_with_error[i];
      i++;
    }
    return count;
  }

  CheckMaxCapacity(currentValue, stage) {
    const timeRange = 'STAGES';
    for (const [key, value] of Object.entries(this.capacity[this.city])) {
      if (key === timeRange) {
        const result = Math.max(value[stage], currentValue);
        if (value[stage] < currentValue) {
          this.capacityUpdatePending = true;
          value[stage] = currentValue * 2;
        }
        return result;
      }
    }
    return currentValue;
  }

  UpdateMaxLatencySteps(max_duration_touchpoint_index_by_stage) {
    for (let i = 0; i < this.stages.length; i++) {
      this.stages[i].steps.forEach(step => {
        step.sub_steps.forEach(sub_step => {
          sub_step.latency = false;
          sub_step.relationship_touchpoints.forEach(touchPointIndex => {
            if (touchPointIndex === max_duration_touchpoint_index_by_stage[i]) {
              sub_step.latency = true;
            }
          });
        });
      });
    }
  }

  UpdateMaxCapacity() {
    if (this.capacityUpdatePending) {
      this.capacityUpdatePending = false;
      this.SetDBmaxCapacity();
    }
  }

  SetDBmaxCapacity() {
    try {
      AccountStorageMutation.mutate({
        accountId: this.accountId,
        actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection: 'pathpoint',
        documentId: 'maxCapacity',
        document: {
          Capacity: this.capacity
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  LoadCanaryData() {
    return this.dataCanary;
  }

  SetCanaryData(stages, city) {
    this.stages = stages;
    this.city = city;
    this.OffAllTouchpoints();
    this.EnableCanaryTouchPoints();
    this.SetTouchpointsStatus();
    return {
      stages: this.stages
    };
  }

  OffAllTouchpoints() {
    this.touchPoints.some(element => {
      let found = false;
      if (element.index === this.city) {
        element.touchpoints.forEach(tp => {
          tp.status_on_off = false;
        });
        found = true;
      }
      return found;
    });
  }

  EnableCanaryTouchPoints() {
    for (let i = 0; i < this.stages.length; i++) {
      this.stages[i].steps.forEach(step => {
        step.sub_steps.forEach(sub_step => {
          if (sub_step.canary_state === true) {
            sub_step.relationship_touchpoints.forEach(touchPointIndex => {
              this.EnableTouchpoint(i + 1, touchPointIndex);
            });
          }
        });
      });
    }
  }

  EnableTouchpoint(stageIndex, touchPointIndex) {
    this.touchPoints.some(element => {
      let found = false;
      if (element.index === this.city) {
        element.touchpoints.some(tp => {
          let foundTp = false;
          if (
            tp.stage_index === stageIndex &&
            tp.touchpoint_index === touchPointIndex
          ) {
            tp.status_on_off = true;
            foundTp = true;
          }
          return foundTp;
        });
        found = true;
      }
      return found;
    });
  }

  SetTouchpointsStatus() {
    if (this.touchPoints != null) {
      this.touchPoints.forEach(element => {
        if (element.index === this.city) {
          element.touchpoints.forEach(touchpoint => {
            this.UpdateTouchpointStatus(touchpoint);
          });
        }
      });
    }
  }

  UpdateTouchpointStatus(touchpoint) {
    this.stages.some(stage => {
      let found = false;
      if (stage.index === touchpoint.stage_index) {
        stage.touchpoints.some(tp => {
          let foundTp = false;
          if (tp.index === touchpoint.touchpoint_index) {
            tp.status_on_off = touchpoint.status_on_off;
            foundTp = true;
          }
          return foundTp;
        });
        found = true;
      }
      return found;
    });
  }

  ClearCanaryData(stages) {
    this.stages = stages;
    if (this.touchPointsCopy !== null) {
      this.touchPoints = JSON.parse(JSON.stringify(this.touchPointsCopy));
      this.SetTouchpointsStatus();
    }
    return {
      stages: this.stages
    };
  }

  async SetStorageTouchpoints() {
    try {
      this.touchPointsCopy = JSON.parse(JSON.stringify(this.touchPoints));
      const { data } = await AccountStorageMutation.mutate({
        accountId: this.accountId,
        actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection: 'pathpoint',
        documentId: 'touchpoints',
        document: {
          TouchPoints: this.touchPoints
        }
      });
      if (data) {
        this.GetMinPercentageError();
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  GetMinPercentageError() {
    this.minPercentageError = 100;
    this.touchPoints.forEach(element => {
      if (element.index === this.city) {
        element.touchpoints.forEach(touchpoint => {
          touchpoint.measure_points.forEach(measure => {
            if (measure.type === 0 || measure.type === 20) {
              if (measure.error_threshold < this.minPercentageError) {
                this.minPercentageError = measure.error_threshold;
              }
            }
          });
        });
      }
    });
  }

  SetVersion() {
    try {
      AccountStorageMutation.mutate({
        accountId: this.accountId,
        actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection: 'pathpoint',
        documentId: 'version',
        document: {
          Version: this.version
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async GetStorageTouchpoints() {
    try {
      const { data } = await AccountStorageQuery.query({
        accountId: this.accountId,
        collection: 'pathpoint',
        documentId: 'touchpoints'
      });
      if (data) {
        this.touchPoints = data.TouchPoints;
        this.touchPointsCopy = JSON.parse(JSON.stringify(this.touchPoints)); // clone the touchpoints with new reference
        this.GetMinPercentageError();
        this.SetTouchpointsStatus();
      } else {
        this.SetStorageTouchpoints();
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  UpdateCanaryData(data) {
    this.SaveCanaryData(data);
  }

  GetCurrentConfigurationJSON() {
    this.ReadPathpointConfig();
    return JSON.stringify(this.configuration, null, 4);
  }

  ReadPathpointConfig() {
    let i = 0;
    let line = 0;
    let kpi = null;
    this.configuration.pathpointVersion = this.version;
    for (let i = 0; i < this.banner_kpis.length; i++) {
      kpi = {
        description: this.banner_kpis[i].description,
        prefix: this.banner_kpis[i].prefix,
        suffix: this.banner_kpis[i].suffix,
        query: this.banner_kpis[i].query
      };
      this.configuration.banner_kpis.push(kpi);
    }
    this.configuration.stages.length = 0;
    this.stages.forEach(stage => {
      this.configuration.stages.push({
        title: stage.title,
        active_dotted: stage.active_dotted,
        steps: [],
        touchpoints: []
      });
      i = this.configuration.stages.length;
      line = 0;
      stage.steps.forEach(step => {
        const s_steps = [];
        line++;
        step.sub_steps.forEach(sub_step => {
          s_steps.push({ title: sub_step.value, id: sub_step.id });
        });
        this.configuration.stages[i - 1].steps.push({
          line: line,
          values: s_steps
        });
      });
      stage.touchpoints.forEach(tp => {
        this.configuration.stages[i - 1].touchpoints.push({
          title: tp.value,
          status_on_off: tp.status_on_off,
          dashboard_url: tp.dashboard_url,
          related_steps: this.GetRelatedSteps(tp.stage_index, tp.index),
          queries: this.GetTouchpointQueryes(tp.stage_index, tp.index)
        });
      });
    });
  }

  GetRelatedSteps(stage_index, index) {
    const related_steps = [];
    this.touchPoints.forEach(element => {
      if (element.index === this.city) {
        element.touchpoints.some(touchpoint => {
          let found = false;
          if (
            touchpoint.stage_index === stage_index &&
            touchpoint.touchpoint_index === index
          ) {
            touchpoint.relation_steps.forEach(value => {
              related_steps.push(value);
            });
            found = true;
          }
          return found;
        });
      }
    });
    return this.GetStepsIds(stage_index, related_steps);
  }

  GetStepsIds(stage_index, related_steps) {
    let relatedIds = '';
    related_steps.forEach(rel_step => {
      this.stages[stage_index - 1].steps.some(step => {
        let found = false;
        step.sub_steps.some(sub_step => {
          if (sub_step.index === rel_step) {
            if (relatedIds !== '') {
              relatedIds += ',';
            }
            relatedIds += sub_step.id;
            found = true;
          }
          return found;
        });
        return found;
      });
    });
    return relatedIds;
  }

  GetTouchpointQueryes(stage_index, index) {
    const queries = [];
    this.touchPoints.forEach(element => {
      if (element.index === this.city) {
        element.touchpoints.some(touchpoint => {
          let found = false;
          if (
            touchpoint.stage_index === stage_index &&
            touchpoint.touchpoint_index === index
          ) {
            found = true;
            touchpoint.measure_points.forEach(measure => {
              if (measure.type === 0) {
                queries.push({
                  type: this.measureNames[0],
                  query: measure.query,
                  error_threshold: measure.error_threshold
                });
              } else if (measure.type === 1) {
                queries.push({
                  type: this.measureNames[1],
                  query: measure.query,
                  apdex_time: measure.apdex_time
                });
              } else if (measure.type === 2) {
                queries.push({
                  type: this.measureNames[2],
                  query: measure.query
                });
              } else if (measure.type === 3) {
                queries.push({
                  type: this.measureNames[3],
                  query: measure.query
                });
              } else if (measure.type === 20) {
                queries.push({
                  type: this.measureNames[5],
                  query: measure.query,
                  error_threshold: measure.error_threshold
                });
              }
            });
          }
          return found;
        });
      }
    });
    return queries;
  }
}
