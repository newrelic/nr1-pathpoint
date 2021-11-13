import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';
import Select from '../Select/Select';
import SelectIDs from '../SelectIDs/SelectIDs';

function HeaderQueryFormModal(props) {
  const { stageNameSelected, changeMessage } = props;
  return (
    <>
      <div style={{ display: 'flex' }}>
        <div className="titleModal" style={{ width: '290px' }}>
          {stageNameSelected.touchpoint.value}
        </div>
        <div>
          <Select
            name="query"
            handleOnChange={changeMessage}
            options={stageNameSelected.datos}
          />
        </div>
      </div>
    </>
  );
}

HeaderQueryFormModal.propTypes = {
  stageNameSelected: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.object.isRequired,
    PropTypes.number.isRequired
  ]),
  changeMessage: PropTypes.func.isRequired
};

function isObject(val) {
  return val instanceof Object;
}

function objToString(obj) {
  return Object.entries(obj).reduce((str, [p, val]) => {
    if (isObject(val)) {
      val = objToString(val);
      return `${str}${p}[${val}]\n`;
    } else {
      return `${str}${p}=${val}\n`;
    }
  }, '');
}

function validateAccountIDByDefault(id, accountIDs) {
  const result = accountIDs.some(account => {
    let found = false;
    if (account.id === id) {
      found = true;
    }
    return found;
  });
  if (!result) {
    id = accountIDs[0].id;
  }
  return id;
}

