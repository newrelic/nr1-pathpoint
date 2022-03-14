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
      query: jest.fn().mockReturnValue({
        data: {
          name: 'Pathpoint'
        }
      })
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

  it('BoootstrapApplication with mocking', async () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.InitLogoSetupData = jest.fn();
    instance.ExecuteUpdateData = jest.fn();
    mainContainer.DataManager = {
      BootstrapInitialData: jest.fn().mockResolvedValue({
        credentials: {
          actor: {
            nerdStorageVault: {
              secrets: [{ value: '231' }]
            }
          }
        }
      })
    };
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

  it('ToggleCanaryIcon with iconCanaryStatus and showCanaryWelcomeMat', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.iconCanaryStatus = true;
    instance._onClose = jest.fn();
    instance.state.showCanaryWelcomeMat = true;
    instance.DataManager = {
      LoadCanaryData: jest.fn().mockReturnValue(canaryData),
      SetCanaryData: jest.fn(),
      UpdateData: jest.fn()
    };
    instance.ToggleCanaryIcon(false);
  });

  it('ToggleCanaryIcon with iconCanaryStatus and no showCanaryWelcomeMat', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.iconCanaryStatus = true;
    instance._onClose = jest.fn();
    instance.state.showCanaryWelcomeMat = false;
    instance.PreSelectCanaryData = jest.fn();
    instance.updateDataNow = jest.fn();
    instance.DataManager = {
      LoadCanaryData: jest.fn().mockReturnValue(canaryData),
      SetCanaryData: jest.fn(),
      UpdateData: jest.fn()
    };
    instance.ToggleCanaryIcon(false);
  });

  it('ToggleCanaryIcon with no iconCanaryStatus', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.iconCanaryStatus = false;
    instance._onClose = jest.fn();
    instance.state.showCanaryWelcomeMat = false;
    instance.PreSelectCanaryData = jest.fn();
    instance.updateDataNow = jest.fn();
    instance.DataManager = {
      ClearCanaryData: jest.fn().mockReturnValue({
        stages: [
          {
            index: 0,
            title: 'BROWSE',
            latencyStatus: false,
            status_color: 'good'
          }
        ]
      })
    };
    instance.ToggleCanaryIcon(true);
    expect(instance.state.stages).toEqual([
      {
        index: 0,
        title: 'BROWSE',
        latencyStatus: false,
        status_color: 'good'
      }
    ]);
  });

  it('clearStepsHistoricError', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.clearStepsHistoricError(true);
  });

  it('updateHistoricErrors', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.stages[0].touchpoints[0].history_error = true;
    instance.clearStepsHistoricError(true);
    instance.setStepsHistoricError = jest.fn();
    instance.updateHistoricErrors();
  });

  it('ToggleFireIcon', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.iconFireStatus = true;
    instance._onClose = jest.fn();
    instance.updateHistoricErrors = jest.fn();
    instance.showFireWelcomeMat = true;
    instance.DataManager = {
      ReadHistoricErrors: jest.fn()
    };
    instance.ToggleFireIcon(false);
  });

  it('ToggleFireIcon with value true', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.iconFireStatus = false;
    instance.showFireWelcomeMat = true;
    instance._onClose = jest.fn();
    instance.updateHistoricErrors = jest.fn();
    instance.DataManager = {
      ReadHistoricErrors: jest.fn()
    };
    instance.ToggleFireIcon(true);
  });

  it('ToggleFireIcon with value true and no showFireWelcomeMat', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.iconFireStatus = false;
    instance.showFireWelcomeMat = false;
    instance._onClose = jest.fn();
    instance.updateHistoricErrors = jest.fn();
    instance.DataManager = {
      ReadHistoricErrors: jest.fn()
    };
    instance.ToggleFireIcon(true);
  });

  it('removeDuplicates', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.removeDuplicates([1, 2, 3, 1, 2]);
  });

  it('openModal', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance._onClose = jest.fn();
    instance.openModal(1);
  });

  it('updateTouchpointStageOnOff', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.updateTouchpointStageOnOff(stages[0].touchpoints[0]);
  });

  it('updateTouchpointOnOff with no iconCanaryStatus', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.updateTouchpointStageOnOff = jest.fn();
    instance.DataManager = {
      UpdateTouchpointOnOff: jest.fn()
    };
    instance.state.stages = stages;
    instance.state.iconCanaryStatus = false;
    instance.updateTouchpointOnOff(stages[0].touchpoints[0]);
  });

  it('updateTouchpointOnOff with iconCanaryStatus', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.updateTouchpointStageOnOff = jest.fn();
    instance.DataManager = {
      UpdateTouchpointOnOff: jest.fn()
    };
    instance.state.stages = stages;
    instance.state.iconCanaryStatus = true;
    instance.updateTouchpointOnOff(stages[0].touchpoints[0]);
  });

  it('openModalParent with view 1', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance._onClose = jest.fn();
    instance.DataManager = {
      GetTouchpointTune: jest.fn(),
      GetTouchpointQuerys: jest.fn()
    };
    instance.state.stages = stages;
    instance.openModalParent(stages[0].touchpoints[0], 1);
  });

  it('openModalParent with view 2', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance._onClose = jest.fn();
    instance.DataManager = {
      GetTouchpointTune: jest.fn(),
      GetTouchpointQuerys: jest.fn()
    };
    instance.state.stages = stages;
    instance.openModalParent(stages[0].touchpoints[0], 2);
  });

  it('openModalParent with view 9', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance._onClose = jest.fn();
    instance.DataManager = {
      GetTouchpointTune: jest.fn(),
      GetTouchpointQuerys: jest.fn()
    };
    instance.state.stages = stages;
    instance.openModalParent(stages[0].touchpoints[0], 9);
  });

  it('changeTimeRange', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.changeTimeRange({
      target: {
        value: '5 MINUTES AGO'
      }
    });
  });

  it('resetIcons with statusStar', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.resetIcons(true, false, false, false);
  });

  it('resetIcons with statusFire', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.resetIcons(false, true, false, false);
  });

  it('resetIcons with statusGot', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.resetIcons(false, false, true, false);
  });

  it('resetIcons with statusFire and step.value === ""', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    const stageResetIcons = [
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
            index_stage: 1,
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
            dashboard_url: [
              'https://one.newrelic.com/redirect/entity/Mjg0NzMzMnxWSVp8REFTSEJPQVJEfDE2NzQ3NDg'
            ],
            relation_steps: [1]
          }
        ]
      }
    ];
    instance.state.stages = stageResetIcons;
    instance.resetIcons(false, true, false, false);
    expect(instance.state.stages).toEqual([
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
            highlighted: false,
            index_stage: 1,
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
            dashboard_url: [
              'https://one.newrelic.com/redirect/entity/Mjg0NzMzMnxWSVp8REFTSEJPQVJEfDE2NzQ3NDg'
            ],
            relation_steps: [1]
          }
        ]
      }
    ]);
  });

  it('resetIcons with statusCanary', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.resetIcons(false, false, false, true);
  });

  it('renderContentAboveStep with statusStar', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.renderContentAboveStep(true, false, false, {
      icon_active: true
    });
  });

  it('renderContentAboveStep with statusGot', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.renderContentAboveStep(false, true, false, {
      icon_active: true
    });
  });

  it('renderContentAboveStep with statusFire', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.renderContentAboveStep(false, false, true, {
      icon_active: true
    });
  });

  it('changeTouchpointsView', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.changeTouchpointsView({
      target: {
        checked: true
      }
    });
  });

  it('_onCloseBackdropTouch', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.restoreTouchPoints = jest.fn();
    instance._onCloseBackdropTouch();
  });

  it('renderProps with no visible', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.restoreTouchPoints = jest.fn();
    instance.renderProps(1, {
      active: false
    });
  });

  it('renderProps with visible', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.visible = true;
    instance.restoreTouchPoints = jest.fn();
    instance.renderProps(1, {
      active: false
    });
  });

  it('restoreTouchPoints', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.restoreTouchPoints();
  });

  it('changeMessage with watch', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stageNameSelected = {
      selectedCase: 'wrapper'
    };
    instance.state.stages = stages;
    instance.changeMessage({
      target: {
        value: 'wrapper'
      }
    });
  });

  it('changeMessage with no match', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stageNameSelected = {
      selectedCase: 'wrapper'
    };
    instance.state.modifiedQuery = true;
    instance.state.stages = stages;
    instance.changeMessage({
      target: {
        value: 'test'
      }
    });
  });

  it('chargueSample with Count Query', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.stageNameSelected = {
      datos: [
        {
          label: 'Count Query'
        }
      ]
    };
    instance.chargueSample(0);
  });

  it('changeMessage with modifiedQuery', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stageNameSelected = {
      selectedCase: 'wrapper'
    };
    instance.state.modifiedQuery = true;
    instance.state.stages = stages;
    instance.changeMessage({
      target: {
        value: 'test'
      }
    });
  });

  it('chargueSample with Error Percentage Query', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.stageNameSelected = {
      datos: [
        {
          label: 'Error Percentage Query'
        }
      ]
    };
    instance.chargueSample(0);
  });

  it('chargueSample with Apdex Query', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.stageNameSelected = {
      datos: [
        {
          label: 'Apdex Query'
        }
      ]
    };
    instance.chargueSample(0);
  });

  it('chargueSample with Session Query', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.stageNameSelected = {
      datos: [
        {
          label: 'Session Query'
        }
      ]
    };
    instance.chargueSample(0);
  });

  it('chargueSample with Session Query Duration', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.stageNameSelected = {
      datos: [
        {
          label: 'Session Query Duration'
        }
      ]
    };
    instance.chargueSample(0);
  });

  it('chargueSample with Session Full Open Query', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.stageNameSelected = {
      datos: [
        {
          label: 'Full Open Query'
        }
      ]
    };
    instance.chargueSample(0);
  });

  it('chargueSample with PRC-COUNT-QUERY', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.stageNameSelected = {
      datos: [
        {
          label: 'PRC-COUNT-QUERY'
        }
      ]
    };
    instance.chargueSample(0);
  });

  it('chargueSample with PCC-COUNT-QUERY', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.stageNameSelected = {
      datos: [
        {
          label: 'PCC-COUNT-QUERY'
        }
      ]
    };
    instance.chargueSample(0);
  });

  it('chargueSample with APP-HEALTH-QUERY', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.stageNameSelected = {
      datos: [
        {
          label: 'APP-HEALTH-QUERY'
        }
      ]
    };
    instance.chargueSample(0);
  });

  it('chargueSample with FRT-HEALTH-QUERY', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.stageNameSelected = {
      datos: [
        {
          label: 'FRT-HEALTH-QUERY'
        }
      ]
    };
    instance.chargueSample(0);
  });

  it('chargueSample with SYN-CHECK-QUERY', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.stageNameSelected = {
      datos: [
        {
          label: 'SYN-CHECK-QUERY'
        }
      ]
    };
    instance.chargueSample(0);
  });

  it('chargueSample with selectedCase', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.stageNameSelected = {
      selectedCase: 1,
      datos: [
        {
          query_body: 'Count Query'
        },
        {
          query_body: 'Count Query'
        }
      ]
    };
    instance.chargueSample(0);
  });

  it('testQuery', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.stageNameSelected = {
      datos: [
        {
          accountID: 271,
          label: 'Count Query'
        }
      ]
    };
    instance.validationQuery = {
      validateQuery: jest.fn().mockReturnValue({
        testText: 'good',
        goodQuery: true
      })
    };
    instance.DataManager = {
      ReadQueryResults: jest.fn().mockReturnValue([])
    };
    instance.testQuery(
      'SELECT count(*) as value FROM Transaction SINCE 1 minute AGO',
      0
    );
  });

  it('handleChangeTexarea', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.stageNameSelected = {
      selectedCase: 0,
      datos: [
        {
          label: 'Count Query'
        }
      ]
    };
    instance.handleChangeTexarea(
      'SELECT count(*) as value FROM Transaction SINCE 1 minute AGO'
    );
  });

  it('handleChangeTexarea with no watch', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.stageNameSelected = {
      datos: [
        {
          label: 'Count Query'
        }
      ]
    };
    instance.handleChangeTexarea(
      'SELECT count(*) as value FROM Transaction SINCE 1 minute AGO'
    );
  });

  it('handleChangeTexarea with stageNameSelected', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.stageNameSelected = {
      selectedCase: 1,
      datos: [
        {
          query_body: 'Count Query'
        },
        {
          query_body: 'Count Query'
        }
      ]
    };
    instance.handleChangeTexarea(
      'SELECT count(*) as value FROM Transaction SINCE 1 minute AGO'
    );
  });

  it('handleChangeTexareaSupport', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.handleChangeTexareaSupport({
      target: {
        value: 'This is test message'
      }
    });
  });

  it('handleChangeSubject', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.handleChangeSubject({
      value: {
        label: 'This is test label'
      }
    });
  });

  it('handleSaveUpdateQuery', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stageNameSelected = {
      touchpoint: []
    };
    instance._onClose = jest.fn();
    instance.DataManager = {
      UpdateTouchpointQuerys: jest.fn()
    };
    instance.handleSaveUpdateQuery({
      preventDefault: jest.fn(),
      target: {
        value: 'SELECT * FROM'
      }
    });
  });

  it('handleSaveUpdateTune', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.state.stageNameSelected = {
      touchpoint: []
    };
    instance._onClose = jest.fn();
    instance.DataManager = {
      UpdateTouchpointTune: jest.fn()
    };
    instance.handleSaveUpdateTune({
      threshold: 1,
      apdex: 1
    });
  });

  it('handleSaveUpdateCanary', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance._onClose = jest.fn();
    instance.handleSaveUpdateCanary({
      preventDefault: jest.fn(),
      target: {
        elements: {
          checkbox_canary: true
        }
      }
    });
  });

  it('handleSaveUpdateFire', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance._onClose = jest.fn();
    instance.handleSaveUpdateFire({
      preventDefault: jest.fn(),
      target: {
        elements: {
          checkbox_fire: {
            checked: true
          }
        }
      }
    });
  });

  it('LogoFormSubmit', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance._onClose = jest.fn();
    instance.LogoSetupData = {
      SetLogoSetupData: jest.fn()
    };
    instance.LogoFormSubmit({ type: 'default' }, jest.fn());
  });

  it('handleSaveUpdateSupport', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance._resetFormSupport = jest.fn();
    instance._onClose = jest.fn();
    instance.handleSaveUpdateSupport({
      subject: 'Subject',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      message: 'Message',
      account: 'Account',
      company: 'Company'
    });
  });

  it('_resetFormSupport', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance._resetFormSupport();
  });

  it('openLeftMenu', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.openLeftMenu();
  });

  it('_onCloseBackdrop', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance._onCloseBackdrop();
  });

  it('_handleClickSetup', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance._handleClickSetup();
  });

  it('_handleClickSupport', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance._handleClickSupport();
  });

  it('HandleChangeLogo', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.HandleChangeLogo();
  });

  it('_handleContextMenuGout', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.DataManager = {
      GetGoutParameters: jest.fn()
    };
    instance._handleContextMenuGout({
      button: 2
    });
    expect(instance.state.backdrop).toEqual(true);
    expect(instance.state.showRightPanel).toEqual(true);
    expect(instance.state.MenuRightDefault).toEqual(1);
  });

  it('_handleContextMenuStar', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance._handleContextMenuStar({
      button: 2
    });
  });

  it('_handleContextMenuFire', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.DataManager = {
      GetHistoricParameters: jest.fn()
    };
    instance._handleContextMenuFire({
      button: 2
    });
    expect(instance.state.backdrop).toEqual(true);
    expect(instance.state.showRightPanel).toEqual(true);
    expect(instance.state.MenuRightDefault).toEqual(3);
  });

  it('_onCloseMenuRight', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.DataManager = {
      UpdateHistoricParameters: jest.fn()
    };
    instance._onCloseMenuRight();
  });

  it('_onCloseMenuRight with MenuRightDefault = 3', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.MenuRightDefault = 3;
    instance.state.stages = stages;
    instance.DataManager = {
      UpdateHistoricParameters: jest.fn()
    };
    instance._onCloseMenuRight();
  });

  it('_onCloseMenuRight with MenuRightDefault = 2', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.MenuRightDefault = 2;
    instance.state.stages = stages;
    instance.DataManager = {
      UpdateHistoricParameters: jest.fn()
    };
    instance._onCloseMenuRight();
  });

  it('_onCloseMenuRight with MenuRightDefault = 1', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.MenuRightDefault = 1;
    instance.state.stages = stages;
    instance.DataManager = {
      UpdateGoutParameters: jest.fn()
    };
    instance._onCloseMenuRight();
  });

  it('_DropHandleChange', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance._DropHandleChange({
      target: {
        value: true
      }
    });
  });

  it('_StarHandleChange', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance._StarHandleChange({
      target: {
        value: true
      }
    });
  });

  it('_FlameHandleChange', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance._FlameHandleChange({
      target: {
        value: true
      }
    });
  });

  it('GetCurrentConfigurationJSON', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.DataManager = {
      GetCurrentConfigurationJSON: jest.fn()
    };
    instance.GetCurrentConfigurationJSON();
  });

  it('SetConfigurationJSON', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.DataManager = {
      StorageJSONDataInHistoric: jest.fn(),
      SetConfigurationJSON: jest.fn().mockReturnValue({
        stages,
        banner_kpis
      })
    };
    const banner_kpis = [
      {
        type: 100,
        description: 'Total Order Count',
        prefix: '',
        suffix: 'Orders',
        query: 'SELECT count(*) as value FROM Transaction SINCE 1 minute AGO',
        value: 0
      }
    ];
    instance.SetConfigurationJSON(
      {
        stages,
        banner_kpis
      },
      {
        target: {
          files: [
            {
              name: 'Filename'
            }
          ]
        }
      }
    );
  });

  it('GetCurrentHistoricErrorScript', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.stages = stages;
    instance.DataManager = {
      GetCurrentHistoricErrorScript: jest.fn()
    };
    instance.GetCurrentHistoricErrorScript();
  });

  it('DisplayConsole with error', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.DisplayConsole('error', 'Error Message');
  });

  it('DisplayConsole with log', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.DisplayConsole('log', 'Log Message');
  });

  it('DisplayConsole with warning', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.DisplayConsole('warning', 'Warning Message');
  });

  it('changeTimeRangeKpi ', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.state.timeRangeKpi = { index: 0, range: 'none' };
    instance.changeTimeRangeKpi({ value: 'none' }, 0);
  });

  it('updateDataKpisChecked  ', () => {
    const kpi = {
      index: 0,
      type: 101,
      name: 'Unique Visitors',
      shortName: 'Unique',
      link:
        'https://chart-embed.service.newrelic.com/herald/cb9c0f8b-1c91-4648-9ffd-1d94582f3c6b?height=400px&timepicker=true',
      query:
        'SELECT count(*) as value  FROM Transaction COMPARE WITH 1 day ago',
      value: {
        current: 0,
        previous: 0
      },
      check: true
    };
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.DataManager = {
      SaveKpisSelection: jest.fn()
    };
    instance.state.kpis = kpi;
    instance.updateDataKpisChecked();
  });
});
