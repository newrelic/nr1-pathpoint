import {
    AccountStorageMutation,
    AccountStorageQuery
} from 'nr1';

import Canary from "../config/canary_states.json";


export default class StorageUpdate {
    constructor(accountId) {
        this.loading = false;
        this.dataCanary = Canary;
        this.accountId = accountId;
        this.getCanaryData();
        //this.saveCanaryData(this.dataCanary);
    }

    update(data) {
        this.loading = true;
        this.saveCanaryData(data)
        this.loading = false;
    }

    getCanaryData() {
        // Read a document
        AccountStorageQuery.query({
            accountId: this.accountId,
            collection: 'pathpoint',
            documentId: 'dataCanary',
        }).then(({ data }) => {
            if (data != null) {
                // IF data Exist
                console.log('READ CANARY DATA');
                this.dataCanary = data.dataCanary;
                // console.log(this.dataCanary);

            } else {
                this.saveCanaryData(this.dataCanary);
            }
            //console.table(this.dataCanary);
        });
    }

    saveCanaryData(data) {
        // Write a document
        AccountStorageMutation.mutate({
            accountId: this.accountId,
            actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
            collection: 'pathpoint',
            documentId: 'dataCanary',
            document: {
                dataCanary: data
            },
        }).then(({ data }) => {
            if (data != null) {
                console.log('SAVE CANARY DATA');
                // console.log(data.nerdStorageWriteDocument.dataCanary);
            }
        });
    }

    getLoadData() {
        return this.dataCanary;
    }
}