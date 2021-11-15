import SynConnector from '../../services/SynConnector';
import { AccountStorageQuery, AccountStorageMutation } from 'nr1';

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

  it('Function SendLog()', () => {
    const datos = {
      name: 'SYNTETIC 1',
      monitorType: 'SCRIPT_API',
      monitorId: 'f8b910dd-6744-4eb0-88c8-c696988260f2'
    };
    synConnector.SendLog(datos);
    expect(synConnector.buffer.length).toEqual(1);
  });
  it('Function SendSyntetic()', () => {
    const datos = {
      name: 'SYNTETIC 1',
      monitorType: 'SCRIPT_API',
      monitorId: 'f8b910dd-6744-4eb0-88c8-c696988260f2'
    };
    synConnector.SendSyntetic(datos);
    expect(synConnector.syntetic).toEqual({
      name: 'SYNTETIC 1',
      monitorType: 'SCRIPT_API',
      monitorId: 'f8b910dd-6744-4eb0-88c8-c696988260f2'
    });
  });

  it('Function getMonitor()', async () => {
    const monitorID = 'f8b910dd-6744-4eb0-88c8-c696988260f2';
    synConnector.axiosInstance = {
      get: jest.fn().mockReturnValue({
        data: {
          name: 'SYSNTETIC 1'
        }
      })
    };
    const getMonitor = synConnector.getMonitor(monitorID);
    // eslint-disable-next-line no-console
    console.log(getMonitor);
    // expect(getMonitor).toEqual({});
  });

  it('Function Create()', async () => {
    const syntetic = {
      name: 'SYNTETIC 1',
      monitorType: 'SCRIPT_API',
      monitorId: 'f8b910dd-6744-4eb0-88c8-c696988260f2'
    };
    const data = {
      status: 202,
      location: ['WEST-US'],
      headers: {
        location:
          'https://synthetics.newrelic.com/synthetics/api/v3/monitors/12fe'
      }
    };
    synConnector.axiosInstance.post = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(data));
    synConnector.setSyntetic = jest.fn();
    await synConnector.Create(syntetic);
  });

  it('Function Create() with cath', async () => {
    const syntetic = {
      name: 'SYNTETIC 1',
      monitorType: 'SCRIPT_API',
      monitorId: 'f8b910dd-6744-4eb0-88c8-c696988260f2'
    };
    const errorMessage = 'Network Error';

    synConnector.axiosInstance.post = jest
      .fn()
      .mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));
    await synConnector.Create(syntetic);
  });

  it('Function getSyntetic()', async () => {
    jest.spyOn(AccountStorageQuery, 'query').mockRejectedValue(Error('error'));
  });

  it('Fucntion setSyntetic()', async () => {
    const name = 'SYNTETIC 1';
    const monitorID = 'f8b910dd-6744-4eb0-88c8-c696988260f2';
    const syn = {
      name: name,
      monitorID: monitorID
    };
    synConnector.arrayStorageSyn.push(syn);
    synConnector.setSyntetic(name, monitorID);
    expect(synConnector.arrayStorageSyn.length).toEqual(2);
  });

  it('Fucntion setSyntetic() with catch', async () => {
    const name = 'SYNTETIC 1';
    const monitorID = 'f8b910dd-6744-4eb0-88c8-c696988260f2';
    const syn = {
      name: name,
      monitorID: monitorID
    };
    synConnector.arrayStorageSyn.push(syn);
    jest
      .spyOn(AccountStorageMutation, 'mutate')
      .mockRejectedValue(Error('error'));
    await expect(synConnector.setSyntetic(name, monitorID)).rejects.toThrow(
      'error'
    );
  });

  it('Function updateMonitor()', async () => {
    const name = 'SYNTETIC 1';
    const monitorID = 'f8b910dd-6744-4eb0-88c8-c696988260f2';
    const data = {
      status: 202
    };
    synConnector.axiosInstance.put = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(data));
    await synConnector.updateMonitor(name, monitorID);
  });

  it('Function updateMonitor() with cath', async () => {
    const name = 'SYNTETIC 1';
    const monitorID = 'f8b910dd-6744-4eb0-88c8-c696988260f2';
    const errorMessage = 'Network Error';

    synConnector.axiosInstance.put = jest
      .fn()
      .mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));
    await synConnector.updateMonitor(name, monitorID);
  });

  it('Function updateScript()', async () => {
    const script = 'script';
    const monitorID = 'f8b910dd-6744-4eb0-88c8-c696988260f2';
    const data = {
      status: 202,
      location: ['WEST-US']
    };
    synConnector.axiosInstance.put = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(data));
    await synConnector.updateScript(monitorID, script);
  });

  it('Function updateScript() with cath', async () => {
    const script = 'script';
    const monitorID = 'f8b910dd-6744-4eb0-88c8-c696988260f2';
    const errorMessage = 'Network Error';

    synConnector.axiosInstance.put = jest
      .fn()
      .mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));
    await synConnector.updateScript(monitorID, script);
  });

  it('Function Delete()', async () => {
    const monitorID = 'f8b910dd-6744-4eb0-88c8-c696988260f2';
    const data = {
      status: 202
    };
    synConnector.axiosInstance.delete = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(data));
    await synConnector.Delete(monitorID);
  });

  it('Function Delete() with catch', async () => {
    const monitorID = 'f8b910dd-6744-4eb0-88c8-c696988260f2';
    const errorMessage = 'Network Error';
    synConnector.axiosInstance.delete = jest
      .fn()
      .mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));
    await synConnector.Delete(monitorID);
  });

  it('Function deleteStorage()', async () => {
    const monitorID = 'f8b910dd-6744-4eb0-88c8-c696988260f2';
    const syn = {
      name: name,
      monitorID: monitorID
    };
    synConnector.arrayStorageSyn.push(syn);
    jest
      .spyOn(AccountStorageMutation, 'mutate')
      .mockReturnValue({ data: 'data' });
    await synConnector.deleteStorage(monitorID);
  });

  it('Function deleteStorage() with catch', async () => {
    const monitorID = 'f8b910dd-6744-4eb0-88c8-c696988260f2';
    const syn = {
      name: name,
      monitorID: monitorID
    };
    synConnector.arrayStorageSyn.push(syn);
    jest
      .spyOn(AccountStorageMutation, 'mutate')
      .mockRejectedValue(Error('error'));
    await expect(synConnector.deleteStorage(monitorID)).rejects.toThrow(
      'error'
    );
  });
});
