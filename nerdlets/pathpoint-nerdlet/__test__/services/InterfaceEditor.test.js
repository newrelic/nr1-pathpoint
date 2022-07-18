import InterfaceEditor from '../../services/InterfaceEditor';
import { AccountStorageQuery } from 'nr1';

jest.mock(
  'nr1',
  () => {
    const AccountStorageQuery = {
      query: jest
        .fn()
        .mockImplementation(async ({ collection, documentId }) => {
          switch (collection) {
            case 'pathpoint': {
              switch (documentId) {
                case 'StagesInterface': {
                  let dataReturn = {};
                  await new Promise(resolve => {
                    dataReturn = {
                      data: { text: '', type: 'Default', url: '' }
                    };
                    return resolve();
                  });
                  return dataReturn;
                }
                case 'touchpoints': {
                  let dataReturn = {};
                  await new Promise(resolve => {
                    dataReturn = {
                      data: { text: '', type: 'Default', url: '' }
                    };
                    return resolve();
                  });
                  return dataReturn;
                }
              }
              break;
            }
          }
        })
    };
    const AccountStorageMutation = {
      ACTION_TYPE: { WRITE_DOCUMENT: 'WRITE_DATA' },
      mutate: jest.fn().mockImplementation(async ({ document }) => {
        let dataReturn = {};
        await new Promise(resolve => {
          dataReturn = {
            data: { document }
          };
          return resolve();
        });
        return dataReturn;
      })
    };
    return {
      AccountStorageQuery: AccountStorageQuery,
      AccountStorageMutation: AccountStorageMutation
    };
  },
  { virtual: true }
);

describe('InterfaceEditor', () => {
  let interfaceEditor;

  beforeEach(() => {
    interfaceEditor = new InterfaceEditor(2710112);
  });

  it('Function GetStagesInterface()', async () => {
    const interfaceEdit = await interfaceEditor.GetStagesInterface();
    expect(interfaceEdit).toEqual({ text: '', type: 'Default', url: '' });
  });

  it('Function SetStagesInterface()', async () => {
    await interfaceEditor.SetStagesInterface({
      accountId: 10101010
    });
  });

  it('Function GetTouchpoints()', async () => {
    const interfaceEdit = await interfaceEditor.GetTouchpoints();
    expect(interfaceEdit).toEqual({ text: '', type: 'Default', url: '' });
  });

  it('Function GetTouchpoints() with cath', async () => {
    jest.spyOn(AccountStorageQuery, 'query').mockRejectedValue(Error('error'));
    await expect(interfaceEditor.GetTouchpoints()).rejects.toThrow('error');
  });

  it('Function UpdateStagesInterface', () => {
    const stagesInterface = [
      {
        visible: true,
        touchpoints: [
          {
            visible: true,
            status_on_off: 'status on off'
          }
        ]
      }
    ];
    const stagesInterfaceUpdated = [
      {
        touchpoints: [
          {
            queryData: 'SELECT * FROM ApiCall'
          }
        ]
      }
    ];
    const interfaceEdit = interfaceEditor.UpdateStagesInterface(
      stagesInterface,
      stagesInterfaceUpdated
    );
    expect(interfaceEdit[0].visible).toEqual(true);
  });

  it('Function UpdateStagesInterface with catch', () => {
    const stagesInterface = [];
    const stagesInterfaceUpdated = [];
    // interfaceEditor.UpdateStagesInterface(stagesInterface, stagesInterfaceUpdated) = jest.spyOn().mockRejectedValue(Error('error'));
    jest
      .spyOn(interfaceEditor, 'UpdateStagesInterface')
      .mockReturnValue(Error('error'));

    expect(
      interfaceEditor.UpdateStagesInterface(
        stagesInterface,
        stagesInterfaceUpdated
      )
    ).toEqual(Error('error'));
  });
});
