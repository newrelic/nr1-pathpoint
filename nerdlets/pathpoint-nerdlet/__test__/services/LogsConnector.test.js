import LogConnector from '../../services/LogsConnector';

describe('LogsConnector', () => {
  let logConnector;

  beforeEach(() => {
    logConnector = new LogConnector();
  });
  it('Function SendLog()', () => {
    const datos = {
      pathpointID: '12587',
      mesagge: 'log enviado'
    };
    logConnector.SendLog(datos);
    expect(logConnector.buffer.length).toEqual(1);
    // eslint-disable-next-line no-console
    console.log(logConnector);
  });

  it('Function checkbuffer()', () => {
    logConnector.buffer = {
      pathpointID: '12587',
      mesagge: 'log enviado'
    };
    logConnector.checkBuffer();
    // eslint-disable-next-line no-console
    console.log(logConnector);
  });
});
