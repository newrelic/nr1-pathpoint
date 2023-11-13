import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownItem, TextField } from 'nr1';
import { Button, Form } from 'react-bootstrap';
import shortid from 'shortid';

import iconHide from '../../images/icon-hide.svg';
import iconView from '../../images/icon-view.svg';
import iconCopy from '../../images/icon-copy.svg';
import iconDelete from '../../images/icon-delete.svg';
import closeIconStep from '../../images/closeIconStep.svg';

function DispatchCustomEvent(name) {
  const event = new Event(name, {});
  document.dispatchEvent(event);
}

class HeaderStepsEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      hide: false
    };
  }

  componentDidMount() {
    document.addEventListener('HideIcon', this.HideIcon);
    document.addEventListener('ShowIcon', this.ShowIcon);
    document.addEventListener('DisplayIcon', this.DisplayIcon);
    document.addEventListener('NoDisplayIcon', this.NoDisplayIcon);
  }

  componentWillUnmount() {
    document.removeEventListener('HideIcon', this.HideIcon);
    document.removeEventListener('ShowIcon', this.ShowIcon);
    document.removeEventListener('DisplayIcon', this.DisplayIcon);
    document.removeEventListener('NoDisplayIcon', this.NoDisplayIcon);
  }

  DisplayIcon = () => {
    this.setState({
      show: true
    });
  };

  NoDisplayIcon = () => {
    this.setState({
      show: false
    });
  };

  HideIcon = () => {
    this.setState({
      hide: true
    });
  };

  ShowIcon = () => {
    this.setState({
      hide: false
    });
  };

  DispatchCustomEvent = name => {
    const event = new Event(name, {});
    document.dispatchEvent(event);
  };

  render() {
    return (
      <>
        <div style={{ display: 'flex' }}>
          <div className="titleModal">
            <div style={{ display: 'flex', width: '525px' }}>
              <div style={{ width: '50%' }}>
                <div className="mainHeaderFirstTitle">Steps</div>
                <div className="mainHeaderSecondTitle">Edit</div>
              </div>
              <div
                style={{
                  width: '50%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  paddingTop: '10px'
                }}
              >
                {this.state.show && (
                  <div
                    id="ChangeVisibleStepEditor"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'column',
                      marginRight: '15px',
                      cursor: 'pointer'
                    }}
                    onClick={() =>
                      this.DispatchCustomEvent('ChangeVisibleStepEditor')
                    }
                  >
                    <img src={!this.state.hide ? iconHide : iconView} />
                    <p style={{ fontSize: '12px' }}>Visible</p>
                  </div>
                )}
                <div
                  id="DuplicateStepEditor"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    marginRight: '15px',
                    cursor: 'pointer'
                  }}
                  onClick={() => DispatchCustomEvent('DuplicateStepEditor')}
                >
                  <img src={iconCopy} />
                  <p style={{ fontSize: '12px' }}>Duplicate</p>
                </div>
                <div
                  id="DeleteStepEditor"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    cursor: 'pointer'
                  }}
                  onClick={() => DispatchCustomEvent('DeleteStepEditor')}
                >
                  <img src={iconDelete} />
                  <p style={{ fontSize: '12px' }}>Delete</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

class BodyStepsEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {},
      delete: {
        show: false,
        title: '',
        steps: 0,
        touchpoints: 0
      },
      steps: [],
      stages: [],
      current: {
        stage: null,
        step: null
      }
    };
  }

  componentDidMount() {
    let stages = [];
    const form = {};
    const current = {
      stage: null,
      step: null
    };
    let steps = [];
    if (this.props.stagesInterface) {
      stages = this.props.stagesInterface.map(item => {
        const steps = item.steps.map((step, i) => {
          const id = step.id ? step.id : shortid.generate();
          form[`step_${id}`] = {
            level: i + 1,
            index: step.index ? step.index : i + 1,
            substeps: ''
          };
          return {
            ...step,
            index: step.index,
            visible:
              step.visible !== null && step.visible !== undefined
                ? step.visible
                : true,
            id
          };
        });
        return {
          ...item,
          steps
        };
      });
      if (stages.length > 0) {
        stages = stages.sort((a, b) => a.index - b.index);
        current.stage = stages[0].id;
        if (stages[0].steps.length > 0) {
          current.step = stages[0].steps[0].id;
          const text = this.GetSubstepsText(stages[0].steps[0]);
          form[`step_${stages[0].steps[0].id}`].substeps = text;
          steps = stages[0].steps;
        }
      }
    }
    this.DispatchCustomEvent('DisplayIcon');
    if (steps.length > 0 && steps[0].visible) {
      this.DispatchCustomEvent('HideIcon');
    } else {
      this.DispatchCustomEvent('ShowIcon');
    }
    this.setState({
      stages,
      form,
      current,
      steps
    });
    document.addEventListener('DuplicateStepEditor', this.DuplicateStep);
    document.addEventListener('DeleteStepEditor', this.DeleteStep);
    document.addEventListener('ChangeVisibleStepEditor', this.ToggleVisible);
  }

  componentWillUnmount() {
    document.removeEventListener('DuplicateStepEditor', this.DuplicateStep);
    document.removeEventListener('DeleteStepEditor', this.DeleteStep);
    document.removeEventListener('ChangeVisibleStepEditor', this.ToggleVisible);
  }

  ToggleVisible = () => {
    if (this.state.current.step) {
      this.setState(state => {
        let steps = [...state.steps];
        steps = steps.map(item => {
          if (item.id === state.current.step) {
            item.visible = !item.visible;
          }
          return {
            ...item
          };
        });
        const current = { ...state.current };
        current.step = null;
        return {
          steps,
          current
        };
      });
      this.DispatchCustomEvent('NoDisplayIcon');
      const inputs = document.querySelectorAll('.select-row-radio');
      inputs.forEach(input => {
        input.checked = false;
      });
    }
  };

  DeleteStep = () => {
    if (this.state.current.step) {
      let title = '';
      this.state.steps.forEach((step, i) => {
        if (step.id === this.state.current.step) {
          title = `Stage at level ${i + 1}`;
        }
      });
      this.setState({
        delete: {
          show: true,
          title
        }
      });
    }
  };

  DuplicateStep = () => {
    if (this.state.current.stage && this.state.current.step) {
      this.setState(state => {
        const steps = [...state.steps];
        let step = null;
        steps.forEach(item => {
          if (item.id === state.current.step) {
            step = {
              ...item,
              index: steps.length + 1
            };
          }
        });
        const id = shortid.generate();
        const form = { ...state.form };
        form[`step_${id}`] = {
          ...form[`step_${step.id}`],
          level: steps.length + 1,
          index: steps.length + 1
        };
        const newStep = {
          ...step,
          id
        };
        steps.push({
          ...newStep
        });
        const current = { ...state.current };
        const stages = [...state.stages];
        stages.forEach(stage => {
          if (stage.id === current.stage) {
            stage.steps = [...steps];
          }
        });
        current.step = null;
        return {
          steps,
          form,
          current
        };
      });
      this.DispatchCustomEvent('NoDisplayIcon');
      const inputs = document.querySelectorAll('.select-row-radio');
      inputs.forEach(input => {
        input.checked = false;
      });
    }
  };

  HandleOnChange = (target, value, id) => {
    this.setState(
      state => {
        const form = { ...state.form };
        form[`step_${id}`][target] = value;
        const stages = this.UpdateSubSteps(value, id);
        return {
          form,
          stages
        };
      },
      () => {
        if (target === 'substeps') {
          this.ChangeSubsteps(id, value);
        }
      }
    );
    if (target === 'level') {
      this.ChangeOrder(id, value);
    }
  };

  UpdateSubSteps(value, id) {
    const current = { ...this.state.current };
    const stages = [...this.state.stages];
    const stage = stages.find(item => item.id === current.stage);
    const currentStep = stage.steps.find(item => item.id === id);
    const array = String(value).split(',');
    const sub_steps = [];
    array.forEach(item => {
      sub_steps.push({ value: item });
    });
    currentStep.sub_steps = [...sub_steps];
    return stages;
  }

  ChangeSubsteps = (id, value) => {
    this.setState(state => {
      const steps = [...state.steps];
      steps.forEach(step => {
        if (step.id === id) {
          const array = value.split(',');
          const sub_steps = [];
          array.forEach(item => {
            let temp = null;
            step.sub_steps.forEach(sub => {
              if (item.trim() === sub.value) {
                temp = {
                  ...sub
                };
              }
            });
            if (temp) {
              sub_steps.push({
                ...temp
              });
            } else {
              sub_steps.push({
                value: item
              });
            }
          });
          step.sub_steps = [...sub_steps];
        }
        return {
          steps
        };
      });
    });
  };

  SelectStage = stage => {
    this.setState({
      current: {
        stage: stage.id,
        step: null
      },
      steps: stage.steps
    });
    this.DispatchCustomEvent('NoDisplayIcon');
    const inputs = document.querySelectorAll('.select-row-radio');
    inputs.forEach(input => {
      input.checked = false;
    });
  };

  handleStepsEditorSubmit = e => {
    e.preventDefault();
    const stages = [...this.state.stages];
    stages.forEach(stage => {
      stage.steps.forEach(step => {
        this.state.steps.forEach(item => {
          if (step.id === item.id) {
            step.visible = item.visible;
            step.index = item.index;
            step.sub_steps = [...item.sub_steps];
          }
        });
      });
    });
    this.props.handleStagesEditorSubmit(stages);
    this.DispatchCustomEvent('NoDisplayIcon');
    const inputs = document.querySelectorAll('.select-row-radio');
    inputs.forEach(input => {
      input.checked = false;
    });
    this.setState(state => {
      const current = { ...state.current };
      current.step = null;
      return {
        current
      };
    });
  };

  CancelDelete = () => {
    this.setState({
      delete: {
        show: false,
        title: '',
        steps: 0,
        touchpoints: 0
      }
    });
  };

  DispatchCustomEvent = name => {
    const event = new Event(name, {});
    document.dispatchEvent(event);
  };

  SelectRow = id => {
    this.setState(state => {
      const current = { ...state.current };
      current.step = id;
      return {
        current
      };
    });
    let step = null;
    this.state.steps.forEach(item => {
      if (item.id === id) {
        step = {
          ...item
        };
      }
    });
    this.DispatchCustomEvent('DisplayIcon');
    if (step.visible) {
      this.DispatchCustomEvent('HideIcon');
    } else {
      this.DispatchCustomEvent('ShowIcon');
    }
    const text = this.GetSubstepsText(step);
    this.setState(state => {
      const form = { ...state.form };
      form[`step_${id}`].substeps = text;
      return {
        form
      };
    });
  };

  ChangeOrder = (id, value) => {
    this.setState(state => {
      let steps = [];
      const form = { ...state.form };
      let item = null;
      state.steps.forEach(step => {
        if (step.id !== id) {
          steps.push({
            ...step
          });
        } else {
          item = {
            ...step
          };
        }
      });
      steps.splice(value - 1, 0, {
        ...item
      });
      steps.forEach((step, i) => {
        form[`step_${step.id}`].level = i + 1;
        form[`step_${step.id}`].index = i + 1;
      });
      const current = { ...state.current };
      current.step = null;
      steps = steps.map((step, i) => {
        return {
          ...step,
          index: i + 1
        };
      });
      state.stages.some(stage => {
        let found = false;
        if (stage.id === current.stage) {
          found = true;
          stage.steps = steps;
        }
        return found;
      });
      return {
        steps: [...steps],
        form,
        current
      };
    });
    this.DispatchCustomEvent('NoDisplayIcon');
    const inputs = document.querySelectorAll('.select-row-radio');
    inputs.forEach(input => {
      input.checked = false;
    });
  };

  AddNewLevel = () => {
    if (this.state.current.stage) {
      this.setState(state => {
        const stages = [...state.stages];
        const steps = [...state.steps];
        const form = { ...state.form };
        const id = shortid.generate();
        stages.forEach(stage => {
          if (stage.id === state.current.stage) {
            stage.steps.push({
              id,
              index: steps.length + 1,
              sub_steps: [],
              visible: true
            });
          }
        });
        form[`step_${id}`] = {
          level: steps.length + 1,
          index: steps.length + 1,
          substeps: ''
        };
        steps.push({
          id,
          index: steps.length + 1,
          value: '',
          sub_steps: [],
          visible: true
        });
        return {
          steps,
          form,
          stages
        };
      });
    }
  };

  GetSubstepsText = step => {
    let text = ``;
    step.sub_steps.forEach(sub => {
      text = `${text}, ${sub.value}`;
    });
    text = text.trim();
    text = text.substring(1);
    return text;
  };

  DeleteConfirmation = () => {
    this.setState(state => {
      let steps = [];
      state.steps.forEach(step => {
        if (step.id !== state.current.step) {
          steps.push({
            ...step
          });
        }
      });
      const form = { ...state.form };
      steps = steps.map((step, i) => {
        form[`step_${step.id}`].level = i + 1;
        form[`step_${step.id}`].index = i + 1;
        return {
          ...step,
          index: i + 1
        };
      });
      const current = { ...state.current };
      const stages = [...state.stages];
      stages.forEach(stage => {
        if (stage.id === current.stage) {
          stage.steps = [...steps];
        }
      });
      current.step = null;
      return {
        steps,
        current,
        form
      };
    });
    this.DispatchCustomEvent('NoDisplayIcon');
    const inputs = document.querySelectorAll('.select-row-radio');
    inputs.forEach(input => {
      input.checked = false;
    });
    this.CancelDelete();
  };

  RemoveSubStep = (step, sub) => {
    this.setState(state => {
      const steps = [...state.steps];
      steps.forEach(item => {
        if (item.id === step) {
          const sub_steps = [];
          item.sub_steps.forEach(x => {
            if (x.value !== sub.trim()) {
              sub_steps.push(x);
            }
          });
          item.sub_steps = [...sub_steps];
        }
      });
      return {
        steps
      };
    });
  };

  HandleDropdownOpen() {
    const dialog = document.body.querySelector('div[role=dialog]');
    if (!dialog && !dialog.nextSibling) return false;
    dialog.nextSibling.style.minWidth = 'initial';
  }

  render() {
    return (
      <div style={{ width: '550px' }}>
        {this.state.delete.show && (
          <div>
            <div className="confirm_header" style={{ paddingBottom: '10px' }}>
              <div style={{ display: 'flex', width: '100%' }}>
                <div style={{ width: '50%', paddingTop: '10px' }}>
                  <p
                    style={{ margin: '0' }}
                  >{`You are about to delete: ${this.state.delete.title}`}</p>
                </div>
                <div
                  style={{
                    width: '50%',
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}
                >
                  <Button
                    variant="outline-primary"
                    color="primary"
                    className="btn_confirm"
                    onClick={this.DeleteConfirmation}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="outline-primary"
                    color="primary"
                    className="btn_cancel"
                    onClick={this.CancelDelete}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
            <div className="confirm_shadow" style={{ height: '450px' }} />
          </div>
        )}
        <div className="modal4content modal-scroll">
          <div
            style={{
              display: 'flex',
              maxWidth: '100%',
              overflowX: 'scroll',
              paddingBottom: '10px'
            }}
          >
            {this.state.stages.map((stage, i) => {
              return (
                <div
                  id="SelectStage"
                  style={{
                    padding: '5px 10px',
                    borderStyle: 'solid',
                    borderColor: '#424242',
                    borderWidth: '1px',
                    marginRight: '10px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontFamily: 'Open Sans',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    fontSize: '12px',
                    lineHeight: '14px',
                    textAlign: 'center',
                    color:
                      this.state.current.stage === stage.id
                        ? 'white'
                        : '#424242',
                    backgroundColor:
                      this.state.current.stage === stage.id
                        ? '#0078BF'
                        : 'white'
                  }}
                  key={i}
                  onClick={() => this.SelectStage(stage)}
                >
                  {stage.title}
                </div>
              );
            })}
          </div>
          <Form onSubmit={this.handleStepsEditorSubmit}>
            <div
              style={{
                height: '300px',
                overflowY: 'scroll',
                marginTop: '20px'
              }}
            >
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ width: '100px' }} className="headerTableTitle">
                      Level
                    </th>
                    <th className="headerTableTitle">Steps</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.steps.map((step, i) => {
                    return (
                      <tr key={i}>
                        <td
                          style={{
                            backgroundColor:
                              // eslint-disable-next-line no-nested-ternary
                              this.state.current.step === step.id
                                ? '#0078BF'
                                : step.visible
                                ? 'white'
                                : 'lightgrey',
                            width: '100px'
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <input
                              checked={this.state.current.step === step.id}
                              onChange={() => this.SelectRow(step.id)}
                              type="radio"
                              name="stage_editor"
                              className="select-row-radio"
                              style={{
                                marginRight: '15px',
                                transform: 'translateY(-2px)'
                              }}
                            />
                            <Dropdown
                              onOpen={this.HandleDropdownOpen}
                              title={this.state.form[`step_${step.id}`].index}
                              disabled={this.state.current.step !== step.id}
                            >
                              {this.state.steps.map((item, i) => {
                                return (
                                  <DropdownItem
                                    onClick={() =>
                                      this.HandleOnChange(
                                        'level',
                                        i + 1,
                                        step.id
                                      )
                                    }
                                    key={i}
                                  >
                                    {i + 1}
                                  </DropdownItem>
                                );
                              })}
                            </Dropdown>
                          </div>
                        </td>
                        <td
                          style={{
                            backgroundColor:
                              // eslint-disable-next-line no-nested-ternary
                              this.state.current.step === step.id
                                ? '#0078BF'
                                : step.visible
                                ? 'white'
                                : 'lightgrey'
                          }}
                        >
                          {this.state.current.step === step.id && (
                            <div>
                              <TextField
                                style={{ width: '100%' }}
                                onChange={e =>
                                  this.HandleOnChange(
                                    'substeps',
                                    e.target.value,
                                    step.id
                                  )
                                }
                                value={
                                  this.state.form[`step_${step.id}`].substeps
                                }
                              />
                            </div>
                          )}
                          {this.state.current.step !== step.id && (
                            <div style={{ display: 'flex' }}>
                              {this.GetSubstepsText(step)
                                .split(',')
                                .map(x => {
                                  if (x !== '') {
                                    return (
                                      <div
                                        id="RemoveStep"
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          background: '#F2F2F2',
                                          padding: '2px 7px',
                                          borderStyle: 'solid',
                                          borderWidth: '1px',
                                          borderColor: '#BDBDBD',
                                          borderRadius: '10px',
                                          marginRight: '5px',
                                          fontFamily: 'Open Sans',
                                          fontStyle: 'normal',
                                          fontWeight: '400',
                                          fontSize: '10px',
                                          lineHeight: '14px'
                                        }}
                                        key={`sub_${x}`}
                                      >
                                        <div style={{ marginBottom: '2px' }}>
                                          {x}
                                        </div>
                                        <div
                                          style={{
                                            marginLeft: '9px',
                                            marginBottom: '2px',
                                            cursor: 'pointer'
                                          }}
                                          onClick={() =>
                                            this.RemoveSubStep(step.id, x)
                                          }
                                        >
                                          <img src={closeIconStep} />
                                        </div>
                                      </div>
                                    );
                                  } else {
                                    return <div />;
                                  }
                                })}
                            </div>
                          )}
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
                  Save Update
                </Button>
              </div>
              <div
                style={{
                  width: '50%',
                  display: 'flex',
                  justifyContent: 'flex-end',
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
                  onClick={this.AddNewLevel}
                >
                  + Level
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

BodyStepsEditor.propTypes = {
  stagesInterface: PropTypes.array,
  handleStagesEditorSubmit: PropTypes.func
};

export { HeaderStepsEditor, BodyStepsEditor };
