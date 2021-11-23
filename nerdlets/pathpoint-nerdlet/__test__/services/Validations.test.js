import Validations from '../../services/Validations';

jest.mock(
  'nr1',
  () => {
    const NerdGraphQuery = {
      query: jest.fn().mockImplementation(async ({ query }) => {
        if (query.includes('Count Query')) {
          let dataReturn = {};
          await new Promise(resolve => {
            dataReturn = {
              data: {
                actor: {
                  account: {
                    nrql: {
                      results: [{ count: 123 }]
                    }
                  }
                }
              }
            };
            return resolve();
          });
          return dataReturn;
        } else if (query.includes('Apdex Query')) {
          let dataReturn = {};
          await new Promise(resolve => {
            dataReturn = {
              data: {
                actor: {
                  account: {
                    nrql: {
                      results: [{ count: 294, f: 0, s: 294, score: 1, t: 0 }]
                    }
                  }
                }
              }
            };
            return resolve();
          });
          return dataReturn;
        } else if (query.includes('Session Query')) {
          let dataReturn = {};
          await new Promise(resolve => {
            dataReturn = {
              data: {
                actor: {
                  account: {
                    nrql: {
                      results: [{ session: 291 }]
                    }
                  }
                }
              }
            };
            return resolve();
          });
          return dataReturn;
        } else if (query.includes('Session Query Duration')) {
          let dataReturn = {};
          await new Promise(resolve => {
            dataReturn = {
              data: {
                actor: {
                  account: {
                    nrql: {
                      results: [
                        {
                          count: 1,
                          facet: '11b19437c360e5e',
                          session: '11b19437c360e5e'
                        }
                      ]
                    }
                  }
                }
              }
            };
            return resolve();
          });
          return dataReturn;
        } else if (query.includes('Session Query Duration facet')) {
          let dataReturn = {};
          await new Promise(resolve => {
            dataReturn = {
              data: {
                actor: {
                  account: {
                    nrql: {
                      results: [
                        {
                          count: 1,
                          facet: '11b19437c360e5e',
                          session: '11b19437c360e5e'
                        }
                      ]
                    }
                  }
                }
              }
            };
            return resolve();
          });
          return dataReturn;
        } else if (query.includes('Full Open Query')) {
          let dataReturn = {};
          await new Promise(resolve => {
            dataReturn = {
              data: {
                actor: {
                  account: {
                    nrql: {
                      results: [
                        {
                          R1: 72190,
                          R2: 34162
                        }
                      ]
                    }
                  }
                }
              }
            };
            return resolve();
          });
          return dataReturn;
        } else if (query.includes('Error Percentage Query')) {
          let dataReturn = {};
          await new Promise(resolve => {
            dataReturn = {
              data: {
                actor: {
                  account: {
                    nrql: {
                      results: [
                        {
                          percentage: 72190
                        }
                      ]
                    }
                  }
                }
              }
            };
            return resolve();
          });
          return dataReturn;
        }
      })
    };

    return {
      NerdGraphQuery: NerdGraphQuery
    };
  },
  { virtual: true }
);

