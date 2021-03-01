import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';

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
  const { stageNameSelected, handleSaveUpdateTune } = props;
  const error_threshold = stageNameSelected.datos.error_threshold;
  const apdex_time = stageNameSelected.datos.apdex_time;
  return (
    <div style={{ width: '250px' }}>
      <Formik
        initialValues={{
          threshold: error_threshold,
          apdex: apdex_time
        }}
        onSubmit={values => handleSaveUpdateTune(values)}
      >
        {({ setFieldValue }) => (
          <Form>
            <div style={{ height: '40px' }}>
              <Field
                id="threshold"
                name="threshold"
                onChange={event =>
                  setFieldValue('threshold', event.target.value)
                }
                defaultValue={error_threshold}
                component={renderField}
                label="% Error threshold"
              />
            </div>
            <div style={{ height: '40px' }}>
              <Field
                id="apdex"
                name="apdex"
                onChange={event => setFieldValue('apdex', event.target.value)}
                defaultValue={apdex_time}
                component={renderField}
                label="% Apdex Min. Score"
              />
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
        )}
      </Formik>
    </div>
  );
}

const renderField = ({ label, defaultValue, id, onChange }) => {
  return (
    <>
      <input
        id={id}
        type="text"
        defaultValue={defaultValue}
        onChange={onChange}
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
  handleSaveUpdateTune: PropTypes.func.isRequired
};

export { HeaderTuneFormModal, BodyTuneFormModal };
