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
  }

  SetUserApiKey(key) {
    if (this.userApiKey !== '' && this.userApiKey !== key) {
      this.UpdateUserApiKeyCredential(key);
      console.log('UPDATING-API-USER-KEY');
    } else {
      console.log('Setting-API-USER-KEY');
    }
    this.userApiKey = key;
  }

  SetLicenseKey(key) {
    if (this.ingestLicense !== '' && this.ingestLicense !== key) {
      this.UpdateLicenseCredential(key);
      console.log('UPDATING-LICENSE-KEY');
    } else {
      console.log('Setting-LICENSE-KEY');
    }
    this.ingestLicense = key;
  }

  SetAccountID(accountId) {
    if (this.accountId !== 1 && this.accountId !== accountId) {
      this.UpdateAccountIdCredential(accountId);
      console.log('UPDATING-AccountID');
    } else {
      console.log('Setting-AccountID');
    }
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
    const ppId = this.pathpoint_id.toUpperCase().replace(/-/g, '');
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
      // console.log('Check the CODE...: response:', response);
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
    const ppId = this.pathpoint_id.toUpperCase().replace(/-/g, '');
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

  async DeleteCredential(credentialName) {
    try {
      const response = await this.axiosInstance.delete(
        `${this.uriCredential}/${credentialName}`,
        {
          headers: {
            contentType: 'application/json',
            'Api-Key': this.userApiKey
          }
        }
      );
      if (response && response.status && response.status === 204) {
        console.log('Credential Removed:', credentialName);
        return true;
      }
      console.log('Validar CODE:removing credentials:', credentialName);
      return false;
    } catch (error) {
      console.log('ERROR-removing-secure-credential:', credentialName);
      return false;
    }
  }

  async DeleteCredentials() {
    console.log('Removing Credentials...');
    let delAccId = false;
    let delUserKey = false;
    let delLicenseKey = false;
    const ppId = this.pathpoint_id.toUpperCase().replace(/-/g, '');
    if (await this.FindCredential(`PATHPOINT_${ppId}_ACCOUNTID`)) {
      delAccId = await this.DeleteCredential(`PATHPOINT_${ppId}_ACCOUNTID`);
    }
    if (await this.FindCredential(`PATHPOINT_${ppId}_USER_API_KEY`)) {
      delUserKey = await this.DeleteCredential(
        `PATHPOINT_${ppId}_USER_API_KEY`
      );
    }
    if (await this.FindCredential(`PATHPOINT_${ppId}_INGEST_LICENSE`)) {
      delLicenseKey = await this.DeleteCredential(
        `PATHPOINT_${ppId}_INGEST_LICENSE`
      );
    }
    if (delAccId) {
      this.accountId = 1;
    }
    if (delUserKey) {
      this.userApiKey = '';
    }
    if (delLicenseKey) {
      this.ingestLicense = '';
    }
  }

  async UpdateCredential(credentialName, credentialValue) {
    const newCredential = {
      key: credentialName,
      value: credentialValue,
      description: 'Pathpopint Synthetics API Automation Credential'
    };
    try {
      const response = await this.axiosInstance.put(
        `${this.uriCredential}/${credentialName}`,
        newCredential,
        {
          headers: {
            contentType: 'application/json',
            'Api-Key': this.userApiKey
          }
        }
      );
      if (response && response.status && response.status === 204) {
        console.log('Credential Updated:', credentialName);
        return true;
      }
      console.log('Validar CODE:Updating credentials:', credentialName);
      return false;
    } catch (error) {
      console.log('ERROR-updating-secure-credential:', credentialName);
      return false;
    }
  }

  async UpdateUserApiKeyCredential(newKey) {
    const ppId = this.pathpoint_id.toUpperCase().replace(/-/g, '');
    if (await this.FindCredential(`PATHPOINT_${ppId}_USER_API_KEY`)) {
      await this.UpdateCredential(`PATHPOINT_${ppId}_USER_API_KEY`, newKey);
    }
  }

  async UpdateAccountIdCredential(newKey) {
    const ppId = this.pathpoint_id.toUpperCase().replace(/-/g, '');
    if (await this.FindCredential(`PATHPOINT_${ppId}_ACCOUNTID`)) {
      await this.UpdateCredential(`PATHPOINT_${ppId}_ACCOUNTID`, newKey);
    }
  }

  async UpdateLicenseCredential(newKey) {
    const ppId = this.pathpoint_id.toUpperCase().replace(/-/g, '');
    if (await this.FindCredential(`PATHPOINT_${ppId}_INGEST_LICENSE`)) {
      await this.UpdateCredential(`PATHPOINT_${ppId}_INGEST_LICENSE`, newKey);
    }
  }

  async UpdateCredentials() {
    console.log('Updating Credentials...');
    const ppId = this.pathpoint_id.toUpperCase().replace(/-/g, '');
    if (await this.FindCredential(`PATHPOINT_${ppId}_ACCOUNTID`)) {
      await this.UpdateCredential(
        `PATHPOINT_${ppId}_ACCOUNTID`,
        this.accountId
      );
    }
    if (await this.FindCredential(`PATHPOINT_${ppId}_USER_API_KEY`)) {
      await this.UpdateCredential(
        `PATHPOINT_${ppId}_USER_API_KEY`,
        this.userApiKey
      );
    }
    if (await this.FindCredential(`PATHPOINT_${ppId}_INGEST_LICENSE`)) {
      await this.UpdateCredential(
        `PATHPOINT_${ppId}_INGEST_LICENSE`,
        this.ingestLicense
      );
    }
  }
}
