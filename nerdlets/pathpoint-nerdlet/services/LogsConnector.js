import axios from 'axios';
import env from '../../../.env.json';

export const CreateLogRequest = dataLog => {
  const data = {
    message: dataLog, // si noes obligatorio lo quito, sies concateno la informacion de abajo
    // crear campo pathpoint_id = id del nr1
    // crear campo application = Patphpoint
    // crear campo action = TouchpointQuery
    // crear campo query = datos de la query ?? si hay mas queries defino mas queries
    // crear campo results = datos de resultado que devolvio la query
    // crear campo duration = tiempo que demoro en responder la query
    // crear campo error = "" ?? mensaje de error
    // crear campo touchpoint_name = Nombre del touchpoint
    // crear campo touchpoint_type = Type del touchpoint
    // crear campo stage = nombre del stage
    // crear un tipo de buffer para enviar logs en bloque
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
