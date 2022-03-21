import { NerdGraphQuery } from 'nr1';
import messages from '../config/messages.json';

export default class ValidationQuery {
  constructor(accountId) {
    this.accountId = accountId;
  }

  async validateNrqlQuery(query, accountID) {
    const accId = accountID === 0 ? this.accountId : accountID;
    const gql = `{
        actor {
         account(id: ${accId}) {
           nrql(query: "${query}") {
             results
           }
         }
       }
     }`;
    let dataReturn = {};
    const { error, data } = await NerdGraphQuery.query({ query: gql }).catch(
      errors => {
        return { error: { errors: [errors] } };
      }
    );
    let allErrors = [];
    if (error) {
      allErrors = [...(error.errors ?? []), ...(error.graphQLErrors ?? [])];
    }
    if (data && data.actor.account && data.actor.account.nrql) {
      /* istanbul ignore next */
      dataReturn = data.actor.account.nrql
        ? data.actor.account.nrql.results
        : [];
    }

    return { errors: allErrors, data: dataReturn };
  }

  async validateQuery(type, query, accountID = 0) {
    let testText = messages.test_query.wrong;
    let goodQuery = false;
    if (query === '') {
      testText = messages.test_query.good;
      goodQuery = true;
      return { testText, goodQuery };
    }
    const { data, errors } = await this.validateNrqlQuery(query, accountID);
    switch (type) {
      case 'Person-Count':
        goodQuery = this.countPRCQueryValidation(errors, data);
        break;
      case 'Process-Count':
      case 'API-Count':
        goodQuery = this.countPCCQueryValidation(errors, data);
        break;
      case 'Application-Performance':
      case 'FrontEnd-Performance':
      case 'API-Performance':
        goodQuery = this.healthQueryValidation(errors, data);
        break;
      case 'Synthetics-Check':
        goodQuery = this.checkSYNQueryValidation(errors, data);
        break;
      case 'API-Status':
        goodQuery = this.checkAPSQueryValidation(errors, data);
        break;
      case 'Workload-Status':
        goodQuery = this.checkWLDQueryValidation(errors, data);
        break;
      case 'Drops-Count':
        goodQuery = this.checkDRPQueryValidation(errors, data);
        break;
      case 'KPI-101':
        goodQuery = this.kpi101Validation(errors, query, data);
        break;
      case 'KPI-100':
        goodQuery = this.kpiQueryValidation(errors, data);
        break;
    }
    if (goodQuery) {
      testText = messages.test_query.good;
    }
    return { testText, goodQuery };
  }

  countPRCQueryValidation(errors, data) {
    let validate = true;
    let quantity = 0;
    let sessionCount = false;
    if (errors && errors.length > 0) {
      validate = false;
    } else if (data instanceof Array && data.length === 1) {
      for (const [key, value] of Object.entries(data[0])) {
        if (typeof value !== 'number') {
          validate = false;
          break;
        }
        if (key === 'session') sessionCount = true;
        quantity++;
      }
      if (quantity > 2) {
        validate = false;
      } else if (!sessionCount) {
        validate = false;
      }
    } else {
      validate = false;
    }
    return validate;
  }

  countPCCQueryValidation(errors, data) {
    let validate = true;
    let quantity = 0;
    let transactionCount = false;
    if (errors && errors.length > 0) {
      validate = false;
    } else if (data instanceof Array && data.length === 1) {
      for (const [key, value] of Object.entries(data[0])) {
        if (typeof value !== 'number') {
          validate = false;
          break;
        }
        if (key === 'count') transactionCount = true;
        quantity++;
      }
      if (quantity > 2) {
        validate = false;
      } else if (!transactionCount) {
        validate = false;
      }
    } else {
      validate = false;
    }
    return validate;
  }

