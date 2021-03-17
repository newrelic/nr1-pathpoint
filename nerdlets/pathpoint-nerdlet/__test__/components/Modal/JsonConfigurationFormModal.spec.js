import React from 'react';
import { create } from 'react-test-renderer';
import {
  BodyJsonConfigurationFormModal,
  HeaderJsonConfigurationFormModal
} from '../../../components/Modal/JsonConfigurationFormModal';

describe('JsonConfigurationFormModal component', () => {
  test('Render body with default data', () => {
    const body = create(
      <BodyJsonConfigurationFormModal
        _onClose={jest.fn()}
        GetCurrentConfigurationJSON={jest.fn()}
        SetConfigurationJSON={jest.fn()}
        validateKpiQuery={{}}
      />
    );
    expect(body.toJSON()).toMatchSnapshot();
  });

  test('Render header with default data', () => {
    const header = create(<HeaderJsonConfigurationFormModal />);
    expect(header.toJSON()).toMatchSnapshot();
  });
});
