import DataManager from '../../services/DataManager';
import appPackage from '../../../../package.json';

jest.mock(
  'nr1',
  () => {
    const AccountsQuery = {
      query: jest.fn().mockReturnValue({
        data: [{ id: 2710112, name: 'WigiBoards' }]
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
                  return {
                    data: {
                      kpis: [
                        {
                          check: true,
                          index: 0,
                          link: 'https://onenr.io/01qwL8KPxw5',
                          name: 'Unique Visitors',
                          prefix: '$',
                          queryByCity: [],
                          shortName: 'Unique',
                          value_type: 'FLOAT'
                        }
                      ],
                      ViewJSON: [
                        {
                          active_dotted: 'none',
                          active_dotted_color: '#828282',
                          arrowMode: 'FLOW',
                          consgestion: {
                            percentage: 50,
                            value: 50
                          },
                          status_color: 'warning',
                          trafficIconType: 'people'
                        },
                        {
                          active_dotted: 'none',
                          active_dotted_color: '#828282',
                          arrowMode: 'FLOW',
                          consgestion: {
                            percentage: 50,
                            value: 50
                          },
                          status_color: 'warning',
                          trafficIconType: 'traffic'
                        }
                      ]
                    }
                  };
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
                              status_on_off: true,
                              touchpoint_index: 1,
                              value: 'Login People (PRC)',
                              measure_points: [
                                {
                                  measure_time: '15 minutes ago',
                                  min_count: 10,
                                  query:
                                    "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
                                  session_count: 17699,
                                  timeout: 10,
                                  type: 'PRC'
                                }
                              ],
                              relation_steps: [4]
                            }
                          ]
                        }
                      ]
                    }
                  };
                case 'DropParams':
                  return { data: { dataCanary: [{}, {}] } };
                case 'HistoricErrorsParams':
                  return {
                    data: {
                      historicErrorsDays: 0,
                      historicErrorsHighLightPercentage: 0
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
    const logger = {
      log: () => {}
    };
    return {
      AccountsQuery: AccountsQuery,
      AccountStorageQuery: AccountStorageQuery,
      AccountStorageMutation: AccountStorageMutation,
      NerdGraphQuery: NerdGraphQuery,
      nerdlet: nerdlet,
      logger: logger
    };
  },
  { virtual: true }
);

describe('Datamanager service', () => {
  let dataManager;

  beforeEach(() => {
    dataManager = new DataManager();
  });

  it('Function BootstrapInitialData()', async () => {
    const result = dataManager.BootstrapInitialData();
    console.log(result);
  });
});
