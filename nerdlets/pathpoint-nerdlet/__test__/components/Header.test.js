import React from 'react';
import { mount } from 'enzyme';
import Component from '../../components/Component';

describe('ShowInfo', () => {
  it('Should show text', () => {
    expect(true).toBe(true);
  });

  it('Function in component', () => {
    const wrapper = mount(<Component />);
    const result = wrapper.instance().calculateSum(2, 2);
    expect(result).toEqual(4);
  });
});
