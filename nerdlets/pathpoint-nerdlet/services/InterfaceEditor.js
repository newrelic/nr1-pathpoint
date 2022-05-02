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

  UpdateStagesInterface(stagesInterface, stagesInterfaceUpdated) {
    let stageIndex = 0;
    let touchpointIndex = 0;
    try {
      if (stagesInterfaceUpdated) {
        stagesInterface.forEach(stage => {
          touchpointIndex = 0;
          if (stage.visible) {
            stage.touchpoints.forEach(tp => {
              if (tp.visible) {
                if (
                  stageIndex < stagesInterfaceUpdated.length &&
                  touchpointIndex <
                    stagesInterfaceUpdated[stageIndex].touchpoints.length &&
                  Reflect.has(
                    stagesInterfaceUpdated[stageIndex].touchpoints[
                      touchpointIndex
                    ],
                    'queryData'
                  )
                ) {
                  tp.queryData = {
                    ...stagesInterfaceUpdated[stageIndex].touchpoints[
                      touchpointIndex
                    ].queryData
                  };
                  tp.status_on_off =
                    stagesInterfaceUpdated[stageIndex].touchpoints[
                      touchpointIndex
                    ].status_on_off;
                }
                touchpointIndex++;
              }
            });
            stageIndex++;
          }
        });
      }
    } catch (error) {
      throw new Error(error);
    }
    return stagesInterface;
  }
}
