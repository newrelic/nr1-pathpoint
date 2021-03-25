import React from 'react';
import Select from '../Select/Select';
import PropTypes from 'prop-types';
import { Button, FormControl, Form, FormGroup } from 'react-bootstrap';

// IMPORT ICONS
import logo_icon_modal from '../../images/logo_icon_modal.svg';

const logoTypeOptions = [
  {
    label: 'By URL',
    value: 'url'
  },
  {
    label: 'Text',
    value: 'Text'
  },
  {
    label: 'Default',
    value: 'Default'
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
  const { handleSubmitLogo, handleOnChange, type } = props;
  return (
    <div style={{ width: '350px' }}>
      <div className="modal4content space form-parent-container">
        <Form onSubmit={handleSubmitLogo}>
          <FormGroup controlId="formType">
            <Select
              name="type"
              handleOnChange={handleOnChange}
              options={logoTypeOptions}
            />
          </FormGroup>
          {type === 'Text' && (
            <div style={{ marginTop: '6px' }}>
              <span
                style={{
                  color: '#BDBDBD'
                }}
              >
                28 characters limit
              </span>
              <FormGroup controlId="formName">
                <FormControl
                  name="text"
                  required
                  type="text"
                  placeholder="Enter Text"
                  bsClass="support-modal-input-text"
                  onChange={handleOnChange}
                />
              </FormGroup>
            </div>
          )}
          {type !== 'Text' && type !== 'Default' && (
            <div style={{ marginTop: '6px' }}>
              <span
                style={{
                  color: '#BDBDBD'
                }}
              >
                Dimensions 45 x 27
              </span>
              <FormGroup controlId="formUrl">
                <FormControl
                  name="url"
                  required
                  type="text"
                  placeholder="Enter URL"
                  bsClass="support-modal-input-text"
                  onChange={handleOnChange}
                />
              </FormGroup>
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
                marginTop: '15px'
              }}
            >
              Save Update
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

BodyLogoFormModal.propTypes = {
  handleSubmitLogo: PropTypes.func.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
};

export { HeaderLogoFormModal, BodyLogoFormModal };
