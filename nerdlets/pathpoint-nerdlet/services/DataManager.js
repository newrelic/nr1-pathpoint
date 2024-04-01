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
import AlertIssues from './AlertTouchpoints';

import LogConnector from './LogsConnector';
import SynConnector from './SynConnector';
import CredentialConnector from './CredentialConnector';

export function TimeRangeTransform(pointInTime, sinceClause) {
  let time_start = 0;
  let time_end = 0;
  let range_duration_minutes = 5;
  const _now_as_seconds = Math.floor(Date.now() / 1000);

  const stripped_clause = sinceClause
    ? sinceClause.replace(/^\s*SINCE\s*/i, '').split(/\s+/)
    : false;
  // Convert hours to minutes
  if (stripped_clause && stripped_clause.length >= 3) {
    range_duration_minutes = /hour[s]?/i.test(stripped_clause[1])
      ? stripped_clause[0] * 60
      : stripped_clause[0] * 1;
  }

  switch (pointInTime) {
    case '30 MINUTES AGO':
      time_start = _now_as_seconds - 30 * 60 - range_duration_minutes * 60;
      time_end = _now_as_seconds - 30 * 60;
      break;
    case '60 MINUTES AGO':
      time_start = _now_as_seconds - 60 * 60 - range_duration_minutes * 60;
      time_end = _now_as_seconds - 60 * 60;
      break;
    case '3 HOURS AGO':
      time_start = _now_as_seconds - 3 * 60 * 60 - range_duration_minutes * 60;
      time_end = _now_as_seconds - 3 * 60 * 60;
      break;
    case '6 HOURS AGO':
      time_start = _now_as_seconds - 6 * 60 * 60 - range_duration_minutes * 60;
      time_end = _now_as_seconds - 6 * 60 * 60;
      break;
    case '12 HOURS AGO':
      time_start = _now_as_seconds - 12 * 60 * 60 - range_duration_minutes * 60;
      time_end = _now_as_seconds - 12 * 60 * 60;
      break;
    case '24 HOURS AGO':
      time_start = _now_as_seconds - 24 * 60 * 60 - range_duration_minutes * 60;
      time_end = _now_as_seconds - 24 * 60 * 60;
      break;
    case '3 DAYS AGO':
      time_start =
        _now_as_seconds - 3 * 24 * 60 * 60 - range_duration_minutes * 60;
      time_end = _now_as_seconds - 3 * 24 * 60 * 60;
      break;
    case '7 DAYS AGO':
      time_start = _now_as_seconds - range_duration_minutes * 60;
      time_end = _now_as_seconds - 7 * 24 * 60 * 60;
      break;
    case '5 MINUTES AGO': // This really means "Now" and is labeled as such
      time_start = _now_as_seconds - range_duration_minutes * 60;
      time_end = _now_as_seconds;
      break;
    case 'Now': // This really means "Now" and is labeled as such
      time_start = _now_as_seconds - range_duration_minutes * 60;
      time_end = _now_as_seconds;
      break;
  }
  return `${time_start} UNTIL ${time_end}`;
}

// DEFINE THE REGULAR EXPRESION FOR MEASURE TIME
const regex_measure_time = /^((180|1[0-7][0-9]|[1-9][0-9]|[1-9])[\s]+minute[s]?|[1-3][\s]+hour[s]?)[\s]+ago/i;
export { regex_measure_time };

