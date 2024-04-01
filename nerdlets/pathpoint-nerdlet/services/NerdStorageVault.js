import { AccountStorageMutation, AccountStorageQuery } from 'nr1';

export default class NerdStorageVault {
  constructor(accountId) {
    this.accountId = accountId;
  }

  async getCredentialsData() {
    try {
      const credentials = {
        ingestLicense: null,
        userAPIKey: null
      };
      const v1 = await AccountStorageQuery.query({
        accountId: this.accountId,
        collection: 'pathpoint',
        documentId: 'ingestLicense'
      });
      // console.log('DATA1:', v1.data, 'AccountID:', this.accountId);
      if (v1.data) {
        credentials.ingestLicense = v1.data.value;
      }
      const v2 = await AccountStorageQuery.query({
        accountId: this.accountId,
        collection: 'pathpoint',
        documentId: 'userAPIKey'
      });
      // console.log('DATA2:', v2.data);
      if (v2.data) {
        credentials.userAPIKey = v2.data.value;
      }
      // console.log('GET CREDENTIALS:', credentials);
      return credentials;
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(error);
    }
  }

  async storeCredentialData(keySend, valueSend) {
    if (keySend === 'ingestLicense') {
      await this.storeIngestKey(valueSend);
    } else {
      await this.storeUserKey(valueSend);
    }
  }

  async storeIngestKey(key) {
    try {
      await AccountStorageMutation.mutate({
        accountId: this.accountId,
        actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection: 'pathpoint',
        documentId: 'ingestLicense',
        document: {
          value: key
        }
      });
      // console.log('STORE-userAPIKey:', key, 'AccountID:', this.accountId);
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(error);
    }
  }

  async storeUserKey(key) {
    try {
      await AccountStorageMutation.mutate({
        accountId: this.accountId,
        actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection: 'pathpoint',
        documentId: 'userAPIKey',
        document: {
          value: key
        }
      });
      // console.log('STORE-userAPIKey:', key, 'AccountID:', this.accountId);
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(error);
    }
  }
}
