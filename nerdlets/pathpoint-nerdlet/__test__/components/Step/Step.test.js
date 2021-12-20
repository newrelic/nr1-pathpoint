import React from 'react';
import { mount, shallow } from 'enzyme';
import Step, {
  StyleSubStep,
  BackgroundSubStep,
  TextColorStep
} from '../../../components/Step/Step';

describe('<Step/>', () => {
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
  describe('Function StyleSubStep', () => {
    it('Step highlited', () => {
      const step = {
        index: 1,
        id: 'ST1-LINE2-SS1',
        canary_state: false,
        latency: false,
        value: 'Login',
        dark: false,
        sixth_sense: false,
        history_error: false,
        dotted: true,
        highlighted: true,
        error: false,
        index_stage: 1,
        relationship_touchpoints: [3]
      };
      const result = StyleSubStep(step, colors, false);
      expect(result).toMatch('2px solid rgb(18,167,255)');
    });

    it('Step error', () => {
      const step = {
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
        error: true,
        index_stage: 1,
        relationship_touchpoints: [3]
      };
      const result = StyleSubStep(step, colors, false);
      expect(result).toMatch('2px solid rgb(255,76,76)');
    });

    it('iconFireStatus enable', () => {
      const step = {
        index: 1,
        id: 'ST1-LINE2-SS1',
        canary_state: false,
        latency: false,
        value: 'Login',
        dark: false,
        sixth_sense: false,
        history_error: true,
        dotted: false,
        highlighted: false,
        error: false,
        index_stage: 1,
        relationship_touchpoints: [3]
      };
      const result = StyleSubStep(step, colors, true);
      expect(result).toMatch('2px solid rgb(255,76,76)');
    });

    it('Step dotted', () => {
      const step = {
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
      };
      const result = StyleSubStep(step, colors, false);
      expect(result).toMatch('1px dashed rgb(189,189,189)');
    });

    it('Step with false highlighted ,error ,history_error, dotted', () => {
      const step = {
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
      };
      const result = StyleSubStep(step, colors, false);
      expect(result).toMatch('2px solid rgb(189,189,189)');
    });
  });

  describe('Function BackgroundSubStep', () => {
    it('Step with dark true', () => {
      const step = {
        index: 1,
        id: 'ST1-LINE2-SS1',
        canary_state: false,
        latency: false,
        value: 'Login',
        dark: true,
        sixth_sense: false,
        history_error: false,
        dotted: true,
        highlighted: false,
        error: true,
        index_stage: 1,
        relationship_touchpoints: [3]
      };
      const result = BackgroundSubStep(
        step,
        true,
        '#333333',
        false,
        false,
        false
      );
      expect(result).toMatch('#333333');
    });

    it('Step with latency true', () => {
      const step = {
        index: 1,
        id: 'ST1-LINE2-SS1',
        canary_state: false,
        latency: true,
        value: 'Login',
        dark: false,
        sixth_sense: false,
        history_error: false,
        dotted: false,
        highlighted: false,
        error: false,
        index_stage: 1,
        relationship_touchpoints: [3]
      };
      const result = BackgroundSubStep(
        step,
        false,
        '#333333',
        false,
        true,
        false
      );
      expect(result).toMatch('#144869');
    });

    it('Step with canary_state true', () => {
      const step = {
        index: 1,
        id: 'ST1-LINE2-SS1',
        canary_state: true,
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
      };
      const result = BackgroundSubStep(
        step,
        false,
        '#333333',
        true,
        false,
        false
      );
      expect(result).toMatch('#F2CA4B');
    });

    it('Step with sixth_sense true', () => {
      const step = {
        index: 1,
        id: 'ST1-LINE2-SS1',
        canary_state: false,
        latency: false,
        value: 'Login',
        dark: false,
        sixth_sense: true,
        history_error: false,
        dotted: false,
        highlighted: false,
        error: false,
        index_stage: 1,
        relationship_touchpoints: [3]
      };
      const result = BackgroundSubStep(
        step,
        false,
        '#333333',
        false,
        false,
        true
      );
      expect(result).toMatch('white');
    });

    it('Step with false all', () => {
      const step = {
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
      };
      const result = BackgroundSubStep(
        step,
        false,
        '#333333',
        false,
        false,
        false
      );
      expect(result).toMatch('white');
    });
  });

  describe('Function TextColorStep', () => {
    it('Step canary_state true', () => {
      const step = {
        index: 1,
        id: 'ST1-LINE2-SS1',
        canary_state: true,
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
      };
      const result = TextColorStep(false, step, false, true);
      expect(result).toMatch('#333333');
    });

    it('Step with latency true', () => {
      const step = {
        index: 1,
        id: 'ST1-LINE2-SS1',
        canary_state: false,
        latency: true,
        value: 'Login',
        dark: false,
        sixth_sense: false,
        history_error: false,
        dotted: false,
        highlighted: false,
        error: false,
        index_stage: 1,
        relationship_touchpoints: [3]
      };
      const result = TextColorStep(false, step, true, false);
      expect(result).toMatch('white');
    });

    it('Step with dark true', () => {
      const step = {
        index: 1,
        id: 'ST1-LINE2-SS1',
        canary_state: false,
        latency: false,
        value: 'Login',
        dark: true,
        sixth_sense: false,
        history_error: false,
        dotted: false,
        highlighted: false,
        error: false,
        index_stage: 1,
        relationship_touchpoints: [3]
      };
      const result = TextColorStep(true, step, false, false);
      expect(result).toMatch('white');
    });

    it('Step with all false', () => {
      const step = {
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
      };
      const result = TextColorStep(false, step, false, false);
      expect(result).toMatch('#333333');
    });
  });

  describe('Render steps', () => {
    it('Step with subSteps', () => {
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
      const step = mount(
        <Step
          step={stepObj}
          onclickStep={jest.fn()}
          iconSixthSenseStatus
          iconGoutStatus
          latencyStatus
          iconCanaryStatus
          iconFireStatus
          colors={colors}
        />
      );
      expect(step.length).toEqual(1);
    });

    it('Step null', () => {
      const step = mount(
        <Step
          step={null}
          onclickStep={jest.fn()}
          iconSixthSenseStatus
          iconGoutStatus
          latencyStatus
          iconCanaryStatus
          iconFireStatus
          colors={colors}
        />
      );
      expect(step.length).toEqual(1);
    });

    it('Step simulate click divStep', () => {
      const clickStep = jest.fn();
      const step = mount(
        <Step
          step={{
            value: 'step one',
            dotted: true,
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
          }}
          onclickStep={clickStep}
          iconSixthSenseStatus
          iconGoutStatus
          latencyStatus
          iconCanaryStatus
          iconFireStatus
          colors={colors}
        />
      );

      step.find('div.divStep').simulate('click');
      expect(clickStep).toHaveBeenCalledTimes(1);
    });

    it('Step simulate click textContentSubFirstStep', () => {
      const clickStep = jest.fn();
      const step = shallow(
        <Step
          step={{
            value: '',
            dotted: true,
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
          }}
          onclickStep={clickStep}
          iconSixthSenseStatus
          iconGoutStatus
          latencyStatus
          iconCanaryStatus
          iconFireStatus
          colors={colors}
        />
      );

      step.find('.textContentSubFirstStep').simulate('click');
      expect(clickStep).toHaveBeenCalledTimes(1);
    });

    it('Step simulate click textContentSubSecondStep', () => {
      const clickStep = jest.fn();
      const step = shallow(
        <Step
          step={{
            value: '',
            dotted: true,
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
          }}
          onclickStep={clickStep}
          iconSixthSenseStatus
          iconGoutStatus
          latencyStatus
          iconCanaryStatus
          iconFireStatus
          colors={colors}
        />
      );

      step.find('.textContentSubSecondStep').simulate('click');
      expect(clickStep).toHaveBeenCalledTimes(1);
    });
  });
});
