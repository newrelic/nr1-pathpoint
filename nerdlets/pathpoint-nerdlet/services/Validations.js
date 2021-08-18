import { NerdGraphQuery } from 'nr1';
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

  async validateQuery(type, query) {
    let testText = messages.test_query.wrong;
    let goodQuery = false;
    if (query === '') {
      return { testText, goodQuery };
    }
    const { data, errors } = await this.validateNrqlQuery(query);
    switch (type) {
      case 'PRC-COUNT-QUERY':
      case 'PCC-COUNT-QUERY':
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
      case 'Error Percentage Query':
        goodQuery = this.errorPercentageQuery(errors, query, data);
        break;
      case 'Full Open Query':
        goodQuery = this.fullOpenValidation(errors, data);
        break;
      case 'KPI-101':
        goodQuery = this.kpi101Validation(errors, query, data);
        break;
    }
    if (goodQuery) {
      testText = messages.test_query.good;
    }
    return { testText, goodQuery };
  }

  errorPercentageQuery(errors, query, data) {
    let validate = true;
    let quantity = 0;
    if (errors && errors.length > 0) {
      validate = false;
    } else if (!`${query}`.toLowerCase().includes('percentage')) {
      validate = false;
    } else {
      for (const [, value] of Object.entries(data[0])) {
        if (typeof value === 'string') {
          validate = false;
          break;
        }
        quantity++;
      }
      if (quantity > 1) {
        validate = false;
      }
    }
    return validate;
  }

  countPRCQueryValidation(errors, data) {
    let validate = true;
    let quantity = 0;
    if (errors && errors.length > 0) {
      validate = false;
    } else if (data instanceof Array && data.length === 1) {
      for (const [key, value] of Object.entries(data[0])) {
        if (typeof value !== 'number') {
          validate = false;
          break;
        }
        if (key === 'session') validate = false;
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

  kpi101Validation(errors, query, data) {
    let validate = false;
    if (errors && errors.length > 0) {
      validate = false;
    } else if (
      data instanceof Array &&
      data.length === 2 &&
      data[0].value &&
      data[0].comparison &&
      query.toLowerCase().includes('compare with')
    ) {
      validate = true;
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

  fullOpenValidation(errors, data) {
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
}
