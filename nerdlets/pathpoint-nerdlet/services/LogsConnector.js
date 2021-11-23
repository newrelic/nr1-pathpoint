import axios from 'axios';
import nr1Json from '../../../nr1.json';
import { UserQuery } from 'nr1';
import { browserName, browserVersion } from 'react-device-detect';

// clase que trabaja de manera independiente
export default class LogConnector {
  constructor() {
    this.enableDisable = false;
    this.pathpointId = nr1Json.id;
    this.ingestLicense = 'API-KEY-HERE';
    this.buffer = [];
    this.axiosInstance = axios.create();
    UserQuery.query().then(({ data }) => {
      this.userData = data;
    });
    setInterval(() => {
      this.CheckBuffer();
    }, 10000);
  }

  EnableDisable(status) {
    this.enableDisable = status;
  }

  SetLicenseKey(key) {
    this.ingestLicense = key;
    // console.log('LoggsConn:set-key:', key);
  }

  SendLog(datos) {
    const fullData = {
      ...datos,
      pathpoint_id: this.pathpointId,
      application: 'Pathpoint',
      user_name: this.userData.name,
      user_id: this.userData.id,
      user_email: this.userData.email,
      browser_name: browserName,
      browser_version: browserVersion
    };
    this.buffer.push(fullData);
  }

  CheckBuffer() {
    if (this.ingestLicense === 'API-KEY-HERE' || !this.enableDisable) {
      this.buffer = [];
      // console.log('NO-LOGS');
      return null;
    }
    // console.log('SENDING-LOGS');
    const maxSizeBuffer = new Blob([JSON.stringify(this.buffer)]).size;
    const maxSixeSend = 999999;
    let ArrayResult = [];
    if (maxSizeBuffer > maxSixeSend) {
      ArrayResult = this.ValidateArraySize(maxSizeBuffer, maxSixeSend);
      this.buffer = [];
    } else {
      ArrayResult.push(this.buffer);
      this.buffer = [];
    }
    if (ArrayResult[0].length > 0) {
      ArrayResult.forEach((element, index) => {
        const logEnvio = JSON.stringify(element);
        this.axiosInstance
          .post('https://log-api.newrelic.com/log/v1', logEnvio, {
            headers: {
              contentType: 'application/json',
              'X-License-Key': this.ingestLicense
            }
          })
          .then(() => {
            ArrayResult.splice(index, 1);
          })
          .catch(() => {
            // To do
          });
      });
    }
  }

  // ShowBuffer() {
  //   console.log('buffer lentgh:', this.buffer.length);
  //   console.info('buffer size:', new Blob([JSON.stringify(this.buffer)]).size);
  // }

  ValidateArraySize(maxSizeBuffer, maxSixeSend) {
    const nSalto = Math.ceil(maxSizeBuffer / maxSixeSend);
    const bufferLenght = this.buffer.length;
    const optimoSize = Math.ceil(bufferLenght / nSalto);
    const ArrayResult = [];
    let temporal = [];
    for (let i = 0; i < nSalto; i++) {
      temporal = this.buffer.slice(optimoSize * i, optimoSize * (i + 1));
      ArrayResult.push(temporal);
    }
    return ArrayResult;
  }

  async ValidateIngestLicense(license) {
    try {
      await this.axiosInstance.post(
        'https://log-api.newrelic.com/log/v1',
        {},
        {
          headers: {
            contentType: 'application/json',
            'X-License-Key': license
          }
        }
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}
