import React from 'react';
import { mount, shallow } from 'enzyme';
import Stage from '../../../components/Stage/Stage';

describe('<Stage/>', () => {
  const colors = {
    status_color: {
      danger: [255, 76, 76],
      warning: [242, 201, 76],
      good: [39, 174, 96]
    }
  };

  // eslint-disable-next-line no-unused-vars
  const congestion1 = {
    congestion: {
      percentage: 10
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
        // --- borrar en todos
        congestion={{
          congestion: {
            percentage: 10
          }
        }}
        trafficIconType="traffic"
        // ---------------------
        stage={{
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

  it('Render percentage to 100 with status good', () => {
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

  it('Render percentage to < 5 with status warning and high value congestion', () => {
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
          index: 1,
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

  it('Render percentage to < 5 with status danger and high value congestion', () => {
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

  it('Simulate click in stage', () => {
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
        // ---borrar
        congestion={{
          congestion: {
            percentage: 10
          }
        }}
        trafficIconType="traffic"
        // -----------------
        stage={{
          congestion: {
            percentage: 10
          },
          arrowMode: 'FLOW',
          trafficIconType: 'traffic'
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
          congestion: {
            value: 0,
            percentage: 15
          }
        }}
        onClickStage={jest.fn()}
      />
    );
    // const result = wrapper.instance().transformK(100);
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
});
