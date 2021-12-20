/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';

function HeaderTuneFormModal(props) {
  const { stageNameSelected } = props;
  return (
    <>
      <div
        style={{
          display: 'flex'
        }}
      >
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            marginBottom: '1px'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '47%'
            }}
          >
            <div
              style={{
                display: 'flex',
                width: '60%',
                justifyContent: 'center'
              }}
            >
              <label className="headerSubtitleTune">Configured</label>
            </div>
            <div
              style={{
                display: 'flex',
                width: '40%',
                justifyContent: 'center'
              }}
            >
              <label className="headerSubtitleTune">Last 5 min</label>
            </div>
          </div>
        </div>
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
        <>
          <div style={{ height: '40px', width: '320px' }}>
            {renderField({
              label: 'Session Count (Min)',
              defaultValue: datos[0].min_count,
              id: 'min_count',
              onChange: handleOnChange,
              name: 'min_count',
              key: 'Min',
              compare: datos[0].session_count
            })}
          </div>
          <div style={{ height: '40px', width: '320px' }}>
            {renderField({
              label: 'Session Count (Max)',
              defaultValue: datos[0].max_count,
              id: 'max_count',
              onChange: handleOnChange,
              name: 'max_count',
              key: 'Max',
              compare: datos[0].session_count
            })}
          </div>
        </>
      );
    case 'PCC':
      return (
        <>
          <div style={{ height: '40px', width: '320px' }}>
            {renderField({
              label: 'Transactions Count (Min)',
              defaultValue: datos[0].min_count,
              id: 'min_count',
              onChange: handleOnChange,
              name: 'min_count',
              key: 'Min',
              compare: datos[0].transaction_count
            })}
          </div>
          <div style={{ height: '40px', width: '320px' }}>
            {renderField({
              label: 'Transactions Count (Max)',
              defaultValue: datos[0].max_count,
              id: 'max_count',
              onChange: handleOnChange,
              name: 'max_count',
              key: 'Max',
              compare: datos[0].transaction_count
            })}
          </div>
        </>
      );
    case 'APP':
    case 'FRT':
      return (
        <>
          <div style={{ height: '40px', width: '320px' }}>
            {renderField({
              label: 'APDEX Response (Min)',
              defaultValue: datos[0].min_apdex,
              id: 'min_apdex',
              onChange: handleOnChange,
              name: 'min_apdex',
              key: 'Min',
              compare: datos[0].apdex_value
            })}
          </div>
          <div style={{ height: '40px', width: '320px' }}>
            {renderField({
              label: 'Response Time (Max)',
              defaultValue: datos[0].max_response_time,
              id: 'max_response_time',
              onChange: handleOnChange,
              name: 'max_response_time',
              key: 'Max',
              compare: datos[0].response_value
            })}
          </div>
          <div style={{ height: '40px', width: '320px' }}>
            {renderField({
              label: '% Error (Max)',
              defaultValue: datos[0].max_error_percentage,
              id: 'max_error_percentage',
              onChange: handleOnChange,
              name: 'max_error_percentage',
              key: 'Max',
              compare: datos[0].error_percentage
            })}
          </div>
        </>
      );
    case 'SYN':
      return (
        <>
          <div style={{ height: '40px', width: '320px' }}>
            {renderField({
              label: 'Avg Response Time (Max)',
              defaultValue: datos[0].max_avg_response_time,
              id: 'max_avg_response_time',
              onChange: handleOnChange,
              name: 'max_avg_response_time',
              key: 'Max',
              compare: datos[0].max_request_time
            })}
          </div>
          <div style={{ height: '40px', width: '320px' }}>
            {renderField({
              label: 'Total Check Time (Max)',
              defaultValue: datos[0].max_total_check_time,
              id: 'max_total_check_time',
              onChange: handleOnChange,
              name: 'max_total_check_time',
              key: 'Max',
              compare: datos[0].max_duration
            })}
          </div>
          <div style={{ height: '40px', width: '320px' }}>
            {renderField({
              label: '% Success Rate (Min)',
              defaultValue: datos[0].min_success_percentage,
              id: 'min_success_percentage',
              onChange: handleOnChange,
              name: 'min_success_percentage',
              key: 'Min',
              compare: datos[0].success_percentage
            })}
          </div>
        </>
      );
    case 'WLD':
      return (
        <>
          <div style={{ height: '40px' }}>
            This type of Touchpoint does not have any attributes for Tune
          </div>
        </>
      );
  }
};

const renderField = ({
  name,
  label,
  defaultValue,
  id,
  onChange,
  key,
  compare
}) => {
  return (
    <>
      <label
        className="bodySubTitle"
        style={{
          marginRight: '10px',
          fontSize: '14px',
          width: '55%'
        }}
      >
        {label}
      </label>
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
      {key === 'Min' ? (
        compare < defaultValue ? (
          <label
            className="textLast5MinTune"
            style={{
              marginLeft: '15px',
              fontSize: '14px',
              width: '16%',
              color: '#FF4C4C'
            }}
          >
            {Math.round(compare * 100) / 100}
          </label>
        ) : (
          <label
            className="textLast5MinTune"
            style={{
              marginLeft: '15px',
              fontSize: '14px',
              width: '16%',
              color: '#0aaf77'
            }}
          >
            {Math.round(compare * 100) / 100}
          </label>
        )
      ) : compare <= defaultValue ? (
        <label
          className="textLast5MinTune"
          style={{
            marginLeft: '15px',
            fontSize: '14px',
            width: '16%',
            color: '#0aaf77'
          }}
        >
          {Math.round(compare * 100) / 100}
        </label>
      ) : (
        <label
          className="textLast5MinTune"
          style={{
            marginLeft: '15px',
            fontSize: '14px',
            width: '16%',
            color: '#FF4C4C'
          }}
        >
          {Math.round(compare * 100) / 100}
        </label>
      )}
    </>
  );
};
BodyTuneFormModal.propTypes = {
  stageNameSelected: PropTypes.object.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  handleSubmitTune: PropTypes.func.isRequired
};

export { HeaderTuneFormModal, BodyTuneFormModal };
