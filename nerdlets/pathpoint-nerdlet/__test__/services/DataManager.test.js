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
                case 'touchpoints':
                  return {
                    data: {
                      TouchPoints: [
                        {
                          index: 0,
                          country: 'PRODUCTION',
                          touchpoints: [
                            {
                              stage_index: 1,
                              value: 'Catalog API',
                              touchpoint_index: 1,
                              status_on_off: true,
                              relation_steps: [1],
                              measure_points: [
                                {
                                  type: 0,
                                  query: 'SIMPLE QUERY OF TYPE 0',
                                  error_threshold: 5
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  };
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
        } else if (query.includes('KPI')) {
          let dataReturn = {};
          await new Promise(resolve => {
            dataReturn = {
              data: {
                actor: {
                  measure_0: {
                    nrql: {
                      results: [{ value: 27 }]
                    }
                  },
                  measure_1: {
                    nrql: {
                      results: [{ value: 1 }]
                    }
                  }
                }
              }
            };
            return resolve();
          });
          return dataReturn;
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
                      results: [
                        {
                          facet: 'abc123',
                          count: 1,
                          session: 'abc123'
                        },
                        {
                          facet: 'cde345',
                          count: 1,
                          session: 'cde345'
                        },
                        {
                          facet: 'fgh678',
                          count: 1,
                          session: 'fgh678'
                        }
                      ]
                    }
                  },
                  measure_5: {
                    nrql: {
                      results: [
                        {
                          R1: 1,
                          R2: 2
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

    const AccountStorageMutation = {
      ACTION_TYPE: { WRITE_DOCUMENT: 'WRITE_DATA' },
      mutate: jest.fn().mockImplementation(() => {
        return { data: {} };
      })
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
              results: [
                {
                  facet: 'abc123',
                  count: 1,
                  session: 'abc123'
                },
                {
                  facet: 'cde345',
                  count: 1,
                  session: 'cde345'
                },
                {
                  facet: 'fgh678',
                  count: 1,
                  session: 'fgh678'
                }
              ]
            }
          },
          measure_5: {
            nrql: {
              results: [
                {
                  R1: 1,
                  R2: 2
                }
              ]
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

  it('Function EvaluateMeasures() with pagination', async () => {
    const measures = [
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
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
      },
      {
        type: 4,
        query: 'SIMPLE QUERY OF TYPE FOUR'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
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
      },
      {
        type: 4,
        query: 'SIMPLE QUERY OF TYPE FOUR'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
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
      },
      {
        type: 4,
        query: 'SIMPLE QUERY OF TYPE FOUR'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
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
      },
      {
        type: 4,
        query: 'SIMPLE QUERY OF TYPE FOUR'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
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
      },
      {
        type: 4,
        query: 'SIMPLE QUERY OF TYPE FOUR'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
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
      },
      {
        type: 4,
        query: 'SIMPLE QUERY OF TYPE FOUR'
      },
      {
        type: 4,
        query: 'SIMPLE QUERY OF TYPE FOUR'
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
              results: [
                {
                  facet: 'abc123',
                  count: 1,
                  session: 'abc123'
                },
                {
                  facet: 'cde345',
                  count: 1,
                  session: 'cde345'
                },
                {
                  facet: 'fgh678',
                  count: 1,
                  session: 'fgh678'
                }
              ]
            }
          },
          measure_5: {
            nrql: {
              results: [
                {
                  R1: 1,
                  R2: 2
                }
              ]
            }
          }
        }
      }
    });
  });

  it('Function EvaluateMeasures() with pagination and error', async () => {
    const measures = [
      {
        type: 0,
        query: 'BAD REQUEST ON PURPOSE'
      },
      {
        type: 0,
        query: 'BAD REQUEST ON PURPOSE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
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
      },
      {
        type: 4,
        query: 'SIMPLE QUERY OF TYPE FOUR'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
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
      },
      {
        type: 4,
        query: 'SIMPLE QUERY OF TYPE FOUR'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
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
      },
      {
        type: 4,
        query: 'SIMPLE QUERY OF TYPE FOUR'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
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
      },
      {
        type: 4,
        query: 'SIMPLE QUERY OF TYPE FOUR'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
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
      },
      {
        type: 4,
        query: 'SIMPLE QUERY OF TYPE FOUR'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
      {
        type: 0,
        query: 'SIMPLE QUERY OF TYPE ONE'
      },
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
      },
      {
        type: 4,
        query: 'SIMPLE QUERY OF TYPE FOUR'
      },
      {
        type: 4,
        query: 'SIMPLE QUERY OF TYPE FOUR'
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
              results: [
                {
                  facet: 'abc123',
                  count: 1,
                  session: 'abc123'
                },
                {
                  facet: 'cde345',
                  count: 1,
                  session: 'cde345'
                },
                {
                  facet: 'fgh678',
                  count: 1,
                  session: 'fgh678'
                }
              ]
            }
          },
          measure_5: {
            nrql: {
              results: [
                {
                  R1: 1,
                  R2: 2
                }
              ]
            }
          }
        }
      }
    });
  });

  it('Function NRDBQuery()', async () => {
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
        query: 'SIMPLE QUERY OF TYPE FOUR',
        sessions: [{ id: 'abc123' }]
      },
      {
        type: 20,
        query: 'SIMPLE QUERY OF TYPE TWENTY'
      }
    ];
    dataManager.timeRange = '5 MINUTES AGO';
    dataManager.getOldSessions = true;
    for (const measure of measures) {
      dataManager.FetchMeasure(measure);
    }
    await dataManager.NRDBQuery();
    expect(dataManager.graphQlmeasures.length).toEqual(6);
  });

  it('Function SetLogsMeasure()', () => {
    const measure = { count: 0, error_percentage: 0 };
    const results = { R1: 0, R2: 0 };
    dataManager.SetLogsMeasure(measure, results);
    expect(measure).toEqual({ count: 0, error_percentage: 0 });
  });

  it('Function UpdateMerchatKpi()', () => {
    const bannerKpi = [
      {
        type: 100,
        description: 'KPI ONE',
        prefix: '',
        suffix: 'Orders',
        query: 'SIMPLE QUERY KPI ONE',
        value: 0
      },
      {
        type: 100,
        description: 'KPI TWO',
        prefix: '$',
        suffix: '',
        query: 'SIMPLE QUERY KPI TWO',
        value: 0
      }
    ];
    dataManager.banner_kpis = bannerKpi;
    dataManager.UpdateMerchatKpi();
    expect(dataManager.graphQlmeasures).toEqual([
      [
        {
          type: 100,
          description: 'KPI ONE',
          prefix: '',
          suffix: 'Orders',
          query: 'SIMPLE QUERY KPI ONE',
          value: 0
        },
        'SIMPLE QUERY KPI ONE'
      ],
      [
        {
          type: 100,
          description: 'KPI TWO',
          prefix: '$',
          suffix: '',
          query: 'SIMPLE QUERY KPI TWO',
          value: 0
        },
        'SIMPLE QUERY KPI TWO'
      ]
    ]);
  });

  it('Function CalculateUpdates()', () => {
    dataManager.stages = [
      {
        index: 1,
        title: 'BROWSE',
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [{ error: true, stage_index: 1 }]
      },
      {
        index: 2,
        title: 'CHECKOUT',
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                id: 'ST2-LINE2-SS2',
                relationship_touchpoints: [1]
              },
              {
                index: 2,
                id: 'ST2-LINE2-SS2',
                relationship_touchpoints: [2]
              }
            ]
          }
        ],
        touchpoints: [{ error: true, stage_index: 2 }]
      }
    ];
    dataManager.CalculateUpdates();
    expect(dataManager.stages).toEqual([
      {
        index: 1,
        title: 'BROWSE',
        congestion: { value: 0, percentage: 100 },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                error: true,
                latency: true,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [{ error: false, stage_index: 1 }],
        status_color: 'good',
        total_count: 0,
        capacity: 0,
        trafficIconType: 'traffic'
      },
      {
        index: 2,
        title: 'CHECKOUT',
        congestion: { value: 0, percentage: 100 },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                id: 'ST2-LINE2-SS2',
                error: true,
                latency: true,
                relationship_touchpoints: [1]
              },
              {
                index: 2,
                id: 'ST2-LINE2-SS2',
                error: true,
                latency: false,
                relationship_touchpoints: [2]
              }
            ]
          }
        ],
        touchpoints: [{ error: false, stage_index: 2 }],
        status_color: 'good',
        total_count: 0,
        capacity: 0,
        trafficIconType: 'traffic'
      }
    ]);
  });

  it('Function ClearTouchpointError()', () => {
    dataManager.stages = [
      {
        index: 1,
        title: 'BROWSE',
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [{ error: true, stage_index: 1 }]
      },
      {
        index: 2,
        title: 'CHECKOUT',
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                id: 'ST2-LINE2-SS2',
                relationship_touchpoints: [1]
              },
              {
                index: 2,
                id: 'ST2-LINE2-SS2',
                relationship_touchpoints: [2]
              }
            ]
          }
        ],
        touchpoints: [{ error: true, stage_index: 2 }]
      }
    ];
    dataManager.ClearTouchpointError();
    expect(dataManager.stages).toEqual([
      {
        index: 1,
        title: 'BROWSE',
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                id: 'ST1-LINE1-SS1',
                error: false,
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [{ error: false, stage_index: 1 }]
      },
      {
        index: 2,
        title: 'CHECKOUT',
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                id: 'ST2-LINE2-SS2',
                error: false,
                relationship_touchpoints: [1]
              },
              {
                index: 2,
                id: 'ST2-LINE2-SS2',
                error: false,
                relationship_touchpoints: [2]
              }
            ]
          }
        ],
        touchpoints: [{ error: false, stage_index: 2 }]
      }
    ]);
  });

  it('Function CountryCalculateUpdates()', () => {
    const element = {
      index: 0,
      country: 'PRODUCTION',
      touchpoints: [
        {
          stage_index: 1,
          value: 'Catalog API',
          touchpoint_index: 1,
          status_on_off: true,
          relation_steps: [1],
          measure_points: [
            { count: 4, query: 'SIMPLE QUERY OF TYPE 0', type: 0 },
            {
              apdex: 0.3,
              apdex_time: 10,
              query: 'SIMPLE QUERY OF TYPE 2',
              type: 2
            },
            { count: 4, query: 'SIMPLE QUERY OF TYPE 3', type: 3 },
            {
              type: 20,
              query: 'SIMPLE QUERY OF TYPE 20',
              error_threshold: 5,
              count: 1,
              error_percentage: 0
            }
          ]
        }
      ]
    };
    dataManager.stages = [
      {
        index: 1,
        title: 'BROWSE',
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [{ error: true, stage_index: 1 }]
      }
    ];
    dataManager.CountryCalculateUpdates(element);
    expect(dataManager.stages).toEqual([
      {
        index: 1,
        title: 'BROWSE',
        total_count: 5,
        congestion: {
          value: 0,
          percentage: 70
        },
        status_color: 'good',
        trafficIconType: 'people',
        capacity: 4,
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                id: 'ST1-LINE1-SS1',
                latency: true,
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [{ error: true, stage_index: 1 }]
      }
    ]);
  });

  it('Function Getmeasures()', () => {
    const element = {
      index: 0,
      country: 'PRODUCTION',
      touchpoints: [
        {
          stage_index: 1,
          value: 'Catalog API',
          touchpoint_index: 1,
          status_on_off: true,
          relation_steps: [1],
          measure_points: [
            { count: 4, query: 'SIMPLE QUERY OF TYPE 0', type: 0 },
            {
              apdex: 0.3,
              apdex_time: 10,
              query: 'SIMPLE QUERY OF TYPE 2',
              type: 2
            }
          ]
        }
      ]
    };
    const result = dataManager.Getmeasures(element);
    expect(result).toEqual({
      total_count: 4,
      count_by_stage: [4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      sessions_by_stage: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      session_percentage_by_stage: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      apdex_by_stage: [0.3, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      min_apdex_touchpoint_index_by_stage: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      logmeasure_by_stage: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    });
  });

  describe('Function GetSessionsPercentage()', () => {
    it('Sessions empty', () => {
      const result = dataManager.GetSessionsPercentage([]);
      expect(result).toEqual(0);
    });

    it('Sessions with time', () => {
      const result = dataManager.GetSessionsPercentage([
        {
          time: 250
        },
        { time: 251 }
      ]);
      expect(result).toEqual(1);
    });
  });

  describe('Function UpdateErrorCondition()', () => {
    it('actual=danger nextvalue=null', () => {
      const result = dataManager.UpdateErrorCondition('danger', null);
      expect(result).toMatch('danger');
    });

    it('actual=null nextvalue=danger', () => {
      const result = dataManager.UpdateErrorCondition(null, 'danger');
      expect(result).toMatch('danger');
    });

    it('actual=warning nextvalue=null', () => {
      const result = dataManager.UpdateErrorCondition('warning', null);
      expect(result).toMatch('warning');
    });

    it('actual=null nextvalue=warning', () => {
      const result = dataManager.UpdateErrorCondition(null, 'warning');
      expect(result).toMatch('warning');
    });

    it('actual=good nextvalue=null', () => {
      const result = dataManager.UpdateErrorCondition('good', null);
      expect(result).toMatch('good');
    });
  });

  describe('Function GetStageError()', () => {
    it('Status danger', () => {
      const element = {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: [
          {
            stage_index: 1,
            value: 'Catalog API',
            touchpoint_index: 1,
            status_on_off: true,
            relation_steps: [1],
            measure_points: [
              { count: 4, query: 'SIMPLE QUERY OF TYPE 0', type: 0 },
              {
                type: 1,
                query: 'SIMPLE QUERY OF TYPE 1',
                error_threshold: 1,
                count: 1,
                error_percentage: 2
              },
              {
                apdex: 0.3,
                apdex_time: 10,
                query: 'SIMPLE QUERY OF TYPE 2',
                type: 2
              },
              { count: 4, query: 'SIMPLE QUERY OF TYPE 3', type: 3 },
              {
                type: 20,
                query: 'SIMPLE QUERY OF TYPE 20',
                error_threshold: 1,
                count: 1,
                error_percentage: 2
              }
            ]
          }
        ]
      };
      dataManager.stages = [
        {
          index: 1,
          title: 'BROWSE',
          congestion: {
            value: 0,
            percentage: 15
          },
          steps: [
            {
              value: '',
              sub_steps: [
                {
                  index: 1,
                  id: 'ST1-LINE1-SS1',
                  relationship_touchpoints: [1]
                }
              ]
            }
          ],
          touchpoints: [{ error: true, stage_index: 1 }]
        }
      ];
      dataManager.stepsByStage = dataManager.GetStepsByStage();
      const result = dataManager.GetStageError(1, element);
      expect(result).toMatch('danger');
    });

    it('Status Good', () => {
      const element = {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: [
          {
            stage_index: 1,
            value: 'Catalog API',
            touchpoint_index: 1,
            status_on_off: true,
            relation_steps: [1],
            measure_points: [
              { count: 4, query: 'SIMPLE QUERY OF TYPE 0', type: 0 },
              {
                type: 1,
                query: 'SIMPLE QUERY OF TYPE 1',
                error_threshold: 1,
                count: 1,
                error_percentage: 2
              },
              {
                apdex: 0.3,
                apdex_time: 10,
                query: 'SIMPLE QUERY OF TYPE 2',
                type: 2
              },
              { count: 4, query: 'SIMPLE QUERY OF TYPE 3', type: 3 },
              {
                type: 20,
                query: 'SIMPLE QUERY OF TYPE 20',
                error_threshold: 1,
                count: 1,
                error_percentage: 2
              }
            ]
          }
        ]
      };
      dataManager.stages = [
        {
          index: 1,
          title: 'BROWSE',
          congestion: {
            value: 0,
            percentage: 15
          },
          steps: [
            {
              value: '',
              sub_steps: [
                {
                  index: 1,
                  id: 'ST1-LINE1-SS1',
                  relationship_touchpoints: [1]
                }
              ]
            }
          ],
          touchpoints: [{ error: true, relation_steps: [1], stage_index: 1 }]
        }
      ];
      const result = dataManager.GetStageError(1, element);
      expect(result).toMatch('good');
    });

    it('Status Good with none touchpoints', () => {
      const element = {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: []
      };
      dataManager.stages = [
        {
          index: 1,
          title: 'BROWSE',
          congestion: {
            value: 0,
            percentage: 15
          },
          steps: [
            {
              value: '',
              sub_steps: [
                {
                  index: 1,
                  id: 'ST1-LINE1-SS1',
                  error: true,
                  relationship_touchpoints: [1]
                }
              ]
            }
          ],
          touchpoints: [{ error: true, stage_index: 1 }]
        }
      ];
      const result = dataManager.GetStageError(1, element);
      expect(result).toMatch('good');
    });
  });

  it('Function SetTouchpointError()', () => {
    dataManager.stages = [
      {
        index: 1,
        title: 'BROWSE',
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [{ index: 1, error: true, stage_index: 1 }]
      }
    ];
    dataManager.SetTouchpointError(1, 1);
    expect(dataManager.stages).toEqual([
      {
        index: 1,
        title: 'BROWSE',
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                id: 'ST1-LINE1-SS1',
                error: true,
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [{ index: 1, error: true, stage_index: 1 }]
      }
    ]);
  });

  it('Function GetTotalStepsWithError()', () => {
    const stepsError = [1, 2, 3, 4];
    const result = dataManager.GetTotalStepsWithError(stepsError);
    expect(result).toEqual(10);
  });

  it('Function CheckMaxCapacity()', () => {
    const result = dataManager.CheckMaxCapacity(200, 0);
    expect(result).toEqual(200);
  });

  it('Function CheckMaxCapacity() with minimun value', () => {
    const result = dataManager.CheckMaxCapacity(50, 0);
    expect(result).toEqual(400);
  });

  it('Function CheckMaxCapacity() with capacity empty', () => {
    dataManager.capacity = [{}];
    const result = dataManager.CheckMaxCapacity(50, 0);
    expect(result).toEqual(50);
  });

  it('Function UpdateMaxLatencySteps()', () => {
    dataManager.stages = [
      {
        index: 1,
        title: 'BROWSE',
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                id: 'ST1-LINE1-SS1',
                latency: false,
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [{ index: 1, error: true, stage_index: 1 }]
      }
    ];
    const maxDuration = [1];
    dataManager.UpdateMaxLatencySteps(maxDuration);
    expect(dataManager.stages).toEqual([
      {
        index: 1,
        title: 'BROWSE',
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                id: 'ST1-LINE1-SS1',
                latency: true,
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [{ index: 1, error: true, stage_index: 1 }]
      }
    ]);
  });

  it('Function UpdateMaxCapacity()', () => {
    dataManager.capacityUpdatePending = true;
    dataManager.UpdateMaxCapacity();
    expect(dataManager.capacityUpdatePending).toBeFalsy();
  });

  it('Function LoadCanaryData()', () => {
    const result = dataManager.LoadCanaryData();
    expect(result.length).toEqual(10);
  });

  it('Function SetCanaryData()', () => {
    const stages = [
      {
        index: 1,
        title: 'BROWSE',
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [{ index: 1, error: true, stage_index: 1 }]
      }
    ];
    const result = dataManager.SetCanaryData(stages, 0);
    expect(result).toEqual({ stages: stages });
  });

  it('Function OffAllTouchpoints()', () => {
    dataManager.touchPoints = [
      {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: [
          {
            status_on_off: true
          },
          {
            status_on_off: true
          }
        ]
      }
    ];
    dataManager.OffAllTouchpoints();
    expect(dataManager.touchPoints).toEqual([
      {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: [
          {
            status_on_off: false
          },
          {
            status_on_off: false
          }
        ]
      }
    ]);
  });

  it('Function EnableCanaryTouchPoints()', () => {
    dataManager.stages = [
      {
        index: 1,
        title: 'BROWSE',
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                canary_state: true,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [{ index: 1, error: true, stage_index: 1 }]
      }
    ];
    dataManager.EnableCanaryTouchPoints();
    expect(dataManager.stages).toEqual([
      {
        index: 1,
        title: 'BROWSE',
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                canary_state: true,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [{ index: 1, error: true, stage_index: 1 }]
      }
    ]);
  });

  it('Function EnableTouchpoint()', () => {
    dataManager.touchpoints = [
      {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: [
          {
            stage_index: 1,
            value: 'Catalog API',
            touchpoint_index: 1,
            status_on_off: false,
            relation_steps: [1]
          }
        ]
      }
    ];
    dataManager.EnableTouchpoint(1, 1);
    expect(dataManager.touchpoints).toEqual([
      {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: [
          {
            stage_index: 1,
            value: 'Catalog API',
            touchpoint_index: 1,
            status_on_off: false,
            relation_steps: [1]
          }
        ]
      }
    ]);
  });

  it('Function SetTouchpointsStatus', () => {
    dataManager.touchpoints = [
      {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: [
          {
            stage_index: 1,
            value: 'Catalog API',
            touchpoint_index: 1,
            status_on_off: true,
            relation_steps: [1]
          }
        ]
      }
    ];
    dataManager.stages = [
      {
        index: 1,
        title: 'BROWSE',
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [{ index: 1, error: true, stage_index: 1 }]
      }
    ];
    dataManager.SetTouchpointsStatus();
    expect(dataManager.stages).toEqual([
      {
        index: 1,
        title: 'BROWSE',
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [
          { index: 1, error: true, stage_index: 1, status_on_off: true }
        ]
      }
    ]);
  });

  it('Function UpdateTouchpointStatus()', () => {
    const touchpoint = {
      stage_index: 1,
      value: 'Catalog API',
      touchpoint_index: 1,
      status_on_off: false,
      relation_steps: [1]
    };
    dataManager.stages = [
      {
        index: 1,
        title: 'BROWSE',
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [{ index: 1, error: true, stage_index: 1 }]
      }
    ];
    dataManager.UpdateTouchpointStatus(touchpoint);
    expect(dataManager.stages).toEqual([
      {
        index: 1,
        title: 'BROWSE',
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [
          { index: 1, error: true, stage_index: 1, status_on_off: false }
        ]
      }
    ]);
  });

  it('Function ClearCanaryData()', () => {
    const stagesNew = [
      {
        index: 1,
        title: 'CHECKOUT',
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              },
              {
                index: 2,
                id: 'ST1-LINE2-SS2',
                relationship_touchpoints: [2]
              }
            ]
          }
        ],
        touchpoints: [
          { index: 1, error: true, stage_index: 1 },
          { index: 2, error: true, stage_index: 1 }
        ]
      }
    ];
    dataManager.touchPointsCopy = [
      {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: [
          {
            stage_index: 1,
            value: 'Catalog API',
            touchpoint_index: 1,
            status_on_off: true,
            relation_steps: [1]
          }
        ]
      }
    ];
    dataManager.ClearCanaryData(stagesNew);
    expect(dataManager.stages).toEqual(stagesNew);
  });

  it('Function GetMinPercentageError()', async () => {
    dataManager.touchpoints = [
      {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: [
          {
            stage_index: 1,
            value: 'Catalog API',
            touchpoint_index: 1,
            status_on_off: true,
            relation_steps: [1],
            measure_points: [
              {
                type: 0,
                query: 'SIMPLE QUERY OF TYPE 0',
                error_threshold: 5
              }
            ]
          }
        ]
      }
    ];
    dataManager.GetMinPercentageError();
    expect(dataManager.minPercentageError).toEqual(5);
  });

  it('Function GetStorageTouchpoints()', async () => {
    await dataManager.GetStorageTouchpoints();
    expect(dataManager.touchPoints).toEqual([
      {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: [
          {
            stage_index: 1,
            value: 'Catalog API',
            touchpoint_index: 1,
            status_on_off: true,
            relation_steps: [1],
            measure_points: [
              {
                type: 0,
                query: 'SIMPLE QUERY OF TYPE 0',
                error_threshold: 5
              }
            ]
          }
        ]
      }
    ]);
  });

  it('Function GetCurrentConfigurationJSON()', () => {
    const bannerKpi = [
      {
        description: 'KPI ONE',
        prefix: '',
        suffix: 'Orders',
        query: 'SIMPLE QUERY KPI ONE'
      }
    ];
    let stages = [
      {
        title: 'BROWSE',
        steps: [
          {
            values: '',
            line: 1,
            sub_steps: [
              {
                title: '',
                id: 'ST1-LINE1-SS1'
              }
            ]
          }
        ],
        touchpoints: [
          {
            related_steps: '',
            queries: []
          }
        ]
      }
    ];
    dataManager.version = '1.0.0';
    dataManager.banner_kpis = bannerKpi;
    dataManager.stages = stages;
    const result = dataManager.GetCurrentConfigurationJSON();
    stages = [
      {
        title: 'BROWSE',
        steps: [
          {
            line: 1,
            values: [
              {
                id: 'ST1-LINE1-SS1'
              }
            ]
          }
        ],
        touchpoints: [
          {
            related_steps: '',
            queries: []
          }
        ]
      }
    ];
    const configuration = {
      pathpointVersion: '1.0.0',
      banner_kpis: bannerKpi,
      stages: stages
    };
    expect(result).toMatch(JSON.stringify(configuration, null, 4));
  });

  it('Function ReadPathpointConfig()', () => {
    const bannerKpi = [
      {
        description: 'KPI ONE',
        prefix: '',
        suffix: 'Orders',
        query: 'SIMPLE QUERY KPI ONE'
      }
    ];
    let stages = [
      {
        title: 'BROWSE',
        steps: [
          {
            values: '',
            line: 1,
            sub_steps: [
              {
                title: '',
                id: 'ST1-LINE1-SS1'
              }
            ]
          }
        ],
        touchpoints: [
          {
            related_steps: '',
            queries: []
          }
        ]
      }
    ];
    dataManager.version = '1.0.0';
    dataManager.banner_kpis = bannerKpi;
    dataManager.stages = stages;
    dataManager.ReadPathpointConfig();
    stages = [
      {
        title: 'BROWSE',
        steps: [
          {
            line: 1,
            values: [
              {
                id: 'ST1-LINE1-SS1'
              }
            ]
          }
        ],
        touchpoints: [
          {
            related_steps: '',
            queries: []
          }
        ]
      }
    ];
    const configuration = {
      pathpointVersion: '1.0.0',
      banner_kpis: bannerKpi,
      stages: stages
    };
    expect(dataManager.configuration).toEqual(configuration);
  });

  it('Function GetRelatedSteps()', () => {
    dataManager.touchPoints = [
      {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: [
          {
            stage_index: 1,
            touchpoint_index: 1,
            status_on_off: true,
            relation_steps: [1]
          },
          {
            stage_index: 1,
            touchpoint_index: 2,
            status_on_off: true,
            relation_steps: [1]
          }
        ]
      }
    ];
    dataManager.stages = [
      {
        index: 1,
        title: 'BROWSE',
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                canary_state: true,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [{ index: 1, error: true, stage_index: 1 }]
      }
    ];
    const result = dataManager.GetRelatedSteps(1, 1);
    expect(result).toMatch('ST1-LINE1-SS1');
  });

  it('Function GetStepsIds()', () => {
    dataManager.stages = [
      {
        index: 1,
        title: 'BROWSE',
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                canary_state: true,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [{ index: 1, error: true, stage_index: 1 }]
      }
    ];
    const result = dataManager.GetStepsIds(1, [1]);
    expect(result).toMatch('ST1-LINE1-SS1');
  });

  it('Function GetTouchpointQueryes()', () => {
    dataManager.touchPoints = [
      {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: [
          {
            stage_index: 1,
            touchpoint_index: 1,
            status_on_off: true,
            relation_steps: [1],
            measure_points: [
              {
                type: 0,
                query: 'SIMPLE QUERY OF TYPE 0',
                error_threshold: 1
              },
              {
                type: 1,
                query: 'SIMPLE QUERY OF TYPE 1',
                apdex_time: 1
              },
              {
                type: 2,
                query: 'SIMPLE QUERY OF TYPE 2'
              },
              {
                type: 3,
                query: 'SIMPLE QUERY OF TYPE 3'
              },
              {
                type: 4,
                query: 'SIMPLE QUERY OF TYPE 4'
              },
              {
                type: 20,
                query: 'SIMPLE QUERY OF TYPE 20',
                error_threshold: 1
              }
            ]
          }
        ]
      }
    ];
    const result = dataManager.GetTouchpointQueryes(1, 1);
    expect(result).toEqual([
      {
        type: 'COUNT-QUERY',
        query: 'SIMPLE QUERY OF TYPE 0',
        error_threshold: 1
      },
      {
        type: 'ERROR-PERCENTAGE-QUERY',
        query: 'SIMPLE QUERY OF TYPE 1',
        apdex_time: 1
      },
      {
        type: 'APDEX-QUERY',
        query: 'SIMPLE QUERY OF TYPE 2'
      },
      {
        type: 'SESSIONS-QUERY',
        query: 'SIMPLE QUERY OF TYPE 3'
      },
      {
        type: 'SESSIONS-QUERY-DURATION',
        query: 'SIMPLE QUERY OF TYPE 4'
      },
      {
        type: 'FULL-OPEN-QUERY',
        query: 'SIMPLE QUERY OF TYPE 20',
        error_threshold: 1
      }
    ]);
  });

  it('Function SetConfigurationJSON()', () => {
    const configuration = {
      pathpointVersion: '1.0.4',
      banner_kpis: [
        {
          description: 'Total Order Count',
          prefix: '',
          suffix: 'Orders',
          query: 'SIMPLE QUERY KPI'
        }
      ],
      stages: [
        {
          title: 'BROWSE',
          active_dotted: 'none',
          steps: [
            {
              line: 1,
              values: [
                {
                  title: 'Web',
                  id: 'ST1-LINE1-SS1'
                }
              ]
            }
          ],
          touchpoints: [
            {
              title: 'Catalog API',
              status_on_off: true,
              dashboard_url: ['https://one.newrelic.com'],
              related_steps: 'ST1-LINE1-SS1',
              queries: [
                {
                  type: 'COUNT-QUERY',
                  query: 'SIMPLE COUNT-QUERY'
                },
                {
                  type: 'ERROR-PERCENTAGE-QUERY',
                  query: 'SIMPLE ERROR-PERCENTAGE-QUERY'
                },
                {
                  type: 'APDEX-QUERY',
                  query: 'SIMPLE APDEX-QUERY'
                },
                {
                  type: 'SESSIONS-QUERY',
                  query: 'SIMPLE SESSIONS-QUERY'
                },
                {
                  type: 'SESSIONS-QUERY-DURATION',
                  query: 'SIMPLE SESSIONS-QUERY-DURATION'
                },
                {
                  type: 'FULL-OPEN-QUERY',
                  query: 'SIMPLE FULL-OPEN-QUERY'
                }
              ]
            }
          ]
        }
      ]
    };
    dataManager.banner_kpis = [];
    const result = dataManager.SetConfigurationJSON(
      JSON.stringify(configuration, null, 4)
    );
    expect(result.banner_kpis).toEqual([
      {
        type: 100,
        value: 0,
        description: 'Total Order Count',
        prefix: '',
        suffix: 'Orders',
        query: 'SIMPLE QUERY KPI'
      }
    ]);
    expect(result.stages).toEqual([
      {
        title: 'BROWSE',
        total_count: 0,
        capacity: 0,
        congestion: {
          percentage: 0,
          value: 0
        },
        icon_active: 0,
        icon_description: 'star',
        icon_visible: false,
        index: 1,
        active_dotted: 'none',
        latencyStatus: false,
        status_color: 'good',
        gout_enable: false,
        gout_quantity: 150,
        money: '',
        money_enabled: false,
        trafficIconType: 'traffic',
        active_dotted_color: '#828282',
        steps: [
          {
            value: '',
            sub_steps: [
              {
                canary_state: false,
                dark: false,
                dotted: false,
                error: false,
                highlighted: false,
                history_error: false,
                index: 1,
                index_stage: 1,
                latency: true,
                value: 'Web',
                sixth_sense: false,
                relationship_touchpoints: [1],
                id: 'ST1-LINE1-SS1'
              }
            ]
          }
        ],
        touchpoints: [
          {
            value: 'Catalog API',
            stage_index: 1,
            active: false,
            status_on_off: true,
            dashboard_url: ['https://one.newrelic.com'],
            index: 1,
            highlighted: false,
            error: false,
            history_error: false,
            sixth_sense: false,
            sixth_sense_url: [[]],
            countrys: [0],
            relation_steps: [1]
          }
        ]
      }
    ]);
  });

  it('Function UpdateNewConfiguration()', () => {
    const configuration = {
      pathpointVersion: '1.0.4',
      banner_kpis: [
        {
          description: 'Total Order Count',
          prefix: '',
          suffix: 'Orders',
          query: 'SIMPLE QUERY KPI'
        }
      ],
      stages: [
        {
          title: 'BROWSE',
          active_dotted: 'none',
          steps: [
            {
              line: 1,
              values: [
                {
                  title: 'Web',
                  id: 'ST1-LINE1-SS1'
                }
              ]
            }
          ],
          touchpoints: [
            {
              title: 'Catalog API',
              status_on_off: true,
              dashboard_url: ['https://one.newrelic.com'],
              related_steps: 'ST1-LINE1-SS1',
              queries: [
                {
                  type: 'COUNT-QUERY',
                  query: 'SIMPLE COUNT-QUERY'
                },
                {
                  type: 'ERROR-PERCENTAGE-QUERY',
                  query: 'SIMPLE ERROR-PERCENTAGE-QUERY'
                },
                {
                  type: 'APDEX-QUERY',
                  query: 'SIMPLE APDEX-QUERY'
                },
                {
                  type: 'SESSIONS-QUERY',
                  query: 'SIMPLE SESSIONS-QUERY'
                },
                {
                  type: 'SESSIONS-QUERY-DURATION',
                  query: 'SIMPLE SESSIONS-QUERY-DURATION'
                },
                {
                  type: 'FULL-OPEN-QUERY',
                  query: 'SIMPLE FULL-OPEN-QUERY'
                }
              ]
            }
          ]
        }
      ]
    };
    dataManager.banner_kpis = [];
    dataManager.configurationJSON = configuration;
    dataManager.UpdateNewConfiguration();
    expect(dataManager.stages.length).toEqual(1);
    expect(dataManager.banner_kpis.length).toEqual(1);
  });

  it('Function UpdateTouchpointsRelationship()', () => {
    dataManager.touchpoints = [
      {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: [
          {
            stage_index: 1,
            value: 'Catalog API',
            touchpoint_index: 1,
            status_on_off: true,
            relation_steps: ['ST1-LINE1-SS1']
          }
        ]
      }
    ];
    dataManager.stages = [
      {
        index: 1,
        title: 'BROWSE',
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [
          {
            value: '',
            sub_steps: [
              {
                index: 1,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: []
              }
            ]
          }
        ],
        touchpoints: [
          {
            stage_index: 1,
            index: 1,
            relation_steps: ['ST1-LINE1-SS1']
          }
        ]
      }
    ];
    dataManager.UpdateTouchpointsRelationship();
    expect(dataManager.stages[0].steps[0].sub_steps).toEqual([
      { index: 1, id: 'ST1-LINE1-SS1', relationship_touchpoints: [1] }
    ]);
  });

  it('UpdateTouchpointCopy', () => {
    dataManager.touchPoints = [
      {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: []
      }
    ];
    dataManager.UpdateTouchpointCopy();
    expect(dataManager.touchPointsCopy).toEqual([
      {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: []
      }
    ]);
  });
});
