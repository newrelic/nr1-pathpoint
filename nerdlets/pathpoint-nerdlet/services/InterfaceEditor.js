// IMPORT LIBRARIES
import { AccountStorageMutation, AccountStorageQuery } from 'nr1';

// DEFINE CLASS
export default class InterfaceEditor {
  constructor(accountId) {
    this.accountId = accountId;
  }

  async GetStagesInterface() {
    let stagesInterface = null;
    await new Promise(resolve => {
      AccountStorageQuery.query({
        accountId: this.accountId,
        collection: 'pathpoint',
        documentId: 'StagesInterface'
      }).then(({ data }) => {
        stagesInterface = data;
        return resolve();
      });
    });
    return stagesInterface;
  }

  async SetStagesInterface(stagesInterface) {
    await AccountStorageMutation.mutate({
      accountId: this.accountId,
      actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
      collection: 'pathpoint',
      documentId: 'StagesInterface',
      document: {
        ...stagesInterface
      }
    }).then(({ data }) => {
      return data;
    });
  }

  async GetTouchpoints() {
    try {
      const { data } = await AccountStorageQuery.query({
        accountId: this.accountId,
        collection: 'pathpoint',
        documentId: 'touchpoints'
      });
      return data;
    } catch (error) {
      /* istanbul ignore next */
      throw new Error(error);
    }
  }
}
