import React from 'react';
import { mount, shallow } from 'enzyme';
import Stage from '../../../components/Stage/Stage';

jest.mock(
  'window',
  () => {
    const window = {
      open: jest.fn()
    };
    return { window };
  },
  { virtual: true }
);

describe('<Stage/>', () => {
  const { open } = window;
  beforeAll(() => {
    delete window.open;
    window.open = jest.fn();
  });
  afterAll(() => {
    window.open = open;
  });
  const colors = {
    status_color: {
      danger: [255, 76, 76],
      warning: [242, 201, 76],
      good: [39, 174, 96]
    }
  };

  it('Render default values stage', () => {
    const wrapper = mount(
      <Stage
        title=""
        percentageCongestion={10}
        valueCongestion={10}
        index={1}
        goutQuantity={0}
        status=""
        capacityPercentage={10}
        totalCountStage={10}
        onClickStage={jest.fn()}
        colors={colors}
        congestion={{
          congestion: {
            percentage: 10
          }
        }}
        trafficIconType="traffic"
        stage={{
          capacity_link: true,
          congestion: {
            percentage: 10
          },
          arrowMode: 'FLOW',
          trafficIconType: 'traffic'
        }}
      />
    );
    expect(wrapper.length).toEqual(1);
  });

  it('Render percentage to 100 with status good and stage.capacity = OPERATIONAL', () => {
    const wrapper = mount(
      <Stage
        title=""
        percentageCongestion={10}
        valueCongestion={10}
        index={2}
        goutQuantity={0}
        status="good"
        capacityPercentage={100}
        totalCountStage={10}
        onClickStage={jest.fn()}
        colors={colors}
        congestion={{
          congestion: {
            percentage: 10
          }
        }}
        trafficIconType="traffic"
        stage={{
          capacity_link: true,
          congestion: {
            percentage: 10
          },
          arrowMode: 'FLOW',
          trafficIconType: 'traffic',
          capacity: 'OPERATIONAL'
        }}
      />
    );
    expect(wrapper.length).toEqual(1);
  });

  it('Render percentage to < 5 with status warning and high value congestion and capacity = DEGRADED', () => {
    const wrapper = mount(
      <Stage
        title=""
        percentageCongestion={10}
        valueCongestion={1000000}
        index={2}
        goutQuantity={0}
        status="warning"
        capacityPercentage={5}
        totalCountStage={10}
        onClickStage={jest.fn()}
        colors={colors}
        congestion={{
          congestion: {
            percentage: 10
          }
        }}
        trafficIconType="traffic"
        stage={{
          capacity_link: true,
          index: 1,
          congestion: {
            percentage: 10
          },
          arrowMode: 'FLOW',
          trafficIconType: 'traffic',
          capacity: 'DEGRADED'
        }}
      />
    );
    expect(wrapper.length).toEqual(1);
  });

  it('Render percentage to < 5 with status danger and high value congestion and capacity = DISRUPTED', () => {
    const colors = {
      status_color: {
        danger: [255, 76, 76],
        warning: [242, 201, 76],
        good: [39, 174, 96]
      }
    };
    const wrapper = mount(
      <Stage
        title=""
        percentageCongestion={10}
        valueCongestion={100000000}
        index={2}
        goutQuantity={0}
        status="danger"
        capacityPercentage={100}
        totalCountStage={10}
        onClickStage={jest.fn()}
        colors={colors}
        congestion={{
          congestion: {
            percentage: 10
          }
        }}
        trafficIconType="traffic"
        stage={{
          capacity_link: true,
          congestion: {
            percentage: 10
          },
          arrowMode: 'FLOW',
          trafficIconType: 'traffic',
          capacity: 'DISRUPTED'
        }}
      />
    );
    expect(wrapper.length).toEqual(1);
  });

  it('Simulate click in stage  and stage.capacity = UNKNOWN', () => {
    const clickStage = jest.fn();
    const wrapper = shallow(
      <Stage
        title=""
        percentageCongestion={10}
        valueCongestion={100000000}
        index={2}
        goutQuantity={0}
        status="danger"
        capacityPercentage={100}
        totalCountStage={10}
        onClickStage={clickStage}
        colors={colors}
        congestion={{
          congestion: {
            percentage: 10
          }
        }}
        trafficIconType="traffic"
        stage={{
          capacity_link: false,
          congestion: {
            percentage: 10
          },
          arrowMode: 'FLOW',
          trafficIconType: 'traffic',
          capacity: 'UNKNOWN'
        }}
      />
    );
    wrapper
      .find('.arrowStage')
      .find('div')
      .at(1)
      .simulate('click');
    expect(clickStage).toHaveBeenCalledTimes(1);
  });

  it('Function transformK > 1000 && capacity > 5', () => {
    const wrapper = mount(
      <Stage
        stage={{
          title: '',
          percentageCongestion: 10,
          valueCongestion: 100000000,
          index: 2,
          goutQuantity: 0,
          status: 'danger',
          capacityPercentage: 100,
          capacity: 25,
          totalCountStage: 10,
          colors: colors,
          total_count: 1001,
          arrowMode: 'FLOW',
          trafficIconType: 'traffic',
          capacity_link: true,
          congestion: {
            value: 0,
            percentage: 15
          }
        }}
        onClickStage={jest.fn()}
      />
    );
    expect(wrapper.length).toEqual(1);
  });

  it('Function transformK > 1000000 && capacity < 5 && status_color = good', () => {
    const wrapper = mount(
      <Stage
        stage={{
          title: '',
          percentageCongestion: 10,
          valueCongestion: 100000000,
          index: 2,
          goutQuantity: 0,
          status: 'danger',
          status_color: 'good',
          capacityPercentage: 100,
          capacity: 4,
          totalCountStage: 10,
          colors: colors,
          total_count: 1000001,
          arrowMode: 'FLOW',
          trafficIconType: 'traffic',
          capacity_link: true,
          congestion: {
            value: 0,
            percentage: 15
          }
        }}
        onClickStage={jest.fn()}
      />
    );
    expect(wrapper.length).toEqual(1);
  });

  it('Function capacity > 100 && status_color = danger', () => {
    const wrapper = mount(
      <Stage
        stage={{
          title: '',
          percentageCongestion: 10,
          valueCongestion: 100000000,
          index: 2,
          goutQuantity: 0,
          status: 'danger',
          status_color: 'danger',
          capacityPercentage: 100,
          capacity: 105,
          totalCountStage: 10,
          colors: colors,
          capacity_link: true,
          total_count: 1001,
          arrowMode: 'FLOW',
          trafficIconType: 'traffic',
          congestion: {
            value: 0,
            percentage: 15
          }
        }}
        onClickStage={jest.fn()}
      />
    );
    expect(wrapper.length).toEqual(1);
  });

  it('Simulate click in capacityBar', () => {
    const clickStage = jest.fn();
    const window = {
      open: jest.fn()
    };
    const wrapper = shallow(
      <Stage
        title=""
        percentageCongestion={10}
        valueCongestion={100000000}
        index={2}
        goutQuantity={0}
        status="danger"
        capacityPercentage={100}
        totalCountStage={10}
        onClickStage={clickStage}
        colors={colors}
        congestion={{
          congestion: {
            percentage: 10
          }
        }}
        trafficIconType="traffic"
        stage={{
          capacity_link: true,
          congestion: {
            percentage: 10
          },
          arrowMode: 'FLOW',
          trafficIconType: 'traffic',
          capacity: 'UNKNOWN'
        }}
      />
    );
    wrapper
      .find('.capacityBar')
      .at(0)
      .simulate('click');
    expect(window.open).toHaveBeenCalledTimes(0);
  });
});
