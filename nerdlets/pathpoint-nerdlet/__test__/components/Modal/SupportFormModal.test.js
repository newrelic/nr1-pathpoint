import React from 'react';
import { mount } from 'enzyme';
import {
  BodySupportFormModal,
  HeaderSupportFormModal
} from '../../../components/Modal/SupportFormModal';

describe('<SupportFormModal/>', () => {
  it('Render body', () => {
    const bodySupport = mount(
      <BodySupportFormModal handleSaveUpdateSupport={jest.fn()} />
    );
    expect(bodySupport.length).toEqual(1);
  });
  it('Render header', () => {
    const headerSupport = mount(<HeaderSupportFormModal />);
    expect(headerSupport.length).toEqual(1);
  });
  // it('should return error for invalid name', () => {
  //   const headerSupport = shallow(
  //     <BodySupportFormModal handleSaveUpdateSupport={jest.fn()} />
  //   );
  //   const signupForm = (props = { errors: {} }) =>
  //     headerSupport.find(Formik).renderProp('children')(props);

  //   const formWithInvalidEmailErrors = signupForm({
  //     errors: {
  //       name: 'Invalid name Address'
  //     },
  //     values: {
  //       content: 'details'
  //     },
  //     touched: { name: true },
  //     isSubmitting: false
  //   });
  //   expect(formWithInvalidEmailErrors.html()).toMatch(/Invalid name/);
  // });

  // it('should return error for invalid company', () => {
  //   const headerSupport = shallow(
  //     <BodySupportFormModal handleSaveUpdateSupport={jest.fn()} />
  //   );
  //   const signupForm = (props = { errors: {} }) =>
  //     headerSupport.find(Formik).renderProp('children')(props);

  //   const formWithInvalidEmailErrors = signupForm({
  //     errors: {
  //       company: 'Invalid company'
  //     },
  //     values: {
  //       content: 'details'
  //     },
  //     touched: { company: true },
  //     isSubmitting: false
  //   });
  //   expect(formWithInvalidEmailErrors.html()).toMatch(/Invalid company/);
  // });

  // it('should return error for invalid subject', () => {
  //   const headerSupport = shallow(
  //     <BodySupportFormModal handleSaveUpdateSupport={jest.fn()} />
  //   );
  //   const signupForm = (props = { errors: {} }) =>
  //     headerSupport.find(Formik).renderProp('children')(props);

  //   const formWithInvalidEmailErrors = signupForm({
  //     errors: {
  //       subject: 'Required subject'
  //     },
  //     values: {
  //       content: 'details'
  //     },
  //     touched: { subject: true },
  //     isSubmitting: false
  //   });
  //   expect(formWithInvalidEmailErrors.html()).toMatch(/Required subject/);
  // });

  // it('should return error for invalid account', () => {
  //   const headerSupport = shallow(
  //     <BodySupportFormModal handleSaveUpdateSupport={jest.fn()} />
  //   );
  //   const signupForm = (props = { errors: {} }) =>
  //     headerSupport.find(Formik).renderProp('children')(props);

  //   const formWithInvalidEmailErrors = signupForm({
  //     errors: {
  //       account: 'Invalid account'
  //     },
  //     values: {
  //       content: 'details'
  //     },
  //     touched: { account: true },
  //     isSubmitting: false
  //   });
  //   expect(formWithInvalidEmailErrors.html()).toMatch(/Invalid account/);
  // });

  // it('should return error for invalid email', () => {
  //   const headerSupport = shallow(
  //     <BodySupportFormModal handleSaveUpdateSupport={jest.fn()} />
  //   );
  //   const signupForm = (props = { errors: {} }) =>
  //     headerSupport.find(Formik).renderProp('children')(props);

  //   const formWithInvalidEmailErrors = signupForm({
  //     errors: {
  //       email: 'Invalid format email'
  //     },
  //     values: {
  //       content: 'details'
  //     },
  //     touched: { email: true },
  //     isSubmitting: false
  //   });
  //   expect(formWithInvalidEmailErrors.html()).toMatch(/Invalid format email/);
  // });

  // it('should return error for invalid phone ', () => {
  //   const headerSupport = shallow(
  //     <BodySupportFormModal handleSaveUpdateSupport={jest.fn()} />
  //   );
  //   const signupForm = (props = { errors: {} }) =>
  //     headerSupport.find(Formik).renderProp('children')(props);

  //   const formWithInvalidEmailErrors = signupForm({
  //     errors: {
  //       phone: 'Invalid format phone '
  //     },
  //     values: {
  //       content: 'details'
  //     },
  //     touched: { phone: true },
  //     isSubmitting: false
  //   });
  //   expect(formWithInvalidEmailErrors.html()).toMatch(/Invalid format phone /);
  // });

  // it('should return error for invalid message ', () => {
  //   const headerSupport = shallow(
  //     <BodySupportFormModal handleSaveUpdateSupport={jest.fn()} />
  //   );
  //   const signupForm = (props = { errors: {} }) =>
  //     headerSupport.find(Formik).renderProp('children')(props);

  //   const formWithInvalidEmailErrors = signupForm({
  //     errors: {
  //       message: 'Invalid format message '
  //     },
  //     values: {
  //       content: 'details'
  //     },
  //     touched: { message: true },
  //     isSubmitting: false
  //   });
  //   expect(formWithInvalidEmailErrors.html()).toMatch(
  //     /Invalid format message /
  //   );
  // });
});
