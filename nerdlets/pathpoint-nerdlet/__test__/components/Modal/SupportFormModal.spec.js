import React from 'react';
import { create } from 'react-test-renderer';
import {
  BodySupportFormModal,
  HeaderSupportFormModal
} from '../../../components/Modal/SupportFormModal';

describe('SupportFormModal component', () => {
  test('Render body with default data', () => {
    const body = create(
      <BodySupportFormModal
        handleOnChange={jest.fn()}
        handleSaveUpdateSupport={jest.fn()}
      />
    );
    expect(body.toJSON()).toMatchSnapshot();
  });

  test('Render header with default data', () => {
    const header = create(<HeaderSupportFormModal />);
    expect(header.toJSON()).toMatchSnapshot();
  });
});
