import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from 'nr1';
import { Button, FormControl, Form, FormGroup } from 'react-bootstrap';
// IMPORT ICONS
import setup from '../../images/setup.svg';
import closeIcon from '../../images/cerrar.svg';
// import down from '../../images/down.svg';

function HeaderUAMFormModal() {
  return (
    <>
      <div style={{ display: 'flex' }}>
        <div className="titleModal">
          <img src={setup} width="18" /> Admin Key
        </div>
      </div>
    </>
  );
}

function BodyUAMFormModal(props) {
  const {
    UAMModal,
    handleFormSubmit,
    handleOnChange,
    ToggleEnableContinueButton,
    ValidateAdminKey,
    HandleOnChange,
    HandleDeleteUser,
    handleKeyEditorSubmit
  } = props;
  return (
    <div style={{ width: UAMModal.view === 0 ? '300px' : '400px' }}>
      {UAMModal.view === 0 && (
        <>
          <Form onSubmit={handleFormSubmit}>
            <FormGroup controlId="ingestUAMkey">
              <label style={{ margin: '0px' }}>Ingest Key</label>
              <FormControl
                name="ingestUAMkey"
                type="password"
                placeholder="Type your admin access key"
                bsClass="support-modal-input-text"
                value={props.UAMModal.ingestUAMkey}
                onFocus={() => ToggleEnableContinueButton(true)}
                onCopy={e => e.preventDefault()}
                onBlur={e => {
                  ValidateAdminKey(e.target.value);
                }}
                onChange={e =>
                  handleOnChange({
                    target: { name: 'ingestUAMkey', value: e.target.value }
                  })
                }
              />
              {UAMModal.showKeyError && (
                <span style={{ color: '#C62828' }}>Incorrect Key</span>
              )}
              <div
                style={{
                  marginTop: '20px',
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={UAMModal.continueButton}
                  style={{
                    background: '#0178bf',
                    color: 'white',
                    marginRight: '20px'
                  }}
                >
                  Continue
                </Button>
              </div>
            </FormGroup>
          </Form>
        </>
      )}
      {UAMModal.view === 1 && (
        <div className="modal4content">
          <Form onSubmit={handleKeyEditorSubmit}>
            <div style={{ height: '300px', overflowY: 'scroll' }}>
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th className="headerTableTitle">Name</th>
                    <th className="headerTableTitle">Email</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {UAMModal.userAccessInfo.map((userAccess, i) => {
                    return (
                      <tr key={`stage_${i}`}>
                        <td
                          style={{
                            backgroundColor: 'white'
                          }}
                        >
                          <TextField
                            style={{
                              width: '100%'
                            }}
                            className="textFieldBody"
                            value={userAccess.name}
                            onChange={e =>
                              HandleOnChange(
                                'name',
                                e.target.value,
                                userAccess.id
                              )
                            }
                          />
                        </td>
                        <td
                          style={{
                            backgroundColor: 'white'
                          }}
                        >
                          <TextField
                            style={{
                              width: '100%'
                            }}
                            className="textFieldBody"
                            value={userAccess.email}
                            onChange={e =>
                              HandleOnChange(
                                'email',
                                e.target.value,
                                userAccess.id
                              )
                            }
                          />
                        </td>
                        <td
                          style={{
                            backgroundColor: 'white',
                            cursor: 'pointer'
                          }}
                        >
                          <img
                            style={{
                              width: '15px'
                            }}
                            src={closeIcon}
                            onClick={() => HandleDeleteUser(userAccess.id)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  width: '50%',
                  display: 'flex',
                  marginTop: '20px'
                }}
              >
                <Button
                  variant="outline-primary"
                  color="primary"
                  style={{
                    background: 'white',
                    borderColor: '#0D47A1',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    borderRadius: '2px',
                    width: '50%',
                    marginTop: '15px',
                    color: '#0D47A1'
                  }}
                  onClick={() => HandleOnChange('addEntry', null, null)}
                >
                  + Add More
                </Button>
              </div>
              <div
                style={{
                  width: '50%',
                  display: 'flex',
                  marginTop: '20px',
                  justifyContent: 'flex-end'
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{
                    background: '#0078BF',
                    color: 'white',
                    width: '50%',
                    marginTop: '15px'
                  }}
                >
                  Update
                </Button>
              </div>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}

BodyUAMFormModal.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  UAMModal: PropTypes.object.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  ToggleEnableContinueButton: PropTypes.func.isRequired,
  ValidateAdminKey: PropTypes.func.isRequired,
  HandleOnChange: PropTypes.func.isRequired,
  HandleDeleteUser: PropTypes.func.isRequired,
  handleKeyEditorSubmit: PropTypes.func.isRequired
};

export { HeaderUAMFormModal, BodyUAMFormModal };
