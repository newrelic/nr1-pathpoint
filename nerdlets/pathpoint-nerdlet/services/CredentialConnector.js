import axios from 'axios';
import nr1 from '../../../nr1.json';
import env from '../../../.env.json';

export default class CredentialConnector {
  constructor() {
    this.pathpoint_id = nr1.id;
    this.accountId = 1;
    this.userApiKey = '';
    this.ingestLicense = '';
    this.axiosInstance = axios.create();
    this.uriCredential = env.synCredentialsApiURL;
    // 'https://long-meadow-1713.rsamanez.workers.dev?https://synthetics.newrelic.com/synthetics/api/v1/secure-credentials';
  }

  SetUserApiKey(key) {
    this.userApiKey = key;
    console.log('Syn-Credentials:set-user-key:', key);
  }

  SetLicenseKey(key) {
    this.ingestLicense = key;
    console.log('Syn-Credentials:set-license-key:', key);
  }

  SetAccountID(accountId) {
    this.accountId = accountId;
  }

  async FindCredential(credentialName) {
    console.log('Finding:', credentialName);
    try {
      const response = await this.axiosInstance.get(
        `${this.uriCredential}/${credentialName}`,
        {
          headers: {
            contentType: 'application/json',
            'Api-Key': this.userApiKey
          }
        }
      );
      if (
        response &&
        response.status &&
        response.status === 200 &&
        response.data &&
        response.data.key === credentialName
      ) {
        return true;
      }
      return false;
    } catch (error) {
      if (error.response.status === 404) {
        console.log('SECURE-KEY-NOT-FOUND:', credentialName);
      }
      return false;
    }
  }

  async FindSecureCredentials() {
    if (
      !this.accountId === 1 ||
      this.userApiKey === '' ||
      this.ingestLicense === ''
    ) {
      console.log('No hay Credenciales para Buscar Llaves');
      return 0;
    }
    const ppId = this.pathpoint_id.toUpperCase().replaceAll('-', '');
    const accountIdKey = await this.FindCredential(
      `PATHPOINT_${ppId}_ACCOUNTID`
    );
    const userApiKey = await this.FindCredential(
      `PATHPOINT_${ppId}_USER_API_KEY`
    );
    const ingestLicenseKey = await this.FindCredential(
      `PATHPOINT_${ppId}_INGEST_LICENSE`
    );
    return accountIdKey && userApiKey && ingestLicenseKey;
  }

  async CreateCredential(credentialName, credentialValue) {
    console.log('Creating new Key:', credentialName);
    const newCredential = {
      key: credentialName,
      value: credentialValue,
      description: 'Pathpopint Synthetics API Automation Credential'
    };
    try {
      const response = await this.axiosInstance.post(
        this.uriCredential,
        newCredential,
        {
          headers: {
            contentType: 'application/json',
            'Api-Key': this.userApiKey
          }
        }
      );
      if (
        response &&
        response.status &&
        response.status === 201 &&
        response.data === ''
      ) {
        console.log('Successfull credential created');
        return true;
      }
      console.log('Check the CODE...: response:', response);
      return false;
    } catch (error) {
      console.log('ERROR CREATING SECURE-KEY:', credentialName);
      return false;
    }
  }

  async CreateCredentials() {
    if (
      !this.accountId === 1 ||
      this.userApiKey === '' ||
      this.ingestLicense === ''
    ) {
      console.log('No hay Credenciales para Crear Llaves');
      return 0;
    }
    const ppId = this.pathpoint_id.toUpperCase().replaceAll('-', '');
    const accountIdKeyName = `PATHPOINT_${ppId}_ACCOUNTID`;
    let accountIdKey = await this.FindCredential(accountIdKeyName);
    if (!accountIdKey) {
      accountIdKey = await this.CreateCredential(
        accountIdKeyName,
        this.accountId
      );
    }
    const useApiKeyName = `PATHPOINT_${ppId}_USER_API_KEY`;
    let useApiKey = await this.FindCredential(useApiKeyName);
    if (!useApiKey) {
      useApiKey = await this.CreateCredential(useApiKeyName, this.userApiKey);
    }
    const ingestLicenseKeyName = `PATHPOINT_${ppId}_INGEST_LICENSE`;
    let ingestLicenseKey = await this.FindCredential(ingestLicenseKeyName);
    if (!ingestLicenseKey) {
      ingestLicenseKey = await this.CreateCredential(
        ingestLicenseKeyName,
        this.ingestLicense
      );
    }
    return accountIdKey && useApiKey && ingestLicenseKey;
  }
// ===================================================

  updateCredential(credential) {
    const apiKey = 'XXXX';
    this.axiosInstance
      .put(this.uriCredential + '/' + credential.key, credential.update, {
        headers: {
          contentType: 'application/json',
          'Api-Key': apiKey
        }
      })
      .then(resp => {
        console.log('entro then update');
        console.log('resp update:', resp);
      })
      .catch(error => {
        console.log('error update:', error);
      });
  }

  deleteCredential(credential) {
    const apiKey = 'XXXX';
    this.axiosInstance
      .delete(this.uriCredential + '/' + credential.key, {
        headers: {
          contentType: 'application/json',
          'Api-Key': apiKey
        }
      })
      .then(resp => {
        console.log('entro then delete');
        console.log('resp delete:', resp);
      })
      .catch(error => {
        console.log('error delete:', error);
      });
  }
}
