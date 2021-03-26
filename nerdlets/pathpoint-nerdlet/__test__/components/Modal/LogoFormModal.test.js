import React from 'react';
import { mount } from 'enzyme';
import {
  BodyLogoFormModal,
  HeaderLogoFormModal
} from '../../../components/Modal/LogoFormModal';

describe('LogoFormModal', () => {
  it('Render body', () => {
    const bodyLogoForm = mount(
      <BodyLogoFormModal
        type=""
        handleSubmitLogo={jest.fn()}
        handleOnChange={jest.fn()}
      />
    );
    expect(bodyLogoForm.length).toEqual(1);
  });

  it('Render header', () => {
    const headerLogoForm = mount(<HeaderLogoFormModal />);
    expect(headerLogoForm.length).toEqual(1);
  });

  it('Simulate onsubmit', () => {
    const handleSubmitLogo = jest.fn();
    const bodySupport = mount(
      <BodyLogoFormModal
        handleSubmitLogo={handleSubmitLogo}
        handleOnChange={jest.fn()}
        type="Text"
      />
    );
    const button = bodySupport.find('button');
    button.simulate('submit');
    expect(handleSubmitLogo).toHaveBeenCalledTimes(1);
  });

  it('Simulate onChange type text input', () => {
    const handleOnChange = jest.fn();
    const bodySupport = mount(
      <BodyLogoFormModal
        handleSubmitLogo={jest.fn()}
        handleOnChange={handleOnChange}
        type="Text"
      />
    );
    const textArea = bodySupport.find('input');
    const event = { target: { value: 'sometext' } };
    textArea.simulate('change', event);
    expect(handleOnChange).toHaveBeenCalledTimes(1);
  });

  it('Simulate onChange type url input', () => {
    const handleOnChange = jest.fn();
    const bodySupport = mount(
      <BodyLogoFormModal
        handleSubmitLogo={jest.fn()}
        handleOnChange={handleOnChange}
        type="Url"
      />
    );
    const textArea = bodySupport.find('input');
    const event = { target: { value: 'sometext' } };
    textArea.simulate('change', event);
    expect(handleOnChange).toHaveBeenCalledTimes(1);
  });
});
