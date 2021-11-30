import CredentialConnector from '../../services/CredentialConnector';

describe('CredentialConnector', () => {
  let credentialConnector;
  beforeEach(() => {
    credentialConnector = new CredentialConnector();
  });

  it('Function SetUserApiKey()', () => {
    const key = '557fda96e';
    credentialConnector.userApiKey = '12ef96f';
    credentialConnector.UpdateUserApiKeyCredential = jest.fn();
    credentialConnector.SetUserApiKey(key);
    expect(credentialConnector.userApiKey).toEqual('557fda96e');
  });

  it('Function SetUserApiKey() with userApiKey = ""', () => {
    const key = '557fda96e';
    credentialConnector.userApiKey = '';
    credentialConnector.UpdateUserApiKeyCredential = jest.fn();
    credentialConnector.SetUserApiKey(key);
    expect(credentialConnector.userApiKey).toEqual('557fda96e');
  });

  it('Function SetLicenseKey()', () => {
    const key = '557fda96e';
    credentialConnector.ingestLicense = '12ef96f';
    credentialConnector.UpdateLicenseCredential = jest.fn();
    credentialConnector.SetLicenseKey(key);
    expect(credentialConnector.ingestLicense).toEqual('557fda96e');
  });

  it('Function SetLicenseKey() with userApiKey = ""', () => {
    const key = '557fda96e';
    credentialConnector.ingestLicense = '';
    credentialConnector.UpdateLicenseCredential = jest.fn();
    credentialConnector.SetLicenseKey(key);
    expect(credentialConnector.ingestLicense).toEqual('557fda96e');
  });

  it('Function SetAccountID()', () => {
    const accountId = 2710113;
    credentialConnector.accountId = 2710112;
    credentialConnector.UpdateAccountIdCredential = jest.fn();
    credentialConnector.SetAccountID(accountId);
    expect(credentialConnector.accountId).toEqual(2710113);
  });

  it('Function SetAccountID() with userApiKey = ""', () => {
    const accountId = 2710113;
    credentialConnector.accountId = 1;
    credentialConnector.UpdateAccountIdCredential = jest.fn();
    credentialConnector.SetAccountID(accountId);
    expect(credentialConnector.accountId).toEqual(2710113);
  });

  it('Function FindCredential()', async () => {
    const credentialName = 'INGESTKEY';
    jest.spyOn(credentialConnector.axiosInstance, 'get').mockReturnValue({
      status: 200,
      data: {
        key: 'INGESTKEY'
      }
    });
    const reuslt = await credentialConnector.FindCredential(credentialName);
    expect(reuslt).toEqual(true);
  });

  it('Function FindCredential() with data = null', async () => {
    const credentialName = 'INGESTKEY';
    jest.spyOn(credentialConnector.axiosInstance, 'get').mockReturnValue({
      status: 200,
      data: null
    });
    const reuslt = await credentialConnector.FindCredential(credentialName);
    expect(reuslt).toEqual(false);
  });

  it('Function FindCredential() with catch', async () => {
    const credentialName = 'INGESTKEY';
    const error = {
      response: {
        status: 404
      }
    };
    jest
      .spyOn(credentialConnector.axiosInstance, 'get')
      .mockRejectedValue(error);
    const reuslt = await credentialConnector.FindCredential(credentialName);
    expect(reuslt).toEqual(false);
  });

  it('Function FindSecureCredentials() with ingestLicense="", userApiKey=""', async () => {
    credentialConnector.ingestLicense = '';
    const result = await credentialConnector.FindSecureCredentials();
    expect(result).toEqual(0);
  });

  it('Function FindSecureCredentials()', async () => {
    credentialConnector.ingestLicense = '12ef859a';
    credentialConnector.userApiKey = '78af95e96';
    credentialConnector.accountId = 2710112;
    credentialConnector.FindCredential = jest.fn().mockReturnValue(true);
    const result = await credentialConnector.FindSecureCredentials();
    expect(result).toEqual(true);
  });

  it('Function CreateCredential()', () => {
    const credentialName = 'INGESTKEY';
    const credentialValue = '125FE96';
    const data = {
      status: 201,
      data: 'Send Data',
      location: ['WEST-US'],
      headers: {
        location:
          'https://synthetics.newrelic.com/synthetics/api/v3/monitors/12fe'
      }
    };
    credentialConnector.axiosInstance.post = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(data));
    credentialConnector.CreateCredential(credentialName, credentialValue);
    expect(credentialConnector.axiosInstance.post).toHaveBeenCalledTimes(1);
  });

  it('Function CreateCredential() with data = ""', () => {
    const credentialName = 'INGESTKEY';
    const credentialValue = '125FE96';
    const data = {
      status: 201,
      data: '',
      location: ['WEST-US'],
      headers: {
        location:
          'https://synthetics.newrelic.com/synthetics/api/v3/monitors/12fe'
      }
    };
    credentialConnector.axiosInstance.post = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(data));
    credentialConnector.CreateCredential(credentialName, credentialValue);
    expect(credentialConnector.axiosInstance.post).toHaveBeenCalledTimes(1);
  });

  it('Function CreateCredential() with cath', () => {
    const credential = {
      name: 'INGESTKEY',
      value: '23ef89f9'
    };
    const errorMessage = 'Network Error';

    credentialConnector.axiosInstance.post = jest
      .fn()
      .mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));
    credentialConnector.CreateCredential(credential);
    expect(credentialConnector.axiosInstance.post).toHaveBeenCalledTimes(1);
  });

  it('Function CreateCredentials() return 0', async () => {
    credentialConnector.ingestLicense = '';
    const result = await credentialConnector.CreateCredentials();
    expect(result).toEqual(0);
  });

  it('Function CreateCredentials()', async () => {
    credentialConnector.ingestLicense = '12ef859a';
    credentialConnector.userApiKey = '78af95e96';
    credentialConnector.accountId = 2710112;
    credentialConnector.FindCredential = jest.fn().mockReturnValue(false);
    credentialConnector.CreateCredential = jest.fn().mockReturnValue(true);
    const result = await credentialConnector.CreateCredentials();
    expect(result).toEqual(true);
  });

  it('Function DeleteCredential() with response = true', () => {
    const credentialName = 'INGESTKEY';
    const data = {
      status: 204
    };

    jest
      .spyOn(credentialConnector.axiosInstance, 'delete')
      .mockImplementationOnce(() => Promise.resolve(data));
    credentialConnector.DeleteCredential(credentialName);
    expect(credentialConnector.axiosInstance.delete).toHaveBeenCalledTimes(1);
  });

  it('Function DeleteCredential() with response = null', () => {
    const credentialName = 'INGESTKEY';
    const data = null;
    jest
      .spyOn(credentialConnector.axiosInstance, 'delete')
      .mockImplementationOnce(() => Promise.resolve(data));
    credentialConnector.DeleteCredential(credentialName);
    expect(credentialConnector.axiosInstance.delete).toHaveBeenCalledTimes(1);
  });

  it('Function DeleteCredential() with catch', () => {
    const credential = {
      name: 'INGESTKEY',
      value: '23ef89f9'
    };
    const error = 'Newtwork error';
    credentialConnector.axiosInstance.delete = jest
      .fn()
      .mockImplementationOnce(() => Promise.reject(error));
    credentialConnector.DeleteCredential(credential);
    expect(credentialConnector.axiosInstance.delete).toHaveBeenCalledTimes(1);
  });

  it('Function DeleteCredentials()', async () => {
    credentialConnector.FindCredential = jest.fn().mockReturnValue(true);
    credentialConnector.DeleteCredential = jest.fn().mockReturnValue(true);
    await credentialConnector.DeleteCredentials();
    expect(credentialConnector.accountId).toEqual(1);
  });

  it('Function UpdateCredential() with status = 204', () => {
    const credential = {
      name: 'INGESTKEY',
      value: '23ef89f9'
    };
    const data = {
      status: 204
    };
    credentialConnector.axiosInstance.put = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(data));
    credentialConnector.UpdateCredential(credential);
    expect(credentialConnector.axiosInstance.put).toHaveBeenCalledTimes(1);
  });

  it('Function UpdateCredential() with response = null', () => {
    const credential = {
      name: 'INGESTKEY',
      value: '23ef89f9'
    };
    const data = null;
    credentialConnector.axiosInstance.put = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(data));
    credentialConnector.UpdateCredential(credential);
    expect(credentialConnector.axiosInstance.put).toHaveBeenCalledTimes(1);
  });

  it('Function UpdateCredential() with catch', () => {
    const credential = {
      name: 'INGESTKEY',
      value: '23ef89f9'
    };
    const error = 'Newtwork error';
    credentialConnector.axiosInstance.put = jest
      .fn()
      .mockImplementationOnce(() => Promise.reject(error));
    credentialConnector.UpdateCredential(credential);
    expect(credentialConnector.axiosInstance.put).toHaveBeenCalledTimes(1);
  });

  it('Function UpdateUserApiKeyCredential()', async () => {
    const newKey = 'APIKEY';
    credentialConnector.FindCredential = jest.fn().mockReturnValue(true);
    credentialConnector.UpdateCredential = jest.fn().mockReturnValue(true);
    await credentialConnector.UpdateUserApiKeyCredential(newKey);
    expect(credentialConnector.UpdateCredential).toHaveBeenCalledTimes(1);
  });

  it('Function UpdateAccountIdCredential()', async () => {
    const newKey = 2710112;
    credentialConnector.FindCredential = jest.fn().mockReturnValue(true);
    credentialConnector.UpdateCredential = jest.fn().mockReturnValue(true);
    await credentialConnector.UpdateAccountIdCredential(newKey);
    expect(credentialConnector.UpdateCredential).toHaveBeenCalledTimes(1);
  });

  it('Function UpdateLicenseCredential()', async () => {
    const newKey = 'LICENSEKEY';
    credentialConnector.FindCredential = jest.fn().mockReturnValue(true);
    credentialConnector.UpdateCredential = jest.fn().mockReturnValue(true);
    await credentialConnector.UpdateLicenseCredential(newKey);
    expect(credentialConnector.UpdateCredential).toHaveBeenCalledTimes(1);
  });

  it('Function UpdateCredentials()', async () => {
    credentialConnector.FindCredential = jest.fn().mockReturnValue(true);
    credentialConnector.UpdateCredential = jest.fn().mockReturnValue(true);
    await credentialConnector.UpdateCredentials();
    expect(credentialConnector.UpdateCredential).toHaveBeenCalledTimes(3);
  });
});
