import axios from 'axios';
import nr1 from '../../../nr1.json';
// import { AccountStorageMutation, AccountStorageQuery } from 'nr1';

export default class SynConnector {
  constructor() {
    this.pathpoint_id = nr1.id;
    this.buffer = [];
    this.accountId = 1;
    this.syntetic = null;
    this.axiosInstance = axios.create();
    // this.storageSyntetic = this.getSyntetic();
    this.apiKey = 'NRAK-XXXXXXXXXXXXXXX'; // viene del storage vault del nerdlet ---> credenciales
    this.arrayStorageSyn = [];
    this.uriSyntetic =
      'https://long-meadow-1713.rsamanez.workers.dev?https://synthetics.newrelic.com/synthetics/api/v3/monitors';
  }

  async ValidateUserApiKey(userApiKey) {
    try {
      await this.axiosInstance.post(
        this.uriSyntetic,
        {},
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
}
