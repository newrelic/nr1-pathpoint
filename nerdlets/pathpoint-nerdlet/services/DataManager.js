/* eslint-disable prefer-template */
/* eslint-disable no-loop-func */
/* eslint-disable require-atomic-updates */

// IMPORT LIBRARIES DEPENDENCIES
import NerdletData from '../../../nr1.json';
import TouchPoints from '../config/touchPoints.json';
import Canary from '../config/canary_states.json';
import ViewData from '../config/view.json';
import appPackage from '../../../package.json';
import NerdStorageVault from './NerdStorageVault';
import { historicErrorScript } from '../../../synthetics/createHistoricErrorScript2';
import {
  AccountStorageMutation,
  AccountsQuery,
  AccountStorageQuery,
  NerdGraphQuery,
  logger
} from 'nr1';

import LogConnector from './LogsConnector';
import SynConnector from './SynConnector';
import CredentialConnector from './CredentialConnector';

// DEFINE AND EXPORT CLASS
export default class DataManager {
  constructor() {
    this.NerdStorageVault = new NerdStorageVault();
    this.LogConnector = new LogConnector();
    this.SynConnector = new SynConnector();
    this.CredentialConnector = new CredentialConnector();
    this.SecureCredentialsExist = false;
    this.minPercentageError = 100;
    this.historicErrorsHours = 192;
    this.historicErrorsHighLightPercentage = 26;
    this.dropParams = null;
    this.version = null;
    this.accountId = null;
    this.SyntheticAccountID = null;
    this.graphQlmeasures = [];
    this.touchPointsCopy = null;
    this.city = 0;
    this.pathpointId = NerdletData.id;
    this.touchPoints = TouchPoints;
    this.stages = [];
    this.lastStorageVersion = null;
    this.stepsByStage = [];
    this.credentials = {};
    this.generalConfiguration = {};
    this.dataCanary = Canary;
    this.configuration = {
      pathpointVersion: null,
      kpis: [],
      stages: []
    };
    this.configurationJSON = {};
    this.measureNames = [
      'PRC-COUNT-QUERY',
      'PCC-COUNT-QUERY',
      'APP-HEALTH-QUERY',
      'FRT-HEALTH-QUERY',
      'SYN-CHECK-QUERY',
      'WORKLOAD-QUERY'
    ];
    this.accountIDs = [
      {
        name: 'NAME',
        id: 0
      }
    ];
    this.detaultTimeout = 10;
  }

  async BootstrapInitialData(accountName) {
    await this.GetAccountId(accountName);
    logger.log('Accounts::');
    this.accountIDs.forEach(account => {
      logger.log(`AccountName:${account.name}   ID:${account.id} `);
    });
    await this.CheckVersion();
    await this.GetCanaryData();
    await this.GetStorageHistoricErrorsParams();
    await this.GetStorageDropParams();
    this.credentials = await this.NerdStorageVault.getCredentialsData();
    if (
      this.credentials &&
      this.credentials.actor.nerdStorageVault.secrets.length > 0
    ) {
      await this.TryToSetKeys(this.credentials.actor.nerdStorageVault.secrets);
    }
    await this.GetGeneralConfiguration();
    this.TryToEnableServices();
    this.version = appPackage.version;
    if (this.lastStorageVersion === appPackage.version) {
      this.colors = ViewData.colors;
      await this.GetInitialDataFromStorage();
      await this.GetStorageTouchpoints();
    } else {
      this.stages = ViewData.stages;
      this.colors = ViewData.colors;
      this.kpis = ViewData.kpis ?? [];
      this.SetInitialDataViewToStorage();
      this.SetStorageTouchpoints();
      this.SetVersion();
    }
    this.AddCustomAccountIDs();
    this.stepsByStage = this.GetStepsByStage();
    return {
      stages: [...this.stages],
      kpis: [...this.kpis],
      colors: this.colors,
      accountId: this.accountId,
      version: this.version,
      totalContainers: this.SetTotalContainers(),
      accountIDs: this.accountIDs,
      credentials: this.credentials,
      generalConfiguration: this.generalConfiguration
    };
  }

  async TryToSetKeys(secrets) {
    // console.log('Secrets:',secrets);
    let licensekey = '';
    let userApiKey = '';
    secrets.forEach(item => {
      if (
        item.key &&
        item.key === 'ingestLicense' &&
        item.value &&
        item.value !== '_' &&
        item.value.indexOf('xxxxxx') === -1
      ) {
        licensekey = item.value;
      }
      if (
        item.key &&
        item.key === 'userAPIKey' &&
        item.value &&
        item.value !== '_' &&
        item.value.indexOf('xxxxxx') === -1
      ) {
        userApiKey = item.value;
      }
    });
    if (licensekey !== '') {
      const valid = await this.ValidateIngestLicense(licensekey);
      if (valid) {
        this.LogConnector.SetLicenseKey(licensekey);
        this.SynConnector.SetLicenseKey(licensekey);
        this.CredentialConnector.SetLicenseKey(licensekey);
      }
    }
    if (userApiKey !== '') {
      const valid = await this.ValidateUserApiKey(userApiKey);
      if (valid) {
        this.SynConnector.SetUserApiKey(userApiKey);
        this.CredentialConnector.SetUserApiKey(userApiKey);
      }
    }
  }

  TryToEnableServices() {
    // TODO
    // console.log('General Configuration:',this.generalConfiguration);
    if (Reflect.has(this.generalConfiguration, 'loggin')) {
      this.LogConnector.EnableDisable(this.generalConfiguration.loggin);
      // console.log('ENABLE/DISABLE-LOG-CONNECTOR:', this.generalConfiguration.loggin);
    }
    if (Reflect.has(this.generalConfiguration, 'dropTools')) {
      this.SynConnector.EnableDisableDrop(this.generalConfiguration.dropTools);
      // console.log('ENABLE/DISABLE-SYN-CONNECTOR-DROP:', this.generalConfiguration.dropTools);
    }
    if (Reflect.has(this.generalConfiguration, 'flameTools')) {
      this.SynConnector.EnableDisableFlame(
        this.generalConfiguration.flameTools
      );
      // console.log('ENABLE/DISABLE-SYN-CONNECTOR-FLAME:', this.generalConfiguration.flameTools);
    }
    if (Reflect.has(this.generalConfiguration, 'accountId')) {
      this.SyntheticAccountID = this.generalConfiguration.accountId;
      this.SynConnector.SetAccountID(this.SyntheticAccountID);
      this.CredentialConnector.SetAccountID(this.SyntheticAccountID);
      // console.log('SETTIMNG-SYN-ACCOUNT-ID:', this.generalConfiguration.accountId);
    } else {
      this.SyntheticAccountID = this.accountId;
      this.SynConnector.SetAccountID(this.SyntheticAccountID);
      this.CredentialConnector.SetAccountID(this.SyntheticAccountID);
    }
  }

  SetTotalContainers() {
    let total = 0;
    this.stages.forEach(stage => {
      if (stage.steps.length > total) {
        total = stage.steps.length;
      }
    });
    return total;
  }

  async UpdateData(timeRange, city, stages, kpis, timeRangeKpi) {
    if (this.accountId !== null) {
      // console.log(`UPDATING-DATA: ${this.accountId}`);
      this.timeRange = timeRange;
      this.city = city;
      this.stages = stages;
      this.kpis = kpis;
      this.timeRangeKpi = timeRangeKpi;
      await this.TouchPointsUpdate();
      await this.UpdateMerchatKpi();
      this.CalculateUpdates();
      // console.log('FINISH-Update');
      return {
        stages: this.stages,
        kpis: this.kpis
      };
    }
  }

