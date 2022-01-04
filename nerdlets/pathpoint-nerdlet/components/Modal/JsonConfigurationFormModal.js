/* eslint-disable react/jsx-key */
/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import DownloadLink from 'react-download-link';
import ReactHtmlParser from 'react-html-parser';
import Ajv from 'ajv';
import { Button } from 'react-bootstrap';

// IMPORT SCHEMA VALIDATION
import viewSchema, { CustomSchemaValidation } from '../../schemas/view';

// IMPORT ICONS
import setup from '../../images/setup.svg';
import down from '../../images/download.svg';
import downSelect from '../../images/download-selected.svg';
import clock from '../../images/clock.svg';
import clockSelect from '../../images/clockSelect.svg';
import information from '../../images/information-white.svg';
import informationSelect from '../../images/information-white-selected.svg';
import update from '../../images/Update-json.svg';
import updateSelect from '../../images/Update-json-selected.svg';
import uploadjson from '../../images/uploadjson.png';

// IMPORT MESSAGES
import messages from '../../config/messages.json';

function HeaderJsonConfigurationFormModal(props) {
  const { GetCurrentConfigurationJSON } = props;

  const changeColor = select => {
    props.onOptionConfigurationChange(select);
  };

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
              position: 'relative',
              cursor: 'pointer'
            }}
            onClick={() => changeColor('download')}
          >
            <img src={down} width="16" onClick={() => HandleDownload()} />
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

// export default JsonConfigurationFormModal;

