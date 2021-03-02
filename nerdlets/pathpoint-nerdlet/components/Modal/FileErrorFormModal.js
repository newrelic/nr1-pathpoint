import React from 'react';
import PropTypes from 'prop-types';

function HeaderFileErrorFormModal() {
  return (
    <>
      <div style={{ display: 'flex' }}>
        <div className="titleModal">
          <p className="error-modal-title">
            Your view configuration file has some errors, please try again
          </p>
        </div>
      </div>
    </>
  );
}

function BodyFileErrorFormModal(props) {
  const {
    errorsList,
    handleUploadJSONFile,
    _onClose,
    configuration,
    updateNewGui,
    validateKpiQuery
  } = props;
  return (
    <div style={{ paddingTop: '30px' }}>
      {errorsList.map((error, i) => {
        return (
          <div className="error-alert-modal" key={i}>
            <p>{`${error.dataPath} - ${error.message}`}</p>
          </div>
        );
      })}
      <div style={{ float: 'right', margin: '50px 0px 0px 0px' }}>
        <label htmlFor="file-upload" className="button" color="primary">
          Fix & Upload
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".json"
          onChange={e =>
            handleUploadJSONFile(
              e,
              _onClose,
              configuration,
              updateNewGui,
              validateKpiQuery
            )
          }
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}

BodyFileErrorFormModal.propTypes = {
  errorsList: PropTypes.isRequired,
  handleUploadJSONFile: PropTypes.isRequired,
  _onClose: PropTypes.isRequired,
  configuration: PropTypes.isRequired,
  updateNewGui: PropTypes.isRequired,
  validateKpiQuery: PropTypes.isRequired
};

export { HeaderFileErrorFormModal, BodyFileErrorFormModal };
