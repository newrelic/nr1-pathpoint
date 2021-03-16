import React from 'react';
import { mount, shallow } from 'enzyme';
import Component from '../../components/Component';

jest.mock(
  'nr1',
  () => {
    const AccountsQuery = {
      query: jest.fn().mockReturnValue({
        data: [{ id: 123 }]
      })
    };
    return {
      AccountsQuery: AccountsQuery
    };
  },
  { virtual: true }
);

describe('ShowInfo', () => {
  it('Should show text', () => {
    expect(true).toBe(true);
  });

  it('Function in component', () => {
    const wrapper = mount(<Component />);
    const result = wrapper.instance().calculateSum(2, 2);
    expect(result).toEqual(4);
  });

  it('Function in accountid', async () => {
    const wrapper = mount(<Component />);
    const result = await wrapper.instance().recoveId();
    expect(result).toEqual(123);
  });
});
