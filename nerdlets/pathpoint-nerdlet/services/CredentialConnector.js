import axios from 'axios';
import nr1 from '../../../nr1.json';
import {
  AccountStorageMutation,
  AccountsQuery,
  AccountStorageQuery,
  NerdGraphQuery,
  logger
} from 'nr1';

export default class CredentialConnector {
    constructor() {
        this.pathpoint_id = nr1.id;
        this.accountId = 2710112;
        this.axiosInstance = axios.create();
        this.arrayStorageSyn = [];
        this.credential= {};
        this.uriCredential ='https://long-meadow-1713.rsamanez.workers.dev?https://synthetics.newrelic.com/synthetics/api/v1/secure-credentials';
        //this.uriCredential = 'https://synthetics.newrelic.com/synthetics/api/v1/secure-credentials';
    }

    SendCredentials(datos) {
        this.credential = datos;
    }
    
    createCredential(credential){
        const apiKey = 'NRAK-03J8FB1IZ44LX04LDC4CDJDBIIQ';
        //this.setSyntetic()
        console.log('create credential')
        this.axiosInstance
        .post(this.uriCredential, credential, { 
            headers: {
                contentType: 'application/json',
                'Api-Key': apiKey
            }
        })
        .then((resp) => {
            let arrayLocation =  resp.headers.location.split("https://synthetics.newrelic.com/synthetics/api/v1/secure-credentials/");
            let monitorID = arrayLocation[1];
            //this.setSyntetic(syntetic.name,monitorID);
            console.log('credential create',resp)
        })
        .catch((error) => {
            console.log('error:',error);
        });
    }

    updateCredential(credential){
        const apiKey = 'NRAK-03J8FB1IZ44LX04LDC4CDJDBIIQ';
        this.axiosInstance
        .put(this.uriCredential+'/'+credential.key,credential.update,{ 
            headers: {
                contentType: 'application/json',
                'Api-Key': apiKey
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

    deleteCredential(credential){
        const apiKey = 'NRAK-03J8FB1IZ44LX04LDC4CDJDBIIQ';
        this.axiosInstance
        .delete(this.uriCredential+'/'+credential.key,{ 
            headers: {
                contentType: 'application/json',
                'Api-Key': apiKey
            }
        })
        .then((resp) => {
            console.log('entro then delete');
            console.log('resp delete:',resp);
        })
        .catch((error) => {
            console.log('error delete:',error);
        });
    }
    
}