import React from 'react';
import {
  HeaderStepsEditor,
  BodyStepsEditor
} from '../../../components/Modal/StepsEditor';
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
    ]
  }
];

describe('<HeaderStepsEditor/>', () => {
  it('componentDidMount', () => {
    const componentDidMountSpy = jest.spyOn(
      HeaderStepsEditor.prototype,
      'componentDidMount'
    );
    shallow(
      <HeaderStepsEditor
        HideIcon={jest.fn()}
        ShowIcon={jest.fn()}
        DisplayIcon={jest.fn()}
        NoDisplayIcon={jest.fn()}
      />
    );
    expect(HeaderStepsEditor.prototype.componentDidMount).toHaveBeenCalledTimes(
      1
    );
    componentDidMountSpy.mockClear();
  });

  it('componentWillUnmount', () => {
    const componentWillUnmountSpy = jest.spyOn(
      HeaderStepsEditor.prototype,
      'componentWillUnmount'
    );
    const stepsEditor = shallow(
      <HeaderStepsEditor
        HideIcon={jest.fn()}
        ShowIcon={jest.fn()}
        DisplayIcon={jest.fn()}
        NoDisplayIcon={jest.fn()}
      />
    );
    const instance = stepsEditor.instance();
    instance.componentWillUnmount();
    expect(
      HeaderStepsEditor.prototype.componentWillUnmount
    ).toHaveBeenCalledTimes(1);
    componentWillUnmountSpy.mockClear();
  });

  it('DisplayIcon', () => {
    const clickStage = jest.fn();
    const stepsEditor = shallow(
      <HeaderStepsEditor
        HideIcon={jest.fn()}
        ShowIcon={jest.fn()}
        DisplayIcon={jest.fn()}
        NoDisplayIcon={jest.fn()}
      />
    );
    const instance = stepsEditor.instance();
    instance.ShowIcon();
    instance.DisplayIcon();
    stepsEditor
      .find('#ChangeVisibleStepEditor')
      .at(0)
      .simulate('click');
    expect(clickStage).toHaveBeenCalledTimes(0);
    expect(instance.state).toEqual({ show: true, hide: false });
  });

  it('Duplicate', () => {
    const clickStage = jest.fn();
    const stepsEditor = shallow(
      <HeaderStepsEditor
        ShowIcon={jest.fn()}
        DisplayIcon={jest.fn()}
        DispatchCustomEvent={clickStage}
      />
    );
    const instance = stepsEditor.instance();
    instance.ShowIcon();
    instance.DisplayIcon();
    stepsEditor
      .find('#DuplicateStepEditor')
      .at(0)
      .simulate('click');
    expect(clickStage).toHaveBeenCalledTimes(0);
    expect(instance.state).toEqual({ show: true, hide: false });
  });

  it('Delete', () => {
    const clickStage = jest.fn();
    const stepsEditor = shallow(
      <HeaderStepsEditor
        ShowIcon={jest.fn()}
        DisplayIcon={jest.fn()}
        DispatchCustomEvent={clickStage}
      />
    );
    const instance = stepsEditor.instance();
    instance.ShowIcon();
    instance.DisplayIcon();
    stepsEditor
      .find('#DeleteStepEditor')
      .at(0)
      .simulate('click');
    expect(clickStage).toHaveBeenCalledTimes(0);
    expect(instance.state).toEqual({ show: true, hide: false });
  });
});

