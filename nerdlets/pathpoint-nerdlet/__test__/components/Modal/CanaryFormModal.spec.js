import React from 'react';
import { create } from 'react-test-renderer';
import {
  BodyCanaryFormModal,
  HeaderCanaryFormModal
} from '../../../components/Modal/CanaryFormModal';

describe('CanaryFormModal component', () => {
  test('Render body with default data', () => {
    const body = create(
      <BodyCanaryFormModal
        _onClose={jest.fn()}
        GetCurrentHistoricErrorScript={jest.fn()}
        handleSaveUpdateCanary={jest.fn()}
      />
    );
    expect(body.toJSON()).toMatchSnapshot();
  });

  test('Render header with default data', () => {
    const header = create(<HeaderCanaryFormModal />);
    expect(header.toJSON()).toMatchSnapshot();
  });
});
