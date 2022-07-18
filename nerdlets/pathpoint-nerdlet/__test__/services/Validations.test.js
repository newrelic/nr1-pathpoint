import Validations from '../../services/Validations';
import { NerdGraphQuery } from 'nr1';

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
        } else if (query.includes('Count Query NRQL')) {
          let dataReturn = {};
          await new Promise(resolve => {
            dataReturn = {
              data: {
                actor: {
                  account: {}
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
        } else if (query.includes('Drops-Count')) {
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
      const validateQuery = await validations.validateNrqlQuery(
        'Count Query',
        0
      );
      expect(validateQuery).toEqual({
        data: [{ count: 123 }],
        errors: []
      });
    });
  });

  describe('Function validateNrqlQuery without nrql data', () => {
    it('nrql', async () => {
      const validateQuery = await validations.validateNrqlQuery(
        'Count Query NRQL',
        0
      );
      expect(validateQuery).toEqual({
        data: [{ count: 123 }],
        errors: []
      });
    });
  });

  describe('Function validateNrqlQuery without nrql data leve 1', () => {
    it('nrql', async () => {
      const validateQuery = await validations.validateNrqlQuery(
        'Count Query NRQL',
        0
      );
      expect(validateQuery).toEqual({
        data: [{ count: 123 }],
        errors: []
      });
    });
  });

  describe('Function validateNrqlQuery with AccountID not null', () => {
    it('nrql', async () => {
      const validateQuery = await validations.validateNrqlQuery(
        'Count Query',
        223456
      );
      expect(validateQuery).toEqual({
        data: [{ count: 123 }],
        errors: []
      });
    });

    it('Function validateNrqlQuery with catch NerdGraphQuery', async () => {
      jest.spyOn(NerdGraphQuery, 'query').mockRejectedValue(Error('error'));
      await expect(validations.validateNrqlQuery()).toBeTruthy();
    });
  });

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

    it('validate Drops-Count', async () => {
      const validateQuery = await validations.validateQuery(
        'Drops-Count',
        'Drops-Count'
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

    it('Validate query type Person-Count', async () => {
      const validateQuery = await validations.validateQuery(
        'Person-Count',
        'Full Open Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: false,
        testText: 'Incorrect validated'
      });
    });

    it('Validate query type Process-Count', async () => {
      const validateQuery = await validations.validateQuery(
        'Process-Count',
        'Full Open Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: false,
        testText: 'Incorrect validated'
      });
    });

    it('Validate query type Application-Performance', async () => {
      const validateQuery = await validations.validateQuery(
        'Application-Performance',
        'Full Open Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: false,
        testText: 'Incorrect validated'
      });
    });

    it('Validate query type FrontEnd-Performance', async () => {
      const validateQuery = await validations.validateQuery(
        'FrontEnd-Performance',
        'Full Open Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: false,
        testText: 'Incorrect validated'
      });
    });

    it('Validate query type Synthetics-Check', async () => {
      const validateQuery = await validations.validateQuery(
        'Synthetics-Check',
        'Full Open Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: false,
        testText: 'Incorrect validated'
      });
    });

    it('Validate query type API-Status', async () => {
      validations.checkAPSQueryValidation = jest.fn().mockReturnValue(true);
      const validateQuery = await validations.validateQuery(
        'API-Status',
        'New query'
      );
      expect(validateQuery).toEqual({
        goodQuery: true,
        testText: 'Successfully validated'
      });
    });

    it('Validate query type Workload-Status', async () => {
      const validateQuery = await validations.validateQuery(
        'Workload-Status',
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
        goodQuery: false,
        testText: 'Incorrect validated'
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

    it('Function kpi101Validation() with no transactionComparison', () => {
      const data = [{ a: 'a' }, { a: 'a' }];
      const query =
        'SELECT count(*) as value  FROM Transaction COMPARE WITH 1 day ago';
      validations.kpi101Validation([], query, data);
    });

    it('Function kpi101Validation() with transactionComparison', () => {
      const data = [{ comparison: 'a' }, { a: 'a' }];
      const query =
        'SELECT count(*) as value  FROM Transaction COMPARE WITH 1 day ago';
      validations.kpi101Validation([], query, data);
    });

    it('Function kpi101Validation() with transactionComparison and data.length = 1', () => {
      const data = [{ comparison: 'a' }];
      const query =
        'SELECT count(*) as value  FROM Transaction COMPARE WITH 1 day ago';
      expect(validations.kpi101Validation([], query, data)).toEqual(false);
    });

    it('checkDRPQueryValidation with errors', () => {
      const data = [{ a: 'a' }, { a: 'a' }];
      const errors = [{ error: true }];
      validations.checkDRPQueryValidation(errors, data);
    });

    it('checkDRPQueryValidation with no errors', () => {
      const data = [{ count: 'a' }];
      const errors = [];
      const dataCount = [{ count: 789 }];
      const dataQuantity3 = [{ count: 789, percentage: 98, apex: 15 }];
      validations.checkDRPQueryValidation(errors, data);
      validations.checkDRPQueryValidation(errors, dataCount);
      validations.checkDRPQueryValidation(errors, dataQuantity3);
    });

    it('checkDRPQueryValidation with no errors and data with level 1', () => {
      const data = [{ count: 'a' }];
      validations.checkDRPQueryValidation(null, data);
    });

    it('checkDRPQueryValidation with no errors and data with length > 1', () => {
      const data = [{ count: 'a' }, { percenatge: 56 }];
      validations.checkDRPQueryValidation(null, data);
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
      const data3 = [
        {
          statusComparison: 'statusComparison'
        }
      ];
      expect(validations.checkWLDQueryValidation('error', '')).toEqual(false);
      expect(validations.checkWLDQueryValidation(errors, data)).toEqual(false);
      expect(validations.checkWLDQueryValidation(errors, data2)).toEqual(false);
      expect(validations.checkWLDQueryValidation(errors, data3)).toEqual(false);
    });

    it('Function checkAPSQueryValidation', () => {
      const errors = [];
      const data = [
        {
          statusValue: 'statusValue'
        }
      ];
      const dataPercentage = [
        {
          percentage: 98
        }
      ];
      const dataPercentage2values = [
        {
          percentage: 98,
          error_treshold: 15,
          apex: 19
        }
      ];
      const dataLength2 = [
        {
          percentage: 98
        },
        {
          percentage: 98
        }
      ];
      expect(validations.checkAPSQueryValidation('errors', '')).toEqual(false);
      expect(validations.checkAPSQueryValidation(errors, data)).toEqual(false);
      expect(
        validations.checkAPSQueryValidation(errors, dataPercentage)
      ).toEqual(true);
      expect(
        validations.checkAPSQueryValidation(errors, dataPercentage2values)
      ).toEqual(false);
      expect(validations.checkAPSQueryValidation(errors, dataLength2)).toEqual(
        false
      );
    });
  });
});