describe('<BodyStepsEditor/>', () => {
  it('componentDidMount', () => {
    const stagesInterfaceDidMount = [
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
        ]
      },
      {
        id: 2711,
        index: 2,
        oldIndex: 2,
        title: 'Login User',
        type: 'PCC',
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
        ]
      }
    ];
    const componentDidMountSpy = jest.spyOn(
      BodyStepsEditor.prototype,
      'componentDidMount'
    );
    const clickStage = jest.fn();
    const stepEditor = shallow(
      <BodyStepsEditor
        stagesInterface={stagesInterfaceDidMount}
        HandleOnChange={clickStage}
      />
    );
    stepEditor
      .find('DropdownItem')
      .at(0)
      .simulate('click');
    expect(clickStage).toHaveBeenCalledTimes(0);
    stepEditor
      .find('input')
      .at(0)
      .simulate('change');
    expect(clickStage).toHaveBeenCalledTimes(0);
    stepEditor
      .find('#SelectStage')
      .at(0)
      .simulate('click');
    expect(clickStage).toHaveBeenCalledTimes(0);
    stepEditor
      .find('#RemoveStep')
      .at(0)
      .simulate('click');
    expect(clickStage).toHaveBeenCalledTimes(0);
    expect(BodyStepsEditor.prototype.componentDidMount).toHaveBeenCalledTimes(
      1
    );
    componentDidMountSpy.mockClear();
  });

  it('componentDidMount without steps[0].visible', () => {
    const stagesInterfaceDidMount = [
      {
        id: 2710,
        index: 1,
        oldIndex: 1,
        title: 'Login User',
        type: 'PCC',
        new: true,
        steps: [
          {
            id: 11,
            visible: false,
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
        ]
      }
    ];
    const componentDidMountSpy = jest.spyOn(
      BodyStepsEditor.prototype,
      'componentDidMount'
    );
    shallow(<BodyStepsEditor stagesInterface={stagesInterfaceDidMount} />);
    expect(BodyStepsEditor.prototype.componentDidMount).toHaveBeenCalledTimes(
      1
    );
    componentDidMountSpy.mockClear();
  });

  it('componentWillUnmount', () => {
    const componentWillUnmountSpy = jest.spyOn(
      BodyStepsEditor.prototype,
      'componentWillUnmount'
    );
    const stepsEditor = shallow(
      <BodyStepsEditor
        stagesInterface={stagesInterface}
        DuplicateStep={jest.fn()}
        DeleteStep={jest.fn()}
        ToggleVisible={jest.fn()}
      />
    );
    const instance = stepsEditor.instance();
    instance.componentWillUnmount();
    expect(
      BodyStepsEditor.prototype.componentWillUnmount
    ).toHaveBeenCalledTimes(1);
    componentWillUnmountSpy.mockClear();
  });

  it('ToggleVisible', () => {
    const stepsEditor = shallow(
      <BodyStepsEditor stagesInterface={stagesInterface} />
    );
    const instance = stepsEditor.instance();
    instance.ToggleVisible();
    expect(instance.state.steps[0].visible).toEqual(false);
  });

  it('DeleteStep', () => {
    const stepsEditor = shallow(
      <BodyStepsEditor stagesInterface={stagesInterface} />
    );
    const instance = stepsEditor.instance();
    instance.DeleteStep();
    expect(instance.state.delete.title).toEqual('Stage at level 1');
  });

  it('DuplicateStep', () => {
    const stepsEditor = shallow(
      <BodyStepsEditor stagesInterface={stagesInterface} />
    );
    const instance = stepsEditor.instance();
    instance.DuplicateStep();
    expect(instance.state.steps.length).toEqual(3);
    expect(instance.state.current.stage).toEqual(2710);
  });

  it('HandleOnChange() with target = level', () => {
    const clickStage = jest.fn();
    const stepsEditor = shallow(
      <BodyStepsEditor
        stagesInterface={stagesInterface}
        HandleOnChange={clickStage}
      />
    );
    const instance = stepsEditor.instance();
    const target = 'level';
    const value = 1;
    const id = 11;
    instance.ChangeOrder = jest.fn();
    instance.HandleOnChange(target, value, id);
    const e = { target: { value: 'someFunction' } };
    stepsEditor
      .find('TextField')
      .at(0)
      .simulate('change', e);
    expect(clickStage).toHaveBeenCalledTimes(0);
    expect(instance.state.form).toEqual({
      step_11: { index: 1, level: 1, substeps: 'someFunction' },
      step_12: { index: 2, level: 2, substeps: '' }
    });
  });

  it('HandleOnChange() with target = substeps', () => {
    const stepsEditor = shallow(
      <BodyStepsEditor stagesInterface={stagesInterface} />
    );
    const instance = stepsEditor.instance();
    const target = 'substeps';
    const value = 'A,B,C,D';
    const id = 11;
    instance.ChangeSubsteps = jest.fn();
    instance.HandleOnChange(target, value, id);
    expect(instance.state.form).toEqual({
      step_11: { index: 1, level: 1, substeps: 'A,B,C,D' },
      step_12: { index: 2, level: 2, substeps: '' }
    });
  });

  it('ChangeSubsteps', () => {
    const stepsEditor = shallow(
      <BodyStepsEditor
        stagesInterface={stagesInterface}
        DuplicateStep={jest.fn()}
        DeleteStep={jest.fn()}
        ToggleVisible={jest.fn()}
      />
    );
    const instance = stepsEditor.instance();
    const value = '11';
    const id = 11;
    instance.ChangeSubsteps(id, value);
    expect(instance.state.form).toEqual({
      step_11: { index: 1, level: 1, substeps: ' 1' },
      step_12: { index: 2, level: 2, substeps: '' }
    });
  });

  it('ChangeSubsteps item.trim = sub.value', () => {
    const stagesInterfaceChange = [
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
                index: 11,
                value: '11',
                latency: true,
                id: 'ST1-LINE1-SS1',
                relationship_touchpoints: [1]
              }
            ]
          }
        ]
      }
    ];
    const stepsEditor = shallow(
      <BodyStepsEditor
        stagesInterface={stagesInterfaceChange}
        DuplicateStep={jest.fn()}
        DeleteStep={jest.fn()}
        ToggleVisible={jest.fn()}
      />
    );
    const instance = stepsEditor.instance();
    const value = '11';
    const id = 11;
    instance.ChangeSubsteps(id, value);
    expect(instance.state.form).toEqual({
      step_11: { index: 1, level: 1, substeps: ' 11' }
    });
  });

  it('SelectStage', () => {
    const stage = {
      id: 'id',
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
      ]
    };
    const stepsEditor = shallow(
      <BodyStepsEditor stagesInterface={stagesInterface} />
    );
    const instance = stepsEditor.instance();
    instance.SelectStage(stage);
    expect(instance.state.form).toEqual({
      step_11: { index: 1, level: 1, substeps: ' 1' },
      step_12: { index: 2, level: 2, substeps: '' }
    });
  });

  it('handleStepsEditorSubmit', () => {
    const e = {
      preventDefault: jest.fn()
    };
    const stepsEditor = shallow(
      <BodyStepsEditor
        stagesInterface={stagesInterface}
        handleStagesEditorSubmit={jest.fn()}
      />
    );
    const instance = stepsEditor.instance();
    instance.handleStepsEditorSubmit(e);
    expect(instance.state.form).toEqual({
      step_11: { index: 1, level: 1, substeps: ' 1' },
      step_12: { index: 2, level: 2, substeps: '' }
    });
  });

  it('SelectRow', () => {
    const stepsEditor = shallow(
      <BodyStepsEditor
        stagesInterface={stagesInterface}
        GetSubstepsText={jest.fn()}
      />
    );
    const id = 11;
    const instance = stepsEditor.instance();
    instance.SelectRow(id);
    expect(instance.state.form).toEqual({
      step_11: { index: 1, level: 1, substeps: ' 1' },
      step_12: { index: 2, level: 2, substeps: '' }
    });
  });

  it('SelectRow without step.visible', () => {
    const stagesInterfaceSelect = [
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
          }
        ]
      }
    ];
    const stepsEditor = shallow(
      <BodyStepsEditor
        stagesInterface={stagesInterfaceSelect}
        GetSubstepsText={jest.fn()}
      />
    );
    const id = 11;
    const instance = stepsEditor.instance();
    instance.SelectRow(id);
    expect(instance.state.form).toEqual({
      step_11: { index: 1, level: 1, substeps: ' 1' }
    });
  });

  it('ChangeOrder', () => {
    const stepsEditor = shallow(
      <BodyStepsEditor
        stagesInterface={stagesInterface}
        GetSubstepsText={jest.fn()}
      />
    );
    const value = '11';
    const id = 11;
    const instance = stepsEditor.instance();
    instance.ChangeOrder(id, value);
    expect(instance.state.form).toEqual({
      step_11: { index: 2, level: 2, substeps: ' 1' },
      step_12: { index: 1, level: 1, substeps: '' }
    });
  });

  it('AddNewLevel', () => {
    const stagesInterfaceAdd = [
      {
        id: 2711,
        index: 14,
        oldIndex: 13,
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
                index: 22,
                value: 22,
                latency: true,
                id: 'ST1-LINE1-SS2',
                relationship_touchpoints: [1]
              }
            ]
          }
        ]
      }
    ];
    const stepsEditor = shallow(
      <BodyStepsEditor
        stagesInterface={stagesInterfaceAdd}
        GetSubstepsText={jest.fn()}
      />
    );
    const instance = stepsEditor.instance();
    instance.GetSubstepsText = jest.fn().mockReturnValue('11');
    instance.AddNewLevel();
    expect(instance.state.form).toEqual({
      step_17: { index: 1, level: 1, substeps: ' 22' },
      step_12: { index: 2, level: 2, substeps: '' }
    });
  });

  it('DeleteConfirmation', () => {
    const stepsEditor = shallow(
      <BodyStepsEditor
        stagesInterface={stagesInterface}
        CancelDelete={jest.fn()}
      />
    );
    const instance = stepsEditor.instance();
    instance.DeleteConfirmation();
    expect(instance.state.form).toEqual({
      step_11: { index: 1, level: 1, substeps: ' 1' },
      step_12: { index: 1, level: 1, substeps: '' }
    });
  });

  it('RemoveSubStep', () => {
    const stepsEditor = shallow(
      <BodyStepsEditor
        stagesInterface={stagesInterface}
        CancelDelete={jest.fn()}
      />
    );
    const instance = stepsEditor.instance();
    const step = 11;
    const sub = '11';
    instance.RemoveSubStep(step, sub);
    expect(instance.state.form).toEqual({
      step_11: { index: 1, level: 1, substeps: ' 1' },
      step_12: { index: 2, level: 2, substeps: '' }
    });
  });
});
