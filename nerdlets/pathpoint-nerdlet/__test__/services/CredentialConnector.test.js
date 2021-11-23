import CredentialConnector from '../../services/CredentialConnector';

describe('LogsConnector', () => {
  let credentialConnector;
  beforeEach(() => {
    credentialConnector = new CredentialConnector();
  });

  it('Function SendCredentials()', () => {
    const credential = {
      name: 'INGESTKEY',
      value: '23ef89f9'
    };
    credentialConnector.SendCredentials(credential);
    expect(credentialConnector.credential).toEqual({
      name: 'INGESTKEY',
      value: '23ef89f9'
    });
  });

  it('Function createCredential()', () => {
    const credential = {
      name: 'INGESTKEY',
      value: '23ef89f9'
    };
    const data = {
      status: 202,
      location: ['WEST-US'],
      headers: {
        location:
          'https://synthetics.newrelic.com/synthetics/api/v3/monitors/12fe'
      }
    };
    credentialConnector.axiosInstance.post = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(data));
    credentialConnector.createCredential(credential);
    expect(credentialConnector.axiosInstance.post).toHaveBeenCalledTimes(1);
  });

  it('Function createCredential() with cath', () => {
    const credential = {
      name: 'INGESTKEY',
      value: '23ef89f9'
    };
    const errorMessage = 'Network Error';

    credentialConnector.axiosInstance.post = jest
      .fn()
      .mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));
    credentialConnector.createCredential(credential);
    expect(credentialConnector.axiosInstance.post).toHaveBeenCalledTimes(1);
  });

  it('Function updateCredential()', () => {
    const credential = {
      name: 'INGESTKEY',
      value: '23ef89f9'
    };
    const data = {
      status: 202
    };
    credentialConnector.axiosInstance.put = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(data));
    credentialConnector.updateCredential(credential);
    expect(credentialConnector.axiosInstance.put).toHaveBeenCalledTimes(1);
  });

  it('Function updateCredential() with catch', () => {
    const credential = {
      name: 'INGESTKEY',
      value: '23ef89f9'
    };
    const error = 'Newtwork error';
    credentialConnector.axiosInstance.put = jest
      .fn()
      .mockImplementationOnce(() => Promise.reject(error));
    credentialConnector.updateCredential(credential);
    expect(credentialConnector.axiosInstance.put).toHaveBeenCalledTimes(1);
  });

  it('Function deleteCredential()', () => {
    const credential = {
      name: 'INGESTKEY',
      value: '23ef89f9'
    };
    const data = {
      status: 202
    };

    jest
      .spyOn(credentialConnector.axiosInstance, 'delete')
      .mockImplementationOnce(() => Promise.resolve(data));
    credentialConnector.deleteCredential(credential);
    expect(credentialConnector.axiosInstance.delete).toHaveBeenCalledTimes(1);
  });

  it('Function deleteCredential() with catch', () => {
    const credential = {
      name: 'INGESTKEY',
      value: '23ef89f9'
    };
    const error = 'Newtwork error';
    credentialConnector.axiosInstance.delete = jest
      .fn()
      .mockImplementationOnce(() => Promise.reject(error));
    credentialConnector.deleteCredential(credential);
    expect(credentialConnector.axiosInstance.delete).toHaveBeenCalledTimes(1);
  });
});
