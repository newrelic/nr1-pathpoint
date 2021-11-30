import React from 'react';
import PropTypes from 'prop-types';
import Ajv from 'ajv';

// IMPORT UTILS
import { TranslateAJVErrors } from './JsonConfigurationFormModal';

// IMPORT SCHEMA VALIDATION
import viewSchema, { CustomSchemaValidation } from '../../schemas/view';

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
    _onClose,
    validateKpiQuery,
    SetConfigurationJSON
  } = props;
  return (
    <>
      <div className="containerError">
        {errorsList.map((error, i) => {
          return (
            <div className="error-alert-modal" key={i}>
              <p>{`${error.dataPath} ${error.message}`}</p>
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end'
        }}
      >
        <label htmlFor="file-upload" className="button" color="primary">
          Fix & Upload
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".json"
          onChange={
            /* istanbul ignore next */ e =>
              handleUploadJSONFile(
                e,
                _onClose,
                validateKpiQuery,
                SetConfigurationJSON
              )
          }
          style={{ display: 'none' }}
        />
      </div>
    </>
  );
}

/* istanbul ignore next */
function handleUploadJSONFile(
  e,
  onClose,
  validateKpiQuery,
  SetConfigurationJSON
) {
  const fileReader = new FileReader();
  fileReader.readAsText(e.target.files[0], 'UTF-8');
  fileReader.onload = async eX => {
    try {
      const validator = new Ajv({ allErrors: true, async: true });
      const validate = validator.compile(viewSchema);
      const valid = await validate(JSON.parse(eX.target.result));
      if (valid) {
        let parsed = JSON.parse(eX.target.result);
        parsed = parsed.kpis;
        const queryErrors = [];
        let tested = false;
        for (let i = 0; i < parsed.length; i++) {
          if (parsed[i].type === 100) {
            tested = await validateKpiQuery.validateQuery(
              'KPI-100',
              parsed[i].measure[0].query
            );
          } else if (parsed[i].type === 101) {
            tested = await validateKpiQuery.validateQuery(
              'KPI-101',
              parsed[i].measure[0].query
            );
          }
          if (!tested.goodQuery) {
            queryErrors.push({
              dataPath: `Error at KPI '${parsed[i].name}', in measure at position 1, in property 'query', `,
              message: `bad query structure`
            });
          }
        }
        const customErrors = CustomSchemaValidation(
          JSON.parse(eX.target.result)
        );
        let totalErrrors = [];
        if (!customErrors && queryErrors.length === 0) {
          SetConfigurationJSON(eX.target.result);
        }
        if (customErrors) {
          totalErrrors = [...customErrors];
        }
        if (queryErrors.length > 0) {
          totalErrrors = [...totalErrrors, ...queryErrors];
        }
        if (totalErrrors.length === 0) {
          totalErrrors = false;
        }
        onClose(totalErrrors);
      } else {
        const errors = TranslateAJVErrors(
          validate.errors,
          JSON.parse(eX.target.result)
        );
        onClose(errors);
      }
    } catch (error) {
      onClose([
        {
          dataPath: `JSON File`,
          message: `Bad JSON File Structure`
        }
      ]);
    }
  };
}

BodyFileErrorFormModal.propTypes = {
  errorsList: PropTypes.array.isRequired,
  _onClose: PropTypes.func.isRequired,
  validateKpiQuery: PropTypes.object.isRequired,
  SetConfigurationJSON: PropTypes.func.isRequired
};

export { HeaderFileErrorFormModal, BodyFileErrorFormModal };
