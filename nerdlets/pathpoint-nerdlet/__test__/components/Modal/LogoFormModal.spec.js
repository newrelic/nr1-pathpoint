import React from 'react';
import { create } from 'react-test-renderer';
import {
  BodyLogoFormModal,
  HeaderLogoFormModal
} from '../../../components/Modal/LogoFormModal';

describe('LogoFormModal component', () => {
  test('Render body with default data', () => {
    const body = create(
      <BodyLogoFormModal
        LogoFormSubmit={jest.fn()}
        _onClose={jest.fn()}
        handleOnChange={jest.fn()}
        handleSubmitLogo={jest.fn()}
        type="default"
      />
    );
    expect(body.toJSON()).toMatchSnapshot();
  });

  test('Render header with default data', () => {
    const header = create(<HeaderLogoFormModal />);
    expect(header.toJSON()).toMatchSnapshot();
  });
});
