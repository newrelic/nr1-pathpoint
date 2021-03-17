import React from 'react';
import { create } from 'react-test-renderer';
import {
  BodyFlameFormModal,
  HeaderFlameFormModal
} from '../../../components/Modal/FlameFormModal';

describe('FlameFormModal component', () => {
  test('Render body with default data', () => {
    const body = create(
      <BodyFlameFormModal handleSaveUpdateFire={jest.fn()} />
    );
    expect(body.toJSON()).toMatchSnapshot();
  });

  test('Render header with default data', () => {
    const header = create(<HeaderFlameFormModal />);
    expect(header.toJSON()).toMatchSnapshot();
  });
});
