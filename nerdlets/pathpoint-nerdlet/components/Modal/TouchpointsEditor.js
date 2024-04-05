/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownItem, TextField } from 'nr1';
import { Button, Form } from 'react-bootstrap';
import shortid from 'shortid';
import touchpointTypes from '../../config/touchpointTypes.json';
import onIcon from '../../images/icon-on.svg';
import offIcon from '../../images/icon-off.svg';
import SelectIDs from '../SelectIDs/SelectIDs';
import Editor from '../Editor/Editor';
import iconHide from '../../images/icon-hide.svg';
import iconView from '../../images/icon-view.svg';
import iconCopy from '../../images/icon-copy.svg';
import iconDelete from '../../images/icon-delete.svg';
import messages from '../../config/messages.json';
import Toast from '../Toast/Toast';
import warningIcon from '../../images/warning.svg';
import addIcon from '../../images/addGreyIcon.svg';
import removeIcon from '../../images/removeGreyIcon.svg';
import AlertSelector from '../AlertSelector';
import {
  TimeRangeTransform,
  regex_measure_time
} from '../../services/DataManager';

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

class HeaderTouchpointsEditor extends Component {
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
            <div style={{ display: 'flex', width: '975px' }}>
              <div style={{ width: '50%' }}>
                <div className="mainHeaderFirstTitle">Touchpoints</div>
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
                    id="ChangeVisibleTouchpointEditor"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'column',
                      marginRight: '15px',
                      cursor: 'pointer'
                    }}
                    onClick={() =>
                      this.DispatchCustomEvent('ChangeVisibleTouchpointEditor')
                    }
                  >
                    <img src={!this.state.hide ? iconHide : iconView} />
                    <p style={{ fontSize: '12px' }}>Visible</p>
                  </div>
                )}
                <div
                  id="DuplicateTouchpointEditor"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    marginRight: '15px',
                    cursor: 'pointer'
                  }}
                  onClick={() =>
                    this.DispatchCustomEvent('DuplicateTouchpointEditor')
                  }
                >
                  <img src={iconCopy} />
                  <p style={{ fontSize: '12px' }}>Duplicate</p>
                </div>
                <div
                  id="DeleteTouchpointEditor"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    cursor: 'pointer'
                  }}
                  onClick={() =>
                    this.DispatchCustomEvent('DeleteTouchpointEditor')
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

class BodyTouchpointsEditor extends Component {
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
      tab: '',
      touchpointTypes,
      steps: [],
      touchpoints: [],
      stages: [],
      current: {
        stage: null,
        step: null,
        touchpoint: null,
        subs: []
      },
      testQueryResult: '',
      goodQuery: true,
      testQueryValue: '',
      testingNow: false,
      listTpErrorMeasureField: [],
      list: [],
      viewGlobalParameters: false
    };
  }

  componentDidMount() {
    let stages = [];
    let touchpoints = [];
    const form = {};
    const subs = {};
    let steps = null;
    if (this.props.stagesInterface) {
      stages = this.props.stagesInterface.map(item => {
        touchpoints = item.touchpoints.map(tp => {
          tp = {
            ...tp,
            stageId: item.id
          };
          const id = Reflect.has(tp, 'id') ? tp.id : shortid.generate();
          subs[id] = Reflect.has(tp, 'subs') ? tp.subs : [];
          form[`tp_${id}`] = {
            title: tp.title,
            type: this.GetShortTouchpointTypeName(tp.queryData.type),
            status: tp.status_on_off,
            query: tp.queryData.query,
            queryAccount: tp.queryData.accountID,
            queryMeasure: tp.queryData.measure_time,
            dashboardLink: tp.dashboard_url,
            timeout: tp.queryData.query_timeout
          };
          return {
            ...tp,
            visible: Reflect.has(tp, 'visible') ? tp.visible : true,
            id
          };
        });
        const steps = item.steps.map(step => {
          const id = Reflect.has(step, 'id') ? step.id : shortid.generate();
          return {
            ...step,
            visible: step.visible ? step.visible : true,
            id
          };
        });
        return {
          ...item,
          touchpoints,
          steps
        };
      });
    }
    stages = stages.sort((a, b) => a.index - b.index);
    const { current } = this.state;
    current.subs = subs;
    if (stages.length > 0) {
      current.stage = stages[0].id;
      steps = stages[0].steps;
      if (stages[0].touchpoints.length > 0) {
        current.touchpoint = stages[0].touchpoints[0].id;
        touchpoints = stages[0].touchpoints;
      } else {
        touchpoints = [];
      }
    }
    this.DispatchCustomEvent('DisplayIcon');
    if (
      stages.length > 0 &&
      stages[0].touchpoints.length > 0 &&
      stages[0].touchpoints[0].visible
    ) {
      this.DispatchCustomEvent('HideIcon');
    } else {
      this.DispatchCustomEvent('ShowIcon');
    }
    this.setState({
      stages,
      form,
      current,
      touchpoints,
      steps,
      tab: 'mapping'
    });
    document.addEventListener(
      'DuplicateTouchpointEditor',
      this.DuplicateTouchpoint
    );
    document.addEventListener('DeleteTouchpointEditor', this.DeleteTouchpoint);
    document.addEventListener(
      'ChangeVisibleTouchpointEditor',
      this.ToggleVisible
    );
  }

  componentWillUnmount() {
    document.removeEventListener(
      'DuplicateTouchpointEditor',
      this.DuplicateTouchpoint
    );
    document.removeEventListener(
      'DeleteTouchpointEditor',
      this.DeleteTouchpoint
    );
    document.removeEventListener(
      'ChangeVisibleTouchpointEditor',
      this.ToggleVisible
    );
  }

  GetShortTouchpointTypeName(longName) {
    const { touchpointTypes } = this.state;
    let shortName = 'Unknown';
    touchpointTypes.some(tp => {
      let found = false;
      if (tp.longName === longName) {
        found = true;
        shortName = tp.shortName;
      }
      return found;
    });
    return shortName;
  }

  GetLongTouchpointTypeName(shortName) {
    const { touchpointTypes } = this.state;
    let longName = 'Unknown';
    touchpointTypes.some(tp => {
      let found = false;
      if (tp.shortName === shortName) {
        found = true;
        longName = tp.longName;
      }
      return found;
    });
    return longName;
  }

  DispatchCustomEvent = name => {
    const event = new Event(name, {});
    document.dispatchEvent(event);
  };

  ToggleVisible = () => {
    if (this.state.current.touchpoint) {
      this.setState(state => {
        let touchpoints = [...state.touchpoints];
        touchpoints = touchpoints.map(item => {
          if (item.id === state.current.touchpoint) {
            item.visible = !item.visible;
            if (!item.visible) {
              this.DispatchCustomEvent('ShowIcon');
            }
          }
          return {
            ...item
          };
        });
        const current = { ...state.current };
        current.touchpoint = null;
        return {
          touchpoints,
          current
        };
      });
      this.state.stages.some(stage => {
        let found = false;
        if (stage.id === this.state.current.stage) {
          found = true;
          stage.touchpoints = [...this.state.touchpoints];
        }
        return found;
      });
      const inputs = document.querySelectorAll('.select-row-radio');
      this.DispatchCustomEvent('NoDisplayIcon');
      inputs.forEach(input => {
        input.checked = false;
      });
    }
  };

  AddSecondaryLinks = () => {
    const { touchpoints } = this.state;
    this.setState(state => {
      const form = { ...state.form };
      form[`tp_${state.current.touchpoint}`].dashboardLink.push({
        nickName: '',
        url: ''
      });
      form[`tp_${state.current.touchpoint}`].dashboardLink.push({
        nickName: '',
        url: ''
      });
      form[`tp_${state.current.touchpoint}`].dashboardLink.push({
        nickName: '',
        url: ''
      });
      return {
        form,
        touchpoints,
        testQueryResult: '',
        testQueryValue: ''
      };
    });
  };

  RemoveSecondaryLinks = () => {
    const { touchpoints } = this.state;
    this.setState(state => {
      const form = { ...state.form };
      form[`tp_${state.current.touchpoint}`].dashboardLink.pop();
      return {
        form,
        touchpoints,
        testQueryResult: '',
        testQueryValue: ''
      };
    });
  };

  DeleteTouchpoint = () => {
    if (this.state.current.touchpoint) {
      let title = '';
      this.state.touchpoints.forEach(tp => {
        if (tp.id === this.state.current.touchpoint) {
          title = `${tp.title}`;
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

  DuplicateTouchpoint = () => {
    if (this.state.current.touchpoint) {
      this.setState(state => {
        const touchpoints = [...state.touchpoints];
        const form = { ...state.form };
        const id = shortid.generate();
        const current = { ...state.current };
        let touchpoint = null;
        state.touchpoints.forEach(item => {
          if (item.id === current.touchpoint) {
            touchpoint = JSON.parse(JSON.stringify(item));
          }
        });
        if (current.subs[touchpoint.id]) {
          current.subs[id] = [...current.subs[touchpoint.id]];
        }
        touchpoint.title = `${form[`tp_${touchpoint.id}`].title} copy`;
        touchpoint.queryData.type = this.GetLongTouchpointTypeName(
          form[`tp_${touchpoint.id}`].type
        );
        touchpoint.id = id;
        form[`tp_${id}`] = {
          title: touchpoint.title,
          type: this.GetShortTouchpointTypeName(touchpoint.queryData.type),
          status: touchpoint.status_on_off,
          query: touchpoint.queryData.query,
          queryAccount: touchpoint.queryData.accountID,
          queryMeasure: touchpoint.queryData.measure_time,
          dashboardLink: touchpoint.dashboard_url,
          timeout: touchpoint.queryData.query_timeout
        };
        current.touchpoint = null;
        touchpoints.push({
          ...touchpoint
        });
        state.stages.some(stage => {
          let found = false;
          if (stage.id === current.stage) {
            found = true;
            stage.touchpoints.push({
              ...touchpoint
            });
          }
          return found;
        });
        return {
          touchpoints,
          current,
          form
        };
      });
      const inputs = document.querySelectorAll('.select-row-radio');
      inputs.forEach(input => {
        input.checked = false;
      });
    }
  };

  HandleOnSampleQuery = id => {
    const { touchpoints, current } = this.state;
    this.setState(state => {
      const form = { ...state.form };
      form[`tp_${id}`].query = this.SetSampleQuery(
        this.GetLongTouchpointTypeName(form[`tp_${id}`].type)
      );
      touchpoints.some(item => {
        let found = false;
        if (item.id === id) {
          found = true;
          item.queryData.query = this.SetSampleQuery(
            this.GetLongTouchpointTypeName(form[`tp_${id}`].type)
          );
        }
        return found;
      });
      state.stages.some(stage => {
        let found = false;
        if (stage.id === current.stage) {
          found = true;
          stage.touchpoints = touchpoints;
        }
        return found;
      });
      return {
        form,
        testQueryResult: '',
        testQueryValue: ''
      };
    });
  };

  TestQuery = async (query, accountID, type) => {
    this.setState({ testingNow: true });
    const {
      testText,
      goodQuery,
      testQueryValue
    } = await this.props.EditorValidateQuery(
      this.GetLongTouchpointTypeName(type),
      query,
      accountID
    );
    this.setState(() => {
      return {
        testQueryResult: testText,
        goodQuery: goodQuery,
        testQueryValue: testQueryValue,
        testingNow: false
      };
    });
  };

  TestMeasureTime = (touchpoint, value) => {
    const { listTpErrorMeasureField, list } = this.state;
    if (regex_measure_time.test(value)) {
      if (listTpErrorMeasureField.includes(touchpoint)) {
        const listErrorMeasure = listTpErrorMeasureField.filter(
          e => e !== touchpoint
        );
        const listToast = list.filter(e => e.id !== touchpoint);
        this.setState({
          listTpErrorMeasureField: listErrorMeasure,
          list: listToast
        });
      }
    } else if (value && !listTpErrorMeasureField.includes(touchpoint)) {
      listTpErrorMeasureField.push(touchpoint);
      this.setState({
        listTpErrorMeasureField: listTpErrorMeasureField
      });
    }
  };

  HandleOnChange = (target, value, id) => {
    const { touchpoints, current } = this.state;
    if (target === 'queryMeasure') {
      this.TestMeasureTime(current.touchpoint, value);
    }
    this.setState(state => {
      const form = { ...state.form };
      form[`tp_${id}`][target] = value;
      touchpoints.some(item => {
        let found = false;
        if (item.id === id) {
          found = true;
          switch (target) {
            case 'title':
              item.title = value;
              break;
            case 'query':
              item.queryData.query = value;
              break;
            case 'queryAccount':
              item.queryData.accountID = value;
              break;
            case 'timeout':
              item.queryData.query_timeout = value;
              break;
            case 'queryMeasure':
              item.queryData.measure_time = value;
              break;
            case 'dashboardLink0':
              if (item.dashboard_url.length === 0) {
                item.dashboard_url.push({
                  nickName: '',
                  url: ''
                });
              }
              item.dashboard_url[0].url = value;
              break;
            case 'dashboardLink1':
              item.dashboard_url[1].url = value;
              break;
            case 'dashboardLink2':
              item.dashboard_url[2].url = value;
              break;
            case 'dashboardLink3':
              item.dashboard_url[3].url = value;
              break;
            case 'nickName1':
              item.dashboard_url[1].nickName = value;
              break;
            case 'nickName2':
              item.dashboard_url[2].nickName = value;
              break;
            case 'nickName3':
              item.dashboard_url[3].nickName = value;
              break;
          }
        }
        return found;
      });
      state.stages.some(stage => {
        let found = false;
        if (stage.id === current.stage) {
          found = true;
          stage.touchpoints = touchpoints;
        }
        return found;
      });
      return {
        form,
        touchpoints,
        testQueryResult: '',
        testQueryValue: ''
      };
    });
    if (target === 'type') {
      this.ChangeTouchpointType(id, value);
    }
  };

  ChangeTouchpointType(id, value) {
    const { touchpoints, form } = this.state;
    this.setState(() => {
      touchpoints.some(item => {
        let found = false;
        if (item.id === id) {
          found = true;
          item.queryData.type = this.GetLongTouchpointTypeName(value);
          item.queryData.query = this.SetSampleQuery(item.queryData.type);
          form[`tp_${id}`].query = this.SetSampleQuery(item.queryData.type);
        }
        return found;
      });
      return {
        tab: 'mapping',
        touchpoints,
        testQueryResult: '',
        testQueryValue: ''
      };
    });
  }

  SetSampleQuery(touchpointType) {
    return messages.sample_querys[
      this.GetShortTouchpointTypeName(touchpointType).toLowerCase()
    ];
  }

  AddTouchpoint = () => {
    if (this.state.current.stage) {
      this.setState(state => {
        const current = { ...state.current };
        const touchpoints = [...state.touchpoints];
        const form = { ...state.form };
        const id = shortid.generate();
        form[`tp_${id}`] = {
          title: 'New Touchpoint',
          type: 'PCC',
          status: true,
          query: this.SetSampleQuery(this.GetLongTouchpointTypeName('PCC')),
          queryAccount:
            this.props.accountIDs.length > 0 ? this.props.accountIDs[0].id : 1,
          queryMeasure: '5 MINUTES AGO',
          dashboardLink: [
            { nickname: '', url: 'https://onenr.io/01qwL8KPxw5' }
          ],
          timeout: 10
        };
        let touchpoint = {
          id,
          stageId: current.stage,
          title: 'New Touchpoint',
          status_on_off: true,
          visible: true,
          dashboard_url: [
            { nickname: '', url: 'https://onenr.io/01qwL8KPxw5' }
          ],
          subs: [],
          queryData: {
            accountID:
              this.props.accountIDs.length > 0
                ? this.props.accountIDs[0].id
                : 1,
            max_avg_response_time: 0,
            max_count: 0,
            max_value: 0,
            value: 0,
            max_error_percentage: 0,
            max_response_time: 0,
            max_total_check_time: 0,
            min_apdex: 0,
            min_count: 0,
            min_success_percentage: 0,
            session_count: 0,
            transaction_count: 0,
            apdex_value: 0,
            response_value: 0,
            error_percentage: 0,
            max_request_time: 0,
            max_duration: 0,
            success_percentage: 0,
            api_count: 0,
            measure_time: '5 MINUTES AGO',
            alertConditionId: [],
            priority: ['CRITICAL'],
            state: ['ACTIVATED'],
            query: this.SetSampleQuery(this.GetLongTouchpointTypeName('PCC')),
            query_timeout: 10,
            type: this.GetLongTouchpointTypeName('PCC')
          }
        };
        touchpoint = JSON.parse(JSON.stringify(touchpoint));
        touchpoints.push({
          ...touchpoint
        });
        state.stages.some(stage => {
          let found = false;
          if (stage.id === current.stage) {
            found = true;
            stage.touchpoints.push({
              ...touchpoint
            });
          }
          return found;
        });
        current.subs[id] = [];
        current.touchpoint = null;
        return {
          touchpoints,
          form,
          current
        };
      });
      const inputs = document.querySelectorAll('.select-row-radio');
      inputs.forEach(input => {
        input.checked = false;
      });
    }
  };

  SelectStage = stage => {
    this.setState(state => {
      const current = { ...state.current };
      current.stage = stage.id;
      current.touchpoint = null;
      return {
        current,
        touchpoints: stage.touchpoints,
        steps: stage.steps,
        testQueryResult: '',
        testQueryValue: ''
      };
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
    this.props.handleStagesEditorSubmit(stages);
    const inputs = document.querySelectorAll('.select-row-radio');
    inputs.forEach(input => {
      input.checked = false;
    });
    this.setState(state => {
      const current = { ...state.current };
      current.touchpoint = null;
      return {
        current
      };
    });
  };

  SelectRow = id => {
    this.setState(state => {
      const touchpoints = [...state.touchpoints];
      touchpoints.forEach(item => {
        if (item.id === id) {
          this.DispatchCustomEvent('DisplayIcon');
          if (item.visible) {
            this.DispatchCustomEvent('HideIcon');
          } else {
            this.DispatchCustomEvent('ShowIcon');
          }
        }
      });
      const current = { ...state.current };
      current.touchpoint = id;
      if (!current.subs[id]) {
        current.subs[id] = [];
      }
      return {
        tab: 'mapping',
        current,
        testQueryResult: '',
        testQueryValue: ''
      };
    });
  };

  ToggleSelectMapping = value => {
    if (this.state.current.touchpoint) {
      const { touchpoints } = this.state;
      this.setState(state => {
        const current = { ...state.current };
        let finded = false;
        Object.keys(current.subs).forEach(key => {
          if (key === current.touchpoint) {
            current.subs[key].forEach(item => {
              if (item === value) {
                finded = true;
              }
            });
          }
        });
        if (finded) {
          const subs = [];
          Object.keys(current.subs).forEach(key => {
            if (key === current.touchpoint) {
              current.subs[key].forEach(item => {
                if (item !== value) {
                  subs.push(item);
                }
              });
              current.subs[key] = subs;
            }
          });
        } else {
          current.subs[current.touchpoint].push(value);
        }
        touchpoints.some(item => {
          let found = false;
          if (item.id === current.touchpoint) {
            found = true;
            item.subs = current.subs[current.touchpoint];
          }
          return found;
        });
        state.stages.some(stage => {
          let found = false;
          if (stage.id === current.stage) {
            found = true;
            stage.touchpoints = touchpoints;
          }
          return found;
        });
        return {
          current,
          touchpoints,
          testQueryResult: '',
          testQueryValue: ''
        };
      });
    }
  };

  SelectTab = tab => {
    this.setState({
      tab,
      testQueryResult: '',
      testQueryValue: ''
    });
  };

  DeleteConfirmation = () => {
    this.setState(state => {
      const touchpoints = [];
      const current = { ...state.current };
      state.touchpoints.forEach(tp => {
        if (tp.id !== state.current.touchpoint) {
          delete current.subs[tp.id];
          touchpoints.push({
            ...tp
          });
        }
      });
      state.stages.some(stage => {
        let found = false;
        if (stage.id === current.stage) {
          found = true;
          stage.touchpoints = touchpoints;
        }
        return found;
      });
      current.touchpoint = null;
      return {
        touchpoints,
        current
      };
    });
    const inputs = document.querySelectorAll('.select-row-radio');
    inputs.forEach(input => {
      input.checked = false;
    });
    this.CancelDelete();
  };

  ToggleOnOff = () => {
    if (this.state.current.touchpoint) {
      this.setState(state => {
        const form = { ...state.form };
        const touchpoints = state.touchpoints.map(item => {
          const payload = { ...item };
          if (item.id === state.current.touchpoint) {
            payload.status_on_off = !payload.status_on_off;
          }
          return payload;
        });
        form[`tp_${state.current.touchpoint}`].status = !form[
          `tp_${state.current.touchpoint}`
        ].status;
        state.stages.some(stage => {
          let found = false;
          if (stage.id === state.current.stage) {
            found = true;
            stage.touchpoints = touchpoints;
          }
          return found;
        });
        return {
          form,
          touchpoints
        };
      });
    }
  };

  CancelDelete = () => {
    this.setState({
      delete: {
        show: false,
        title: ''
      }
    });
  };

  HandleOnChangePriority = priorities => {
    this.setState(state => {
      state.touchpoints.some(item => {
        let found = false;
        if (item.id === state.current.touchpoint) {
          found = true;
          item.queryData.priority = priorities;
        }
        return found;
      });
      return {
        touchpoints: state.touchpoints
      };
    });
  };

  HandleOnChangeState = states => {
    this.setState(state => {
      state.touchpoints.some(item => {
        let found = false;
        if (item.id === state.current.touchpoint) {
          found = true;
          item.queryData.state = states;
        }
        return found;
      });
      return {
        touchpoints: state.touchpoints
      };
    });
  };

  HandleOnChangeTune = value => {
    if (
      value.target.name === 'alertsRefreshDelay' ||
      value.target.name === 'alertsTimeWindow'
    ) {
      this.props.handleAlertParameterUpdate({
        name: value.target.name,
        value: value.target.value
      });
    } else {
      this.state.touchpoints.some(item => {
        let found = false;
        if (item.id === this.state.current.touchpoint) {
          found = true;
          item.queryData[value.target.name] = value.target.value;
        }
        return found;
      });
    }
  };

  RunTest = () => {
    const { form, current } = this.state; // Get state
    const touchpoint = `tp_${current.touchpoint}`; // Define a string with the touchpoint value
    const isQueryAvailable = form[touchpoint].query !== ''; // Verify if query is not empty
    if (!isQueryAvailable) return false; // Query is empty, stop function
    const touchpointType = form[touchpoint].type; // Get touchpoint type
    const queryAccount = form[touchpoint].queryAccount; // Get touchpoint query account
    // Function to read the time on Time Picker and set measure_time with this
    const transform_measure_time = TimeRangeTransform(
      this.props.timeRangeBodyTouchpointsEditor,
      form[touchpoint].queryMeasure
    );
    const queryMeasure = `${form[touchpoint].query} SINCE ${transform_measure_time}`;
    this.TestQuery(queryMeasure, queryAccount, touchpointType); // Test current query in field
  };

  RenderTuneField = ({
    name,
    label,
    defaultValue,
    id,
    onChange,
    key,
    compare
  }) => {
    return (
      <>
        <label
          className="bodySubTitle"
          style={{
            fontSize: '14px',
            fontFamily: 'Open Sans',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '19px',
            textAlign: 'right',
            width: '45%'
          }}
        >
          {label}
        </label>
        <input
          id={id}
          name={name}
          type="text"
          defaultValue={defaultValue}
          onChange={/* istanbul ignore next */ e => onChange(e)}
          className="inputText"
          style={{
            width: '60px',
            background: '#FFFFFF',
            boxSizing: 'border-box',
            border: '1px solid #BDBDBD',
            marginLeft: '40px',
            padding: '5px'
          }}
        />
        {key === 'Min' ? (
          compare < defaultValue ? (
            <label
              className="textLast5MinTune"
              style={{
                marginLeft: '15px',
                fontSize: '14px',
                width: '16%',
                color: '#FF4C4C'
              }}
            >
              {Math.round(compare * 100) / 100}
            </label>
          ) : (
            <label
              className="textLast5MinTune"
              style={{
                marginLeft: '15px',
                fontSize: '14px',
                width: '16%',
                color: '#0aaf77'
              }}
            >
              {Math.round(compare * 100) / 100}
            </label>
          )
        ) : compare <= defaultValue ? (
          <label
            className="textLast5MinTune"
            style={{
              marginLeft: '15px',
              fontSize: '14px',
              width: '16%',
              color: '#0aaf77'
            }}
          >
            {Math.round(compare * 100) / 100}
          </label>
        ) : (
          <label
            className="textLast5MinTune"
            style={{
              marginLeft: '15px',
              fontSize: '14px',
              width: '16%',
              color: '#FF4C4C'
            }}
          >
            {Math.round(compare * 100) / 100}
          </label>
        )}
      </>
    );
  };

  RenderAlertField = ({ name, label, defaultValue, id, onChange, key }) => {
    return (
      <>
        <label
          className="bodySubTitle"
          style={{
            fontSize: key === 'GLOBAL' ? '12px' : '14px',
            fontFamily: 'Open Sans',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '19px',
            textAlign: 'right',
            width: '40%'
          }}
        >
          {label}
        </label>
        <input
          id={id}
          name={name}
          type="text"
          defaultValue={defaultValue}
          onChange={/* istanbul ignore next */ e => onChange(e)}
          className="inputText"
          style={{
            width: key === 'GLOBAL' ? '50px' : '200px',
            background: '#FFFFFF',
            boxSizing: 'border-box',
            border: '1px solid #BDBDBD',
            marginLeft: '20px',
            padding: '5px'
          }}
        />
      </>
    );
  };

  RenderAlertFieldType2 = ({ label, defaultValue, onChange, key }) => {
    const data = defaultValue;
    return (
      <>
        <label
          className="bodySubTitle"
          style={{
            fontSize: key === 'GLOBAL' ? '12px' : '14px',
            fontFamily: 'Open Sans',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '19px',
            textAlign: 'right',
            width: '40%',
            verticalAlign: 'top',
            height: '15px'
          }}
        >
          {label}
        </label>
        <AlertSelector dataValues={data} updateDataChecked={onChange} />
      </>
    );
  };

  CheckStatus(dataValues, value) {
    const found = dataValues.find(item => item === value);
    if (found) {
      return true;
    }
    return false;
  }

  MakeData(type, dataValues) {
    let data = null;
    if (type === 'priority') {
      data = [
        {
          check: this.CheckStatus(dataValues, 'CRITICAL'),
          name: 'CRITICAL'
        },
        {
          check: this.CheckStatus(dataValues, 'HIGH'),
          name: 'HIGH'
        },
        {
          check: this.CheckStatus(dataValues, 'MEDIUM'),
          name: 'MEDIUM'
        },
        {
          check: this.CheckStatus(dataValues, 'LOW'),
          name: 'LOW'
        }
      ];
    } else {
      data = [
        {
          check: this.CheckStatus(dataValues, 'ACTIVATED'),
          name: 'ACTIVATED'
        },
        {
          check: this.CheckStatus(dataValues, 'CREATED'),
          name: 'CREATED'
        },
        {
          check: this.CheckStatus(dataValues, 'DEACTIVATED'),
          name: 'DEACTIVATED'
        },
        {
          check: this.CheckStatus(dataValues, 'CLOSED'),
          name: 'CLOSED'
        }
      ];
    }
    return data;
  }

  ReturnLastValueLabel = touchpoint => {
    const tp = this.state.touchpoints.find(item => item.id === touchpoint);
    if (tp.queryData.type !== 'Alert-Check') {
      return <label className="headerSubtitleTune">Last Value</label>;
    }
  };

  DoNotRenderForAlertTP = touchpoint => {
    const tp = this.state.touchpoints.find(item => item.id === touchpoint);
    if (tp.queryData.type === 'Alert-Check') {
      return false;
    }
    return true;
  };

  RenderTuneForm = touchpoint => {
    const { viewGlobalParameters } = this.state;
    const tp = this.state.touchpoints.find(item => item.id === touchpoint);
    switch (tp.queryData.type) {
      case 'Person-Count':
        return (
          <>
            <div style={{ height: '40px', width: '400px' }}>
              {this.RenderTuneField({
                label: 'Session Count (Min)',
                defaultValue: tp.queryData.min_count,
                id: 'min_count',
                onChange: this.HandleOnChangeTune,
                name: 'min_count',
                key: 'Min',
                compare: tp.queryData.session_count
              })}
            </div>
            <div style={{ height: '40px', width: '400px' }}>
              {this.RenderTuneField({
                label: 'Session Count (Max)',
                defaultValue: tp.queryData.max_count,
                id: 'max_count',
                onChange: this.HandleOnChangeTune,
                name: 'max_count',
                key: 'Max',
                compare: tp.queryData.session_count
              })}
            </div>
          </>
        );
      case 'Process-Count':
        return (
          <>
            <div style={{ height: '40px', width: '400px' }}>
              {this.RenderTuneField({
                label: 'Transactions Count (Min)',
                defaultValue: tp.queryData.min_count,
                id: 'min_count',
                onChange: this.HandleOnChangeTune,
                name: 'min_count',
                key: 'Min',
                compare: tp.queryData.transaction_count
              })}
            </div>
            <div style={{ height: '40px', width: '400px' }}>
              {this.RenderTuneField({
                label: 'Transactions Count (Max)',
                defaultValue: tp.queryData.max_count,
                id: 'max_count',
                onChange: this.HandleOnChangeTune,
                name: 'max_count',
                key: 'Max',
                compare: tp.queryData.transaction_count
              })}
            </div>
          </>
        );
      case 'Application-Performance':
      case 'FrontEnd-Performance':
      case 'API-Performance':
        return (
          <>
            <div style={{ height: '40px', width: '400px' }}>
              {this.RenderTuneField({
                label: 'APDEX Response (Min)',
                defaultValue: tp.queryData.min_apdex,
                id: 'min_apdex',
                onChange: this.HandleOnChangeTune,
                name: 'min_apdex',
                key: 'Min',
                compare: tp.queryData.apdex_value
              })}
            </div>
            <div style={{ height: '40px', width: '400px' }}>
              {this.RenderTuneField({
                label: 'Response Time (Max)',
                defaultValue: tp.queryData.max_response_time,
                id: 'max_response_time',
                onChange: this.HandleOnChangeTune,
                name: 'max_response_time',
                key: 'Max',
                compare: tp.queryData.response_value
              })}
            </div>
            <div style={{ height: '40px', width: '400px' }}>
              {this.RenderTuneField({
                label: '% Error (Max)',
                defaultValue: tp.queryData.max_error_percentage,
                id: 'max_error_percentage',
                onChange: this.HandleOnChangeTune,
                name: 'max_error_percentage',
                key: 'Max',
                compare: tp.queryData.error_percentage
              })}
            </div>
          </>
        );
      case 'Synthetics-Check':
        return (
          <>
            <div style={{ height: '40px', width: '400px' }}>
              {this.RenderTuneField({
                label: 'Avg Response Time (Max)',
                defaultValue: tp.queryData.max_avg_response_time,
                id: 'max_avg_response_time',
                onChange: this.HandleOnChangeTune,
                name: 'max_avg_response_time',
                key: 'Max',
                compare: tp.queryData.max_request_time
              })}
            </div>
            <div style={{ height: '40px', width: '400px' }}>
              {this.RenderTuneField({
                label: 'Total Check Time (Max)',
                defaultValue: tp.queryData.max_total_check_time,
                id: 'max_total_check_time',
                onChange: this.HandleOnChangeTune,
                name: 'max_total_check_time',
                key: 'Max',
                compare: tp.queryData.max_duration
              })}
            </div>
            <div style={{ height: '40px', width: '400px' }}>
              {this.RenderTuneField({
                label: '% Success Rate (Min)',
                defaultValue: tp.queryData.min_success_percentage,
                id: 'min_success_percentage',
                onChange: this.HandleOnChangeTune,
                name: 'min_success_percentage',
                key: 'Min',
                compare: tp.queryData.success_percentage
              })}
            </div>
          </>
        );
      case 'Workload-Status':
      case 'Drops-Count':
        return (
          <>
            <div style={{ height: '40px' }}>
              This type of Touchpoint does not have any attributes for Tune
            </div>
          </>
        );
      case 'API-Count':
        return (
          <>
            <div style={{ height: '40px', width: '400px' }}>
              {this.RenderTuneField({
                label: 'API Count (Min)',
                defaultValue: tp.queryData.min_count,
                id: 'min_count',
                onChange: this.HandleOnChangeTune,
                name: 'min_count',
                key: 'Min',
                compare: tp.queryData.api_count
              })}
            </div>
            <div style={{ height: '40px', width: '400px' }}>
              {this.RenderTuneField({
                label: 'API Count (Max)',
                defaultValue: tp.queryData.max_count,
                id: 'max_count',
                onChange: this.HandleOnChangeTune,
                name: 'max_count',
                key: 'Max',
                compare: tp.queryData.api_count
              })}
            </div>
          </>
        );
      case 'API-Status':
        return (
          <>
            <div style={{ height: '40px', width: '400px' }}>
              {this.RenderTuneField({
                label: 'Success Percentage (Min)',
                defaultValue: tp.queryData.min_success_percentage,
                id: 'min_success_percentage',
                onChange: this.HandleOnChangeTune,
                name: 'min_success_percentage',
                key: 'Min',
                compare: tp.queryData.success_percentage
              })}
            </div>
          </>
        );
      case 'Alert-Check':
        return (
          <>
            <div style={{ height: '40px', width: '400px' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: '15px',
                  marginBottom: '15px',
                  width: '100%'
                }}
              >
                <label
                  className="bodySubTitle"
                  style={{
                    fontSize: '14px',
                    fontFamily: 'Open Sans',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: '19px',
                    textAlign: 'right',
                    width: '40%'
                  }}
                >
                  Account ID
                </label>
                <div style={{ width: '110px', marginLeft: '20px' }}>
                  <SelectIDs
                    name="query"
                    handleOnChange={e =>
                      this.HandleOnChange(
                        'queryAccount',
                        e.target.value,
                        this.state.current.touchpoint
                      )
                    }
                    options={this.props.accountIDs}
                    idSeleccionado={
                      this.state.form[`tp_${this.state.current.touchpoint}`]
                        .queryAccount
                    }
                  />
                </div>
              </div>
            </div>
            <div style={{ height: '40px', width: '400px' }}>
              {this.RenderAlertField({
                label: 'ConditionID',
                defaultValue: tp.queryData.alertConditionId,
                id: 'alertConditionId',
                onChange: this.HandleOnChangeTune,
                name: 'alertConditionId',
                key: 'ARRAY'
              })}
            </div>
            <div style={{ height: '40px', width: '400px' }}>
              {this.RenderAlertFieldType2({
                label: 'Priority',
                defaultValue: this.MakeData('priority', tp.queryData.priority),
                onChange: this.HandleOnChangePriority,
                key: 'ARRAY'
              })}
            </div>
            <div style={{ height: '40px', width: '400px' }}>
              {this.RenderAlertFieldType2({
                label: 'State',
                defaultValue: this.MakeData('state', tp.queryData.state),
                onChange: this.HandleOnChangeState,
                key: 'ARRAY'
              })}
            </div>
            <div style={{ height: '40px', width: '400px', paddingTop: '20px' }}>
              <label
                className="bodySubTitle"
                style={{
                  fontSize: '10px',
                  fontFamily: 'Open Sans',
                  fontStyle: 'normal',
                  fontWeight: '400',
                  lineHeight: '19px',
                  textAlign: 'left',
                  width: '40%',
                  color: '#D0D0D0',
                  cursor: 'pointer'
                }}
                onClick={() =>
                  this.setState(state => {
                    return {
                      viewGlobalParameters: !state.viewGlobalParameters
                    };
                  })
                }
              >
                &nbsp;&nbsp;&nbsp;Global Parameters
              </label>
            </div>
            {viewGlobalParameters && (
              <>
                <div style={{ height: '40px', width: '400px' }}>
                  {this.RenderAlertField({
                    label: 'Alerts Refresh Delay(min)',
                    defaultValue: this.props.alertsRefreshDelay,
                    id: 'alertsRefreshDelay',
                    onChange: this.HandleOnChangeTune,
                    name: 'alertsRefreshDelay',
                    key: 'GLOBAL'
                  })}
                </div>
                <div style={{ height: '40px', width: '400px' }}>
                  {this.RenderAlertField({
                    label: 'Alerts Time Window(min)',
                    defaultValue: this.props.alertsTimeWindow,
                    id: 'alertsTimeWindow',
                    onChange: this.HandleOnChangeTune,
                    name: 'alertsTimeWindow',
                    key: 'GLOBAL'
                  })}
                </div>
              </>
            )}
          </>
        );
      case 'Value-Performance':
        return (
          <>
            <div style={{ height: '40px', width: '400px' }}>
              {this.RenderTuneField({
                label: 'Value (Max)',
                defaultValue: tp.queryData.max_value,
                id: 'max_value',
                onChange: this.HandleOnChangeTune,
                name: 'max_value',
                key: 'Max',
                compare: tp.queryData.value
              })}
            </div>
          </>
        );
    }
  };

  HandleDropdownOpen() {
    const dialog = document.body.querySelector('div[role=dialog]');
    if (!dialog && !dialog.nextSibling) return false;
    dialog.nextSibling.style.minWidth = 'initial';
  }

  showToast = touchpoint => {
    const { list } = this.state;
    const listToast = list;
    const stageTitle = this.state.stages.filter(
      result => this.state.current.stage === result.id
    );
    const objToast = {
      id: touchpoint,
      stage: stageTitle[0].title,
      touchpoint: this.state.form[`tp_${this.state.current.touchpoint}`].title,
      description: 'Syntax error on measure time',
      backgroundColor: '#f0ad4e',
      icon: warningIcon
    };
    if (listToast.find(result => result.id === touchpoint) === undefined)
      listToast.push(objToast);
  };

  render() {
    const {
      testQueryResult,
      goodQuery,
      testQueryValue,
      testingNow,
      listTpErrorMeasureField
    } = this.state;
    return (
      <div style={{ width: '1000px' }}>
        {this.state.delete.show && (
          <div>
            <div
              className="confirm_header"
              style={{ paddingBottom: '10px', width: '1005px' }}
            >
              <div style={{ display: 'flex', width: '100%' }}>
                <div style={{ width: '50%', paddingTop: '10px' }}>
                  <p
                    style={{ margin: '0' }}
                  >{`You are about to delete: ${this.state.delete.title} Touchpoint.`}</p>
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
            <div
              className="confirm_shadow"
              style={{ height: '450px', width: '1030px' }}
            />
          </div>
        )}
        <div className="modal4content">
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
          <div style={{ display: 'flex' }}>
            <div style={{ width: '60%' }}>
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
                        <th className="headerTableTitle">Touchpoint</th>
                        <th className="headerTableTitle">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.touchpoints.map((tp, i) => {
                        return (
                          <tr key={i}>
                            <td
                              style={{
                                backgroundColor:
                                  this.state.current.touchpoint === tp.id
                                    ? '#0078BF'
                                    : tp.visible
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
                                  checked={
                                    this.state.current.touchpoint === tp.id
                                  }
                                  onChange={() => this.SelectRow(tp.id)}
                                  type="radio"
                                  name="stage_editor"
                                  className="select-row-radio"
                                  style={{
                                    marginRight: '15px'
                                    // transform: 'translateY(-3px)'
                                  }}
                                />
                                {this.state.current.touchpoint === tp.id && (
                                  <TextField
                                    style={{ width: '100%' }}
                                    className="textFieldBody"
                                    onChange={e =>
                                      this.HandleOnChange(
                                        'title',
                                        e.target.value,
                                        tp.id
                                      )
                                    }
                                    value={this.state.form[`tp_${tp.id}`].title}
                                  />
                                )}
                                {this.state.current.touchpoint !== tp.id && (
                                  <div className="textFieldBody">
                                    {this.state.form[`tp_${tp.id}`].title}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td
                              style={{
                                backgroundColor:
                                  this.state.current.touchpoint === tp.id
                                    ? '#0078BF'
                                    : tp.visible
                                    ? 'white'
                                    : 'lightgrey'
                              }}
                            >
                              <Dropdown
                                style={{ width: '100%' }}
                                onOpen={this.HandleDropdownOpen}
                                title={this.state.form[`tp_${tp.id}`].type}
                                disabled={
                                  this.state.current.touchpoint !== tp.id
                                }
                              >
                                {this.state.touchpointTypes.map((item, i) => {
                                  return (
                                    <DropdownItem
                                      onClick={() =>
                                        this.HandleOnChange(
                                          'type',
                                          item.shortName,
                                          tp.id
                                        )
                                      }
                                      key={i}
                                    >
                                      {item.longName}
                                    </DropdownItem>
                                  );
                                })}
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
                      disabled={listTpErrorMeasureField.length > 0}
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
                      onClick={this.AddTouchpoint}
                    >
                      + Add Touchpoint
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
            <div style={{ width: '50%' }}>
              {this.state.current.touchpoint !== null && (
                <>
                  <div style={{ marginLeft: '10px', marginRight: '10px' }}>
                    <input
                      onClick={() => this.SelectTab('mapping')}
                      type="radio"
                      name="tabs_radio"
                      className="select-row-radio-tab"
                      checked={this.state.tab === 'mapping'}
                      style={{
                        marginRight: '5px',
                        transform: 'translateY(7px)'
                      }}
                    />
                    <label
                      style={{
                        transform: 'translateY(2px)',
                        marginRight: '15px'
                      }}
                    >
                      Step Mapping
                    </label>
                    <input
                      onClick={() => this.SelectTab('tune')}
                      type="radio"
                      name="tabs_radio"
                      className="select-row-radio-tab"
                      style={{
                        marginRight: '5px',
                        transform: 'translateY(7px)'
                      }}
                    />
                    <label
                      style={{
                        transform: 'translateY(2px)',
                        marginRight: '15px'
                      }}
                    >
                      Tune
                    </label>
                    <input
                      onClick={() => this.SelectTab('query')}
                      type="radio"
                      name="tabs_radio"
                      className="select-row-radio-tab"
                      style={{
                        marginRight: '5px',
                        transform: 'translateY(7px)'
                      }}
                    />
                    <label
                      style={{
                        transform: 'translateY(2px)',
                        marginRight: '15px'
                      }}
                    >
                      Query
                    </label>
                    <input
                      onClick={() => this.SelectTab('general')}
                      type="radio"
                      name="tabs_radio"
                      className="select-row-radio-tab"
                      style={{
                        marginRight: '5px',
                        transform: 'translateY(7px)'
                      }}
                    />
                    <label
                      style={{
                        transform: 'translateY(2px)',
                        marginRight: '15px'
                      }}
                    >
                      General
                    </label>
                    <img
                      style={{
                        width: '40px',
                        marginLeft: '20px',
                        height: 'auto',
                        cursor: 'pointer',
                        transform: 'translateY(3px)'
                      }}
                      onClick={() => this.ToggleOnOff()}
                      src={
                        this.state.current.touchpoint &&
                        this.state.form[`tp_${this.state.current.touchpoint}`]
                          .status
                          ? onIcon
                          : offIcon
                      }
                    />
                  </div>
                  {this.state.tab === 'mapping' && (
                    <div
                      style={{
                        marginTop: '11px',
                        marginLeft: '10px',
                        marginRight: '10px',
                        background: '#F7F7F8',
                        paddingLeft: '20px',
                        paddingRight: '20px',
                        paddingTop: '15px'
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          display: 'flex',
                          fontFamily: 'Open Sans',
                          fontStyle: 'normal',
                          fontWeight: '600',
                          fontSize: '14px',
                          lineHeight: '19px',
                          marginBottom: '4px'
                        }}
                      >
                        <div style={{ width: '50%', marginLeft: '45px' }}>
                          <p>Choose Related Steps</p>
                        </div>
                      </div>
                      <div style={{ maxHeight: '270px', overflowY: 'scroll' }}>
                        {this.state.steps.map((item, i) => {
                          return (
                            <div
                              style={{
                                marginBottom: '10px',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              key={i}
                            >
                              <div
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  backgroundColor: 'grey',
                                  borderRadius: '100%',
                                  color: 'white',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center'
                                }}
                              >
                                {i + 1}
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  marginLeft: '15px'
                                }}
                              >
                                {item.sub_steps.map((sub, x) => {
                                  return (
                                    <div
                                      onClick={() =>
                                        this.ToggleSelectMapping(sub.value)
                                      }
                                      style={{
                                        padding: '10px 15px',
                                        borderColor: '#424242',
                                        borderStyle: 'solid',
                                        borderWidth: '1px',
                                        marginLeft: '5px',
                                        cursor: 'pointer',
                                        color:
                                          this.state.current.touchpoint &&
                                          this.state.current.subs[
                                            this.state.current.touchpoint
                                          ].some(value => sub.value === value)
                                            ? 'white'
                                            : '#424242',
                                        backgroundColor:
                                          this.state.current.touchpoint &&
                                          this.state.current.subs[
                                            this.state.current.touchpoint
                                          ].some(value => sub.value === value)
                                            ? '#0078BF'
                                            : 'white'
                                      }}
                                      key={`sub_${x}`}
                                    >
                                      {sub.value}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {this.state.tab === 'tune' && this.state.current.touchpoint && (
                    <div
                      style={{
                        width: '421px',
                        height: '292px',
                        marginTop: '11px',
                        marginLeft: '10px',
                        marginRight: '10px',
                        background: '#F7F7F8',
                        paddingRight: '20px',
                        justifyContent: 'left'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'end',
                          marginBottom: '1px',
                          paddingTop: '20px'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: '50%'
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              width: '45%',
                              justifyContent: 'center'
                            }}
                          >
                            <label className="headerSubtitleTune">
                              Configured
                            </label>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              width: '55%',
                              justifyContent: 'center'
                            }}
                          >
                            {this.ReturnLastValueLabel(
                              this.state.current.touchpoint
                            )}
                          </div>
                        </div>
                      </div>
                      {this.RenderTuneForm(this.state.current.touchpoint)}
                    </div>
                  )}
                  {this.state.tab === 'query' &&
                    this.state.current.touchpoint &&
                    this.DoNotRenderForAlertTP(
                      this.state.current.touchpoint
                    ) && (
                      <div
                        style={{
                          marginTop: '11px',
                          marginLeft: '10px',
                          marginRight: '10px',
                          background: '#F7F7F8',
                          paddingLeft: '20px',
                          paddingRight: '20px',
                          paddingBottom: '20px'
                        }}
                      >
                        <div style={{ display: 'flex', width: '100%' }}>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginTop: '15px',
                              marginBottom: '15px',
                              width: '50%'
                            }}
                          >
                            Account ID
                            <div style={{ width: '110px', marginLeft: '10px' }}>
                              <SelectIDs
                                name="query"
                                handleOnChange={e =>
                                  this.HandleOnChange(
                                    'queryAccount',
                                    e.target.value,
                                    this.state.current.touchpoint
                                  )
                                }
                                options={this.props.accountIDs}
                                idSeleccionado={
                                  this.state.form[
                                    `tp_${this.state.current.touchpoint}`
                                  ].queryAccount
                                }
                              />
                            </div>
                          </div>
                          <div
                            style={{
                              marginTop: '15px',
                              marginBottom: '15px',
                              width: '50%',
                              display: 'flex',
                              justifyContent: 'flex-end',
                              alignItems: 'center'
                            }}
                          >
                            <div>
                              Timeout
                              <input
                                type="text"
                                value={
                                  this.state.form[
                                    `tp_${this.state.current.touchpoint}`
                                  ].timeout
                                }
                                onChange={e =>
                                  this.HandleOnChange(
                                    'timeout',
                                    e.target.value,
                                    this.state.current.touchpoint
                                  )
                                }
                                className="inputText"
                                style={{
                                  width: '50px',
                                  background: '#FFFFFF',
                                  border: '1px solid #BDBDBD',
                                  boxSizing: 'border-box',
                                  padding: '5px',
                                  marginLeft: '10px',
                                  textAlign: 'center'
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Query Editor */}
                        <Editor
                          style={{ height: 100 }}
                          value={
                            this.state.form[
                              `tp_${this.state.current.touchpoint}`
                            ].query
                          }
                          onPressEnter={this.RunTest}
                          onChange={e =>
                            this.HandleOnChange(
                              'query',
                              e.target.value,
                              this.state.current.touchpoint
                            )
                          }
                        />

                        <div>
                          <span>
                            <b>SINCE </b>
                          </span>
                          <div
                            style={{
                              display: 'inline',
                              flexDirection: 'column',
                              width: '100%'
                            }}
                          >
                            <input
                              type="text"
                              value={
                                this.state.form[
                                  `tp_${this.state.current.touchpoint}`
                                ].queryMeasure
                              }
                              style={
                                listTpErrorMeasureField.includes(
                                  this.state.current.touchpoint
                                )
                                  ? {
                                      background: '#FFFFFF',
                                      border: '1px solid #FC1303',
                                      boxSizing: 'border-box',
                                      marginTop: '10px',
                                      marginBottom: '10px',
                                      marginLeft: '7px',
                                      width: '50%'
                                    }
                                  : {
                                      background: '#FFFFFF',
                                      border: '1px solid #BDBDBD',
                                      boxSizing: 'border-box',
                                      marginTop: '10px',
                                      marginBottom: '10px',
                                      marginLeft: '7px',
                                      width: '50%'
                                    }
                              }
                              onChange={e =>
                                this.HandleOnChange(
                                  'queryMeasure',
                                  e.target.value,
                                  this.state.current.touchpoint
                                )
                              }
                            />
                            {listTpErrorMeasureField.includes(
                              this.state.current.touchpoint
                            )
                              ? (this.showToast(this.state.current.touchpoint),
                                (
                                  <span className="errorMessageMeasureTime">
                                    Syntax error on measure time (e.g. 15
                                    MINUTES AGO)
                                  </span>
                                ))
                              : null}
                          </div>
                        </div>
                        {/* Query Result */}
                        <Editor
                          isReadOnly
                          style={{ height: 70, marginTop: '6px' }}
                          value={
                            testQueryValue ? objToString(testQueryValue) : ''
                          }
                        />
                        <div
                          style={{
                            display: 'flex',
                            marginTop: '15px',
                            alignItems: 'center'
                          }}
                        >
                          <a
                            style={{
                              paddingRight: '20px'
                            }}
                            onClick={() =>
                              this.HandleOnSampleQuery(
                                this.state.current.touchpoint
                              )
                            }
                          >
                            Sample Query
                          </a>
                          <div>
                            <Button
                              disabled={testingNow}
                              onClick={this.RunTest}
                              variant="contained"
                              color="primary"
                              style={{
                                background: 'white',
                                border: '1px solid #767B7F',
                                boxSizing: 'border-box',
                                marginRight: '15px'
                              }}
                            >
                              Test
                            </Button>
                          </div>
                          <div>
                            {testQueryResult !== '' && (
                              <span
                                style={{
                                  color: goodQuery ? 'green' : 'red',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                {goodQuery ? (
                                  <SuccessfullIcon />
                                ) : (
                                  <WrongIcon />
                                )}
                                {testQueryResult}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  {this.state.tab === 'general' &&
                    this.state.current.touchpoint && (
                      <div
                        style={{
                          width: '421px',
                          height: '292px',
                          marginTop: '11px',
                          marginLeft: '10px',
                          marginRight: '10px',
                          background: '#F7F7F8',
                          paddingRight: '20px',
                          paddingTop: '25px',
                          paddingLeft: '20px'
                        }}
                      >
                        <label
                          style={{
                            fontFamily: 'Open Sans',
                            fontStyle: 'normal',
                            fontWeight: '600',
                            fontSize: '14px',
                            lineHeight: '19px'
                          }}
                        >
                          Dashboard Link
                        </label>
                        <input
                          onChange={e =>
                            this.HandleOnChange(
                              'dashboardLink0',
                              e.target.value,
                              this.state.current.touchpoint
                            )
                          }
                          value={
                            this.state.form[
                              `tp_${this.state.current.touchpoint}`
                            ].dashboardLink.length > 0
                              ? this.state.form[
                                  `tp_${this.state.current.touchpoint}`
                                ].dashboardLink[0].url
                              : ''
                          }
                          type="text"
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid #BDBDBD',
                            boxSizing: 'border-box',
                            fontFamily: 'Open Sans',
                            fontStyle: 'normal',
                            fontWeight: '400',
                            fontSize: '12px',
                            lineHeight: '16px'
                          }}
                        />
                        <div style={{ height: '20px' }} />
                        {this.state.form[`tp_${this.state.current.touchpoint}`]
                          .dashboardLink.length > 0 && (
                          <label
                            style={{
                              fontFamily: 'Open Sans',
                              fontStyle: 'normal',
                              fontWeight: '600',
                              fontSize: '14px',
                              lineHeight: '19px'
                            }}
                          >
                            Secondary Links
                          </label>
                        )}
                        {this.state.form[`tp_${this.state.current.touchpoint}`]
                          .dashboardLink.length === 1 && (
                          <img
                            style={{
                              width: '15px',
                              marginLeft: '20px',
                              marginBottom: '10px',
                              height: 'auto',
                              cursor: 'pointer',
                              transform: 'translateY(3px)'
                            }}
                            onClick={() => this.AddSecondaryLinks()}
                            src={addIcon}
                          />
                        )}
                        {this.state.form[`tp_${this.state.current.touchpoint}`]
                          .dashboardLink.length > 1 && (
                          <img
                            style={{
                              width: '15px',
                              marginLeft: '20px',
                              marginBottom: '10px',
                              height: 'auto',
                              cursor: 'pointer',
                              transform: 'translateY(3px)'
                            }}
                            onClick={() => this.RemoveSecondaryLinks()}
                            src={removeIcon}
                          />
                        )}
                        {this.state.form[`tp_${this.state.current.touchpoint}`]
                          .dashboardLink.length > 1 && (
                          <div>
                            <label
                              style={{
                                fontFamily: 'Open Sans',
                                fontStyle: 'normal',
                                fontWeight: '400',
                                fontSize: '10px',
                                lineHeight: '10px'
                              }}
                            >
                              Nick Name
                            </label>
                            <label
                              style={{
                                fontFamily: 'Open Sans',
                                fontStyle: 'normal',
                                fontWeight: '400',
                                fontSize: '11px',
                                lineHeight: '10px',
                                marginLeft: '60px'
                              }}
                            >
                              URL
                            </label>
                          </div>
                        )}
                        {this.state.form[`tp_${this.state.current.touchpoint}`]
                          .dashboardLink.length > 1 &&
                          this.state.form[
                            `tp_${this.state.current.touchpoint}`
                          ].dashboardLink
                            .slice(1)
                            .map((link, i) => {
                              return (
                                <>
                                  <input
                                    key={i + 1}
                                    onChange={e =>
                                      this.HandleOnChange(
                                        `nickName${i + 1}`,
                                        e.target.value,
                                        this.state.current.touchpoint
                                      )
                                    }
                                    value={
                                      this.state.form[
                                        `tp_${this.state.current.touchpoint}`
                                      ].dashboardLink[i + 1].nickName
                                    }
                                    type="text"
                                    style={{
                                      width: '100px',
                                      background: '#FFFFFF',
                                      border: '1px solid #BDBDBD',
                                      boxSizing: 'border-box',
                                      fontFamily: 'Open Sans',
                                      fontStyle: 'normal',
                                      fontWeight: '400',
                                      fontSize: '12px',
                                      lineHeight: '16px'
                                    }}
                                  />
                                  <input
                                    key={i + 1}
                                    onChange={e =>
                                      this.HandleOnChange(
                                        `dashboardLink${i + 1}`,
                                        e.target.value,
                                        this.state.current.touchpoint
                                      )
                                    }
                                    value={
                                      this.state.form[
                                        `tp_${this.state.current.touchpoint}`
                                      ].dashboardLink[i + 1].url
                                    }
                                    type="text"
                                    style={{
                                      width: '270px',
                                      background: '#FFFFFF',
                                      border: '1px solid #BDBDBD',
                                      boxSizing: 'border-box',
                                      fontFamily: 'Open Sans',
                                      fontStyle: 'normal',
                                      fontWeight: '400',
                                      fontSize: '12px',
                                      lineHeight: '16px',
                                      marginLeft: '10px'
                                    }}
                                  />
                                  <div style={{ height: '10px' }} />
                                </>
                              );
                            })}
                      </div>
                    )}
                </>
              )}
              <Toast toastList={this.state.list} position="top-right" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

BodyTouchpointsEditor.propTypes = {
  stagesInterface: PropTypes.array.isRequired,
  handleStagesEditorSubmit: PropTypes.func.isRequired,
  accountIDs: PropTypes.array.isRequired,
  EditorValidateQuery: PropTypes.func.isRequired,
  timeRangeBodyTouchpointsEditor: PropTypes.string,
  alertsTimeWindow: PropTypes.number.isRequired,
  alertsRefreshDelay: PropTypes.number.isRequired,
  handleAlertParameterUpdate: PropTypes.func.isRequired
};

export { HeaderTouchpointsEditor, BodyTouchpointsEditor };
