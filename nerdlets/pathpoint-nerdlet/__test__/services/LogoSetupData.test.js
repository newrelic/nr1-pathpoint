import LogoSetupData from '../../services/LogoSetupData';

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
                case 'logoSetupData': {
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

describe('LogoSetupData class', () => {
  let logoSetupData;

  beforeEach(() => {
    logoSetupData = new LogoSetupData();
  });

  it('Function GetLogoSetupData()', async () => {
    const logoDefault = await logoSetupData.GetLogoSetupData();
    expect(logoDefault).toEqual({ text: '', type: 'Default', url: '' });
  });

  it('Function SetLogoSetupData()', () => {
    logoSetupData.SetLogoSetupData({
      text: 'MILOGOTEST',
      type: 'Text',
      url: 'MILOGO'
    });
  });
});
