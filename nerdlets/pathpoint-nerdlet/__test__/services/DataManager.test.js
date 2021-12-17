import DataManager from '../../services/DataManager';
import appPackage from '../../../../package.json';
import {
  AccountStorageQuery,
  AccountsQuery,
  NerdGraphQuery,
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
  });

  it('Function BootstrapInitialData() with lastStorageVersion = appPackager.version', async () => {
    const accountName = 'WigiBoards';
    const version = appPackage.version;
    const data = [
      {
        _typename: 'NerdStorageVaultSecret',
        key: 'TEST',
        value: 'test123'
      },
      {
        _typename: 'NerdStorageVaultSecret',
        key: 'api_token',
        value: 'token'
      }
    ];
    const error = null;
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
    jest
      .spyOn(NerdGraphQuery, 'query')
      .mockImplementationOnce(() => Promise.resolve({ error, data }));
    dataManager.NerdStorageVault.getCredentialsData = await jest
      .fn()
      .mockReturnValue({
        actor: {
          nerdStorageVault: {
            secrets: {
              key: '123',
              value: 'test123'
            }
          }
        }
      });
    const result = await dataManager.BootstrapInitialData(accountName);
    expect(dataManager.lastStorageVersion).toEqual(version);
    expect(result.stages.length).toEqual(2);
    expect(result.accountIDs).toEqual([{ name: 'WigiBoards', id: 2710112 }]);
  });

  it('Fucntion BootstrapInitialData() with lastStorageVersion old', async () => {
    const accountName = 'WigiBoards';
    const data = [
      {
        _typename: 'NerdStorageVaultSecret',
        key: 'TEST',
        value: 'test123'
      },
      {
        _typename: 'NerdStorageVaultSecret',
        key: 'api_token',
        value: 'token'
      }
    ];
    const error = null;
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
    jest
      .spyOn(NerdGraphQuery, 'query')
      .mockImplementationOnce(() => Promise.resolve({ error, data }));
    dataManager.NerdStorageVault.getCredentialsData = await jest
      .fn()
      .mockReturnValue({
        actor: {
          nerdStorageVault: {
            secrets: [
              {
                key: '123',
                value: 'test123'
              }
            ]
          }
        }
      });
    const result = await dataManager.BootstrapInitialData(accountName);
    expect(dataManager.lastStorageVersion).toEqual('1.0.0');
    expect(result.stages.length).toEqual(5);
    expect(result.accountIDs).toEqual([{ name: 'WigiBoards', id: 2710112 }]);
  });

  it('Function TryToSetKeys() call LogConnector', async () => {
    const secrets = [
      {
        key: 'ingestLicense',
        value: 'TEST1233'
      }
    ];
    dataManager.ValidateIngestLicense = await jest.fn().mockReturnValue(true);
    dataManager.LogConnector.SetLicenseKey = jest.fn();
    dataManager.SynConnector.SetLicenseKey = jest.fn();
    await dataManager.TryToSetKeys(secrets);
    expect(dataManager.ValidateIngestLicense).toHaveBeenCalledTimes(1);
  });

  it('Function TryToSetKeys() call SynConnector', async () => {
    const secrets = [
      {
        key: 'userAPIKey',
        value: 'TEST1233'
      }
    ];
    dataManager.ValidateUserApiKey = await jest.fn().mockReturnValue(true);
    dataManager.SynConnector.SetUserApiKey = jest.fn();
    await dataManager.TryToSetKeys(secrets);
    expect(dataManager.ValidateUserApiKey).toHaveBeenCalledTimes(1);
  });

  it('Function TryToEnableServices() with loggin', () => {
    dataManager.generalConfiguration = { loggin: 'Correct loggin' };
    dataManager.LogConnector.EnableDisable = jest.fn();
    dataManager.TryToEnableServices();
    expect(dataManager.LogConnector.EnableDisable).toHaveBeenCalledTimes(1);
  });

  it('Function TryToEnableServices() with dropTools', () => {
    dataManager.generalConfiguration = { dropTools: 'DropTools' };
    dataManager.SynConnector.EnableDisableDrop = jest.fn();
    dataManager.TryToEnableServices();
    expect(dataManager.SynConnector.EnableDisableDrop).toHaveBeenCalledTimes(1);
  });

  it('Function TryToEnableServices() with flameTools', () => {
    dataManager.generalConfiguration = { flameTools: 'flameTools' };
    dataManager.SynConnector.EnableDisableFlame = jest.fn();
    dataManager.TryToEnableServices();
    expect(dataManager.SynConnector.EnableDisableFlame).toHaveBeenCalledTimes(
      1
    );
  });

  it('Function TryToEnableServices() with accountId', () => {
    dataManager.generalConfiguration = { accountId: 'accountId' };
    dataManager.SynConnector.SetAccountID = jest.fn();
    dataManager.TryToEnableServices();
    expect(dataManager.SynConnector.SetAccountID).toHaveBeenCalledTimes(1);
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
              "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='ap-southeast-2'",
            link: 'https://newrelic.one'
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
    dataManager.TouchPointsUpdate = jest.fn();
    dataManager.UpdateMerchatKpi = jest.fn();
    dataManager.CalculateUpdates = jest.fn();
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
      ],
      stages: false
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

  it('Function TouchPointsUpdate()', async () => {
    dataManager.stages = [
      {
        title: 'BROWSE'
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
    dataManager.RemoveGreySquare = jest.fn();
    dataManager.NRDBQuery = jest.fn();
    await dataManager.TouchPointsUpdate();
    expect(dataManager.FetchMeasure).toHaveBeenCalledTimes(1);
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
    expect(measurePRC).toEqual({
      type: 'PRC',
      session_count: 0
    });
    expect(measurePCC).toEqual({
      type: 'PCC',
      transaction_count: 0
    });
    expect(measureAPP).toEqual({
      type: 'APP',
      apdex_value: 1,
      error_percentage: 0,
      response_value: 0
    });
    expect(measureFRT).toEqual({
      type: 'FRT',
      apdex_value: 1,
      response_value: 0,
      error_percentage: 0
    });
    expect(measureSYN).toEqual({
      type: 'SYN',
      success_percentage: 0,
      max_duration: 0,
      max_request_time: 0
    });
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
    expect(dataManager.graphQlmeasures).toEqual([
      [
        {
          type: 'PRC',
          timeout: 10,
          query:
            "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
          min_count: 10,
          session_count: 0,
          measure_time: '15 minutes ago',
          accountID: 2710112
        },
        "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue' SINCE 15 minutes ago",
        'TIME 5 HOURS AGO'
      ]
    ]);
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
    expect(dataManager.graphQlmeasures).toEqual([
      [
        {
          type: 'WLD',
          timeout: 10,
          query:
            "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
          min_count: 10,
          session_count: 0,
          accountID: 2710112,
          status_value: 'NO-VALUE'
        },
        "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue' SINCE 3 HOURS AGO",
        'TIME 5 HOURS AGO'
      ]
    ]);
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
    expect(result1).toEqual('5 MINUTES AGO');
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
      stage_index: 1,
      touchpoint_index: 1,
      status_on_off: false
    };
    dataManager.stages = [
      {
        index: 1,
        touchpoints: [
          {
            index: 1,
            show_grey_square: false
          }
        ]
      }
    ];
    dataManager.DisableTouchpointByError(touchpoint);
    expect(dataManager.stages[0].touchpoints[0].show_grey_square).toEqual(true);
  });

  it('Function RemoveGreySquare()', () => {
    dataManager.stages = [
      {
        index: 1,
        touchpoints: [
          {
            show_grey_square: true
          }
        ]
      }
    ];
    dataManager.RemoveGreySquare();
    expect(dataManager.stages[0].touchpoints[0].show_grey_square).toEqual(
      false
    );
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
    const result = await dataManager.NRDBQuery();
    expect(result).toEqual(0);
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
    await dataManager.NRDBQuery();
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
    expect(dataManager.MakeLogingData).toHaveBeenCalledTimes(1);
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
    expect(dataManager.MakeLogingData).toHaveBeenCalledTimes(1);
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
    expect(dataManager.MakeLogingData).toHaveBeenCalledTimes(1);
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
    expect(dataManager.MakeLogingData).toHaveBeenCalledTimes(1);
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
    expect(dataManager.MakeLogingData).toHaveBeenCalledTimes(1);
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
    expect(dataManager.MakeLogingData).toHaveBeenCalledTimes(1);
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
    expect(dataManager.MakeLogingData).toHaveBeenCalledTimes(1);
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
    expect(dataManager.MakeLogingData).toHaveBeenCalledTimes(1);
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
    expect(dataManager.MakeLogingData).toHaveBeenCalledTimes(1);
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
    expect(dataManager.MakeLogingData).toHaveBeenCalledTimes(1);
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
    expect(dataManager.MakeLogingData).toHaveBeenCalledTimes(1);
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
    expect(dataManager.MakeLogingData).toHaveBeenCalledTimes(1);
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
    expect(dataManager.MakeLogingData).toHaveBeenCalledTimes(1);
  });

  it('Function NRDBQuery() with value = null', async () => {
    dataManager.MakeLogingData = jest.fn();
    dataManager.EvaluateMeasures = jest.fn().mockReturnValue({
      data: {
        actor: {
          measure_0: null
        }
      },
      errors: ['Network Error for value'],
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
    expect(dataManager.MakeLogingData).toHaveBeenCalledTimes(1);
  });

  it('Function NRDBQuery() with value = null and measure.type != TEST', async () => {
    dataManager.MakeLogingData = jest.fn();
    dataManager.EvaluateMeasures = jest.fn().mockReturnValue({
      data: {
        actor: {
          measure_0: null
        }
      },
      errors: [],
      n: 26
    });
    dataManager.graphQlmeasures = [
      [
        {
          accountID: 2710112,
          type: 'NO_TEST',
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
    expect(dataManager.MakeLogingData).toHaveBeenCalledTimes(1);
  });

  it('Function SetTouchpointResponseError()', () => {
    dataManager.stages = [
      {
        index: 0,
        title: 'BROWSE',
        touchpoints: [
          {
            index: 1,
            response_error: ''
          }
        ]
      }
    ];
    const touchpoint = {
      stage_index: 0,
      touchpoint_index: 1
    };
    const status = 'Response Error';
    dataManager.SetTouchpointResponseError(touchpoint, status);
    expect(dataManager.stages[0].touchpoints).toEqual([
      {
        index: 1,
        response_error: 'Response Error'
      }
    ]);
  });

  it('Function EvaluateMeasures()', async () => {
    dataManager.accountId = 2710112;
    dataManager.escapeQuote = jest.fn();
    dataManager.graphQlmeasures = [
      [
        {
          accountID: 2710112,
          type: 'Not_type',
          timeout: 235,
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
    const errorMessage = ['Network Error'];
    jest
      .spyOn(NerdGraphQuery, 'query')
      .mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));
    const result = await dataManager.EvaluateMeasures();
    expect(result.n).toEqual(1);
  });

  it('Function EvaluateMeasures() with data.actor', async () => {
    dataManager.accountId = 2710112;
    dataManager.escapeQuote = jest.fn();
    dataManager.graphQlmeasures = [
      [
        {
          accountID: 2710112,
          type: 'Not_type',
          timeout: 235,
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
    const data = {
      actor: 'new Actor'
    };
    const errorMessage = [];
    jest
      .spyOn(NerdGraphQuery, 'query')
      .mockImplementationOnce(() => Promise.resolve({ data, errorMessage }));
    const result = await dataManager.EvaluateMeasures();
    expect(result.n).toEqual(1);
  });
  it('Function EvaluateMeasures() with type = 101', async () => {
    dataManager.accountId = 2710112;
    dataManager.escapeQuote = jest.fn();
    dataManager.graphQlmeasures = [
      [
        {
          accountID: 2710112,
          type: 101,
          timeout: 235,
          queryByCity: [{ accountID: 2710112 }],
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
    const errorMessage = ['Network Error'];
    jest
      .spyOn(NerdGraphQuery, 'query')
      .mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));
    const result = await dataManager.EvaluateMeasures();
    expect(result.n).toEqual(1);
  });

  it('Function EvaluateMeasures() with pagination', async () => {
    dataManager.accountId = 2710112;
    dataManager.escapeQuote = jest.fn();
    const measures = [];
    for (let i = 0; i < 50; i++) {
      const objMesure = {
        type: 101,
        timeout: 235,
        accountID: 2710112,
        queryByCity: [{ accountID: 2710112 }],
        query: 'SIMPLE QUERY OF TYPE ONE'
      };
      measures.push(objMesure);
    }
    dataManager.timeRange = '5 MINUTES AGO';
    for (const measure of measures) {
      dataManager.FetchMeasure(measure);
    }
    const errorMessage = ['Network Error'];
    jest
      .spyOn(NerdGraphQuery, 'query')
      .mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));
    const result = await dataManager.EvaluateMeasures();
    expect(result.n).toEqual(50);
  });

  it('Function escapeQuote()', () => {
    const data =
      "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'";
    const result = dataManager.escapeQuote(data);
    expect(result).toEqual(
      "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
    );
  });

  it('Function UpdateMerchatKpi()', async () => {
    dataManager.kpis = [
      {
        check: true,
        index: 0,
        link: 'https://onenr.io/01qwL8KPxw5',
        name: 'Unique Visitors',
        type: 'kpi_visitor',
        queryByCity: [
          { query: 'SELECT * FROM Logs', link: 'https://onenr.io/01qwL8KPxw5' }
        ]
      }
    ];
    dataManager.timeRangeKpi = {
      range: '24 HOURS AGO'
    };
    dataManager.NRDBQuery = jest.fn();
    dataManager.UpdateMerchatKpi();
    expect(dataManager.graphQlmeasures).toEqual([
      [
        {
          check: true,
          index: 0,
          link: 'https://onenr.io/01qwL8KPxw5',
          name: 'Unique Visitors',
          type: 'kpi_visitor',
          queryByCity: [
            {
              link: 'https://onenr.io/01qwL8KPxw5',
              query: 'SELECT * FROM Logs'
            }
          ]
        },
        'SELECT * FROM Logs SINCE 24 HOURS AGO',
        {
          measureType: 'kpi',
          kpiName: 'Unique Visitors',
          kpiType: 'kpi_visitor'
        }
      ]
    ]);
  });

  it('Function CalculateUpdates()', () => {
    dataManager.ClearTouchpointError = jest.fn();
    dataManager.CountryCalculateUpdates = jest.fn();
    dataManager.CalculateUpdates();
  });

  it('Function ClearTouchpointError()', () => {
    dataManager.stages = [
      {
        index: 0,
        title: 'BROWSE',
        touchpoints: [
          {
            index: 1,
            response_error: '',
            error: true
          }
        ],
        steps: [
          {
            sub_steps: [
              {
                error: true
              }
            ]
          }
        ]
      }
    ];
    dataManager.ClearTouchpointError();
    expect(dataManager.stages[0].steps[0].sub_steps[0].error).toEqual(false);
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
            {
              measure: 'PRC'
            }
          ]
        }
      ]
    };
    dataManager.Getmeasures = jest.fn().mockImplementation(() => {
      return {
        count_by_stage: [
          {
            total_count: 0,
            traffic_type: 'traffic',
            capacity_status: 0,
            capacity_link: 'https://newrelic.one',
            total_steps: 1,
            num_steps_over_average: 4
          }
        ]
      };
    });
    dataManager.UpdateErrorCondition = jest.fn();
    dataManager.UpdateMaxCongestionSteps = jest.fn();
    dataManager.stages = [
      {
        index: 1,
        title: 'BROWSE',
        status_color: 'bad',
        total_count: 0,
        trafficIconType: 'people',
        capacity: 0,
        capacity_link: '',
        congestion: {
          value: 0,
          percentage: 15
        }
      }
    ];
    dataManager.CountryCalculateUpdates(element);
    expect(dataManager.stages[0].congestion).toEqual({
      value: 0,
      percentage: 0
    });
  });

  it('Function Getmeasures()', () => {
    dataManager.city = 0;
    dataManager.stages = [
      {
        index: 1,
        title: 'BROWSE',
        percentage_above_avg: -1,
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
            {
              type: 'PRC',
              query:
                "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
              min_count: 10,
              session_count: 20,
              accountID: 2904070,
              measure_time: '15 minutes ago'
            },
            {
              type: 'PCC',
              query:
                "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
              min_count: 10,
              transaction_count: 20,
              accountID: 2904070,
              measure_time: '15 minutes ago'
            },
            {
              type: 'WLD',
              query:
                "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
              status_value: true
            }
          ]
        }
      ]
    };
    const result = dataManager.Getmeasures(element);
    expect(result).toEqual({
      count_by_stage: [
        {
          capacity_link: '',
          capacity_status: true,
          num_touchpoints: 2,
          steps_indexes: [],
          steps_max_cong: [],
          total_congestion: 0,
          total_count: 40,
          traffic_type: 'traffic'
        }
      ]
    });
  });

  it('Funtion GetWokloadTouchpointLink()', () => {
    const touchpoint = {
      stage_index: 1,
      touchpoint_index: 0
    };
    dataManager.stages = [
      {
        index: 1,
        title: 'BROWSE',
        percentage_above_avg: -1,
        congestion: {
          value: 0,
          percentage: 15
        },
        steps: [],
        touchpoints: [
          { stage_index: 1, index: 0, dashboard_url: ['https://newrelic.one'] }
        ]
      }
    ];
    const result = dataManager.GetWokloadTouchpointLink(touchpoint);
    expect(result).toEqual('https://newrelic.one');
  });

  it('Function UpdateMaxCongestionSteps()', () => {
    const count_by_stage = [{ steps_max_cong: [1] }];
    dataManager.stages = [
      {
        index: 1,
        title: 'BROWSE',
        percentage_above_avg: -1,
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
                latency: true,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [{ error: true, stage_index: 1 }]
      }
    ];
    dataManager.UpdateMaxCongestionSteps(count_by_stage);
    expect(dataManager.stages[0].steps[0].sub_steps[0].latency).toEqual(true);
  });

  it('Function UpdateErrorCondition()', () => {
    const actual1 = 'danger';
    const nextvalue1 = 'danger';
    const actual2 = 'warning';
    const nextvalue2 = 'warning';

    expect(dataManager.UpdateErrorCondition(actual1, null)).toEqual('danger');
    expect(dataManager.UpdateErrorCondition(null, nextvalue1)).toEqual(
      'danger'
    );
    expect(dataManager.UpdateErrorCondition(actual2, null)).toEqual('warning');
    expect(dataManager.UpdateErrorCondition(null, nextvalue2)).toEqual(
      'warning'
    );
    expect(dataManager.UpdateErrorCondition('succes', null)).toEqual('succes');
  });

  it('Function GetStageError() with measure.type = PRC and porcentage >= 0.5', () => {
    const stage = 1;
    const element = {
      index: 0,
      touchpoints: [
        {
          stage_index: 1,
          touchpoint_index: 2,
          status_on_off: true,
          measure_points: [
            {
              type: 'PRC',
              min_count: 10,
              session_count: 0
            }
          ],
          relation_steps: [1]
        }
      ]
    };
    dataManager.stepsByStage = [1];
    dataManager.SetTouchpointError = jest.fn();
    dataManager.GetTotalStepsWithError = jest.fn().mockReturnValue(1);
    const result = dataManager.GetStageError(stage, element);
    expect(result).toEqual('danger');
  });

  it('Function GetStageError() with measure.type = PCC and porcentage >= 0.15', () => {
    const stage = 1;
    const element = {
      index: 0,
      touchpoints: [
        {
          stage_index: 1,
          touchpoint_index: 2,
          status_on_off: true,
          measure_points: [
            {
              type: 'PCC',
              min_count: 10,
              transaction_count: 0
            }
          ],
          relation_steps: [1]
        }
      ]
    };
    dataManager.stepsByStage = [1];
    dataManager.SetTouchpointError = jest.fn();
    dataManager.GetTotalStepsWithError = jest.fn().mockReturnValue(0.16);
    const result = dataManager.GetStageError(stage, element);
    expect(result).toEqual('warning');
  });

  it('Function GetStageError() with measure.type = FRT and porcentage < 0.15', () => {
    const stage = 1;
    const element = {
      index: 0,
      touchpoints: [
        {
          stage_index: 1,
          touchpoint_index: 2,
          status_on_off: true,
          measure_points: [
            {
              type: 'FRT',
              response_value: 10,
              max_response_time: 0
            }
          ],
          relation_steps: [1]
        }
      ]
    };
    dataManager.stepsByStage = [1];
    dataManager.SetTouchpointError = jest.fn();
    dataManager.GetTotalStepsWithError = jest.fn().mockReturnValue(0.07);
    const result = dataManager.GetStageError(stage, element);
    expect(result).toEqual('good');
  });

  it('Function GetStageError() with measure.type = SYN', () => {
    const stage = 1;
    const element = {
      index: 0,
      touchpoints: [
        {
          stage_index: 1,
          touchpoint_index: 2,
          status_on_off: true,
          measure_points: [
            {
              type: 'SYN',
              max_duration: 10,
              max_total_check_time: 0
            }
          ],
          relation_steps: [1]
        }
      ]
    };
    dataManager.stepsByStage = [1];
    dataManager.SetTouchpointError = jest.fn();
    dataManager.GetTotalStepsWithError = jest.fn().mockReturnValue(0.07);
    const result = dataManager.GetStageError(stage, element);
    expect(result).toEqual('good');
  });

  it('Function GetStageError() with count_touchpoints = 0', () => {
    const stage = 1;
    const element = {
      index: 0,
      touchpoints: [
        {
          stage_index: 3,
          touchpoint_index: 2,
          measure_points: [
            {
              type: 'SYN',
              max_duration: 10,
              max_total_check_time: 0
            }
          ],
          relation_steps: [1]
        }
      ]
    };
    dataManager.stepsByStage = [1];
    dataManager.SetTouchpointError = jest.fn();
    dataManager.GetTotalStepsWithError = jest.fn().mockReturnValue(0.07);
    const result = dataManager.GetStageError(stage, element);
    expect(result).toEqual('good');
  });

  it('Function SetTouchpointError()', () => {
    const stage_index = 1;
    const touchpoint_index = 1;
    dataManager.stages = [
      {
        touchpoints: [
          {
            index: 1,
            response_error: null
          }
        ],
        steps: [
          {
            sub_steps: [
              {
                relationship_touchpoints: [1],
                error: false
              }
            ]
          }
        ]
      }
    ];
    dataManager.CheckIfTouchpointIsResponding = jest.fn().mockReturnValue(true);
    dataManager.SetTouchpointError(stage_index, touchpoint_index);
  });

  it('Function CheckIfTouchpointIsResponding()', () => {
    const stage_index = 1;
    const touchpoint_index = 1;
    dataManager.stages = [
      {
        touchpoints: [
          {
            index: 1,
            response_error: false
          }
        ],
        steps: []
      }
    ];
    const result = dataManager.CheckIfTouchpointIsResponding(
      stage_index,
      touchpoint_index
    );
    expect(result).toEqual(true);
  });

  it('Function GetTotalStepsWithError()', () => {
    const steps_with_error = [1, 2, 3];
    expect(dataManager.GetTotalStepsWithError(steps_with_error)).toEqual(6);
  });

  it('Function LoadCanaryData()', () => {
    dataManager.dataCanary = [
      {
        stage_index: 1,
        stage_title: 'Stage1',
        states: [false, false, false]
      }
    ];
    expect(dataManager.LoadCanaryData()).toEqual([
      {
        stage_index: 1,
        stage_title: 'Stage1',
        states: [false, false, false]
      }
    ]);
  });

  it('Function SetCanaryData()', () => {
    const stages = [
      {
        touchpoints: [
          {
            index: 1,
            response_error: null
          }
        ],
        steps: [
          {
            sub_steps: [
              {
                relationship_touchpoints: [1],
                error: false
              }
            ]
          }
        ]
      }
    ];
    const city = 0;
    dataManager.OffAllTouchpoints = jest.fn();
    dataManager.EnableCanaryTouchPoints = jest.fn();
    dataManager.SetTouchpointsStatus = jest.fn();
    expect(dataManager.SetCanaryData(stages, city)).toEqual({
      stages: [
        {
          steps: [
            { sub_steps: [{ error: false, relationship_touchpoints: [1] }] }
          ],
          touchpoints: [{ index: 1, response_error: null }]
        }
      ]
    });
  });

  it('Function OffAllTouchpoints()', () => {
    dataManager.city = 0;
    dataManager.OffAllTouchpoints();
    expect(dataManager.touchPoints[0].touchpoints[0].status_on_off).toEqual(
      false
    );
  });

  it('Function EnableCanaryTouchPoints()', () => {
    dataManager.stages = [
      {
        touchpoints: [
          {
            index: 1,
            response_error: null
          }
        ],
        steps: [
          {
            sub_steps: [
              {
                relationship_touchpoints: [1],
                error: false,
                canary_state: true
              }
            ]
          }
        ]
      }
    ];
    dataManager.EnableTouchpoint = jest.fn();
    dataManager.EnableCanaryTouchPoints();
  });

  it('Function EnableTouchpoint()', () => {
    const stage_index = 1;
    const touchpoint_index = 1;
    dataManager.EnableTouchpoint(stage_index, touchpoint_index);
    expect(dataManager.touchPoints[0].touchpoints[0].status_on_off).toEqual(
      true
    );
  });

  it('Function SetTouchpointsStatus()', () => {
    dataManager.UpdateTouchpointStatus = jest.fn();
    dataManager.SetTouchpointsStatus();
  });

  it('Function UpdateTouchpointStatus()', () => {
    const touchpoint = {
      stage_index: 1,
      touchpoint_index: 1,
      status_on_off: true
    };
    dataManager.stages = [
      {
        index: 1,
        touchpoints: [
          {
            index: 1,
            response_error: null,
            status_on_off: false
          }
        ]
      }
    ];
    dataManager.UpdateTouchpointStatus(touchpoint);
    expect(dataManager.stages[0].touchpoints[0].status_on_off).toEqual(true);
  });

  it('Function ClearCanaryData()', () => {
    const stages = [
      {
        index: 1,
        touchpoints: [
          {
            index: 1,
            response_error: null,
            status_on_off: false
          }
        ]
      }
    ];
    dataManager.touchPointsCopy = {
      stage_index: 1,
      touchpoint_index: 1,
      status_on_off: true
    };
    dataManager.SetTouchpointsStatus = jest.fn();
    const result = dataManager.ClearCanaryData(stages);
    expect(result).toEqual({
      stages: [
        {
          index: 1,
          touchpoints: [
            {
              index: 1,
              response_error: null,
              status_on_off: false
            }
          ]
        }
      ]
    });
  });

  it('Function SetStorageTouchpoints() with cath', async () => {
    jest
      .spyOn(AccountStorageMutation, 'mutate')
      .mockRejectedValue(Error('error'));
    await expect(dataManager.SetStorageTouchpoints()).rejects.toThrow('error');
  });

  it('Function GetMinPercentageError()', () => {
    dataManager.touchPoints = [
      {
        index: 0,
        touchpoints: [
          {
            index: 1,
            measure_points: [
              {
                type: 20,
                error_threshold: 7.21,
                minPercentageError: 9.83
              }
            ]
          }
        ]
      }
    ];
    dataManager.GetMinPercentageError();
    expect(dataManager.minPercentageError).toEqual(7.21);
  });

  it('Function GetStorageTouchpoints()', async () => {
    jest.spyOn(AccountStorageQuery, 'query').mockImplementationOnce(() => {
      return {
        data: {
          TouchPoints: [
            {
              index: 0,
              touchpoints: [
                {
                  stage_index: 1,
                  touchpoint_index: 1,
                  status_on_off: false
                }
              ]
            }
          ]
        }
      };
    });
    dataManager.GetMinPercentageError = jest.fn();
    dataManager.GetMinPercentageError = jest.fn();
    await dataManager.GetStorageTouchpoints();
    expect(dataManager.touchPoints).toEqual([
      {
        index: 0,
        touchpoints: [
          { stage_index: 1, status_on_off: false, touchpoint_index: 1 }
        ]
      }
    ]);
  });

  it('Function GetStorageTouchpoints() with catch', async () => {
    jest.spyOn(AccountStorageQuery, 'query').mockRejectedValue(Error('error'));
    await expect(dataManager.GetStorageTouchpoints()).rejects.toThrow('error');
  });

  it('Function UpdateCanaryData()', () => {
    const data = {
      pathpoint: 'pathpoint',
      accountId: 2710112
    };
    dataManager.SaveCanaryData = jest.fn();
    dataManager.UpdateCanaryData(data);
    expect(dataManager.SaveCanaryData).toHaveBeenCalledTimes(1);
  });

  it('Function GetCurrentConfigurationJSON()', () => {
    dataManager.ReadPathpointConfig = jest.fn();
    dataManager.configuration = {
      pathpointVersion: '1.52.1',
      kpis: [
        {
          index: 1
        }
      ],
      stages: [
        {
          index: 1
        }
      ]
    };
    const aux = {
      pathpointVersion: '1.52.1',
      kpis: [
        {
          index: 1
        }
      ],
      stages: [
        {
          index: 1
        }
      ]
    };
    const result = dataManager.GetCurrentConfigurationJSON();
    expect(result).toEqual(JSON.stringify(aux, null, 4));
  });

  it('Function ReadPathpointConfig()', () => {
    dataManager.accountId = 2710112;
    dataManager.version = '1.5.14';
    dataManager.kpis = [
      {
        type: 'PRC',
        check: true,
        index: 0,
        link: 'https://onenr.io/01qwL8KPxw5',
        name: 'Unique Visitors',
        prefix: '$',
        suffix: '',
        queryByCity: [
          {
            accountID: 2710112,
            link: 'https://onenr.io/01qwL8KPxw5',
            query: 'SELECT * FROM Logs'
          }
        ],
        shortName: 'Unique',
        value_type: 'FLOAT'
      }
    ];
    dataManager.stages = [
      {
        title: 'BROWSE',
        active_dotted: 'none',
        arrowMode: 'FLOW',
        percentage_above_avg: 20,
        touchpoints: [
          {
            index: 1,
            stage_index: 1,
            value: 'touchPoint-Web',
            status_on_off: false,
            dashboard_url: 'https://newrelic.one',
            response_error: false
          }
        ],
        steps: [
          {
            sub_steps: [
              {
                value: 'Web',
                id: 'ST1-LINE1-SS1'
              }
            ]
          }
        ]
      }
    ];
    dataManager.GetRelatedSteps = jest.fn();
    dataManager.GetTouchpointQueryes = jest.fn();
    dataManager.ReadPathpointConfig();
    expect(dataManager.configuration.pathpointVersion).toEqual('1.5.14');
  });

  it('Function GetRelatedSteps()', () => {
    const stage_index = 1;
    const index = 1;
    dataManager.GetStepsIds = jest.fn().mockReturnValue('ST1-LINE1-SS1');
    const result = dataManager.GetRelatedSteps(stage_index, index);
    expect(result).toEqual('ST1-LINE1-SS1');
  });

  it('Function GetStepsIds()', () => {
    const stage_index = 1;
    const related_steps = [1, 2];
    dataManager.stages = [
      {
        steps: [
          {
            sub_steps: [
              {
                index: 1,
                id: 'ST1-LINE1-SS1'
              },
              {
                index: 2,
                id: 'ST1-LINE1-SS2'
              }
            ]
          }
        ]
      }
    ];
    expect(dataManager.GetStepsIds(stage_index, related_steps)).toEqual(
      'ST1-LINE1-SS1,ST1-LINE1-SS2'
    );
  });

  it('Function GetTouchpointQueryes() with measure_type = PRC', () => {
    const stage_index = 1;
    const index = 1;
    dataManager.accountId = 2710112;
    dataManager.TimeRangeTransform = jest.fn().mockReturnValue('5 MINUTES AGO');
    dataManager.touchPoints = [
      {
        index: 0,
        touchpoints: [
          {
            stage_index: 1,
            touchpoint_index: 1,
            measure_points: [
              {
                measure_time: '15 minutes ago',
                accountID: 7777777,
                timeout: 10,
                type: 'PRC',
                query:
                  "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
                min_count: 10
              }
            ]
          }
        ]
      }
    ];
    const result = dataManager.GetTouchpointQueryes(stage_index, index);
    expect(result).toEqual([
      {
        type: 'PRC-COUNT-QUERY',
        accountID: 7777777,
        query:
          "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
        query_timeout: 10,
        min_count: 10,
        measure_time: '15 minutes ago'
      }
    ]);
  });

  it('Function GetTouchpointQueryes() with measure_type = WLD', () => {
    const stage_index = 1;
    const index = 1;
    dataManager.accountId = 2710112;
    dataManager.TimeRangeTransform = jest.fn().mockReturnValue('5 MINUTES AGO');
    dataManager.touchPoints = [
      {
        index: 0,
        touchpoints: [
          {
            stage_index: 1,
            touchpoint_index: 1,
            measure_points: [
              {
                measure_time: '15 minutes ago',
                accountID: 7777777,
                timeout: 10,
                type: 'PCC',
                query:
                  "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
                min_count: 10
              },
              {
                measure_time: '15 minutes ago',
                accountID: 7777777,
                min_apdex: 0.5,
                max_response_time: 0.3,
                max_error_percentage: 0.7,
                type: 'APP',
                query:
                  "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
              },
              {
                measure_time: '15 minutes ago',
                accountID: 7777777,
                type: 'FRT',
                query:
                  "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
                min_apdex: 0.5,
                max_response_time: 0.3,
                max_error_percentage: 0.7
              },
              {
                measure_time: '15 minutes ago',
                accountID: 7777777,
                timeout: 10,
                type: 'SYN',
                query:
                  "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
                max_avg_response_time: 0.9,
                max_total_check_time: 20,
                min_success_percentage: 25
              },
              {
                measure_time: '15 minutes ago',
                accountID: 7777777,
                timeout: 10,
                type: 'WLD',
                query:
                  "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
              }
            ]
          }
        ]
      }
    ];
    const result = dataManager.GetTouchpointQueryes(stage_index, index);
    expect(result[0]).toEqual({
      type: 'PCC-COUNT-QUERY',
      accountID: 7777777,
      query:
        "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
      query_timeout: 10,
      min_count: 10,
      measure_time: '15 minutes ago'
    });
  });

  it('Function SetConfigurationJSON()', () => {
    const configuration = {
      accountId: 2710112,
      pathpointVersion: '1.52.1'
    };
    dataManager.kpis = [
      {
        name: 'Unique Visitors',
        shortName: 'Unique'
      }
    ];
    dataManager.stages = [
      {
        index: 1,
        title: 'BROWSE'
      }
    ];
    dataManager.UpdateNewConfiguration = jest.fn();
    dataManager.AddCustomAccountIDs = jest.fn();
    dataManager.SendToLogs = jest.fn();
    const result = dataManager.SetConfigurationJSON(
      JSON.stringify(configuration)
    );
    expect(result).toEqual({
      stages: [{ index: 1, title: 'BROWSE' }],
      kpis: [{ name: 'Unique Visitors', shortName: 'Unique' }]
    });
  });

  it('Function UpdateNewConfiguration()', () => {
    dataManager.accountId = 2710112;
    dataManager.TimeRangeTransform = jest.fn().mockReturnValue('5 MINUTES AGO');
    dataManager.UpdateTouchpointsRelationship = jest.fn();
    dataManager.SetInitialDataViewToStorage = jest.fn();
    dataManager.SetInitialDataTouchpointsToStorage = jest.fn();
    dataManager.UpdateTouchpointCopy = jest.fn();
    dataManager.configurationJSON = {
      kpis: [
        {
          type: 101,
          name: 'Unique Visitors',
          shortName: 'Unique',
          value_type: 'FLOAT',
          prefix: '$',
          suffix: '',
          measure: [
            {
              accountID: 2710112,
              query:
                'SELECT count(*) as value  FROM  Public_APICall COMPARE WITH 2 day ago',
              link: 'https://onenr.io/01qwL8KPxw5'
            }
          ]
        },
        {
          type: 100,
          name: 'Unique Visitors',
          shortName: 'Unique',
          value_type: 'FLOAT',
          prefix: '$',
          suffix: '',
          measure: [
            {
              accountID: 777777,
              query:
                'SELECT count(*) as value  FROM  Public_APICall COMPARE WITH 2 day ago',
              link: 'https://onenr.io/01qwL8KPxw5'
            }
          ]
        }
      ],
      stages: [
        {
          stage: 'BROWSE',
          active_dotted: 'none',
          arrowMode: 'FLOW',
          percentage_above_avg: 20,
          steps: [
            {
              value: '',
              values: [
                {
                  id: 1,
                  title: 'BROWSE'
                }
              ]
            }
          ],
          touchpoints: [
            {
              status_on_off: true,
              title: 'BROWSE',
              dashboard_url: 'htpps://dashboard.com',
              related_steps: '1,2,3',
              queries: [
                {
                  accountID: 2713654,
                  query_timeout: true
                },
                {
                  accountID: 2713654,
                  type: 'PRC-COUNT-QUERY',
                  min_count: 10,
                  session_count: 0,
                  measure_time: 12,
                  query: 'SIMPLE COUNT-QUERY'
                },
                {
                  accountID: 2713654,
                  type: 'PCC-COUNT-QUERY',
                  min_count: 10,
                  session_count: 0,
                  measure_time: 12,
                  query: 'SIMPLE COUNT-QUERY'
                },
                {
                  accountID: 2713654,
                  type: 'APP-HEALTH-QUERY',
                  min_count: 10,
                  session_count: 0,
                  measure_time: 12,
                  query: 'SIMPLE COUNT-QUERY'
                },
                {
                  accountID: 2713654,
                  type: 'FRT-HEALTH-QUERY',
                  min_count: 10,
                  session_count: 0,
                  measure_time: 12,
                  query: 'SIMPLE COUNT-QUERY'
                },
                {
                  accountID: 2713654,
                  type: 'SYN-CHECK-QUERY',
                  min_count: 10,
                  session_count: 0,
                  measure_time: 12,
                  query: 'SIMPLE COUNT-QUERY'
                },
                {
                  accountID: 2713654,
                  type: 'WORKLOAD-QUERY',
                  min_count: 10,
                  session_count: 0,
                  measure_time: 12,
                  query: 'SIMPLE COUNT-QUERY'
                }
              ]
            }
          ]
        }
      ]
    };
    dataManager.UpdateNewConfiguration();
    expect(dataManager.stages[0].touchpoints[0].relation_steps).toEqual([
      '1',
      '2',
      '3'
    ]);
  });

  it('Function UpdateTouchpointsRelationship()', () => {
    dataManager.touchPoints = [
      {
        stage_index: 1,
        value: 'Orders API (PRC)',
        touchpoints: [
          {
            stage_index: 1,
            relation_steps: [1, 2, 3]
          }
        ]
      }
    ];
    dataManager.stages = [
      {
        touchpoints: [
          {
            stage_index: 1,
            relation_steps: [1, 2, 3]
          }
        ]
      }
    ];
    dataManager.GetIndexStep = jest.fn().mockReturnValue(7);
    dataManager.SetStepsRelationship = jest.fn();
    dataManager.UpdateTouchpointsRelationship();
  });

  it('Function GetIndexStep()', () => {
    const stage_index = 1;
    const stepId = 123;
    dataManager.stages = [
      {
        steps: [
          {
            sub_steps: [
              {
                id: 123,
                index: 7
              }
            ]
          }
        ]
      }
    ];
    expect(dataManager.GetIndexStep(stage_index, stepId)).toEqual(7);
  });

  it('Function SetStepsRelationship()', () => {
    const stage_index = 1;
    const touchpoint_index = 8;
    const indexList = [1];
    dataManager.stages = [
      {
        steps: [
          {
            sub_steps: [
              {
                id: 123,
                index: 1,
                relationship_touchpoints: [1]
              }
            ]
          }
        ]
      }
    ];
    dataManager.SetStepsRelationship(stage_index, indexList, touchpoint_index);
    expect(
      dataManager.stages[0].steps[0].sub_steps[0].relationship_touchpoints
    ).toEqual([1, 8]);
  });

  it('Function UpdateTouchpointCopy()', () => {
    dataManager.touchPoints = [
      {
        stage_index: 1,
        value: 'Orders API (PRC)',
        touchpoints: [
          {
            stage_index: 1,
            relation_steps: [1, 2, 3]
          }
        ]
      }
    ];
    dataManager.UpdateTouchpointCopy(
      JSON.stringify(dataManager.touchPoints, null, 4)
    );
    expect(dataManager.touchPointsCopy).toEqual([
      {
        stage_index: 1,
        value: 'Orders API (PRC)',
        touchpoints: [
          {
            stage_index: 1,
            relation_steps: [1, 2, 3]
          }
        ]
      }
    ]);
  });

  it('Function GetCurrentHistoricErrorScript()', () => {
    dataManager.pathpointId = '7d86cabe-5130-48ba-b2f8-ff9e9a395f66';
    dataManager.CreateNrqlQueriesForHistoricErrorScript = jest.fn();
    const result = dataManager.GetCurrentHistoricErrorScript();
    expect(result).toBeTruthy();
  });

  it('Function CalculateHistoricErrors()', () => {
    const nrql = {
      results: [
        {
          facet: [1, 1],
          count: 88
        },
        {
          facet: [1, 2],
          count: 100
        },
        {
          facet: [2, 1],
          count: 50
        }
      ]
    };
    dataManager.SetTouchpointHistoricError = jest.fn();
    dataManager.ClearTouchpointHistoricError = jest.fn();
    dataManager.historicErrorsHighLightPercentage = 100;
    dataManager.CalculateHistoricErrors(nrql);
    expect(dataManager.SetTouchpointHistoricError).toHaveBeenCalledTimes(3);
  });

  it('Function SetTouchpointHistoricError()', () => {
    const stage_index = 1;
    const touchpoint_index = 1;
    dataManager.stages = [
      {
        index: 1,
        touchpoints: [
          {
            index: 1,
            history_error: false
          }
        ]
      }
    ];
    dataManager.SetTouchpointHistoricError(stage_index, touchpoint_index);
    expect(dataManager.stages[0].touchpoints[0].history_error).toEqual(true);
  });

  it('Function ClearTouchpointHistoricError()', () => {
    dataManager.stages = [
      {
        touchpoints: [
          {
            history_error: true
          }
        ]
      }
    ];
    dataManager.ClearTouchpointHistoricError();
    expect(dataManager.stages[0].touchpoints[0].history_error).toEqual(false);
  });

  it('Function InserTouchpointsToScript() with type = PRC and PCC', () => {
    dataManager.touchPoints = [
      {
        index: 0,
        stage_index: 1,
        touchpoint_index: 1,
        touchpoints: [
          {
            status_on_off: true,
            measure_points: [
              {
                type: 'PRC',
                timeout: 10,
                query: 'SELECT * FROM Transaction',
                measure_time: 0.36,
                min_count: 0.12
              },
              {
                type: 'PCC',
                timeout: 10,
                query: 'SELECT * FROM Transaction',
                measure_time: 0.36,
                min_count: 0.12
              }
            ]
          }
        ]
      }
    ];
    const result = dataManager.InserTouchpointsToScript();
    expect(result).toBeTruthy();
  });

  it('Function InserTouchpointsToScript() with type APP and FRT', () => {
    dataManager.touchPoints = [
      {
        index: 0,
        stage_index: 1,
        touchpoint_index: 1,
        touchpoints: [
          {
            status_on_off: true,
            measure_points: [
              {
                type: 'APP',
                timeout: 10,
                query: 'SELECT * FROM Transaction',
                measure_time: 0.36,
                min_apdex: 0.12,
                max_response_time: 12.6,
                max_error_percentage: 24
              },
              {
                type: 'FRT',
                timeout: 10,
                query: 'SELECT * FROM Transaction',
                measure_time: 0.36,
                min_apdex: 0.12,
                max_response_time: 12.6,
                max_error_percentage: 24
              }
            ]
          }
        ]
      }
    ];
    const result = dataManager.InserTouchpointsToScript();
    expect(result).toBeTruthy();
  });

  it('Function InserTouchpointsToScript() with type = SYN', () => {
    dataManager.touchPoints = [
      {
        index: 0,
        stage_index: 1,
        touchpoint_index: 1,
        touchpoints: [
          {
            status_on_off: true,
            measure_points: [
              {
                type: 'SYN',
                timeout: 10,
                query: 'SELECT * FROM Transaction',
                measure_time: 0.36,
                max_avg_response_time: 12.3,
                max_total_check_time: 24.6,
                min_success_percentage: 0.3
              }
            ]
          }
        ]
      }
    ];
    const result = dataManager.InserTouchpointsToScript();
    expect(result).toBeTruthy();
  });

  it('Function UpdateTouchpointOnOff()', () => {
    const touchpoint = {
      index: 1,
      stage_index: 1,
      value: 'ORDER COUNTS',
      status_on_off: true
    };
    const updateStorage = true;
    dataManager.stages = [
      {
        title: 'BROWSE'
      }
    ];
    dataManager.touchPoints = [
      {
        index: 0,
        value: 'Orders API (PRC)',
        touchpoints: [
          {
            stage_index: 1,
            touchpoint_index: 1,
            measure_points: [
              {
                type: 101
              }
            ]
          }
        ]
      }
    ];
    dataManager.SetStorageTouchpoints = jest.fn();
    dataManager.SendToLogs = jest.fn();
    dataManager.UpdateTouchpointOnOff(touchpoint, updateStorage);
    expect(dataManager.SetStorageTouchpoints).toHaveBeenCalledTimes(1);
  });

  it('Function GetTouchpointTune()', () => {
    const touchpoint = {
      index: 1,
      stage_index: 1
    };
    dataManager.touchPoints = [
      {
        index: 0,
        value: 'Orders API (PRC)',
        touchpoints: [
          {
            stage_index: 1,
            touchpoint_index: 1,
            measure_points: [
              {
                type: 101
              }
            ]
          }
        ]
      }
    ];
    expect(dataManager.GetTouchpointTune(touchpoint)).toEqual([{ type: 101 }]);
  });

  it('Function GetTouchpointQuerys()', () => {
    const touchpoint = {
      index: 1,
      stage_index: 1
    };
    dataManager.ValidateMeasureTime = jest
      .fn()
      .mockReturnValue('5 MINUTES AGO');
    dataManager.touchPoints = [
      {
        index: 0,
        value: 'Orders API (PRC)',
        touchpoints: [
          {
            stage_index: 1,
            touchpoint_index: 1,
            measure_points: [
              {
                accountID: 2710112
              },
              {
                type: 'PRC',
                query: 'SELECT * FROM Transactions',
                timeout: 10
              },
              {
                type: 'PCC',
                query: 'SELECT * FROM Transactions',
                timeout: 10
              },
              {
                type: 'APP',
                query: 'SELECT * FROM Transactions',
                timeout: 10
              },
              {
                type: 'FRT',
                query: 'SELECT * FROM Transactions',
                timeout: 10
              },
              {
                type: 'SYN',
                query: 'SELECT * FROM Transactions',
                timeout: 10
              },
              {
                type: 'WLD',
                query: 'SELECT * FROM Transactions',
                timeout: 10
              }
            ]
          }
        ]
      }
    ];
    const result = dataManager.GetTouchpointQuerys(touchpoint);
    expect(result.length).toEqual(6);
  });

  it('Function ValidateMeasureTime()', () => {
    const measure = {
      measure_time: '5 MINUTES AGO'
    };
    expect(dataManager.ValidateMeasureTime(measure)).toEqual(
      'SINCE 5 MINUTES AGO'
    );
  });

  it('Function ValidateMeasureTime() without measure_time', () => {
    const measure = {
      measure_time: false
    };
    dataManager.TimeRangeTransform = jest
      .fn()
      .mockReturnValue('30 MINUTES AGO');
    expect(dataManager.ValidateMeasureTime(measure)).toEqual(
      'SINCE 30 MINUTES AGO'
    );
  });

  it('Fucntion UpdateTouchpointTune() with type = PRC and PCC', () => {
    const touchpoint = {
      index: 1,
      stage_index: 1,
      value: 'ORDER COUNTS',
      status_on_off: true
    };
    const datos = {
      min_count: 0.1,
      min_apdex: 0.3,
      max_response_time: 7.32,
      max_error_percentage: 62,
      max_avg_response_time: 13.5,
      max_total_check_time: 52.3,
      min_success_percentage: 4
    };
    dataManager.SetStorageTouchpoints = jest.fn();
    dataManager.SendToLogs = jest.fn();
    dataManager.stages = [
      {
        title: 'BROWSE'
      }
    ];
    dataManager.touchPoints = [
      {
        index: 0,
        value: 'Orders API (PRC)',
        touchpoints: [
          {
            stage_index: 1,
            touchpoint_index: 1,
            measure_points: [
              {
                stage_index: 1,
                type: 'PRC'
              },
              {
                stage_index: 1,
                type: 'PCC'
              },
              {
                stage_index: 1,
                type: 'APP'
              },
              {
                stage_index: 1,
                type: 'FRT'
              },
              {
                stage_index: 1,
                type: 'SYN'
              }
            ]
          },
          {
            stage_index: 1,
            touchpoint_index: 1,
            measure_points: [
              {
                stage_index: 1,
                type: 'PCC',
                min_count: 0
              }
            ]
          },
          {
            stage_index: 1,
            touchpoint_index: 1,
            measure_points: [
              {
                stage_index: 1,
                type: 'APP'
              }
            ]
          },
          {
            stage_index: 1,
            touchpoint_index: 1,
            measure_points: [
              {
                stage_index: 1,
                type: 'FRT',
                min_apdex: 0,
                max_response_time: 0,
                max_error_percentage: 0
              }
            ]
          },
          {
            stage_index: 1,
            touchpoint_index: 1,
            measure_points: [
              {
                stage_index: 1,
                type: 'SYN',
                max_avg_response_time: 0,
                max_total_check_time: 0,
                min_success_percentage: 0
              }
            ]
          }
        ]
      }
    ];
    dataManager.UpdateTouchpointTune(touchpoint, datos);
    expect(dataManager.SetStorageTouchpoints).toHaveBeenCalledTimes(1);
  });

  it('Fucntion UpdateTouchpointTune() with type = APP and FRT', () => {
    const touchpoint = {
      index: 1,
      stage_index: 1,
      value: 'ORDER COUNTS',
      status_on_off: true
    };
    const datos = {
      min_count: 0.1,
      min_apdex: 0.3,
      max_response_time: 7.32,
      max_error_percentage: 62,
      max_avg_response_time: 13.5,
      max_total_check_time: 52.3,
      min_success_percentage: 4
    };
    dataManager.SetStorageTouchpoints = jest.fn();
    dataManager.SendToLogs = jest.fn();
    dataManager.stages = [
      {
        title: 'BROWSE'
      }
    ];
    dataManager.touchPoints = [
      {
        index: 0,
        value: 'Orders API (PRC)',
        touchpoints: [
          {
            stage_index: 1,
            touchpoint_index: 1,
            measure_points: [
              {
                stage_index: 1,
                type: 'APP'
              }
            ]
          },
          {
            stage_index: 1,
            touchpoint_index: 1,
            measure_points: [
              {
                stage_index: 1,
                type: 'FRT',
                min_apdex: 0,
                max_response_time: 0,
                max_error_percentage: 0
              }
            ]
          }
        ]
      }
    ];
    dataManager.UpdateTouchpointTune(touchpoint, datos);
    expect(dataManager.SetStorageTouchpoints).toHaveBeenCalledTimes(1);
  });

  it('Fucntion UpdateTouchpointTune() with type = SYN', () => {
    const touchpoint = {
      index: 1,
      stage_index: 1,
      value: 'ORDER COUNTS',
      status_on_off: true
    };
    const datos = {
      min_count: 0.1,
      min_apdex: 0.3,
      max_response_time: 7.32,
      max_error_percentage: 62,
      max_avg_response_time: 13.5,
      max_total_check_time: 52.3,
      min_success_percentage: 4
    };
    dataManager.SetStorageTouchpoints = jest.fn();
    dataManager.SendToLogs = jest.fn();
    dataManager.stages = [
      {
        title: 'BROWSE'
      }
    ];
    dataManager.touchPoints = [
      {
        index: 0,
        value: 'Orders API (PRC)',
        touchpoints: [
          {
            stage_index: 1,
            touchpoint_index: 1,
            measure_points: [
              {
                stage_index: 1,
                type: 'SYN',
                max_avg_response_time: 0,
                max_total_check_time: 0,
                min_success_percentage: 0
              }
            ]
          }
        ]
      }
    ];
    dataManager.UpdateTouchpointTune(touchpoint, datos);
    expect(dataManager.SetStorageTouchpoints).toHaveBeenCalledTimes(1);
  });

  it('Function UpdateTouchpointQuerys()', () => {
    const datos = [
      {
        query_body: 'SELECT * FROM Transaction',
        timeout: 10
      }
    ];
    const touchpoint = {
      stage_index: 1,
      index: 1,
      value: 'PRC',
      status_on_off: true
    };
    dataManager.stages = [
      {
        title: 'BROWSE'
      }
    ];
    dataManager.SendToLogs = jest.fn();
    dataManager.UpdateMeasure = jest.fn();
    dataManager.SetStorageTouchpoints = jest.fn();
    dataManager.UpdateTouchpointQuerys(touchpoint, datos);
  });

  it('Function UpdateMeasure()', () => {
    const data = {
      type: 101,
      accountID: 2710112,
      query_body: 'SELECT * FROM Transactions',
      timeout: 11.2
    };
    const measure_points = [
      {
        type: 101,
        accountID: 0,
        query: '',
        timeout: 0
      }
    ];
    dataManager.UpdateMeasure(data, measure_points);
    expect(measure_points).toEqual([
      {
        type: 101,
        accountID: 2710112,
        query: 'SELECT * FROM Transactions',
        timeout: 11.2
      }
    ]);
  });

  it('Function UpdateGoutParameters()', () => {
    const dropForm = {
      id: 2710112
    };
    dataManager.setStorageDropParams = jest.fn();
    dataManager.UpdateGoutParameters(dropForm);
    expect(dataManager.dropParams).toEqual({
      id: 2710112
    });
  });

  it('Function GetGoutParameters()', () => {
    dataManager.dropParams = { data: 'new dropParams' };
    expect(dataManager.GetGoutParameters()).toEqual({ data: 'new dropParams' });
  });

  it('Function GetStorageDropParams()', async () => {
    jest.spyOn(AccountStorageQuery, 'query').mockReturnValue({
      data: { dropParams: { dropmoney: 200, hours: 24, percentage: 75 } }
    });
    await dataManager.GetStorageDropParams();
  });

  it('Function GetStorageDropParams() with catch', async () => {
    jest.spyOn(AccountStorageQuery, 'query').mockRejectedValue(Error('error'));
    await expect(dataManager.GetStorageDropParams()).rejects.toThrow('error');
  });

  it('Function GetHistoricParameters()', () => {
    expect(dataManager.GetHistoricParameters()).toEqual({
      hours: 192,
      percentage: 26
    });
  });

  it('Function UpdateHistoricParameters()', () => {
    const hours = 72;
    const percentage = 48;
    dataManager.SetStorageHistoricErrorsParams = jest.fn();
    dataManager.UpdateHistoricParameters(hours, percentage);
    expect(dataManager.historicErrorsHours).toEqual(72);
  });

  it('Function GetStorageHistoricErrorsParams()', async () => {
    jest.spyOn(AccountStorageQuery, 'query').mockReturnValue({
      data: {
        historicErrorsHours: 96,
        historicErrorsHighLightPercentage: 37
      }
    });
    await dataManager.GetStorageHistoricErrorsParams();
    expect(dataManager.historicErrorsHighLightPercentage).toEqual(37);
  });

  it('Function GetStorageHistoricErrorsParams() with catch', async () => {
    jest.spyOn(AccountStorageQuery, 'query').mockRejectedValue(Error('error'));
    await expect(dataManager.GetStorageHistoricErrorsParams()).rejects.toThrow(
      'error'
    );
  });

  it('Function EnableDisableLogsConnector()', () => {
    const status = 'ENABLED';
    dataManager.LogConnector.EnableDisable = jest.fn();
    dataManager.EnableDisableLogsConnector(status);
    expect(dataManager.LogConnector.EnableDisable).toHaveBeenCalledTimes(1);
  });

  it('Function SaveCredentialsInVault() with ingestLicense', async () => {
    const credentials = {
      ingestLicense: 'TEST1235'
    };
    dataManager.ValidateIngestLicense = jest.fn().mockReturnValue(true);
    dataManager.NerdStorageVault.storeCredentialData = jest.fn();
    dataManager.LogConnector.SetLicenseKey = jest.fn();
    dataManager.SynConnector.SetLicenseKey = jest.fn();
    dataManager.SaveCredentialsInVault(credentials);
    expect(dataManager.ValidateIngestLicense).toHaveBeenCalledTimes(1);
  });

  it('Function SaveCredentialsInVault() with userAPIKey', async () => {
    const credentials = {
      userAPIKey: 'TEST1235'
    };
    dataManager.ValidateUserApiKey = jest.fn().mockReturnValue(true);
    dataManager.NerdStorageVault.storeCredentialData = jest.fn();
    dataManager.SaveCredentialsInVault(credentials);
    expect(dataManager.ValidateUserApiKey).toHaveBeenCalledTimes(1);
  });

  it('Function ResetCredentialsInVault()', () => {
    dataManager.NerdStorageVault.storeCredentialData = jest.fn();
    dataManager.ResetCredentialsInVault();
    expect(
      dataManager.NerdStorageVault.storeCredentialData
    ).toHaveBeenCalledTimes(2);
  });

  it('Function SaveGeneralConfiguration()', async () => {
    const data = {
      dropTools: 'dropTools',
      flameTools: 'flameTools',
      loggin: true,
      accountId: 2710112
    };
    jest.spyOn(AccountStorageMutation, 'mutate').mockReturnValue({
      data: {}
    });
    dataManager.EnableDisableLogsConnector = jest.fn();
    dataManager.SaveGeneralConfiguration(data);
    expect(dataManager.EnableDisableLogsConnector).toHaveBeenCalledTimes(1);
  });

  it('Function GetGeneralConfiguration()', async () => {
    jest.spyOn(AccountStorageQuery, 'query').mockReturnValue({
      data: { accountId: 'accountId' }
    });
    await dataManager.GetGeneralConfiguration();
    expect(dataManager.generalConfiguration).toEqual({
      accountId: 'accountId'
    });
  });

  it('Function GetGeneralConfiguration() with catch', async () => {
    jest.spyOn(AccountStorageQuery, 'query').mockRejectedValue(Error('error'));
    await expect(dataManager.GetGeneralConfiguration()).rejects.toThrow(
      'error'
    );
  });

  it('Function ValidateIngestLicense()', async () => {
    const license = '1259LICENSE';
    dataManager.LogConnector.ValidateIngestLicense = jest
      .fn()
      .mockReturnValue(true);
    const result = await dataManager.ValidateIngestLicense(license);
    expect(result).toEqual(true);
  });

  it('Function ValidateUserApiKey()', async () => {
    const userApiKey = '1259USERKEY';
    dataManager.SynConnector.ValidateUserApiKey = jest
      .fn()
      .mockReturnValue(true);
    const result = await dataManager.ValidateUserApiKey(userApiKey);
    expect(result).toEqual(true);
  });

  it('Function InstallUpdateBackGroundScript()', () => {
    dataManager.SynConnector.UpdateFlameMonitor = jest.fn();
    dataManager.InstallUpdateBackGroundScript();
    expect(dataManager.SynConnector.UpdateFlameMonitor).toHaveBeenCalledTimes(
      0
    );
  });
});
