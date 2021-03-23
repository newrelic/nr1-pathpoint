import DataManager from '../../services/DataManager';
import appPackage from '../../../../package.json';

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
                  return { data: { Version: '9.9.9' } };
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
                case 'HistoricErrorsParams':
                  return {
                    data: {
                      historicErrorsDays: 0,
                      historicErrorsHighLightPercentage: 0
                    }
                  };
                case 'maxCapacity':
                  return {
                    data: {
                      Capacity: [
                        {
                          STAGES: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
        } else if (query.includes('PathpointHistoricErrors')) {
          let dataReturn = {};
          await new Promise(resolve => {
            dataReturn = {
              data: {
                actor: {
                  account: {
                    nrql: {
                      results: [
                        { count: 2, facet: [1, 1, 4] },
                        { count: 0.3, facet: [1, 1, 4] }
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

  it('Function BootstrapInitialData()', async () => {
    const result = await dataManager.BootstrapInitialData();
    expect(result.stages.length).toEqual(5);
    expect(result.banner_kpis.length).toEqual(3);
    expect(result.accountId).toEqual(123);
    expect(result.version).toMatch(appPackage.version);
  });

  it('Function GetAccountId()', async () => {
    await dataManager.GetAccountId();
    expect(dataManager.accountId).toEqual(123);
  });

  it('Function CheckVersion()', async () => {
    await dataManager.CheckVersion();
    expect(dataManager.lastStorageVersion).toMatch('9.9.9');
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

  it('Function ClearMeasure()', () => {
    const measure = {
      type: 100,
      value: 1
    };
    dataManager.ClearMeasure(measure);
    expect(measure).toEqual({
      type: 100,
      value: 0
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

  it('Function SetSessionTime()', () => {
    const measureSession = [{ id: 'abcd123', time: 123456789 }];
    const result = dataManager.SetSessionTime(measureSession, 'abcd123');
    expect(result).toEqual(123456789);
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

  it('Function UpdateCanaryData', () => {
    dataManager.UpdateCanaryData({});
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
                relationship_touchpoints: [1, 2]
              },
              {
                index: 2,
                canary_state: true,
                id: 'ST1-LINE1-SS2',
                relationship_touchpoints: [1, 2]
              }
            ]
          }
        ],
        touchpoints: [{ index: 1, error: true, stage_index: 1 }]
      }
    ];
    const result = dataManager.GetStepsIds(1, [1, 2]);
    expect(result).toMatch('ST1-LINE1-SS1,ST1-LINE1-SS2');
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

  it('Function UpdateTouchpointCopy', () => {
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

  it('Function GetCurrentHistoricErrorScript()', () => {
    dataManager.pathpointId = '123abc-defg';
    const result = dataManager.GetCurrentHistoricErrorScript();
    const strExp =
      'varpathpointId="123abc-defg"varmyAccountID=$secure.PATHPOINT_HISTORIC_ERROR_ACCOUNTID;varmyInsertKey=$secure.PATHPOINT_HISTORIC_ERROR_INSERT_KEY;varmyQueryKey=$secure.PATHPOINT_HISTORIC_ERROR_QUERY_KEY;vargraphQLKey=$secure.PATHPOINT_HISTORIC_ERROR_GRAPHQL_KEY;vartoday=newDate();vardate=today.getFullYear()+\'-\'+(today.getMonth()+1)+\'-\'+today.getDate();vartime=today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();vardateTime=date+\'\'+time;varraw1=JSON.stringify({"query":"{actor{measure_1_1_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageSINCE5minutesAGO\\",timeout:10){results}}}}","variables":""});vargraphqlpack1={headers:{"Content-Type":"application/json","API-Key":graphQLKey},url:\'https://api.newrelic.com/graphql\',body:raw1};varreturn1=null;functioncallback1(err,response,body){return1=JSON.parse(body);varevents=[];varevent=null;varc=null;for(const[key,value]ofObject.entries(return1.data.actor)){c=key.split("_");if(value.nrql.results!=null){if(c[3]==\'0\'){event={"eventType":"PathpointHistoricErrors","pathpointId":pathpointId,"stage_index":parseInt(c[1]),"touchpoint_index":parseInt(c[2]),"count":value.nrql.results[0].count,"percentage":value.nrql.results[0].percentage}}else{event={"eventType":"PathpointHistoricErrors","pathpointId":pathpointId,"stage_index":parseInt(c[1]),"touchpoint_index":parseInt(c[2]),"count":value.nrql.results[0].R1,"percentage":value.nrql.results[0].R2}}console.log(event);events.push(event);}}varrawN=JSON.stringify(events);varoptions={//DefineendpointURL.url:"https://insights-collector.newrelic.com/v1/accounts/"+myAccountID+"/events",//DefinebodyofPOSTrequest.body:rawN,//Defineinsertkeyandexpecteddatatype.headers:{\'X-Insert-Key\':myInsertKey,\'Content-Type\':\'application/json\'}};console.log(options);$http.post(options,function(error,response,body){console.log(response.statusCode+"statuscodeFUNCIONO");varinfo=JSON.parse(body);console.log(info);});}//MakeGETrequest,passinginoptionsandcallback.$http.post(graphqlpack1,callback1);';
    expect(result.replace(/\s+/g, '')).toMatch(strExp);
  });

  it('Function ReadHistoricErrors()', async () => {
    dataManager.touchPoints = [
      {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: [
          {
            stage_index: 1,
            value: 'Catalog API',
            touchpoint_index: 1,
            status_on_off: true,
            relation_steps: ['ST1-LINE1-SS1'],
            measure_points: [
              {
                type: 0,
                error_threshold: 0.2
              }
            ]
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
            history_error: false
          }
        ]
      }
    ];
    dataManager.historicErrorsHighLightPercentage = 50;
    await dataManager.ReadHistoricErrors();
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
                relationship_touchpoints: []
              }
            ]
          }
        ],
        touchpoints: [
          {
            stage_index: 1,
            index: 1,
            history_error: true
          }
        ]
      }
    ]);
  });

  it('Function CalculateHistoricErrors()', () => {
    dataManager.historicErrorsHighLightPercentage = 75;
    const nrql = {
      results: [
        { count: 2, facet: [1, 1, 4] },
        { count: 0.3, facet: [1, 2, 4] }
      ]
    };
    dataManager.touchPoints = [
      {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: [
          {
            stage_index: 1,
            touchpoint_index: 1,
            measure_points: [
              {
                type: 0,
                error_threshold: 0.2
              }
            ]
          },
          {
            stage_index: 1,
            touchpoint_index: 2,
            measure_points: [
              {
                type: 0,
                error_threshold: 0.2
              }
            ]
          }
        ]
      }
    ];
    dataManager.stages = [
      {
        index: 1,
        touchpoints: [
          {
            stage_index: 1,
            index: 1,
            history_error: false
          },
          {
            stage_index: 1,
            index: 2,
            history_error: false
          }
        ]
      }
    ];
    dataManager.CalculateHistoricErrors(nrql);
    expect(dataManager.stages).toEqual([
      {
        index: 1,
        touchpoints: [
          {
            stage_index: 1,
            index: 1,
            history_error: true
          },
          {
            stage_index: 1,
            index: 2,
            history_error: true
          }
        ]
      }
    ]);
  });

  it('Function SetTouchpointHistoricError()', () => {
    dataManager.stages = [
      {
        index: 1,
        touchpoints: [
          {
            stage_index: 1,
            index: 1,
            history_error: false
          }
        ]
      }
    ];
    dataManager.SetTouchpointHistoricError(1, 1);
    expect(dataManager.stages).toEqual([
      {
        index: 1,
        touchpoints: [
          {
            stage_index: 1,
            index: 1,
            history_error: true
          }
        ]
      }
    ]);
  });

  it('Function ClearTouchpointHistoricError()', () => {
    dataManager.stages = [
      {
        index: 1,
        touchpoints: [
          {
            stage_index: 1,
            index: 1,
            history_error: true
          }
        ]
      }
    ];
    dataManager.ClearTouchpointHistoricError();
    expect(dataManager.stages).toEqual([
      {
        index: 1,
        touchpoints: [
          {
            stage_index: 1,
            index: 1,
            history_error: false
          }
        ]
      }
    ]);
  });

  it('Function GetTouchpointErrorThreshold() with type measure 0', () => {
    dataManager.touchPoints = [
      {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: [
          {
            stage_index: 1,
            touchpoint_index: 1,
            status_on_off: false,
            measure_points: [
              {
                type: 0,
                error_threshold: 0.2
              }
            ]
          }
        ]
      }
    ];
    const result = dataManager.GetTouchpointErrorThreshold(1, 1);
    expect(result).toEqual(0.2);
  });

  it('Function GetTouchpointErrorThreshold() with type measure 20', () => {
    dataManager.touchPoints = [
      {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: [
          {
            stage_index: 1,
            touchpoint_index: 1,
            status_on_off: false,
            measure_points: [
              {
                type: 20,
                error_threshold: 0.9
              }
            ]
          }
        ]
      }
    ];
    const result = dataManager.GetTouchpointErrorThreshold(1, 1);
    expect(result).toEqual(0.9);
  });

  describe('Function CreateNrqlQueriesForHistoricErrorScript()', () => {
    it('type query 20', () => {
      dataManager.touchPoints = [
        {
          index: 0,
          country: 'PRODUCTION',
          touchpoints: [
            {
              stage_index: 1,
              touchpoint_index: 1,
              measure_points: [
                {
                  type: 20,
                  query: 'SIMPLE QUERY OF TYPE 20'
                }
              ]
            }
          ]
        }
      ];
      const strExpect =
        'varraw1=JSON.stringify({"query":"{actor{measure_1_1_20:account(id:"+myAccountID+"){nrql(query:\\"SIMPLEQUERYOFTYPE20SINCE5minutesAGO\\",timeout:10){results}}}}","variables":""});vargraphqlpack1={headers:{"Content-Type":"application/json","API-Key":graphQLKey},url:\'https://api.newrelic.com/graphql\',body:raw1};varreturn1=null;functioncallback1(err,response,body){return1=JSON.parse(body);varevents=[];varevent=null;varc=null;for(const[key,value]ofObject.entries(return1.data.actor)){c=key.split("_");if(value.nrql.results!=null){if(c[3]==\'0\'){event={"eventType":"PathpointHistoricErrors","pathpointId":pathpointId,"stage_index":parseInt(c[1]),"touchpoint_index":parseInt(c[2]),"count":value.nrql.results[0].count,"percentage":value.nrql.results[0].percentage}}else{event={"eventType":"PathpointHistoricErrors","pathpointId":pathpointId,"stage_index":parseInt(c[1]),"touchpoint_index":parseInt(c[2]),"count":value.nrql.results[0].R1,"percentage":value.nrql.results[0].R2}}console.log(event);events.push(event);}}';
      const result = dataManager.CreateNrqlQueriesForHistoricErrorScript();
      expect(result.replace(/\s+/g, '')).toMatch(strExpect);
    });

    it('type query 0', () => {
      dataManager.touchPoints = [
        {
          index: 0,
          country: 'PRODUCTION',
          touchpoints: [
            {
              stage_index: 1,
              touchpoint_index: 1,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0'
                }
              ]
            }
          ]
        }
      ];
      const strExpect =
        'varraw1=JSON.stringify({"query":"{actor{measure_1_1_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageOFTYPE0SINCE5minutesAGO\\",timeout:10){results}}}}","variables":""});vargraphqlpack1={headers:{"Content-Type":"application/json","API-Key":graphQLKey},url:\'https://api.newrelic.com/graphql\',body:raw1};varreturn1=null;functioncallback1(err,response,body){return1=JSON.parse(body);varevents=[];varevent=null;varc=null;for(const[key,value]ofObject.entries(return1.data.actor)){c=key.split("_");if(value.nrql.results!=null){if(c[3]==\'0\'){event={"eventType":"PathpointHistoricErrors","pathpointId":pathpointId,"stage_index":parseInt(c[1]),"touchpoint_index":parseInt(c[2]),"count":value.nrql.results[0].count,"percentage":value.nrql.results[0].percentage}}else{event={"eventType":"PathpointHistoricErrors","pathpointId":pathpointId,"stage_index":parseInt(c[1]),"touchpoint_index":parseInt(c[2]),"count":value.nrql.results[0].R1,"percentage":value.nrql.results[0].R2}}console.log(event);events.push(event);}}';
      const result = dataManager.CreateNrqlQueriesForHistoricErrorScript();
      expect(result.replace(/\s+/g, '')).toMatch(strExpect);
    });

    it('with 20 touchpoints', () => {
      dataManager.touchPoints = [
        {
          index: 0,
          country: 'PRODUCTION',
          touchpoints: [
            {
              stage_index: 1,
              touchpoint_index: 1,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0'
                }
              ]
            },
            {
              stage_index: 1,
              touchpoint_index: 2,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0'
                }
              ]
            },
            {
              stage_index: 1,
              touchpoint_index: 3,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0'
                }
              ]
            },
            {
              stage_index: 1,
              touchpoint_index: 4,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0'
                }
              ]
            },
            {
              stage_index: 1,
              touchpoint_index: 5,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0'
                }
              ]
            },
            {
              stage_index: 1,
              touchpoint_index: 6,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0'
                }
              ]
            },
            {
              stage_index: 1,
              touchpoint_index: 7,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0'
                }
              ]
            },
            {
              stage_index: 1,
              touchpoint_index: 8,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0'
                }
              ]
            },
            {
              stage_index: 1,
              touchpoint_index: 9,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0'
                }
              ]
            },
            {
              stage_index: 1,
              touchpoint_index: 10,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0'
                }
              ]
            },
            {
              stage_index: 1,
              touchpoint_index: 11,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0'
                }
              ]
            },
            {
              stage_index: 1,
              touchpoint_index: 12,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0'
                }
              ]
            },
            {
              stage_index: 1,
              touchpoint_index: 13,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0'
                }
              ]
            },
            {
              stage_index: 1,
              touchpoint_index: 14,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0'
                }
              ]
            },
            {
              stage_index: 1,
              touchpoint_index: 15,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0'
                }
              ]
            },
            {
              stage_index: 1,
              touchpoint_index: 16,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0'
                }
              ]
            },
            {
              stage_index: 1,
              touchpoint_index: 17,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0'
                }
              ]
            },
            {
              stage_index: 1,
              touchpoint_index: 18,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0'
                }
              ]
            },
            {
              stage_index: 1,
              touchpoint_index: 19,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0'
                }
              ]
            },
            {
              stage_index: 1,
              touchpoint_index: 20,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0'
                }
              ]
            },
            {
              stage_index: 1,
              touchpoint_index: 21,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0'
                }
              ]
            }
          ]
        }
      ];
      const strExpect =
        'varraw1=JSON.stringify({"query":"{actor{measure_1_1_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageOFTYPE0SINCE5minutesAGO\\",timeout:10){results}}measure_1_2_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageOFTYPE0SINCE5minutesAGO\\",timeout:10){results}}measure_1_3_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageOFTYPE0SINCE5minutesAGO\\",timeout:10){results}}measure_1_4_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageOFTYPE0SINCE5minutesAGO\\",timeout:10){results}}measure_1_5_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageOFTYPE0SINCE5minutesAGO\\",timeout:10){results}}measure_1_6_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageOFTYPE0SINCE5minutesAGO\\",timeout:10){results}}measure_1_7_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageOFTYPE0SINCE5minutesAGO\\",timeout:10){results}}measure_1_8_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageOFTYPE0SINCE5minutesAGO\\",timeout:10){results}}measure_1_9_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageOFTYPE0SINCE5minutesAGO\\",timeout:10){results}}measure_1_10_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageOFTYPE0SINCE5minutesAGO\\",timeout:10){results}}measure_1_11_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageOFTYPE0SINCE5minutesAGO\\",timeout:10){results}}measure_1_12_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageOFTYPE0SINCE5minutesAGO\\",timeout:10){results}}measure_1_13_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageOFTYPE0SINCE5minutesAGO\\",timeout:10){results}}measure_1_14_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageOFTYPE0SINCE5minutesAGO\\",timeout:10){results}}measure_1_15_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageOFTYPE0SINCE5minutesAGO\\",timeout:10){results}}measure_1_16_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageOFTYPE0SINCE5minutesAGO\\",timeout:10){results}}measure_1_17_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageOFTYPE0SINCE5minutesAGO\\",timeout:10){results}}measure_1_18_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageOFTYPE0SINCE5minutesAGO\\",timeout:10){results}}measure_1_19_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageOFTYPE0SINCE5minutesAGO\\",timeout:10){results}}measure_1_20_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageOFTYPE0SINCE5minutesAGO\\",timeout:10){results}}}}","variables":""});varraw2=JSON.stringify({"query":"{actor{measure_1_21_0:account(id:"+myAccountID+"){nrql(query:\\"SELECTcount(*),percentage(count(*),WHEREerroristrue)aspercentageOFTYPE0SINCE5minutesAGO\\",timeout:10){results}}}}","variables":""});vargraphqlpack1={headers:{"Content-Type":"application/json","API-Key":graphQLKey},url:\'https://api.newrelic.com/graphql\',body:raw1};varreturn1=null;vargraphqlpack2={headers:{"Content-Type":"application/json","API-Key":graphQLKey},url:\'https://api.newrelic.com/graphql\',body:raw2};varreturn2=null;functioncallback1(err,response,body){return1=JSON.parse(body);$http.post(graphqlpack2,callback2);}functioncallback2(err,response,body){return2=JSON.parse(body);varevents=[];varevent=null;varc=null;for(const[key,value]ofObject.entries(return1.data.actor)){c=key.split("_");if(value.nrql.results!=null){if(c[3]==\'0\'){event={"eventType":"PathpointHistoricErrors","pathpointId":pathpointId,"stage_index":parseInt(c[1]),"touchpoint_index":parseInt(c[2]),"count":value.nrql.results[0].count,"percentage":value.nrql.results[0].percentage}}else{event={"eventType":"PathpointHistoricErrors","pathpointId":pathpointId,"stage_index":parseInt(c[1]),"touchpoint_index":parseInt(c[2]),"count":value.nrql.results[0].R1,"percentage":value.nrql.results[0].R2}}console.log(event);events.push(event);}}for(const[key,value]ofObject.entries(return2.data.actor)){c=key.split("_");if(value.nrql.results!=null){if(c[3]==\'0\'){event={"eventType":"PathpointHistoricErrors","pathpointId":pathpointId,"stage_index":parseInt(c[1]),"touchpoint_index":parseInt(c[2]),"count":value.nrql.results[0].count,"percentage":value.nrql.results[0].percentage}}else{event={"eventType":"PathpointHistoricErrors","pathpointId":pathpointId,"stage_index":parseInt(c[1]),"touchpoint_index":parseInt(c[2]),"count":value.nrql.results[0].R1,"percentage":value.nrql.results[0].R2}}console.log(event);events.push(event);}}';
      const result = dataManager.CreateNrqlQueriesForHistoricErrorScript();
      expect(result.replace(/\s+/g, '')).toMatch(strExpect);
    });
  });

  it('Function UpdateTouchpointOnOff()', () => {
    dataManager.touchPoints = [
      {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: [
          {
            stage_index: 1,
            touchpoint_index: 1,
            status_on_off: false
          }
        ]
      }
    ];
    const touchpoint = {
      stage_index: 1,
      index: 1,
      status_on_off: true
    };
    dataManager.UpdateTouchpointOnOff(touchpoint, true);
    expect(dataManager.touchPoints).toEqual([
      {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: [
          {
            stage_index: 1,
            touchpoint_index: 1,
            status_on_off: true
          }
        ]
      }
    ]);
  });

  describe('Function GetTouchpointTune()', () => {
    it('Only measure point', () => {
      dataManager.touchPoints = [
        {
          index: 0,
          country: 'PRODUCTION',
          touchpoints: [
            {
              stage_index: 1,
              touchpoint_index: 1,
              measure_points: [
                {
                  error_threshold: 0.3
                }
              ]
            }
          ]
        }
      ];
      const touchpoint = {
        stage_index: 1,
        index: 1,
        status_on_off: true
      };
      const result = dataManager.GetTouchpointTune(touchpoint);
      expect(result).toEqual({
        error_threshold: 0.3,
        apdex_time: 0
      });
    });

    it('Three measure point', () => {
      dataManager.touchPoints = [
        {
          index: 0,
          country: 'PRODUCTION',
          touchpoints: [
            {
              stage_index: 1,
              touchpoint_index: 1,
              measure_points: [
                {
                  error_threshold: 0.3
                },
                {
                  error_threshold: 0.2
                },
                {
                  apdex_time: 0.5
                }
              ]
            }
          ]
        }
      ];
      const touchpoint = {
        stage_index: 1,
        index: 1
      };
      const result = dataManager.GetTouchpointTune(touchpoint);
      expect(result).toEqual({
        error_threshold: 0.2,
        apdex_time: 0.5
      });
    });
  });

  it('Function GetTouchpointQuerys()', () => {
    dataManager.touchPoints = [
      {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: [
          {
            stage_index: 1,
            touchpoint_index: 1,
            measure_points: [
              { type: 0, query: 'SIMPLE QUERY OF TYPE 0' },
              { type: 1, query: 'SIMPLE QUERY OF TYPE 1' },
              { type: 2, query: 'SIMPLE QUERY OF TYPE 2' },
              { type: 3, query: 'SIMPLE QUERY OF TYPE 3' },
              { type: 4, query: 'SIMPLE QUERY OF TYPE 4' },
              { type: 20, query: 'SIMPLE QUERY OF TYPE 20' }
            ]
          }
        ]
      }
    ];
    const touchpoint = {
      stage_index: 1,
      index: 1
    };
    dataManager.timeRange = '5 MINUTES AGO';
    const result = dataManager.GetTouchpointQuerys(touchpoint);
    expect(result).toEqual([
      {
        label: 'Count Query',
        value: 0,
        type: 0,
        query_start: '',
        query_body: 'SIMPLE QUERY OF TYPE 0',
        query_footer: `SINCE 5 MINUTES AGO`
      },
      {
        label: 'Error Percentage Query',
        value: 1,
        type: 1,
        query_start: '',
        query_body: 'SIMPLE QUERY OF TYPE 1',
        query_footer: `SINCE 5 MINUTES AGO`
      },
      {
        label: 'Apdex Query',
        value: 2,
        type: 2,
        query_start: '',
        query_body: 'SIMPLE QUERY OF TYPE 2',
        query_footer: `SINCE 5 MINUTES AGO`
      },
      {
        label: 'Session Query',
        value: 3,
        type: 3,
        query_start: '',
        query_body: 'SIMPLE QUERY OF TYPE 3',
        query_footer: `SINCE 5 MINUTES AGO`
      },
      {
        label: 'Session Query Duration',
        value: 4,
        type: 4,
        query_start: '',
        query_body: 'SIMPLE QUERY OF TYPE 4',
        query_footer: `SINCE 5 MINUTES AGO`
      },
      {
        label: 'Full Open Query',
        value: 5,
        type: 20,
        query_start: '',
        query_body: 'SIMPLE QUERY OF TYPE 20',
        query_footer: `SINCE 5 MINUTES AGO`
      }
    ]);
  });

  describe('Function UpdateTouchpointTune()', () => {
    it('Only measure', () => {
      dataManager.touchPoints = [
        {
          index: 0,
          country: 'PRODUCTION',
          touchpoints: [
            {
              stage_index: 1,
              touchpoint_index: 1,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0',
                  error_threshold: 0.8
                }
              ]
            }
          ]
        }
      ];
      const touchpoint = {
        stage_index: 1,
        index: 1
      };
      const datos = { error_threshold: 0.3 };
      dataManager.UpdateTouchpointTune(touchpoint, datos);
      expect(dataManager.touchPoints).toEqual([
        {
          index: 0,
          country: 'PRODUCTION',
          touchpoints: [
            {
              stage_index: 1,
              touchpoint_index: 1,
              measure_points: [
                {
                  type: 0,
                  query: 'SIMPLE QUERY OF TYPE 0',
                  error_threshold: 0.3
                }
              ]
            }
          ]
        }
      ]);
    });

    it('Three measure point', () => {
      dataManager.touchPoints = [
        {
          index: 0,
          country: 'PRODUCTION',
          touchpoints: [
            {
              stage_index: 1,
              touchpoint_index: 1,
              measure_points: [
                {
                  error_threshold: 0
                },
                {
                  error_threshold: 0
                },
                {
                  apdex_time: 0
                }
              ]
            }
          ]
        }
      ];
      const touchpoint = {
        stage_index: 1,
        index: 1
      };
      const datos = { error_threshold: 0.3, apdex_time: 0.1 };
      dataManager.UpdateTouchpointTune(touchpoint, datos);
      expect(dataManager.touchPoints).toEqual([
        {
          index: 0,
          country: 'PRODUCTION',
          touchpoints: [
            {
              stage_index: 1,
              touchpoint_index: 1,
              measure_points: [
                {
                  error_threshold: 0
                },
                {
                  error_threshold: 0.3
                },
                {
                  apdex_time: 0.1
                }
              ]
            }
          ]
        }
      ]);
    });
  });

  it('Function UpdateTouchpointQuerys()', () => {
    dataManager.touchPoints = [
      {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: [
          {
            stage_index: 1,
            touchpoint_index: 1,
            measure_points: [
              {
                type: 0,
                query: 'SIMPLE QUERY OF TYPE 0',
                error_threshold: 0.8
              },
              {
                type: 4,
                appName: 'SIMPLE QUERY OF TYPE 4',
                error_threshold: 0.8
              }
            ]
          }
        ]
      }
    ];
    const touchpoint = {
      stage_index: 1,
      index: 1
    };
    const datos = [
      {
        query_body: 'NEW SIMPLE QUERY OF TYPE 0',
        type: 0
      },
      {
        query_body: 'NEW SIMPLE QUERY OF TYPE 4',
        type: 4
      }
    ];
    dataManager.UpdateTouchpointQuerys(touchpoint, datos);
    expect(dataManager.touchPoints).toEqual([
      {
        index: 0,
        country: 'PRODUCTION',
        touchpoints: [
          {
            stage_index: 1,
            touchpoint_index: 1,
            measure_points: [
              {
                type: 0,
                query: 'NEW SIMPLE QUERY OF TYPE 0',
                error_threshold: 0.8
              },
              {
                type: 4,
                appName: 'NEW SIMPLE QUERY OF TYPE 4',
                error_threshold: 0.8
              }
            ]
          }
        ]
      }
    ]);
  });

  it('Function GetHistoricParameters()', () => {
    const result = dataManager.GetHistoricParameters();
    expect(result).toEqual({ days: 8, percentage: 26 });
  });

  it('Function UpdateHistoricParameters()', () => {
    dataManager.UpdateHistoricParameters(7, 30);
    expect(dataManager.historicErrorsDays).toEqual(7);
    expect(dataManager.historicErrorsHighLightPercentage).toEqual(30);
  });

  it('Function GetStorageHistoricErrorsParams()', async () => {
    await dataManager.GetStorageHistoricErrorsParams();
    expect(dataManager.historicErrorsDays).toEqual(0);
    expect(dataManager.historicErrorsHighLightPercentage).toEqual(0);
  });

  it('Function GetDBmaxCapacity()', async () => {
    await dataManager.GetDBmaxCapacity();
    expect(dataManager.capacity).toEqual([
      {
        STAGES: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    ]);
  });

  it('Function UpdateData()', async () => {
    dataManager.accountId = 123;
    dataManager.touchPoints = [
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
                count: 0
              },
              {
                type: 1,
                query: 'SIMPLE QUERY OF TYPE 1',
                error_threshold: 5,
                error_percentage: 0
              },
              {
                type: 2,
                query: 'SIMPLE QUERY OF TYPE 2',
                apdex: 0,
                apdex_time: 40
              },
              {
                type: 3,
                query: 'SIMPLE QUERY OF TYPE 3',
                count: 0
              },
              {
                type: 4,
                query: 'SIMPLE QUERY OF TYPE 4',
                sessions: []
              },
              {
                type: 5,
                query: 'SIMPLE QUERY OF TYPE 5',
                sessions: []
              },
              {
                type: 20,
                query: 'SIMPLE QUERY OF TYPE 20',
                sessions: []
              }
            ]
          }
        ]
      }
    ];
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
        touchpoints: [
          {
            error: true,
            stage_index: 1
          }
        ]
      }
    ];
    const bannerKpis = [
      {
        description: 'Total Order Count',
        prefix: '',
        suffix: 'Orders',
        query: 'SIMPLE QUERY KPI'
      },
      {
        description: 'Total Order Count',
        prefix: '',
        suffix: 'Orders',
        query: 'SIMPLE QUERY KPI'
      }
    ];
    const result = await dataManager.UpdateData(
      '30 MINUTES AGO',
      0,
      false,
      stages,
      bannerKpis
    );
    expect(result.stages).toEqual(stages);
    expect(result.banner_kpis).toEqual(bannerKpis);
  });
});
