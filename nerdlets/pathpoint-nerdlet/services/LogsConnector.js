import axios from 'axios';
import nr1 from '../../../nr1.json';

// clase que trabaja de manera independiente
export default class LogConnector {
  constructor() {
    this.pathpoint_id = nr1.id;
    this.buffer = [];
    setInterval(() => {
      this.checkBuffer();
    }, 10000);
  }

  SendLog(datos) {
    this.buffer.push(datos);
  }

  checkBuffer() {
    const maxSizeBuffer = new Blob([JSON.stringify(this.buffer)]).size;
    const maxSixeSend = 999999;
    let ArrayResult = [];
    if (maxSizeBuffer > maxSixeSend) {
      ArrayResult = this.comprirArray(maxSizeBuffer, maxSixeSend);
      this.buffer = [];
    } else {
      ArrayResult.push(this.buffer);
      this.buffer = [];
    }
    const instance = axios.create();
    const licenseKey = '1d92fdd9f76cb3ff123dabd866824d47ecdbNRAL';
    if (ArrayResult[0].length > 0) {
      ArrayResult.forEach((element, index) => {
        const logEnvio = JSON.stringify(element);
        instance
          .post('https://log-api.newrelic.com/log/v1', logEnvio, {
            headers: {
              contentType: 'application/json',
              'X-License-Key': licenseKey
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

  // showBuffer() {
  //   console.log('buffer lentgh:', this.buffer.length);
  //   console.info('buffer size:', new Blob([JSON.stringify(this.buffer)]).size);
  // }

  comprirArray(maxSizeBuffer, maxSixeSend) {
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
}