  kpi101Validation(errors, query, data) {
    let validate = true;
    let quantity = 0;
    let transactionValue = false;
    let transactionComparison = false;
    if (errors && errors.length > 0) {
      validate = false;
    } else if (
      data instanceof Array &&
      data.length === 2 &&
      query.toLowerCase().includes('compare with')
    ) {
      for (const [key, value] of Object.entries(data[0])) {
        if (typeof value !== 'number' && key !== 'comparison') {
          validate = false;
          break;
        }
        if (key === 'value') transactionValue = true;
        if (key === 'comparison') transactionComparison = true;
        quantity++;
      }
      if (quantity > 2) {
        validate = false;
      } else if (!transactionValue || !transactionComparison) {
        validate = false;
      }
    } else {
      validate = false;
    }
    return validate;
  }

  kpiQueryValidation(errors, data) {
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

  healthQueryValidation(errors, data) {
    let validate = true;
    let quantity = 0;
    if (errors && errors.length > 0) {
      validate = false;
    } else {
      let apdexCount = false;
      let responseCount = false;
      let errorPercentage = false;
      if (data instanceof Array && data.length === 1) {
        for (const [key, value] of Object.entries(data[0])) {
          if (typeof value !== 'number' && key !== 'apdex') {
            validate = false;
            break;
          }
          if (key === 'apdex') apdexCount = true;
          if (key === 'response') responseCount = true;
          if (key === 'error') errorPercentage = true;
          quantity++;
        }
        if (quantity < 3) {
          validate = false;
        } else if (!apdexCount || !responseCount || !errorPercentage) {
          validate = false;
        }
      } else {
        validate = false;
      }
    }
    return validate;
  }

  checkSYNQueryValidation(errors, data) {
    let validate = true;
    let quantity = 0;
    if (errors && errors.length > 0) {
      validate = false;
    } else {
      let successPercentage = false;
      let responseTime = false;
      let durationTime = false;
      if (data instanceof Array && data.length === 1) {
        for (const [key, value] of Object.entries(data[0])) {
          if (value && typeof value !== 'number') {
            validate = false;
            break;
          }
          if (key === 'success') successPercentage = true;
          if (key === 'duration') durationTime = true;
          if (key === 'request') responseTime = true;
          quantity++;
        }
        if (quantity < 3) {
          validate = false;
        } else if (!successPercentage || !responseTime || !durationTime) {
          validate = false;
        }
      } else {
        validate = false;
      }
    }
    return validate;
  }

  checkAPSQueryValidation(errors, data) {
    let validate = true;
    let quantity = 0;
    if (errors && errors.length > 0) {
      validate = false;
    } else {
      let successPercentage = false;
      if (data instanceof Array && data.length === 1) {
        for (const [key, value] of Object.entries(data[0])) {
          if (value && typeof value !== 'number') {
            validate = false;
            break;
          }
          if (key === 'percentage') successPercentage = true;
          quantity++;
        }
        if (quantity > 2) {
          validate = false;
        } else if (!successPercentage) {
          validate = false;
        }
      } else {
        validate = false;
      }
    }
    return validate;
  }

  checkWLDQueryValidation(errors, data) {
    let validate = true;
    let quantity = 0;
    let sessionCount = false;
    if (errors && errors.length > 0) {
      validate = false;
    } else if (data instanceof Array && data.length === 1) {
      for (const [key] of Object.entries(data[0])) {
        if (key === 'statusValue') sessionCount = true;
        quantity++;
      }
      if (quantity > 2) {
        validate = false;
      } else if (!sessionCount) {
        validate = false;
      }
    } else {
      validate = false;
    }
    return validate;
  }

  checkDRPQueryValidation(errors, data) {
    let validate = true;
    let quantity = 0;
    let valueCount = false;
    if (errors && errors.length > 0) {
      validate = false;
    } else if (data instanceof Array && data.length === 1) {
      for (const [key, value] of Object.entries(data[0])) {
        if (typeof value !== 'number') {
          validate = false;
          break;
        }
        if (key === 'count') valueCount = true;
        quantity++;
      }
      if (quantity > 2) {
        validate = false;
      } else if (!valueCount) {
        validate = false;
      }
    } else {
      validate = false;
    }
    return validate;
  }
}
