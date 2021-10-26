import React from 'react';
import { mount } from 'enzyme';
import RangeTime from '../../../components/RangeTime';

describe('<RangeTime/>', () => {
  it('Render default', () => {
    const wrapper = mount(
      <RangeTime
        options={[{ label: 'option one' }]}
        additionalAction={jest.fn()}
        timeRangeKpi={{
          index: 0
        }}
      />
    );
    expect(wrapper.length).toEqual(1);
    wrapper.unmount();
  });

  it('Function handleMenu()', () => {
    const wrapper = mount(
      <RangeTime
        options={[{ label: 'option one' }]}
        additionalAction={jest.fn()}
        timeRangeKpi={{
          index: 0
        }}
      />
    );
    wrapper.instance().handleMenu();
    expect(wrapper.state('visible')).toBeTruthy();
  });

  it('Function handleOption()', () => {
    const additionalAction = jest.fn();
    const wrapper = mount(
      <RangeTime
        options={[{ label: 'option one' }, { label: 'option two' }]}
        additionalAction={additionalAction}
        timeRangeKpi={{
          index: 0
        }}
      />
    );
    wrapper.instance().handleOption(1, { value: 1 });
    expect(additionalAction).toHaveBeenCalledTimes(1);
    expect(wrapper.state('selected')).toEqual(1);
  });

  it('emulate click in the option', () => {
    const wrapper = mount(
      <RangeTime
        options={[{ label: 'option one' }]}
        additionalAction={jest.fn()}
        timeRangeKpi={{
          index: 0
        }}
      />
    );
    wrapper.setState({
      visible: true
    });
    wrapper.find('#optionsBox').simulate('click');
    expect(wrapper.state('selected')).toEqual(0);
  });
});