function HandleDownload() {
  const button = document.querySelector('.downloadLink');
  button.click();
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
              onClick={() => HandleFromFileClick()}
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

function GoToDocumentation() {
  window.open('https://github.com/newrelic/nr1-pathpoint#readme', '_blank');
}

// const YoutubeIcon = () => {
//   return (
//     <svg
//       width="14"
//       height="11"
//       viewBox="0 0 14 11"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         fillRule="evenodd"
//         clipRule="evenodd"
//         d="M13.8963 2.58956L13.8969 2.59621C13.9011 2.64496 13.9999 3.80284 14 4.96538V6.05213C14 7.21466 13.9011 8.37255 13.8969 8.4213L13.8953 8.43615C13.8817 8.55039 13.7474 9.56788 13.2833 10.0912C12.7264 10.7268 12.0984 10.796 11.7964 10.8292L11.7962 10.8293C11.7673 10.8324 11.7411 10.8352 11.7177 10.8385L11.6932 10.8411C9.84239 10.9807 7.04737 10.9998 7.01939 10.9999L7.01511 11L7.01084 10.9999C6.86878 10.9978 3.51824 10.9458 2.4496 10.8403L2.41723 10.8357C2.38467 10.8297 2.33732 10.8241 2.28228 10.8176L2.27785 10.8171C1.91768 10.7743 1.24808 10.6947 0.718516 10.0935C0.233488 9.56445 0.115569 8.54374 0.103713 8.42872L0.102966 8.42141C0.0987999 8.37266 0 7.21466 0 6.05213V4.96538C0 3.80284 0.0987999 2.64485 0.102966 2.59621L0.104568 2.58136C0.118346 2.46701 0.252501 1.44951 0.716593 0.926306C1.28141 0.28177 1.91309 0.206092 2.21664 0.169749C2.2209 0.169234 2.2251 0.168729 2.22924 0.168232C2.24823 0.16595 2.26591 0.163824 2.28222 0.16155L2.3069 0.15889C4.17438 0.0192796 6.96951 0.000221604 6.99749 0.000110802L6.99995 0L7.0024 0.000110802C7.03039 0.000221604 9.82552 0.0192796 11.6763 0.15889L11.7008 0.16155C11.7216 0.16443 11.7449 0.167201 11.7703 0.170192C12.0774 0.206425 12.7159 0.281992 13.2791 0.904035C13.7664 1.43289 13.8844 2.47266 13.8963 2.58956ZM13.0804 8.33798C13.0889 8.23626 13.1795 7.12813 13.1795 6.05213V4.96538C13.1795 3.87198 13.0862 2.74834 13.08 2.67576C13.0451 2.34413 12.9076 1.73162 12.6855 1.49151L12.6822 1.48785C12.3247 1.09229 11.9351 1.04619 11.6774 1.01572L11.676 1.01555C11.6506 1.01251 11.6269 1.00969 11.6052 1.00686C9.80512 0.871903 7.09714 0.851737 6.99995 0.851072L6.99625 0.851101C6.84867 0.85226 4.17566 0.873252 2.37761 1.00686C2.35871 1.0094 2.33838 1.01184 2.31669 1.01445L2.31074 1.01517C2.06016 1.0452 1.68131 1.09063 1.322 1.50059C1.10528 1.74502 0.961083 2.34978 0.919533 2.67986C0.910775 2.78368 0.820413 3.8906 0.820413 4.96538V6.05213C0.820413 7.1432 0.913338 8.2644 0.919854 8.3413C0.954781 8.6664 1.09225 9.26838 1.31441 9.50849L1.322 9.51691C1.64474 9.88518 2.06445 9.93507 2.37109 9.97152L2.3712 9.97153C2.43165 9.97863 2.48901 9.9855 2.54209 9.99447C3.57816 10.0943 6.87968 10.1467 7.01864 10.1488C7.14254 10.148 9.83214 10.1274 11.6223 9.99314C11.6488 9.98971 11.678 9.98638 11.7097 9.98295C11.9711 9.95425 12.3293 9.9148 12.6779 9.51691C12.904 9.26196 13.0455 8.6182 13.0804 8.33798ZM6.06198 3.09471L9.1549 4.85026C9.33797 4.95419 9.45119 5.15308 9.45044 5.36948C9.44959 5.58587 9.33498 5.78388 9.15137 5.88637L6.05835 7.61167C5.97343 7.65909 5.88115 7.68269 5.78908 7.68269C5.68857 7.68269 5.58828 7.65455 5.49781 7.59848C5.32456 7.49112 5.22117 7.30198 5.22117 7.09267V3.61171C5.22117 3.40141 5.3252 3.21194 5.49962 3.10468C5.67394 2.99753 5.88414 2.99377 6.06198 3.09471ZM6.04158 4.05315V6.65478L8.35318 5.36527L6.04158 4.05315Z"
//         fill="#FF4C4C"
//       />
//     </svg>
//   );
// };

const UploadIcon = () => {
  return (
    <svg
      style={{ marginRight: '5px' }}
      width="7"
      height="10"
      viewBox="0 0 7 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.063 1.55078L0.74664 3.95719C0.576005 4.13446 0.298613 4.13446 0.127977 3.95719C-0.0426587 3.77992 -0.0426587 3.49175 0.127977 3.31448L3.19067 0.132723C3.27555 0.0445439 3.38756 -1.26948e-06 3.49956 -1.25969e-06C3.61157 -1.2499e-06 3.72358 0.0445439 3.80933 0.132724L6.87202 3.31448C7.04266 3.49175 7.04266 3.77992 6.87202 3.95719C6.70139 4.13446 6.424 4.13446 6.25336 3.95719L3.93806 1.55265L3.93806 9.54546C3.93806 9.79637 3.74204 10 3.50053 10C3.25901 10 3.063 9.79637 3.063 9.54546L3.063 1.55078Z"
        fill="white"
      />
    </svg>
  );
};

const DownloadIcon = () => {
  return (
    <svg
      style={{ marginRight: '5px' }}
      width="11"
      height="13"
      viewBox="0 0 7 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.437 8.44922L6.75336 6.04281C6.924 5.86554 7.20139 5.86554 7.37202 6.04281C7.54266 6.22008 7.54266 6.50825 7.37202 6.68552L4.30933 9.86728C4.22445 9.95546 4.11244 10 4.00044 10C3.88843 10 3.77642 9.95546 3.69067 9.86728L0.627977 6.68552C0.457341 6.50825 0.457341 6.22008 0.627977 6.04281C0.798612 5.86554 1.076 5.86554 1.24664 6.04281L3.56194 8.44735L3.56194 0.454536C3.56194 0.203632 3.75796 0 3.99947 0C4.24099 0 4.437 0.203632 4.437 0.454536L4.437 8.44922Z"
        fill="white"
      />
    </svg>
  );
};

function HandleFromFileClick() {
  const input = document.querySelector('#file-upload');
  input.click();
}

HeaderJsonConfigurationFormModal.propTypes = {
  onOptionConfigurationChange: PropTypes.func,
  GetCurrentConfigurationJSON: PropTypes.func
};

BodyJsonConfigurationFormModal.propTypes = {
  _onClose: PropTypes.func.isRequired,
  GetCurrentConfigurationJSON: PropTypes.func.isRequired,
  SetConfigurationJSON: PropTypes.func.isRequired,
  validateKpiQuery: PropTypes.object.isRequired,
  onOptionConfigurationChange: PropTypes.func,
  UpdateJSONMetaData: PropTypes.func,
  configurationOptionSelected: PropTypes.string,
  onFileChange: PropTypes.func,
  fileName: PropTypes.string,
  fileNote: PropTypes.string,
  username: PropTypes.string,
  jsonMetaData: PropTypes.object,
  GetHistoricJSONData: PropTypes.func,
  UpdateItemSelectFromHistoric: PropTypes.func,
  JSONModal: PropTypes.object,
  currentHistoricSelected: PropTypes.object,
  RestoreJSONFromHistoric: PropTypes.func
};

export { HeaderJsonConfigurationFormModal, BodyJsonConfigurationFormModal };
