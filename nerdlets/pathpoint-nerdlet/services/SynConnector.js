import axios from 'axios';
import nr1 from '../../../nr1.json';
import env from '../../../.env.json';

export default class SynConnector {
  constructor() {
    this.pathpoint_id = nr1.id;
    this.accountId = 1;
    this.syntetic = null;
    this.axiosInstance = axios.create();
    this.userApiKey = '';
    this.ingestLicense = '';
    this.DropStatus = false;
    this.FlameStatus = false;
    this.uriSyntetic = env.synApiURL;
  }

  async ValidateUserApiKey(userApiKey) {
    try {
      await this.axiosInstance.get(this.uriSyntetic, {
        headers: {
          contentType: 'application/json',
          'Api-Key': userApiKey
        }
      });
      return true;
    } catch (error) {
      if (error.response.status === 401) {
        return false;
      } else {
        return true;
      }
    }
  }

  SetUserApiKey(key) {
    this.userApiKey = key;
  }

  SetLicenseKey(key) {
    this.ingestLicense = key;
  }

  SetAccountID(accountId) {
    this.accountId = accountId;
  }

  EnableDisableDrop(status) {
    this.DropStatus = status;
  }

  EnableDisableFlame(status) {
    this.FlameStatus = status;
  }

  async UpdateFlameMonitor(encodedScript) {
    if (
      !this.FlameStatus ||
      this.userApiKey === '' ||
      this.ingestLicense === ''
    ) {
      console.log('No hay Credenciales para actualizar el script');
      return 0;
    }
    const { searchResult, monitorID, error } = await this.ExistFlameScript();
    if (error) {
      console.log('Se produjo un ERROR y no se pudo continuar');
      return 0;
    }
    console.log('UpdateMonitor:', searchResult, '::', monitorID);
    let flameMonitorId = monitorID;
    if (!searchResult) {
      flameMonitorId = await this.CreateFlameScript();
      if (!flameMonitorId) {
        // intenta crearlo nuevamente
        console.log('Segundo Intento para crear Flame Script');
        flameMonitorId = await this.CreateFlameScript();
      }
      console.log('flameMonitorId:', flameMonitorId);
    }
    let response = '';
    if (flameMonitorId) {
      response = await this.UpdateFlameScript(encodedScript, flameMonitorId);
      if (response === 'ERROR') {
        // intenta una segunda vez
        console.log('Segundo Intento para actualizar Flame Script');
        response = await this.UpdateFlameScript(encodedScript, flameMonitorId);
      }
    }
    if (response === 204) {
      // TODO informar al cliente que se termino de actualizar el script
      console.log('Synthetic Script was Updated.');
    }
  }

  async ExistFlameScript() {
    const name = `Pathpoint-${this.pathpoint_id} Flame Script`;
    let searchResult = false;
    let monitorID = '';
    let error = null;
    try {
      const response = await this.axiosInstance.get(this.uriSyntetic, {
        headers: {
          contentType: 'application/json',
          'Api-Key': this.userApiKey
        }
      });
      if (
        response &&
        response.status &&
        response.status === 200 &&
        response.data &&
        response.data.monitors
      ) {
        // Se busaca en la lista de Monitores si existe el monitor de Flame
        response.data.monitors.some(monitor => {
          let found = false;
          if (monitor.name === name && monitor.type === 'SCRIPT_API') {
            monitorID = monitor.id;
            searchResult = true;
            found = true;
          }
          return found;
        });
      } else {
        error = true;
      }
      console.log('Validating MonitorID:', response);
      // remove the Fail entry from Nerdlet Storage
    } catch (error) {
      throw new Error(error);
    }

    return { searchResult, monitorID, error };
  }

  async CreateFlameScript() {
    console.log('Creating New Flame Script...');
    const FlameMonitor = {
      name: `Pathpoint-${this.pathpoint_id} Flame Script`,
      type: 'SCRIPT_API',
      frequency: 5,
      locations: ['AWS_CA_CENTRAL_1'],
      status: 'ENABLED',
      slaThreshold: 7.0,
      options: {}
    };
    if (this.FlameStatus && this.userApiKey !== '') {
      try {
        const response = await this.axiosInstance.post(
          this.uriSyntetic,
          FlameMonitor,
          {
            headers: {
              contentType: 'application/json',
              'Api-Key': this.userApiKey
            }
          }
        );
        console.log('Creation Rersults:', response);
        const arrayLocation = response.headers.location.split(
          'https://synthetics.newrelic.com/synthetics/api/v3/monitors/'
        );
        const monitorID = arrayLocation[1];
        return monitorID;
      } catch (error) {
        console.log('Creation Script Error:',error);
        throw new Error(error);
      }
    }
  }

  async UpdateFlameScript(encodedScript, flameMonitorId) {
    const scriptUdpdate = {
      scriptText: encodedScript
    };
    try {
      const response = await this.axiosInstance.put(
        `${this.uriSyntetic}/${flameMonitorId}/script`,
        scriptUdpdate,
        {
          headers: {
            contentType: 'application/json',
            'Api-Key': this.userApiKey
          }
        }
      );
      console.log('UPDATE SCRIPT RERSULT:', response);
      if (response.status) {
        return response.status;
      } else {
        return 'ERROR';
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
