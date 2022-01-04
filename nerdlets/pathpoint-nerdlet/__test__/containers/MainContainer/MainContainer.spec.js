// IMPORT DEPENDENCIES
import React from 'react';
import { create } from 'react-test-renderer';
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
const banner_kpis = [
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

describe('<MainContainer/>', () => {
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
      banner_kpis: banner_kpis
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
      banner_kpis: banner_kpis
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
      banner_kpis: banner_kpis
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
      banner_kpis: banner_kpis
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
      banner_kpis: banner_kpis
    });
    expect(mainContainer.toJSON()).toMatchSnapshot();
  });

  it('Values stages', () => {
    const mainContainer = create(<MainContainer />);
    const instance = mainContainer.getInstance();
    instance.setState({
      waiting: false,
      stages: stages,
      banner_kpis: banner_kpis,
      colors: colors
    });
    expect(mainContainer.toJSON()).toMatchSnapshot();
  });
});