  async GetAccountId(accountName) {
    try {
      const { data } = await AccountsQuery.query();
      if (data.length > 0) {
        this.FillAccountIDs(data);
        if (accountName !== '') {
          data.some(account => {
            let found = false;
            if (account.name === accountName) {
              this.accountId = account.id;
              found = true;
            }
            if (!found) {
              // If AccountName is not found use the first account
              this.accountId = data[0].id;
            }
            return found;
          });
        } else {
          // By default capture the First Account in the List
          this.accountId = data[0].id;
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  FillAccountIDs(data) {
    this.accountIDs.length = 0;
    data.forEach(account => {
      this.accountIDs.push({
        name: account.name,
        id: account.id
      });
    });
  }

  AddCustomAccountIDs() {
    this.removeCustomIDs();
    let ids = '--';
    this.accountIDs.forEach(acc => {
      ids += acc.id + '--';
    });
    const initial_length = ids.length;
    this.touchPoints.forEach(element => {
      element.touchpoints.forEach(touchpoint => {
        touchpoint.measure_points.forEach(measure => {
          if (measure.accountID) {
            if (ids.indexOf('--' + measure.accountID + '--') === -1) {
              ids += measure.accountID + '--';
            }
          }
        });
      });
    });
    if (ids.length > initial_length) {
      const newIds = ids.substring(initial_length, ids.length - 2).split('--');
      newIds.forEach(newId => {
        this.accountIDs.push({
          name: 'Custom ID',
          id: parseInt(newId)
        });
      });
    }
  }

  removeCustomIDs() {
    while (this.accountIDs[this.accountIDs.length - 1].name === 'Custom ID') {
      this.accountIDs.pop();
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
        this.kpis = data.Kpis ?? [];
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
          Kpis: this.kpis
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  SaveKpisSelection(kpis) {
    this.kpis = kpis;
    this.SetInitialDataViewToStorage();
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
      const { data } = await AccountStorageQuery.query({
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

  async TouchPointsUpdate() {
    this.graphQlmeasures.length = 0;
    this.touchPoints.forEach(element => {
      if (element.index === this.city) {
        element.touchpoints.forEach(touchpoint => {
          if (touchpoint.status_on_off) {
            touchpoint.measure_points.forEach(measure => {
              const extraInfo = {
                touchpointRef: touchpoint,
                measureType: 'touchpoint',
                touchpointName: touchpoint.value,
                stageName: this.stages[touchpoint.stage_index - 1].title
              };
              this.FetchMeasure(measure, extraInfo);
            });
          }
        });
      }
    });
    this.RemoveGreySquare();
    if (this.graphQlmeasures.length > 0) {
      await this.NRDBQuery();
    }
  }

  ClearMeasure(measure) {
    switch (measure.type) {
      case 'PRC':
        measure.session_count = 0;
        break;
      case 'PCC':
        measure.transaction_count = 0;
        break;
      case 'APP':
      case 'FRT':
        measure.apdex_value = 1;
        measure.response_value = 0;
        measure.error_percentage = 0;
        break;
      case 'SYN':
        measure.success_percentage = 0;
        measure.max_duration = 0;
        measure.max_request_time = 0;
        break;
      case 'WLD':
        measure.status_value = 'NO-VALUE';
        break;
    }
  }

  async ReadQueryResults(query, accountID) {
    const measure = {
      accountID: accountID,
      type: 'TEST',
      results: null
    };
    this.graphQlmeasures.length = 0;
    this.graphQlmeasures.push([measure, query, null]);
    await this.NRDBQuery();
    return measure;
  }

  FetchMeasure(measure, extraInfo = null) {
    this.ClearMeasure(measure);
    if (measure.query !== '') {
      let query = `${measure.query} SINCE ${this.TimeRangeTransform(
        this.timeRange
      )}`;
      if (measure.measure_time) {
        query = `${measure.query} SINCE ${measure.measure_time}`;
      } else if (measure.type === 'WLD') {
        query = `${measure.query} SINCE 3 HOURS AGO`;
      }
      this.graphQlmeasures.push([measure, query, extraInfo]);
    }
  }

  TimeRangeTransform(timeRange) {
    let time_start = 0;
    let time_end = 0;
    if (timeRange === '5 MINUTES AGO') {
      return timeRange;
    }
    switch (timeRange) {
      case '30 MINUTES AGO':
        time_start = Math.floor(Date.now() / 1000) - 35 * 60;
        time_end = Math.floor(Date.now() / 1000) - 30 * 60;
        break;
      case '60 MINUTES AGO':
        time_start = Math.floor(Date.now() / 1000) - 65 * 60;
        time_end = Math.floor(Date.now() / 1000) - 60 * 60;
        break;
      case '3 HOURS AGO':
        time_start = Math.floor(Date.now() / 1000) - 3 * 60 * 60 - 5 * 60;
        time_end = Math.floor(Date.now() / 1000) - 3 * 60 * 60;
        break;
      case '6 HOURS AGO':
        time_start = Math.floor(Date.now() / 1000) - 6 * 60 * 60 - 5 * 60;
        time_end = Math.floor(Date.now() / 1000) - 6 * 60 * 60;
        break;
      case '12 HOURS AGO':
        time_start = Math.floor(Date.now() / 1000) - 12 * 60 * 60 - 5 * 60;
        time_end = Math.floor(Date.now() / 1000) - 12 * 60 * 60;
        break;
      case '24 HOURS AGO':
        time_start = Math.floor(Date.now() / 1000) - 24 * 60 * 60 - 5 * 60;
        time_end = Math.floor(Date.now() / 1000) - 24 * 60 * 60;
        break;
      case '3 DAYS AGO':
        time_start = Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60 - 5 * 60;
        time_end = Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60;
        break;
      case '7 DAYS AGO':
        time_start = Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60 - 5 * 60;
        time_end = Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60;
        break;
      default:
        return timeRange;
    }
    return `${time_start} UNTIL ${time_end}`;
  }

  SendToLogs(logRecord) {
    this.LogConnector.SendLog(logRecord);
  }

  MakeLogingData(startMeasureTime, endMeasureTime, data, errors) {
    if (errors && errors.length > 0) {
      errors.forEach(error => {
        if (Reflect.has(error, 'path')) {
          for (const [, value] of Object.entries(error.path)) {
            const c = value.split('_');
            if (c[0] === 'measure') {
              const measure = this.graphQlmeasures[Number(c[1])][0];
              const query = this.graphQlmeasures[Number(c[1])][1];
              const extraInfo = this.graphQlmeasures[Number(c[1])][2];
              let accountID = this.accountId;
              if (Reflect.has(measure, 'accountID')) {
                accountID = measure.accountID;
              }
              if (extraInfo) {
                if (extraInfo.measureType === 'touchpoint') {
                  const logRecord = {
                    action: 'touchpoint-error',
                    account_id: accountID,
                    error: true,
                    error_message: JSON.stringify(error),
                    query: query,
                    touchpoint_name: extraInfo.touchpointName,
                    touchpoint_type: measure.type,
                    stage_name: extraInfo.stageName
                  };
                  // DISABLE Touchpoints with ERRORS
                  this.DisableTouchpointByError(extraInfo.touchpointRef);
                  this.SendToLogs(logRecord);
                }
                if (extraInfo.measureType === 'kpi') {
                  const logRecord = {
                    action: 'kpi-error',
                    account_id: accountID,
                    error: true,
                    error_message: JSON.stringify(error),
                    query: query,
                    kpi_name: extraInfo.kpiName,
                    kpi_type: extraInfo.kpiType
                  };
                  this.SendToLogs(logRecord);
                }
              }
            }
          }
        }
      });
    }
    if (data && data.actor) {
      for (const [key, value] of Object.entries(data.actor)) {
        const c = key.split('_');
        if (
          c[0] === 'measure' &&
          value &&
          value.nrql &&
          Reflect.has(value, 'nrql') &&
          Reflect.has(value.nrql, 'results')
        ) {
          const measure = this.graphQlmeasures[Number(c[1])][0];
          const query = this.graphQlmeasures[Number(c[1])][1];
          const extraInfo = this.graphQlmeasures[Number(c[1])][2];
          const totalMeasures = this.graphQlmeasures.length;
          const timeByMeasure =
            (endMeasureTime - startMeasureTime) / totalMeasures;
          if (extraInfo !== null) {
            let accountID = this.accountId;
            if (Reflect.has(measure, 'accountID')) {
              accountID = measure.accountID;
            }
            if (extraInfo.measureType === 'touchpoint') {
              const logRecord = {
                action: 'touchpoint-query',
                account_id: accountID,
                error: false,
                query: query,
                results: JSON.stringify(value.nrql.results),
                duration: timeByMeasure,
                touchpoint_name: extraInfo.touchpointName,
                touchpoint_type: measure.type,
                stage_name: extraInfo.stageName
              };
              this.SendToLogs(logRecord);
            }
            if (extraInfo.measureType === 'kpi') {
              if (Reflect.has(measure.queryByCity[this.city], 'accountID')) {
                accountID = measure.queryByCity[this.city].accountID;
              }
              const logRecord = {
                action: 'kpi-query',
                account_id: accountID,
                error: false,
                query: query,
                results: JSON.stringify(value.nrql.results),
                duration: timeByMeasure,
                kpi_name: extraInfo.kpiName,
                kpi_type: extraInfo.kpiType
              };
              this.SendToLogs(logRecord);
            }
          }
        }
      }
    }
  }

  DisableTouchpointByError(touchpoint) {
    // touchpoint.status_on_off = false;
    this.stages.some(stage => {
      let found = false;
      if (stage.index === touchpoint.stage_index) {
        stage.touchpoints.some(tp => {
          let foundTp = false;
          if (tp.index === touchpoint.touchpoint_index) {
            tp.show_grey_square = true;
            foundTp = true;
          }
          return foundTp;
        });
        found = true;
      }
      return found;
    });
  }

  RemoveGreySquare() {
    this.stages.forEach(stage => {
      stage.touchpoints.forEach(tp => {
        tp.show_grey_square = false;
      });
    });
  }

  async NRDBQuery() {
    const startMeasureTime = Date.now();
    const { data, errors, n } = await this.EvaluateMeasures();
    const endMeasureTime = Date.now();
    this.MakeLogingData(startMeasureTime, endMeasureTime, data, errors);
    if (n === 0) {
      return 0;
    }
    if (errors && errors.length > 0) {
      // console.log('NRDB-Error:', errors);
    }
    if (data && data.actor) {
      for (const [key, value] of Object.entries(data.actor)) {
        const c = key.split('_');
        if (value !== null) {
          if (c[0] === 'measure') {
            const measure = this.graphQlmeasures[Number(c[1])][0];
            const extraInfo = this.graphQlmeasures[Number(c[1])][2];
            this.CheckIfResponseErrorCanBeSet(extraInfo, false);
            // const query = this.graphQlmeasures[Number(c[1])][1];
            // console.log('Query:',query);
            // console.log('Result',value);
            if (
              measure.type === 'PRC' &&
              value.nrql !== null &&
              value.nrql.results &&
              value.nrql.results[0] &&
              Object.prototype.hasOwnProperty.call(
                value.nrql.results[0],
                'session'
              )
            ) {
              if (value.nrql.results[0].session == null) {
                this.CheckIfResponseErrorCanBeSet(extraInfo, true);
              }
              measure.session_count = value.nrql.results[0].session;
            } else if (
              measure.type === 'PCC' &&
              value.nrql !== null &&
              value.nrql.results &&
              value.nrql.results[0] &&
              Object.prototype.hasOwnProperty.call(
                value.nrql.results[0],
                'count'
              )
            ) {
              if (value.nrql.results[0].count == null) {
                this.CheckIfResponseErrorCanBeSet(extraInfo, true);
              }
              measure.transaction_count = value.nrql.results[0].count;
            } else if (
              measure.type === 'APP' &&
              value.nrql !== null &&
              value.nrql.results &&
              value.nrql.results[0] &&
              Object.prototype.hasOwnProperty.call(
                value.nrql.results[0],
                'apdex'
              ) &&
              Object.prototype.hasOwnProperty.call(
                value.nrql.results[0],
                'score'
              ) &&
              Object.prototype.hasOwnProperty.call(
                value.nrql.results[0],
                'response'
              ) &&
              Object.prototype.hasOwnProperty.call(
                value.nrql.results[0],
                'error'
              )
            ) {
              if (
                value.nrql.results[0].response === null ||
                value.nrql.results[0].error === null
              ) {
                this.CheckIfResponseErrorCanBeSet(extraInfo, true);
              }
              measure.apdex_value = value.nrql.results[0].score;
              measure.response_value = value.nrql.results[0].response;
              measure.error_percentage = value.nrql.results[0].error;
            } else if (
              measure.type === 'FRT' &&
              value.nrql !== null &&
              value.nrql.results &&
              value.nrql.results[0] &&
              Object.prototype.hasOwnProperty.call(
                value.nrql.results[0],
                'apdex'
              ) &&
              Object.prototype.hasOwnProperty.call(
                value.nrql.results[0],
                'score'
              ) &&
              Object.prototype.hasOwnProperty.call(
                value.nrql.results[0],
                'response'
              ) &&
              Object.prototype.hasOwnProperty.call(
                value.nrql.results[0],
                'error'
              )
            ) {
              if (
                value.nrql.results[0].response === null ||
                value.nrql.results[0].error === null
              ) {
                this.CheckIfResponseErrorCanBeSet(extraInfo, true);
              }
              measure.apdex_value = value.nrql.results[0].score;
              measure.response_value = value.nrql.results[0].response;
              measure.error_percentage = value.nrql.results[0].error;
            } else if (
              measure.type === 'SYN' &&
              value.nrql !== null &&
              value.nrql.results &&
              value.nrql.results[0] &&
              Object.prototype.hasOwnProperty.call(
                value.nrql.results[0],
                'success'
              ) &&
              Object.prototype.hasOwnProperty.call(
                value.nrql.results[0],
                'duration'
              ) &&
              Object.prototype.hasOwnProperty.call(
                value.nrql.results[0],
                'request'
              )
            ) {
              if (
                value.nrql.results[0].success === null ||
                value.nrql.results[0].duration === null ||
                value.nrql.results[0].request === null
              ) {
                this.CheckIfResponseErrorCanBeSet(extraInfo, true);
              }
              measure.success_percentage = value.nrql.results[0].success;
              measure.max_duration = value.nrql.results[0].duration;
              measure.max_request_time = value.nrql.results[0].request;
            } else if (
              measure.type === 'WLD' &&
              value.nrql !== null &&
              value.nrql.results &&
              value.nrql.results[0] &&
              Object.prototype.hasOwnProperty.call(
                value.nrql.results[0],
                'statusValue'
              )
            ) {
              if (value.nrql.results[0].statusValue == null) {
                this.CheckIfResponseErrorCanBeSet(extraInfo, true);
              }
              measure.status_value = value.nrql.results[0].statusValue;
            } else if (
              measure.type === 100 &&
              value.nrql != null &&
              value.nrql.results &&
              value.nrql.results[0] &&
              Object.prototype.hasOwnProperty.call(
                value.nrql.results[0],
                'value'
              )
            ) {
              measure.value = value.nrql.results[0].value;
            } else if (
              measure.type === 101 &&
              value.nrql != null &&
              value.nrql.results &&
              value.nrql.results.length === 2 &&
              Object.prototype.hasOwnProperty.call(
                value.nrql.results[0],
                'value'
              ) &&
              Object.prototype.hasOwnProperty.call(
                value.nrql.results[0],
                'comparison'
              )
            ) {
              if (value.nrql.results[0].comparison === 'current') {
                measure.value.current = value.nrql.results[0].value;
                measure.value.previous = value.nrql.results[1].value;
              } else {
                measure.value.current = value.nrql.results[1].value;
                measure.value.previous = value.nrql.results[0].value;
              }
            } else if (measure.type === 'TEST') {
              if (value.nrql != null && value.nrql.results) {
                measure.results = value.nrql.results[0];
              } else if (errors && errors.length > 0) {
                measure.results = {
                  error: errors[0].message
                };
              } else {
                measure.results = {
                  error: 'INVALID QUERY'
                };
              }
            } else {
              // the Touchpoint response is with ERROR
              this.CheckIfResponseErrorCanBeSet(extraInfo, true);
            }
          }
        } else if (c[0] === 'measure') {
          const measure = this.graphQlmeasures[Number(c[1])][0];
          if (measure.type === 'TEST' && errors && errors.length > 0) {
            measure.results = {
              error: errors[0].message
            };
          } else {
            measure.results = {
              error: 'INVALID QUERY'
            };
          }
        }
      }
    }
  }

  CheckIfResponseErrorCanBeSet(extraInfo, status) {
    if (extraInfo !== null) {
      if (extraInfo.measureType === 'touchpoint') {
        this.SetTouchpointResponseError(extraInfo.touchpointRef, status);
      }
    }
  }

  SetTouchpointResponseError(touchpoint, status) {
    this.stages.some(stage => {
      let found = false;
      if (stage.index === touchpoint.stage_index) {
        stage.touchpoints.some(tp => {
          let foundTp = false;
          if (tp.index === touchpoint.touchpoint_index) {
            tp.response_error = status;
            foundTp = true;
          }
          return foundTp;
        });
        found = true;
      }
      return found;
    });
  }

  async EvaluateMeasures() {
    let accountID = this.accountId;
    let gql = `{
     actor {`;
    let alias = '';
    let n = 0;
    const itemsByPage = 45;
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
          accountID = this.accountId;
          if (Reflect.has(nrql[0], 'accountID')) {
            accountID = nrql[0].accountID;
          }
          // Special Change ONLY for KPI-MULTI-ACCOINT-MEASURES
          if (nrql[0].type === 100 || nrql[0].type === 101) {
            if (Reflect.has(nrql[0].queryByCity[this.city], 'accountID')) {
              accountID = nrql[0].queryByCity[this.city].accountID;
            }
          }
          // Check if the Measure have a Timeout Defined
          let timeOut = this.detaultTimeout;
          if (Reflect.has(nrql[0], 'timeout')) {
            timeOut = nrql[0].timeout;
          }
          alias = `measure_${n}`;
          n += 1;
          gql += `${alias}: account(id: ${accountID}) {
              nrql(query: "${this.escapeQuote(nrql[1])}", timeout: ${timeOut}) {
                  results
              }
          }`;
        });
        gql += `}}`;
        const { data, errors } = await NerdGraphQuery.query({
          query: gql
        }).catch(errors => {
          return { errors: [{ errors }] };
        });
        if (data && data.actor)
          dataReturn.actor = Object.assign(dataReturn.actor, data.actor);
        if (errors && errors.length > 0) errorsReturn.push(errors);
        gql = `{
            actor {`;
        alias = '';
        control += itemsByPage;
      }
      return {
        data: dataReturn,
        n,
        errors: errorsReturn
      };
    } else {
      this.graphQlmeasures.forEach(nrql => {
        // check if the measure is MULTI-ACCOUNT
        accountID = this.accountId;
        if (Reflect.has(nrql[0], 'accountID')) {
          accountID = nrql[0].accountID;
        }
        // Special Change ONLY for KPI-MULTI-ACCOINT-MEASURES
        if (nrql[0].type === 100 || nrql[0].type === 101) {
          if (Reflect.has(nrql[0].queryByCity[this.city], 'accountID')) {
            accountID = nrql[0].queryByCity[this.city].accountID;
          }
        }
        // Check if the Measure have a Timeout Defined
        let timeOut = this.detaultTimeout;
        if (Reflect.has(nrql[0], 'timeout')) {
          timeOut = nrql[0].timeout;
        }
        alias = `measure_${n}`;
        n += 1;
        gql += `${alias}: account(id: ${accountID}) {
            nrql(query: "${this.escapeQuote(nrql[1])}", timeout: ${timeOut}) {
                results
            }
        }`;
      });
      gql += `}}`;
      const { data, errors } = await NerdGraphQuery.query({ query: gql }).catch(
        errors => {
          return { errors: [{ errors }] };
        }
      );
      return { data, n, errors };
    }
  }

  escapeQuote(data) {
    return data.replace(/["]/g, '\\"');
  }

  async UpdateMerchatKpi() {
    this.graphQlmeasures.length = 0;
    for (let i = 0; i < this.kpis.length; i++) {
      if (this.kpis[i].check) {
        const extraInfo = {
          measureType: 'kpi',
          kpiName: this.kpis[i].name,
          kpiType: this.kpis[i].type
        };
        this.graphQlmeasures.push([
          this.kpis[i],
          this.kpis[i].queryByCity[this.city].query +
            ' SINCE ' +
            this.timeRangeKpi.range,
          extraInfo
        ]);
      }
      this.kpis[i].link = this.kpis[i].queryByCity[this.city].link;
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
    for (let i = 0; i < this.stages.length; i++) {
      this.stages[i].status_color = 'good';
      this.stages[i].status_color = this.UpdateErrorCondition(
        this.stages[i].status_color,
        this.GetStageError(i + 1, element)
      );
      this.stages[i].total_count = values.count_by_stage[i].total_count;
      this.stages[i].trafficIconType = values.count_by_stage[i].traffic_type;

      this.stages[i].capacity = values.count_by_stage[i].capacity_status;
      this.stages[i].capacity_link = values.count_by_stage[i].capacity_link;

      let congestion =
        values.count_by_stage[i].total_count !== 0
          ? values.count_by_stage[i].total_congestion /
            values.count_by_stage[i].total_count
          : 0;
      congestion = Math.floor(congestion * 10000) / 100;
      this.stages[i].congestion.value = congestion;
      this.stages[i].congestion.percentage = congestion;
    }
    this.UpdateMaxCongestionSteps(values.count_by_stage);
  }

  Getmeasures(touchpoints_by_country) {
    const tpc = []; // Count Touchpoints totals by Stage
    while (tpc.length < this.stages.length) {
      const rec = {
        traffic_type: 'traffic',
        num_touchpoints: 0,
        total_count: 0,
        steps_indexes: [],
        total_congestion: 0,
        steps_max_cong: [],
        capacity_status: 'NO-VALUE',
        capacity_link: ''
      };
      tpc.push(rec);
    }
    touchpoints_by_country.touchpoints.forEach(touchpoint => {
      if (touchpoint.status_on_off) {
        const idx = touchpoint.stage_index - 1;
        touchpoint.measure_points.forEach(measure => {
          let count = 0;
          if (measure.type === 'PRC' || measure.type === 'PCC') {
            count =
              measure.type === 'PRC'
                ? measure.session_count
                : measure.transaction_count;
            tpc[idx].traffic_type =
              measure.type === 'PRC' ? 'people' : 'traffic';
            tpc[idx].num_touchpoints++;
            tpc[idx].total_count += count;
            if (measure.max_count < count) {
              tpc[idx].total_congestion += count - measure.max_count;
              tpc[idx].steps_max_cong = touchpoint.relation_steps;
            }
          }
          if (measure.type === 'WLD') {
            tpc[idx].capacity_status = measure.status_value;
            tpc[idx].capacity_link = this.GetWokloadTouchpointLink(touchpoint);
          }
        });
      }
    });
    // console.log('TPC:', tpc);
    return {
      count_by_stage: tpc
    };
  }

  GetWokloadTouchpointLink(touchpoint) {
    let link = '';
    this.stages[touchpoint.stage_index - 1].touchpoints.some(tp => {
      let found = false;
      if (tp.index === touchpoint.touchpoint_index) {
        found = true;
        link = tp.dashboard_url[0];
      }
      return found;
    });
    return link;
  }

  UpdateMaxCongestionSteps(count_by_stage) {
    for (let i = 0; i < this.stages.length; i++) {
      this.stages[i].steps.forEach(step => {
        step.sub_steps.forEach(sub_step => {
          sub_step.latency = false;
          count_by_stage[i].steps_max_cong.some(index => {
            let found = false;
            if (index === sub_step.index) {
              found = true;
              sub_step.latency = true;
            }
            return found;
          });
        });
      });
    }
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
          let setError = false;
          if (
            measure.type === 'PRC' &&
            measure.session_count < measure.min_count
          ) {
            setError = true;
          } else if (
            measure.type === 'PCC' &&
            measure.transaction_count < measure.min_count
          ) {
            setError = true;
          } else if (measure.type === 'APP' || measure.type === 'FRT') {
            if (
              measure.error_percentage > measure.max_error_percentage ||
              measure.apdex_value < measure.min_apdex ||
              measure.response_value > measure.max_response_time
            ) {
              setError = true;
            }
          } else if (measure.type === 'SYN') {
            if (
              measure.success_percentage < measure.min_success_percentage ||
              measure.max_request_time > measure.max_avg_response_time ||
              measure.max_duration > measure.max_total_check_time
            ) {
              setError = true;
            }
          }
          if (setError) {
            touchpoint.relation_steps.forEach(rel => {
              steps_with_error[rel - 1] = 1;
            });
            this.SetTouchpointError(
              touchpoint.stage_index,
              touchpoint.touchpoint_index
            );
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
    }
    return 'good';
  }

  SetTouchpointError(stage_index, touchpoint_index) {
    this.stages[stage_index - 1].touchpoints.forEach(touchpoint => {
      if (touchpoint.index === touchpoint_index && !touchpoint.response_error) {
        touchpoint.error = true;
      }
    });
    this.stages[stage_index - 1].steps.forEach(step => {
      step.sub_steps.forEach(sub_step => {
        sub_step.relationship_touchpoints.forEach(value => {
          if (value === touchpoint_index) {
            if (
              this.CheckIfTouchpointIsResponding(stage_index, touchpoint_index)
            ) {
              sub_step.error = true;
            }
          }
        });
      });
    });
  }

  CheckIfTouchpointIsResponding(stage_index, touchpoint_index) {
    let response = false;
    this.stages[stage_index - 1].touchpoints.some(tp => {
      let found = false;
      if (tp.index === touchpoint_index) {
        found = true;
        response = !tp.response_error;
      }
      return found;
    });
    return response;
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
        documentId: 'touchpoints', // syntetics
        document: {
          TouchPoints: this.touchPoints
          // identificador de la lista q se esta creando junto con los id's
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
    let multyQuery = null;
    let accountID = this.accountId;
    this.configuration.pathpointVersion = this.version;
    this.configuration.kpis.length = 0;
    for (let i = 0; i < this.kpis.length; i++) {
      accountID = this.accountId;
      if (Reflect.has(this.kpis[i].queryByCity[this.city], 'accountID')) {
        accountID = this.kpis[i].queryByCity[this.city].accountID;
      }
      multyQuery = [
        {
          accountID: accountID,
          query: this.kpis[i].queryByCity[this.city].query,
          link: this.kpis[i].queryByCity[this.city].link
        }
      ];
      kpi = {
        type: this.kpis[i].type,
        name: this.kpis[i].name,
        shortName: this.kpis[i].shortName,
        measure: multyQuery,
        value_type: this.kpis[i].value_type,
        prefix: this.kpis[i].prefix,
        suffix: this.kpis[i].suffix
      };
      this.configuration.kpis.push(kpi);
    }
    this.configuration.stages.length = 0;
    this.stages.forEach(stage => {
      this.configuration.stages.push({
        title: stage.title,
        active_dotted: stage.active_dotted,
        arrowMode: stage.arrowMode,
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
    let accountID = this.accountId;
    let timeout = 10;
    let measure_time = this.TimeRangeTransform(this.timeRange);
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
              accountID = this.accountId;
              if (measure.measure_time) {
                measure_time = measure.measure_time;
              }
              if (measure.accountID) {
                accountID = measure.accountID;
              }
              if (measure.timeout) {
                timeout = measure.timeout;
              }
              if (measure.type === 'PRC') {
                queries.push({
                  type: this.measureNames[0],
                  accountID: accountID,
                  query: measure.query,
                  query_timeout: timeout,
                  min_count: measure.min_count,
                  max_count: measure.max_count,
                  measure_time: measure_time
                });
              } else if (measure.type === 'PCC') {
                queries.push({
                  type: this.measureNames[1],
                  accountID: accountID,
                  query: measure.query,
                  query_timeout: timeout,
                  min_count: measure.min_count,
                  max_count: measure.max_count,
                  measure_time: measure_time
                });
              } else if (measure.type === 'APP') {
                queries.push({
                  type: this.measureNames[2],
                  accountID: accountID,
                  query: measure.query,
                  query_timeout: timeout,
                  min_apdex: measure.min_apdex,
                  max_response_time: measure.max_response_time,
                  max_error_percentage: measure.max_error_percentage,
                  measure_time: measure_time
                });
              } else if (measure.type === 'FRT') {
                queries.push({
                  type: this.measureNames[3],
                  accountID: accountID,
                  query: measure.query,
                  query_timeout: timeout,
                  min_apdex: measure.min_apdex,
                  max_response_time: measure.max_response_time,
                  max_error_percentage: measure.max_error_percentage,
                  measure_time: measure_time
                });
              } else if (measure.type === 'SYN') {
                queries.push({
                  type: this.measureNames[4],
                  accountID: accountID,
                  query: measure.query,
                  query_timeout: timeout,
                  max_avg_response_time: measure.max_avg_response_time,
                  max_total_check_time: measure.max_total_check_time,
                  min_success_percentage: measure.min_success_percentage,
                  measure_time: measure_time
                });
              } else if (measure.type === 'WLD') {
                queries.push({
                  type: this.measureNames[5],
                  accountID: accountID,
                  query: measure.query,
                  query_timeout: timeout,
                  measure_time: measure_time
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

  SetConfigurationJSON(configuration) {
    this.configurationJSON = JSON.parse(configuration);
    this.UpdateNewConfiguration();
    this.AddCustomAccountIDs();
    const logRecord = {
      action: 'json-update',
      error: false,
      json_file: configuration
    };
    this.SendToLogs(logRecord);
    return {
      stages: this.stages,
      kpis: this.kpis
    };
  }

  UpdateNewConfiguration() {
    let stageDef = null;
    let sub_stepDef = null;
    let stepDef = null;
    let tpDef = null;
    let tpDef2 = null;
    let measure = null;
    let tpIndex = 1;
    let stageIndex = 1;
    let substepIndex = 1;
    this.stages.length = 0;
    this.touchPoints.length = 0;
    this.kpis = [];
    this.kpis.length = 0;
    let query_timeout = 10;
    this.touchPoints.push({
      index: 0,
      country: 'PRODUCTION',
      touchpoints: []
    });
    let ikpi = null;
    let index = 0;
    let queryByCity = null;
    this.configurationJSON.kpis.forEach(kpi => {
      ikpi = {
        index: index,
        type: kpi.type,
        name: kpi.name,
        shortName: kpi.shortName,
        value_type: kpi.value_type,
        prefix: kpi.prefix,
        suffix: kpi.suffix
      };
      if (kpi.measure[0].accountID !== this.accountId) {
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
      }
      this.kpis.push(ikpi);
    });
    this.configurationJSON.stages.forEach(stage => {
      stageDef = {
        index: stageIndex,
        title: stage.title,
        latencyStatus: false,
        status_color: 'good',
        gout_enable: false,
        gout_quantity: 150,
        gout_money: 250,
        money_enabled: false,
        trafficIconType: 'traffic',
        money: '',
        icon_active: 0,
        icon_description: 'star',
        icon_visible: false,
        congestion: {
          value: 0,
          percentage: 0
        },
        capacity: 0,
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
            sixth_sense: false,
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
          active: false,
          value: tp.title,
          highlighted: false,
          error: false,
          history_error: false,
          sixth_sense: false,
          sixth_sense_url: [[]],
          countrys: [0],
          dashboard_url: tp.dashboard_url,
          relation_steps: tp.related_steps.split(',')
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
          if (query.type === this.measureNames[0]) {
            measure = {
              type: 'PRC',
              query: query.query,
              timeout: query_timeout,
              min_count: query.min_count,
              max_count: Reflect.has(query, 'max_count')
                ? query.max_count
                : query.min_count * 2.0,
              session_count: 0
            };
          } else if (query.type === this.measureNames[1]) {
            measure = {
              type: 'PCC',
              query: query.query,
              timeout: query_timeout,
              min_count: query.min_count,
              max_count: Reflect.has(query, 'max_count')
                ? query.max_count
                : query.min_count * 2.0,
              transaction_count: 0
            };
          } else if (query.type === this.measureNames[2]) {
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
          } else if (query.type === this.measureNames[3]) {
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
          } else if (query.type === this.measureNames[4]) {
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
          } else if (query.type === this.measureNames[5]) {
            measure = {
              type: 'WLD',
              query: query.query,
              timeout: query_timeout,
              status_value: 'NO-VALUE'
            };
          }
          if (query.accountID !== this.accountId) {
            measure = { accountID: query.accountID, ...measure };
          }
          if (query.measure_time !== this.TimeRangeTransform(this.timeRange)) {
            measure = { ...measure, measure_time: query.measure_time };
          }
          tpDef2.measure_points.push(measure);
        });
        stageDef.touchpoints.push(tpDef);
        this.touchPoints[0].touchpoints.push(tpDef2);
        tpIndex++;
      });
      this.stages.push(stageDef);
      stageIndex++;
      tpIndex = 1;
    });
    this.UpdateTouchpointsRelationship();
    this.SetInitialDataViewToStorage();
    this.SetInitialDataTouchpointsToStorage();
    this.UpdateTouchpointCopy();
  }

  UpdateTouchpointsRelationship() {
    this.touchPoints[0].touchpoints.forEach(touchpoint => {
      const indexList = [];
      touchpoint.relation_steps.forEach(value => {
        indexList.push(this.GetIndexStep(touchpoint.stage_index, value));
      });
      touchpoint.relation_steps = indexList;
    });
    this.stages.forEach(stage => {
      stage.touchpoints.forEach(touchpoint => {
        const indexList = [];
        touchpoint.relation_steps.forEach(value => {
          indexList.push(this.GetIndexStep(touchpoint.stage_index, value));
        });
        touchpoint.relation_steps = indexList;
        this.SetStepsRelationship(
          touchpoint.stage_index,
          indexList,
          touchpoint.index
        );
      });
    });
  }

  GetIndexStep(stage_index, stepId) {
    let index = 0;
    this.stages[stage_index - 1].steps.some(step => {
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

  SetStepsRelationship(stage_index, indexList, touchpoint_index) {
    for (let i = 0; i < indexList.length; i++) {
      this.stages[stage_index - 1].steps.some(step => {
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

  SetInitialDataTouchpointsToStorage() {
    try {
      AccountStorageMutation.mutate({
        accountId: this.accountId,
        actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection: 'pathpoint',
        documentId: 'touchpoints',
        document: {
          TouchPoints: this.touchPoints
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  UpdateTouchpointCopy() {
    this.touchPointsCopy = JSON.parse(JSON.stringify(this.touchPoints));
  }

  GetCurrentHistoricErrorScript() {
    // console.log('Synthetic-AccountID:', this.SyntheticAccountID);
    const data = historicErrorScript(this.pathpointId);
    if (!this.SecureCredentialsExist) {
      data.header = `
      // Insert API Credentials
      // When the script was generated we were not able add secure credentials for your ingest and API key.
      // We strongly suggest you move these keys into the secure crendential store.
      //-----------------------------------------------------
      const myAccountID = ${this.SyntheticAccountID};
      const pathpointID = '${this.pathpointId}';
      const graphQLKey = '${this.SynConnector.userApiKey}';
      const myInsertKey = '${this.SynConnector.ingestLicense}';
    
    `;
    }
    const response = `
    ${data.header}
    ${this.InserTouchpointsToScript()}
    ${data.footer}`;
    return response;
  }

  async ReadHistoricErrors() {
    const query = `SELECT count(*) FROM PathpointHistoricErrors WHERE pathpoint_id='${this.pathpointId}' AND error is true FACET stage_index,touchpoint_index LIMIT MAX SINCE ${this.historicErrorsHours} hours ago`;
    const gql = `{
        actor { account(id: ${this.accountId}) {
            nrql(query: "${query}", timeout: 10) {
                results
            }
        }}}`;
    const { data, error } = await NerdGraphQuery.query({ query: gql });
    if (error) {
      throw new Error(error);
    }
    if (data && data.actor.account.nrql != null) {
      this.CalculateHistoricErrors(data.actor.account.nrql);
    }
    return {
      stages: this.stages
    };
  }

  CalculateHistoricErrors(nrql) {
    const results = nrql.results;
    let key = '';
    const historicErrors = {};
    let errorLength = 0;
    for (let i = 0; i < results.length; i++) {
      key = `tp_${results[i].facet[0]}_${results[i].facet[1]}`;
      errorLength++;
      historicErrors[key] = results[i].count;
    }
    const sortable = Object.fromEntries(
      Object.entries(historicErrors).sort(([, a], [, b]) => b - a)
    );
    const NumOfErrorsToShow = Math.round(
      (this.historicErrorsHighLightPercentage * errorLength) / 100
    );
    let count = 0;
    this.ClearTouchpointHistoricError();
    for (const [key] of Object.entries(sortable)) {
      count++;
      if (count <= NumOfErrorsToShow) {
        const c = key.split('_');
        this.SetTouchpointHistoricError(c[1], c[2]);
      }
    }
  }

  SetTouchpointHistoricError(stage_index, touchpoint_index) {
    this.stages.some(stage => {
      let found1 = false;
      if (
        !isNaN(parseInt(stage_index)) &&
        stage.index === parseInt(stage_index)
      ) {
        stage.touchpoints.some(touchpoint => {
          let found2 = false;
          if (
            !isNaN(parseInt(touchpoint_index)) &&
            touchpoint.index === parseInt(touchpoint_index)
          ) {
            touchpoint.history_error = true;
            found2 = true;
          }
          return found2;
        });
        found1 = true;
      }
      return found1;
    });
  }

  ClearTouchpointHistoricError() {
    this.stages.forEach(stage => {
      stage.touchpoints.forEach(touchpoint => {
        touchpoint.history_error = false;
      });
    });
  }

  InserTouchpointsToScript() {
    let totalTouchpoints = 0;
    const tp_per_group = 20;
    let newgroup = false;
    let data = `
    const touchpoints = [`;
    this.touchPoints.some(element => {
      let found = false;
      if (element.index === this.city) {
        let first_item = true;
        element.touchpoints.forEach(touchpoint => {
          if (
            touchpoint.status_on_off &&
            (touchpoint.measure_points[0].type === 'PRC' ||
              touchpoint.measure_points[0].type === 'PCC' ||
              touchpoint.measure_points[0].type === 'APP' ||
              touchpoint.measure_points[0].type === 'FRT' ||
              touchpoint.measure_points[0].type === 'SYN')
          ) {
            totalTouchpoints++;
            if (first_item) {
              if (newgroup) {
                data += `,`;
              }
              data += `
      [`;
              first_item = false;
            } else {
              data += `,`;
            }
            data += `
        {
          stage_index: ${touchpoint.stage_index},
          touchpoint_index: ${touchpoint.touchpoint_index},
          type: '${touchpoint.measure_points[0].type}',
          timeout: ${touchpoint.measure_points[0].timeout},
          query: "${touchpoint.measure_points[0].query}",`;
            let measureTime = '5 minutes ago';
            if (touchpoint.measure_points[0].measure_time) {
              measureTime = touchpoint.measure_points[0].measure_time;
            }
            data += `
          measure_time: '${measureTime}',`;
            switch (touchpoint.measure_points[0].type) {
              case 'PRC':
              case 'PCC':
                data += `
          min_count: ${touchpoint.measure_points[0].min_count}
        }`;
                break;
              case 'APP':
              case 'FRT':
                data += `
          min_apdex: ${touchpoint.measure_points[0].min_apdex},
          max_response_time: ${touchpoint.measure_points[0].max_response_time},
          max_error_percentage: ${touchpoint.measure_points[0].max_error_percentage}
        }`;
                break;
              case 'SYN':
                data += `
          max_avg_response_time: ${touchpoint.measure_points[0].max_avg_response_time},
          max_total_check_time: ${touchpoint.measure_points[0].max_total_check_time},
          min_success_percentage: ${touchpoint.measure_points[0].min_success_percentage},
        }`;
                break;
            }
            if (totalTouchpoints % tp_per_group === 0) {
              first_item = true;
              newgroup = true;
              data += `
      ]`;
            }
          }
        });
        found = true;
      }
      return found;
    });
    if (totalTouchpoints % tp_per_group === 0) {
      data += `
    ];`;
    } else {
      data += `
      ]
    ];`;
    }
    return data;
  }

  UpdateTouchpointOnOff(touchpoint, updateStorage) {
    this.touchPoints.some(element => {
      let found = false;
      if (element.index === this.city) {
        found = true;
        element.touchpoints.some(tp => {
          let found2 = false;
          if (
            tp.stage_index === touchpoint.stage_index &&
            tp.touchpoint_index === touchpoint.index
          ) {
            found2 = true;
            const logRecord = {
              action: 'touchpoint-enable-disable',
              error: false,
              touchpoint_name: touchpoint.value,
              touchpoint_type: tp.measure_points[0].type,
              stage_name: this.stages[tp.stage_index - 1].title,
              touchpoint_enabled: touchpoint.status_on_off
            };
            this.SendToLogs(logRecord);
            tp.status_on_off = touchpoint.status_on_off;
            if (updateStorage) {
              this.SetStorageTouchpoints();
            }
          }
          return found2;
        });
      }
      return found;
    });
  }

  GetTouchpointTune(touchpoint) {
    let datos = null;
    this.touchPoints.some(element => {
      let found1 = false;
      if (element.index === this.city) {
        found1 = true;
        element.touchpoints.some(tp => {
          let found2 = false;
          if (
            tp.stage_index === touchpoint.stage_index &&
            tp.touchpoint_index === touchpoint.index
          ) {
            found2 = true;
            datos = tp.measure_points;
          }
          return found2;
        });
      }
      return found1;
    });
    return datos;
  }

  GetTouchpointQuerys(touchpoint) {
    const datos = [];
    let accountID = this.accountId;
    this.touchPoints.some(element => {
      let found1 = false;
      if (element.index === this.city) {
        found1 = true;
        element.touchpoints.some(tp => {
          let found2 = false;
          if (
            tp.stage_index === touchpoint.stage_index &&
            tp.touchpoint_index === touchpoint.index
          ) {
            found2 = true;
            let actualValue = 0;
            tp.measure_points.forEach(measure => {
              accountID = this.accountId;
              if (measure.accountID) {
                accountID = measure.accountID;
              }
              if (measure.type === 'PRC') {
                datos.push({
                  accountID: accountID,
                  label: this.measureNames[0],
                  value: actualValue,
                  type: 'PRC',
                  query_start: '',
                  query_body: measure.query,
                  query_footer: this.ValidateMeasureTime(measure),
                  timeout: measure.timeout
                });
              } else if (measure.type === 'PCC') {
                datos.push({
                  accountID: accountID,
                  label: this.measureNames[1],
                  value: actualValue,
                  type: 'PCC',
                  query_start: '',
                  query_body: measure.query,
                  query_footer: this.ValidateMeasureTime(measure),
                  timeout: measure.timeout
                });
              } else if (measure.type === 'APP') {
                datos.push({
                  accountID: accountID,
                  label: this.measureNames[2],
                  value: actualValue,
                  type: 'APP',
                  query_start: '',
                  query_body: measure.query,
                  query_footer: this.ValidateMeasureTime(measure),
                  timeout: measure.timeout
                });
              } else if (measure.type === 'FRT') {
                datos.push({
                  accountID: accountID,
                  label: this.measureNames[3],
                  value: actualValue,
                  type: 'FRT',
                  query_start: '',
                  query_body: measure.query,
                  query_footer: this.ValidateMeasureTime(measure),
                  timeout: measure.timeout
                });
              } else if (measure.type === 'SYN') {
                datos.push({
                  accountID: accountID,
                  label: this.measureNames[4],
                  value: actualValue,
                  type: 'SYN',
                  query_start: '',
                  query_body: measure.query,
                  query_footer: this.ValidateMeasureTime(measure),
                  timeout: measure.timeout
                });
              } else if (measure.type === 'WLD') {
                datos.push({
                  accountID: accountID,
                  label: this.measureNames[5],
                  value: actualValue,
                  type: 'WLD',
                  query_start: '',
                  query_body: measure.query,
                  query_footer: '',
                  timeout: measure.timeout
                });
              }
              actualValue++;
            });
          }
          return found2;
        });
      }
      return found1;
    });
    return datos;
  }

  ValidateMeasureTime(measure) {
    if (measure.measure_time) {
      return `SINCE ${measure.measure_time}`;
    }
    return `SINCE ${this.TimeRangeTransform(this.timeRange)}`;
  }

  UpdateTouchpointTune(touchpoint, datos) {
    this.touchPoints.some(element => {
      let found = false;
      if (element.index === this.city) {
        found = true;
        element.touchpoints.some(tp => {
          let found2 = false;
          if (
            tp.stage_index === touchpoint.stage_index &&
            tp.touchpoint_index === touchpoint.index
          ) {
            found2 = true;
            const logRecord = {
              action: 'touchpoint-tune',
              message: datos,
              error: false,
              touchpoint_name: touchpoint.value,
              touchpoint_type: tp.measure_points[0].type,
              stage_name: this.stages[tp.stage_index - 1].title,
              touchpoint_enabled: touchpoint.status_on_off
            };
            this.SendToLogs(logRecord);
            switch (tp.measure_points[0].type) {
              case 'PRC':
              case 'PCC':
                tp.measure_points[0].min_count = parseInt(datos.min_count);
                tp.measure_points[0].max_count = parseInt(datos.max_count);
                break;
              case 'APP':
              case 'FRT':
                tp.measure_points[0].min_apdex = parseFloat(datos.min_apdex);
                tp.measure_points[0].max_response_time = parseFloat(
                  datos.max_response_time
                );
                tp.measure_points[0].max_error_percentage = parseFloat(
                  datos.max_error_percentage
                );
                break;
              case 'SYN':
                tp.measure_points[0].max_avg_response_time = parseFloat(
                  datos.max_avg_response_time
                );
                tp.measure_points[0].max_total_check_time = parseFloat(
                  datos.max_total_check_time
                );
                tp.measure_points[0].min_success_percentage = parseFloat(
                  datos.min_success_percentage
                );
                break;
            }
            this.SetStorageTouchpoints();
          }
          return found2;
        });
      }
      return found;
    });
  }

  UpdateTouchpointQuerys(touchpoint, datos) {
    // console.log('Updating Touchpoint',touchpoint,'DATOS',datos)
    this.touchPoints.some(element => {
      let found = false;
      if (element.index === this.city) {
        found = true;
        element.touchpoints.some(tp => {
          let found2 = false;
          if (
            tp.stage_index === touchpoint.stage_index &&
            tp.touchpoint_index === touchpoint.index
          ) {
            found2 = true;
            const logRecord = {
              action: 'touchpoint-update',
              message: datos,
              account_id: datos[0].accountID,
              query: datos[0].query_body,
              error: false,
              timeout: datos[0].timeout,
              touchpoint_name: touchpoint.value,
              touchpoint_type: tp.measure_points[0].type,
              stage_name: this.stages[tp.stage_index - 1].title,
              touchpoint_enabled: touchpoint.status_on_off
            };
            this.SendToLogs(logRecord);
            datos.forEach(dato => {
              this.UpdateMeasure(dato, tp.measure_points);
            });
            // console.log("measures:",tp.measure_points);
            this.SetStorageTouchpoints();
          }
          return found2;
        });
      }
      return found;
    });
  }

  UpdateMeasure(data, measure_points) {
    measure_points.some(measure => {
      let found = false;
      if (measure.type === data.type) {
        found = true;
        // console.log('Found AccountID:',data.accountID,'this.accid:',this.accountId, 'originalID:',measure.accountID)
        measure.accountID = data.accountID;
        measure.query = data.query_body;
        measure.timeout = data.timeout;
      }
      return found;
    });
  }

  UpdateGoutParameters(dropForm) {
    this.dropParams = dropForm;
    this.setStorageDropParams();
  }

  GetGoutParameters() {
    return this.dropParams;
  }

  setStorageDropParams() {
    try {
      AccountStorageMutation.mutate({
        accountId: this.accountId,
        actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection: 'pathpoint',
        documentId: 'DropParams',
        document: {
          dropParams: this.dropParams
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async GetStorageDropParams() {
    try {
      const { data } = await AccountStorageQuery.query({
        accountId: this.accountId,
        collection: 'pathpoint',
        documentId: 'DropParams'
      });
      if (data) {
        this.dropParams = data.dropParams;
      } else {
        this.dropParams = {
          dropmoney: 100,
          hours: 48,
          percentage: 30
        };
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  GetHistoricParameters() {
    const values = { hours: 0, percentage: 0 };
    values.hours = this.historicErrorsHours;
    values.percentage = this.historicErrorsHighLightPercentage;
    return values;
  }

  UpdateHistoricParameters(hours, percentage) {
    this.historicErrorsHours = hours;
    this.historicErrorsHighLightPercentage = percentage;
    this.SetStorageHistoricErrorsParams();
  }

  SetStorageHistoricErrorsParams() {
    try {
      AccountStorageMutation.mutate({
        accountId: this.accountId,
        actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection: 'pathpoint',
        documentId: 'HistoricErrorsParams',
        document: {
          historicErrorsHours: this.historicErrorsHours,
          historicErrorsHighLightPercentage: this
            .historicErrorsHighLightPercentage
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async GetStorageHistoricErrorsParams() {
    try {
      const { data } = await AccountStorageQuery.query({
        accountId: this.accountId,
        collection: 'pathpoint',
        documentId: 'HistoricErrorsParams'
      });
      if (data) {
        this.historicErrorsHours = data.historicErrorsHours;
        this.historicErrorsHighLightPercentage =
          data.historicErrorsHighLightPercentage;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  EnableDisableLogsConnector(status) {
    this.LogConnector.EnableDisable(status);
  }

  async SaveCredentialsInVault(credentials) {
    // Only Save Valid Keys
    // console.log('Saving Credentials:', credentials);
    if (
      credentials.ingestLicense &&
      credentials.ingestLicense.indexOf('xxxxxx') === -1
    ) {
      const check = await this.ValidateIngestLicense(credentials.ingestLicense);
      if (check) {
        this.NerdStorageVault.storeCredentialData(
          'ingestLicense',
          credentials.ingestLicense
        );
        this.LogConnector.SetLicenseKey(credentials.ingestLicense);
        this.SynConnector.SetLicenseKey(credentials.ingestLicense);
        this.CredentialConnector.SetLicenseKey(credentials.ingestLicense);
      }
    }
    if (
      credentials.userAPIKey &&
      credentials.userAPIKey.indexOf('xxxxxx') === -1
    ) {
      const check = await this.ValidateUserApiKey(credentials.userAPIKey);
      if (check) {
        this.NerdStorageVault.storeCredentialData(
          'userAPIKey',
          credentials.userAPIKey
        );
        this.SynConnector.SetUserApiKey(credentials.userAPIKey);
        this.CredentialConnector.SetUserApiKey(credentials.userAPIKey);
      }
    }
  }

  ResetCredentialsInVault() {
    this.NerdStorageVault.storeCredentialData('ingestLicense', '_');
    this.NerdStorageVault.storeCredentialData('userAPIKey', '_');
    this.CredentialConnector.DeleteCredentials();
  }

  SaveGeneralConfiguration(data) {
    try {
      // console.log('SavingGeneralConfiguration:', data);
      AccountStorageMutation.mutate({
        accountId: this.accountId,
        actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection: 'pathpoint',
        documentId: 'generalConfiguration',
        document: {
          dropTools: data.dropTools,
          flameTools: data.flameTools,
          loggin: data.loggin,
          accountId: data.accountId
        }
      });
      if (Reflect.has(data, 'loggin')) {
        this.EnableDisableLogsConnector(data.loggin);
      } else {
        // console.log('BAD-generalCofiguration');
      }
      if (Reflect.has(data, 'accountId')) {
        this.SyntheticAccountID = data.accountId;
        this.SynConnector.SetAccountID(data.accountId);
      }
      if (Reflect.has(data, 'flameTools')) {
        this.SynConnector.EnableDisableFlame(data.flameTools);
      }
      if (Reflect.has(data, 'dropTools')) {
        this.SynConnector.EnableDisableDrop(data.dropTools);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async GetGeneralConfiguration() {
    try {
      const { data } = await AccountStorageQuery.query({
        accountId: this.accountId,
        collection: 'pathpoint',
        documentId: 'generalConfiguration'
      });
      if (data) {
        this.generalConfiguration = data;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async ValidateIngestLicense(license) {
    const response = await this.LogConnector.ValidateIngestLicense(license);
    return response;
  }

  async ValidateUserApiKey(userApiKey) {
    const valid = await this.SynConnector.ValidateUserApiKey(userApiKey);
    return valid;
  }

  async InstallUpdateBackGroundScript() {
    // TODO Validate secure credentials
    this.SecureCredentialsExist = await this.CredentialConnector.CreateCredentials();
    const dataScript = this.GetCurrentHistoricErrorScript();
    const encodedScript = Buffer.from(dataScript).toString('base64');
    this.SynConnector.UpdateFlameMonitor(encodedScript);
  }
}
