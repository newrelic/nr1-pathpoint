import React from 'react';
import PropTypes from 'prop-types';
import Ajv from 'ajv';

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

function TranslateAJVErrors(errors, payload) {
  const translated = [];
  errors.forEach(error => {
    const path = error.dataPath.split('/');
    let message = error.message;
    path.splice(0, 1);
    if (path.length === 0) {
      translated.push({
        dataPath: 'The uploaded file',
        message: error.message
      });
    } else if (path.length === 1) {
      translated.push({
        dataPath: `In the uploaded file, the following property '${path[0]}'`,
        message: error.message
      });
    } else {
      let stage = null;
      let step = null;
      let value = null;
      let kpi = null;
      let measure = null;
      let touchpoint = null;
      let dashboard_url = null;
      let dataPath = null;
      let query = null;
      path.forEach(item => {
        if (item === 'stages') {
          stage = payload.stages[parseInt(path[1])];
        } else if (item === 'steps' && !isNaN(path[3])) {
          step = payload.stages[path[1]].steps[path[3]];
        } else if (item === 'values' && !isNaN(path[5])) {
          value = payload.stages[path[1]].steps[path[3]].values[path[5]];
        } else if (item === 'kpis') {
          kpi = payload.kpis[path[1]];
        } else if (item === 'measure' && !isNaN(path[3])) {
          measure = payload.kpis[path[1]].measure[path[3]];
        } else if (item === 'touchpoints' && !isNaN(path[3])) {
          touchpoint = payload.stages[path[1]].touchpoints[path[3]];
        } else if (item === 'dashboard_url' && !isNaN(path[5])) {
          dashboard_url =
            payload.stages[path[1]].touchpoints[path[3]].dashboard_url[path[5]];
        } else if (item === 'queries' && !isNaN(path[5])) {
          query = payload.stages[path[1]].touchpoints[path[3]].queries[path[5]];
        }
      });
      if (stage) {
        if (stage.title) {
          dataPath = `The stage '${stage.title}'`;
        } else {
          dataPath = `The stage at position ${parseInt(path[1]) + 1}`;
        }
      }
      if (step) {
        if (step.line) {
          dataPath = `${dataPath}, in step line # ${step.line}`;
        } else {
          dataPath = `${dataPath}, in step at position ${parseInt(path[3]) +
            1}`;
        }
      }
      if (touchpoint) {
        if (touchpoint.title) {
          dataPath = `${dataPath}, in touchpoint '${touchpoint.title}'`;
        } else {
          dataPath = `${dataPath}, in touchpoint at position '${parseInt(
            path[3]
          ) + 1}'`;
        }
      }
      if (value) {
        if (value.title) {
          dataPath = `${dataPath}, in substep ${value.title}`;
        } else {
          dataPath = `${dataPath}, in substep at position ${parseInt(path[5]) +
            1}`;
        }
      }
      if (kpi) {
        if (kpi.name) {
          dataPath = `The KPI '${kpi.name}'`;
        } else if (kpi.shortName) {
          dataPath = `The KPI '${kpi.shortName}'`;
        } else {
          dataPath = `The KPI at the position ${parseInt(path[1]) + 1}`;
        }
      }
      if (measure) {
        dataPath = `${dataPath}, in measure at the position ${parseInt(
          path[3]
        ) + 1}`;
      }
      if (dashboard_url) {
        dataPath = `${dataPath}, in dashboard_url at position ${parseInt(
          path[5]
        ) + 1}`;
      }
      if (query) {
        if (query.type) {
          dataPath = `${dataPath}, in query ${query.type}`;
        } else {
          dataPath = `${dataPath}, in query at position ${parseInt(path[5]) + 1}`;
        }
      }
      if (!error.params.missingProperty) {
        dataPath = `${dataPath}, the property '${path[path.length - 1]}'`;
      }
      if (error.params.allowedValues) {
        let allowedValues = '';
        error.params.allowedValues.forEach(item => {
          allowedValues = `${allowedValues} ${item}, `;
        });
        allowedValues = allowedValues.trim().slice(0, -1);
        message = `${message}: ${allowedValues}`;
      }
      translated.push({
        dataPath: `${dataPath}, `,
        message
      });
    }
  });
  return translated;
}

BodyFileErrorFormModal.propTypes = {
  errorsList: PropTypes.array.isRequired,
  _onClose: PropTypes.func.isRequired,
  validateKpiQuery: PropTypes.object.isRequired,
  SetConfigurationJSON: PropTypes.func.isRequired
};

export { HeaderFileErrorFormModal, BodyFileErrorFormModal };
