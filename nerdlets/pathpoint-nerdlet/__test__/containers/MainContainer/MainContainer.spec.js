import React from 'react';
import { create } from 'react-test-renderer';
import MainContainer from '../../../containers/MainContainer/MainContainer';

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
    const logger = {
      error: jest.fn(),
      log: jest.fn(),
      warn: jest.fn()
    };
    return {
      AccountsQuery: AccountsQuery,
      AccountStorageQuery: AccountStorageQuery,
      AccountStorageMutation: AccountStorageMutation,
      NerdGraphQuery: NerdGraphQuery,
      nerdlet: nerdlet,
      logger
    };
  },
  { virtual: true }
);
describe('<MainContainer/>', () => {
  const bannerKpis = [
    {
      type: 100,
      description: 'Total Order Count',
      prefix: '',
      suffix: 'Orders',
      value: 0
    },
    {
      type: 100,
      description: 'Total Order Count',
      prefix: '',
      suffix: 'Orders',
      value: 0
    },
    {
      type: 100,
      description: 'Total Order Count',
      prefix: '',
      suffix: 'Orders',
      value: 0
    }
  ];

  const stages = [
    {
      index: 1,
      title: 'BROWSE',
      latencyStatus: false,
      status_color: 'good',
      gout_enable: false,
      gout_quantity: 150,
      money_enabled: false,
      trafficIconType: 'traffic',
      money: '',
      icon_active: false,
      icon_description: 'medal',
      icon_visible: false,
      congestion: {
        value: 0,
        percentage: 15
      },
      capacity: 0,
      total_count: 0,
      active_dotted: 'none',
      active_dotted_color: '#828282',
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
              dark: false,
              history_error: false,
              dotted: false,
              highlighted: false,
              error: false,
              index_stage: 1,
              relationship_touchpoints: [1]
            }
          ]
        }
      ],
      touchpoints: [
        {
          index: 1,
          stage_index: 1,
          status_on_off: true,
          active: false,
          value: 'Catalog API',
          highlighted: false,
          error: false,
          history_error: false,
          countrys: [0],
          dashboard_url: ['https://one.newrelic.com'],
          relation_steps: [1]
        }
      ]
    }
  ];

  const colors = {
    background_capacity: [19, 72, 104],
    stage_capacity: [255, 255, 255],
    status_color: {
      danger: [255, 76, 76],
      warning: [242, 201, 76],
      good: [39, 174, 96]
    },
    steps_touchpoints: [
      {
        good: [39, 174, 96],
        select_color: [18, 167, 255],
        unselect_color: [189, 189, 189],
        error_color: [255, 76, 76],
        dark: [51, 51, 51]
      }
    ]
  };

  it('Values default', () => {
    const mainContainer = create(<MainContainer />);
    expect(mainContainer.toJSON()).toMatchSnapshot();
  });

  it('Values waiting in false', () => {
    const mainContainer = create(<MainContainer />);
    const instance = mainContainer.getInstance();
    instance.setState({
      waiting: false,
      stages: [],
      banner_kpis: bannerKpis
    });
    expect(mainContainer.toJSON()).toMatchSnapshot();
  });

  it('Values left panel with true value', () => {
    const mainContainer = create(<MainContainer />);
    const instance = mainContainer.getInstance();
    instance.setState({
      waiting: false,
      showLeftPanel: true,
      stages: [],
      banner_kpis: bannerKpis
    });
    expect(mainContainer.toJSON()).toMatchSnapshot();
  });

  it('Values MenuRightDefault with value 1', () => {
    const mainContainer = create(<MainContainer />);
    const instance = mainContainer.getInstance();
    instance.setState({
      waiting: false,
      MenuRightDefault: 1,
      stages: [],
      banner_kpis: bannerKpis
    });
    expect(mainContainer.toJSON()).toMatchSnapshot();
  });

  it('Values MenuRightDefault with value 2', () => {
    const mainContainer = create(<MainContainer />);
    const instance = mainContainer.getInstance();
    instance.setState({
      waiting: false,
      MenuRightDefault: 2,
      stages: [],
      banner_kpis: bannerKpis
    });
    expect(mainContainer.toJSON()).toMatchSnapshot();
  });

  it('Values MenuRightDefault with value 3', () => {
    const mainContainer = create(<MainContainer />);
    const instance = mainContainer.getInstance();
    instance.setState({
      waiting: false,
      MenuRightDefault: 3,
      stages: [],
      banner_kpis: bannerKpis
    });
    expect(mainContainer.toJSON()).toMatchSnapshot();
  });

  it('Values stages', () => {
    const mainContainer = create(<MainContainer />);
    const instance = mainContainer.getInstance();
    instance.setState({
      waiting: false,
      stages: stages,
      banner_kpis: bannerKpis,
      colors: colors
    });
    expect(mainContainer.toJSON()).toMatchSnapshot();
  });
});
