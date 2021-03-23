import React from 'react';
import { mount } from 'enzyme';
import TouchPointContainer from '../../../containers/TouchPointContainer/TouchPointContainer';

describe('<TouchPointContainer/>', () => {
  describe('Function filter', () => {
    it('touchpoints with city 0', () => {
      const touchPoints = [
        {
          city: 0,
          index: 0,
          error: false,
          countrys: [0, 1],
          dashboard_url: ['www.google.com'],
          sixth_sense_url: [[]]
        },
        {
          city: 0,
          index: 1,
          error: false,
          countrys: [0, 1],
          dashboard_url: ['www.google.com'],
          sixth_sense_url: [[]]
        },
        {
          city: 0,
          index: 2,
          error: false,
          countrys: [0, 1],
          dashboard_url: ['www.google.com'],
          sixth_sense_url: [[]]
        },
        {
          city: 1,
          index: 3,
          error: true,
          countrys: [0, 1],
          dashboard_url: ['www.google.com'],
          sixth_sense_url: [[]]
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
      const wrapper = mount(
        <TouchPointContainer
          touchpoints={touchPoints}
          city={0}
          colors={colors}
          iconFireStatus={false}
          checkAllStatus={false}
          iconSixthSenseStatus={false}
          iconCanaryStatus={false}
          element={{}}
          handleChange={jest.fn()}
          visible={false}
          idVisible=""
          renderProps={jest.fn()}
          openModalParent={jest.fn()}
          updateTouchpointOnOff={jest.fn()}
        />
      );

      const result = wrapper.instance().filterTouchpoints(touchPoints, 0);
      expect(result.length).toEqual(4);
    });
    it('touchpoints with city 1', () => {
      const touchPoints = [
        {
          city: 0,
          index: 0,
          error: true,
          countrys: [0],
          dashboard_url: ['www.google.com'],
          sixth_sense_url: [[]]
        },
        {
          city: 0,
          index: 1,
          error: false,
          countrys: [0],
          dashboard_url: ['www.google.com'],
          sixth_sense_url: [[]]
        },
        {
          city: 0,
          index: 2,
          error: false,
          countrys: [1],
          dashboard_url: ['www.google.com'],
          sixth_sense_url: [[]]
        },
        {
          city: 1,
          index: 3,
          error: false,
          countrys: [1],
          dashboard_url: ['www.google.com'],
          sixth_sense_url: [[]]
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
      const wrapper = mount(
        <TouchPointContainer
          touchpoints={touchPoints}
          city={0}
          colors={colors}
          iconFireStatus={false}
          checkAllStatus={false}
          iconCanaryStatus={false}
          iconSixthSenseStatus={false}
          element={{}}
          handleChange={jest.fn()}
          visible={false}
          idVisible=""
          renderProps={jest.fn()}
          openModalParent={jest.fn()}
          updateTouchpointOnOff={jest.fn()}
        />
      );

      const result = wrapper.instance().filterTouchpoints(touchPoints, 1);
      expect(result.length).toEqual(2);
    });

    it('touchpoints not city', () => {
      const touchPoints = [
        {
          city: 0,
          index: 0,
          error: true,
          countrys: [0],
          dashboard_url: ['www.google.com'],
          sixth_sense_url: [[]]
        },
        {
          city: 0,
          index: 1,
          error: false,
          countrys: [0],
          dashboard_url: ['www.google.com'],
          sixth_sense_url: [[]]
        },
        {
          city: 0,
          index: 2,
          error: false,
          countrys: [1],
          dashboard_url: ['www.google.com'],
          sixth_sense_url: [[]]
        },
        {
          city: 1,
          index: 3,
          error: false,
          countrys: [1],
          dashboard_url: ['www.google.com'],
          sixth_sense_url: [[]]
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
      const wrapper = mount(
        <TouchPointContainer
          touchpoints={touchPoints}
          city={0}
          colors={colors}
          iconFireStatus={false}
          checkAllStatus={false}
          iconCanaryStatus={false}
          iconSixthSenseStatus={false}
          element={{}}
          handleChange={jest.fn()}
          visible={false}
          idVisible=""
          renderProps={jest.fn()}
          openModalParent={jest.fn()}
          updateTouchpointOnOff={jest.fn()}
        />
      );

      const result = wrapper.instance().filterTouchpoints(touchPoints, 5);
      expect(result.length).toEqual(0);
    });
  });
});
