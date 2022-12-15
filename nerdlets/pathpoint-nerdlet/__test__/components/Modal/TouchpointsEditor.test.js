import React from 'react';
import {
  HeaderTouchpointsEditor,
  BodyTouchpointsEditor
} from '../../../components/Modal/TouchpointsEditor';
import { shallow } from 'enzyme';

jest.mock('../../../components/SelectIDs/SelectIDs');
jest.mock('../../../components/Toast/Toast');

jest.mock(
  'nr1',
  () => {
    const Icon = jest.fn().mockReturnValue({
      TYPE: jest
        .fn()
        .mockReturnValue({ INTERFACE__OPERATIONS__FOLLOW: 'value' })
    });
    const DropdownItem = () => <div />;
    const Dropdown = () => <div />;
    const TextField = () => <div />;
    return {
      Icon: Icon,
      DropdownItem,
      Dropdown,
      TextField
    };
  },
  { virtual: true }
);

jest.mock(
  'shortid',
  () => {
    const generate = jest.fn().mockReturnValue(12);
    return {
      generate: generate
    };
  },
  { virtual: true }
);

jest.spyOn(document, 'querySelectorAll').mockReturnValue([{ checked: true }]);

const stagesInterface = [
  {
    id: 2710,
    index: 1,
    oldIndex: 1,
    title: 'Login User',
    type: 'PCC',
    visible: true,
    new: true,
    steps: [
      {
        id: 11,
        value: 'new',
        sub_steps: [
          {
            index: 1,
            value: 1,
            latency: true,
            id: 'ST1-LINE1-SS1',
            relationship_touchpoints: [1]
          }
        ]
      },
      {
        id: 12,
        value: 'new',
        sub_steps: [
          {
            index: 1,
            value: 1,
            latency: true,
            id: 'ST1-LINE1-SS1',
            relationship_touchpoints: [1]
          }
        ]
      }
    ],
    touchpoints: [
      {
        stage_index: 1,
        value: 'Touchpoint',
        touchpoint_index: 1,
        status_on_off: true,
        relation_steps: [1],
        queryData: {
          query:
            "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
        },
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
];

const touchpointsInterface = [
  {
    stage_index: 1,
    value: 'Touchpoint',
    touchpoint_index: 1,
    status_on_off: true,
    relation_steps: [1],
    queryData: {
      query:
        "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
    },
    substeps: 'substeps',
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
];

const accountIDs = [2710112, 2710113];

describe('<HeaderTouchpointsEditor/>', () => {
  it('componentWillUnmount', () => {
    const componentWillUnmountSpy = jest.spyOn(
      HeaderTouchpointsEditor.prototype,
      'componentWillUnmount'
    );
    const touchpointEditor = shallow(
      <HeaderTouchpointsEditor
        HideIcon={jest.fn()}
        ShowIcon={jest.fn()}
        DisplayIcon={jest.fn()}
        NoDisplayIcon={jest.fn()}
      />
    );
    const instance = touchpointEditor.instance();
    instance.componentWillUnmount();
    expect(
      HeaderTouchpointsEditor.prototype.componentWillUnmount
    ).toHaveBeenCalledTimes(1);
    componentWillUnmountSpy.mockClear();
  });

  it('display visible', () => {
    const clickStage = jest.fn();
    const touchpointEditor = shallow(
      <HeaderTouchpointsEditor DispatchCustomEvent={clickStage} />
    );
    const instance = touchpointEditor.instance();
    instance.DisplayIcon();
    touchpointEditor
      .find('#ChangeVisibleTouchpointEditor')
      .at(0)
      .simulate('click');
    expect(clickStage).toHaveBeenCalledTimes(0);
  });

  it('Duplicate', () => {
    const clickStage = jest.fn();
    const touchpointEditor = shallow(
      <HeaderTouchpointsEditor DispatchCustomEvent={clickStage} />
    );
    touchpointEditor.instance();
    touchpointEditor
      .find('#DuplicateTouchpointEditor')
      .at(0)
      .simulate('click');
    expect(clickStage).toHaveBeenCalledTimes(0);
  });

  it('Delete', () => {
    const clickStage = jest.fn();
    const touchpointEditor = shallow(
      <HeaderTouchpointsEditor DispatchCustomEvent={clickStage} />
    );
    touchpointEditor.instance();
    touchpointEditor
      .find('#DeleteTouchpointEditor')
      .at(0)
      .simulate('click');
    expect(clickStage).toHaveBeenCalledTimes(0);
  });
});
describe('<BodyTouchpointsEditor/>', () => {
  it('componentDidMount', () => {
    const stagesInterfaceDidmount = [
      {
        id: 2710,
        index: 1,
        oldIndex: 1,
        title: 'Login User',
        type: 'PCC',
        visible: true,
        new: true,
        steps: [
          {
            id: 11,
            value: 'new',
            sub_steps: [
              {
                index: 1,
                value: 1,
                latency: true,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [
          {
            stage_index: 1,
            value: 'Touchpoint',
            touchpoint_index: 1,
            queryData: {
              query:
                "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
            },
            measure_points: [
              {
                type: 'PRC'
              }
            ]
          }
        ]
      },
      {
        id: 2711,
        index: 2,
        oldIndex: 2,
        title: 'Login User',
        type: 'PCC',
        visible: true,
        new: true,
        steps: [
          {
            id: 12,
            value: 'new',
            sub_steps: [
              {
                index: 2,
                value: 2,
                latency: true,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [
          {
            stage_index: 1,
            value: 'Touchpoint',
            touchpoint_index: 1,
            queryData: {
              query:
                "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
            },
            measure_points: [
              {
                type: 'PRC'
              }
            ]
          }
        ]
      }
    ];
    const componentDidMountSpy = jest.spyOn(
      BodyTouchpointsEditor.prototype,
      'componentDidMount'
    );
    const clickStage = jest.fn();
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterfaceDidmount}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
        DuplicateTouchpoint={jest.fn()}
        DeleteTouchpoint={jest.fn()}
        ToggleVisible={jest.fn()}
        SelectStage={clickStage}
        SelectTab={clickStage}
        HandleOnChange={clickStage}
      />
    );
    touchpointEditor
      .find('#SelectStage')
      .at(0)
      .simulate('click');
    expect(clickStage).toHaveBeenCalledTimes(0);
    touchpointEditor
      .find('input')
      .at(0)
      .simulate('change');
    expect(clickStage).toHaveBeenCalledTimes(0);
    const e = { target: { value: 'someFunction' } };
    touchpointEditor
      .find('TextField')
      .at(0)
      .simulate('change', e);
    expect(clickStage).toHaveBeenCalledTimes(0);
    touchpointEditor
      .find('DropdownItem')
      .at(0)
      .simulate('click');
    expect(clickStage).toHaveBeenCalledTimes(0);
    expect(
      BodyTouchpointsEditor.prototype.componentDidMount
    ).toHaveBeenCalledTimes(1);
    componentDidMountSpy.mockClear();
  });

  it('componentDidMount with touchpoints[0].visible = false', () => {
    const stagesInterfaceDidmount = [
      {
        id: 2710,
        index: 1,
        oldIndex: 1,
        title: 'Login User',
        type: 'PCC',
        visible: true,
        new: true,
        steps: [
          {
            id: 11,
            value: 'new',
            sub_steps: [
              {
                index: 1,
                value: 1,
                latency: true,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [
          {
            stage_index: 1,
            value: 'Touchpoint',
            touchpoint_index: 1,
            visible: false,
            queryData: {
              query:
                "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
            },
            measure_points: [
              {
                type: 'PRC'
              }
            ]
          }
        ]
      }
    ];
    const componentDidMountSpy = jest.spyOn(
      BodyTouchpointsEditor.prototype,
      'componentDidMount'
    );
    shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterfaceDidmount}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
        DuplicateTouchpoint={jest.fn()}
        DeleteTouchpoint={jest.fn()}
        ToggleVisible={jest.fn()}
      />
    );
    expect(
      BodyTouchpointsEditor.prototype.componentDidMount
    ).toHaveBeenCalledTimes(1);
    componentDidMountSpy.mockClear();
  });

  it('componentWillUnmount', () => {
    const componentWillUnmountSpy = jest.spyOn(
      BodyTouchpointsEditor.prototype,
      'componentWillUnmount'
    );
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
        DuplicateTouchpoint={jest.fn()}
        DeleteTouchpoint={jest.fn()}
        ToggleVisible={jest.fn()}
      />
    );
    const instance = touchpointEditor.instance();
    instance.componentWillUnmount();
    expect(
      BodyTouchpointsEditor.prototype.componentWillUnmount
    ).toHaveBeenCalledTimes(1);
    componentWillUnmountSpy.mockClear();
  });

  it('GetShortTouchpointTypeName', () => {
    const longName = 'Person-Count';
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    const instance = touchpointEditor.instance();
    const result = instance.GetShortTouchpointTypeName(longName);
    expect(result).toEqual('PRC');
  });

  it('ToggleVisible', () => {
    const document = jest.fn().mockImplementation({
      querySelectorAll: jest.fn().mockReturnValue([{ checked: true }])
    });
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
        document={document}
      />
    );
    const instance = touchpointEditor.instance();
    instance.state.current.step = 11;
    instance.ToggleVisible();
    expect(instance.state.current).toEqual({
      stage: 2710,
      step: 11,
      touchpoint: null,
      subs: { '12': [] }
    });
  });

  it('DeleteTouchpoint', () => {
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    const instance = touchpointEditor.instance();
    instance.DeleteTouchpoint();
    expect(instance.state.delete).toEqual({
      show: true,
      title: 'undefined'
    });
  });

  it('DuplicateTouchpoint', () => {
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    const instance = touchpointEditor.instance();
    instance.DuplicateTouchpoint();
    expect(instance.state.current).toEqual({
      stage: 2710,
      step: null,
      subs: {
        '12': []
      },
      touchpoint: null
    });
  });

  it('Function HandleOnSampleQuery', () => {
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    const id = 12;
    const instance = touchpointEditor.instance();
    instance.state.tab = 'query';
    instance.state.current.touchpoint = 12;
    instance.state.testQueryResult = '159';
    instance.state.goodQuery = false;
    instance.HandleOnSampleQuery(id);
    expect(instance.state.form.tp_12.status).toEqual(true);
  });

  it('Function TestQuery', async () => {
    const EditorValidateQuery = jest.fn().mockReturnValue({
      testText: 'query return',
      goodQuery: false,
      testQueryValue: 156
    });
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={EditorValidateQuery}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    const query = 'SELECT * FROM ApiCall';
    const accountID = 2710112;
    const type = 'PCC';
    const instance = touchpointEditor.instance();
    instance.state.tab = 'query';
    instance.state.current.touchpoint = 12;
    instance.state.testQueryResult = '159';
    instance.state.goodQuery = false;
    await instance.TestQuery(query, accountID, type);
    expect(instance.state.goodQuery).toEqual(false);
  });

  it('Function RunTest', () => {
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    const instance = touchpointEditor.instance();
    instance.TestQuery = jest.fn();
    instance.state.form.tp_12.queryMeasure = '5 MINUTES AGO';
    instance.RunTest();
    expect(instance.state.current).toEqual({
      stage: 2710,
      step: null,
      subs: { '12': [] },
      touchpoint: 12
    });
  });

  it('HandleOnChange with target = type', () => {
    const touchpointsInterfaceHandle = [
      {
        stage_index: 1,
        value: 'Touchpoint',
        touchpoint_index: 1,
        status_on_off: true,
        queryData: {
          query:
            "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
        },
        level: 'level',
        measure_points: [
          {
            type: 'PRC',
            timeout: 10,
            query:
              "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
          }
        ]
      }
    ];
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterfaceHandle}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    const instance = touchpointEditor.instance();
    const target = 'type';
    const value = 'level';
    const id = 12;
    instance.ChangeOrder = jest.fn();
    instance.HandleOnChange(target, value, id);
    expect(instance.state.current).toEqual({
      stage: 2710,
      step: null,
      subs: {
        '12': []
      },
      touchpoint: 12
    });
  });

  it('HandleOnChange', () => {
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    const instance = touchpointEditor.instance();
    const target = 'title';
    const value = 'substeps';
    const target2 = 'query';
    const value2 =
      "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'";
    const target3 = 'queryAccount';
    const value3 = 2710112;
    const target4 = 'timeout';
    const value4 = 10;
    const target5 = 'queryMeasure';
    const value5 = 0.25;
    const target6 = 'dashboardLink';
    const value6 = 'https://nr1.io';
    const id = 12;
    instance.HandleOnChange(target, value, id);
    expect(instance.state.form.tp_12.title).toEqual(value);
    instance.HandleOnChange(target2, value2, id);
    expect(instance.state.touchpoints[0].queryData.query).toEqual(value2);
    instance.HandleOnChange(target3, value3, id);
    expect(instance.state.touchpoints[0].queryData.accountID).toEqual(value3);
    instance.HandleOnChange(target4, value4, id);
    expect(instance.state.touchpoints[0].queryData.query_timeout).toEqual(
      value4
    );
    instance.HandleOnChange(target5, value5, id);
    expect(instance.state.touchpoints[0].queryData.measure_time).toEqual(
      value5
    );
    instance.HandleOnChange(target6, value6, id);
    expect(instance.state.touchpoints[0].dashboard_url).toEqual(value6);
  });

  it('SetSampleQuery', () => {
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    const touchpointType1 = 'Person-Count';
    const touchpointType2 = 'Process-Count';
    const touchpointType3 = 'Application-Performance';
    const touchpointType4 = 'FrontEnd-Performance';
    const touchpointType5 = 'Synthetics-Check';
    const touchpointType6 = 'Workload-Status';
    const touchpointType7 = 'Drops-Count';
    const touchpointType8 = 'API-Performance';
    const touchpointType9 = 'API-Count';
    const touchpointType10 = 'API-Status';
    const instance = touchpointEditor.instance();
    expect(instance.SetSampleQuery(touchpointType1)).toEqual(
      "SELECT uniqueCount(session) as session FROM PageView WHERE appName='QS' AND name='WebTransaction/Action/'"
    );
    expect(instance.SetSampleQuery(touchpointType2)).toEqual(
      "SELECT count(*) from Transaction WHERE appName='QS' AND name LIKE 'WebTransaction/Action/App%'"
    );
    expect(instance.SetSampleQuery(touchpointType3)).toEqual(
      "SELECT filter(apdex(duration, t:0.028), WHERE 1=1) as apdex, filter( max(duration), WHERE 1=1) as response,filter(percentage(count(*), WHERE error is true), WHERE 1=1) as error from Transaction WHERE appName='QS'"
    );
    expect(instance.SetSampleQuery(touchpointType4)).toEqual(
      "SELECT filter(apdex(duration, t:1), WHERE 1=1) as apdex, filter( max(duration), WHERE 1=1) as response,filter(percentage(count(*), WHERE error is true), WHERE 1=1) as error from PageView WHERE appName='QS'"
    );
    expect(instance.SetSampleQuery(touchpointType5)).toEqual(
      "SELECT filter(percentage(count(result),WHERE result='SUCCESS'),WHERE 1=1) as success, max(duration) as duration, max(longRunningTasksAvgTime) as request from SyntheticCheck,SyntheticRequest WHERE monitorName='BDB Live person'"
    );
    expect(instance.SetSampleQuery(touchpointType6)).toEqual(
      "SELECT latest(statusValue) as statusValue FROM WorkloadStatus WHERE entity.name='ACME Banking'"
    );
    expect(instance.SetSampleQuery(touchpointType7)).toEqual(
      "SELECT count(*) as count FROM Public_APICall WHERE api='adyen.com'"
    );
    expect(instance.SetSampleQuery(touchpointType8)).toEqual(
      "SELECT filter(apdex(duration, t:0.028), WHERE 1=1) as apdex, filter( max(duration), WHERE 1=1) as response,filter(percentage(count(*), WHERE error is true), WHERE 1=1) as error from Transaction WHERE appName='QS'"
    );
    expect(instance.SetSampleQuery(touchpointType9)).toEqual(
      "SELECT count(*) as count FROM Public_APICall WHERE awsRegion='queue'"
    );
    expect(instance.SetSampleQuery(touchpointType10)).toEqual(
      "SELECT percentage(count(*),WHERE isStatus='ok') as percentage from PathpointKpiHealth"
    );
  });

  it('AddTouchpoint', () => {
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    const instance = touchpointEditor.instance();
    instance.AddTouchpoint();
    expect(instance.state.current).toEqual({
      stage: 2710,
      step: null,
      touchpoint: null,
      subs: { '12': [] }
    });
  });

  it('SelectStage', () => {
    const stage = {
      id: 12,
      index: 1,
      oldIndex: 1,
      title: 'Login User',
      type: 'PCC',
      visible: true,
      new: true,
      steps: [
        {
          id: 11,
          value: 'new',
          sub_steps: []
        }
      ],
      touchpoints: [
        {
          id: 12,
          stage_index: 1,
          value: 'Touchpoint',
          touchpoint_index: 1,
          status_on_off: true,
          queryData: {
            query:
              "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
          }
        }
      ]
    };
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    const instance = touchpointEditor.instance();
    instance.SelectStage(stage);
    expect(instance.state.form).toEqual({
      tp_12: {
        dashboardLink: undefined,
        query:
          "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
        queryAccount: 2710112,
        queryMeasure: 0.25,
        status: true,
        timeout: 10,
        title: undefined,
        type: 'Unknown'
      }
    });
    expect(instance.state.touchpointTypes).toEqual([
      {
        longName: 'Person-Count',
        shortName: 'PRC'
      },
      {
        longName: 'Process-Count',
        shortName: 'PCC'
      },
      {
        longName: 'Application-Performance',
        shortName: 'APP'
      },
      {
        longName: 'FrontEnd-Performance',
        shortName: 'FRT'
      },
      {
        longName: 'Synthetics-Check',
        shortName: 'SYN'
      },
      {
        longName: 'Workload-Status',
        shortName: 'WLD'
      },
      {
        longName: 'Drops-Count',
        shortName: 'DRP'
      },
      {
        longName: 'API-Performance',
        shortName: 'API'
      },
      {
        longName: 'API-Count',
        shortName: 'APC'
      },
      {
        longName: 'API-Status',
        shortName: 'APS'
      }
    ]);
  });

  it('handleStepsEditorSubmit', () => {
    const e = {
      preventDefault: jest.fn()
    };
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    const instance = touchpointEditor.instance();
    instance.handleStepsEditorSubmit(e);
    expect(instance.state.tab).toEqual('mapping');
    expect(instance.state.touchpointTypes).toEqual([
      {
        longName: 'Person-Count',
        shortName: 'PRC'
      },
      {
        longName: 'Process-Count',
        shortName: 'PCC'
      },
      {
        longName: 'Application-Performance',
        shortName: 'APP'
      },
      {
        longName: 'FrontEnd-Performance',
        shortName: 'FRT'
      },
      {
        longName: 'Synthetics-Check',
        shortName: 'SYN'
      },
      {
        longName: 'Workload-Status',
        shortName: 'WLD'
      },
      {
        longName: 'Drops-Count',
        shortName: 'DRP'
      },
      {
        longName: 'API-Performance',
        shortName: 'API'
      },
      {
        longName: 'API-Count',
        shortName: 'APC'
      },
      {
        longName: 'API-Status',
        shortName: 'APS'
      }
    ]);
  });

  it('CancelDelete', () => {
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    const instance = touchpointEditor.instance();
    instance.CancelDelete();
    expect(instance.state.delete).toEqual({
      show: false,
      title: ''
    });
  });

  it('SelectRow', () => {
    const id = 12;
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    const instance = touchpointEditor.instance();
    instance.SelectRow(id);
    expect(instance.state.tab).toEqual('mapping');
    expect(instance.state.current).toEqual({
      stage: 2710,
      step: null,
      touchpoint: 12,
      subs: { '12': [] }
    });
  });

  it('SelectRow !item.visible', () => {
    const id = 12;
    const stagesInterfaceSelectRow = [
      {
        id: 2710,
        index: 1,
        oldIndex: 1,
        title: 'Login User',
        type: 'PCC',
        visible: false,
        new: true,
        steps: [
          {
            id: 11,
            value: 'new',
            visible: false,
            sub_steps: [
              {
                index: 1,
                value: 1,
                latency: true,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              }
            ]
          },
          {
            id: 12,
            value: 'new',
            visible: false,
            sub_steps: [
              {
                index: 1,
                value: 1,
                latency: true,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              }
            ]
          }
        ],
        touchpoints: [
          {
            stage_index: 1,
            value: 'Touchpoint',
            touchpoint_index: 1,
            status_on_off: true,
            relation_steps: [1],
            visible: false,
            queryData: {
              query:
                "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
            },
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
    ];
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterfaceSelectRow}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    const instance = touchpointEditor.instance();
    instance.state.current = {
      stage: 2710,
      step: null,
      touchpoint: 12,
      subs: { '13': [] }
    };
    instance.SelectRow(id);
    expect(instance.state.tab).toEqual('mapping');
    expect(instance.state.current).toEqual({
      stage: 2710,
      step: null,
      touchpoint: 12,
      subs: { '12': [], '13': [] }
    });
  });
  it('ToggleSelectMapping', () => {
    const value = 'value';
    const clickStage = jest.fn();
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
        SelectTab={clickStage}
      />
    );
    const instance = touchpointEditor.instance();
    instance.state.current.touchpoint = '12';
    instance.state.current.subs = {
      '12': ['value', 'no_value']
    };
    instance.ToggleSelectMapping(value);
    touchpointEditor
      .find('input')
      .at(0)
      .simulate('click');
    expect(clickStage).toHaveBeenCalledTimes(0);
    expect(instance.state.tab).toEqual('mapping');
    expect(instance.state.current).toEqual({
      stage: 2710,
      step: null,
      touchpoint: '12',
      subs: { '12': ['no_value'] }
    });
  });

  it('ToggleSelectMapping with finded = false', () => {
    const value = 'value';
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    const instance = touchpointEditor.instance();
    instance.state.current.touchpoint = 12;
    instance.state.current.subs = {
      '12': ['no_value']
    };
    instance.ToggleSelectMapping(value);
    expect(instance.state.tab).toEqual('mapping');
    expect(instance.state.current).toEqual({
      stage: 2710,
      step: null,
      touchpoint: 12,
      subs: { '12': ['no_value', 'value'] }
    });
  });

  it('SelectTab', () => {
    const tab = 'test_tab';
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    const instance = touchpointEditor.instance();
    instance.SelectTab(tab);
    expect(instance.state.tab).toEqual('test_tab');
  });

  it('DeleteConfirmation', () => {
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
        CancelDelete={jest.fn()}
      />
    );
    const instance = touchpointEditor.instance();
    instance.state.current.touchpoint = 13;
    instance.DeleteConfirmation();
    expect(instance.state.touchpoints).toEqual([
      {
        stage_index: 1,
        value: 'Touchpoint',
        touchpoint_index: 1,
        status_on_off: true,
        relation_steps: [1],
        queryData: {
          accountID: 2710112,
          measure_time: 0.25,
          query_timeout: 10,
          type: 'Unknown',
          query:
            "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'"
        },
        measure_points: [
          {
            accountID: 1,
            max_count: 110,
            measure_time: '15 minutes ago',
            min_count: 10,
            query:
              "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
            session_count: 0,
            timeout: 10,
            type: 'PRC'
          }
        ],
        stageId: 2710,
        visible: true,
        id: 12
      }
    ]);
  });

  it('ToggleOnOff', () => {
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    const instance = touchpointEditor.instance();
    instance.ToggleOnOff();
    expect(instance.state.form).toEqual({
      tp_12: {
        title: undefined,
        type: 'Unknown',
        status: false,
        query:
          "SELECT count(*) as session FROM Public_APICall WHERE awsRegion='queue'",
        queryAccount: 2710112,
        queryMeasure: 0.25,
        timeout: 10,
        dashboardLink: undefined
      }
    });
  });

  it('HandleOnChangeTune', () => {
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    const value = { target: { name: 'PCC', value: 'PCC' } };
    const instance = touchpointEditor.instance();
    instance.HandleOnChangeTune(value);
    expect(instance.state.touchpoints[0].queryData.PCC).toEqual('PCC');
  });

  it('RenderTuneField', () => {
    const name = 'Tune_name';
    const label = 'show_Tune_label';
    const defaultValue = 'new';
    const id = 127;
    const onChange = jest.fn();
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    const instance = touchpointEditor.instance();
    const result = instance.RenderTuneField(
      name,
      label,
      defaultValue,
      id,
      onChange
    );
    expect(result).toBeTruthy();
  });

  it('RenderTuneForm', () => {
    const touchpointEditor = shallow(
      <BodyTouchpointsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        touchpointsInterface={touchpointsInterface}
        EditorValidateQuery={jest.fn()}
        handleChange={jest.fn()}
        accountIDs={accountIDs}
        CancelDelete={jest.fn()}
      />
    );
    const instance = touchpointEditor.instance();
    instance.state.touchpoints[0].queryData.type = 'Person-Count';
    instance.state.current.touchpoint = 12;
    const result = instance.RenderTuneForm();
    expect(result).toBeTruthy();
    instance.state.touchpoints[0].queryData.type = 'Process-Count';
    expect(instance.RenderTuneForm()).toBeTruthy();
    instance.state.touchpoints[0].queryData.type = 'Application-Performance';
    expect(instance.RenderTuneForm()).toBeTruthy();
    instance.state.touchpoints[0].queryData.type = 'FrontEnd-Performance';
    expect(instance.RenderTuneForm()).toBeTruthy();
    instance.state.touchpoints[0].queryData.type = 'API-Performance';
    expect(instance.RenderTuneForm()).toBeTruthy();
    instance.state.touchpoints[0].queryData.type = 'Synthetics-Check';
    expect(instance.RenderTuneForm()).toBeTruthy();
    instance.state.touchpoints[0].queryData.type = 'Workload-Status';
    expect(instance.RenderTuneForm()).toBeTruthy();
    instance.state.touchpoints[0].queryData.type = 'Drops-Count';
    expect(instance.RenderTuneForm()).toBeTruthy();
    instance.state.touchpoints[0].queryData.type = 'API-Count';
    expect(instance.RenderTuneForm()).toBeTruthy();
    instance.state.touchpoints[0].queryData.type = 'API-Status';
    expect(instance.RenderTuneForm()).toBeTruthy();
  });
});
