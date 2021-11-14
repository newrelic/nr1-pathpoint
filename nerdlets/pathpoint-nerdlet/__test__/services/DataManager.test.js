import DataManager from '../../services/DataManager';
import appPackage from '../../../../package.json';
import {
  AccountStorageQuery,
  AccountsQuery,
  AccountStorageMutation
} from 'nr1';

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
                          index: 1,
                          title: 'BROWSE',
                          active_dotted: 'none',
                          active_dotted_color: '#828282',
                          arrowMode: 'FLOW',
                          consgestion: {
                            percentage: 50,
                            value: 50
                          },
                          status_color: 'warning',
                          trafficIconType: 'people',
                          steps: [
                            {
                              value: '',
                              sub_steps: [
                                {
                                  index: 1,
                                  id: 'ST1-LINE1-SS1',
                                  canary_state: false,
                                  latency: true,
                                  value: 'Web',
                                  dark: true,
                                  history_error: false,
                                  dotted: false,
                                  highlighted: false,
                                  error: false,
                                  index_stage: 1,
                                  relationship_touchpoints: [3]
                                }
                              ]
                            }
                          ]
                        },
                        {
                          index: 2,
                          title: 'BAG',
                          active_dotted: 'none',
                          active_dotted_color: '#828282',
                          arrowMode: 'FLOW',
                          consgestion: {
                            percentage: 50,
                            value: 50
                          },
                          status_color: 'warning',
                          trafficIconType: 'traffic',
                          steps: [
                            {
                              value: '',
                              sub_steps: [
                                {
                                  index: 1,
                                  id: 'ST1-LINE1-SS1',
                                  canary_state: false,
                                  latency: true,
                                  value: 'Web',
                                  dark: true,
                                  history_error: false,
                                  dotted: false,
                                  highlighted: false,
                                  error: false,
                                  index_stage: 1,
                                  relationship_touchpoints: [3]
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
    const UserQuery = {
      query: jest.fn().mockReturnValue({
        then: jest.fn().mockReturnValue({
          data: { name: 'NAME', id: 123, email: 'NAME@NAME.COM' }
        })
      })
    };
    return {
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

describe('Datamanager service', () => {
  let dataManager;

  beforeEach(() => {
    dataManager = new DataManager();
  });

  it('Function BootstrapInitialData() with lastStorageVersion = appPackager.version', async () => {
    const accountName = 'WigiBoards';
    const version = appPackage.version;
    jest
      .spyOn(AccountStorageQuery, 'query')
      .mockImplementation(({ accountId, collection, documentId }) => {
        switch (collection) {
          case 'pathpoint': {
            switch (documentId) {
              case 'version':
                return { data: { Version: version } };
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
                        index: 1,
                        title: 'BROWSE',
                        active_dotted: 'none',
                        active_dotted_color: '#828282',
                        arrowMode: 'FLOW',
                        consgestion: {
                          percentage: 50,
                          value: 50
                        },
                        status_color: 'warning',
                        trafficIconType: 'people',
                        steps: [
                          {
                            value: '',
                            sub_steps: [
                              {
                                index: 1,
                                id: 'ST1-LINE1-SS1',
                                canary_state: false,
                                latency: true,
                                value: 'Web',
                                dark: true,
                                history_error: false,
                                dotted: false,
                                highlighted: false,
                                error: false,
                                index_stage: 1,
                                relationship_touchpoints: [3]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        index: 2,
                        title: 'BAG',
                        active_dotted: 'none',
                        active_dotted_color: '#828282',
                        arrowMode: 'FLOW',
                        consgestion: {
                          percentage: 50,
                          value: 50
                        },
                        status_color: 'warning',
                        trafficIconType: 'traffic',
                        steps: [
                          {
                            value: '',
                            sub_steps: [
                              {
                                index: 1,
                                id: 'ST1-LINE1-SS1',
                                canary_state: false,
                                latency: true,
                                value: 'Web',
                                dark: true,
                                history_error: false,
                                dotted: false,
                                highlighted: false,
                                error: false,
                                index_stage: 1,
                                relationship_touchpoints: [3]
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
      });
    const result = await dataManager.BootstrapInitialData(accountName);
    expect(dataManager.lastStorageVersion).toEqual(version);
    expect(result.stages.length).toEqual(2);
    expect(result.accountIDs).toEqual([{ name: 'WigiBoards', id: 2710112 }]);
  });

  it('Fucntion BootstrapInitialData() with lastStorageVersion old', async () => {
    const accountName = 'WigiBoards';
    jest
      .spyOn(AccountStorageQuery, 'query')
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
                        index: 1,
                        title: 'BROWSE',
                        active_dotted: 'none',
                        active_dotted_color: '#828282',
                        arrowMode: 'FLOW',
                        consgestion: {
                          percentage: 50,
                          value: 50
                        },
                        status_color: 'warning',
                        trafficIconType: 'people',
                        steps: [
                          {
                            value: '',
                            sub_steps: [
                              {
                                index: 1,
                                id: 'ST1-LINE1-SS1',
                                canary_state: false,
                                latency: true,
                                value: 'Web',
                                dark: true,
                                history_error: false,
                                dotted: false,
                                highlighted: false,
                                error: false,
                                index_stage: 1,
                                relationship_touchpoints: [3]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        index: 2,
                        title: 'BAG',
                        active_dotted: 'none',
                        active_dotted_color: '#828282',
                        arrowMode: 'FLOW',
                        consgestion: {
                          percentage: 50,
                          value: 50
                        },
                        status_color: 'warning',
                        trafficIconType: 'traffic',
                        steps: [
                          {
                            value: '',
                            sub_steps: [
                              {
                                index: 1,
                                id: 'ST1-LINE1-SS1',
                                canary_state: false,
                                latency: true,
                                value: 'Web',
                                dark: true,
                                history_error: false,
                                dotted: false,
                                highlighted: false,
                                error: false,
                                index_stage: 1,
                                relationship_touchpoints: [3]
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
      });
    const result = await dataManager.BootstrapInitialData(accountName);
    expect(dataManager.lastStorageVersion).toEqual('1.0.0');
    expect(result.stages.length).toEqual(5);
    expect(result.accountIDs).toEqual([{ name: 'WigiBoards', id: 2710112 }]);
  });

  it('Function UpdateData()', async () => {
    const timeRange = '5 MINUTES AGO';
    const city = 0;
    const getOldSessions = false;
    const stages = [
      {
        index: 1,
        title: 'BROWSE',
        status_color: 'good',
        touchpoints: [],
        steps: [
          {
            index: 1,
            sub_steps: []
          }
        ],
        arrowMode: 'FLOW'
      }
    ];
    const kpis = [
      {
        check: true,
        index: 0,
        link: 'https://onenr.io/01qwL8KPxw5',
        name: 'Unique Visitors',
        prefix: '$',
        queryByCity: [
          {
            query:
              "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='ap-southeast-2'"
          }
        ],
        shortName: 'Unique',
        suffix: '',
        type: 101
      }
    ];
    const timeRangeKpi = {
      index: 0,
      range: '24 HOURS AGO'
    };
    dataManager.accountId = 2710112;
    dataManager.MakeLogingData = jest.fn();
    dataManager.NRDBQuery = jest.fn();
    dataManager.touchPoints = [
      {
        stage_index: 1,
        value: 'Orders API (PRC)',
        touchpoint_index: 1,
        status_on_off: true,
        relation_steps: [1],
        measure_points: [
          {
            type: 'PRC',
            timeout: 10,
            query:
              "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='ap-southeast-2'",
            min_count: 10,
            session_count: 0
          }
        ]
      }
    ];
    const result = await dataManager.UpdateData(
      timeRange,
      city,
      getOldSessions,
      stages,
      kpis,
      timeRangeKpi
    );
    expect(result).toEqual({
      kpis: [
        {
          check: true,
          index: 0,
          link: undefined,
          name: 'Unique Visitors',
          prefix: '$',
          queryByCity: [
            {
              query:
                "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='ap-southeast-2'"
            }
          ],
          shortName: 'Unique',
          suffix: '',
          type: 101
        }
      ],
      stages: [
        {
          index: 1,
          title: 'BROWSE',
          status_color: 'good',
          touchpoints: [],
          steps: [
            {
              index: 1,
              sub_steps: []
            }
          ],
          arrowMode: 'FLOW'
        }
      ]
    });
  });

  it('Function GetAccountId()', async () => {
    const accountName = 'WigiBoards';
    jest.spyOn(AccountsQuery, 'query').mockReturnValue({
      data: [{ id: 2710112, name: '', email: 'name@name.com' }]
    });
    await dataManager.GetAccountId(accountName);
    expect(dataManager.accountId).toEqual(2710112);
  });

  it('Function GetAccountId() without accountName', async () => {
    const accountName = '';
    jest.spyOn(AccountsQuery, 'query').mockReturnValue({
      data: [{ id: 2710112, name: '', email: 'name@name.com' }]
    });
    await dataManager.GetAccountId(accountName);
    expect(dataManager.accountId).toEqual(2710112);
  });

  it('Function GetAccountId() catch Error', async () => {
    const accountName = 'Name';
    jest.spyOn(AccountsQuery, 'query').mockRejectedValue(Error('error'));
    await expect(dataManager.GetAccountId(accountName)).rejects.toThrow(
      'error'
    );
  });

  it('Function AddCustomAccountIDs()', () => {
    dataManager.touchPoints = [
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
                session_count: 0,
                measure_time: '15 minutes ago',
                accountID: 2710112
              }
            ]
          }
        ]
      }
    ];
    dataManager.removeCustomIDs = jest.fn();
    dataManager.AddCustomAccountIDs();
    expect(dataManager.accountIDs).toEqual([
      { id: 0, name: 'NAME' },
      { id: 2710112, name: 'Custom ID' }
    ]);
  });

  it('Function removeCustomIDs()', () => {
    dataManager.accountIDs = [
      { name: 'Name', id: 0 },
      { name: 'Custom ID', id: 2710112 }
    ];
    dataManager.removeCustomIDs();
    expect(dataManager.accountIDs).toEqual([{ id: 0, name: 'Name' }]);
  });

  it('Function CheckVersion() with cath', async () => {
    jest.spyOn(AccountStorageQuery, 'query').mockRejectedValue(Error('error'));
    await expect(dataManager.CheckVersion()).rejects.toThrow('error');
  });

  it('Function GetInitialDataFromStorage() with cath', async () => {
    jest.spyOn(AccountStorageQuery, 'query').mockRejectedValue(Error('error'));
    await expect(dataManager.GetInitialDataFromStorage()).rejects.toThrow(
      'error'
    );
  });

  // it('Function SetInitialDataViewToStorage() with cath', async () => {
  //   jest
  //     .spyOn(AccountStorageMutation, 'mutate')
  //     .mockRejectedValue(Error('error'));
  //   await expect(dataManager.SetInitialDataViewToStorage()).rejects.toThrow(
  //     'error'
  //   );
  // });

  it('Function SaveKpisSelection()', () => {
    const kpis = [
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
    ];
    dataManager.SetInitialDataViewToStorage = jest.fn();
    dataManager.SaveKpisSelection(kpis);
  });

  it('Function GetCanaryData()', async () => {
    jest
      .spyOn(AccountStorageQuery, 'query')
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
                        index: 1,
                        title: 'BROWSE',
                        active_dotted: 'none',
                        active_dotted_color: '#828282',
                        arrowMode: 'FLOW',
                        consgestion: {
                          percentage: 50,
                          value: 50
                        },
                        status_color: 'warning',
                        trafficIconType: 'people',
                        steps: [
                          {
                            value: '',
                            sub_steps: [
                              {
                                index: 1,
                                id: 'ST1-LINE1-SS1',
                                canary_state: false,
                                latency: true,
                                value: 'Web',
                                dark: true,
                                history_error: false,
                                dotted: false,
                                highlighted: false,
                                error: false,
                                index_stage: 1,
                                relationship_touchpoints: [3]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        index: 2,
                        title: 'BAG',
                        active_dotted: 'none',
                        active_dotted_color: '#828282',
                        arrowMode: 'FLOW',
                        consgestion: {
                          percentage: 50,
                          value: 50
                        },
                        status_color: 'warning',
                        trafficIconType: 'traffic',
                        steps: [
                          {
                            value: '',
                            sub_steps: [
                              {
                                index: 1,
                                id: 'ST1-LINE1-SS1',
                                canary_state: false,
                                latency: true,
                                value: 'Web',
                                dark: true,
                                history_error: false,
                                dotted: false,
                                highlighted: false,
                                error: false,
                                index_stage: 1,
                                relationship_touchpoints: [3]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                };
              case 'dataCanary':
                return {
                  data: {
                    dataCanary: [
                      {
                        stage_index: 1,
                        stage_title: 'Stage1',
                        states: [false, false]
                      }
                    ]
                  }
                };
            }
            break;
          }
        }
        return accountId;
      });
    await dataManager.GetCanaryData();
  });

  it('Function GetCanaryData() with cath', async () => {
    jest.spyOn(AccountStorageQuery, 'query').mockRejectedValue(Error('error'));
    await expect(dataManager.GetCanaryData()).rejects.toThrow('error');
  });

  it('Function SaveCanaryData()', () => {
    const data = {
      stage_index: 1,
      stage_title: 'Stage1',
      states: [false, false]
    };
    dataManager.SaveCanaryData(data);
  });

  // it('Function SaveCanaryData() with catch', async () => {
  //   const data = {
  //     stage_index: 1,
  //     stage_title: 'Stage1',
  //     states: [false, false]
  //   };
  //   const errorMessage = 'Network Error';
  //   AccountStorageMutation.mutate = jest
  //     .fn()
  //     .mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));
  //   jest
  //     .spyOn(AccountStorageMutation, 'mutate')
  //     .mockRejectedValue(Error('error'));
  //   await expect(dataManager.SaveCanaryData()).rejects.toThrow('error');
  // });

  it('Function TouchPointsUpdate()', async () => {
    dataManager.stages = [
      {
        title: 'BROWSE'
      }
    ];
    dataManager.touchPoints = [
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
                session_count: 0,
                measure_time: '15 minutes ago',
                accountID: 2710112
              }
            ]
          }
        ]
      }
    ];
    const array = [
      {
        check: true,
        index: 0,
        link: 'https://onenr.io/01qwL8KPxw5',
        name: 'Unique Visitors',
        prefix: '$',
        queryByCity: [
          {
            query:
              "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='ap-southeast-2'"
          }
        ],
        shortName: 'Unique',
        suffix: '',
        type: 101,
        value: {
          current: 0,
          previous: 0
        },
        value_type: 'FLOAT'
      }
    ];
    dataManager.graphQlmeasures.push(array);
    dataManager.FetchMeasure = jest.fn();
    dataManager.NRDBQuery = jest.fn();
    await dataManager.TouchPointsUpdate();
    expect(dataManager.stages).toEqual([
      {
        title: 'BROWSE'
      }
    ]);
  });

  it('Function ClearMeasure()', () => {
    const measurePRC = {
      type: 'PRC',
      session_count: 1
    };
    const measurePCC = {
      type: 'PCC',
      transaction_count: 1
    };
    const measureAPP = {
      type: 'APP'
    };
    const measureFRT = {
      type: 'FRT',
      apdex_value: 2,
      response_value: 2,
      error_percentage: 2
    };
    const measureSYN = {
      type: 'SYN',
      success_percentage: 1,
      max_duration: 1,
      max_request_time: 1
    };
    const measureWLD = {
      type: 'WLD',
      status_value: 'VALUE'
    };
    dataManager.ClearMeasure(measurePRC);
    dataManager.ClearMeasure(measurePCC);
    dataManager.ClearMeasure(measureAPP);
    dataManager.ClearMeasure(measureFRT);
    dataManager.ClearMeasure(measureSYN);
    dataManager.ClearMeasure(measureWLD);
  });

  it('Function ReadQueryResults()', async () => {
    const query =
      "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'";
    const accountID = 2710112;
    dataManager.NRDBQuery = jest.fn();
    const result = await dataManager.ReadQueryResults(query, accountID);
    expect(result).toEqual({ accountID: 2710112, type: 'TEST', results: null });
  });

  it('Function FetchMeasure()', () => {
    const measure = {
      type: 'PRC',
      timeout: 10,
      query:
        "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
      min_count: 10,
      session_count: 0,
      measure_time: '15 minutes ago',
      accountID: 2710112
    };
    const extrainfo = 'TIME 5 HOURS AGO';
    dataManager.TimeRangeTransform = jest.fn();
    dataManager.FetchMeasure(measure, extrainfo);
  });

  it('Function FetchMeasure() with type = WLD', () => {
    const measure = {
      type: 'WLD',
      timeout: 10,
      query:
        "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
      min_count: 10,
      session_count: 0,
      accountID: 2710112
    };
    const extrainfo = 'TIME 5 HOURS AGO';
    dataManager.TimeRangeTransform = jest.fn();
    dataManager.FetchMeasure(measure, extrainfo);
  });

  it('Function TimeRangeTransform()', () => {
    const timeRange0 = 'default';
    const timeRange1 = '5 MINUTES AGO';
    const timeRange2 = '30 MINUTES AGO';
    const timeRange3 = '60 MINUTES AGO';
    const timeRange4 = '3 HOURS AGO';
    const timeRange5 = '6 HOURS AGO';
    const timeRange6 = '12 HOURS AGO';
    const timeRange7 = '24 HOURS AGO';
    const timeRange8 = '3 DAYS AGO';
    const timeRange9 = '7 DAYS AGO';
    const sessionsRange = true;
    const ssessionsRange2 = false;
    dataManager.getOldSessions = true;
    const time_start = Math.floor(Date.now() / 1000) - 10 * 59;
    const time_end = Math.floor(Date.now() / 1000) - 5 * 58;
    dataManager.TimeRangeTransform(timeRange2, sessionsRange);
    dataManager.TimeRangeTransform(timeRange3, sessionsRange);
    dataManager.TimeRangeTransform(timeRange4, sessionsRange);
    dataManager.TimeRangeTransform(timeRange5, sessionsRange);
    dataManager.TimeRangeTransform(timeRange6, sessionsRange);
    dataManager.TimeRangeTransform(timeRange7, sessionsRange);
    dataManager.TimeRangeTransform(timeRange8, sessionsRange);
    dataManager.TimeRangeTransform(timeRange9, sessionsRange);
    dataManager.TimeRangeTransform(timeRange0, sessionsRange);
    const result1 = dataManager.TimeRangeTransform(timeRange1, sessionsRange);
    expect(result1).toEqual(`${time_start} UNTIL ${time_end}`);
    const result2 = dataManager.TimeRangeTransform(timeRange1, ssessionsRange2);
    expect(result2).toEqual('5 MINUTES AGO');
  });

  it('Function SendToLogs()', () => {
    const logRecord = {
      action: 'touchpoint-error',
      account_id: 2710112,
      error: true
    };
    dataManager.LogConnector.SendLog = jest.fn();
    dataManager.SendToLogs(logRecord);
  });

  it('Function MakeLogingData() with errors', () => {
    const startMeasureTime = 1636870390509;
    const endMeasureTime = 1636870435588;
    const data = {
      actor: {}
    };
    const errors = [{ path: { measure: 'measure_0' } }];
    dataManager.graphQlmeasures = [
      [
        {
          accountID: 2710112
        },
        {
          query:
            "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
        },
        {
          measureType: 'touchpoint',
          touchpointRef: {
            status_on_off: false
          }
        }
      ]
    ];
    dataManager.SendToLogs = jest.fn();
    dataManager.MakeLogingData(startMeasureTime, endMeasureTime, data, errors);
  });

  it('Function MakeLogingData() with errors and mesureType = kpi', () => {
    const startMeasureTime = 1636870390509;
    const endMeasureTime = 1636870435588;
    const data = {
      actor: {}
    };
    const errors = [{ path: { measure: 'measure_0' } }];
    dataManager.graphQlmeasures = [
      [
        {
          accountID: 2710112
        },
        {
          query:
            "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
        },
        {
          measureType: 'kpi',
          touchpointRef: {
            status_on_off: false
          }
        }
      ]
    ];
    dataManager.SendToLogs = jest.fn();
    dataManager.MakeLogingData(startMeasureTime, endMeasureTime, data, errors);
  });

  it('Function MakeLogingData()', () => {
    const startMeasureTime = 1636870390509;
    const endMeasureTime = 1636870435588;
    const data = {
      actor: {
        measure_0: {
          __typename: 'Account',
          id: 2710112,
          nrql: {
            __typename: 'NrdbResultContainer',
            results: [
              {
                apdex: {
                  count: 0,
                  f: 0,
                  s: 0,
                  score: 0,
                  t: 0
                },
                count: 0
              }
            ]
          }
        }
      }
    };
    const errors = [];
    dataManager.graphQlmeasures = [
      [
        {
          accountID: 2710112
        },
        {
          query:
            "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
        },
        {
          measureType: 'touchpoint',
          touchpointRef: {
            status_on_off: false
          }
        }
      ]
    ];
    dataManager.SendToLogs = jest.fn();
    dataManager.MakeLogingData(startMeasureTime, endMeasureTime, data, errors);
  });

  it('Function MakeLogingData() with measureType = kpi', () => {
    const startMeasureTime = 1636870390509;
    const endMeasureTime = 1636870435588;
    const data = {
      actor: {
        measure_0: {
          __typename: 'Account',
          id: 2710112,
          nrql: {
            __typename: 'NrdbResultContainer',
            results: [
              {
                apdex: {
                  count: 0,
                  f: 0,
                  s: 0,
                  score: 0,
                  t: 0
                },
                count: 0
              }
            ]
          }
        }
      }
    };
    const errors = [];
    dataManager.graphQlmeasures = [
      [
        {
          accountID: 2710112,
          queryByCity: [
            {
              accountID: 2710112,
              query:
                "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='ap-southeast-2'"
            }
          ]
        },
        {
          query:
            "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
        },
        {
          measureType: 'kpi',
          touchpointRef: {
            status_on_off: false
          }
        }
      ]
    ];
    dataManager.SendToLogs = jest.fn();
    dataManager.MakeLogingData(startMeasureTime, endMeasureTime, data, errors);
  });

  it('Function DisableTouchpointByError()', () => {
    const touchpoint = {
      status_on_off: false
    };
    dataManager.DisableTouchpointByError(touchpoint);
  });

  it('Function NRDBQuery() with n = 0', async () => {
    dataManager.MakeLogingData = jest.fn();
    dataManager.EvaluateMeasures = jest.fn().mockReturnValue({
      data: {
        actor: {}
      },
      errors: [],
      n: 0
    });
    dataManager.NRDBQuery();
  });

  it('Function NRDBQuery() with error', async () => {
    dataManager.MakeLogingData = jest.fn();
    dataManager.EvaluateMeasures = jest.fn().mockReturnValue({
      data: {
        actor: {}
      },
      errors: [{ path: { measure: 'measure_0' } }],
      n: 26
    });
    dataManager.NRDBQuery();
  });

  it('Function NRDBQuery() with measure.type = PRC', async () => {
    dataManager.MakeLogingData = jest.fn();
    dataManager.EvaluateMeasures = jest.fn().mockReturnValue({
      data: {
        actor: {
          measure_0: {
            __typename: 'Account',
            id: 2710112,
            nrql: {
              __typename: 'NrdbResultContainer',
              results: [
                {
                  apdex: {
                    count: 0,
                    f: 0,
                    s: 0,
                    score: 0,
                    t: 0
                  },
                  session: null,
                  count: 0
                }
              ]
            }
          }
        }
      },
      errors: [],
      n: 26
    });
    dataManager.graphQlmeasures = [
      [
        {
          accountID: 2710112,
          type: 'PRC'
        },
        {
          query:
            "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
        },
        {
          measureType: 'touchpoint',
          touchpointRef: {
            status_on_off: false
          }
        }
      ]
    ];
    await dataManager.NRDBQuery();
  });

  it('Function NRDBQuery() with measure.type = PCC', async () => {
    dataManager.MakeLogingData = jest.fn();
    dataManager.EvaluateMeasures = jest.fn().mockReturnValue({
      data: {
        actor: {
          measure_0: {
            __typename: 'Account',
            id: 2710112,
            nrql: {
              __typename: 'NrdbResultContainer',
              results: [
                {
                  apdex: {
                    count: 0,
                    f: 0,
                    s: 0,
                    score: 0,
                    t: 0
                  },
                  count: null
                }
              ]
            }
          }
        }
      },
      errors: [],
      n: 26
    });
    dataManager.graphQlmeasures = [
      [
        {
          accountID: 2710112,
          type: 'PCC'
        },
        {
          query:
            "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
        },
        {
          measureType: 'touchpoint',
          touchpointRef: {
            status_on_off: false
          }
        }
      ]
    ];
    await dataManager.NRDBQuery();
  });

  it('Function NRDBQuery() with measure.type = APP', async () => {
    dataManager.MakeLogingData = jest.fn();
    dataManager.EvaluateMeasures = jest.fn().mockReturnValue({
      data: {
        actor: {
          measure_0: {
            __typename: 'Account',
            id: 2710112,
            nrql: {
              __typename: 'NrdbResultContainer',
              results: [
                {
                  apdex: {
                    count: 0,
                    f: 0,
                    s: 0,
                    score: 0,
                    t: 0
                  },
                  score: 0,
                  response: 0,
                  error: null
                }
              ]
            }
          }
        }
      },
      errors: [],
      n: 26
    });
    dataManager.graphQlmeasures = [
      [
        {
          accountID: 2710112,
          type: 'APP'
        },
        {
          query:
            "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
        },
        {
          measureType: 'touchpoint',
          touchpointRef: {
            status_on_off: false
          }
        }
      ]
    ];
    await dataManager.NRDBQuery();
  });

  it('Function NRDBQuery() with measure.type = FRT', async () => {
    dataManager.MakeLogingData = jest.fn();
    dataManager.EvaluateMeasures = jest.fn().mockReturnValue({
      data: {
        actor: {
          measure_0: {
            __typename: 'Account',
            id: 2710112,
            nrql: {
              __typename: 'NrdbResultContainer',
              results: [
                {
                  apdex: {
                    count: 0,
                    f: 0,
                    s: 0,
                    score: 0,
                    t: 0
                  },
                  score: 0,
                  response: 0,
                  error: null
                }
              ]
            }
          }
        }
      },
      errors: [],
      n: 26
    });
    dataManager.graphQlmeasures = [
      [
        {
          accountID: 2710112,
          type: 'FRT'
        },
        {
          query:
            "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
        },
        {
          measureType: 'touchpoint',
          touchpointRef: {
            status_on_off: false
          }
        }
      ]
    ];
    await dataManager.NRDBQuery();
  });

  it('Function NRDBQuery() with measure.type = SYN', async () => {
    dataManager.MakeLogingData = jest.fn();
    dataManager.EvaluateMeasures = jest.fn().mockReturnValue({
      data: {
        actor: {
          measure_0: {
            __typename: 'Account',
            id: 2710112,
            nrql: {
              __typename: 'NrdbResultContainer',
              results: [
                {
                  success: true,
                  duration: 0,
                  request: null
                }
              ]
            }
          }
        }
      },
      errors: [],
      n: 26
    });
    dataManager.graphQlmeasures = [
      [
        {
          accountID: 2710112,
          type: 'SYN'
        },
        {
          query:
            "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
        },
        {
          measureType: 'touchpoint',
          touchpointRef: {
            status_on_off: false
          }
        }
      ]
    ];
    await dataManager.NRDBQuery();
  });

  it('Function NRDBQuery() with measure.type = WLD', async () => {
    dataManager.MakeLogingData = jest.fn();
    dataManager.EvaluateMeasures = jest.fn().mockReturnValue({
      data: {
        actor: {
          measure_0: {
            __typename: 'Account',
            id: 2710112,
            nrql: {
              __typename: 'NrdbResultContainer',
              results: [
                {
                  statusValue: null
                }
              ]
            }
          }
        }
      },
      errors: [],
      n: 26
    });
    dataManager.graphQlmeasures = [
      [
        {
          accountID: 2710112,
          type: 'WLD'
        },
        {
          query:
            "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
        },
        {
          measureType: 'touchpoint',
          touchpointRef: {
            status_on_off: false
          }
        }
      ]
    ];
    await dataManager.NRDBQuery();
  });

  it('Function NRDBQuery() with measure.type = 100', async () => {
    dataManager.MakeLogingData = jest.fn();
    dataManager.EvaluateMeasures = jest.fn().mockReturnValue({
      data: {
        actor: {
          measure_0: {
            __typename: 'Account',
            id: 2710112,
            nrql: {
              __typename: 'NrdbResultContainer',
              results: [
                {
                  value: 10
                }
              ]
            }
          }
        }
      },
      errors: [],
      n: 26
    });
    dataManager.graphQlmeasures = [
      [
        {
          accountID: 2710112,
          type: 100
        },
        {
          query:
            "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
        },
        {
          measureType: 'touchpoint',
          touchpointRef: {
            status_on_off: false
          }
        }
      ]
    ];
    await dataManager.NRDBQuery();
  });

  it('Function NRDBQuery() with measure.type = 101', async () => {
    dataManager.MakeLogingData = jest.fn();
    dataManager.EvaluateMeasures = jest.fn().mockReturnValue({
      data: {
        actor: {
          measure_0: {
            __typename: 'Account',
            id: 2710112,
            nrql: {
              __typename: 'NrdbResultContainer',
              results: [
                {
                  value: {
                    current: 'current'
                  },
                  comparison: 'no_current'
                },
                {
                  value: {
                    previous: 'previous'
                  },
                  comparison: 'no_current'
                }
              ]
            }
          }
        }
      },
      errors: [],
      n: 26
    });
    dataManager.graphQlmeasures = [
      [
        {
          accountID: 2710112,
          type: 101,
          value: {
            current: 'current',
            previous: 'previous'
          }
        },
        {
          query:
            "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
        },
        {
          measureType: 'touchpoint',
          touchpointRef: {
            status_on_off: false
          }
        }
      ]
    ];
    await dataManager.NRDBQuery();
  });

  it('Function NRDBQuery() with measure.type = 101 and comparison = current', async () => {
    dataManager.MakeLogingData = jest.fn();
    dataManager.EvaluateMeasures = jest.fn().mockReturnValue({
      data: {
        actor: {
          measure_0: {
            __typename: 'Account',
            id: 2710112,
            nrql: {
              __typename: 'NrdbResultContainer',
              results: [
                {
                  value: {
                    current: 'current'
                  },
                  comparison: 'current'
                },
                {
                  value: {
                    previous: 'previous'
                  },
                  comparison: 'current'
                }
              ]
            }
          }
        }
      },
      errors: [],
      n: 26
    });
    dataManager.graphQlmeasures = [
      [
        {
          accountID: 2710112,
          type: 101,
          value: {
            current: 'current',
            previous: 'previous'
          }
        },
        {
          query:
            "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
        },
        {
          measureType: 'touchpoint',
          touchpointRef: {
            status_on_off: false
          }
        }
      ]
    ];
    await dataManager.NRDBQuery();
  });

  it('Function NRDBQuery() with measure.type = test', async () => {
    dataManager.MakeLogingData = jest.fn();
    dataManager.EvaluateMeasures = jest.fn().mockReturnValue({
      data: {
        actor: {
          measure_0: {
            __typename: 'Account',
            id: 2710112,
            nrql: {
              __typename: 'NrdbResultContainer',
              results: [
                {
                  value: {
                    current: 'current'
                  },
                  comparison: 'no_current'
                }
              ]
            }
          }
        }
      },
      errors: [],
      n: 26
    });
    dataManager.graphQlmeasures = [
      [
        {
          accountID: 2710112,
          type: 'TEST',
          value: {
            current: 'current',
            previous: 'previous'
          }
        },
        {
          query:
            "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
        },
        {
          measureType: 'touchpoint',
          touchpointRef: {
            status_on_off: false
          }
        }
      ]
    ];
    await dataManager.NRDBQuery();
  });

  it('Function NRDBQuery() with measure.type = test and value.nrql = null', async () => {
    dataManager.MakeLogingData = jest.fn();
    dataManager.EvaluateMeasures = jest.fn().mockReturnValue({
      data: {
        actor: {
          measure_0: {
            __typename: 'Account',
            id: 2710112,
            nrql: null
          }
        }
      },
      errors: [],
      n: 26
    });
    dataManager.graphQlmeasures = [
      [
        {
          accountID: 2710112,
          type: 'TEST',
          value: {
            current: 'current',
            previous: 'previous'
          }
        },
        {
          query:
            "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
        },
        {
          measureType: 'touchpoint',
          touchpointRef: {
            status_on_off: false
          }
        }
      ]
    ];
    await dataManager.NRDBQuery();
  });

  it('Function NRDBQuery() with measure.type = test and value.nrql = null and error', async () => {
    dataManager.MakeLogingData = jest.fn();
    dataManager.EvaluateMeasures = jest.fn().mockReturnValue({
      data: {
        actor: {
          measure_0: {
            __typename: 'Account',
            id: 2710112,
            nrql: null
          }
        }
      },
      errors: [{ error: 'error' }],
      n: 26
    });
    dataManager.graphQlmeasures = [
      [
        {
          accountID: 2710112,
          type: 'TEST',
          value: {
            current: 'current',
            previous: 'previous'
          }
        },
        {
          query:
            "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
        },
        {
          measureType: 'touchpoint',
          touchpointRef: {
            status_on_off: false
          }
        }
      ]
    ];
    await dataManager.NRDBQuery();
  });

  it('Function NRDBQuery() with measure.type not have type to match', async () => {
    dataManager.MakeLogingData = jest.fn();
    dataManager.EvaluateMeasures = jest.fn().mockReturnValue({
      data: {
        actor: {
          measure_0: {
            __typename: 'Account',
            id: 2710112,
            nrql: null
          }
        }
      },
      errors: [{ error: 'error' }],
      n: 26
    });
    dataManager.graphQlmeasures = [
      [
        {
          accountID: 2710112,
          type: 'Not_type',
          value: {
            current: 'current',
            previous: 'previous'
          }
        },
        {
          query:
            "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
        },
        {
          measureType: 'touchpoint',
          touchpointRef: {
            status_on_off: false
          }
        }
      ]
    ];
    await dataManager.NRDBQuery();
  });
});
