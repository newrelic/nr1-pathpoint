import NerdStorageVault from '../../services/NerdStorageVault';
import { NerdGraphQuery, NerdGraphMutation } from 'nr1';

jest.mock(
  'nr1',
  () => {
    const NerdGraphQuery = {
      query: jest.fn().mockImplementation(async ({ query }) => {
        if (query.includes('BAD REQUEST')) {
          const errors = [];
          await new Promise((resolve, reject) => {
            errors.push('Unexpected query');
            return reject(errors);
          });
        } else if (query.includes('nerdStorageVault')) {
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
describe('LogsConnector', () => {
  let nerdStorageVault;
  beforeEach(() => {
    nerdStorageVault = new NerdStorageVault();
  });

  it('Function CallGetToken()', async () => {
    const data = {
      actor: {
        nerdStorageVault: {
          secrets: [
            {
              key: 'TEST',
              value: 'test123'
            }
          ]
        }
      }
    };
    const error = 'Network Error';
    jest
      .spyOn(NerdGraphQuery, 'query')
      .mockImplementationOnce(() => Promise.resolve({ error, data }));
    await nerdStorageVault.CallGetToken();
  });

  it('Function CallGetToken() with no data', async () => {
    const data = {
      actor: {
        nerdStorageVault: 'nerdStorage'
      }
    };
    const error = 'Network Error';
    jest
      .spyOn(NerdGraphQuery, 'query')
      .mockImplementationOnce(() => Promise.resolve({ error, data }));
    await nerdStorageVault.CallGetToken();
  });

  it('Function storeToken()', async () => {
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
    await nerdStorageVault.storeToken(keySend, valueSend);
  });
});
