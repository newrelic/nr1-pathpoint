import React from 'react';
import { shallow } from 'enzyme';
import StepContainer from '../../../containers/StepContainer/StepContainer';

describe('<StepContainer/>', () => {
  it('checking calculateIndex with sub_steps.dotted all false', () => {
    const steps = [
      {
        value: '',
        sub_steps: [
          {
            dotted: false
          },
          {
            dotted: false
          }
        ]
      },
      {
        value: '',
        sub_steps: [
          {
            dotted: false
          },
          {
            dotted: false
          }
        ]
      },
      {
        value: '',
        sub_steps: [
          {
            dotted: false
          },
          {
            dotted: false
          }
        ]
      }
    ];
    const colors = {};
    const totalContainers = 1;
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
        totalContainers={totalContainers}
      />
    );
    const result = wrapper.instance().calculateIndex();
    expect(result.length).toEqual(3);
    expect(result).toEqual([
      {
        value: '',
        sub_steps: [{ dotted: false }, { dotted: false }],
        index: 1
      },
      {
        value: '',
        sub_steps: [{ dotted: false }, { dotted: false }],
        index: 2
      },
      { value: '', sub_steps: [{ dotted: false }, { dotted: false }], index: 3 }
    ]);
  });
  it('checking calculateIndex with sub_steps.dotted some true', () => {
    const steps = [
      {
        value: '',
        sub_steps: [
          {
            dotted: true
          },
          {
            dotted: false
          }
        ]
      },
      {
        value: '',
        sub_steps: [
          {
            dotted: false
          },
          {
            dotted: false
          }
        ]
      },
      {
        value: '',
        sub_steps: [
          {
            dotted: false
          },
          {
            dotted: false
          }
        ]
      }
    ];
    const colors = {};
    const totalContainers = 1;
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
        totalContainers={totalContainers}
      />
    );
    const result = wrapper.instance().calculateIndex();
    expect(result.length).toEqual(3);
    expect(result).toEqual([
      {
        value: '',
        sub_steps: [{ dotted: true }, { dotted: false }],
        dotted: true
      },
      {
        value: '',
        sub_steps: [{ dotted: false }, { dotted: false }],
        index: 1
      },
      { value: '', sub_steps: [{ dotted: false }, { dotted: false }], index: 2 }
    ]);
  });
  it('checking calculateIndex with sub_steps.dotted all true', () => {
    const steps = [
      {
        value: '',
        sub_steps: [
          {
            dotted: true
          },
          {
            dotted: false
          }
        ]
      },
      {
        value: '',
        sub_steps: [
          {
            dotted: false
          },
          {
            dotted: true
          }
        ]
      },
      {
        value: '',
        sub_steps: [
          {
            dotted: true
          },
          {
            dotted: true
          }
        ]
      }
    ];
    const colors = {};
    const totalContainers = 1;
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
        totalContainers={totalContainers}
      />
    );
    const result = wrapper.instance().calculateIndex();
    expect(result.length).toEqual(3);
    expect(result).toEqual([
      {
        value: '',
        sub_steps: [{ dotted: true }, { dotted: false }],
        dotted: true
      },
      {
        value: '',
        sub_steps: [{ dotted: false }, { dotted: true }],
        dotted: true
      },
      {
        value: '',
        sub_steps: [{ dotted: true }, { dotted: true }],
        dotted: true
      }
    ]);
  });
  it('checking calculateIndex with value != vacio', () => {
    const steps = [
      {
        value: ' ',
        sub_steps: [
          {
            dotted: true
          },
          {
            dotted: false
          }
        ]
      },
      {
        value: '*',
        sub_steps: [
          {
            dotted: false
          },
          {
            dotted: true
          }
        ]
      },
      {
        value: '',
        sub_steps: [
          {
            dotted: true
          },
          {
            dotted: true
          }
        ]
      }
    ];
    const colors = {};
    const totalContainers = 1;
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
        totalContainers={totalContainers}
      />
    );
    const result = wrapper.instance().calculateIndex();
    expect(result.length).toEqual(3);
    expect(result).toEqual([
      {
        value: ' ',
        sub_steps: [{ dotted: true }, { dotted: false }],
        index: 1
      },
      {
        value: '*',
        sub_steps: [{ dotted: false }, { dotted: true }],
        index: 2
      },
      {
        value: '',
        sub_steps: [{ dotted: true }, { dotted: true }],
        dotted: true
      }
    ]);
  });
});
