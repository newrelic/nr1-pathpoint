import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';

function HeaderTuneFormModal(props) {
  const { stageNameSelected } = props;
  return (
    <>
      <div style={{ display: 'flex' }}>
        <div className="titleModal">{stageNameSelected.touchpoint.value}</div>
      </div>
    </>
  );
}

HeaderTuneFormModal.propTypes = {
  stageNameSelected: PropTypes.object.isRequired
};

function BodyTuneFormModal(props) {
  const { stageNameSelected, handleOnChange, handleSubmitTune } = props;
  const error_threshold = stageNameSelected.datos.error_threshold;
  const apdex_time = stageNameSelected.datos.apdex_time;
  return (
    <div style={{ width: '250px' }}>
      <Form onSubmit={e => handleSubmitTune(e)}>
        <div style={{ height: '40px' }}>
          {renderField({
            label: '% Error threshold',
            defaultValue: error_threshold,
            id: 'threshold',
            onChange: handleOnChange,
            name: 'threshold'
          })}
        </div>
        <div style={{ height: '40px' }}>
          {renderField({
            label: '% Apdex Min. Score',
            defaultValue: apdex_time,
            id: 'apdex',
            onChange: handleOnChange,
            name: 'apdex'
          })}
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

const renderField = ({ name, label, defaultValue, id, onChange }) => {
  return (
    <>
      <input
        id={id}
        name={name}
        type="text"
        defaultValue={defaultValue}
        onChange={e => onChange('input', e)}
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
BodyTuneFormModal.propTypes = {
  stageNameSelected: PropTypes.object.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  handleSubmitTune: PropTypes.func.isRequired
};

export { HeaderTuneFormModal, BodyTuneFormModal };
