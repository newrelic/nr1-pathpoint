import React from 'react';
import { create } from 'react-test-renderer';
import {
  BodyBackgroundProcessesFormModal,
  HeaderBackgroundProcessesFormModal
} from '../../../components/Modal/BackgroundProcessesFormModal';

describe('BackgroundProcessesFormModal component', () => {
  test('Render body with default data', () => {
    const body = create(
      <BodyBackgroundProcessesFormModal
        _onClose={jest.fn()}
        GetCurrentHistoricErrorScript={jest.fn()}
      />
    );
    expect(body.toJSON()).toMatchSnapshot();
  });

  test('Render header with default data', () => {
    const header = create(<HeaderBackgroundProcessesFormModal />);
    expect(header.toJSON()).toMatchSnapshot();
  });
});
