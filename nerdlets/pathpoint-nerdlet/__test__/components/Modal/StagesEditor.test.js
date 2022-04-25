import React from 'react';
import {
  HeaderStagesEditor,
  BodyStagesEditor
} from '../../../components/Modal/StagesEditor';
import { shallow } from 'enzyme';

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
        index: 1,
        name: 'touchpint'
      }
    ]
  }
];

describe('<HeaderStagesEditor/>', () => {
  it('componentDidMount', () => {
    const componentDidMountSpy = jest.spyOn(
      HeaderStagesEditor.prototype,
      'componentDidMount'
    );
    shallow(
      <HeaderStagesEditor
        HideIcon={jest.fn()}
        ShowIcon={jest.fn()}
        DisplayIcon={jest.fn()}
        NoDisplayIcon={jest.fn()}
      />
    );
    expect(
      HeaderStagesEditor.prototype.componentDidMount
    ).toHaveBeenCalledTimes(1);
    componentDidMountSpy.mockClear();
  });

  it('componentWillUnmount', () => {
    const componentWillUnmountSpy = jest.spyOn(
      HeaderStagesEditor.prototype,
      'componentWillUnmount'
    );
    const stagesEditor = shallow(
      <HeaderStagesEditor
        HideIcon={jest.fn()}
        ShowIcon={jest.fn()}
        DisplayIcon={jest.fn()}
        NoDisplayIcon={jest.fn()}
      />
    );
    const instance = stagesEditor.instance();
    instance.componentWillUnmount();
    expect(
      HeaderStagesEditor.prototype.componentWillUnmount
    ).toHaveBeenCalledTimes(1);
    componentWillUnmountSpy.mockClear();
  });

  it('DisplayIcon', () => {
    const clickStage = jest.fn();
    const stagesEditor = shallow(
      <HeaderStagesEditor
        DisplayIcon={jest.fn()}
        DispatchCustomEvent={clickStage}
      />
    );
    const instance = stagesEditor.instance();
    instance.DisplayIcon();
    stagesEditor
      .find('#ChangeVisibleStageEditor')
      .at(0)
      .simulate('click');
    expect(clickStage).toHaveBeenCalledTimes(0);
    expect(instance.state).toEqual({ show: true, hide: false });
  });

  it('NoDisplayIcon', () => {
    const clickStage = jest.fn();
    const stagesEditor = shallow(
      <HeaderStagesEditor
        NoDisplayIcon={jest.fn()}
        DispatchCustomEvent={clickStage}
      />
    );
    const instance = stagesEditor.instance();
    instance.NoDisplayIcon();
    expect(instance.state).toEqual({ show: false, hide: false });
    stagesEditor
      .find('#DuplicateStageEditor')
      .at(0)
      .simulate('click');
    expect(clickStage).toHaveBeenCalledTimes(0);
  });

  it('HideIcon', () => {
    const stagesEditor = shallow(<HeaderStagesEditor HideIcon={jest.fn()} />);
    const instance = stagesEditor.instance();
    instance.HideIcon();
    expect(instance.state).toEqual({ show: false, hide: true });
  });

  it('ShowIcon', () => {
    const stagesEditor = shallow(<HeaderStagesEditor ShowIcon={jest.fn()} />);
    const instance = stagesEditor.instance();
    instance.ShowIcon();
    expect(instance.state).toEqual({ show: false, hide: false });
  });

  it('DispatchCustomEvent', () => {
    const name = 'ejemplo';
    const clickStage = jest.fn();
    const stagesEditor = shallow(
      <HeaderStagesEditor
        ShowIcon={jest.fn()}
        DispatchCustomEvent={jest.fn()}
      />
    );
    const instance = stagesEditor.instance();
    instance.DispatchCustomEvent(name);
    stagesEditor
      .find('#DeleteStageGUIEditor')
      .at(0)
      .simulate('click');
    expect(clickStage).toHaveBeenCalledTimes(0);
  });
});

