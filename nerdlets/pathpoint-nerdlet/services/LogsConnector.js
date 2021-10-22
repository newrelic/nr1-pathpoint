import axios from 'axios';
import env from '../../../.env.json';

export const CreateLogRequest = dataLog => {
  // eslint-disable-next-line no-console
  console.log('llego');
  const data = {
    message: dataLog,
    logtype: 'accesslogs',
    service: 'login-service',
    hostname: 'login.example.com'
  };
  const licenseKey = env.newRelicLogLicense;

  const instance = axios.create();
  const logEnvio = JSON.stringify(data);
  // eslint-disable-next-line no-console
  console.log(env.proxyLog);
  instance.post(env.proxyLog, logEnvio, {
    headers: {
      contentType: 'application/json',
      'X-License-Key': licenseKey
    }
  });
};
