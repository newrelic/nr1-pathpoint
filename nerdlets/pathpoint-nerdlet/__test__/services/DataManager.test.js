import DataManager from '../../services/DataManager';

jest.mock(
  'nr1',
  () => {
    const AccountsQuery = {
      query: jest.fn().mockReturnValue({
        data: [{ id: 123 }]
      })
    };
    const AccountStorageQuery = {
      query: jest
        .fn()
        .mockImplementation(({ accountId, collection, documentId }) => {
          switch (collection) {
            case 'pathpoint': {
              switch (documentId) {
                case 'version':
                  return { data: { Version: '1.0.0' } };
                case 'newViewJSON':
                  return { data: { ViewJSON: [{}, {}], BannerKpis: [{}, {}] } };
                case 'dataCanary':
                  return { data: { dataCanary: [{}, {}] } };
              }
              break;
            }
          }
          return accountId;
        })
    };
    const NerdGraphQuery = {
      query: jest.fn().mockImplementation(async ({ query }) => {
        if (query.includes('BAD REQUEST')) {
          const errors = [];
          await new Promise((resolve, reject) => {
            errors.push('Unexpected query');
            return reject(errors);
          });
        } else if (query.includes('measure')) {
          let dataReturn = {};
          await new Promise(resolve => {
            dataReturn = {
              data: {
                actor: {
                  measure_0: {
                    nrql: {
                      results: [{ count: 27 }]
                    }
                  },
                  measure_1: {
                    nrql: {
                      results: [{ percentage: 27 }]
                    }
                  },
                  measure_2: {
                    nrql: {
                      results: [{ score: 27 }]
                    }
                  },
                  measure_3: {
                    nrql: {
                      results: [{ session: 27 }]
                    }
                  },
                  measure_4: {
                    nrql: {
                      results: [{ count: 27 }]
                    }
                  },
                  measure_5: {
                    nrql: {
                      results: [{ count: 27 }]
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

    const AccountStorageMutation = {
      ACTION_TYPE: { WRITE_DOCUMENT: 'WRITE_DATA' },
      mutate: jest.fn()
    };
    const nerdlet = {
      setConfig: jest.fn()
    };
    return {
      AccountsQuery: AccountsQuery,
      AccountStorageQuery: AccountStorageQuery,
      AccountStorageMutation: AccountStorageMutation,
      NerdGraphQuery: NerdGraphQuery,
      nerdlet: nerdlet
    };
  },
  { virtual: true }
);

describe('DataManager class', () => {
  let dataManager;

  beforeEach(() => {
    dataManager = new DataManager();
  });

  it('Function GetAccountId()', async () => {
    await dataManager.GetAccountId();
    expect(dataManager.accountId).toEqual(123);
  });

  it('Function CheckVersion()', async () => {
    await dataManager.CheckVersion();
    expect(dataManager.lastStorageVersion).toMatch('1.0.0');
  });

  it('Function GetInitialDataFromStorage()', async () => {
    await dataManager.GetInitialDataFromStorage();
    expect(dataManager.stages.length).toEqual(2);
    expect(dataManager.banner_kpis.length).toEqual(2);
  });

  it('Function GetStepsByStage()', () => {
    dataManager.stages = [
      {
        index: 1,
        title: 'BROWSE',
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                id: 'ST1-LINE1-SS1'
              }
            ]
          }
        ]
      },
      {
        index: 2,
        title: 'CHECKOUT',
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                id: 'ST2-LINE2-SS2'
              },
              {
                index: 2,
                id: 'ST2-LINE2-SS2'
              }
            ]
          }
        ]
      }
    ];
    const result = dataManager.GetStepsByStage();
    expect(result).toEqual([1, 2]);
  });

  it('Function GetCanaryData()', async () => {
    await dataManager.GetCanaryData();
    expect(dataManager.dataCanary.length).toEqual(2);
  });

  describe('Function TimeRangeTransform', () => {
    it('5 minutes ago', async () => {
      const timeRange = dataManager.TimeRangeTransform('5 MINUTES AGO', true);
      expect(timeRange).toMatch('5 MINUTES AGO');
    });

    it('5 minutes ago with old sessions', async () => {
      dataManager.getOldSessions = true;
      const timeRange = dataManager.TimeRangeTransform('5 MINUTES AGO', true);
      expect(timeRange).toMatch(
        `${Math.floor(Date.now() / 1000) - 10 * 59} UNTIL ${Math.floor(
          Date.now() / 1000
        ) -
          5 * 58}`
      );
    });

    it('30 minutes ago', () => {
      const timeStart = Math.floor(Date.now() / 1000) - 40 * 60;
      const timeEnd = Math.floor(Date.now() / 1000) - 30 * 60;
      const timeRange = dataManager.TimeRangeTransform('30 MINUTES AGO', false);
      expect(timeRange).toMatch(`${timeStart} UNTIL ${timeEnd}`);
    });

    it('30 minutes ago with old sessions', () => {
      dataManager.getOldSessions = true;
      const timeStart = Math.floor(Date.now() / 1000) - 40 * 60;
      const timeEnd = Math.floor(Date.now() / 1000) - 30 * 60;
      const timeRange = dataManager.TimeRangeTransform('30 MINUTES AGO', true);
      expect(timeRange).toMatch(
        `${timeStart - 10 * 59} UNTIL ${timeEnd - 5 * 58}`
      );
    });

    it('60 minutes ago', () => {
      const timeStart = Math.floor(Date.now() / 1000) - 70 * 60;
      const timeEnd = Math.floor(Date.now() / 1000) - 60 * 60;
      const timeRange = dataManager.TimeRangeTransform('60 MINUTES AGO', false);
      expect(timeRange).toMatch(`${timeStart} UNTIL ${timeEnd}`);
    });

    it('3 hours ago', () => {
      const timeStart = Math.floor(Date.now() / 1000) - 3 * 60 * 60 - 10 * 60;
      const timeEnd = Math.floor(Date.now() / 1000) - 3 * 60 * 60;
      const timeRange = dataManager.TimeRangeTransform('3 HOURS AGO', false);
      expect(timeRange).toMatch(`${timeStart} UNTIL ${timeEnd}`);
    });

    it('6 hours ago', () => {
      const timeStart = Math.floor(Date.now() / 1000) - 6 * 60 * 60 - 10 * 60;
      const timeEnd = Math.floor(Date.now() / 1000) - 6 * 60 * 60;
      const timeRange = dataManager.TimeRangeTransform('6 HOURS AGO', false);
      expect(timeRange).toMatch(`${timeStart} UNTIL ${timeEnd}`);
    });

    it('12 hours ago', () => {
      const timeStart = Math.floor(Date.now() / 1000) - 12 * 60 * 60 - 10 * 60;
      const timeEnd = Math.floor(Date.now() / 1000) - 12 * 60 * 60;
      const timeRange = dataManager.TimeRangeTransform('12 HOURS AGO', false);
      expect(timeRange).toMatch(`${timeStart} UNTIL ${timeEnd}`);
    });

    it('24 hours ago', () => {
      const timeStart = Math.floor(Date.now() / 1000) - 24 * 60 * 60 - 10 * 60;
      const timeEnd = Math.floor(Date.now() / 1000) - 24 * 60 * 60;
      const timeRange = dataManager.TimeRangeTransform('24 HOURS AGO', false);
      expect(timeRange).toMatch(`${timeStart} UNTIL ${timeEnd}`);
    });

    it('3 days ago', () => {
      const timeStart =
        Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60 - 10 * 60;
      const timeEnd = Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60;
      const timeRange = dataManager.TimeRangeTransform('3 DAYS AGO', false);
      expect(timeRange).toMatch(`${timeStart} UNTIL ${timeEnd}`);
    });

    it('7 days ago', () => {
      const timeStart =
        Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60 - 10 * 60;
      const timeEnd = Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60;
      const timeRange = dataManager.TimeRangeTransform('7 DAYS AGO', false);
      expect(timeRange).toMatch(`${timeStart} UNTIL ${timeEnd}`);
    });

    it('default case', () => {
      const timeRange = dataManager.TimeRangeTransform('default', false);
      expect(timeRange).toMatch('default');
    });
  });

  it('Function FetchMeasure', () => {
    const measures = [
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 1,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 2,
        query: 'SIMPLE QUERY OF TYPE TWO'
      },
      {
        type: 3,
        query: 'SIMPLE QUERY OF TYPE THREE'
      },
      {
        type: 4,
        query: 'SIMPLE QUERY OF TYPE FOUR'
      },
      {
        type: 20,
        query: 'SIMPLE QUERY OF TYPE TWENTY'
      }
    ];
    dataManager.timeRange = '5 MINUTES AGO';
    for (const measure of measures) {
      dataManager.FetchMeasure(measure);
    }
    expect(dataManager.graphQlmeasures.length).toEqual(6);
  });

  it('Function EvaluateMeasures()', async () => {
    const measures = [
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 1,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 2,
        query: 'SIMPLE QUERY OF TYPE TWO'
      },
      {
        type: 3,
        query: 'SIMPLE QUERY OF TYPE THREE'
      },
      {
        type: 4,
        query: 'SIMPLE QUERY OF TYPE FOUR'
      },
      {
        type: 20,
        query: 'SIMPLE QUERY OF TYPE TWENTY'
      }
    ];
    dataManager.timeRange = '5 MINUTES AGO';
    for (const measure of measures) {
      dataManager.FetchMeasure(measure);
    }
    const result = await dataManager.EvaluateMeasures();
    expect(result).toMatchObject({
      data: {
        actor: {
          measure_0: {
            nrql: {
              results: [{ count: 27 }]
            }
          },
          measure_1: {
            nrql: {
              results: [{ percentage: 27 }]
            }
          },
          measure_2: {
            nrql: {
              results: [{ score: 27 }]
            }
          },
          measure_3: {
            nrql: {
              results: [{ session: 27 }]
            }
          },
          measure_4: {
            nrql: {
              results: [{ count: 27 }]
            }
          },
          measure_5: {
            nrql: {
              results: [{ count: 27 }]
            }
          }
        }
      }
    });
  });

  it('Function EvaluateMeasures() with error', async () => {
    dataManager.graphQlmeasures = [
      [
        {
          type: 0,
          query: 'BAD REQUEST ON PURPOSE'
        },
        'BAD REQUEST ON PURPOSE'
      ]
    ];
    const { errors } = await dataManager.EvaluateMeasures();
    expect(errors).toMatchObject([
      {
        errors: ['Unexpected query']
      }
    ]);
  });
});