describe('<BodyStagesEditor/>', () => {
  it('componentDidMount', () => {
    const componentDidMountSpy = jest.spyOn(
      BodyStagesEditor.prototype,
      'componentDidMount'
    );
    const clickStage = jest.fn();
    const stagesEditor = shallow(
      <BodyStagesEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        DispatchCustomEvent={jest.fn()}
        DeleteStage={jest.fn()}
        DuplicateStage={jest.fn()}
        SaveSuccess={jest.fn()}
        ToggleHideStage={jest.fn()}
        HandleOnChange={clickStage}
      />
    );
    stagesEditor
      .find('DropdownItem')
      .at(0)
      .simulate('click');
    expect(clickStage).toHaveBeenCalledTimes(0);
    stagesEditor
      .find('DropdownItem')
      .at(1)
      .simulate('click');
    expect(clickStage).toHaveBeenCalledTimes(0);
    stagesEditor
      .find('DropdownItem')
      .at(2)
      .simulate('click');
    expect(clickStage).toHaveBeenCalledTimes(0);
    const e = { target: { value: 'someFunction' } };
    stagesEditor
      .find('TextField')
      .at(0)
      .simulate('change', e);
    expect(clickStage).toHaveBeenCalledTimes(0);
    stagesEditor
      .find('input')
      .at(0)
      .simulate('change');
    expect(clickStage).toHaveBeenCalledTimes(0);
    expect(BodyStagesEditor.prototype.componentDidMount).toHaveBeenCalledTimes(
      1
    );
    componentDidMountSpy.mockClear();
  });

  it('componentWillUnmount', () => {
    const componentWillUnmountSpy = jest.spyOn(
      BodyStagesEditor.prototype,
      'componentWillUnmount'
    );
    const stagesEditor = shallow(
      <BodyStagesEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        DispatchCustomEvent={jest.fn()}
        DeleteStage={jest.fn()}
        DuplicateStage={jest.fn()}
        SaveSuccess={jest.fn()}
        ChangeVisibleStageEditor={jest.fn()}
      />
    );
    const instance = stagesEditor.instance();
    instance.componentWillUnmount();
    expect(
      BodyStagesEditor.prototype.componentWillUnmount
    ).toHaveBeenCalledTimes(1);
    componentWillUnmountSpy.mockClear();
  });

  it('SaveSuccess', () => {
    const stagesEditor = shallow(
      <BodyStagesEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        ChangeVisibleStageEditor={jest.fn()}
        DispatchCustomEvent={jest.fn()}
      />
    );
    const instance = stagesEditor.instance();
    instance.SaveSuccess();
    expect(instance.state.current).toEqual(null);
  });

  it('DuplicateStage', () => {
    const stagesEditor = shallow(
      <BodyStagesEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
      />
    );
    const instance = stagesEditor.instance();
    instance.DuplicateStage();
    expect(instance.state.current).toEqual(null);
    expect(instance.state.stages.length).toEqual(2);
  });

  it('DeleteStage', () => {
    const stagesEditor = shallow(
      <BodyStagesEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
      />
    );
    const instance = stagesEditor.instance();
    instance.DeleteStage();
    expect(instance.state.action).toEqual('delete');
  });

  it('ToggleHideStage', () => {
    const stagesEditor = shallow(
      <BodyStagesEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        ChangeVisibleStageEditor={jest.fn()}
      />
    );
    const instance = stagesEditor.instance();
    instance.state.stages.visible = true;
    instance.ToggleHideStage();
    expect(instance.state.action).toEqual('hide');
  });

  it('SelectRow same id and item visible', () => {
    const stagesEditor = shallow(
      <BodyStagesEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        DispatchCustomEvent={jest.fn()}
      />
    );
    const id = 2710;
    const instance = stagesEditor.instance();
    instance.state.stages.visible = true;
    instance.SelectRow(id);
    expect(instance.state.current).toEqual(2710);
  });

  it('ChangeVisibleStageEditor', () => {
    const stagesEditor = shallow(
      <BodyStagesEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        DispatchCustomEvent={jest.fn()}
      />
    );
    const instance = stagesEditor.instance();
    instance.ChangeVisibleStageEditor();
    expect(instance.state.current).toEqual(null);
  });

  it('ToggleHideStage with visible = false', () => {
    const stagesEditor = shallow(
      <BodyStagesEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        ChangeVisibleStageEditor={jest.fn()}
      />
    );
    const instance = stagesEditor.instance();
    instance.ChangeVisibleStageEditor = jest.fn();
    instance.ToggleHideStage();
    expect(instance.state.action).toEqual('');
  });

  it('HandleOnChange', () => {
    const stagesEditor = shallow(
      <BodyStagesEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        ChangeVisibleStageEditor={jest.fn()}
        ChangeOrder={jest.fn()}
      />
    );
    const target = 'order';
    const value = '2710';
    const id = 2710;
    const instance = stagesEditor.instance();
    instance.ChangeOrder = jest.fn();
    instance.HandleOnChange(target, value, id);
    expect(instance.state.form).toEqual({
      stage_2710: {
        title: 'Login User',
        order: '2710',
        type: 'PCC',
        visible: false
      }
    });
  });

  it('SelectRow same id', () => {
    const stagesEditor = shallow(
      <BodyStagesEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        DispatchCustomEvent={jest.fn()}
      />
    );
    const id = 2710;
    const instance = stagesEditor.instance();
    instance.SelectRow(id);
    expect(instance.state.current).toEqual(2710);
  });

  it('SelectRow', () => {
    const stagesEditor = shallow(
      <BodyStagesEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        DispatchCustomEvent={jest.fn()}
      />
    );
    const id = 12;
    const instance = stagesEditor.instance();
    instance.SelectRow(id);
    expect(instance.state.current).toEqual(12);
  });

  it('AddNewStage', () => {
    const stagesInterfaceAdd = [
      {
        id: 2711,
        index: 13,
        oldIndex: 12,
        title: 'Login User',
        type: 'PCC',
        visible: true,
        new: true,
        steps: [
          {
            id: 17,
            value: 'new-step',
            sub_steps: [
              {
                index: 11,
                value: 11,
                latency: true,
                id: 'ST1-LINE1-SS2',
                relationship_touchpoints: [1]
              }
            ]
          }
        ]
      }
    ];
    const stagesEditor = shallow(
      <BodyStagesEditor
        stagesInterface={stagesInterfaceAdd}
        handleStagesEditorSubmit={jest.fn()}
        DispatchCustomEvent={jest.fn()}
      />
    );
    const instance = stagesEditor.instance();
    instance.AddNewStage();
    expect(instance.state.form).toEqual({
      stage_2711: {
        title: 'Login User',
        order: 1,
        type: 'PCC',
        visible: true
      },
      stage_12: { order: 2, title: 'New Stage', type: 'People', visible: true }
    });
  });

  it('handleStagesEditorSubmit', () => {
    const e = {
      preventDefault: jest.fn()
    };
    const stagesInterfaceHandle = [
      {
        id: '2710',
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
            index: 1,
            name: 'touchpint'
          }
        ]
      },
      {
        id: '2711',
        index: 2,
        oldIndex: 2,
        title: 'Login User',
        type: 'PCC',
        visible: true,
        new: true,
        steps: [
          {
            id: 13,
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
            index: 1,
            name: 'touchpint'
          }
        ]
      }
    ];
    const stagesEditor = shallow(
      <BodyStagesEditor
        stagesInterface={stagesInterfaceHandle}
        handleStagesEditorSubmit={jest.fn()}
        DispatchCustomEvent={jest.fn()}
      />
    );
    const instance = stagesEditor.instance();
    instance.handleStagesEditorSubmit(e);
    expect(instance.state.current).toEqual('2710');
  });

  it('CancelDelete', () => {
    const stagesEditor = shallow(
      <BodyStagesEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        DispatchCustomEvent={jest.fn()}
      />
    );
    const instance = stagesEditor.instance();
    instance.CancelDelete();
    expect(instance.state.delete).toEqual({
      show: false,
      steps: 0,
      title: '',
      touchpoints: 0
    });
  });

  it('DeleteConfirmation', () => {
    const stagesEditor = shallow(
      <BodyStagesEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        DispatchCustomEvent={jest.fn()}
      />
    );
    const instance = stagesEditor.instance();
    instance.state.action = 'delete';
    instance.state.current = 2711;
    instance.CancelDelete = jest.fn();
    instance.DeleteConfirmation();
    expect(instance.state.current).toEqual(null);
  });

  it('DeleteConfirmation with action != delete', () => {
    const stagesEditor = shallow(
      <BodyStagesEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        DispatchCustomEvent={jest.fn()}
      />
    );
    const instance = stagesEditor.instance();
    instance.state.current = 2711;
    instance.ChangeVisibleStageEditor = jest.fn();
    instance.CancelDelete = jest.fn();
    instance.DeleteConfirmation();
    expect(instance.state.stages[0].visible).toEqual(false);
    expect(instance.state.current).toEqual(2711);
  });

  it('ChangeOrder', () => {
    const stagesEditor = shallow(
      <BodyStagesEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        ChangeVisibleStageEditor={jest.fn()}
        ChangeOrder={jest.fn()}
      />
    );
    const value = 1;
    const id = 2710;
    const instance = stagesEditor.instance();
    instance.ChangeOrder(id, value);
    expect(instance.state.form).toEqual({
      stage_2710: {
        title: 'Login User',
        order: 1,
        type: 'PCC',
        visible: false
      }
    });
  });

  it('ChangeOrder with id != stage.id', () => {
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
          }
        ],
        touchpoints: [
          {
            index: 1,
            name: 'touchpint'
          }
        ]
      },
      {
        id: 2711,
        index: 2,
        oldIndex: 1,
        title: 'Count Total user',
        type: 'PRC',
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
            index: 1,
            name: 'touchpint'
          }
        ]
      }
    ];
    const stagesEditor = shallow(
      <BodyStagesEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
        ChangeVisibleStageEditor={jest.fn()}
        ChangeOrder={jest.fn()}
      />
    );
    const value = 1;
    const id = 2710;
    const instance = stagesEditor.instance();
    instance.ChangeOrder(id, value);
    expect(instance.state.form).toEqual({
      stage_2710: {
        title: 'Login User',
        order: 1,
        type: 'PCC',
        visible: true
      },
      stage_2711: {
        title: 'Count Total user',
        order: 2,
        type: 'PRC',
        visible: true
      }
    });
  });
});
