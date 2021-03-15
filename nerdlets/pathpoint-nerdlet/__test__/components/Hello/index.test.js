import React from 'react';
import { shallow } from 'enzyme';
import MyComponent from '../../../components/Hello';
import { useI18n } from 'react-simple-i18n';

jest.mock(
  'react-simple-i18n',
  () => {
    const mUseI18n = { t: jest.fn().mockReturnValue('test') };
    return {
      useI18n: jest.fn(() => mUseI18n)
    };
  },
  { virtual: true }
);

describe('MyComponent', () => {
  it('should render MyComponent correctly', () => {
    const fakeData = {};
    let wrapper = shallow(<MyComponent data={fakeData} />);
    expect(wrapper.text()).toBe('test');
    expect(useI18n).toHaveBeenCalledTimes(1);
    expect(useI18n().t).toHaveBeenCalledWith('MyComponent.hello');
// toHaveBeenCalledWith
  });
});