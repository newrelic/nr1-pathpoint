import React from 'react';
import { mount } from 'enzyme';
import Select from '../../../components/Select/Select';

describe('<Select/>', () => {
  it('Render default', () => {
    const wrapper = mount(
      <Select
        options={[{ label: 'option one' }]}
        name=""
        handleOnChange={jest.fn()}
        width="230px"
      />
    );
    expect(wrapper.length).toEqual(1);
    wrapper.unmount();
  });

  it('Function clickAction()', () => {
    const wrapper = mount(
      <Select
        options={[{ label: 'option one' }]}
        name=""
        handleOnChange={jest.fn()}
        width="230px"
      />
    );
    wrapper.instance().clickAction();
    expect(wrapper.state('open')).toBeTruthy();
  });

  it('Function clickSelected()', () => {
    const handleOnChange = jest.fn();
    const wrapper = mount(
      <Select
        options={[{ label: 'option one' }, { label: 'option two' }]}
        name=""
        handleOnChange={handleOnChange}
        width="230px"
      />
    );
    wrapper.instance().clickSelected(1, { value: 1 });
    expect(handleOnChange).toHaveBeenCalledTimes(1);
    expect(wrapper.state('selected')).toEqual(1);
  });

  it('emulate click in the option', () => {
    const wrapper = mount(
      <Select
        options={[{ label: 'option one' }]}
        name=""
        handleOnChange={jest.fn()}
        width="230px"
      />
    );
    wrapper
      .find('span')
      .at(1)
      .simulate('click');
    expect(wrapper.state('selected')).toEqual(0);
  });
});
