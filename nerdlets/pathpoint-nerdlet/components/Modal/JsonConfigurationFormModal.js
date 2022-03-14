import React from 'react';
import PropTypes from 'prop-types';
import DownloadLink from 'react-download-link';
import Ajv from 'ajv';
import { Button } from 'react-bootstrap';

// IMPORT SCHEMA VALIDATION
import viewSchema, { CustomSchemaValidation } from '../../schemas/view';

// IMPORT ICONS
import setup from '../../images/setup.svg';
import clock from '../../images/clock.svg';
import information from '../../images/information-white.svg';
import uploadjson from '../../images/uploadjson.png';

function HeaderJsonConfigurationFormModal(props) {
  const { GetCurrentConfigurationJSON } = props;

  return (
    <>
      <div style={{ display: 'flex', width: '100%' }}>
        <div className="titleModal" style={{ width: '50%' }}>
          <img src={setup} width="18" /> Json Config.
          <img
            style={{ cursor: 'pointer', marginLeft: '10px' }}
            src={information}
            onClick={() => GoToDocumentation()}
          />
        </div>
        <div className="container_header_icons">
          <div
            style={{
              marginLeft: '20px',
              cursor: 'pointer',
              width: '25px',
              height: '25px',
              position: 'relative'
            }}
            onClick={() => HandleDownload()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              width="20"
              height="20"
              focusable="false"
              role="img"
              fill="#017C86"
              style={{
                position: 'absolute',
                top: '0px',
                left: '0px',
                width: '100%',
                height: '100%'
              }}
            >
              <path d="M11.4 8.4l-.8-.8L8 10.3V1H7v9.3L4.4 7.6l-.8.8 3.9 3.8z" />
              <path d="M13 10v4H2v-4H1v5h13v-5z" />
            </svg>
            <div
              style={{
                position: 'absolute',
                top: '-1000px',
                left: '0px'
              }}
            >
              <DownloadLink
                label="Pathpoint_Json_v1.5"
                filename="Pathpoint_Json_v1.5.json"
                className="downloadLink"
                style={{ cursor: 'pointer' }}
                exportFile={
                  /* istanbul ignore next */ () => GetCurrentConfigurationJSON()
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function HandleDownload() {
  const button = document.querySelector('.downloadLink');
  button.click();
}

/* istanbul ignore next */
export function handleUploadJSONFile(
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
              dataPath: `Error at KPI '${parsed[i].name}', in measure at position 1, in property 'query': `,
              message: `bad query structure`
            });
          }
        }
        const customErrors = CustomSchemaValidation(
          JSON.parse(eX.target.result)
        );
        let totalErrrors = [];
        if (!customErrors && queryErrors.length === 0) {
          SetConfigurationJSON(eX.target.result, e);
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
          message: `Bad JSON File Structure ${error}`
        }
      ]);
    }
  };
}

export function TranslateAJVErrors(errors, payload) {
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
          dataPath = `${dataPath}, in query at position ${parseInt(path[5]) +
            1}`;
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

function BodyJsonConfigurationFormModal(props) {
  const {
    _onClose,
    SetConfigurationJSON,
    validateKpiQuery,
    UpdateJSONMetaData,
    jsonMetaData,
    GetHistoricJSONData,
    JSONModal,
    UpdateItemSelectFromHistoric,
    currentHistoricSelected,
    RestoreJSONFromHistoric,
    username
  } = props;
  return (
    <div style={{ width: JSONModal.view === 0 ? '400px' : '600px' }}>
      {JSONModal.view === 0 && (
        <>
          <div>
            <div style={{ marginBottom: '20px' }}>
              <label>Description: </label>
              <input
                type="text"
                className="text-input-custom"
                maxLength={64}
                onChange={e =>
                  UpdateJSONMetaData('description', e.target.value)
                }
              />
            </div>
            <div>
              <label>Note: </label>
              <textarea
                type="text"
                className="text-input-custom"
                rows="5"
                onChange={e => UpdateJSONMetaData('note', e.target.value)}
              />
            </div>
            <div style={{ marginTop: '10px' }}>
              <p>
                User:
                <strong>{` ${username}`}</strong>
              </p>
            </div>
          </div>
          <div
            id="upload-file-submit"
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '30px'
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={
                jsonMetaData.description === '' || jsonMetaData.note === ''
              }
              onClick={/* istanbul ignore next */ () => HandleFromFileClick()}
              style={{
                background: '#0178bf',
                color: 'white',
                marginRight: '20px'
              }}
            >
              <img
                style={{ marginRight: '4px', width: '16px', height: 'auto' }}
                src={uploadjson}
              />
              From File
            </Button>
            <div style={{ position: 'relative' }}>
              <Button
                variant="contained"
                color="primary"
                style={{
                  background: '#0178bf',
                  color: 'white'
                }}
                onClick={GetHistoricJSONData}
              >
                <img style={{ marginRight: '4px' }} src={clock} />
                From History
              </Button>
            </div>
          </div>
        </>
      )}
      {JSONModal.view === 1 && (
        <div>
          {JSONModal.historic.length === 0 && (
            <div>
              <p>There isn't historic to show</p>
            </div>
          )}
          <div style={{ maxHeight: '430px', overflowY: 'scroll' }}>
            {JSONModal.historic.map((historic, i) => {
              const date = new Date(historic.jsonMetaData.date);
              return (
                <div
                  key={`div_${i}`}
                  style={{
                    borderBottom: '1px solid lightgrey',
                    marginBottom: '25px'
                  }}
                >
                  <input
                    name="historic"
                    value={i}
                    type="radio"
                    onChange={UpdateItemSelectFromHistoric}
                  />
                  <label
                    style={{
                      marginLeft: '5px',
                      transform: 'translateY(-3px)',
                      color: '#1976D2'
                    }}
                  >
                    {historic.jsonMetaData.description}
                  </label>
                  <p
                    style={{
                      marginLeft: '22px'
                    }}
                  >
                    {historic.jsonMetaData.note}
                  </p>
                  <div
                    style={{
                      paddingLeft: '22px',
                      paddingRight: '22px',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <p>{`${date.getDate()}/${date.getMonth() +
                      1}/${date.getFullYear()}`}</p>
                    <p>{historic.jsonMetaData.user}</p>
                    <p>{historic.jsonMetaData.filename}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '30px'
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={currentHistoricSelected === null}
              onClick={RestoreJSONFromHistoric}
              style={{
                background: '#0178bf',
                color: 'white',
                marginRight: '20px'
              }}
            >
              Restore
            </Button>
          </div>
        </div>
      )}
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
  );
}

export function GoToDocumentation() {
  window.open('https://github.com/newrelic/nr1-pathpoint#readme', '_blank');
}

export function HandleFromFileClick() {
  const input = document.querySelector('#file-upload');
  input.click();
}

HeaderJsonConfigurationFormModal.propTypes = {
  GetCurrentConfigurationJSON: PropTypes.func
};

BodyJsonConfigurationFormModal.propTypes = {
  _onClose: PropTypes.func.isRequired,
  SetConfigurationJSON: PropTypes.func.isRequired,
  validateKpiQuery: PropTypes.object.isRequired,
  UpdateJSONMetaData: PropTypes.func,
  username: PropTypes.string,
  jsonMetaData: PropTypes.object,
  GetHistoricJSONData: PropTypes.func,
  UpdateItemSelectFromHistoric: PropTypes.func,
  JSONModal: PropTypes.object,
  currentHistoricSelected: PropTypes.object,
  RestoreJSONFromHistoric: PropTypes.func
};

export { HeaderJsonConfigurationFormModal, BodyJsonConfigurationFormModal };
