import axios from 'axios';
import env from '../../../.env.json';

export const CreateLogRequest = dataLog => {
  const data = {
    message: dataLog,
    logtype: 'accesslogs',
    service: 'login-service',
    hostname: 'login.example.com'
  };
  const licenseKey = env.newRelicLogLicense;

  const instance = axios.create();
  const logEnvio = JSON.stringify(data);
  instance.post(env.proxyLog, logEnvio, {
    headers: {
      contentType: 'application/json',
      'X-License-Key': licenseKey
    }
  });
};
