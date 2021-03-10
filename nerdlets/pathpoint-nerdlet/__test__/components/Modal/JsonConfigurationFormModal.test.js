import React from 'react';
import { mount } from 'enzyme';
import {
  BodyJsonConfigurationFormModal,
  HeaderJsonConfigurationFormModal
} from '../../../components/Modal/JsonConfigurationFormModal';

describe('<FileErrorFormModal/>', () => {
  it('Render body', () => {
    const bodyJsonConfiguration = mount(
      <BodyJsonConfigurationFormModal
        _onClose={jest.fn()}
        GetCurrentConfigurationJSON={jest.fn()}
        SetConfigurationJSON={jest.fn()}
        validateKpiQuery={{}}
      />
    );
    expect(bodyJsonConfiguration.length).toEqual(1);
  });

  it('Render header', () => {
    const headerJsonConfiguration = mount(<HeaderJsonConfigurationFormModal />);
    expect(headerJsonConfiguration.length).toEqual(1);
  });
});
