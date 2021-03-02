// IMPORT LIBRARIES
import { AccountStorageMutation, AccountStorageQuery } from 'nr1';

// DEFINE CLASS
export default class LogoSetupData {
  constructor(accountId) {
    this.accountId = accountId;
  }

  async GetLogoSetupData() {
    let logoSetup = null;
    await new Promise(resolve => {
      AccountStorageQuery.query({
        accountId: this.accountId,
        collection: 'pathpoint',
        documentId: 'logoSetupData'
      }).then(({ data }) => {
        logoSetup = data;
        return resolve();
      });
    });
    return logoSetup;
  }

  SetLogoSetupData(logoSetup) {
    AccountStorageMutation.mutate({
      accountId: this.accountId,
      actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
      collection: 'pathpoint',
      documentId: 'logoSetupData',
      document: {
        ...logoSetup
      }
    }).then(({ data }) => {
      return data;
    });
  }
}
