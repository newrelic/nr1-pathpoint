import LogConnector from '../../services/LogsConnector';

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
    // eslint-disable-next-line no-console
    console.log(logConnector);
  });
  it('Function SendLog()', () => {
    logConnector.userData = { name: 'NAME', id: 123, email: 'NAME@NAME.COM' };
    // logConnector.userData = {
    //   query: jest.fn().mockReturnValue({
    //     then: jest.fn().mockReturnValue({
    //       data: { name: 'NAME', id: 123, email: 'NAME@NAME.COM' }
    //     })
    //   })
    // };
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

  it('Function checkbuffer() with licenseKey', () => {
    logConnector.licenseKey = 'API-KEY-HERE';
    logConnector.CheckBuffer();
    expect(logConnector.buffer.length).toEqual(0);
  });

  it('Function checkbuffer() without licenseKey', () => {
    logConnector.licenseKey = '';
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
    logConnector.licenseKey = '';
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
});
