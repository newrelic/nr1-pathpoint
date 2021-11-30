import React from 'react';
import PropTypes from 'prop-types';
import { Button, FormControl, Form, FormGroup } from 'react-bootstrap';
import SelectIDs from '../SelectIDs/SelectIDs';

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
  const {
    stageNameSelected,
    handleFormSubmit,
    resetCredentials,
    handleOnChange,
    ValidateIngestLicense,
    licenseValidations,
    ValidateUserApiKey,
    ToggleEnableSubmit,
    disableGeneralConfigurationSubmit,
    installUpdateBackgroundScripts
  } = props;
  const datos = stageNameSelected.datos;
  const showUpdateButton =
    datos.updateBackgroundScript &&
    props.credentialsData.ingestLicense &&
    props.credentialsData.userAPIKey &&
    datos.credentials.flameTools;
  return (
    <div style={{ width: '400px', paddingTop: '20px' }}>
      <Form onSubmit={handleFormSubmit}>
        <FormGroup controlId="accountId">
          <label style={{ margin: '0px' }}>Account ID</label>
          <SelectIDs
            name="accountId"
            handleOnChange={handleOnChange}
            options={datos.accountIDs}
            idSeleccionado={
              datos.credentials.accountId
                ? datos.credentials.accountId
                : datos.accountId
            }
          />
        </FormGroup>
        <FormGroup controlId="ingestLicense">
          <label style={{ margin: '0px' }}>Ingest License</label>
          <FormControl
            name="ingestLicense"
            type="text"
            placeholder="Type your ingest license"
            bsClass="support-modal-input-text"
            value={props.credentialsData.ingestLicense}
            // onPaste={e => e.preventDefault()}
            onFocus={() => ToggleEnableSubmit(true)}
            onCopy={e => e.preventDefault()}
            onBlur={e => {
              ToggleEnableSubmit(false);
              ValidateIngestLicense(e.target.value);
            }}
            onChange={e =>
              handleOnChange({
                target: { name: 'ingestLicense', value: e.target.value }
              })
            }
          />
          {licenseValidations.ingestLicense === false && (
            <span style={{ color: '#C62828' }}>
              Ingest License is not valid
            </span>
          )}
        </FormGroup>
        <FormGroup controlId="userAPIKey">
          <label style={{ margin: '0px' }}>User API Key</label>
          <FormControl
            name="userAPIKey"
            type="text"
            placeholder="Type your User API Key"
            bsClass="support-modal-input-text"
            value={props.credentialsData.userAPIKey}
            onFocus={() => ToggleEnableSubmit(true)}
            // onPaste={e => e.preventDefault()}
            onCopy={e => e.preventDefault()}
            onBlur={e => {
              ToggleEnableSubmit(false);
              ValidateUserApiKey(e.target.value);
            }}
            onChange={e =>
              handleOnChange({
                target: { name: 'userAPIKey', value: e.target.value }
              })
            }
          />
          {licenseValidations.userApiKey === false && (
            <span style={{ color: '#C62828' }}>User API Key is not valid</span>
          )}
          <div style={{ marginTop: '25px' }}>
            <input
              id="logginCheck"
              type="checkbox"
              value={
                datos.credentials.loggin ? datos.credentials.loggin : false
              }
              defaultChecked={
                datos.credentials.loggin ? datos.credentials.loggin : false
              }
              disabled={
                !props.credentialsData.ingestLicense ||
                props.credentialsData.ingestLicense === '' ||
                licenseValidations.ingestLicense === false
              }
              onChange={e =>
                handleOnChange({
                  target: { name: 'loggin', value: e.target.checked }
                })
              }
            />
            <label className="label-checkbox"> Enable Pathpoint Logging </label>
          </div>
          <div style={{ marginTop: '10px' }}>
            <input
              id="flameToolsCheck"
              type="checkbox"
              value={
                datos.credentials.flameTools
                  ? datos.credentials.flameTools
                  : false
              }
              defaultChecked={
                datos.credentials.flameTools
                  ? datos.credentials.flameTools
                  : false
              }
              disabled={
                !props.credentialsData.userAPIKey ||
                props.credentialsData.userAPIKey === '' ||
                licenseValidations.userApiKey === false
              }
              onChange={e =>
                handleOnChange({
                  target: { name: 'flameTools', value: e.target.checked }
                })
              }
            />
            <label className="label-checkbox">
              Enable Flame Filter Background Script
            </label>
          </div>
          <div style={{ marginTop: '10px' }}>
            <input
              type="checkbox"
              id="dropToolsCheck"
              value={
                datos.credentials.dropTools
                  ? datos.credentials.dropTools
                  : false
              }
              defaultChecked={
                datos.credentials.dropTools
                  ? datos.credentials.dropTools
                  : false
              }
              disabled={
                !props.credentialsData.userAPIKey ||
                props.credentialsData.userAPIKey === '' ||
                licenseValidations.userApiKey === false
              }
              onChange={e =>
                handleOnChange({
                  target: { name: 'dropTools', value: e.target.checked }
                })
              }
            />
            <label className="label-checkbox">
              Enable Drop Filter Background Script
            </label>
          </div>
          <div
            style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <Button
              onClick={installUpdateBackgroundScripts}
              style={{
                visibility: showUpdateButton ? 'visible' : 'hidden',
                marginRight: '20px',
                background: '#09af76',
                color: 'white'
              }}
            >
              Install/Update Job
            </Button>

            <Button
              variant="outline-danger"
              onClick={resetCredentials}
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
              disabled={
                disableGeneralConfigurationSubmit ||
                licenseValidations.ingestLicense === false ||
                licenseValidations.userApiKey === false
              }
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
  handleOnChange: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  credentialsData: PropTypes.object.isRequired,
  resetCredentials: PropTypes.func.isRequired,
  ValidateIngestLicense: PropTypes.func.isRequired,
  licenseValidations: PropTypes.object.isRequired,
  ValidateUserApiKey: PropTypes.func.isRequired,
  ToggleEnableSubmit: PropTypes.func.isRequired,
  disableGeneralConfigurationSubmit: PropTypes.bool.isRequired,
  installUpdateBackgroundScripts: PropTypes.func.isRequired
};

export {
  HeaderGeneralConfigurationFormModal,
  BodyGeneralConfigurationFormModal
};
