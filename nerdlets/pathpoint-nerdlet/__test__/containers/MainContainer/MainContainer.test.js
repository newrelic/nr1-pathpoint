import React from 'react';
import { shallow } from 'enzyme';
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

const stages = [
  
]

describe('<MainContainer/>', () => {
  it('componentDidMount', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.BoootstrapApplication = jest.fn();
    instance.componentDidMount();
  });

  it('componentDidUpdate with all false', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    const prevState = {
      updating: false,
      pending: false,
      loading: false
    };
    instance.componentDidUpdate(null, prevState);
  });

  it('componentDidUpdate with updating', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    const prevState = {
      updating: true,
      pending: false,
      loading: false
    };
    instance.componentDidUpdate(null, prevState);
  });

  it('componentDidUpdate with updating, pending', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    const prevState = {
      updating: true,
      pending: true,
      loading: false
    };
    instance.componentDidUpdate(null, prevState);
  });

  it('componentDidUpdate with updating, pending, loading', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    const prevState = {
      updating: true,
      pending: false,
      loading: true
    };
    instance.ExecuteUpdateData = jest.fn();
    instance.componentDidUpdate(null, prevState);
  });

  it('componentWillUnmount', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.componentWillUnmount();
  });

  it('BoootstrapApplication', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.BoootstrapApplication();
  });

  it('ExecuteUpdateData', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.ExecuteUpdateData();
  });

  it('updateDataNow', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.updateDataNow();
  });

  it('ToggleHeaderButtons', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.ToggleCanaryIcon = jest.fn();
    instance.ToggleFireIcon = jest.fn();
    instance.ToggleHeaderButtons('iconCanaryStatus');
  });

  it('onClickStage', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = [stage];
    instance.onClickStage();
  });
});
