import axios from 'axios';
import nr1 from '../../../nr1.json';
import {
  NerdGraphMutation,
  NerdGraphQuery
} from 'nr1';

export default class NerdStorageVault {
    constructor() {
        this.state = {
            token: null,
        }
        this.storeToken = this.storeToken.bind(this);
    }

    async CallGetToken() {
        const query = `
            query {
                actor {
                    nerdStorageVault {
                        secrets {
                            key
                            value
                        }
                    }
                }
            }
        `;
        const variables = {
            key: "api_token",
        };

        let credentials = null;
        await NerdGraphQuery.query(
            {
                query: query
            }
        ).then(
            ({ loading, error, data }) => {
                if (error) {
                    console.error('error then',error);
                }

                if (data && data.actor.nerdStorageVault.secrets) {
                    credentials = data.actor.nerdStorageVault.secrets;
                } else {
                    //this.showPrompt();
                    console.log('entro else del data actor')
                }
            }
        )
        return credentials;
    }

    async storeToken(keySend, valueSend) {
        const mutation = `
            mutation($key: String!, $token: SecureValue!) {
                nerdStorageVaultWriteSecret(
                    scope: { actor: CURRENT_USER }
                    secret: { key: $key, value: $token }
                ) {
                    status
                    errors {
                        message
                        type
                    }
                }
            }
        `;
        const variables = {
            key: keySend,
            token: valueSend,
        };
        
        await NerdGraphMutation.mutate({ mutation: mutation, variables: variables }).then(
            (data) => {
                if (data.data.nerdStorageVaultWriteSecret.status === "SUCCESS") {
                    //this.setState({token: newToken})
                    console.log('exito al crear llave')
                }
            }
        );
    }
}