import React from 'react';
import PropTypes from 'prop-types';
import Select from '../Select/Select';
import { Button, FormControl, Form, FormGroup } from 'react-bootstrap';

// IMPORT ICONS
import support from '../../images/support.svg';

// IMPORT MESSAGES
import messages from '../../config/messages.json';

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
function BodySupportFormModal(props) {
  const { handleOnChange, handleSubmitSupport } = props;
  return (
    <div style={{ width: '350px' }}>
      <div className="modal4content" style={{ textAlign: 'justify' }}>
        {messages.configuration.support.message_support_01}
      </div>
      <div className="modal4content space">
        <Form onSubmit={handleSubmitSupport}>
          <FormGroup controlId="formSubject">
            <Select
              name="subject"
              options={defaultOptions}
              handleOnChange={handleOnChange}
            />
          </FormGroup>
          <FormGroup controlId="formName">
            <FormControl
              name="name"
              required
              type="text"
              placeholder="Name"
              bsClass="support-modal-input-text"
              onChange={handleOnChange}
            />
          </FormGroup>
          <FormGroup controlId="formCompany">
            <FormControl
              name="company"
              required
              type="text"
              placeholder="Company"
              bsClass="support-modal-input-text"
              onChange={handleOnChange}
            />
          </FormGroup>
          <FormGroup controlId="formAccount">
            <FormControl
              name="account"
              required
              type="text"
              placeholder="Account Name"
              bsClass="support-modal-input-text"
              onChange={handleOnChange}
            />
          </FormGroup>
          <FormGroup controlId="FormEmail">
            <FormControl
              name="email"
              required
              type="email"
              placeholder="Email"
              bsClass="support-modal-input-text"
              onChange={handleOnChange}
            />
          </FormGroup>
          <FormGroup controlId="formMobile">
            <FormControl
              name="phone"
              required
              pattern="(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})"
              type="phone"
              placeholder="Mobile"
              bsClass="support-modal-input-text"
              onChange={handleOnChange}
            />
          </FormGroup>
          <FormGroup controlId="formDetails">
            <FormControl
              name="message"
              required
              componentClass="textarea"
              rows={5}
              placeholder="Details"
              bsClass="support-modal-input-text"
              onChange={handleOnChange}
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
  handleOnChange: PropTypes.func.isRequired,
  handleSubmitSupport: PropTypes.func.isRequired
};

export { HeaderSupportFormModal, BodySupportFormModal };
