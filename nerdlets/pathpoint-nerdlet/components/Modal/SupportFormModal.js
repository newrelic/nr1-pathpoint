import React from 'react';
import PropTypes from 'prop-types';
import { Button, FormControl, Form, FormGroup } from 'react-bootstrap';
import Select from 'react-select';

// IMPORT ICONS
import support from '../../images/support.svg';

// IMPORT MESSAGES
import messages from '../../config/messages.json';

let subject = '';

let name = '';

let company = '';

let account = '';

let email = '';

let phone = '';

let message = '';

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

const defaultOptions = defaultOptionsSelect();

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

function handleSubmit(event, values, handleSaveUpdateSupport) {
  event.preventDefault();
  const subject = values.subject;
  values.subject = subject.label;
  handleSaveUpdateSupport(values);
}

function BodySupportFormModal(props) {
  const { handleSaveUpdateSupport } = props;
  return (
    <div style={{ width: '350px' }}>
      <div className="modal4content" style={{ textAlign: 'justify' }}>
        {messages.configuration.support.message_support_01}
      </div>
      <div className="modal4content space">
        <Form
          onSubmit={e =>
            handleSubmit(
              e,
              {
                subject,
                name,
                company,
                account,
                email,
                phone,
                message
              },
              handleSaveUpdateSupport
            )
          }
        >
          <FormGroup controlId="formSubject">
            <Select
              name="Subject"
              onChange={e => (subject = e)}
              placeholder="Subject"
              options={defaultOptions}
              styles={customStyles}
              theme={theme => ({
                ...theme,
                borderRadius: 0
              })}
            />
          </FormGroup>
          <FormGroup controlId="formName">
            <FormControl
              required
              type="text"
              placeholder="Name"
              bsClass="support-modal-input-text"
              onChange={e => (name = e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="formCompany">
            <FormControl
              required
              type="text"
              placeholder="Company"
              bsClass="support-modal-input-text"
              onChange={e => (company = e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="formAccount">
            <FormControl
              required
              type="text"
              placeholder="Account Name"
              bsClass="support-modal-input-text"
              onChange={e => (account = e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="FormEmail">
            <FormControl
              required
              type="email"
              placeholder="Email"
              bsClass="support-modal-input-text"
              onChange={e => (email = e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="formMobile">
            <FormControl
              required
              pattern="(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})"
              type="phone"
              placeholder="Mobile"
              bsClass="support-modal-input-text"
              onChange={e => (phone = e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="formDetails">
            <FormControl
              required
              componentClass="textarea"
              rows={5}
              placeholder="Details"
              bsClass="support-modal-input-text"
              onChange={e => (message = e.target.value)}
            />
          </FormGroup>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{
                background: '#0178bf',
                color: 'white',
                width: '45%'
              }}
            >
              Submit
            </Button>
          </div>
        </Form>
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
