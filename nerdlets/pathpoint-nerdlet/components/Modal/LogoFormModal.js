import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import CustomSelect from './CustomSelect.js';
import { Formik, Form, Field } from 'formik';
import { Button, FormControl } from 'react-bootstrap';

// IMPORT ICONS
import logo_icon_modal from '../../images/logo_icon_modal.svg';

const logoFormSchema = Yup.object().shape({
  type: Yup.string().required('Required')
});

const logoTypeOptions = [
  {
    label: 'By URL',
    value: 'url'
  },
  {
    label: 'Text',
    value: 'text'
  },
  {
    label: 'Default',
    value: 'default'
  }
];

function HeaderLogoFormModal() {
  return (
    <>
      <div style={{ display: 'flex' }}>
        <div className="titleModal">
          <img src={logo_icon_modal} height="18" /> Logo
        </div>
      </div>
    </>
  );
}

function BodyLogoFormModal(props) {
  const { LogoFormSubmit, _onClose } = props;
  return (
    <div style={{ width: '350px' }}>
      <div className="modal4content space form-parent-container">
        <Formik
          initialValues={{
            type: 'url',
            url: '',
            text: ''
          }}
          validationSchema={logoFormSchema}
          onSubmit={
            /* istanbul ignore next */ values =>
              LogoFormSubmit(values, _onClose)
          }
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form>
              <Field
                className="custom-select"
                name="type"
                options={logoTypeOptions}
                component={CustomSelect}
                placeholder=""
              />
              {values.type === 'Text' && (
                <div style={{ marginTop: '6px' }}>
                  <span
                    style={{
                      color: '#BDBDBD'
                    }}
                  >
                    28 characters limit
                  </span>
                  <Field
                    component={renderField}
                    type="text"
                    name="name"
                    onChange={
                      /* istanbul ignore next */ event =>
                        setFieldValue('text', event.target.value)
                    }
                    placeholder="Enter Text"
                    bsClass="contact"
                    margin={errors.name && touched.name ? '5px' : '15px'}
                  />
                </div>
              )}
              {values.type !== 'Text' && values.type !== 'Default' && (
                <div style={{ marginTop: '6px' }}>
                  <span
                    style={{
                      color: '#BDBDBD'
                    }}
                  >
                    Dimensions 45 x 27
                  </span>
                  <Field
                    component={renderField}
                    type="text"
                    name="name"
                    onChange={
                      /* istanbul ignore next */ event =>
                        setFieldValue('url', event.target.value)
                    }
                    placeholder="Enter URL"
                    bsClass="contact"
                    margin={errors.name && touched.name ? '5px' : '15px'}
                  />
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '20px'
                }}
              >
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
                  Save Update
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

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

BodyLogoFormModal.propTypes = {
  LogoFormSubmit: PropTypes.func.isRequired,
  _onClose: PropTypes.func.isRequired
};

export { HeaderLogoFormModal, BodyLogoFormModal };
