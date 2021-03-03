import { NerdGraphQuery } from 'nr1';
import {
  gql,
  setContext,
  ApolloClient,
  createHttpLink,
  InMemoryCache
} from '@apollo/client';
import CONFIG from '../../../.env.json';
import messages from '../config/messages.json';

export default class ValidationQuery {
  constructor(accountId) {
    this.accountId = accountId;
  }

  async validateNrqlQuery(query) {
    const gql = `{
        actor {
         account(id: ${this.accountId}) {
           nrql(query: "${query}") {
             results
           }
         }
       }
     }`;
    let dataReturn = {};
    const { errors, data } = await NerdGraphQuery.query({ query: gql });
    if (data) {
      dataReturn = data.actor.account.nrql
        ? data.actor.account.nrql.results
        : [];
    }
    return { errors, data: dataReturn };
  }

  async validatecloudFlareGraphQl(cloudFareApp) {
    const httpLink = createHttpLink({
      uri: CONFIG.cloudFlareURL
    });
    const authLink = setContext((_, { headers }) => {
      const token = CONFIG.cloudFlareAPITOKEN;
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : ''
        }
      };
    });
    const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache()
    });
    const s = Date.now() - 5 * 60000;
    const startTime = new Date(s).toISOString();
    const w = Date.now();
    const endTime = new Date(w).toISOString();
    const query = `query {
                viewer {
                  zones(filter: {zoneTag: "${CONFIG.cloudFlareZone}"}) {
                    validation:firewallEventsAdaptiveGroups(limit: 1000, 
                      filter: { clientRequestHTTPHost:"${cloudFareApp}",datetime_gt: "${startTime}", 
                      datetime_lt: "${endTime}"}) {
                      count
                          dimensions {      
                              clientIP
                          }
                      }
                    }
                  }
              }`;
    const results = await client.query({
      query: gql`
        ${query}
      `
    });
    return results.data.viewer.zones[0];
  }

  async validateQuery(type, query) {
    let testText = messages.test_query.good;
    let goodQuery = true;
    const { data, errors } =
      type !== 'Cloudflare App' && (await this.validateNrqlQuery(query));
    switch (type) {
      case 'Count Query':
        goodQuery = this.countQueryValidation(errors, data);
        break;
      case 'Apdex Query':
        goodQuery = this.apdexQueryValidation(errors, data);
        break;
      case 'Session Query':
        goodQuery = this.sessionQueryValidation(errors, data);
        break;
      case 'Session Query Duration':
        goodQuery = this.sessionDurationValidation(errors, query);

        break;
      case 'Log Measure Query':
        goodQuery = this.logMeasureValidation(errors, data);
        break;
      case 'Cloudflare App':
        goodQuery = await this.cloudFareValidation(query);
        break;
    }
    if (!goodQuery) {
      testText = messages.test_query.wrong;
    }
    return { testText, goodQuery };
  }

  countQueryValidation(errors, data) {
    let validate = true;
    let quantity = 0;
    if (errors && errors.length > 0) {
      validate = false;
    } else if (data instanceof Array && data.length === 1) {
      for (const [, value] of Object.entries(data[0])) {
        if (typeof value !== 'number') {
          validate = false;
          break;
        }
        quantity++;
      }
      if (quantity > 2) {
        validate = false;
      }
    } else {
      validate = false;
    }
    return validate;
  }

  apdexQueryValidation(errors, data) {
    let validate = true;
    let quantity = 0;
    if (errors && errors.length > 0) {
      validate = false;
    } else {
      let containCount = false;
      let containScore = false;
      if (data instanceof Array && data.length === 1) {
        for (const [key, value] of Object.entries(data[0])) {
          if (value && typeof value !== 'number') {
            validate = false;
            break;
          }
          if (key === 'count') containCount = true;
          if (key === 'score') containScore = true;
          quantity++;
        }
        if (quantity < 2 || quantity > 6) {
          validate = false;
        } else if (!containCount || !containScore) {
          validate = false;
        }
      } else {
        validate = false;
      }
    }
    return validate;
  }

  sessionQueryValidation(errors, data) {
    let validate = true;
    let quantity = 0;
    if (errors && errors.length > 0) {
      validate = false;
    } else if (data instanceof Array && data.length === 1) {
      for (const [, value] of Object.entries(data[0])) {
        if (typeof value !== 'number') {
          validate = false;
          break;
        }
        quantity++;
      }
      if (quantity > 1) {
        validate = false;
      }
    } else {
      validate = false;
    }
    return validate;
  }

  sessionDurationValidation(errors, query) {
    let validate = true;
    if (errors && errors.length > 0) {
      validate = false;
    } else if (!query.includes('FACET') && !query.includes('facet')) {
      validate = false;
    }
    return validate;
  }

  logMeasureValidation(errors, data) {
    let validate = true;
    let quantity = 0;
    let containR1 = false;
    let containR2 = false;
    if (errors && errors.length > 0) {
      validate = false;
    } else if (data instanceof Array && data.length === 1) {
      for (const [key, value] of Object.entries(data[0])) {
        if (typeof value !== 'number') {
          validate = false;
          break;
        }
        if (key === 'R1') containR1 = true;
        if (key === 'R2') containR2 = true;
        quantity++;
      }
      if (quantity > 2) {
        validate = false;
      } else if (!containR1 || !containR2) {
        validate = false;
      }
    } else {
      validate = false;
    }
    return validate;
  }

  async cloudFareValidation(cloudApp) {
    let validate = true;
    const response = await this.validatecloudFlareGraphQl(cloudApp);
    if (response && response.validation.length === 0) {
      validate = false;
    }
    return validate;
  }
}
