import React from 'react';
import { create } from 'react-test-renderer';
import Step from '../../../components/Step/Step';

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

const stepObj = {
  index: 0,
  id: 'ST1-LINE2-SS1',
  canary_state: false,
  latency: false,
  value: 'Login',
  dark: false,
  sixth_sense: false,
  history_error: false,
  dotted: false,
  highlighted: false,
  error: false,
  index_stage: 1,
  relationship_touchpoints: [3],
  sub_steps: [
    {
      index: 0,
      id: 'ST1-LINE2-SS1',
      canary_state: false,
      latency: false,
      value: 'Login',
      dark: false,
      sixth_sense: false,
      history_error: false,
      dotted: false,
      highlighted: false,
      error: false,
      index_stage: 1,
      relationship_touchpoints: [3]
    },
    {
      index: 1,
      id: 'ST1-LINE2-SS1',
      canary_state: false,
      latency: false,
      value: 'Login',
      dark: false,
      sixth_sense: false,
      history_error: false,
      dotted: false,
      highlighted: false,
      error: false,
      index_stage: 1,
      relationship_touchpoints: [3]
    }
  ]
};

describe('Step component', () => {
  test('Step component with default data', () => {
    const step = create(
      <Step
        step={stepObj}
        onclickStep={jest.fn()}
        iconSixthSenseStatus={false}
        iconGoutStatus={false}
        latencyStatus={false}
        iconCanaryStatus={false}
        iconFireStatus={false}
        colors={colors}
      />
    );
    expect(step.toJSON()).toMatchSnapshot();
  });

  test('Step component with canary state', () => {
    stepObj.canary_state = true;
    const step = create(
      <Step
        step={stepObj}
        onclickStep={jest.fn()}
        iconSixthSenseStatus={false}
        iconGoutStatus={false}
        latencyStatus={false}
        iconCanaryStatus={false}
        iconFireStatus={false}
        colors={colors}
      />
    );
    expect(step.toJSON()).toMatchSnapshot();
  });

  test('Step component with canary state and latency', () => {
    stepObj.canary_state = true;
    stepObj.latency = true;
    const step = create(
      <Step
        step={stepObj}
        onclickStep={jest.fn()}
        iconSixthSenseStatus={false}
        iconGoutStatus={false}
        latencyStatus={false}
        iconCanaryStatus={false}
        iconFireStatus={false}
        colors={colors}
      />
    );
    expect(step.toJSON()).toMatchSnapshot();
  });
});
