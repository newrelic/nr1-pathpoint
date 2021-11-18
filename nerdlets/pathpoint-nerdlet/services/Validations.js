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
    const { errors, data } = await NerdGraphQuery.query({ query: gql });
    if (data && data.actor.account && data.actor.account.nrql) {
      dataReturn = data.actor.account.nrql
        ? data.actor.account.nrql.results
        : [];
    }
    return { errors, data: dataReturn };
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
      case 'PRC-COUNT-QUERY':
        goodQuery = this.countPRCQueryValidation(errors, data);
        break;
      case 'PCC-COUNT-QUERY':
        goodQuery = this.countPCCQueryValidation(errors, data);
        break;
      case 'APP-HEALTH-QUERY':
      case 'FRT-HEALTH-QUERY':
        goodQuery = this.healthQueryValidation(errors, data);
        break;
      case 'SYN-CHECK-QUERY':
        goodQuery = this.checkSYNQueryValidation(errors, data);
        break;
      case 'WORKLOAD-QUERY':
        goodQuery = this.checkWLDQueryValidation(errors, data);
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

  // errorPercentageQuery(errors, query, data) {
  //   let validate = true;
  //   let quantity = 0;
  //   if (errors && errors.length > 0) {
  //     validate = false;
  //   } else if (!`${query}`.toLowerCase().includes('percentage')) {
  //     validate = false;
  //   } else {
  //     for (const [, value] of Object.entries(data[0])) {
  //       if (typeof value === 'string') {
  //         validate = false;
  //         break;
  //       }
  //       quantity++;
  //     }
  //     if (quantity > 1) {
  //       validate = false;
  //     }
  //   }
  //   return validate;
  // }

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

  // sessionQueryValidation(errors, data) {
  //   let validate = true;
  //   let quantity = 0;
  //   if (errors && errors.length > 0) {
  //     validate = false;
  //   } else if (data instanceof Array && data.length === 1) {
  //     for (const [, value] of Object.entries(data[0])) {
  //       if (typeof value !== 'number') {
  //         validate = false;
  //         break;
  //       }
  //       quantity++;
  //     }
  //     if (quantity > 1) {
  //       validate = false;
  //     }
  //   } else {
  //     validate = false;
  //   }
  //   return validate;
  // }

  // sessionDurationValidation(errors, query) {
  //   let validate = true;
  //   if (errors && errors.length > 0) {
  //     validate = false;
  //   } else if (!query.includes('FACET') && !query.includes('facet')) {
  //     validate = false;
  //   }
  //   return validate;
  // }

  // fullOpenValidation(errors, data) {
  //   let validate = true;
  //   let quantity = 0;
  //   let containR1 = false;
  //   let containR2 = false;
  //   if (errors && errors.length > 0) {
  //     validate = false;
  //   } else if (data instanceof Array && data.length === 1) {
  //     for (const [key, value] of Object.entries(data[0])) {
  //       if (typeof value !== 'number') {
  //         validate = false;
  //         break;
  //       }
  //       if (key === 'R1') containR1 = true;
  //       if (key === 'R2') containR2 = true;
  //       quantity++;
  //     }
  //     if (quantity > 2) {
  //       validate = false;
  //     } else if (!containR1 || !containR2) {
  //       validate = false;
  //     }
  //   } else {
  //     validate = false;
  //   }
  //   return validate;
  // }
}
