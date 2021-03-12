import React from 'react';
import { mount } from 'enzyme';
import {
  BodyLogoFormModal,
  HeaderLogoFormModal
} from '../../../components/Modal/LogoFormModal';

describe('LogoFormModal', () => {
  it('Render body', () => {
    const bodyLogoForm = mount(
      <BodyLogoFormModal LogoFormSubmit={jest.fn()} _onClose={jest.fn()} />
    );
    expect(bodyLogoForm.length).toEqual(1);
  });

  it('Render header', () => {
    const headerLogoForm = mount(<HeaderLogoFormModal />);
    expect(headerLogoForm.length).toEqual(1);
  });
});
