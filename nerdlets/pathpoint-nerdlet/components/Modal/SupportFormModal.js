import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button, FormControl } from 'react-bootstrap';
import CustomSelect from './CustomSelect';

// IMPORT ICONS
import support from '../../images/support.svg';

// IMPORT MESSAGES
import messages from '../../config/messages.json';

const contactSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string()
    .email()
    .required('Required'),
  message: Yup.string().required('Required')
});

const renderField = ({ onChange, placeholder, type, bsClass, margin }) => {
  return (
    <FormControl
      style={{ marginTop: margin, borderRadius: 0 }}
      bsClass={bsClass}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
    />
  );
};

const renderAreaField = ({ onChange, placeholder, bsClass, margin }) => {
  return (
    <FormControl
      bsClass={bsClass}
      onChange={onChange}
      componentClass="textarea"
      placeholder={placeholder}
      style={{ marginTop: margin, borderRadius: 0 }}
    />
  );
};

function HeaderSupportFormModal() {
  return (
    <>
      <div style={{ display: 'flex' }}>
        <div className="titleModal">
          <img src={support} height="18" /> Support
        </div>
      </div>
    </>
  );
}

function BodySupportFormModal(props) {
  const { handleSaveUpdateSupport } = props;
  const defaultOptions = defaultOptionsSelect();
  return (
    <div style={{ width: '350px' }}>
      <div className="modal4content" style={{ textAlign: 'justify' }}>
        {messages.configuration.support.message_support_01}
      </div>
      <div className="modal4content space modalMaxHeightContent">
        <Formik
          initialValues={{
            subject: '',
            name: '',
            company: '',
            account: '',
            email: '',
            phone: '',
            message: ''
          }}
          validationSchema={contactSchema}
          onSubmit={
            /* istanbul ignore next */ values => handleSaveUpdateSupport(values)
          }
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form>
              <Field
                className="custom-select"
                name="subject"
                options={defaultOptions}
                component={CustomSelect}
                placeholder="Subject"
              />
              {errors.subject && touched.subject && (
                <div style={{ color: 'red' }}>{errors.subject}</div>
              )}

              <Field
                component={renderField}
                type="text"
                name="name"
                onChange={
                  /* istanbul ignore next */ event =>
                    setFieldValue('name', event.target.value)
                }
                placeholder="Name"
                bsClass="contact"
                margin={errors.name && touched.name ? '5px' : '15px'}
              />
              {errors.name && touched.name && (
                <div style={{ color: 'red' }}>{errors.name}</div>
              )}

              <Field
                component={renderField}
                type="company"
                name="company"
                onChange={
                  /* istanbul ignore next */ event =>
                    setFieldValue('company', event.target.value)
                }
                placeholder="Company"
                bsClass="contact"
                margin={errors.company && touched.company ? '5px' : '15px'}
              />
              {errors.company && touched.company && (
                <div style={{ color: 'red' }}>{errors.company}</div>
              )}

              <Field
                component={renderField}
                type="account"
                name="account"
                onChange={
                  /* istanbul ignore next */ event =>
                    setFieldValue('account', event.target.value)
                }
                placeholder="Account Name"
                bsClass="contact"
                margin={errors.account && touched.account ? '5px' : '15px'}
              />
              {errors.account && touched.account && (
                <div style={{ color: 'red' }}>{errors.account}</div>
              )}

              <Field
                component={renderField}
                type="email"
                name="email"
                onChange={
                  /* istanbul ignore next */ event =>
                    setFieldValue('email', event.target.value)
                }
                placeholder="Email"
                bsClass="contact"
                margin={errors.name && touched.name ? '5px' : '15px'}
              />
              {errors.email && touched.email && (
                <div style={{ color: 'red' }}>{errors.email}</div>
              )}

              <Field
                component={renderField}
                type="number"
                name="phone"
                onChange={
                  /* istanbul ignore next */ event =>
                    setFieldValue('phone', event.target.value)
                }
                placeholder="Mobile"
                bsClass="contact"
                margin={errors.phone && touched.phone ? '5px' : '15px'}
              />
              {errors.phone && touched.phone && (
                <div style={{ color: 'red' }}>{errors.phone}</div>
              )}

              <Field
                component={renderAreaField}
                name="message"
                placeholder="Details"
                bsClass="contact contact-detail"
                value={values.content}
                margin={errors.phone && touched.phone ? '5px' : '15px'}
                onChange={
                  /* istanbul ignore next */ event =>
                    setFieldValue('message', event.target.value)
                }
              />
              {errors.message && touched.message && (
                <div style={{ color: 'red' }}>{errors.message}</div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{
                    background: '#0178bf',
                    color: 'white',
                    width: '45%',
                    marginTop:
                      Object.entries(errors).length > 0 ? '3px' : '20px'
                  }}
                >
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

function defaultOptionsSelect() {
  const objeto = [];
  for (const key in messages.configuration.support.options_select_support_02) {
    if (
      Object.hasOwnProperty.call(
        messages.configuration.support.options_select_support_02,
        key
      )
    ) {
      const element =
        messages.configuration.support.options_select_support_02[key];
      objeto.push({
        label: `${element}`,
        value: `${element}`
      });
    }
  }
  return objeto;
}

BodySupportFormModal.propTypes = {
  handleSaveUpdateSupport: PropTypes.func.isRequired
};

export { HeaderSupportFormModal, BodySupportFormModal };
