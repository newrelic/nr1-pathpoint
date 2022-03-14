// MOCK NR1
jest.mock(
  'nr1',
  () => {
    const AccountsQuery = {
      query: jest.fn().mockReturnValue({
        data: [{ id: 2710112, name: 'WigiBoards', email: 'name@name.com' }]
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
                  return { data: { Version: '1.5.6' } };
                case 'newViewJSON':
                  return {
                    data: {
                      kpis: [
                        {
                          type: 101,
                          name: 'Unique Visitors',
                          shortName: 'Unique',
                          measure: [
                            {
                              accountID: 1606862,
                              query:
                                'SELECT count(*) as value FROM Public_APICall COMPARE WITH 2 day ago',
                              link: 'https://onenr.io/01qwL8KPxw5'
                            }
                          ],
                          value_type: 'FLOAT',
                          prefix: '$',
                          suffix: ''
                        }
                      ],
                      ViewJSON: [
                        {
                          title: 'BROWSE',
                          active_dotted: 'none',
                          arrowMode: 'FLOW',
                          steps: [
                            {
                              line: 1,
                              values: [
                                {
                                  title: 'Web',
                                  id: 'ST1-LINE1-SS1'
                                },
                                {
                                  title: 'Mobile Web',
                                  id: 'ST1-LINE1-SS2'
                                },
                                {
                                  title: 'App',
                                  id: 'ST1-LINE1-SS3'
                                }
                              ]
                            },
                            {
                              line: 2,
                              values: [
                                {
                                  title: 'Login',
                                  id: 'ST1-LINE2-SS1'
                                },
                                {
                                  title: 'Signup',
                                  id: 'ST1-LINE2-SS2'
                                },
                                {
                                  title: 'Guest',
                                  id: 'ST1-LINE2-SS3'
                                }
                              ]
                            }
                          ],
                          touchpoints: [
                            {
                              title: 'Login People (PRC)',
                              status_on_off: true,
                              dashboard_url: ['https://onenr.io/01qwL8KPxw5'],
                              related_steps: 'ST1-LINE2-SS1',
                              queries: [
                                {
                                  type: 'PRC-COUNT-QUERY',
                                  accountID: 1,
                                  query:
                                    "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
                                  query_timeout: 10,
                                  min_count: 10,
                                  max_count: 110,
                                  measure_time: '15 minutes ago'
                                }
                              ]
                            },
                            {
                              title: 'App Backend Health (APP)',
                              status_on_off: true,
                              dashboard_url: ['https://onenr.io/01qwL8KPxw5'],
                              related_steps: 'ST1-LINE1-SS3',
                              queries: [
                                {
                                  type: 'APP-HEALTH-QUERY',
                                  accountID: 2847332,
                                  query:
                                    "SELECT filter(apdex(duration, t:0.028), WHERE 1=1) as apdex, filter( max(duration), WHERE 1=1) as response,filter(percentage(count(*), WHERE error is true), WHERE 1=1) as error from Transaction WHERE appName='QS'",
                                  query_timeout: 10,
                                  min_apdex: 0.4,
                                  max_response_time: 0.5,
                                  max_error_percentage: 5,
                                  measure_time: '5 MINUTES AGO'
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  };
                case 'dataCanary':
                  return { data: { dataCanary: [{ canary: 'canary' }, {}] } };
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
                              value: 'Login People (PRC)',
                              touchpoint_index: 1,
                              status_on_off: true,
                              relation_steps: [4],
                              measure_points: [
                                {
                                  type: 'PRC',
                                  timeout: 10,
                                  query:
                                    "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
                                  min_count: 10,
                                  max_count: 110,
                                  session_count: 0,
                                  accountID: 1,
                                  measure_time: '15 minutes ago'
                                }
                              ]
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
    const UserQuery = {
      query: jest.fn().mockReturnValue({
        then: jest.fn().mockReturnValue({
          data: { name: 'NAME', id: 123, email: 'NAME@NAME.COM' }
        })
      })
    };

    const Icon = {
      TYPE: {
        HARDWARE_AND_SOFTWARE__SOFTWARE__LOGS:
          'hardware-and-software--software--logs'
      }
    };
    const navigation = {
      openStackedNerdlet: jest.fn()
    };

    return {
      Icon,
      navigation,
      AccountsQuery: AccountsQuery,
      AccountStorageQuery: AccountStorageQuery,
      AccountStorageMutation: AccountStorageMutation,
      NerdGraphQuery: NerdGraphQuery,
      nerdlet: nerdlet,
      logger: logger,
      UserQuery: UserQuery
    };
  },
  { virtual: true }
);