// DEFINE AND EXPORT CLASS
export default class DataManager {
  constructor(useEmulator) {
    this.useEmulator = useEmulator;
    this.timeRange = '5 MINUTES AGO';
    this.NerdStorageVault = new NerdStorageVault();
    this.LogConnector = new LogConnector();
    this.SynConnector = new SynConnector();
    this.CredentialConnector = new CredentialConnector();
    this.AlertIssues = new AlertIssues();
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
      'Alert-Check'
    ];
    this.accountIDs = [
      {
        name: 'NAME',
        id: 0
      }
    ];
    this.detaultTimeout = 10;
    this.alertsRefreshDelay = ViewData.alertsRefreshDelay ?? 5;
    this.alertsTimeWindow = ViewData.alertsTimeWindow ?? 120;
    this.measureAlertTouchpoints = false; // no carga la primera vez, para que el loading sea mas rapido
    this.alertTouchpointsErrorCount = [];
  }

  async BootstrapInitialData(accountName) {
    await this.GetAccountId(accountName);
    logger.log('Accounts::');
    this.accountIDs.forEach(account => {
      logger.log(`AccountName:${account.name}   ID:${account.id} `);
    });
    this.AlertIssues.SetAccountId(this.accountIDs);
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

    // console.log('Last storage version: ' + this.lastStorageVersion);

    this.version = appPackage.version;
    /*
      After Pathpoint 1.5.1 we had no more breaking changes.
      We must NEVER allow breaking config changes in Pathpoint 1.x.x
      We must always make things backward and forward compatible.

      If you want you may add logic like below:

      if ((this.lastStorageVersion) and (semver-compare(this.lastStorageVersion, "1.5.1") >=0) and (semver-compare(appPackage.version, "1.5.1") >=0 ) { use last stored}

      reference: https://www.npmjs.com/package/semver-compare

      For now this is okay...
    */
    if (this.lastStorageVersion) {
      // console.log('Re-using last stored configuration.');
      this.colors = ViewData.colors;
      await this.GetInitialDataFromStorage();
      await this.GetStorageTouchpoints();
    } else {
      // console.log('No Previous configuration found.  Loading demo config.');
      this.stages = ViewData.stages;
      this.colors = ViewData.colors;
      /* istanbul ignore next */
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

  async UpdateData(
    timeRange,
    city,
    stages,
    kpis,
    timeRangeKpi,
    alertsTimeWindow,
    alertsRefreshDelay
  ) {
    if (this.accountId !== null) {
      // console.log(`UPDATING-DATA: ${this.accountId}`);
      this.alertsTimeWindow = alertsTimeWindow;
      this.alertsRefreshDelay = alertsRefreshDelay;
      this.timeRange = timeRange;
      this.city = city;
      this.stages = stages;
      this.kpis = kpis;
      this.timeRangeKpi = timeRangeKpi;
      await this.TouchPointsUpdate();
      await this.UpdateMerchatKpi();
      this.CalculateUpdates();
      if (this.measureAlertTouchpoints) {
        this.stages = await this.AlertIssues.Measure(
          this.stages,
          this.touchPoints,
          alertsTimeWindow,
          alertsRefreshDelay
        );
        this.CheckAlertTouchpointsErrorDuration();
      }
      this.measureAlertTouchpoints = true;
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
      /* istanbul ignore next */
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
    this.kpis.forEach(kpi => {
      kpi.queryByCity.forEach(cityQuery => {
        if (Reflect.has(cityQuery, 'accountID')) {
          if (ids.indexOf('--' + cityQuery.accountID + '--') === -1) {
            ids += cityQuery.accountID + '--';
          }
        }
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
      /* istanbul ignore next */
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
      /* istanbul ignore next */
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
          Kpis: this.kpis,
          AlertsTimeWindow: this.alertsTimeWindow,
          AlertsRefreshDelay: this.alertsRefreshDelay
        }
      });
      this.AlertIssues.ClearLastStagesStatus();
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(error);
    }
  }

  SaveKpisSelection(kpis) {
    this.kpis = kpis;
    this.SetInitialDataViewToStorage();
  }

  GetStepsByStage() {
    try {
      const reply = [];
      let idx = 0;
      this.stages.forEach(stage => {
        if (stage.steps[stage.steps.length - 1]) {
          idx = stage.steps[stage.steps.length - 1].sub_steps.length - 1;
          reply.push(stage.steps[stage.steps.length - 1].sub_steps[idx].index);
        }
      });
      return reply;
    } catch (error) {
      throw new Error(error);
    }
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
      /* istanbul ignore next */
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
      /* istanbul ignore next */
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
                stageName: this.stages[touchpoint.stage_index - 1]
                  ? this.stages[touchpoint.stage_index - 1].title
                  : ''
              };
              // console.log(touchpoint.value);
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
      case 'API':
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
      case 'DRP':
        measure.value = 0;
        break;
      case 'APC':
        measure.api_count = 0;
        break;
      case 'APS':
        measure.success_percentage = 0;
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
    this.graphQlmeasures.push([
      measure,
      query
        .replace(/\r?\n|\r/g, ' ')
        .split('\\')
        .join('\\\\'),
      null
    ]);
    const currentEmulatorValue = this.useEmulator;
    this.useEmulator = false;
    await this.NRDBQuery();
    this.useEmulator = currentEmulatorValue;
    return measure;
  }

  FetchMeasure(measure, extraInfo = null) {
    this.ClearMeasure(measure);
    let query = '';

    if (measure.type === 'WLD') {
      if (!measure.measure_time) {
        measure.measure_time = '180 MINUTES AGO';
      }
    }

    if (measure.type === 'DRP') {
      query = `${measure.query} SINCE ${this.dropParams.hours} HOURS AGO`;
    } else if (measure.measure_time) {
      query = `${measure.query} SINCE ${TimeRangeTransform(
        this.timeRange,
        measure.measure_time
      )}`;
    } else {
      query = `${measure.query} SINCE ${TimeRangeTransform(
        this.timeRange,
        ''
      )}`;
    }
    // console.log(measure.measure_time);
    // console.log(query);

    this.graphQlmeasures.push([
      measure,
      query
        .replace(/\r?\n|\r/g, ' ')
        .split('\\')
        .join('\\\\'),
      extraInfo
    ]);
  }

  SendToLogs(logRecord) {
    this.LogConnector.SendLog(logRecord);
  }

  MakeLogingData(startMeasureTime, endMeasureTime, data, errors) {
    try {
      if (errors && errors.length > 0) {
        errors.forEach(error => {
          if (Reflect.has(error, 'path') && error.path) {
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
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(error);
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
    try {
      let data = null;
      let errors = null;
      if (this.useEmulator) {
        const results = this.EmulatorMeasures();
        data = results.data;
      } else {
        const startMeasureTime = Date.now();
        const results = await this.EvaluateMeasures();
        data = results.data;
        errors = results.errors;
        const endMeasureTime = Date.now();
        this.MakeLogingData(startMeasureTime, endMeasureTime, data, errors);
        if (results.n === 0) {
          return 0;
        }
        if (errors && errors.length > 0) {
          // console.log('NRDB-Error:', errors);
        }
      }
      // console.log('DATA', JSON.stringify(data));
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
                /* istanbul ignore next */
                measure.type === 'DRP' &&
                value.nrql !== null &&
                value.nrql.results &&
                value.nrql.results[0] &&
                Object.prototype.hasOwnProperty.call(
                  value.nrql.results[0],
                  'count'
                )
              ) {
                /* istanbul ignore next */
                if (value.nrql.results[0].count == null) {
                  this.CheckIfResponseErrorCanBeSet(extraInfo, true);
                }
                /* istanbul ignore next */
                measure.value = value.nrql.results[0].count;
              } else if (
                measure.type === 'APC' &&
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
                measure.api_count = value.nrql.results[0].count;
              } else if (
                measure.type === 'API' &&
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
                measure.type === 'APS' &&
                value.nrql !== null &&
                value.nrql.results &&
                value.nrql.results[0] &&
                Object.prototype.hasOwnProperty.call(
                  value.nrql.results[0],
                  'percentage'
                )
              ) {
                if (value.nrql.results[0].percentage == null) {
                  this.CheckIfResponseErrorCanBeSet(extraInfo, true);
                }
                measure.success_percentage = value.nrql.results[0].percentage;
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
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(error);
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

  EmulatorMeasures() {
    const data = { actor: null };
    let n = 0;
    let measure_result = null;
    this.graphQlmeasures.forEach(nrql => {
      const measure = `measure_${n}`;
      n++;
      switch (nrql[0].type) {
        case 'PRC':
          measure_result = {
            session: this.EmulateValue(nrql[0].session_count)
          };
          break;
        case 'PCC':
          measure_result = {
            count: this.EmulateValue(nrql[0].transaction_count)
          };
          break;
        case 'APP':
        case 'FRT':
        case 'API':
          measure_result = {
            apdex: {
              count: 0,
              score: 0,
              t: 0
            },
            error: this.EmulatePercentage(nrql[0].error_percentage, 10),
            response: this.EmulateValue(nrql[0].response_value),
            score: this.EmulateApdex(nrql[0].apdex_value)
          };
          break;
        case 'SYN':
          measure_result = {
            success: this.EmulatePercentage(nrql[0].success_percentage, 100),
            duration: this.EmulateValue(nrql[0].max_duration),
            request: this.EmulateValue(nrql[0].max_request_time)
          };
          break;
        case 'WLD':
          measure_result = {
            statusValue: this.EmulateWLD()
          };
          break;
        case 'DRP':
          measure_result = {
            count: this.EmulatePercentage(0, 10) * 10
          };
          break;
        case 'APC':
          measure_result = {
            count: this.EmulateValue(nrql[0].api_count)
          };
          break;
        case 'APS':
          measure_result = {
            percentage: this.EmulatePercentage(nrql[0].success_percentage, 100)
          };
          break;
        case 100:
          measure_result = {
            value: this.EmulateValue(nrql[0].value)
          };
          break;
        case 101:
          measure_result = [
            {
              comparison: 'current',
              value: this.EmulateValue(nrql[0].value.current)
            },
            {
              comparison: 'previous',
              value: this.EmulateValue(nrql[0].value.previous)
            }
          ];
          break;
      }
      data.actor = {
        ...data.actor,
        [measure]: {
          nrql: {
            results: nrql[0].type === 101 ? measure_result : [measure_result]
          }
        }
      };
    });

    return { data };
  }

  EmulateWLD() {
    const status = ['OPERATIONAL', 'DEGRADED', 'DISRUPTED', 'UNKNOWN'];
    let i = 0;
    const num = Math.floor(Math.random() * 100);
    if (num < 20) {
      i = Math.floor(Math.random() * 4);
    }
    return i < 4 ? status[i] : status[3];
  }

  EmulateValue(current) {
    if (current === 0) {
      return Math.floor(Math.random() * 10000);
    }
    return current + Math.floor(Math.random() * 2000) - 1000;
  }

  EmulatePercentage(current, acurate) {
    const num = Math.floor(Math.random() * 100);
    if (num < acurate) {
      let newValue = current + Math.floor(Math.random() * 20) - 10;
      if (newValue < 0) {
        newValue = 0;
      }
      return newValue <= 100 ? newValue : 100;
    }
    return current;
  }

  EmulateApdex(current) {
    if (current === 0) {
      return 0.8;
    }
    let value = current + (Math.floor(Math.random() * 200) - 100) / 10000;
    if (value < 0) {
      value = 0.1;
    }
    return value < 1 ? value : 1;
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
        const { data, error } = await NerdGraphQuery.query({
          query: gql
        }).catch(errors => {
          return { error: { errors: [errors] } };
        });
        if (data && data.actor)
          dataReturn.actor = Object.assign(dataReturn.actor, data.actor);
        if (error && error.length > 0) {
          const allErrors = [
            ...(error.errors ?? []),
            ...(error.graphQLErrors ?? [])
          ];
          allErrors.forEach(err => {
            if (err) {
              errorsReturn.push(err);
            }
          });
        }
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
      const { data, error } = await NerdGraphQuery.query({ query: gql }).catch(
        errors => {
          return { error: { errors: [errors] } };
        }
      );
      let allErrors = [];
      if (error) {
        allErrors = [...(error.errors ?? []), ...(error.graphQLErrors ?? [])];
      }
      return { data, n, errors: allErrors };
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
          this.kpis[i].queryByCity[this.city].query
            .replace(/\r?\n|\r/g, ' ')
            .split('\\')
            .join('\\\\') +
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
      this.stages[i].trafficIconType =
        this.stages[i].type === 'People' ? 'people' : 'traffic';

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

      this.stages[i].gout_quantity = values.count_by_stage[i].drop_count;
      this.stages[i].gout_money =
        values.count_by_stage[i].drop_count * this.dropParams.dropmoney;
    }
    this.UpdateMaxCongestionSteps(values.count_by_stage);
    this.UpdateDropSteps(element);
  }

  CheckAlertTouchpointsErrorDuration() {
    for (let i = 0; i < this.stages.length; i++) {
      this.stages[i].touchpoints.forEach(touchpoint => {
        if (
          touchpoint.type &&
          touchpoint.type === 'ALE' &&
          this.lensForm.duration &&
          this.lensForm.status === 'enable'
        ) {
          if (touchpoint.error === true) {
            const N = (this.lensForm.durationMin * 60000) / this.timeRefresh;
            if (
              this.alertTouchpointsErrorCount[`${i}-${touchpoint.value}`] ===
              undefined
            )
              this.alertTouchpointsErrorCount[`${i}-${touchpoint.value}`] = [];
            this.alertTouchpointsErrorCount[`${i}-${touchpoint.value}`].push(1);
            if (
              this.alertTouchpointsErrorCount[`${i}-${touchpoint.value}`]
                .length < N
            )
              touchpoint.error = false;
            if (
              this.alertTouchpointsErrorCount[`${i}-${touchpoint.value}`]
                .length >
              2 * N
            )
              this.alertTouchpointsErrorCount[`${i}-${touchpoint.value}`].pop();
          } else {
            // RESET touchpoint list errors
            this.alertTouchpointsErrorCount[`${i}-${touchpoint.value}`] = [];
          }
          // console.log('Touchpoint:[',touchpoint.value,']:',this.alertTouchpointsErrorCount[`${i}-${touchpoint.value}`].length);
        }
      });
    }
  }

  Getmeasures(touchpoints_by_country) {
    const tpc = [];
    while (tpc.length < this.stages.length) {
      const rec = {
        num_touchpoints: 0,
        total_count: 0,
        steps_indexes: [],
        total_congestion: 0,
        steps_max_cong: [],
        capacity_status: 'NO-VALUE',
        capacity_link: '',
        drop_count: 0
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
            // eslint-disable-next-line no-unused-expressions
            tpc[idx] ? tpc[idx].num_touchpoints++ : null;
            // eslint-disable-next-line no-unused-expressions
            tpc[idx] ? (tpc[idx].total_count += count) : null;
            if (measure.max_count < count) {
              tpc[idx].total_congestion += count - measure.max_count;
              tpc[idx].steps_max_cong = touchpoint.relation_steps;
            }
          }
          if (measure.type === 'APC') {
            // API-Count touchpoint add the header count and is used to calculate congestion
            count = measure.api_count;
            tpc[idx].num_touchpoints++;
            tpc[idx].total_count += count;
            if (measure.max_count < count) {
              tpc[idx].total_congestion += count - measure.max_count;
              tpc[idx].steps_max_cong = touchpoint.relation_steps;
            }
          }
          if (measure.type === 'WLD') {
            // eslint-disable-next-line no-unused-expressions
            tpc[idx] ? (tpc[idx].capacity_status = measure.status_value) : null;
            // eslint-disable-next-line no-unused-expressions
            tpc[idx]
              ? (tpc[idx].capacity_link = this.GetWokloadTouchpointLink(
                  touchpoint
                ))
              : null;
          }
          if (measure.type === 'DRP') {
            // eslint-disable-next-line no-unused-expressions
            tpc[idx] ? (tpc[idx].drop_count += measure.value) : null;
          }
        });
      }
    });
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

  ClearDropSteps() {
    for (let i = 0; i < this.stages.length; i++) {
      this.stages[i].steps.forEach(step => {
        step.sub_steps.forEach(sub_step => {
          sub_step.dark = false;
        });
      });
    }
  }

  SetSubStepDark(stage_index, touchpoint_index) {
    this.stages[stage_index - 1].steps.forEach(step => {
      step.sub_steps.forEach(sub_step => {
        sub_step.relationship_touchpoints.forEach(value => {
          if (value === touchpoint_index) {
            sub_step.dark = true;
          }
        });
      });
    });
  }

  UpdateDropSteps(element) {
    // Clear Drop Steps
    this.ClearDropSteps();
    for (let stageIndex = 1; stageIndex <= this.stages.length; stageIndex++) {
      element.touchpoints.forEach(touchpoint => {
        if (touchpoint.stage_index === stageIndex && touchpoint.status_on_off) {
          touchpoint.measure_points.forEach(measure => {
            let setError = false;
            if (measure.type === 'DRP' && measure.value > 0) {
              setError = true;
            }
            if (setError) {
              this.SetSubStepDark(
                touchpoint.stage_index,
                touchpoint.touchpoint_index
              );
            }
          });
        }
      });
    }
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
          } else if (
            measure.type === 'APP' ||
            measure.type === 'FRT' ||
            measure.type === 'API'
          ) {
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
          } else if (
            measure.type === 'APC' &&
            measure.api_count < measure.min_count
          ) {
            setError = true;
          } else if (
            measure.type === 'APS' &&
            measure.success_percentage < measure.min_success_percentage
          ) {
            setError = true;
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
      /* istanbul ignore next */
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
      /* istanbul ignore next */
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
      /* istanbul ignore next */
      throw new Error(error);
    }
  }

  UpdateCanaryData(data) {
    this.SaveCanaryData(data);
  }

  GetCurrentConfigurationJSON(withValues = false) {
    this.ReadPathpointConfig(withValues);
    return JSON.stringify(this.configuration, null, 4);
  }

  ReadPathpointConfig(withValues) {
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
        type: stage.type,
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
          queries: this.GetTouchpointQueryes(
            tp.stage_index,
            tp.index,
            withValues
          )
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

  GetTouchpointQueryes(stage_index, index, withValues) {
    const queries = [];
    let accountID = this.accountId;
    let timeout = 10;
    let measure_time;
    let queryMeasure = null;
    const measure_time_default = '5 MINUTES AGO';
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

              measure_time = measure.measure_time;
              if (!measure.measure_time) {
                measure_time = measure_time_default;
              }

              if (measure.accountID) {
                accountID = measure.accountID;
              }
              if (measure.timeout) {
                timeout = measure.timeout;
              }
              queryMeasure = {
                accountID: accountID,
                query: measure.query,
                query_timeout: timeout,
                measure_time: measure_time
              };
              if (measure.type === 'PRC') {
                queryMeasure = {
                  ...queryMeasure,
                  type: this.measureNames[0],
                  min_count: measure.min_count,
                  max_count: measure.max_count
                };
                if (withValues) {
                  queryMeasure = {
                    ...queryMeasure,
                    session_count: measure.session_count
                      ? measure.session_count
                      : 0
                  };
                }
              } else if (measure.type === 'PCC') {
                queryMeasure = {
                  ...queryMeasure,
                  type: this.measureNames[1],
                  min_count: measure.min_count,
                  max_count: measure.max_count
                };
                if (withValues) {
                  queryMeasure = {
                    ...queryMeasure,
                    transaction_count: measure.transaction_count
                      ? measure.transaction_count
                      : 0
                  };
                }
              } else if (measure.type === 'APP') {
                queryMeasure = {
                  ...queryMeasure,
                  type: this.measureNames[2],
                  min_apdex: measure.min_apdex,
                  max_response_time: measure.max_response_time,
                  max_error_percentage: measure.max_error_percentage
                };
                if (withValues) {
                  queryMeasure = {
                    ...queryMeasure,
                    apdex_value: measure.apdex_value ? measure.apdex_value : 0,
                    response_value: measure.response_value
                      ? measure.response_value
                      : 0,
                    error_percentage: measure.error_percentage
                      ? measure.error_percentage
                      : 0
                  };
                }
              } else if (measure.type === 'FRT') {
                queryMeasure = {
                  ...queryMeasure,
                  type: this.measureNames[3],
                  min_apdex: measure.min_apdex,
                  max_response_time: measure.max_response_time,
                  max_error_percentage: measure.max_error_percentage
                };
                if (withValues) {
                  queryMeasure = {
                    ...queryMeasure,
                    apdex_value: measure.apdex_value ? measure.apdex_value : 0,
                    response_value: measure.response_value
                      ? measure.response_value
                      : 0,
                    error_percentage: measure.error_percentage
                      ? measure.error_percentage
                      : 0
                  };
                }
              } else if (measure.type === 'SYN') {
                queryMeasure = {
                  ...queryMeasure,
                  type: this.measureNames[4],
                  max_avg_response_time: measure.max_avg_response_time,
                  max_total_check_time: measure.max_total_check_time,
                  min_success_percentage: measure.min_success_percentage
                };
                if (withValues) {
                  queryMeasure = {
                    ...queryMeasure,
                    max_request_time: measure.max_request_time
                      ? measure.max_request_time
                      : 0,
                    max_duration: measure.max_duration
                      ? measure.max_duration
                      : 0,
                    success_percentage: measure.success_percentage
                      ? measure.success_percentage
                      : 0
                  };
                }
              } else if (measure.type === 'WLD') {
                queryMeasure = {
                  ...queryMeasure,
                  type: this.measureNames[5]
                };
              } else if (measure.type === 'DRP') {
                queryMeasure = {
                  ...queryMeasure,
                  type: this.measureNames[6],
                  measure_time: `${this.dropParams.hours} HOURS AGO`
                };
              } else if (measure.type === 'API') {
                queryMeasure = {
                  ...queryMeasure,
                  type: this.measureNames[7],
                  min_apdex: measure.min_apdex,
                  max_response_time: measure.max_response_time,
                  max_error_percentage: measure.max_error_percentage
                };
                if (withValues) {
                  queryMeasure = {
                    ...queryMeasure,
                    apdex_value: measure.apdex_value ? measure.apdex_value : 0,
                    response_value: measure.response_value
                      ? measure.response_value
                      : 0,
                    error_percentage: measure.error_percentage
                      ? measure.error_percentage
                      : 0
                  };
                }
              } else if (measure.type === 'APC') {
                queryMeasure = {
                  ...queryMeasure,
                  type: this.measureNames[8],
                  min_count: measure.min_count,
                  max_count: measure.max_count
                };
                if (withValues) {
                  queryMeasure = {
                    ...queryMeasure,
                    api_count: measure.api_count ? measure.api_count : 0
                  };
                }
              } else if (measure.type === 'APS') {
                queryMeasure = {
                  ...queryMeasure,
                  type: this.measureNames[9],
                  min_success_percentage: measure.min_success_percentage
                };
                if (withValues) {
                  queryMeasure = {
                    ...queryMeasure,
                    success_percentage: measure.success_percentage
                      ? measure.success_percentage
                      : 0
                  };
                }
              }
              queries.push(queryMeasure);
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
    this.AlertIssues.ClearLastStagesStatus();
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
    let query_measure_time = '';

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
          if (query.measure_time) {
            query_measure_time = query.measure_time;
          }
          if (
            query.type === this.measureNames[0] ||
            query.type === 'PRC-COUNT-QUERY'
          ) {
            measure = {
              type: 'PRC',
              query: query.query,
              timeout: query_timeout,
              measure_time: query_measure_time,
              min_count: query.min_count,
              max_count: Reflect.has(query, 'max_count')
                ? query.max_count
                : query.min_count * 1.5,
              session_count: 0
            };
          } else if (
            query.type === this.measureNames[1] ||
            query.type === 'PCC-COUNT-QUERY'
          ) {
            measure = {
              type: 'PCC',
              query: query.query,
              timeout: query_timeout,
              measure_time: query_measure_time,
              min_count: query.min_count,
              max_count: Reflect.has(query, 'max_count')
                ? query.max_count
                : query.min_count * 1.5,
              transaction_count: 0
            };
          } else if (
            query.type === this.measureNames[2] ||
            query.type === 'APP-HEALTH-QUERY'
          ) {
            measure = {
              type: 'APP',
              query: query.query,
              timeout: query_timeout,
              measure_time: query_measure_time,
              min_apdex: query.min_apdex,
              max_response_time: query.max_response_time,
              max_error_percentage: query.max_error_percentage,
              apdex_value: 0,
              response_value: 0,
              error_percentage: 0
            };
          } else if (
            query.type === this.measureNames[3] ||
            query.type === 'FRT-HEALTH-QUERY'
          ) {
            measure = {
              type: 'FRT',
              query: query.query,
              timeout: query_timeout,
              measure_time: query_measure_time,
              min_apdex: query.min_apdex,
              max_response_time: query.max_response_time,
              max_error_percentage: query.max_error_percentage,
              apdex_value: 0,
              response_value: 0,
              error_percentage: 0
            };
          } else if (
            query.type === this.measureNames[4] ||
            query.type === 'SYN-CHECK-QUERY'
          ) {
            measure = {
              type: 'SYN',
              query: query.query,
              timeout: query_timeout,
              measure_time: query_measure_time,
              max_avg_response_time: query.max_avg_response_time,
              max_total_check_time: query.max_total_check_time,
              min_success_percentage: query.min_success_percentage,
              success_percentage: 0,
              max_duration: 0,
              max_request_time: 0
            };
          } else if (
            query.type === this.measureNames[5] ||
            query.type === 'WORKLOAD-QUERY'
          ) {
            measure = {
              type: 'WLD',
              query: query.query,
              measure_time: query_measure_time,
              timeout: query_timeout,
              status_value: 'NO-VALUE'
            };
          } else if (
            query.type === this.measureNames[6] ||
            query.type === 'DROP-QUERY'
          ) {
            measure = {
              type: 'DRP',
              query: query.query,
              timeout: query_timeout,
              value: 0
            };
          } else if (query.type === this.measureNames[7]) {
            measure = {
              type: 'API',
              query: query.query,
              timeout: query_timeout,
              measure_time: query_measure_time,
              min_apdex: query.min_apdex,
              max_response_time: query.max_response_time,
              max_error_percentage: query.max_error_percentage,
              apdex_value: 0,
              response_value: 0,
              error_percentage: 0
            };
          } else if (query.type === this.measureNames[8]) {
            measure = {
              type: 'APC',
              query: query.query,
              timeout: query_timeout,
              measure_time: query_measure_time,
              min_count: query.min_count,
              max_count: query.max_count,
              api_count: 0
            };
          } else if (query.type === this.measureNames[9]) {
            measure = {
              type: 'APS',
              query: query.query,
              timeout: query_timeout,
              measure_time: query_measure_time,
              min_success_percentage: query.min_success_percentage,
              success_percentage: 0
            };
          }
          measure = { accountID: query.accountID, ...measure };
          /*
           if (query.measure_time !== TimeRangeTransform(this.timeRange)) {
            measure = { ...measure, measure_time: query.measure_time };
          }
          JIM HAGAN
          */
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
      let index = 0;
      touchpoint.relation_steps.forEach(value => {
        index = this.GetIndexStep(touchpoint.stage_index, value);
        if (index !== 0) {
          indexList.push(index);
        }
      });
      touchpoint.relation_steps = indexList;
    });
    this.stages.forEach(stage => {
      stage.touchpoints.forEach(touchpoint => {
        const indexList = [];
        let index = 0;
        touchpoint.relation_steps.forEach(value => {
          index = this.GetIndexStep(touchpoint.stage_index, value);
          if (index !== 0) {
            indexList.push(index);
          }
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

  /* istanbul ignore next */
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
      /* istanbul ignore next */
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

  /* istanbul ignore next */
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
      /* istanbul ignore next */
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
            /* istanbul ignore next */
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
            /* istanbul ignore next */
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
    /* istanbul ignore next */
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
    this.AlertIssues.ClearLastStagesStatus();
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
                  query_footer2: this.GetDisplayMeasureTime(measure),
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
                  query_footer2: this.GetDisplayMeasureTime(measure),
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
                  query_footer2: this.GetDisplayMeasureTime(measure),
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
                  query_footer2: this.GetDisplayMeasureTime(measure),
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
                  query_footer2: this.GetDisplayMeasureTime(measure),
                  timeout: measure.timeout
                });
              } else if (measure.type === 'WLD') {
                if (!measure.measure_time) {
                  measure.measure_time = '180 MINUTES AGO';
                }
                datos.push({
                  accountID: accountID,
                  label: this.measureNames[5],
                  value: actualValue,
                  type: 'WLD',
                  query_start: '',
                  query_body: measure.query,
                  query_footer: this.ValidateMeasureTime(measure),
                  query_footer2: this.GetDisplayMeasureTime(measure),
                  timeout: measure.timeout
                });
              } else if (measure.type === 'DRP') {
                datos.push({
                  accountID: accountID,
                  label: this.measureNames[6],
                  value: actualValue,
                  type: 'DRP',
                  query_start: '',
                  query_body: measure.query,
                  query_footer: Reflect.has(measure, 'measure_time')
                    ? `SINCE ${measure.measure_time}`
                    : `SINCE ${this.dropParams.hours} HOURS AGO`,
                  timeout: measure.timeout
                });
              } else if (measure.type === 'API') {
                datos.push({
                  accountID: accountID,
                  label: this.measureNames[7],
                  value: actualValue,
                  type: 'API',
                  query_start: '',
                  query_body: measure.query,
                  query_footer: this.ValidateMeasureTime(measure),
                  query_footer2: this.GetDisplayMeasureTime(measure),
                  timeout: measure.timeout
                });
              } else if (measure.type === 'APC') {
                datos.push({
                  accountID: accountID,
                  label: this.measureNames[8],
                  value: actualValue,
                  type: 'APC',
                  query_start: '',
                  query_body: measure.query,
                  query_footer: this.ValidateMeasureTime(measure),
                  query_footer2: this.GetDisplayMeasureTime(measure),
                  timeout: measure.timeout
                });
              } else if (measure.type === 'APS') {
                datos.push({
                  accountID: accountID,
                  label: this.measureNames[9],
                  value: actualValue,
                  type: 'APS',
                  query_start: '',
                  query_body: measure.query,
                  query_footer: this.ValidateMeasureTime(measure),
                  query_footer2: this.GetDisplayMeasureTime(measure),
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
    // if (measure.measure_time) {
    //  return `SINCE ${measure.measure_time}`;
    // }
    return `SINCE ${TimeRangeTransform(this.timeRange, measure.measure_time)}`;
  }

  GetDisplayMeasureTime(measure) {
    const absolute_range = `${TimeRangeTransform(
      this.timeRange,
      measure.measure_time
    )}`;
    const result = absolute_range.trim().split(/\s+/);
    const t1 = new Date(parseInt(result[0]) * 1000);
    const t2 = new Date(parseInt(result[2]) * 1000);

    return ` //(${t1.toLocaleDateString()} ${t1.toLocaleTimeString()} to ${t2.toLocaleDateString()} ${t2.toLocaleTimeString()})`;
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
              case 'APC':
                tp.measure_points[0].min_count = parseInt(datos.min_count);
                tp.measure_points[0].max_count = parseInt(datos.max_count);
                break;
              case 'APP':
              case 'FRT':
              case 'API':
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
              case 'APS':
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
    this.AlertIssues.ClearLastStagesStatus();
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
    this.AlertIssues.ClearLastStagesStatus();
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

  /* istanbul ignore next */
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
      /* istanbul ignore next */
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
      /* istanbul ignore next */
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

  /* istanbul ignore next */
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
      /* istanbul ignore next */
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
      /* istanbul ignore next */
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
      /* istanbul ignore next */
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
      /* istanbul ignore next */
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

  /* istanbul ignore next */
  async GetHistoricJSONData() {
    try {
      const { data } = await AccountStorageQuery.query({
        accountId: this.accountId,
        collection: 'pathpoint',
        documentId: 'JSONDataInHistoric'
      });
      let historic = [];
      if (data) {
        historic = [...data.historic];
      }
      return historic;
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(error);
    }
  }

  /* istanbul ignore next */
  async StorageJSONDataInHistoric(payload) {
    try {
      const { data } = await AccountStorageQuery.query({
        accountId: this.accountId,
        collection: 'pathpoint',
        documentId: 'JSONDataInHistoric'
      });
      let historic = [];
      if (data) {
        historic = [...data.historic];
      }
      historic.push(payload);
      AccountStorageMutation.mutate({
        accountId: this.accountId,
        actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection: 'pathpoint',
        documentId: 'JSONDataInHistoric',
        document: {
          historic
        }
      });
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(error);
    }
  }
}
