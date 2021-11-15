import { NerdGraphMutation, NerdGraphQuery } from 'nr1';

export default class NerdStorageVault {
  constructor() {
    this.state = {
      token: null
    };
  }

  async getCredentialsData() {
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
    let credentials = null;
    await NerdGraphQuery.query({
      query: query
    }).then(({ error, data }) => {
      if (error) {
        throw new Error(error);
      } else {
        credentials = data;
      }
    });
    return credentials;
  }

  async storeCredentialData(keySend, valueSend) {
    try {
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
        token: valueSend
      };
      await NerdGraphMutation.mutate({
        mutation: mutation,
        variables: variables
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
