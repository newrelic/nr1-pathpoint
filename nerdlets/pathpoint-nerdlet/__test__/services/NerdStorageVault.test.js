import NerdStorageVault from '../../services/NerdStorageVault';

jest.mock(
  'nr1',
  () => {
    const AccountStorageMutation = {
      ACTION_TYPE: { WRITE_DOCUMENT: 'WRITE_DATA' },
      mutate: jest.fn().mockImplementation(() => {
        return { data: {} };
      })
    };
    const AccountStorageQuery = {
      query: jest
        .fn()
        .mockImplementation(({ accountId, collection, documentId }) => {
          switch (collection) {
            case 'pathpoint': {
              switch (documentId) {
                case 'ingestLicense':
                  return { data: { value: 'xxx-yyy-zzz-www' } };
                case 'userAPIKey':
                  return { data: { value: 'uuu-www-zzz-qqq' } };
              }
              break;
            }
          }
          return accountId;
        })
    };
    return {
      AccountStorageQuery: AccountStorageQuery,
      AccountStorageMutation: AccountStorageMutation
    };
  },
  { virtual: true }
);
describe('NerdStorageVault', () => {
  let nerdStorageVault;
  beforeEach(() => {
    nerdStorageVault = new NerdStorageVault();
  });

  it('Function getCredentialsData()', async () => {
    const credentials = await nerdStorageVault.getCredentialsData();
    expect(credentials).toEqual({
      ingestLicense: 'xxx-yyy-zzz-www',
      userAPIKey: 'uuu-www-zzz-qqq'
    });
  });

  it('Function storeCredentialData() insert ingestLicense', async () => {
    const keySend = 'ingestLicense';
    const valueSend = 'test123';
    nerdStorageVault.storeIngestKey = await jest.fn();
    nerdStorageVault.storeUserKey = await jest.fn();
    await nerdStorageVault.storeCredentialData(keySend, valueSend);
    expect(nerdStorageVault.storeIngestKey).toHaveBeenCalledTimes(1);
    expect(nerdStorageVault.storeUserKey).toHaveBeenCalledTimes(0);
  });

  it('Function storeCredentialData() insert userAPIKey', async () => {
    const keySend = 'userAPIKey';
    const valueSend = 'test123';
    nerdStorageVault.storeIngestKey = await jest.fn();
    nerdStorageVault.storeUserKey = await jest.fn();
    await nerdStorageVault.storeCredentialData(keySend, valueSend);
    expect(nerdStorageVault.storeIngestKey).toHaveBeenCalledTimes(0);
    expect(nerdStorageVault.storeUserKey).toHaveBeenCalledTimes(1);
  });
});
