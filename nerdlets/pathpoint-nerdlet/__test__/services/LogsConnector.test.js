import LogConnector from '../../services/LogsConnector';
import { UserQuery } from 'nr1';

jest.mock(
  'nr1',
  () => {
    const UserQuery = {
      query: jest.fn().mockReturnValue({
        then: jest.fn().mockReturnValue({
          data: { name: 'NAME', id: 123, email: 'NAME@NAME.COM' }
        })
      })
    };
    return {
      UserQuery: UserQuery
    };
  },
  { virtual: true }
);
describe('LogsConnector', () => {
  let logConnector;

  beforeEach(() => {
    logConnector = new LogConnector();
  });

  it('Function EnableDisable()', () => {
    const status = 'ENABLED';
    logConnector.EnableDisable(status);
    expect(logConnector.enableDisable).toEqual('ENABLED');
  });

  it('Function SetLicenseKey()', () => {
    const key = '3658efa26da6';
    logConnector.SetLicenseKey(key);
    expect(logConnector.ingestLicense).toEqual('3658efa26da6');
  });

  it('Function SendLog()', () => {
    const data = {
      name: 'wigiboards',
      id: 2710112,
      email: 'test@test.com'
    };
    jest
      .spyOn(UserQuery, 'query')
      .mockImplementationOnce(() => Promise.resolve({ data }));
    logConnector.setInterval = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve());
    logConnector.userData = { name: 'NAME', id: 123, email: 'NAME@NAME.COM' };
    const datos = {
      pathpointID: '12587',
      application: 'Pathpoint',
      mesagge: 'log enviado',
      user_name: logConnector.userData.name,
      user_id: logConnector.userData.id,
      user_email: logConnector.userData.email,
      browser_name: 'Chroem',
      browser_version: '1.0.2'
    };
    logConnector.SendLog(datos);
    expect(logConnector.buffer.length).toEqual(1);
  });

  it('Function checkbuffer() with licenseKey and enableDisabled', () => {
    logConnector.ingestLicense = 'testLicense';
    logConnector.enableDisable = false;
    logConnector.CheckBuffer();
    expect(logConnector.buffer.length).toEqual(0);
  });

  it('Function checkbuffer() without licenseKey', () => {
    logConnector.ingestLicense = 'TestIngest';
    logConnector.enableDisable = true;
    jest
      .spyOn(logConnector.axiosInstance, 'post')
      .mockImplementationOnce(() => Promise.reject());
    logConnector.buffer = [
      {
        pathpointID: '12587',
        application: 'Pathpoint',
        mesagge: 'log enviado',
        user_name: 'NAME',
        user_id: 123,
        user_email: 'NAME@NAME.com',
        browser_name: 'Chroem',
        browser_version: '1.0.2'
      }
    ];
    logConnector.axiosInstance.post.then = jest.fn();
    logConnector.CheckBuffer();
    expect(logConnector.buffer.length).toEqual(0);
  });

  it('Function checkbuffer() without licenseKey and max buffer', () => {
    logConnector.ingestLicense = 'TestIngest';
    logConnector.enableDisable = true;
    jest
      .spyOn(logConnector.axiosInstance, 'post')
      .mockImplementationOnce(() => Promise.resolve());
    for (let i = 0; i < 23000; i++) {
      const obj = {
        pathpointID: '12587',
        application: 'Pathpoint',
        mesagge: 'log enviado',
        user_name: 'NAME',
        user_id: 123,
        user_email: 'NAME@NAME.com',
        browser_name: 'Chroem',
        browser_version: '1.0.2'
      };
      logConnector.buffer.push(obj);
    }
    logConnector.axiosInstance.post.then = jest.fn();
    logConnector.CheckBuffer();
    expect(logConnector.buffer.length).toEqual(0);
  });

  it('Function ValidateIngestLicense()', async () => {
    jest.spyOn(logConnector.axiosInstance, 'post').mockReturnValue(true);
    const result = await logConnector.ValidateIngestLicense();
    expect(result).toEqual(true);
  });

  it('Function ValidateIngestLicense() with catch', async () => {
    jest
      .spyOn(logConnector.axiosInstance, 'post')
      .mockRejectedValue(Error('error'));
    const result = await logConnector.ValidateIngestLicense();
    expect(result).toEqual(false);
  });
});
