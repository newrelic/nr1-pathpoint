// IMPORT DEPENDENCIES
import React from 'react';
import { shallow } from 'enzyme';
import MainContainer from '../../../containers/MainContainer/MainContainer';

// MOCKING DEPENDENCIES
jest.mock('../../../services/DataManager');
jest.mock('../../../services/LogoSetupData');
jest.mock('../../../services/Validations');
jest.mock(
  'nr1',
  () => {
    const nerdlet = {
      setConfig: jest.fn()
    };

    const logger = {
      error: jest.fn(),
      log: jest.fn(),
      warn: jest.fn()
    };

    const UserQuery = {
      query: jest.fn()
    };

    return {
      nerdlet: nerdlet,
      logger,
      UserQuery
    };
  },
  { virtual: true }
);

// INITIAL DATA
// const banner_kpis = [
//   {
//     type: 100,
//     description: 'Total Order Count',
//     prefix: '',
//     suffix: 'Orders',
//     query: 'SELECT count(*) as value FROM Transaction SINCE 1 minute AGO',
//     value: 0
//   }
// ];

// const kpis = [
//   {
//     type: 101,
//     name: 'Unique Visitors',
//     shortName: 'Unique',
//     measure: [
//       {
//         accountID: 1606862,
//         query:
//           'SELECT count(*) as value  FROM  Public_APICall COMPARE WITH 2 day ago',
//         link: 'https://onenr.io/01qwL8KPxw5'
//       }
//     ],
//     value_type: 'FLOAT',
//     prefix: '$',
//     suffix: ''
//   }
// ];

const stages = [
  {
    title: 'BROWSE',
    active_dotted: 'none',
    arrowMode: 'FLOW',
    steps: [
      {
        line: 1,
        index_stage: 1,
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
      }
    ]
  }
];

// const colors = {
//   background_capacity: [19, 72, 104],
//   stage_capacity: [255, 255, 255],
//   status_color: {
//     danger: [255, 76, 76],
//     warning: [242, 201, 76],
//     good: [39, 174, 96]
//   },
//   steps_touchpoints: [
//     {
//       select_color: [18, 167, 255],
//       unselect_color: [189, 189, 189],
//       error_color: [255, 76, 76],
//       dark: [51, 51, 51]
//     }
//   ]
// };

const canaryData = [
  {
    stage_index: 1,
    stage_title: 'Browse',
    states: [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false
    ]
  }
];

// EXECUTE MAIN CONTAINER TESTS
describe('<MainContainer/>', () => {
  // TESTING COMPONENT LIFECYCLE METHODS
  it('componentDidMount', () => {
    const componentDidMountSpy = jest.spyOn(
      MainContainer.prototype,
      'componentDidMount'
    );
    shallow(<MainContainer />);
    expect(MainContainer.prototype.componentDidMount).toHaveBeenCalledTimes(1);
    componentDidMountSpy.mockClear();
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
      pending: true,
      loading: true
    };
    instance.ExecuteUpdateData = jest.fn();
    instance.componentDidUpdate(null, prevState);
  });

  it('componentDidUpdate with all updating, pending, loading', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.loading = true;
    instance.state.pending = true;
    instance.state.updating = false;
    const prevState = {
      updating: true,
      pending: true,
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

  it('BoootstrapApplication', async () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.InitLogoSetupData = jest.fn();
    instance.ExecuteUpdateData = jest.fn();
    instance.BoootstrapApplication();
  });

  it('ExecuteUpdateData', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.ExecuteUpdateData();
  });

  it('ExecuteUpdateData with change loading', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.ExecuteUpdateData(true);
  });

  it('updateDataNow', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.updateDataNow();
  });

  it('ToggleHeaderButtons with iconCanaryStatus', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.ToggleCanaryIcon = jest.fn();
    instance.ToggleFireIcon = jest.fn();
    instance.ToggleHeaderButtons('iconCanaryStatus');
  });

  it('ToggleHeaderButtons with iconFireStatus', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.ToggleCanaryIcon = jest.fn();
    instance.ToggleFireIcon = jest.fn();
    instance.ToggleHeaderButtons('iconFireStatus');
  });

  it('onClickStage', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.onClickStage(1);
  });

  it('InitLogoSetupData', async () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.LogoSetupData = {
      GetLogoSetupData: jest.fn().mockReturnValue({
        type: 'default'
      })
    };
    instance.InitLogoSetupData(2710112);
  });

  it('onclickStep', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    const stepEntry = {
      canary_state: false,
      dark: false,
      dotted: false,
      error: false,
      highlighted: true,
      history_error: false,
      id: 'ST1-LINE1-SS1',
      index: 1,
      index_stage: 1,
      latency: false,
      relationship_touchpoints: [1],
      value: 'Web'
    };
    instance.ResetAllStages = jest.fn();
    instance.onclickStep(stepEntry);
    expect(instance.state.stages).toEqual([
      {
        title: 'BROWSE',
        active_dotted: 'none',
        arrowMode: 'FLOW',
        latencyStatus: true,
        steps: [
          {
            highlighted: false,
            index_stage: 1,
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
          }
        ],
        touchpoints: [
          {
            highlighted: false,
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
          }
        ]
      }
    ]);
  });

  it('onclickStep with substep.value != stepentry.value', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    const stepEntry = {
      canary_state: false,
      dark: false,
      dotted: false,
      error: false,
      highlighted: true,
      history_error: false,
      id: 'ST1-LINE1-SS1',
      index: 1,
      index_stage: 1,
      latency: false,
      relationship_touchpoints: [1],
      value: 'Test'
    };
    instance.ResetAllStages = jest.fn();
    instance.onclickStep(stepEntry);
    expect(instance.state.stages).toEqual([
      {
        title: 'BROWSE',
        active_dotted: 'none',
        arrowMode: 'FLOW',
        latencyStatus: true,
        steps: [
          {
            highlighted: false,
            index_stage: 1,
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
          }
        ],
        touchpoints: [
          {
            highlighted: false,
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
          }
        ]
      }
    ]);
  });

  it('ResetAllStages', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.ResetAllStages();
  });

  it('ResetAllStages with step.value = ""', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.stages[0].steps[0].value = '';
    instance.state.stages[0].steps[0].sub_steps = [];
    instance.ResetAllStages();
  });

  it('_onClose', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.restoreTouchPoints = jest.fn();
    instance._onClose();
  });

  it('_onClose with errors', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.restoreTouchPoints = jest.fn();
    instance._onClose([
      {
        dataPath: '/stages/0',
        message: 'Bad JSON File Structure'
      }
    ]);
  });

  it('PreSelectCanaryData', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.ExecuteSetCanaryData = jest.fn();
    instance.PreSelectCanaryData(canaryData);
  });

  it('PreSelectCanaryData with step.value !== ""', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.stages[0].steps[0].value = 'Test';
    instance.ExecuteSetCanaryData = jest.fn();
    instance.PreSelectCanaryData(canaryData);
  });

  it('ExecuteSetCanaryData', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.DataManager = {
      SetCanaryData: jest.fn().mockReturnValue({
        stages
      })
    };
    instance.ExecuteSetCanaryData();
  });

  it('ToggleCanaryIcon with no iconCanaryStatus and showCanaryWelcomeMat', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance._onClose = jest.fn();
    instance.state.showCanaryWelcomeMat = true;
    instance.ToggleCanaryIcon(true);
    expect(instance.state.stages).toEqual([]);
  });
});
