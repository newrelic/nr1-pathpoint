import axios from 'axios';
import nr1 from '../../../nr1.json';
// import { AccountStorageMutation, AccountStorageQuery } from 'nr1';

export default class SynConnector {
  constructor() {
    this.pathpoint_id = nr1.id;
    this.accountId = 1;
    this.syntetic = null;
    this.axiosInstance = axios.create();
    this.apiKey = ''; // viene del storage vault del nerdlet ---> credenciales
    this.DropStatus = false;
    this.FlameStatus = false;
    this.uriSyntetic =
      'https://long-meadow-1713.rsamanez.workers.dev?https://synthetics.newrelic.com/synthetics/api/v3/monitors';
  }

  async ValidateUserApiKey(userApiKey) {
    try {
      await this.axiosInstance.get(
        this.uriSyntetic,
        {
          headers: {
            contentType: 'application/json',
            'Api-Key': userApiKey
          }
        }
      );
      return true;
    } catch (error) {
      if (error.response.status === 401) {
        return false;
      } else {
        return true;
      }
    }
  }

  async SetLicenseKey(key) {
    const valid = await this.ValidateUserApiKey(key);
    if (valid) {
      this.apiKey = key;
      console.log('SynConn:set-key:', key);
    } else {
      console.log('SynConn:set-key: [INVALID-KEY]', key);
    }
  }

  EnableDisableDrop(status) {
    this.DropStatus = status;
  }

  EnableDisableFlame(status) {
    this.FlameStatus = status;
  }
}
