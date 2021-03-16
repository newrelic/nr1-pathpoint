import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { Button, FormControl, Form, FormGroup } from 'react-bootstrap';

// IMPORT ICONS
import logo_icon_modal from '../../images/logo_icon_modal.svg';

const customStyles = {
  container: provided => ({
    ...provided,
    width: '100%'
  }),
  control: styles => ({
    ...styles,
    width: '100%',
    height: '30px !important',
    minHeight: '30px !important'
  }),
  menu: provided => ({
    ...provided,
    width: '100%'
  }),
  indicatorsContainer: styles => ({
    ...styles,
    height: '30px !important'
  })
};

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
  const { handleSubmitLogo, handleOnChange, type } = props;
  return (
    <div style={{ width: '350px' }}>
      <div className="modal4content space form-parent-container">
        <Form onSubmit={e => handleSubmitLogo(e)}>
          <FormGroup controlId="formSubject">
            <Select
              name="type"
              onChange={e => handleOnChange('select', e)}
              placeholder=""
              defaultValue={logoTypeOptions[0]}
              options={logoTypeOptions}
              styles={customStyles}
              theme={theme => ({
                ...theme,
                borderRadius: 0
              })}
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
                  onChange={e => handleOnChange('input', e)}
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
                  onChange={e => handleOnChange('input', e)}
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
