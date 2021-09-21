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

  const congestion1 = {
    congestion:{
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
          arrowMode: "FLOW",
          trafficIconType: "traffic"
        }}
        onClickStage={jest.fn()}
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
          arrowMode: "FLOW",
          trafficIconType: "traffic"
        }}
        onClickStage={jest.fn()}
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
          congestion: {
            percentage: 10
          },
          arrowMode: "FLOW",
          trafficIconType: "traffic"
        }}
        onClickStage={jest.fn()}
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
          arrowMode: "FLOW",
          trafficIconType: "traffic"
        }}
        onClickStage={jest.fn()}
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
        //-----------------
        stage={{ 
          congestion: {
            percentage: 10
          },
          arrowMode: "FLOW",
          trafficIconType: "traffic"
        }}
        onClickStage={jest.fn()}
      />
    );
    wrapper
      .find('.arrowStage')
      .find('div')
      .at(1)
      .simulate('click');
    expect(clickStage).toHaveBeenCalledTimes(0);
  });
});
