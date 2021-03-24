import React from 'react';
import { shallow } from 'enzyme';
import MainContainer from '../../../containers/MainContainer/MainContainer';

jest.mock(
  'nr1',
  () => {
    const AccountsQuery = {
      query: jest.fn().mockReturnValue({
        data: [{ id: 123 }]
      })
    };
    const nerdlet = {
      setConfig: jest.fn()
    };
    return {
      AccountsQuery: AccountsQuery,
      nerdlet: nerdlet
    };
  },
  { virtual: true }
);

describe('<MainContainer/>', () => {
  it('Render initial', () => {
    const mainContainer = shallow(<MainContainer />);
    const instance = mainContainer.instance();
    instance.BoootstrapApplication();
  });
});
