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

  // it('should return error for name type text', () => {
  //   const headerSupport = shallow(
  //     <BodyLogoFormModal LogoFormSubmit={jest.fn()} _onClose={jest.fn()} />
  //   );
  //   const signupForm = (props = { errors: {} }) =>
  //     headerSupport.find(Formik).renderProp('children')(props);

  //   const formWithInvalidNameErrors = signupForm({
  //     errors: {
  //       name: 'Invalid name'
  //     },
  //     values: {
  //       type: 'Text'
  //     },
  //     touched: { name: true }
  //   });
  //   expect(formWithInvalidNameErrors).toBeDefined();
  // });

  // it('should return error for name type url', () => {
  //   const headerSupport = shallow(
  //     <BodyLogoFormModal LogoFormSubmit={jest.fn()} _onClose={jest.fn()} />
  //   );
  //   const signupForm = (props = { errors: {} }) =>
  //     headerSupport.find(Formik).renderProp('children')(props);

  //   const formWithInvalidNameErrors = signupForm({
  //     errors: {
  //       name: 'Invalid name'
  //     },
  //     values: {
  //       type: 'Url'
  //     },
  //     touched: { name: true }
  //   });
  //   expect(formWithInvalidNameErrors).toBeDefined();
  // });
});
