import NerdStorageVault from '../../services/NerdStorageVault';
import { NerdGraphQuery, NerdGraphMutation } from 'nr1';

jest.mock(
  'nr1',
  () => {
    const NerdGraphQuery = {
      query: jest.fn().mockImplementation(async ({ error, data }) => {
        if (error) {
          const errors = [];
          await new Promise((resolve, reject) => {
            errors.push('Unexpected query');
            return reject(errors);
          });
        } else if (data) {
          let dataReturn = {};
          await new Promise(resolve => {
            dataReturn = {
              data: {
                actor: {
                  nerdStorageVault: {
                    secrets: [
                      {
                        _typename: 'NerdStorageVaultSecret',
                        key: 'TEST',
                        value: 'test123'
                      },
                      {
                        _typename: 'NerdStorageVaultSecret',
                        key: 'api_token',
                        value: 'token'
                      }
                    ]
                  }
                }
              }
            };
            return resolve();
          });
          return dataReturn;
        }
      })
    };
    const NerdGraphMutation = {
      mutate: jest.fn().mockImplementation(() => {
        return { data: {} };
      })
    };
    return {
      NerdGraphQuery: NerdGraphQuery,
      NerdGraphMutation: NerdGraphMutation
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
    const data = [
      {
        _typename: 'NerdStorageVaultSecret',
        key: 'TEST',
        value: 'test123'
      },
      {
        _typename: 'NerdStorageVaultSecret',
        key: 'api_token',
        value: 'token'
      }
    ];
    const error = null;
    jest
      .spyOn(NerdGraphQuery, 'query')
      .mockImplementationOnce(() => Promise.resolve({ error, data }));
    await nerdStorageVault.getCredentialsData();
  });

  it('Function getCredentialsData() with error', async () => {
    const data = [
      {
        _typename: 'NerdStorageVaultSecret',
        key: 'TEST',
        value: 'test123'
      },
      {
        _typename: 'NerdStorageVaultSecret',
        key: 'api_token',
        value: 'token'
      }
    ];
    const error = 'Network Error';
    jest
      .spyOn(NerdGraphQuery, 'query')
      .mockImplementationOnce(() => Promise.resolve({ error, data }));
    await expect(nerdStorageVault.getCredentialsData()).rejects.toThrow(
      'Network Error'
    );
  });

  it('Function getCredentialsData() with no data', async () => {
    const error = 'Network Error';
    jest
      .spyOn(NerdGraphQuery, 'query')
      .mockImplementationOnce(() => Promise.resolve(new Error(error)));
    await nerdStorageVault.getCredentialsData();
  });

  it('Function storeCredentialData()', async () => {
    const keySend = 'TEST';
    const valueSend = 'test123';
    const data = {
      data: {
        nerdStorageVaultWriteSecret: {
          status: 'SUCCESS'
        }
      }
    };
    jest
      .spyOn(NerdGraphMutation, 'mutate')
      .mockImplementationOnce(() => Promise.resolve(data));
    await nerdStorageVault.storeCredentialData(keySend, valueSend);
  });

  it('Function storeCredentialData() with catch', async () => {
    const keySend = 'TEST';
    const valueSend = 'test123';
    jest.spyOn(NerdGraphMutation, 'mutate').mockRejectedValue(Error('error'));
    await expect(
      nerdStorageVault.storeCredentialData(keySend, valueSend)
    ).rejects.toThrow('error');
  });
});
