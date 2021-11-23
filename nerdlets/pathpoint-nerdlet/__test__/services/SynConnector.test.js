import DataManager from '../../services/DataManager';
import SynConnector from '../../services/SynConnector';

jest.mock(
  'nr1',
  () => {
    const AccountStorageQuery = {
      query: jest
        .fn()
        .mockImplementation(async ({ accountId, collection, documentId }) => {
          switch (collection) {
            case 'pathpoint': {
              switch (documentId) {
                case 'syntetic':
                  return {
                    data: {
                      syntetic: [
                        {
                          name: 'SYNTETIC 1',
                          monitorType: 'SCRIPT_API',
                          monitorId: 'f8b910dd-6744-4eb0-88c8-c696988260f2'
                        }
                      ]
                    }
                  };
              }
            }
          }
          return accountId;
        })
    };
    const AccountStorageMutation = {
      ACTION_TYPE: { WRITE_DOCUMENT: 'WRITE_DOCUMENT' },
      mutate: jest.fn().mockImplementation(() => {
        return { data: {} };
      })
    };
    return {
      AccountStorageQuery: AccountStorageQuery,
      AccountStorageMutation: AccountStorageMutation
    };
  },
  { virtual: true }
);

describe('LogsConnector', () => {
  let synConnector;

  beforeEach(() => {
    synConnector = new SynConnector();
  });

  it('Function ValidateUserApiKey()', async () => {
    const userApiKey = '123afd98d';
    jest.spyOn(synConnector.axiosInstance, 'get').mockReturnValue(true);
    const result = await synConnector.ValidateUserApiKey(userApiKey);
    expect(result).toEqual(true);
  });

  it('Function ValidateUserApiKey() catch with error = 401', async () => {
    const userApiKey = '123afd98d';
    const error = {
      response: {
        status: 401
      }
    };
    jest.spyOn(synConnector.axiosInstance, 'get').mockRejectedValue(error);
    const result = await synConnector.ValidateUserApiKey(userApiKey);
    expect(result).toEqual(false);
  });

  it('Function ValidateUserApiKey() catch with error != 401', async () => {
    const userApiKey = '123afd98d';
    const error = {
      response: {
        status: 400
      }
    };
    jest.spyOn(synConnector.axiosInstance, 'get').mockRejectedValue(error);
    const result = await synConnector.ValidateUserApiKey(userApiKey);
    expect(result).toEqual(true);
  });

  it('Function SetUserApiKey()', () => {
    const key = 'd65e931ac15';
    synConnector.SetUserApiKey(key);
    expect(synConnector.userApiKey).toEqual('d65e931ac15');
  });

  it('Function SetLicenseKey()', () => {
    const key = 'd65e931ac15';
    synConnector.SetLicenseKey(key);
    expect(synConnector.ingestLicense).toEqual('d65e931ac15');
  });

  it('Function SetAccountID()', () => {
    const accountId = 2710112;
    synConnector.SetAccountID(accountId);
    expect(synConnector.accountId).toEqual(2710112);
  });

  it('Function EnableDisableDrop()', () => {
    const status = true;
    synConnector.EnableDisableDrop(status);
    expect(synConnector.accountId).toEqual(1);
  });

  it('Function EnableDisableFlame()', () => {
    const status = true;
    synConnector.EnableDisableFlame(status);
    expect(synConnector.accountId).toEqual(1);
  });

  it('Function UpdateFlameMonitor() with ingestLicense = ""', async () => {
    const encodedScript = 'var = Encoded Script';
    synConnector.ingestLicense = '';
    const result = await synConnector.UpdateFlameMonitor(encodedScript);
    expect(result).toEqual(0);
  });

  it('Function UpdateFlameMonitor() with error', async () => {
    const encodedScript = 'var = Encoded Script';
    synConnector.FlameStatus = true;
    synConnector.userApiKey = '563ed89a';
    synConnector.ingestLicense = '96563ed89ac85';
    synConnector.ExistFlameScript = jest.fn().mockReturnValue({
      searchResult: null,
      monitorID: null,
      error: 'Network error'
    });
    const result = await synConnector.UpdateFlameMonitor(encodedScript);
    expect(result).toEqual(0);
  });

  it('Function UpdateFlameMonitor() with searchResult', async () => {
    const encodedScript = 'var = Encoded Script';
    synConnector.FlameStatus = true;
    synConnector.userApiKey = '563ed89a';
    synConnector.ingestLicense = '96563ed89ac85';
    synConnector.ExistFlameScript = jest.fn().mockReturnValue({
      searchResult: false,
      monitorID: false,
      error: null
    });
    synConnector.UpdateFlameScript = await jest.fn();
    synConnector.CreateFlameScript = jest.fn().mockReturnValue(false);
    await synConnector.UpdateFlameMonitor(encodedScript);
    expect(synConnector.CreateFlameScript).toHaveBeenCalledTimes(2);
  });

  it('Function UpdateFlameMonitor() with FlameMonitorID and response = ERROR', async () => {
    const encodedScript = 'var = Encoded Script';
    synConnector.FlameStatus = true;
    synConnector.userApiKey = '563ed89a';
    synConnector.ingestLicense = '96563ed89ac85';
    synConnector.ExistFlameScript = jest.fn().mockReturnValue({
      searchResult: false,
      monitorID: false,
      error: null
    });
    synConnector.UpdateFlameScript = await jest.fn().mockReturnValue('ERROR');
    synConnector.CreateFlameScript = jest.fn().mockReturnValue(true);
    await synConnector.UpdateFlameMonitor(encodedScript);
    expect(synConnector.UpdateFlameScript).toHaveBeenCalledTimes(2);
  });

  it('Function UpdateFlameMonitor() with FlameMonitorID and Response = 204', async () => {
    const encodedScript = 'var = Encoded Script';
    synConnector.FlameStatus = true;
    synConnector.userApiKey = '563ed89a';
    synConnector.ingestLicense = '96563ed89ac85';
    synConnector.ExistFlameScript = jest.fn().mockReturnValue({
      searchResult: false,
      monitorID: false,
      error: null
    });
    synConnector.UpdateFlameScript = await jest.fn().mockReturnValue(204);
    synConnector.CreateFlameScript = jest.fn().mockReturnValue(true);
    await synConnector.UpdateFlameMonitor(encodedScript);
    expect(synConnector.UpdateFlameScript).toHaveBeenCalledTimes(1);
  });

  it('Function ExistFlameScript()', async () => {
    jest.spyOn(synConnector.axiosInstance, 'get').mockReturnValue({
      status: 200,
      data: {
        monitors: [
          {
            name: 'Pathpoint-7d86cabe-5130-48ba-b2f8-ff9e9a395f66 Flame Script',
            type: 'SCRIPT_API',
            id: ''
          }
        ]
      }
    });
    const result = await synConnector.ExistFlameScript();
    expect(result.searchResult).toEqual(false);
  });

  it('Function ExistFlameScript() with error', async () => {
    jest.spyOn(synConnector.axiosInstance, 'get').mockReturnValue({
      status: 401,
      data: {
        monitors: [
          {
            name: 'Pathpoint',
            type: 'SCRIPT_API',
            id: ''
          }
        ]
      }
    });
    const result = await synConnector.ExistFlameScript();
    expect(result.error).toEqual(true);
  });

  it('Function ExistFlameScript() with catch', async () => {
    jest
      .spyOn(synConnector.axiosInstance, 'get')
      .mockRejectedValue(Error('error'));
    await expect(synConnector.ExistFlameScript()).rejects.toThrow('error');
  });

  it('Function CreateFlameScript()', async () => {
    synConnector.FlameStatus = true;
    synConnector.userApiKey = '235ade9f';
    jest.spyOn(synConnector.axiosInstance, 'post').mockReturnValue({
      headers: {
        location:
          'https://synthetics.newrelic.com/synthetics/api/v3/monitors/899412777'
      }
    });
    const result = await synConnector.CreateFlameScript();
    expect(result).toEqual('899412777');
  });

  it('Function CreateFlameScript() with catch', async () => {
    synConnector.FlameStatus = true;
    synConnector.userApiKey = '235ade9f';
    jest
      .spyOn(synConnector.axiosInstance, 'post')
      .mockRejectedValue(Error('error'));
    await expect(synConnector.CreateFlameScript()).rejects.toThrow('error');
  });

  it('Function UpdateFlameScript()', async () => {
    const encodedScript = ' var scriptText = newScript';
    const flameMonitorId = 28974653;
    jest.spyOn(synConnector.axiosInstance, 'put').mockReturnValue({
      status: 201
    });
    const result = await synConnector.UpdateFlameScript(
      encodedScript,
      flameMonitorId
    );
    expect(result).toEqual(201);
  });

  it('Function UpdateFlameScript() with status = ERROR', async () => {
    const encodedScript = ' var scriptText = newScript';
    const flameMonitorId = 28974653;
    jest.spyOn(synConnector.axiosInstance, 'put').mockReturnValue({
      status: null
    });
    const result = await synConnector.UpdateFlameScript(
      encodedScript,
      flameMonitorId
    );
    expect(result).toEqual('ERROR');
  });

  it('Function UpdateFlameScript() with catch', async () => {
    const encodedScript = ' var scriptText = newScript';
    const flameMonitorId = 28974653;
    jest
      .spyOn(synConnector.axiosInstance, 'put')
      .mockRejectedValue(Error('error'));
    await expect(
      synConnector.UpdateFlameScript(encodedScript, flameMonitorId)
    ).rejects.toThrow('error');
  });

  // it('Function SendLog()', () => {
  //   const datos = {
  //     name: 'SYNTETIC 1',
  //     monitorType: 'SCRIPT_API',
  //     monitorId: 'f8b910dd-6744-4eb0-88c8-c696988260f2'
  //   };
  //   synConnector.SendLog(datos);
  //   expect(synConnector.buffer.length).toEqual(1);
  // });
  // it('Function SendSyntetic()', () => {
  //   const datos = {
  //     name: 'SYNTETIC 1',
  //     monitorType: 'SCRIPT_API',
  //     monitorId: 'f8b910dd-6744-4eb0-88c8-c696988260f2'
  //   };
  //   synConnector.SendSyntetic(datos);
  //   expect(synConnector.syntetic).toEqual({
  //     name: 'SYNTETIC 1',
  //     monitorType: 'SCRIPT_API',
  //     monitorId: 'f8b910dd-6744-4eb0-88c8-c696988260f2'
  //   });
  // });

  // it('Function getMonitor()', async () => {
  //   const monitorID = 'f8b910dd-6744-4eb0-88c8-c696988260f2';
  //   synConnector.axiosInstance = {
  //     get: jest.fn().mockReturnValue({
  //       data: {
  //         name: 'SYSNTETIC 1'
  //       }
  //     })
  //   };
  //   const getMonitor = synConnector.getMonitor(monitorID);
  //   // eslint-disable-next-line no-console
  //   console.log(getMonitor);
  //   // expect(getMonitor).toEqual({});
  // });

  // it('Function Create()', async () => {
  //   const syntetic = {
  //     name: 'SYNTETIC 1',
  //     monitorType: 'SCRIPT_API',
  //     monitorId: 'f8b910dd-6744-4eb0-88c8-c696988260f2'
  //   };
  //   const data = {
  //     status: 202,
  //     location: ['WEST-US'],
  //     headers: {
  //       location:
  //         'https://synthetics.newrelic.com/synthetics/api/v3/monitors/12fe'
  //     }
  //   };
  //   synConnector.axiosInstance.post = jest
  //     .fn()
  //     .mockImplementationOnce(() => Promise.resolve(data));
  //   synConnector.setSyntetic = jest.fn();
  //   await synConnector.Create(syntetic);
  // });

  // it('Function Create() with cath', async () => {
  //   const syntetic = {
  //     name: 'SYNTETIC 1',
  //     monitorType: 'SCRIPT_API',
  //     monitorId: 'f8b910dd-6744-4eb0-88c8-c696988260f2'
  //   };
  //   const errorMessage = 'Network Error';

  //   synConnector.axiosInstance.post = jest
  //     .fn()
  //     .mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));
  //   await synConnector.Create(syntetic);
  // });

  // it('Function getSyntetic()', async () => {
  //   jest.spyOn(AccountStorageQuery, 'query').mockRejectedValue(Error('error'));
  // });

  // it('Fucntion setSyntetic()', async () => {
  //   const name = 'SYNTETIC 1';
  //   const monitorID = 'f8b910dd-6744-4eb0-88c8-c696988260f2';
  //   const syn = {
  //     name: name,
  //     monitorID: monitorID
  //   };
  //   synConnector.arrayStorageSyn.push(syn);
  //   synConnector.setSyntetic(name, monitorID);
  //   expect(synConnector.arrayStorageSyn.length).toEqual(2);
  // });

  // it('Fucntion setSyntetic() with catch', async () => {
  //   const name = 'SYNTETIC 1';
  //   const monitorID = 'f8b910dd-6744-4eb0-88c8-c696988260f2';
  //   const syn = {
  //     name: name,
  //     monitorID: monitorID
  //   };
  //   synConnector.arrayStorageSyn.push(syn);
  //   jest
  //     .spyOn(AccountStorageMutation, 'mutate')
  //     .mockRejectedValue(Error('error'));
  //   await expect(synConnector.setSyntetic(name, monitorID)).rejects.toThrow(
  //     'error'
  //   );
  // });

  // it('Function updateMonitor()', async () => {
  //   const name = 'SYNTETIC 1';
  //   const monitorID = 'f8b910dd-6744-4eb0-88c8-c696988260f2';
  //   const data = {
  //     status: 202
  //   };
  //   synConnector.axiosInstance.put = jest
  //     .fn()
  //     .mockImplementationOnce(() => Promise.resolve(data));
  //   await synConnector.updateMonitor(name, monitorID);
  // });

  // it('Function updateMonitor() with cath', async () => {
  //   const name = 'SYNTETIC 1';
  //   const monitorID = 'f8b910dd-6744-4eb0-88c8-c696988260f2';
  //   const errorMessage = 'Network Error';

  //   synConnector.axiosInstance.put = jest
  //     .fn()
  //     .mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));
  //   await synConnector.updateMonitor(name, monitorID);
  // });

  // it('Function updateScript()', async () => {
  //   const script = 'script';
  //   const monitorID = 'f8b910dd-6744-4eb0-88c8-c696988260f2';
  //   const data = {
  //     status: 202,
  //     location: ['WEST-US']
  //   };
  //   synConnector.axiosInstance.put = jest
  //     .fn()
  //     .mockImplementationOnce(() => Promise.resolve(data));
  //   await synConnector.updateScript(monitorID, script);
  // });

  // it('Function updateScript() with cath', async () => {
  //   const script = 'script';
  //   const monitorID = 'f8b910dd-6744-4eb0-88c8-c696988260f2';
  //   const errorMessage = 'Network Error';

  //   synConnector.axiosInstance.put = jest
  //     .fn()
  //     .mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));
  //   await synConnector.updateScript(monitorID, script);
  // });

  // it('Function Delete()', async () => {
  //   const monitorID = 'f8b910dd-6744-4eb0-88c8-c696988260f2';
  //   const data = {
  //     status: 202
  //   };
  //   synConnector.axiosInstance.delete = jest
  //     .fn()
  //     .mockImplementationOnce(() => Promise.resolve(data));
  //   await synConnector.Delete(monitorID);
  // });

  // it('Function Delete() with catch', async () => {
  //   const monitorID = 'f8b910dd-6744-4eb0-88c8-c696988260f2';
  //   const errorMessage = 'Network Error';
  //   synConnector.axiosInstance.delete = jest
  //     .fn()
  //     .mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));
  //   await synConnector.Delete(monitorID);
  // });

  // it('Function deleteStorage()', async () => {
  //   const monitorID = 'f8b910dd-6744-4eb0-88c8-c696988260f2';
  //   const syn = {
  //     name: name,
  //     monitorID: monitorID
  //   };
  //   synConnector.arrayStorageSyn.push(syn);
  //   jest
  //     .spyOn(AccountStorageMutation, 'mutate')
  //     .mockReturnValue({ data: 'data' });
  //   await synConnector.deleteStorage(monitorID);
  // });

  // it('Function deleteStorage() with catch', async () => {
  //   const monitorID = 'f8b910dd-6744-4eb0-88c8-c696988260f2';
  //   const syn = {
  //     name: name,
  //     monitorID: monitorID
  //   };
  //   synConnector.arrayStorageSyn.push(syn);
  //   jest
  //     .spyOn(AccountStorageMutation, 'mutate')
  //     .mockRejectedValue(Error('error'));
  //   await expect(synConnector.deleteStorage(monitorID)).rejects.toThrow(
  //     'error'
  //   );
  // });
});