function BodyQueryFormModal(props) {
  const {
    stageNameSelected,
    handleChangeTexarea,
    chargueSample,
    testQuery,
    handleSaveUpdateQuery,
    testText,
    testingNow,
    resultsTestQuery,
    goodQuery,
    modifiedQuery,
    accountIDs
  } = props;
  const value = stageNameSelected.selectedCase
    ? stageNameSelected.selectedCase
    : 0;
  const idSeleccionado = validateAccountIDByDefault(
    stageNameSelected.datos[value].accountID,
    accountIDs
  );
  stageNameSelected.datos[value].accountID = idSeleccionado;
  const handleChange = childData => {
    /* istanbul ignore next */
    stageNameSelected.datos[value].accountID = childData.target.value;
  };
  const handleTimeoutChange = childData => {
    stageNameSelected.datos[value].timeout = childData.target.value;
  };
  const query_body = stageNameSelected.datos[value].query_body;
  const query_footer = stageNameSelected.datos[value].query_footer;
  const timeout = stageNameSelected.datos[value].timeout;
  return (
    <div
      style={{
        width: '600px'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '4px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'start',
            flexDirection: 'row',
            marginBottom: '4px'
          }}
        >
          <div
            className="selectIDModal"
            style={{
              display: 'flex',
              width: '80px',
              alignItems: 'center'
            }}
          >
            AccountId
          </div>
          <div>
            <SelectIDs
              name="query"
              handleOnChange={handleChange}
              options={accountIDs}
              idSeleccionado={idSeleccionado}
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            flexDirection: 'row',
            marginBottom: '4px'
          }}
        >
          <div
            className="selectIDModal"
            style={{
              display: 'flex',
              width: '65px',
              alignItems: 'center'
            }}
          >
            Timeout
          </div>
          <div>
            <input
              id="Timeout"
              name="Timeout"
              type="text"
              defaultValue={timeout}
              onChange={handleTimeoutChange}
              className="inputText"
              style={{
                width: '50px',
                border: '1px solid gray',
                padding: '5px'
              }}
            />
          </div>
        </div>
      </div>

      <div>
        <Form onSubmit={event => handleSaveUpdateQuery(event)}>
          {renderTextArea({
            onChange: handleChangeTexarea,
            query_body: query_body
          })}
          <strong>{query_footer}</strong>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '15px',
              backgroundColor: '#333333',
              color: '#00EC64',
              height: '60px',
              padding: '15px'
            }}
          >
            <strong>{objToString(resultsTestQuery)}</strong>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '30px'
            }}
          >
            <div
              style={{
                width: '40%',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <a
                style={{
                  paddingRight: '20px',
                  color: '#767B7F',
                  textDecoration: 'underline'
                }}
                onClick={() => {
                  chargueSample(value);
                }}
              >
                Sample Query
              </a>
              <div>
                <Button
                  disabled={testingNow}
                  variant="contained"
                  color="primary"
                  style={{
                    background: 'white',
                    border: '1px solid #767B7F',
                    boxSizing: 'border-box',
                    marginRight: '15px'
                  }}
                  onClick={
                    /* istanbul ignore next */ () => {
                      if (query_body !== '') {
                        testQuery(`${query_body} ${query_footer}`, value);
                      }
                    }
                  }
                >
                  Test
                </Button>
              </div>
            </div>

            <div
              style={{
                width: '60%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                {testText !== '' && (
                  <span
                    style={{
                      color: goodQuery ? 'green' : 'red',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {goodQuery ? <SuccessfullIcon /> : <WrongIcon />}
                    {testText}
                  </span>
                )}
              </div>
              <Button
                disabled={modifiedQuery ? true : !goodQuery}
                variant="contained"
                color="primary"
                style={{ background: '#0178bf', color: 'white' }}
                type="submit"
              >
                Save / Update
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}

const renderTextArea = ({ onChange, query_body }) => {
  return (
    <textarea
      onChange={event => onChange(event.target.value)}
      style={{
        color: '#00EC64',
        background: '#333333',
        height: '180px',
        border: '1px solid #D0D0D0',
        padding: '15px'
      }}
      value={query_body}
    />
  );
};

const WrongIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.4839 7.74194C15.4839 12.0213 12.0207 15.4839 7.74194 15.4839C3.46258 15.4839 0 12.0207 0 7.74194C0 3.46258 3.46317 0 7.74194 0C12.0213 0 15.4839 3.46317 15.4839 7.74194ZM14.2742 7.74194C14.2742 4.13121 11.3522 1.20968 7.74194 1.20968C4.13121 1.20968 1.20968 4.13169 1.20968 7.74194C1.20968 11.3527 4.13169 14.2742 7.74194 14.2742C11.3527 14.2742 14.2742 11.3522 14.2742 7.74194Z"
        fill="#FF4C4C"
      />
      <path
        d="M10.7806 9.7212L8.55942 7.50001L10.7806 5.27882C11.0731 4.98629 11.0732 4.51199 10.7806 4.21942C10.488 3.92686 10.0137 3.9269 9.72125 4.21942L7.50003 6.44061L5.2788 4.21942C4.98631 3.92686 4.51193 3.92686 4.21941 4.21942C3.92688 4.51199 3.92688 4.98629 4.21944 5.27882L6.44063 7.50001L4.21944 9.7212C3.92688 10.0138 3.92684 10.4881 4.21941 10.7806C4.51205 11.0732 4.98635 11.0731 5.2788 10.7806L7.50003 8.5594L9.72125 10.7806C10.0137 11.0731 10.4881 11.0732 10.7806 10.7806C11.0732 10.488 11.0732 10.0137 10.7806 9.7212Z"
        fill="#FF4C4C"
      />
    </svg>
  );
};

const SuccessfullIcon = () => {
  return (
    <svg
      style={{ marginRight: '3px' }}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.1642 5.28537C11.4005 5.52163 11.4005 5.90462 11.1642 6.14077L7.10662 10.1985C6.87035 10.4346 6.48749 10.4346 6.25122 10.1985L4.31963 8.2668C4.08337 8.03065 4.08337 7.64767 4.31963 7.41152C4.55578 7.17525 4.93877 7.17525 5.17491 7.41152L6.67886 8.91546L10.3088 5.28537C10.5451 5.04922 10.9281 5.04922 11.1642 5.28537ZM15.4839 7.74194C15.4839 12.0213 12.0207 15.4839 7.74194 15.4839C3.46258 15.4839 0 12.0207 0 7.74194C0 3.46258 3.46317 0 7.74194 0C12.0213 0 15.4839 3.46317 15.4839 7.74194ZM14.2742 7.74194C14.2742 4.13121 11.3522 1.20968 7.74194 1.20968C4.13121 1.20968 1.20968 4.13169 1.20968 7.74194C1.20968 11.3527 4.13169 14.2742 7.74194 14.2742C11.3527 14.2742 14.2742 11.3522 14.2742 7.74194Z"
        fill="#219653"
      />
    </svg>
  );
};

BodyQueryFormModal.propTypes = {
  stageNameSelected: PropTypes.object.isRequired,
  handleChangeTexarea: PropTypes.func.isRequired,
  chargueSample: PropTypes.func.isRequired,
  testQuery: PropTypes.func.isRequired,
  handleSaveUpdateQuery: PropTypes.func.isRequired,
  testText: PropTypes.string.isRequired,
  resultsTestQuery: PropTypes.object.isRequired,
  goodQuery: PropTypes.bool.isRequired,
  modifiedQuery: PropTypes.bool,
  accountIDs: PropTypes.array.isRequired,
  testingNow: PropTypes.bool
};

export { HeaderQueryFormModal, BodyQueryFormModal };
