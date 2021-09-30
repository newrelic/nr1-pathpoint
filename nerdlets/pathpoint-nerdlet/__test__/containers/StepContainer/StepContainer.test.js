import React from 'react';
import { shallow } from 'enzyme';
import StepContainer from '../../../containers/StepContainer/StepContainer';

describe('<StepContainer/>', () => {
  it('Steps with substeps', () => {
    const steps = [
      {
        value: '',
        sub_steps: [
          {
            index: 1,
            id: 'ST1-LINE2-SS1',
            canary_state: false,
            latency: false,
            value: 'Login',
            dark: false,
            sixth_sense: false,
            history_error: false,
            dotted: true,
            highlighted: false,
            error: false,
            index_stage: 1,
            relationship_touchpoints: [3]
          },
          {
            index: 2,
            id: 'ST1-LINE2-SS2',
            canary_state: false,
            latency: false,
            value: 'Signup',
            dark: false,
            sixth_sense: false,
            history_error: false,
            dotted: false,
            highlighted: false,
            error: false,
            index_stage: 1,
            relationship_touchpoints: [4]
          }
        ]
      },
      {
        index: 3,
        id: 'ST1-LINE2-SS2',
        canary_state: false,
        latency: false,
        value: 'Signup',
        dark: false,
        sixth_sense: false,
        history_error: false,
        dotted: false,
        highlighted: false,
        error: false,
        index_stage: 1,
        relationship_touchpoints: [4]
      },
      {
        index: 4,
        id: 'ST1-LINE2-SS3',
        canary_state: false,
        latency: false,
        value: 'Guest',
        dark: false,
        sixth_sense: false,
        history_error: false,
        dotted: false,
        highlighted: false,
        error: false,
        index_stage: 1,
        relationship_touchpoints: []
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
          select_color: [18, 167, 255],
          unselect_color: [189, 189, 189],
          error_color: [255, 76, 76],
          dark: [51, 51, 51]
        }
      ]
    };
    const wrapper = shallow(
      <StepContainer
        steps={steps}
        onclickStep={jest.fn()}
        title=""
        iconSixthSenseStatus={false}
        iconGoutStatus={false}
        latencyStatus={false}
        iconCanaryStatus={false}
        iconFireStatus={false}
        colors={colors}
      />
    );

    const result = wrapper.instance().calculateIndex();
    expect(result.length).toEqual(3);
  });

  it('Steps with render', () => {
    const stepsObj = [
      {
        value: '',
        sub_steps: [
          {
            index: 1,
            id: 'ST1-LINE2-SS1',
            canary_state: false,
            latency: false,
            value: 'Login',
            dark: false,
            sixth_sense: false,
            history_error: false,
            dotted: true,
            highlighted: false,
            error: false,
            index_stage: 1,
            relationship_touchpoints: [3]
          },
          {
            index: 2,
            id: 'ST1-LINE2-SS2',
            canary_state: false,
            latency: false,
            value: 'Signup',
            dark: false,
            sixth_sense: false,
            history_error: false,
            dotted: false,
            highlighted: false,
            error: false,
            index_stage: 1,
            relationship_touchpoints: [4]
          }
        ]
      },
      {
        index: 3,
        id: 'ST1-LINE2-SS2',
        canary_state: false,
        latency: false,
        value: 'Signup',
        dark: false,
        sixth_sense: false,
        history_error: false,
        dotted: false,
        highlighted: false,
        error: false,
        index_stage: 1,
        relationship_touchpoints: [4]
      },
      {
        index: 4,
        id: 'ST1-LINE2-SS3',
        canary_state: false,
        latency: false,
        value: 'Guest',
        dark: false,
        sixth_sense: false,
        history_error: false,
        dotted: false,
        highlighted: false,
        error: false,
        index_stage: 1,
        relationship_touchpoints: []
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
          select_color: [18, 167, 255],
          unselect_color: [189, 189, 189],
          error_color: [255, 76, 76],
          dark: [51, 51, 51]
        }
      ]
    };
    const stepContainer = shallow(
      <StepContainer
        steps={stepsObj}
        onclickStep={jest.fn()}
        title=""
        iconSixthSenseStatus={false}
        iconGoutStatus={false}
        latencyStatus={false}
        iconCanaryStatus={false}
        iconFireStatus={false}
        colors={colors}
      />
    );
    expect(stepContainer.length).toEqual(1);
  });
});
