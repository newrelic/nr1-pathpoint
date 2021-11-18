import axios from 'axios';
import nr1 from '../../../nr1.json';
// import { AccountStorageMutation, AccountStorageQuery } from 'nr1';

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
    this.uriSyntetic =
      'https://long-meadow-1713.rsamanez.workers.dev?https://synthetics.newrelic.com/synthetics/api/v3/monitors';
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
    console.log('SynConn:set-key:', key);
  }

  SetLicenseKey(key) {
    this.ingestLicense = key;
    console.log('SynConn:set-license-key:', key);
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
}
