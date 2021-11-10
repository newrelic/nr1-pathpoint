import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';

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
    <div style={{ width: '600px', paddingTop: '20px' }}>
      <Form onSubmit={handleSaveUpdateGeneralConfiguration}>
        {RenderForm(datos)}
        <div
          style={{
            float: 'left',
            margin: '20px 15px 0px 0px',
            height: '50px'
          }}
        >
          <span className="touchPointCheckbox">
            <input id="checkbox_logs" name="checkbox_logs" type="Checkbox" />
            <label className="checkboxLabel">Enable / Disable Logs</label>
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ background: '#0178bf', color: 'white' }}
          >
            Save / Update
          </Button>
        </div>
      </Form>
    </div>
  );
}

const RenderForm = (datos) => {
  return (
    <div style={{ height: '40px' }}>
      {renderField({
        label: 'Session Count (Min)',
        defaultValue: datos.sendingLogsEnableDisable,
        id: 'min_count',
        name: 'min_count'
      })}
    </div>
  );
};

const renderField = ({ name, label, defaultValue, id, onChange }) => {
  return (
    <>
      <input
        id={id}
        name={name}
        type="text"
        defaultValue={defaultValue}
        onChange={/* istanbul ignore next */ e => onChange(e)}
        className="inputText"
        style={{
          width: '60px',
          border: '1px solid gray',
          padding: '5px'
        }}
      />
      <label
        className="bodySubTitle"
        style={{ marginLeft: '10px', fontSize: '14px' }}
      >
        {label}
      </label>
    </>
  );
};

BodyGeneralConfigurationFormModal.propTypes = {
  stageNameSelected: PropTypes.object.isRequired,
  handleSaveUpdateGeneralConfiguration: PropTypes.func.isRequired
};

export {
  HeaderGeneralConfigurationFormModal,
  BodyGeneralConfigurationFormModal
};
