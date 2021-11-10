import axios from 'axios';
import nr1 from '../../../nr1.json';
import {
  AccountStorageMutation,
  AccountsQuery,
  AccountStorageQuery,
  NerdGraphQuery,
  logger
} from 'nr1';
//import Script from '../../../script_example.js';

// clase que trabaja de manera independiente
export default class SynConnector {
  constructor() {
    this.pathpoint_id = nr1.id;
    this.buffer = [];
    this.accountId = 2710112;
    this.syntetic = null;
    this.axiosInstance = axios.create();
    this.storageSyntetic = this.getSyntetic();
    this.apiKey = 'NRAK-03J8FB1IZ44LX04LDC4CDJDBIIQ'; // viene del storage vault del nerdlet ---> credenciales
    this.arrayStorageSyn = [];
    this.uriSyntetic ='https://long-meadow-1713.rsamanez.workers.dev?https://synthetics.newrelic.com/synthetics/api/v3/monitors'; // del .env
    // setInterval(() => {
    //   this.checkSyntetic();
    // }, 3000);
  }

  SendLog(datos) {
    this.buffer.push(datos);
  }

  SendSyntetic(datos) {
    this.syntetic = datos;
  }

  async getMonitor(monitorID){
    
      const monitor = await this.axiosInstance
      .get(this.uriSyntetic+'/'+monitorID, { 
        headers: {
          contentType: 'application/json',
          'Api-Key': this.apiKey
        }
      })
      return monitor.data
  }

  async Create(syntetic) {
    // const script64 = this.getBase64(Script);
    // console.log('script base64:', script64)
    //this.setSyntetic()
    await this.axiosInstance
    .post(this.uriSyntetic, syntetic, { 
      headers: {
        contentType: 'application/json',
        'Api-Key': this.apiKey
      }
    })
    .then(async (resp) => {
      let arrayLocation =  resp.headers.location.split("https://synthetics.newrelic.com/synthetics/api/v3/monitors/");
      let monitorID = arrayLocation[1];
      await this.setSyntetic(syntetic.name,monitorID);
      //this.updateScript(monitorID);
      //this.syntetic = null;
    })
    .catch((error) => {
      console.log('error:',error);
    });
  }

  async getSyntetic(){
    try {
      const { data } = await AccountStorageQuery.query({
        accountId: this.accountId,
        collection: 'pathpoint',
        documentId: 'syntetic'
      });
      this.arrayStorageSyn = data.syntetic
    } catch (error) {
      throw new Error(error);
    }
  }

  async setSyntetic(name,monitorID){
    let syn = {
      name: name,
      monitorId: monitorID
    }
    this.arrayStorageSyn.push(syn);
    try {
      console.log('entro try')
      await AccountStorageMutation.mutate({
        accountId: this.accountId,
        actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection: 'pathpoint',
        documentId: 'syntetic', // 'syntetic'
        document: {
          syntetic: this.arrayStorageSyn
          // poner: syntetic: [{ nombre, idmonitor, iddiferentes }] , hacer esto en el connector, el constructor saca la informacion qse tiene en el storage, informacion de los monitores creados
          // una lista q va creciendo con los monitores, elimino o agrego y la lista se aumenta
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateMonitor(monitorID, monitor){
    await this.axiosInstance
      .put(this.uriSyntetic+'/'+monitorID,monitor,{ 
        headers: {
          contentType: 'application/json',
          'Api-Key': this.apiKey
        }
      })
      .then((resp) => {
        console.log('entro then update monitor');
        console.log('resp update monitor :',resp);
      })
      .catch((error) => {
        console.log('error update monitor:',error);
      });
  }

  async updateScript(monitorID,scriptUpdate){
    await this.axiosInstance
      .put(this.uriSyntetic+'/'+monitorID+'/script',scriptUpdate,{ 
        headers: {
          contentType: 'application/json',
          'Api-Key': this.apiKey
        }
      })
      .then((resp) => {
        console.log('entro then update');
        console.log('resp update:',resp);
      })
      .catch((error) => {
        console.log('error update:',error);
      });
  }

  async Delete(monitorID){
    console.log('lelgo request delete')
    await this.axiosInstance
      .delete(this.uriSyntetic+'/'+monitorID,{ 
        headers: {
          contentType: 'application/json',
          'Api-Key': this.apiKey
        }
      })
      .then(async (resp) => {
        console.log('entro then delete');
        console.log('resp delete:',resp);
        await this.deleteStorage(monitorID);
      })
      .catch((error) => {
        console.log('error delete:',error);
      });
  }

  async deleteStorage(monitorID){
    let array = this.arrayStorageSyn;
    var index = array.indexOf(monitorID);
    array = array.filter((obj) => {
      return obj.monitorId !== monitorID;
    });
    try {
      console.log('entro try')
      await AccountStorageMutation.mutate({
        accountId: 1606862,   //this.accountId,
        actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection: 'pathpoint',
        documentId: 'syntetic', // 'syntetic'
        document: {
          syntetic: array
          // poner: syntetic: [{ nombre, idmonitor, iddiferentes }] , hacer esto en el connector, el constructor saca la informacion qse tiene en el storage, informacion de los monitores creados
          // una lista q va creciendo con los monitores, elimino o agrego y la lista se aumenta
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  // getBase64(file) {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = error => reject(error);
  //   });
  // }

  // checkBuffer() {
  //   const maxSizeBuffer = new Blob([JSON.stringify(this.buffer)]).size;
  //   const maxSixeSend = 999999;
  //   let ArrayResult = [];
  //   if (maxSizeBuffer > maxSixeSend) {
  //     ArrayResult = this.comprirArray(maxSizeBuffer, maxSixeSend);
  //     this.buffer = [];
  //   } else {
  //     ArrayResult.push(this.buffer);
  //     this.buffer = [];
  //   }
  //   const instance = axios.create();
  //   const licenseKey = '1d92fdd9f76cb3ff123dabd866824d47ecdbNRAL';
  //   if (ArrayResult[0].length > 0) {
  //     ArrayResult.forEach((element, index) => {
  //       const logEnvio = JSON.stringify(element);
  //       instance
  //         .post('https://log-api.newrelic.com/log/v1', logEnvio, {
  //           headers: {
  //             contentType: 'application/json',
  //             'X-License-Key': licenseKey
  //           }
  //         })
  //         .then(() => {
  //           ArrayResult.splice(index, 1);
  //         })
  //         .catch(() => {
  //           // To do
  //         });
  //     });
  //   }
  // }

  // showBuffer() {
  //   console.log('buffer lentgh:', this.buffer.length);
  //   console.info('buffer size:', new Blob([JSON.stringify(this.buffer)]).size);
  // }

  // comprirArray(maxSizeBuffer, maxSixeSend) {
  //   const nSalto = Math.ceil(maxSizeBuffer / maxSixeSend);
  //   const bufferLenght = this.buffer.length;
  //   const optimoSize = Math.ceil(bufferLenght / nSalto);
  //   const ArrayResult = [];
  //   let temporal = [];
  //   for (let i = 0; i < nSalto; i++) {
  //     temporal = this.buffer.slice(optimoSize * i, optimoSize * (i + 1));
  //     ArrayResult.push(temporal);
  //   }
  //   return ArrayResult;
  // }
}