describe('Validations class', () => {
  let validations;

  beforeEach(() => {
    validations = new Validations();
  });

  describe('Function validateNrqlQuery', () => {
    it('nrql', async () => {
      const validateQuery = await validations.validateNrqlQuery('Count Query');
      expect(validateQuery).toEqual({
        data: [{ count: 123 }],
        errors: undefined
      });
    });
  });

  // describe('Function countQueryValidation', () => {
  //   it('validate errors', async () => {
  //     const errors = [{ locations: '', message: '' }];
  //     errors.length = 1;
  //     const data = [];
  //     data.length = 0;
  //     const validateQuery = await validations.countQueryValidation(
  //       errors,
  //       data
  //     );
  //     expect(validateQuery).toEqual(false);
  //   });

  //   it('validate data object > 2', async () => {
  //     const data = [{ count: 123 }, { count: 123 }];
  //     data.length = 2;
  //     const validateQuery = await validations.countQueryValidation(
  //       undefined,
  //       data
  //     );
  //     expect(validateQuery).toEqual(false);
  //   });

  //   it('validate data number', async () => {
  //     const data = [{ count: '' }];
  //     data.length = 1;
  //     const validateQuery = await validations.countQueryValidation(
  //       undefined,
  //       data
  //     );
  //     expect(validateQuery).toEqual(false);
  //   });

  //   it('validate data quantity', async () => {
  //     const data = [{ count: 1213, sum: 358, average: 456 }];
  //     data.length = 1;
  //     const validateQuery = await validations.countQueryValidation(
  //       undefined,
  //       data
  //     );
  //     expect(validateQuery).toEqual(false);
  //   });

  //   it('validate data', async () => {
  //     const data = [{ count: 1213 }];
  //     data.length = 1;
  //     const validateQuery = await validations.countQueryValidation(
  //       undefined,
  //       data
  //     );
  //     expect(validateQuery).toEqual(true);
  //   });
  // });

  // describe('Function apdexQueryValidation', () => {
  //   it('validate errors', async () => {
  //     const errors = [{ locations: '', message: '' }];
  //     errors.length = 1;
  //     const data = [];
  //     data.length = 0;
  //     const validateQuery = await validations.apdexQueryValidation(
  //       errors,
  //       data
  //     );
  //     expect(validateQuery).toEqual(false);
  //   });

  //   it('validate data number', async () => {
  //     const data = [{ count: 'count', f: 0, s: 294, score: 1, t: 0 }];
  //     data.length = 1;
  //     const validateQuery = await validations.apdexQueryValidation(
  //       undefined,
  //       data
  //     );
  //     expect(validateQuery).toEqual(false);
  //   });

  //   it('validate data quantity < 2', async () => {
  //     const data = [{ count: 294 }];
  //     data.length = 1;
  //     const validateQuery = await validations.apdexQueryValidation(
  //       undefined,
  //       data
  //     );
  //     expect(validateQuery).toEqual(false);
  //   });

  //   it('validate data quantity > 6', async () => {
  //     const data = [{ count: 294, f: 0, s: 294, score: 1, t: 0, t1: 0, t2: 0 }];
  //     data.length = 1;
  //     const validateQuery = await validations.apdexQueryValidation(
  //       undefined,
  //       data
  //     );
  //     expect(validateQuery).toEqual(false);
  //   });

  //   it('validate data !containCount', async () => {
  //     const data = [{ f: 0, s: 294, score: 1, t: 0 }];
  //     data.length = 1;
  //     const validateQuery = await validations.apdexQueryValidation(
  //       undefined,
  //       data
  //     );
  //     expect(validateQuery).toEqual(false);
  //   });

  //   it('validate data !containScore', async () => {
  //     const data = [{ count: 294, f: 0, s: 294, t: 0 }];
  //     data.length = 1;
  //     const validateQuery = await validations.apdexQueryValidation(
  //       undefined,
  //       data
  //     );
  //     expect(validateQuery).toEqual(false);
  //   });

  //   it('validate not data ', async () => {
  //     const data = [];
  //     data.length = 0;
  //     const validateQuery = await validations.apdexQueryValidation(
  //       undefined,
  //       data
  //     );
  //     expect(validateQuery).toEqual(false);
  //   });

  //   it('validate data', async () => {
  //     const data = [{ count: 294, f: 0, s: 294, score: 1, t: 0 }];
  //     data.length = 1;
  //     const validateQuery = await validations.apdexQueryValidation(
  //       undefined,
  //       data
  //     );
  //     expect(validateQuery).toEqual(true);
  //   });
  // });

  // describe('Function sessionQueryValidation', () => {
  //   it('validate data number', async () => {
  //     const data = [{ session: '' }];
  //     data.length = 1;
  //     const validateQuery = await validations.sessionQueryValidation(
  //       undefined,
  //       data
  //     );
  //     expect(validateQuery).toEqual(false);
  //   });

  //   it('validate data quantity > 1', async () => {
  //     const data = [{ session: 281, t: 0 }];
  //     data.length = 1;
  //     const validateQuery = await validations.sessionQueryValidation(
  //       undefined,
  //       data
  //     );
  //     expect(validateQuery).toEqual(false);
  //   });

  //   it('validate not data ', async () => {
  //     const data = [];
  //     data.length = 0;
  //     const validateQuery = await validations.sessionQueryValidation(
  //       undefined,
  //       data
  //     );
  //     expect(validateQuery).toEqual(false);
  //   });
  //   it('validate errors', async () => {
  //     const errors = [{ locations: '', message: '' }];
  //     errors.length = 1;
  //     const data = [];
  //     data.length = 0;
  //     const validateQuery = await validations.sessionQueryValidation(
  //       errors,
  //       data
  //     );
  //     expect(validateQuery).toEqual(false);
  //   });
  // });

  // describe('Function sessionDurationValidation ', () => {
  //   it('validate data FACET', async () => {
  //     const errors = undefined;
  //     const validateQuery = await validations.sessionDurationValidation(
  //       errors,
  //       ' '
  //     );
  //     expect(validateQuery).toEqual(false);
  //   });

  //   it('validate data facet', async () => {
  //     const errors = undefined;
  //     const validateQuery = await validations.sessionDurationValidation(
  //       errors,
  //       ' '
  //     );
  //     expect(validateQuery).toEqual(false);
  //   });
  //   it('validate errors', async () => {
  //     const errors = [{ locations: '', message: '' }];
  //     errors.length = 1;
  //     const validateQuery = await validations.sessionDurationValidation(
  //       errors,
  //       ' '
  //     );
  //     expect(validateQuery).toEqual(false);
  //   });
  // });

  // describe('Function fullOpenValidation', () => {
  //   it('validate data', async () => {
  //     const data = [{ R1: 72843, R2: 34143 }];
  //     data.length = 1;
  //     const validateQuery = await validations.fullOpenValidation(
  //       undefined,
  //       data
  //     );
  //     expect(validateQuery).toEqual(true);
  //   });

  //   it('validate data quantity > 2', async () => {
  //     const data = [{ R1: 72843, R2: 34143, R3: 34143 }];
  //     data.length = 1;
  //     const validateQuery = await validations.fullOpenValidation(
  //       undefined,
  //       data
  //     );
  //     expect(validateQuery).toEqual(false);
  //   });

  //   it('validate data !containR1 ', async () => {
  //     const data = [{ R2: 34143 }];
  //     data.length = 1;
  //     const validateQuery = await validations.fullOpenValidation(
  //       undefined,
  //       data
  //     );
  //     expect(validateQuery).toEqual(false);
  //   });

  //   it('validate data !containR2 ', async () => {
  //     const data = [{ R1: 34143 }];
  //     data.length = 1;
  //     const validateQuery = await validations.fullOpenValidation(
  //       undefined,
  //       data
  //     );
  //     expect(validateQuery).toEqual(false);
  //   });

  //   it('validate errors', async () => {
  //     const errors = [{ locations: '', message: '' }];
  //     errors.length = 1;
  //     const data = [];
  //     data.length = 0;
  //     const validateQuery = await validations.fullOpenValidation(errors, data);
  //     expect(validateQuery).toEqual(false);
  //   });

  //   it('validate data number', async () => {
  //     const errors = [];
  //     errors.length = 0;
  //     const data = [{ R1: '', R2: '' }];
  //     data.length = 1;
  //     const validateQuery = await validations.fullOpenValidation(errors, data);
  //     expect(validateQuery).toEqual(false);
  //   });

  //   it('validate data array', async () => {
  //     const errors = [];
  //     errors.length = 0;
  //     const data = [];
  //     data.length = 0;
  //     const validateQuery = await validations.fullOpenValidation(errors, data);
  //     expect(validateQuery).toEqual(false);
  //   });
  // });

  // describe('Function errorPercentageQuery', () => {
  //   it('validate errors', async () => {
  //     const errors = [{ locations: '', message: '' }];
  //     const validateQuery = await validations.errorPercentageQuery(
  //       errors,
  //       '',
  //       []
  //     );
  //     expect(validateQuery).toBeFalsy();
  //   });

  //   it('validate query sintaxis', async () => {
  //     const validateQuery = await validations.errorPercentageQuery(
  //       undefined,
  //       'any query sample',
  //       []
  //     );
  //     expect(validateQuery).toBeFalsy();
  //   });

  //   it('validate results type', async () => {
  //     const data = [{ session: 'session' }];
  //     const validateQuery = await validations.errorPercentageQuery(
  //       undefined,
  //       'percentage',
  //       data
  //     );
  //     expect(validateQuery).toBeFalsy();
  //   });

  //   it('validate results quantity', async () => {
  //     const data = [{ percentage: 1, results: 1 }];
  //     const validateQuery = await validations.errorPercentageQuery(
  //       undefined,
  //       'percentage',
  //       data
  //     );
  //     expect(validateQuery).toBeFalsy();
  //   });
  // });

  describe('Function validateQuery', () => {
    it('validate error', async () => {
      const validateQuery = await validations.validateQuery('type', '');
      expect(validateQuery).toEqual({
        goodQuery: true,
        testText: 'Successfully validated'
      });
    });

    it('validate count query', async () => {
      const validateQuery = await validations.validateQuery(
        'Count Query',
        'Count Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: false,
        testText: 'Incorrect validated'
      });
    });

    it('validate apdex query', async () => {
      const validateQuery = await validations.validateQuery(
        'Apdex Query',
        'Apdex Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: false,
        testText: 'Incorrect validated'
      });
    });

    it('validate session query', async () => {
      const validateQuery = await validations.validateQuery(
        'Session Query',
        'Session Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: false,
        testText: 'Incorrect validated'
      });
    });

    it('validate error percentage query', async () => {
      const validateQuery = await validations.validateQuery(
        'Error Percentage Query',
        'Error Percentage Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: false,
        testText: 'Incorrect validated'
      });
    });

    it('validate session query duration incorrect', async () => {
      const validateQuery = await validations.validateQuery(
        'Session Query Duration',
        'Session Query Duration'
      );
      expect(validateQuery).toEqual({
        goodQuery: false,
        testText: 'Incorrect validated'
      });
    });

    it('validate session query duration correct', async () => {
      const validateQuery = await validations.validateQuery(
        'Session Query Duration',
        'Session Query Duration facet'
      );
      expect(validateQuery).toEqual({
        goodQuery: false,
        testText: 'Incorrect validated'
      });
    });

    it('validate full open query', async () => {
      const validateQuery = await validations.validateQuery(
        'Full Open Query',
        'Full Open Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: false,
        testText: 'Incorrect validated'
      });
    });

    it('Validate query type PRC-COUNT-QUERY', async () => {
      const validateQuery = await validations.validateQuery(
        'PRC-COUNT-QUERY',
        'Full Open Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: false,
        testText: 'Incorrect validated'
      });
    });

    it('Validate query type PCC-COUNT-QUERY', async () => {
      const validateQuery = await validations.validateQuery(
        'PCC-COUNT-QUERY',
        'Full Open Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: false,
        testText: 'Incorrect validated'
      });
    });

    it('Validate query type APP-HEALTH-QUERY', async () => {
      const validateQuery = await validations.validateQuery(
        'APP-HEALTH-QUERY',
        'Full Open Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: false,
        testText: 'Incorrect validated'
      });
    });

    it('Validate query type FRT-HEALTH-QUERY', async () => {
      const validateQuery = await validations.validateQuery(
        'FRT-HEALTH-QUERY',
        'Full Open Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: false,
        testText: 'Incorrect validated'
      });
    });

    it('Validate query type SYN-CHECK-QUERY', async () => {
      const validateQuery = await validations.validateQuery(
        'SYN-CHECK-QUERY',
        'Full Open Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: false,
        testText: 'Incorrect validated'
      });
    });

    it('Validate query type WORKLOAD-QUERY', async () => {
      const validateQuery = await validations.validateQuery(
        'WORKLOAD-QUERY',
        'Full Open Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: false,
        testText: 'Incorrect validated'
      });
    });

    it('Validate query type KPI-101', async () => {
      const validateQuery = await validations.validateQuery(
        'KPI-101',
        'Full Open Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: false,
        testText: 'Incorrect validated'
      });
    });

    it('Validate query type KPI-100', async () => {
      const validateQuery = await validations.validateQuery(
        'KPI-100',
        'Full Open Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: true,
        testText: 'Successfully validated'
      });
    });

    it('Function countPRCQueryValidation()', () => {
      const errors = [];
      const data1 = [{ session: 'data1' }];
      const data2 = [{ session: 235478, session2: 235458, session3: 235467 }];
      const validateErrors = validations.countPRCQueryValidation('Full', '');
      expect(validateErrors).toEqual(false);
      const validateData1 = validations.countPRCQueryValidation('', 'Full');
      expect(validateData1).toEqual(false);
      const validateQueryData1 = validations.countPRCQueryValidation('', data1);
      expect(validateQueryData1).toEqual(false);
      const validateQueryData2 = validations.countPRCQueryValidation(
        errors,
        data2
      );
      expect(validateQueryData2).toEqual(false);
    });

    it('Function countPCCQueryValidation()', () => {
      const errors = [];
      const data1 = [{ session: 'data1' }];
      const data2 = [{ count: 235478, session2: 235458, session3: 235467 }];
      const validateErrors = validations.countPCCQueryValidation('Full', '');
      expect(validateErrors).toEqual(false);
      const validateData1 = validations.countPCCQueryValidation('', 'Full');
      expect(validateData1).toEqual(false);
      const validateQueryData1 = validations.countPCCQueryValidation(
        errors,
        data1
      );
      expect(validateQueryData1).toEqual(false);
      const validateQueryData2 = validations.countPCCQueryValidation(
        errors,
        data2
      );
      expect(validateQueryData2).toEqual(false);
      // let quantity = 0;
      // let validate = true;
      // let transactionCount = false;
      // if (errors && errors.length > 0) {
      //   validate = false;
      //   // eslint-disable-next-line no-console
      //   console.log(validate);
      //   const error = 'error no vacio';
      //   // eslint-disable-next-line no-console
      //   console.log(error);
      // } else if (data2 instanceof Array && data2.length === 1) {
      //   for (const [key, value] of Object.entries(data2[0])) {
      //     if (typeof value !== 'number') {
      //       validate = false;
      //       const valuexd = 'diferente de number';
      //       // eslint-disable-next-line no-console
      //       console.log(valuexd);
      //       // eslint-disable-next-line no-console
      //       console.log(validate);
      //       break;
      //     }
      //     if (key === 'count') transactionCount = true;
      //     quantity++;
      //   }
      //   if (quantity > 2) {
      //     const quantityxd = 'quantity mayor a 2';
      //     // eslint-disable-next-line no-console
      //     console.log(quantityxd);
      //     validate = false;
      //     // eslint-disable-next-line no-console
      //     console.log(validate);
      //   } else if (!transactionCount) {
      //     const transactionCountxd = 'diferente transaction';
      //     // eslint-disable-next-line no-console
      //     console.log(transactionCountxd);
      //     validate = false;
      //     // eslint-disable-next-line no-console
      //     console.log(validate);
      //   }
      // } else {
      //   const transactionCountxd = 'data length mayor a 2';
      //   // eslint-disable-next-line no-console
      //   console.log(transactionCountxd);
      //   validate = false;
      // }
    });

    it('Function kpi101Validation()', () => {
      const errors = [];
      const data = [
        { session: 'data1', value: 'value', comparison: 'comparison' },
        { session: 'data1', value: 'value', comparison: 'comparison' }
      ];
      const data2 = [
        { value: 2789, comparison: 'comp', test: 123 },
        { value: 5698 }
      ];
      const query =
        'SELECT count(*) as value  FROM Transaction COMPARE WITH 1 day ago';
      const validateErrors = validations.kpi101Validation('error', '');
      expect(validateErrors).toEqual(false);
      const validateData = validations.kpi101Validation(errors, query, data);
      expect(validateData).toEqual(false);
      expect(validations.kpi101Validation(errors, query, data2)).toEqual(false);
    });

    it('Function kpiQueryValidation()', () => {
      const errors = [];
      const data1 = [{ session: 'data1' }];
      const data2 = [{ session: 235478, session2: 235458, session3: 235467 }];
      const data3 = [
        { session: 235478, session2: 235458, session3: 235467 },
        { session: 235478, session2: 235458, session3: 235467 }
      ];
      const validateErrors = validations.kpiQueryValidation('error', '');
      expect(validateErrors).toEqual(false);
      const validateData = validations.kpiQueryValidation(errors, data1);
      expect(validateData).toEqual(false);
      const validateDataNoBreak = validations.kpiQueryValidation(errors, data2);
      expect(validateDataNoBreak).toEqual(false);
      const validateDataElse = validations.kpiQueryValidation(errors, data3);
      expect(validateDataElse).toEqual(false);
    });

    it('Function healthQueryValidation()', () => {
      const errors = [];
      const data1 = [{ session: 'data1' }];
      const data2 = [{ session: 235478, session2: 235458 }];
      const data3 = [
        { session: 235478, session2: 235458 },
        { session: 235478, session2: 235458 }
      ];
      const data4 = [{ apdex: 235478, session2: 235458, session3: 235458 }];
      const data5 = [{ session1: 235478, response: 235458, session3: 235458 }];
      const data6 = [{ session1: 235478, session2: 235458, error: 235458 }];
      const validateErrors = validations.healthQueryValidation('error', '');
      expect(validateErrors).toEqual(false);
      const validateData = validations.healthQueryValidation(errors, data1);
      expect(validateData).toEqual(false);
      const validateDataNoBreak = validations.healthQueryValidation(
        errors,
        data2
      );
      expect(validateDataNoBreak).toEqual(false);
      const validateDataElse = validations.healthQueryValidation(errors, data3);
      expect(validateDataElse).toEqual(false);
      const validateDataElseQuantity = validations.healthQueryValidation(
        errors,
        data4
      );
      expect(validateDataElseQuantity).toEqual(false);
      const validateDataElseQuantityResponse = validations.healthQueryValidation(
        errors,
        data5
      );
      expect(validateDataElseQuantityResponse).toEqual(false);
      const validateDataElseQuantityError = validations.healthQueryValidation(
        errors,
        data6
      );
      expect(validateDataElseQuantityError).toEqual(false);
    });

    it('Function checkSYNQueryValidation()', () => {
      const errors = [];
      const data1 = [{ session: 'data1' }];
      const data2 = [{ session: 235478, session2: 235458 }];
      const data3 = [
        { session: 235478, session2: 235458 },
        { session: 235478, session2: 235458 }
      ];
      const data4 = [{ success: 235478, session2: 235458, session3: 235458 }];
      const data5 = [{ session1: 235478, duration: 235458, session3: 235458 }];
      const data6 = [{ session1: 235478, session2: 235458, request: 235458 }];
      const validateErrors = validations.checkSYNQueryValidation('error', '');
      expect(validateErrors).toEqual(false);
      const validateData = validations.checkSYNQueryValidation(errors, data1);
      expect(validateData).toEqual(false);
      const validateDataNoBreak = validations.checkSYNQueryValidation(
        errors,
        data2
      );
      expect(validateDataNoBreak).toEqual(false);
      const validateDataElse = validations.checkSYNQueryValidation(
        errors,
        data3
      );
      expect(validateDataElse).toEqual(false);
      const validateDataElseQuantity = validations.checkSYNQueryValidation(
        errors,
        data4
      );
      expect(validateDataElseQuantity).toEqual(false);
      const validateDataElseQuantityDuration = validations.checkSYNQueryValidation(
        errors,
        data5
      );
      expect(validateDataElseQuantityDuration).toEqual(false);
      const validateDataElseQuantityRequest = validations.checkSYNQueryValidation(
        errors,
        data6
      );
      expect(validateDataElseQuantityRequest).toEqual(false);
    });

    it('Function checkWLDQueryValidation()', () => {
      const errors = [];
      const data = [
        {
          statusValue: 'statusValue',
          session: 'session',
          comparison: 'comparison'
        }
      ];
      const data2 = [
        {
          statusValue: 'statusValue'
        },
        {
          session: 'session',
          comparison: 'comparison'
        }
      ];
      expect(validations.checkWLDQueryValidation('error', '')).toEqual(false);
      expect(validations.checkWLDQueryValidation(errors, data)).toEqual(false);
      expect(validations.checkWLDQueryValidation(errors, data2)).toEqual(false);
    });
  });
});
