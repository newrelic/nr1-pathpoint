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
  const datos = stageNameSelected.datos;
  return (
    <div style={{ width: 'auto' }}>
      <Form onSubmit={e => handleSubmitTune(e)}>
        {RenderForm(datos, handleOnChange)}
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

const RenderForm = (datos, handleOnChange) => {
  switch (datos[0].type) {
    case 'PRC':
      return (
        <div style={{ height: '40px' }}>
          {renderField({
            label: 'Session Count (Min)',
            defaultValue: datos[0].min_count,
            id: 'min_count',
            onChange: handleOnChange,
            name: 'min_count'
          })}
        </div>
      );
    case 'PCC':
      return (
        <div style={{ height: '40px' }}>
          {renderField({
            label: 'Transactions Count (Min)',
            defaultValue: datos[0].min_count,
            id: 'min_count',
            onChange: handleOnChange,
            name: 'min_count'
          })}
        </div>
      );
    case 'APP':
    case 'FRT':
      return (
        <>
          <div style={{ height: '40px' }}>
            {renderField({
              label: 'APDEX Threshold',
              defaultValue: datos[0].apdex_threshold,
              id: 'apdex_threshold',
              onChange: handleOnChange,
              name: 'apdex_threshold'
            })}
          </div>
          <div style={{ height: '40px' }}>
            {renderField({
              label: 'APDEX Response (Min)',
              defaultValue: datos[0].min_apdex,
              id: 'min_apdex',
              onChange: handleOnChange,
              name: 'min_apdex'
            })}
          </div>
          <div style={{ height: '40px' }}>
            {renderField({
              label: 'Response Time (Max)',
              defaultValue: datos[0].max_response_time,
              id: 'max_response_time',
              onChange: handleOnChange,
              name: 'max_response_time'
            })}
          </div>
          <div style={{ height: '40px' }}>
            {renderField({
              label: '% Error (Max)',
              defaultValue: datos[0].max_error_percentage,
              id: 'max_error_percentage',
              onChange: handleOnChange,
              name: 'max_error_percentage'
            })}
          </div>
        </>
      );
    case 'SYN':
      return (
        <>
          <div style={{ height: '40px' }}>
            {renderField({
              label: 'Avg Request Time (Max)',
              defaultValue: datos[0].max_avg_response_time,
              id: 'max_avg_response_time',
              onChange: handleOnChange,
              name: 'max_avg_response_time'
            })}
          </div>
          <div style={{ height: '40px' }}>
            {renderField({
              label: 'Total Check Time (Min)',
              defaultValue: datos[0].max_total_check_time,
              id: 'max_total_check_time',
              onChange: handleOnChange,
              name: 'max_total_check_time'
            })}
          </div>
          <div style={{ height: '40px' }}>
            {renderField({
              label: '% Success Rate (Min)',
              defaultValue: datos[0].min_success_percentage,
              id: 'min_success_percentage',
              onChange: handleOnChange,
              name: 'min_success_percentage'
            })}
          </div>
        </>
      );
  }
};

const renderField = ({ name, label, defaultValue, id, onChange }) => {
  return (
    <>
      <input
        id={id}
        name={name}
        type="text"
        defaultValue={defaultValue}
        onChange={e => onChange(e)}
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
