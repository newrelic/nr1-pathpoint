import React from 'react';
import { create } from 'react-test-renderer';
import TouchPoint from '../../../components/TouchPoint/TouchPoint';

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

const touchPoint = {
  status_on_off: false,
  city: 0,
  index: 0,
  error: false,
  countrys: [0, 1],
  dashboard_url: ['www.google.com'],
  sixth_sense_url: [[]]
};

describe('Touchpoint component', () => {
  test('Touchpoint component with default data', () => {
    const touchpoint = create(
      <TouchPoint
        iconCanaryStatus
        touchpoint={touchPoint}
        city={0}
        colors={colors}
        iconFireStatus={false}
        checkAllStatus={false}
        iconSixthSenseStatus={false}
        visible={false}
        idVisible=""
        handleChange={jest.fn()}
        renderProps={jest.fn()}
        updateTouchpointOnOff={jest.fn()}
        openModalParent={jest.fn()}
      />
    );
    expect(touchpoint.toJSON()).toMatchSnapshot();
  });
});
