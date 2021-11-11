import React from 'react';
import PropTypes from 'prop-types';
import { Button, FormControl, Form, FormGroup } from 'react-bootstrap';
import Select from '../Select/Select';

// IMPORT ICONS
import setup from '../../images/setup.svg';

function HeaderGeneralConfigurationFormModal() {
  return (
    <>
      <div style={{ display: 'flex' }}>
        <div className="titleModal">
          <img src={setup} width="18" /> Credentials and General Configuration
        </div>
      </div>
    </>
  );
}

function BodyGeneralConfigurationFormModal(props) {
  const { stageNameSelected, handleSaveUpdateGeneralConfiguration } = props;
  const datos = stageNameSelected.datos;
  return (
    <div style={{ width: '400px', paddingTop: '20px' }}>
      <Form onSubmit={handleSaveUpdateGeneralConfiguration}>
        <FormGroup controlId="accountId">
          <label style={{ margin: '0px' }}>Account ID</label>
          <Select
            name="subject"
            options={[{ label: 'Select Account ID' }]}
            handleOnChange={() => null}
          />
        </FormGroup>
        <FormGroup controlId="ingestLicense">
          <label style={{ margin: '0px' }}>Ingest License</label>
          <FormControl
            name="ingestLicense"
            type="text"
            placeholder="Type your ingest license"
            bsClass="support-modal-input-text"
            onChange={() => null}
          />
        </FormGroup>
        <FormGroup controlId="userAPIKey">
          <label style={{ margin: '0px' }}>User API Key</label>
          <FormControl
            name="userAPIKey"
            type="text"
            placeholder="Type your User API Key"
            bsClass="support-modal-input-text"
            onChange={() => null}
          />
          <div style={{ marginTop: '25px' }}>
            <input type="checkbox" />
            <label className="label-checkbox"> Pathpoint Loggin </label>
          </div>
          <div style={{ marginTop: '10px' }}>
            <input type="checkbox" />
            <label className="label-checkbox">
              Flame Tools Script Updates{' '}
            </label>
          </div>
          <div style={{ marginTop: '10px' }}>
            <input type="checkbox" />
            <label className="label-checkbox">Drop Tools Script Updates</label>
          </div>
          <div
            style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <Button
              variant="outline-danger"
              style={{
                marginRight: '20px'
              }}
            >
              Reset Credentials
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{
                background: '#0178bf',
                color: 'white'
              }}
            >
              Save / Update
            </Button>
          </div>
        </FormGroup>
      </Form>
    </div>
  );
}

BodyGeneralConfigurationFormModal.propTypes = {
  stageNameSelected: PropTypes.object.isRequired,
  handleSaveUpdateGeneralConfiguration: PropTypes.func.isRequired
};

export {
  HeaderGeneralConfigurationFormModal,
  BodyGeneralConfigurationFormModal
};
