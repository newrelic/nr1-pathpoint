import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownItem, TextField } from 'nr1';
import { Button, Form } from 'react-bootstrap';
import shortid from 'shortid';

import iconHide from '../../images/icon-hide.svg';
import iconView from '../../images/icon-view.svg';
import iconCopy from '../../images/icon-copy.svg';
import iconDelete from '../../images/icon-delete.svg';

class HeaderStagesEditor extends Component {
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
              <div
                style={{
                  width: '50%'
                }}
              >
                <div className="mainHeaderFirstTitle">Stages</div>
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
                    id="ChangeVisibleStageEditor"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'column',
                      marginRight: '15px',
                      cursor: 'pointer'
                    }}
                    onClick={() =>
                      this.DispatchCustomEvent('ChangeVisibleStageEditor')
                    }
                  >
                    <img src={!this.state.hide ? iconHide : iconView} />
                    <p style={{ fontSize: '12px' }}>Visible</p>
                  </div>
                )}
                <div
                  id="DuplicateStageEditor"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    marginRight: '15px',
                    cursor: 'pointer'
                  }}
                  onClick={() =>
                    this.DispatchCustomEvent('DuplicateStageEditor')
                  }
                >
                  <img src={iconCopy} />
                  <p style={{ fontSize: '12px' }}>Duplicate</p>
                </div>
                <div
                  id="DeleteStageGUIEditor"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    cursor: 'pointer'
                  }}
                  onClick={() =>
                    this.DispatchCustomEvent('DeleteStageGUIEditor')
                  }
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

class BodyStagesEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {},
      action: '',
      delete: {
        show: false,
        title: '',
        steps: 0,
        touchpoints: 0
      },
      stages: [],
      current: null
    };
  }

  componentDidMount() {
    let stages = [];
    if (this.props.stagesInterface) {
      stages = [...this.props.stagesInterface];
      stages = stages.sort((a, b) => a.index - b.index);
    }
    const form = {};
    stages.forEach((stage, i) => {
      form[`stage_${stage.id}`] = {
        title: stage.title,
        order: i + 1,
        type: stage.type,
        visible: stage.visible
      };
    });
    const current = stages[0].id;
    this.DispatchCustomEvent('DisplayIcon');
    if (stages[0].visible) {
      this.DispatchCustomEvent('HideIcon');
    } else {
      this.DispatchCustomEvent('ShowIcon');
    }
    this.setState({
      form,
      current,
      stages: [...stages]
    });
    document.addEventListener('DeleteStageGUIEditor', this.DeleteStage);
    document.addEventListener('DuplicateStageEditor', this.DuplicateStage);
    document.addEventListener('SetStagesInterfaceDone', this.SaveSuccess);
    document.addEventListener('ChangeVisibleStageEditor', this.ToggleHideStage);
  }

  componentWillUnmount() {
    document.removeEventListener('DeleteStageGUIEditor', this.DeleteStage);
    document.removeEventListener('DuplicateStageEditor', this.DuplicateStage);
    document.removeEventListener('SetStagesInterfaceDone', this.SaveSuccess);
    document.removeEventListener(
      'ChangeVisibleStageEditor',
      this.ChangeVisibleStageEditor
    );
  }

  DispatchCustomEvent = name => {
    const event = new Event(name, {});
    document.dispatchEvent(event);
  };

  ChangeVisibleStageEditor = () => {
    if (this.state.current !== null) {
      this.setState(state => {
        const stages = [...state.stages];
        stages.forEach(stage => {
          if (stage.id === state.current) {
            stage.visible = !stage.visible;
            if (!stage.visible) {
              this.DispatchCustomEvent('ShowIcon');
            }
          }
        });
        return {
          stages,
          current: null
        };
      });
      const inputs = document.querySelectorAll('.select-row-radio');
      this.DispatchCustomEvent('NoDisplayIcon');
      inputs.forEach(input => {
        input.checked = false;
      });
    }
  };

  SaveSuccess = () => {
    this.setState({
      current: null
    });
    const inputs = document.querySelectorAll('.select-row-radio');
    this.DispatchCustomEvent('NoDisplayIcon');
    inputs.forEach(input => {
      input.checked = false;
    });
  };

  DuplicateStage = () => {
    if (this.state.current !== null) {
      this.setState(state => {
        const stages = [...state.stages];
        let stage = null;
        stages.forEach(item => {
          if (item.id === state.current) {
            const id = shortid.generate();
            let title = state.form[`stage_${item.id}`].title;
            title = `${title} COPY`;
            const touchpoints = item.touchpoints.map(tp => {
              return {
                ...tp,
                id: shortid.generate()
              };
            });
            const steps = item.steps.map(step => {
              return {
                ...step,
                id: shortid.generate()
              };
            });
            stage = {
              ...item,
              touchpoints,
              steps,
              order: stages.length + 1,
              title,
              index: stages.length + 1,
              type: item.type,
              visible: true,
              id
            };
          }
        });
        stages.push({
          ...stage
        });
        const form = { ...state.form };
        form[`stage_${stage.id}`] = {
          order: stages.length,
          title: stage.title,
          type: stage.type
        };
        const inputs = document.querySelectorAll('.select-row-radio');
        this.DispatchCustomEvent('NoDisplayIcon');
        inputs.forEach(input => {
          input.checked = false;
        });
        return {
          stages,
          form,
          current: null
        };
      });
    }
  };

  DeleteStage = () => {
    if (this.state.current !== null) {
      let title = '';
      let steps = 0;
      let touchpoints = 0;
      this.state.stages.forEach(stage => {
        if (stage.id === this.state.current) {
          title = stage.title;
          steps = stage.steps ? stage.steps.length : 0;
          touchpoints = stage.touchpoints ? stage.touchpoints.length : 0;
        }
      });
      this.setState({
        action: 'delete',
        delete: {
          show: true,
          title,
          steps,
          touchpoints
        }
      });
    }
  };

  ToggleHideStage = () => {
    if (this.state.current !== null) {
      let title = '';
      let steps = 0;
      let touchpoints = 0;
      let hide = false;
      this.state.stages.forEach(stage => {
        if (stage.id === this.state.current) {
          if (stage.visible) {
            hide = true;
          }
          title = stage.title;
          steps = stage.steps ? stage.steps.length : 0;
          touchpoints = stage.touchpoints ? stage.touchpoints.length : 0;
        }
      });
      if (hide) {
        this.setState({
          action: 'hide',
          delete: {
            show: true,
            title,
            steps,
            touchpoints
          }
        });
      } else {
        this.ChangeVisibleStageEditor();
      }
    }
  };

  HandleOnChange = (target, value, id) => {
    this.setState(state => {
      const form = { ...state.form };
      form[`stage_${id}`][target] = value;
      return {
        form
      };
    });
    if (target === 'order') {
      this.ChangeOrder(id, value);
    }
  };

  ChangeOrder = (id, value) => {
    this.setState(state => {
      let stages = [];
      const form = { ...state.form };
      let item = null;
      state.stages.forEach(stage => {
        if (stage.id !== id) {
          stages.push({
            ...stage,
            oldIndex: stage.index
          });
        } else {
          item = {
            ...stage,
            oldIndex: stage.index
          };
        }
      });
      stages.splice(value - 1, 0, {
        ...item
      });
      stages.forEach((stage, i) => {
        form[`stage_${stage.id}`].order = i + 1;
      });
      stages = stages.map((item, i) => {
        return {
          ...item,
          index: i + 1
        };
      });
      return {
        stages: [...stages],
        form,
        current: null
      };
    });
    const inputs = document.querySelectorAll('.select-row-radio');
    this.DispatchCustomEvent('NoDisplayIcon');
    inputs.forEach(input => {
      input.checked = false;
    });
  };

  SelectRow = id => {
    this.state.stages.forEach(item => {
      if (item.id === id) {
        this.DispatchCustomEvent('DisplayIcon');
        if (item.visible) {
          this.DispatchCustomEvent('HideIcon');
        } else {
          this.DispatchCustomEvent('ShowIcon');
        }
      }
    });
    this.setState({
      current: id
    });
  };

  AddNewStage = () => {
    this.setState(state => {
      const stages = [...state.stages];
      const form = { ...state.form };
      const id = shortid.generate();
      form[`stage_${id}`] = {
        order: stages.length + 1,
        title: 'New Stage',
        type: 'People',
        visible: true
      };
      stages.push({
        id,
        index: stages.length + 1,
        oldIndex: stages.length + 1,
        order: stages.length + 1,
        steps: [
          {
            id: shortid.generate(),
            index: 1,
            sub_steps: [
              {
                value: 'STEP1'
              }
            ],
            visible: true
          }
        ],
        title: 'New Stage',
        touchpoints: [
          {
            dashboard_url: '',
            id: shortid.generate(),
            queryData: {
              accountID: 1,
              max_count: 100,
              min_count: 10,
              measure_time: '5 MINUTES AGO',
              query: 'SELECT count(*) FROM Public_APICall',
              query_timeout: 10,
              type: 'Process-Count'
            },
            status_on_off: false,
            subs: [],
            title: 'Sample Touchpoint (PCC)',
            value: 'Sample Touchpoint (PCC)'
          }
        ],
        type: 'People',
        visible: true
      });
      return {
        form,
        stages
      };
    });
  };

  handleStagesEditorSubmit = e => {
    e.preventDefault();
    let stages = this.state.stages;
    stages = stages.sort((a, b) => a.index - b.index);
    this.props.handleStagesEditorSubmit(stages);
  };

  CancelDelete = () => {
    this.setState({
      action: '',
      delete: {
        show: false,
        title: '',
        steps: 0,
        touchpoints: 0
      }
    });
  };

  DeleteConfirmation = () => {
    if (this.state.action === 'delete') {
      if (this.state.current !== null) {
        this.setState(state => {
          let stages = [];
          state.stages.forEach(stage => {
            if (stage.id !== state.current) {
              stages.push({
                ...stage
              });
            }
          });
          const form = { ...state.form };
          stages = stages.map((stage, i) => {
            form[`stage_${stage.id}`].order = i + 1;
            return {
              ...stage,
              index: i + 1
            };
          });
          return {
            stages,
            form,
            current: null
          };
        });
        const inputs = document.querySelectorAll('.select-row-radio');
        this.DispatchCustomEvent('NoDisplayIcon');
        inputs.forEach(input => {
          input.checked = false;
        });
      }
    } else {
      this.ChangeVisibleStageEditor();
    }
    this.CancelDelete();
  };

  render() {
    const { stages } = this.state;
    return (
      <div style={{ width: '550px' }}>
        {this.state.delete.show && (
          <div>
            <div className="confirm_header">
              <div style={{ display: 'flex', width: '100%' }}>
                <div style={{ width: '50%', paddingTop: '10px' }}>
                  <p style={{ margin: '0', color: '#F44336' }}>
                    {`You are about to ${this.state.action}:`}{' '}
                    <span style={{ color: 'black' }}>
                      {this.state.delete.title}
                    </span>
                  </p>
                  <p>
                    {`Which includes: ${this.state.delete.steps} steps and ${this.state.delete.touchpoints} touchpoints`}
                  </p>
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
            <div className="confirm_shadow" style={{ height: '400px' }} />
          </div>
        )}
        <div className="modal4content">
          {Object.keys(this.state.form).length > 0 && (
            <Form onSubmit={this.handleStagesEditorSubmit}>
              <div style={{ height: '300px', overflowY: 'scroll' }}>
                <table style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th className="headerTableTitle">Order</th>
                      <th className="headerTableTitle">Stage Name</th>
                      <th className="headerTableTitle">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stages.map((stage, i) => {
                      return (
                        <tr key={`stage_${i}`}>
                          <td
                            style={{
                              backgroundColor:
                                // eslint-disable-next-line no-nested-ternary
                                this.state.current === stage.id
                                  ? '#0078BF'
                                  : stage.visible
                                  ? 'white'
                                  : 'lightgrey'
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <input
                                onChange={() => this.SelectRow(stage.id)}
                                type="radio"
                                name="stage_editor"
                                className="select-row-radio"
                                checked={this.state.current === stage.id}
                                style={{
                                  marginRight: '15px',
                                  transform: 'translateY(-2px)'
                                }}
                              />
                              <Dropdown
                                title={
                                  this.state.form[`stage_${stage.id}`].order
                                }
                                disabled={this.state.current !== stage.id}
                              >
                                {this.state.stages.map((item, i) => {
                                  return (
                                    <DropdownItem
                                      onClick={() =>
                                        this.HandleOnChange(
                                          'order',
                                          i + 1,
                                          stage.id
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
                                this.state.current === stage.id
                                  ? '#0078BF'
                                  : stage.visible
                                  ? 'white'
                                  : 'lightgrey'
                            }}
                          >
                            <TextField
                              style={{
                                width: '100%'
                              }}
                              className="textFieldBody"
                              onChange={e =>
                                this.HandleOnChange(
                                  'title',
                                  e.target.value,
                                  stage.id
                                )
                              }
                              disabled={this.state.current !== stage.id}
                              value={this.state.form[`stage_${stage.id}`].title}
                            />
                          </td>
                          <td
                            style={{
                              backgroundColor:
                                // eslint-disable-next-line no-nested-ternary
                                this.state.current === stage.id
                                  ? '#0078BF'
                                  : stage.visible
                                  ? 'white'
                                  : 'lightgrey'
                            }}
                          >
                            <Dropdown
                              style={{ width: '100%' }}
                              title={this.state.form[`stage_${stage.id}`].type}
                              disabled={this.state.current !== stage.id}
                            >
                              <DropdownItem
                                onClick={() =>
                                  this.HandleOnChange(
                                    'type',
                                    'People',
                                    stage.id
                                  )
                                }
                              >
                                People
                              </DropdownItem>
                              <DropdownItem
                                onClick={() =>
                                  this.HandleOnChange(
                                    'type',
                                    'Process',
                                    stage.id
                                  )
                                }
                              >
                                Process
                              </DropdownItem>
                            </Dropdown>
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
                    onClick={this.AddNewStage}
                  >
                    + Stages
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </div>
      </div>
    );
  }
}

BodyStagesEditor.propTypes = {
  handleStagesEditorSubmit: PropTypes.func.isRequired,
  stagesInterface: PropTypes.array
};

export { HeaderStagesEditor, BodyStagesEditor };
