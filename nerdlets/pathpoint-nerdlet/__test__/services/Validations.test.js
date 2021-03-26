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

  describe('Function countQueryValidation', () => {
    it('validate errors', async () => {
      const errors = [{ locations: '', message: '' }];
      errors.length = 1;
      const data = [];
      data.length = 0;
      const validateQuery = await validations.countQueryValidation(
        errors,
        data
      );
      expect(validateQuery).toEqual(false);
    });

    it('validate data object > 2', async () => {
      const data = [{ count: 123 }, { count: 123 }];
      data.length = 2;
      const validateQuery = await validations.countQueryValidation(
        undefined,
        data
      );
      expect(validateQuery).toEqual(false);
    });

    it('validate data number', async () => {
      const data = [{ count: '' }];
      data.length = 1;
      const validateQuery = await validations.countQueryValidation(
        undefined,
        data
      );
      expect(validateQuery).toEqual(false);
    });

    it('validate data quantity', async () => {
      const data = [{ count: 1213, sum: 358, average: 456 }];
      data.length = 1;
      const validateQuery = await validations.countQueryValidation(
        undefined,
        data
      );
      expect(validateQuery).toEqual(false);
    });

    it('validate data', async () => {
      const data = [{ count: 1213 }];
      data.length = 1;
      const validateQuery = await validations.countQueryValidation(
        undefined,
        data
      );
      expect(validateQuery).toEqual(true);
    });
  });

  describe('Function apdexQueryValidation', () => {
    it('validate errors', async () => {
      const errors = [{ locations: '', message: '' }];
      errors.length = 1;
      const data = [];
      data.length = 0;
      const validateQuery = await validations.apdexQueryValidation(
        errors,
        data
      );
      expect(validateQuery).toEqual(false);
    });

    it('validate data number', async () => {
      const data = [{ count: 'count', f: 0, s: 294, score: 1, t: 0 }];
      data.length = 1;
      const validateQuery = await validations.apdexQueryValidation(
        undefined,
        data
      );
      expect(validateQuery).toEqual(false);
    });

    it('validate data quantity < 2', async () => {
      const data = [{ count: 294 }];
      data.length = 1;
      const validateQuery = await validations.apdexQueryValidation(
        undefined,
        data
      );
      expect(validateQuery).toEqual(false);
    });

    it('validate data quantity > 6', async () => {
      const data = [{ count: 294, f: 0, s: 294, score: 1, t: 0, t1: 0, t2: 0 }];
      data.length = 1;
      const validateQuery = await validations.apdexQueryValidation(
        undefined,
        data
      );
      expect(validateQuery).toEqual(false);
    });

    it('validate data !containCount', async () => {
      const data = [{ f: 0, s: 294, score: 1, t: 0 }];
      data.length = 1;
      const validateQuery = await validations.apdexQueryValidation(
        undefined,
        data
      );
      expect(validateQuery).toEqual(false);
    });

    it('validate data !containScore', async () => {
      const data = [{ count: 294, f: 0, s: 294, t: 0 }];
      data.length = 1;
      const validateQuery = await validations.apdexQueryValidation(
        undefined,
        data
      );
      expect(validateQuery).toEqual(false);
    });

    it('validate not data ', async () => {
      const data = [];
      data.length = 0;
      const validateQuery = await validations.apdexQueryValidation(
        undefined,
        data
      );
      expect(validateQuery).toEqual(false);
    });

    it('validate data', async () => {
      const data = [{ count: 294, f: 0, s: 294, score: 1, t: 0 }];
      data.length = 1;
      const validateQuery = await validations.apdexQueryValidation(
        undefined,
        data
      );
      expect(validateQuery).toEqual(true);
    });
  });

  describe('Function sessionQueryValidation', () => {
    it('validate data number', async () => {
      const data = [{ session: '' }];
      data.length = 1;
      const validateQuery = await validations.sessionQueryValidation(
        undefined,
        data
      );
      expect(validateQuery).toEqual(false);
    });

    it('validate data quantity > 1', async () => {
      const data = [{ session: 281, t: 0 }];
      data.length = 1;
      const validateQuery = await validations.sessionQueryValidation(
        undefined,
        data
      );
      expect(validateQuery).toEqual(false);
    });

    it('validate not data ', async () => {
      const data = [];
      data.length = 0;
      const validateQuery = await validations.sessionQueryValidation(
        undefined,
        data
      );
      expect(validateQuery).toEqual(false);
    });
    it('validate errors', async () => {
      const errors = [{ locations: '', message: '' }];
      errors.length = 1;
      const data = [];
      data.length = 0;
      const validateQuery = await validations.sessionQueryValidation(
        errors,
        data
      );
      expect(validateQuery).toEqual(false);
    });
  });

  describe('Function sessionDurationValidation ', () => {
    it('validate data FACET', async () => {
      const errors = undefined;
      const validateQuery = await validations.sessionDurationValidation(
        errors,
        ' '
      );
      expect(validateQuery).toEqual(false);
    });

    it('validate data facet', async () => {
      const errors = undefined;
      const validateQuery = await validations.sessionDurationValidation(
        errors,
        ' '
      );
      expect(validateQuery).toEqual(false);
    });
    it('validate errors', async () => {
      const errors = [{ locations: '', message: '' }];
      errors.length = 1;
      const validateQuery = await validations.sessionDurationValidation(
        errors,
        ' '
      );
      expect(validateQuery).toEqual(false);
    });
  });

  describe('Function fullOpenValidation', () => {
    it('validate data', async () => {
      const data = [{ R1: 72843, R2: 34143 }];
      data.length = 1;
      const validateQuery = await validations.fullOpenValidation(
        undefined,
        data
      );
      expect(validateQuery).toEqual(true);
    });

    it('validate data quantity > 2', async () => {
      const data = [{ R1: 72843, R2: 34143, R3: 34143 }];
      data.length = 1;
      const validateQuery = await validations.fullOpenValidation(
        undefined,
        data
      );
      expect(validateQuery).toEqual(false);
    });

    it('validate data !containR1 ', async () => {
      const data = [{ R2: 34143 }];
      data.length = 1;
      const validateQuery = await validations.fullOpenValidation(
        undefined,
        data
      );
      expect(validateQuery).toEqual(false);
    });

    it('validate data !containR2 ', async () => {
      const data = [{ R1: 34143 }];
      data.length = 1;
      const validateQuery = await validations.fullOpenValidation(
        undefined,
        data
      );
      expect(validateQuery).toEqual(false);
    });

    it('validate errors', async () => {
      const errors = [{ locations: '', message: '' }];
      errors.length = 1;
      const data = [];
      data.length = 0;
      const validateQuery = await validations.fullOpenValidation(errors, data);
      expect(validateQuery).toEqual(false);
    });

    it('validate data number', async () => {
      const errors = [];
      errors.length = 0;
      const data = [{ R1: '', R2: '' }];
      data.length = 1;
      const validateQuery = await validations.fullOpenValidation(errors, data);
      expect(validateQuery).toEqual(false);
    });

    it('validate data array', async () => {
      const errors = [];
      errors.length = 0;
      const data = [];
      data.length = 0;
      const validateQuery = await validations.fullOpenValidation(errors, data);
      expect(validateQuery).toEqual(false);
    });
  });

  describe('Function errorPercentageQuery', () => {
    it('validate errors', async () => {
      const errors = [{ locations: '', message: '' }];
      const validateQuery = await validations.errorPercentageQuery(
        errors,
        '',
        []
      );
      expect(validateQuery).toBeFalsy();
    });

    it('validate query sintaxis', async () => {
      const validateQuery = await validations.errorPercentageQuery(
        undefined,
        'any query sample',
        []
      );
      expect(validateQuery).toBeFalsy();
    });

    it('validate results type', async () => {
      const data = [{ session: 'session' }];
      const validateQuery = await validations.errorPercentageQuery(
        undefined,
        'percentage',
        data
      );
      expect(validateQuery).toBeFalsy();
    });

    it('validate results quantity', async () => {
      const data = [{ percentage: 1, results: 1 }];
      const validateQuery = await validations.errorPercentageQuery(
        undefined,
        'percentage',
        data
      );
      expect(validateQuery).toBeFalsy();
    });
  });

  describe('Function validateQuery', () => {
    it('validate error', async () => {
      const validateQuery = await validations.validateQuery('type', '');
      expect(validateQuery).toEqual({
        goodQuery: false,
        testText: 'Successfully validated'
      });
    });

    it('validate count query', async () => {
      const validateQuery = await validations.validateQuery(
        'Count Query',
        'Count Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: true,
        testText: 'Successfully validated'
      });
    });

    it('validate apdex query', async () => {
      const validateQuery = await validations.validateQuery(
        'Apdex Query',
        'Apdex Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: true,
        testText: 'Successfully validated'
      });
    });

    it('validate session query', async () => {
      const validateQuery = await validations.validateQuery(
        'Session Query',
        'Session Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: true,
        testText: 'Successfully validated'
      });
    });

    it('validate error percentage query', async () => {
      const validateQuery = await validations.validateQuery(
        'Error Percentage Query',
        'Error Percentage Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: true,
        testText: 'Successfully validated'
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
        goodQuery: true,
        testText: 'Successfully validated'
      });
    });

    it('validate full open query', async () => {
      const validateQuery = await validations.validateQuery(
        'Full Open Query',
        'Full Open Query'
      );
      expect(validateQuery).toEqual({
        goodQuery: true,
        testText: 'Successfully validated'
      });
    });
  });
});
