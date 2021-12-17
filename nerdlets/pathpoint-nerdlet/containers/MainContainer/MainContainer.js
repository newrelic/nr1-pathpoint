// IMPORT LIBRARIES AND DEPENDENCIES
import React from 'react';
import { nerdlet, logger } from 'nr1';
import Setup from '../../config/setup.json';
import messages from '../../config/messages.json';
import {
  mainContainerStyle,
  contentStyle,
  contentContainerStyle,
  mainColumn
} from './stylesFuntion';

// IMPORT CONTAINERS AND COMPONENTS
import TouchPointContainer from '../TouchPointContainer/TouchPointContainer.js';
import StepContainer from '../StepContainer/StepContainer.js';
import Stage from '../../components/Stage/Stage.js';
import Header from '../../components/Header/Header.js';
import TooltipStages from '../../components/Tooltip/TooltipStages';
import TooltipSteps from '../../components/Tooltip/TooltipSteps';
import TooltipTouchPoints from '../../components/Tooltip/TooltipTouchPoints';
import Modal from '../../components/Modal';
import Tooltip from '../../components/Tooltip/Tooltip';

// IMPORT SERVICES
import DataManager from '../../services/DataManager';
import ValidationQuery from '../../services/Validations.js';
import LogoSetupData from '../../services/LogoSetupData';
import { CreateJiraIssue } from '../../services/JiraConnector';

// IMPORT STATIC FILES AND IMAGES
import logoNewRelic from '../../images/logoNewRelic.png';
import loadin from '../../images/Loading.gif';
import logo_icon from '../../images/logo_icon.svg';
import medalIconOn from '../../images/medalIconOn.svg';
import medalIcon from '../../images/medalIcon.svg';
import startIcon from '../../images/StartIcon.svg';
import startIconOn from '../../images/StartIconOn.svg';
import goutBlack from '../../images/goutBlack.svg';
import support from '../../images/support_on.svg';
import setup from '../../images/setup_on.svg';
import right_icon from '../../images/right.svg';
import flame_icon from '../../images/flame_icon.svg';
import gout_icon from '../../images/gout_icon.svg';
import star_icon from '../../images/star_icon.svg';

/**
 *Main container component
 * @export
 * @class MainContainer
 * @extends {React.Component}
 */

export default class MainContainer extends React.Component {
  constructor(props) {
    super(props);
    nerdlet.setConfig({
      header: false
    });
    this.state = {
      updating: false,
      queryModalShowing: false,
      updateBackgroundScript: false,
      generalConfigurationSaved: false,
      disableGeneralConfigurationSubmit: false,
      accountName: '',
      credentials: {
        accountId: null,
        ingestLicense: null,
        userAPIKey: null,
        dropTools: null,
        flameTools: null,
        loggin: null
      },
      licenseValidations: {
        ingestLicense: null,
        userApiKey: null
      },
      totalContainers: 1,
      waiting: true,
      stages: null,
      iconFireStatus: false,
      iconStartStatus: false,
      iconGoutStatus: false,
      iconCanaryStatus: false,
      hidden: false,
      stageNameSelected: null,
      viewModal: 0,
      checkMoney: false,
      city: 0,
      timeRange: '5 MINUTES AGO',
      loading: false,
      canaryData: null,
      colors: {},

      tuneOptions: null,
      checkAllStatus: false,
      visible: false,
      idVisible: '',
      version: '0.0.0',
      showCanaryWelcomeMat: true,
      showFireWelcomeMat: true,
      backdrop: false,
      showLeftPanel: false,
      supportForm: {
        subject: '',
        name: '',
        email: '',
        phone: '',
        message: ''
      },
      showRightPanel: false,
      MenuRightDefault: 0,
      flameForm: {
        hours: 0,
        percentage: 0
      },
      errorsList: [],
      starForm: {
        starHours: 12,
        starTraffic: 100,
        starCongestion: 25,
        starTransactions: 400
      },
      dropForm: {
        dropmoney: 0,
        hours: 0,
        percentage: 0
      },
      logoSetupData: null,
      configuration: null,
      updateData: null,
      testText: '',
      testingNow: false,
      resultsTestQuery: '',
      goodQuery: true,
      logoSetup: {
        type: 'Default'
      },
      modifiedQuery: false,
      timeRangeKpi: {
        index: 0,
        range: '24 HOURS AGO'
      },
      kpis: [],
      accountIDs: [],
      accountId: 0,
      credentialsBackup: false,
      sendingLogsEnableDisable: true
    };
  }

  // =========================================================== EMULATOR
  /*
  componentDidMount() {
    this.BoootstrapApplication();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.emulator.closeConnections();
  }

  BoootstrapApplication = async () => {
    this.DataManager = new DataManager();
    const { accountName } = this.state;
    const data = await this.DataManager.BootstrapInitialData(accountName);
    this.setState(
      {
        stages: data.stages,
        colors: data.colors,
        version: data.version,
        accountId: data.accountId,
        kpis: data.kpis,
        totalContainers: data.totalContainers
      },
      async () => {
        this.emulator = new Emulator(this.state.stages, data.kpis);
        this.emulator.init();
        this.setState({
          initialized: true,
          stages: this.emulator.getDataState(),
          waiting: false
        });
        setInterval(() => {
          this.setState({ 
            stages: this.emulator.getDataState(), 
            kpis: this.emulator.getKpis() 
          });
        }, Setup.time_refresh);
        this.validationQuery = new ValidationQuery(this.state.accountId);
        this.InitLogoSetupData(this.state.accountId);
      }
    );
  };

  updateDataNow() {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);
  }
  */
  // =========================================================== UPDATE DATA API

  componentDidMount() {
    this.BoootstrapApplication();
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('Execute  this...');
    if (
      prevState.updating &&
      !this.state.updating &&
      this.state.pending &&
      this.state.loading
    ) {
      // console.log('Order to Execute Update Data');
      this.ExecuteUpdateData(true);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  BoootstrapApplication = async () => {
    this.DataManager = new DataManager();
    const { accountName } = this.state;
    const data = await this.DataManager.BootstrapInitialData(accountName);
    let credentials = {};
    if (
      data.credentials &&
      data.credentials.actor.nerdStorageVault.secrets.length > 0
    ) {
      data.credentials.actor.nerdStorageVault.secrets.forEach(item => {
        let value = '';
        if (item.value !== '_') {
          item.value.split('').forEach((char, i) => {
            if (i <= 3) {
              value = `${value}${char}`;
            } else {
              value = `${value}x`;
            }
          });
        }
        credentials[item.key] = value;
      });
    }
    if (data.generalConfiguration) {
      credentials = {
        ...credentials,
        ...data.generalConfiguration
      };
    }
    this.setState(
      {
        stages: data.stages,
        colors: data.colors,
        version: data.version,
        accountId: data.accountId,
        kpis: data.kpis,
        totalContainers: data.totalContainers,
        accountIDs: data.accountIDs,
        credentials,
        credentialsBackup: credentials
      },
      async () => {
        this.validationQuery = new ValidationQuery(this.state.accountId);
        this.InitLogoSetupData(this.state.accountId);
        setTimeout(() => {
          this.ExecuteUpdateData();
        }, 500);
        setInterval(() => {
          this.ExecuteUpdateData();
        }, Setup.time_refresh);
      }
    );
  };

  ExecuteUpdateData = changeLoading => {
    const { updating, queryModalShowing } = this.state;
    // console.log('updating:', updating, 'QueryModal:', queryModalShowing);
    if (!updating && !queryModalShowing) {
      this.setState(
        {
          updating: true
        },
        async () => {
          const { timeRange, city, stages, kpis, timeRangeKpi } = this.state;
          const data = await this.DataManager.UpdateData(
            timeRange,
            city,
            stages,
            kpis,
            timeRangeKpi
          );
          this.setState(
            {
              stages: data.stages,
              kpis: data.kpis ?? [],
              waiting: false
            },
            () => {
              this.setState({
                updating: false
              });
              if (changeLoading) {
                this.setState({
                  loading: false
                });
              }
            }
          );
        }
      );
    }
  };

  updateDataNow() {
    this.setState({
      loading: true,
      pending: true
    });
  }

  // ===========================================================

  ToggleHeaderButtons = target => {
    let previousIconCanaryStatus = null;
    let previousIconFireStatus = null;
    let previousIconGoutStatus = null;
    this.setState(
      state => {
        previousIconCanaryStatus = state.iconCanaryStatus;
        previousIconFireStatus = state.iconFireStatus;
        previousIconGoutStatus = state.iconGoutStatus;
        return {
          iconCanaryStatus: false,
          iconFireStatus: false,
          iconGoutStatus: false,
          [target]: !state[target]
        };
      },
      () => {
        this.ToggleCanaryIcon(previousIconCanaryStatus);
        this.ToggleFireIcon(previousIconFireStatus);
        this.ToggleGoutIcon(previousIconGoutStatus);
      }
    );
  };

  onClickStage = stageIndex => {
    this.setState(state => {
      const { stages } = state;
      stages[stageIndex - 1].latencyStatus = !stages[stageIndex - 1]
        .latencyStatus;
      return {
        stages
      };
    });
  };

  InitLogoSetupData = async accountId => {
    this.LogoSetupData = new LogoSetupData(accountId);
    const logoSetup = await this.LogoSetupData.GetLogoSetupData();
    if (logoSetup) {
      this.setState({
        logoSetup
      });
    }
  };

  onclickStep = stepEntry => {
    this.setState(state => {
      const {
        stages,
        iconFireStatus,
        city,
        iconCanaryStatus,
        canaryData
      } = state;
      if (iconFireStatus) {
        this.ResetAllStages();
      }
      const touchpoint = [];
      const newStages = [];
      let flag = false;
      const stage = stages[stepEntry.index_stage - 1];
      for (const step of stage.steps) {
        if (step.value === '') {
          for (const substep of step.sub_steps) {
            if (substep.value === stepEntry.value) {
              if (iconCanaryStatus) {
                substep.canary_state = !substep.canary_state;
                this.DataManager.SetCanaryData(stages, city);
                canaryData[substep.index_stage - 1].states[substep.index - 1] =
                  substep.canary_state;
                this.DataManager.UpdateCanaryData(canaryData);
              } else {
                flag = substep.highlighted;
                substep.highlighted = !substep.highlighted;
                for (const id_touchpoint of substep.relationship_touchpoints) {
                  touchpoint.push(id_touchpoint);
                }
              }
            } else {
              substep.highlighted = false;
            }
          }
        } else if (step.value === stepEntry.value) {
          if (iconCanaryStatus) {
            step.canary_state = !step.canary_state;
            this.DataManager.SetCanaryData(stages, city);
            canaryData[step.index_stage - 1].states[step.index - 1] =
              step.canary_state;
            this.DataManager.UpdateCanaryData(canaryData);
          } else {
            flag = step.highlighted;
            step.highlighted = !step.highlighted;
            // for (const id_touchpoint of step.sub_steps[0]
            //   .relationship_touchpoints) {
            //   touchpoint.push(id_touchpoint);
            // }
            // =====> Definir bien la funcion, (antigua funcion)
            for (const id_touchpoint of step.relationship_touchpoints) {
              touchpoint.push(id_touchpoint);
            }
          }
        } else {
          step.highlighted = false;
        }
      }
      for (const key in stage.touchpoints) {
        if (key) {
          stage.touchpoints[key].highlighted = false;
        }
      }
      if (!flag) {
        if (touchpoint.length !== 0) {
          for (const id_to of touchpoint) {
            for (const key in stage.touchpoints) {
              if (stage.touchpoints[key].index === id_to) {
                stage.touchpoints[key].highlighted = !stage.touchpoints[key]
                  .highlighted;
              }
            }
          }
        }
      }
      for (const iterator of stages) {
        if (iterator.title !== stage.title) {
          newStages.push(iterator);
        } else {
          newStages.push(stage);
        }
      }
      return {
        stages: newStages,
        iconFireStatus: false
      };
    });
  };

  ResetAllStages = () => {
    this.setState(state => {
      const { stages } = state;
      for (const stage of stages) {
        for (const step of stage.steps) {
          if (step.value === '') {
            for (const substep of step.sub_steps) {
              substep.history_error = false;
              substep.highlighted = false;
            }
            step.history_error = false;
            step.highlighted = false;
          } else {
            step.history_error = false;
            step.highlighted = false;
          }
        }
        for (const touch of stage.touchpoints) {
          touch.highlighted = false;
          touch.history_error = false;
        }
      }
      return {
        stages
      };
    });
  };

  _onClose = errors => {
    const actualValue = this.state.hidden;
    this.setState({ hidden: !actualValue, queryModalShowing: false });
    if (!this.state.generalConfigurationSaved) {
      this.setState(state => {
        let credentials = {};
        if (state.credentialsBackup !== false) {
          credentials = {
            ...state.credentialsBackup
          };
        } else {
          credentials = {
            ...state.credentials,
            ingestLicense: null,
            userAPIKey: null,
            dropTools: false,
            flameTools: false,
            loggin: false
          };
        }
        return {
          licenseValidations: {
            userApiKey: null,
            ingestLicense: null
          },
          credentials
        };
      });
    }
    this.restoreTouchPoints();
    if (errors) {
      this.setState({
        viewModal: 8,
        hidden: true,
        errorsList: errors
      });
    } else {
      this.setState({
        errorsList: []
      });
    }
  };

  PreSelectCanaryData = canaryData => {
    this.setState(
      state => {
        const { stages } = state;
        for (const stage of stages) {
          for (const step of stage.steps) {
            if (step.value === '') {
              for (const substep of step.sub_steps) {
                substep.canary_state =
                  canaryData[substep.index_stage - 1].states[substep.index - 1];
              }
            } else {
              step.canary_state =
                canaryData[step.index_stage - 1].states[step.index - 1];
            }
          }
        }
        return {
          stages
        };
      },
      () => {
        this.ExecuteSetCanaryData();
      }
    );
  };

  ExecuteSetCanaryData = () => {
    this.setState(state => {
      const { stages, city } = state;
      const data = this.DataManager.SetCanaryData(stages, city);
      return {
        stages: data.stages
      };
    });
  };

  ToggleCanaryIcon = previousIconCanaryStatus => {
    const { iconCanaryStatus } = this.state;
    if (iconCanaryStatus && this.state.showCanaryWelcomeMat) {
      this.setState({
        viewModal: 6,
        stageNameSelected: null
      });
      this._onClose();
    }
    if (!previousIconCanaryStatus && iconCanaryStatus) {
      const canaryData = this.DataManager.LoadCanaryData();
      this.setState(
        {
          canaryData
        },
        () => {
          this.PreSelectCanaryData(this.state.canaryData);
          this.updateDataNow();
        }
      );
    } else if (previousIconCanaryStatus && !iconCanaryStatus) {
      this.setState(
        state => {
          const { stages } = state;
          const data = this.DataManager.ClearCanaryData(stages);
          return {
            stages: data.stages
          };
        },
        () => {
          this.updateDataNow();
        }
      );
    }
  };

  clearStepsHistoricError() {
    this.setState(state => {
      const { stages } = state;
      stages.forEach(state => {
        state.steps.forEach(step => {
          step.sub_steps.forEach(sub_step => {
            sub_step.history_error = false;
          });
        });
      });
      return {
        stages
      };
    });
  }

  setStepsHistoricError(stage_index, relation_steps) {
    const rsteps = JSON.stringify(relation_steps).replace(/[,[\]]/g, '-');
    this.setState(state => {
      const { stages } = state;
      stages[stage_index - 1].steps.forEach(step => {
        step.sub_steps.forEach(sub_step => {
          if (rsteps.indexOf(`-${sub_step.index}-`) !== -1) {
            sub_step.history_error = true;
          }
        });
      });
    });
  }

  updateHistoricErrors() {
    this.clearStepsHistoricError();
    this.state.stages.forEach(stage => {
      stage.touchpoints.forEach(touchpoint => {
        if (touchpoint.history_error) {
          this.setStepsHistoricError(stage.index, touchpoint.relation_steps);
        }
      });
    });
  }

  ToggleFireIcon = async previousIconFireStatus => {
    const { iconFireStatus } = this.state;
    if (iconFireStatus && this.state.showFireWelcomeMat) {
      this.setState({
        viewModal: 7,
        stageNameSelected: null
      });
      this._onClose();
    }
    if (iconFireStatus) {
      const data = await this.DataManager.ReadHistoricErrors();
      this.setState(
        {
          stages: data.stages
        },
        () => {
          this.updateHistoricErrors();
        }
      );
    } else if (previousIconFireStatus && !iconFireStatus) {
      // TODO
    }
  };

  ToggleGoutIcon = async previousIconGoutStatus => {
    const { iconGoutStatus } = this.state;
    // if (iconGoutStatus && this.state.showFireWelcomeMat) {
    //   this.setState({
    //     viewModal: 7,
    //     stageNameSelected: null
    //   });
    //   this._onClose();
    // }
    if (iconGoutStatus) {
      // TODO
    } else if (previousIconGoutStatus && !iconGoutStatus) {
      // TODO
    }
  };

  removeDuplicates(originalArray) {
    const newArray = [];
    const lookupObject = {};
    for (const i in originalArray) {
      if (i) {
        lookupObject[originalArray[i]] = originalArray[i];
      }
    }
    for (const i in lookupObject) {
      if (i) {
        newArray.push(lookupObject[i]);
      }
    }
    return newArray;
  }

  openModal = stage => {
    this.setState({
      viewModal: 0,
      stageNameSelected: stage
    });
    this._onClose();
  };

  updateTouchpointStageOnOff(touchpoint) {
    touchpoint.status_on_off = !touchpoint.status_on_off;
    this.setState(state => {
      return {
        stages: state.stages,
        updateBackgroundScript: true
      };
    });
  }

  updateTouchpointOnOff = touchpoint => {
    if (!this.state.iconCanaryStatus) {
      this.updateTouchpointStageOnOff(touchpoint);
      this.DataManager.UpdateTouchpointOnOff(touchpoint, true);
    }
  };

  openModalParent = (touchpoint, view) => {
    let datos = null;
    const queryModalShowing = true; // DO NOT Update Data while Modals is Showing
    if (view === 2) {
      datos = this.DataManager.GetTouchpointTune(touchpoint);
    } else if (view === 1) {
      datos = this.DataManager.GetTouchpointQuerys(touchpoint);
    } else if (view === 9) {
      datos = {
        credentials: this.state.credentials,
        accountIDs: this.state.accountIDs,
        accountId: this.state.accountId,
        updateBackgroundScript: this.state.updateBackgroundScript
      };
    }
    this.setState({
      viewModal: view,
      stageNameSelected: { touchpoint, datos },
      testText: '',
      resultsTestQuery: '',
      modifiedQuery: false,
      goodQuery: true,
      queryModalShowing: queryModalShowing,
      hidden: true
    });
  };

  changeTimeRange = event => {
    this.setState({ timeRange: event.target.value }, this.updateDataNow);
  };

  resetIcons = (statusStar, statusFire, statusGot, statusCanary) => {
    if (statusStar) {
      const { stages } = this.state;
      const newData = [];
      for (const stage of stages) {
        stage.money_enabled = false;
        stage.icon_visible = false;
        newData.push(stage);
      }
      this.setState({
        stages: newData,
        iconStartStatus: false
      });
    }
    if (statusFire) {
      this.setState(state => {
        const { stages } = state;
        for (const stage of stages) {
          for (const step of stage.steps) {
            if (step.value === '') {
              for (const substep of step.sub_steps) {
                substep.highlighted = false;
              }
              step.highlighted = false;
            } else {
              step.highlighted = false;
            }
          }
          for (const touch of stage.touchpoints) {
            touch.highlighted = false;
          }
        }
        return {
          stages,
          iconFireStatus: false
        };
      });
    }
    if (statusGot) {
      this.setState(state => {
        const { stages } = state;
        for (const stage of stages) {
          stage.gout_enable = false;
        }
        return {
          stages,
          iconGoutStatus: false
        };
      });
    }
    if (statusCanary) {
      this.setState({
        iconCanaryStatus: !statusCanary
      });
    }
  };

  renderContentAboveStep = (statusStar, statusGot, statusFire, element) => {
    if (statusStar) {
      return (
        <div className="moneyStage">
          <div
            className="selectIcon"
            onClick={() => {
              this.openModal(element);
            }}
          >
            {element.icon_visible && (
              <>
                {element.icon_description === 'medal' ? (
                  <img
                    className="sizeIconMedal"
                    src={element.icon_active ? medalIconOn : medalIcon}
                  />
                ) : (
                  <img
                    className="sizeIconStart"
                    src={element.icon_active ? startIconOn : startIcon}
                  />
                )}
              </>
            )}
          </div>
          <div className="cashStage" style={{ color: '#C59400' }}>
            ${element.money}
          </div>
        </div>
      );
    }
    if (statusGot) {
      return (
        <div className="moneyStage">
          <div style={{ alignItems: 'center', marginRight: '5%' }}>
            <img src={goutBlack} height="15px" width="11px" />
            <span className="goutTxt">{element.gout_quantity}</span>
          </div>
          <div className="cashStage">
            {this.FormatMoney(element.gout_money, this.DisplayConsole)}
          </div>
        </div>
      );
    }
    if (statusFire) {
      return (
        <div className="moneyStageHistoryError">
          <div className="cashStage" style={{ color: 'red' }}>
            ${element.money}
          </div>
        </div>
      );
    }
  };

  changeTouchpointsView(event) {
    this.setState({ checkAllStatus: event.target.checked });
  }

  /**
   * Function to close the TouchPoint
   *
   * @memberof MainContainer
   */

  _onCloseBackdropTouch = () => {
    const { idVisible } = this.state;
    this.setState({
      visible: false,
      idVisible: idVisible
    });
    this.restoreTouchPoints();
  };

  renderProps = (idVisible, touchActive) => {
    const { visible } = this.state;
    this.setState({ visible: !visible, idVisible: idVisible });
    this.restoreTouchPoints();
    if (!visible) {
      touchActive.active = true;
    }
  };

  restoreTouchPoints = () => {
    this.setState(state => {
      const { stages } = state;
      for (const stage of stages) {
        for (const touch of stage.touchpoints) {
          touch.active = false;
        }
      }
      return {
        stages
      };
    });
  };

  changeMessage = event => {
    const { stageNameSelected, modifiedQuery } = this.state;
    if (
      (stageNameSelected.selectedCase &&
        stageNameSelected.selectedCase === parseInt(event.target.value)) ||
      modifiedQuery
    ) {
      this.setState({
        stageNameSelected,
        testText: '',
        resultsTestQuery: ''
      });
    } else {
      stageNameSelected.selectedCase = parseInt(event.target.value);
      this.setState({
        stageNameSelected,
        testText: '',
        resultsTestQuery: '',
        modifiedQuery: false,
        goodQuery: true
      });
    }
  };

  chargueSample = value => {
    let querySample = '';
    const { stageNameSelected } = this.state;
    switch (stageNameSelected.datos[value].label) {
      case 'PRC-COUNT-QUERY':
        querySample = messages.sample_querys.prc;
        break;
      case 'PCC-COUNT-QUERY':
        querySample = messages.sample_querys.pcc;
        break;
      case 'APP-HEALTH-QUERY':
        querySample = messages.sample_querys.app;
        break;
      case 'FRT-HEALTH-QUERY':
        querySample = messages.sample_querys.frt;
        break;
      case 'SYN-CHECK-QUERY':
        querySample = messages.sample_querys.syn;
        break;
      case 'WORKLOAD-QUERY':
        querySample = messages.sample_querys.wld;
        break;
    }
    if (stageNameSelected.selectedCase) {
      stageNameSelected.datos[
        stageNameSelected.selectedCase
      ].query_body = querySample;
    } else {
      stageNameSelected.datos[0].query_body = querySample;
    }
    this.setState({
      testText: '',
      resultsTestQuery: '',
      stageNameSelected
    });
  };

  testQuery = async (query, value) => {
    this.setState({ testingNow: true });
    const { stageNameSelected } = this.state;
    const type = stageNameSelected.datos[value].label;
    const accountID = stageNameSelected.datos[value].accountID;
    const { testText, goodQuery } = await this.validationQuery.validateQuery(
      type,
      query,
      accountID
    );
    let results = '';
    // if (goodQuery) {
    const data = await this.DataManager.ReadQueryResults(query, accountID);
    results = data.results;
    // }
    this.setState({
      testText,
      testingNow: false,
      modifiedQuery: false,
      goodQuery,
      resultsTestQuery: results
    });
  };

  handleChangeTexarea = query => {
    this.setState(state => {
      const { stageNameSelected } = state;
      if (stageNameSelected.selectedCase) {
        stageNameSelected.datos[
          stageNameSelected.selectedCase
        ].query_body = query;
      } else {
        stageNameSelected.datos[0].query_body = query;
      }
      if (query === '') {
        return {
          stageNameSelected,
          testText: '',
          resultsTestQuery: '',
          modifiedQuery: false,
          goodQuery: true
        };
      }
      return {
        stageNameSelected,
        testText: '',
        resultsTestQuery: '',
        modifiedQuery: true
      };
    });
  };

  handleChangeTexareaSupport = event => {
    const { supportForm } = this.state;
    supportForm.message = event.target.value;
    this.setState(supportForm);
  };

  handleChangeSubject = value => {
    const { supportForm } = this.state;
    supportForm.subject = value.label;
    this.setState(supportForm);
  };

  // se le tiene que quitar el async por q esta demas
  handleSaveUpdateQuery = async event => {
    event.preventDefault();
    await this.DataManager.UpdateTouchpointQuerys(
      this.state.stageNameSelected.touchpoint,
      this.state.stageNameSelected.datos
    );
    this.setState({ updating: false, updateBackgroundScript: true });
    this._onClose();
  };

  handleSaveUpdateTune = async ({
    min_count,
    max_count,
    min_apdex,
    max_response_time,
    max_error_percentage,
    max_avg_response_time,
    max_total_check_time,
    min_success_percentage
  }) => {
    const datos = {
      min_count: min_count,
      max_count: max_count,
      min_apdex: min_apdex,
      max_response_time: max_response_time,
      max_error_percentage: max_error_percentage,
      max_avg_response_time: max_avg_response_time,
      max_total_check_time: max_total_check_time,
      min_success_percentage: min_success_percentage
    };
    await this.DataManager.UpdateTouchpointTune(
      this.state.stageNameSelected.touchpoint,
      datos
    );
    this.setState({ updateBackgroundScript: true });
    this._onClose();
  };

  handleSaveUpdateCanary = event => {
    event.preventDefault();
    this.setState({
      showCanaryWelcomeMat: !event.target.elements.checkbox_canary.checked
    });
    this._onClose();
  };

  HandleCredentialsFormChange = event => {
    this.setState(state => {
      return {
        credentials: {
          ...state.credentials,
          [event.target.name]: event.target.value
        }
      };
    });
  };

  handleSaveUpdateGeneralConfiguration = e => {
    e.preventDefault();
    this.DataManager.SaveCredentialsInVault(this.state.credentials);
    this.DataManager.SaveGeneralConfiguration(this.state.credentials);
    this.setState(state => {
      const userApiKey = state.credentials.userAPIKey;
      const ingestLicense = state.credentials.ingestLicense;
      let formatedUserApiKey = '';
      let formatedIngestLicense = '';
      if (ingestLicense) {
        ingestLicense.split('').forEach((char, i) => {
          if (i <= 3) {
            formatedIngestLicense = `${formatedIngestLicense}${char}`;
          } else {
            formatedIngestLicense = `${formatedIngestLicense}x`;
          }
        });
      }
      if (userApiKey) {
        userApiKey.split('').forEach((char, i) => {
          if (i <= 3) {
            formatedUserApiKey = `${formatedUserApiKey}${char}`;
          } else {
            formatedUserApiKey = `${formatedUserApiKey}x`;
          }
        });
      }
      return {
        credentials: {
          ...state.credentials,
          userAPIKey: formatedUserApiKey,
          ingestLicense: formatedIngestLicense
        }
      };
    });
    this.setState(
      {
        generalConfigurationSaved: true,
        updateBackgroundScript: true
      },
      () => {
        this._onClose();
      }
    );
  };

  installUpdateBackgroundScripts = () => {
    // TODO
    this.DataManager.InstallUpdateBackGroundScript();
    this.setState({ updateBackgroundScript: false });
    this._onClose();
  };

  handleSaveUpdateFire = event => {
    event.preventDefault();
    this.setState({
      showFireWelcomeMat: !event.target.elements.checkbox_fire.checked
    });
    this._onClose();
  };

  LogoFormSubmit = async (values, _onClose) => {
    _onClose();
    this.LogoSetupData.SetLogoSetupData(values);
    this.setState({
      logoSetup: {
        ...values
      }
    });
  };

  handleSaveUpdateSupport = values => {
    const { subject, name, email, phone, message, account, company } = values;
    const datos = {
      subject: subject,
      name: name,
      email: email,
      phone: phone,
      message: message,
      account: account,
      company: company
    };
    // this.sendLogs(datos, this.state.accountId);
    CreateJiraIssue(datos, this.state.accountId);
    this._resetFormSupport();
    this._onClose();
  };

  _resetFormSupport = () => {
    const { supportForm } = this.state;
    supportForm.name = '';
    supportForm.subject = '';
    supportForm.email = '';
    supportForm.phone = '';
    supportForm.message = '';
    this.setState({ supportForm });
  };

  openLeftMenu = () => {
    const { backdrop, showLeftPanel } = this.state;
    this.setState({
      backdrop: !backdrop,
      showLeftPanel: !showLeftPanel,
      MenuRightDefault: 0
    });
  };

  _onCloseBackdrop = () => {
    this.setState({
      backdrop: false,
      showLeftPanel: false,
      MenuRightDefault: 0
    });
  };

  _handleClickSetup = () => {
    this._onCloseBackdrop();
    this.openModalParent('null', 4);
  };

  _handleClickProcesses = () => {
    this._onCloseBackdrop();
    this.openModalParent('null', 9);
  };

  _handleClickProcesses2 = () => {
    this._onCloseBackdrop();
    this.openModalParent('null', 11);
  };

  _handleClickSupport = () => {
    this._onCloseBackdrop();
    this.openModalParent('null', 5);
  };

  HandleChangeLogo = () => {
    this._onCloseBackdrop();
    this.openModalParent('null', 10);
  };

  _handleContextMenuGout = event => {
    if (event.button === 2) {
      const values = this.DataManager.GetGoutParameters();
      this.setState({
        backdrop: true,
        showRightPanel: true,
        MenuRightDefault: 1,
        dropForm: values
      });
    }
  };

  _handleContextMenuStar = event => {
    if (event.button === 2) {
      this.setState({
        backdrop: true,
        showRightPanel: true,
        MenuRightDefault: 2
      });
    }
  };

  _handleContextMenuFire = event => {
    if (event.button === 2) {
      const values = this.DataManager.GetHistoricParameters();
      this.setState({
        flameForm: values,
        backdrop: true,
        showRightPanel: true,
        MenuRightDefault: 3
      });
    }
  };

  _onCloseMenuRight = () => {
    const { MenuRightDefault, flameForm, dropForm } = this.state;
    this.setState({
      backdrop: false,
      showRightPanel: false,
      MenuRightDefault: 0,
      showLeftPanel: false
    });
    if (MenuRightDefault === 3) {
      this.DataManager.UpdateHistoricParameters(
        flameForm.hours,
        flameForm.percentage
      );
    }
    if (MenuRightDefault === 2) {
      // TO-DO
    }
    if (MenuRightDefault === 1) {
      this.DataManager.UpdateGoutParameters(dropForm);
    }
  };

  _DropHandleChange = event => {
    const key = event.target.name;
    const { dropForm } = this.state;
    dropForm[key] = event.target.value;
    this.setState(dropForm);
  };

  _StarHandleChange = event => {
    const key = event.target.name;
    const { starForm } = this.state;
    starForm[key] = event.target.value;
    this.setState(starForm);
  };

  _FlameHandleChange = event => {
    const key = event.target.name;
    const { flameForm } = this.state;
    flameForm[key] = event.target.value;
    this.setState(flameForm);
  };

  GetCurrentConfigurationJSON = () => {
    const data = this.DataManager.GetCurrentConfigurationJSON();
    return data;
  };

  SetConfigurationJSON = payload => {
    const data = this.DataManager.SetConfigurationJSON(payload);
    this.setState({
      stages: data.stages,
      kpis: data.kpis ?? [],
      updateBackgroundScript: true
    });
  };

  GetCurrentHistoricErrorScript = () => {
    const data = this.DataManager.GetCurrentHistoricErrorScript();
    return data;
  };

  FormatMoney = (
    amount,
    DisplayConsole,
    decimalCount = 2,
    decimal = '.',
    thousands = ','
  ) => {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
      const i = parseInt(
        (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
      ).toString();
      const j = i.length > 3 ? i.length % 3 : 0;
      return `${amount < 0 ? '-' : ''}$${
        j ? i.substr(0, j) + thousands : ''
      }${i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${thousands}`)}${
        decimalCount
          ? decimal +
            Math.abs(amount - i)
              .toFixed(decimalCount)
              .slice(2)
          : ''
      }`;
    } catch (e) {
      DisplayConsole('error', `Error in format money ${e}`);
    }
  };

  DisplayConsole = (type, message) => {
    switch (type) {
      case 'error':
        logger.error(`${message}`);
        break;
      case 'log':
        logger.log(`${message}`);
        break;
      default:
        logger.warn(`${message}`);
        break;
    }
  };

  changeTimeRangeKpi = ({ value }, index) => {
    this.setState(
      { timeRangeKpi: { index: index, range: value } },
      this.updateDataNow
    );
  };

  updateDataKpisChecked = kpis => {
    this.DataManager.SaveKpisSelection(kpis);
    this.setState({ kpis });
  };

  resetCredentials = () => {
    this.DataManager.ResetCredentialsInVault();
    this.DataManager.SaveGeneralConfiguration({
      loggin: false,
      flameTools: false,
      dropTools: false
    });
    document.getElementById('logginCheck').checked = false;
    document.getElementById('flameToolsCheck').checked = false;
    document.getElementById('dropToolsCheck').checked = false;
    this.setState(state => {
      return {
        generalConfigurationSaved: true,
        credentials: {
          accountId: state.accountId,
          ingestLicense: '',
          userAPIKey: '',
          dropTools: false,
          flameTools: false,
          loggin: false
        }
      };
    });
  };

  ValidateIngestLicense = async license => {
    if (license && license !== '') {
      this.setState(
        {
          disableGeneralConfigurationSubmit: true
        },
        async () => {
          const valid = await this.DataManager.ValidateIngestLicense(license);
          this.setState(state => {
            return {
              disableGeneralConfigurationSubmit: false,
              licenseValidations: {
                ...state.licenseValidations,
                ingestLicense: valid
              }
            };
          });
        }
      );
    } else {
      this.setState(state => {
        return {
          disableGeneralConfigurationSubmit: false,
          licenseValidations: {
            ...state.licenseValidations,
            ingestLicense: true
          }
        };
      });
    }
  };

  ValidateUserApiKey = async userApiKey => {
    if (userApiKey && userApiKey !== '') {
      this.setState(
        {
          disableGeneralConfigurationSubmit: true
        },
        async () => {
          const valid = await this.DataManager.ValidateUserApiKey(userApiKey);
          this.setState(state => {
            return {
              disableGeneralConfigurationSubmit: false,
              licenseValidations: {
                ...state.licenseValidations,
                userApiKey: valid
              }
            };
          });
        }
      );
    } else {
      this.setState(state => {
        return {
          disableGeneralConfigurationSubmit: false,
          licenseValidations: {
            ...state.licenseValidations,
            userApiKey: true
          }
        };
      });
    }
  };

  ToggleEnableSubmit = param => {
    this.setState({
      disableGeneralConfigurationSubmit: param
    });
  };

  render() {
    const {
      stages,
      iconCanaryStatus,
      iconFireStatus,
      iconStartStatus,
      hidden,
      checkMoney,
      stageNameSelected,
      viewModal,
      city,
      iconGoutStatus,
      loading,
      colors,
      tune,
      checkAllStatus,
      visible,
      idVisible,
      version,
      showLeftPanel,
      supportForm,
      dropForm,
      starForm,
      flameForm,
      testText,
      testingNow,
      resultsTestQuery,
      goodQuery,
      modifiedQuery,
      totalContainers,
      // KPI Properties
      timeRangeKpi,
      kpis,
      accountIDs,
      accountId,
      credentials
    } = this.state;
    if (this.state.waiting) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <div className="corazon">
            <img src={logoNewRelic} height="76px" width="94px" />
          </div>
          <div style={{ paddingTop: '20px', fontSize: '30px' }}>Pathpoint</div>
          <div style={{ marginTop: '15px' }}>
            <img src={loadin} />
          </div>
        </div>
      );
    } else {
      return (
        <div style={mainContainerStyle()} className="mainContainer">
          <div>
            <Header
              changeTimeRange={this.changeTimeRange}
              checkMoney={checkMoney}
              iconStartStatus={iconStartStatus}
              iconFireStatus={iconFireStatus}
              iconCanaryStatus={iconCanaryStatus}
              iconGoutStatus={iconGoutStatus}
              loading={loading}
              showLeftPanel={showLeftPanel}
              openLeftMenu={this.openLeftMenu}
              handleContextMenuGout={this._handleContextMenuGout}
              handleContextMenuStar={this._handleContextMenuStar}
              handleContextMenuFire={this._handleContextMenuFire}
              logoSetup={this.state.logoSetup}
              ToggleHeaderButtons={this.ToggleHeaderButtons}
              // KPI properties
              changeTimeRangeKpi={this.changeTimeRangeKpi}
              timeRangeKpi={timeRangeKpi}
              kpis={kpis}
              accountId={
                credentials.accountId ? credentials.accountId : accountId
              }
              updateDataKpisChecked={this.updateDataKpisChecked}
              credentials={credentials}
            />
          </div>
          <div
            style={contentContainerStyle(stages.length)}
            className="contentContainer"
            onClick={this._onCloseBackdropTouch}
          >
            <div
              onClick={this._onCloseBackdrop}
              className="fade modal-backdrop in"
              style={{
                display: this.state.backdrop === false ? 'none' : 'block',
                marginTop: '50px'
              }}
            >
              {' '}
            </div>
            <div
              className={
                this.state.showLeftPanel === false
                  ? 'menuLeftClose'
                  : 'menuLeft fadeInLeft'
              }
            >
              <ul className="vertical">
                <div className="setup">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '20%',
                      width: '100%'
                    }}
                  >
                    <img
                      src={setup}
                      height="14"
                      style={{ marginRight: '5px' }}
                    />
                    Setup
                  </div>
                  <div style={{ paddingLeft: '25%', width: '100%' }}>
                    <div
                      className="subItem"
                      onClick={this._handleClickSetup}
                      style={{ padding: '5px' }}
                    >
                      Json configuration
                    </div>
                    {/* <div
                      className="subItem"
                      onClick={this._handleClickProcesses2}
                      style={{ padding: '5px' }}
                    >
                      Background processes
                    </div> */}
                    <div
                      className="subItem"
                      onClick={this._handleClickProcesses}
                      style={{ padding: '5px' }}
                    >
                      Credentials and General Configuration
                    </div>
                  </div>
                </div>
                <li onClick={this._handleClickSupport}>
                  <img
                    src={support}
                    height="14"
                    style={{ marginRight: '5px' }}
                  />
                  Support
                </li>
                <li onClick={this.HandleChangeLogo}>
                  <img
                    src={logo_icon}
                    height="14"
                    style={{ marginRight: '5px' }}
                  />
                  Logo
                </li>
              </ul>
              <div className="version">v.{version}</div>
            </div>

            <div
              className={
                this.state.MenuRightDefault === 1
                  ? 'menuRight fadeInRight'
                  : 'menuLeftClose'
              }
            >
              <div className="container_rmenu">
                <div className="content_rmenu">
                  <div className="col1_rmenu">
                    <img
                      src={gout_icon}
                      height="13px"
                      width="10px"
                      style={{ paddingBottom: '2px' }}
                    />
                    <span className="title_rmenu">Drop</span>
                    <span className="subtitle_rmenu">Tunning</span>
                  </div>
                  <div className="col2_rmenu">
                    {' '}
                    <img
                      src={right_icon}
                      height="18px"
                      width="18px"
                      style={{ cursor: 'pointer' }}
                      onClick={this._onCloseMenuRight}
                    />{' '}
                  </div>
                </div>
                <div className="content_rmenu">
                  <div className="col3_rmenu">
                    <div className="subTitleRight_container">
                      <input
                        id="dropmoney"
                        name="dropmoney"
                        type="text"
                        value={dropForm.dropmoney}
                        onChange={this._DropHandleChange}
                        className="input_mrw"
                      />
                      $
                    </div>
                    <div className="subTitleRight_container">
                      average order value
                    </div>
                    <div className="subTitle_container">In the last </div>
                    <div className="subTitleRight_container add50height">
                      <input
                        id="hours"
                        name="hours"
                        type="text"
                        value={dropForm.hours}
                        onChange={this._DropHandleChange}
                        className="input_mr"
                      />
                      Hours
                    </div>

                    <div className="subTitle_container">Highlight </div>
                    <div className="subTitleRight_container">
                      <input
                        id="percentage"
                        name="percentage"
                        type="text"
                        value={dropForm.percentage}
                        onChange={this._DropHandleChange}
                        className="input_mr"
                      />{' '}
                      %{' '}
                    </div>
                    <div className="subTitleRight_container">
                      of the Steps with most Drops
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={
                this.state.MenuRightDefault === 2
                  ? 'menuRight fadeInRight'
                  : 'menuLeftClose'
              }
            >
              <div className="container_rmenu">
                <div className="content_rmenu">
                  <div className="col1_rmenu">
                    <img
                      src={star_icon}
                      height="13px"
                      width="10px"
                      style={{ paddingBottom: '2px' }}
                    />
                    <span className="title_rmenu">Star</span>
                    <span className="subtitle_rmenu">Tunning</span>
                  </div>
                  <div className="col2_rmenu">
                    {' '}
                    <img
                      src={right_icon}
                      height="18px"
                      width="18px"
                      style={{ cursor: 'pointer' }}
                      onClick={this._onCloseMenuRight}
                    />{' '}
                  </div>
                </div>
                <div className="col3_rmenu">
                  <div className="subTitleBlack_container add50height">
                    YYY-YYYYY
                  </div>
                  <div className="subTitleRight_container add40height">
                    <input
                      id="starHours"
                      name="starHours"
                      type="text"
                      value={starForm.starHours}
                      onChange={this._StarHandleChange}
                      className="input_mr"
                    />
                    Hours
                  </div>
                  <div className="subTitleRight_container add40height">
                    <input
                      id="starTraffic"
                      name="starTraffic"
                      type="text"
                      value={starForm.starTraffic}
                      onChange={this._StarHandleChange}
                      className="input_mr"
                    />
                    Traffic
                  </div>
                  <div className="subTitleRight_container add40height">
                    <input
                      id="starCongestion"
                      name="starCongestion"
                      type="text"
                      value={starForm.starCongestion}
                      onChange={this._StarHandleChange}
                      className="input_mr"
                    />
                    Congestion
                  </div>
                  <div className="subTitleRight_container add40height">
                    <input
                      id="starTransactions"
                      name="starTransactions"
                      type="text"
                      value={starForm.starTransactions}
                      onChange={this._StarHandleChange}
                      className="input_mr"
                    />
                    Transactions
                  </div>
                </div>
              </div>
            </div>

            <div
              className={
                this.state.MenuRightDefault === 3
                  ? 'menuRight fadeInRight'
                  : 'menuLeftClose'
              }
            >
              <div className="container_rmenu">
                <div className="content_rmenu">
                  <div className="col1_rmenu">
                    <img
                      src={flame_icon}
                      height="13px"
                      width="10px"
                      style={{ paddingBottom: '2px' }}
                    />
                    <span className="title_rmenu">Flame</span>
                    <span className="subtitle_rmenu">Tunning</span>
                  </div>
                  <div className="col2_rmenu">
                    {' '}
                    <img
                      src={right_icon}
                      height="18px"
                      width="18px"
                      style={{ cursor: 'pointer' }}
                      onClick={this._onCloseMenuRight}
                    />{' '}
                  </div>
                </div>
                <div className="content_rmenu">
                  <div className="col3_rmenu">
                    <div className="subTitle_container">In the last </div>
                    <div className="subTitleRight_container add50height">
                      <input
                        id="hours"
                        name="hours"
                        type="text"
                        value={flameForm.hours}
                        onChange={this._FlameHandleChange}
                        className="input_mr"
                      />
                      Hours
                    </div>

                    <div className="subTitle_container">Highlight </div>
                    <div className="subTitleRight_container">
                      <input
                        id="percentage"
                        name="percentage"
                        type="text"
                        value={flameForm.percentage}
                        onChange={this._FlameHandleChange}
                        className="input_mr"
                      />{' '}
                      %{' '}
                    </div>
                    <div className="subTitleRight_container">
                      of the most problematic touchpoints{' '}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="title">
              Stages
              <Tooltip width="900" bottom>
                <TooltipStages />
              </Tooltip>
            </div>
            <div style={contentStyle(stages.length)}>
              {stages.map(element => (
                <div
                  key={element.index}
                  style={mainColumn(
                    element.active_dotted,
                    element.active_dotted_color
                  )}
                >
                  <Stage stage={element} onClickStage={this.onClickStage} />
                </div>
              ))}
            </div>

            <div
              style={contentStyle(stages.length)}
              className="mainContainerSteps"
            >
              <div className="mainContainerSteps__title">
                Steps
                <Tooltip width="800" bottom>
                  <TooltipSteps />
                </Tooltip>
              </div>
              {stages.map((element, key) => {
                return (
                  key !== 0 && (
                    <div
                      style={mainColumn(
                        element.active_dotted,
                        element.active_dotted_color,
                        key
                      )}
                      key={element.title}
                    />
                  )
                );
              })}
            </div>
            <div style={contentStyle(stages.length)}>
              {stages.map(element => {
                return (
                  <div key={element.title}>
                    <div
                      style={mainColumn(
                        element.active_dotted,
                        element.active_dotted_color
                      )}
                    >
                      {element.money_enabled |
                      iconGoutStatus |
                      iconFireStatus ? (
                        <div>
                          {this.renderContentAboveStep(
                            element.money_enabled,
                            iconGoutStatus,
                            iconFireStatus,
                            element
                          )}
                          <div className="stepColumn" style={{ width: '100%' }}>
                            <StepContainer
                              steps={element.steps}
                              latencyStatus={element.latencyStatus}
                              onclickStep={this.onclickStep}
                              iconGoutStatus={iconGoutStatus}
                              iconCanaryStatus={iconCanaryStatus}
                              colors={colors}
                              iconFireStatus={iconFireStatus}
                              totalContainers={totalContainers}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="stepColumn">
                          <StepContainer
                            steps={element.steps}
                            latencyStatus={element.latencyStatus}
                            title={element.title}
                            onclickStep={this.onclickStep}
                            iconGoutStatus={iconGoutStatus}
                            iconCanaryStatus={iconCanaryStatus}
                            colors={colors}
                            iconFireStatus={iconFireStatus}
                            totalContainers={totalContainers}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={contentStyle(stages.length)}
              className="mainContainerTouchPoints"
            >
              <div className="mainContainerTouchPoints__title">
                TouchPoints
                <Tooltip width="800" top>
                  <TooltipTouchPoints />
                </Tooltip>
                <span className="touchPointCheckbox">
                  <input
                    type="Checkbox"
                    onChange={event => this.changeTouchpointsView(event)}
                  />
                  <label className="checkboxLabel">view all</label>
                </span>
              </div>
              {stages.map((element, key) => {
                return (
                  key !== 0 && (
                    <div
                      style={mainColumn(
                        element.active_dotted,
                        element.active_dotted_color
                      )}
                      key={element.title}
                    />
                  )
                );
              })}
            </div>

            <div style={contentStyle(stages.length)}>
              {stages.map(element => {
                return (
                  <div key={element.title}>
                    <div
                      style={mainColumn(
                        element.active_dotted,
                        element.active_dotted_color
                      )}
                    >
                      <TouchPointContainer
                        visible={visible}
                        idVisible={idVisible}
                        renderProps={this.renderProps}
                        touchpoints={element.touchpoints}
                        city={city}
                        colors={colors}
                        iconFireStatus={iconFireStatus}
                        checkAllStatus={checkAllStatus}
                        openModalParent={this.openModalParent}
                        updateTouchpointOnOff={this.updateTouchpointOnOff}
                        iconCanaryStatus={iconCanaryStatus}
                        tune={tune}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Modal
            errorsList={this.state.errorsList}
            configuration={this.state.configuration}
            hidden={hidden}
            _onClose={this._onClose}
            stageNameSelected={stageNameSelected}
            viewModal={viewModal}
            testText={testText}
            testingNow={testingNow}
            resultsTestQuery={resultsTestQuery}
            goodQuery={goodQuery}
            changeMessage={this.changeMessage}
            chargueSample={this.chargueSample}
            testQuery={this.testQuery}
            handleChangeTexarea={this.handleChangeTexarea}
            handleSaveUpdateQuery={this.handleSaveUpdateQuery}
            handleSaveUpdateTune={this.handleSaveUpdateTune}
            supportForm={supportForm}
            handleChangeTexareaSupport={this.handleChangeTexareaSupport}
            changeSubject={this.handleChangeSubject}
            handleSaveUpdateSupport={this.handleSaveUpdateSupport}
            handleSaveUpdateCanary={this.handleSaveUpdateCanary}
            handleSaveUpdateFire={this.handleSaveUpdateFire}
            LogoFormSubmit={this.LogoFormSubmit}
            validateKpiQuery={this.validationQuery}
            GetCurrentConfigurationJSON={this.GetCurrentConfigurationJSON}
            SetConfigurationJSON={this.SetConfigurationJSON}
            GetCurrentHistoricErrorScript={this.GetCurrentHistoricErrorScript}
            modifiedQuery={modifiedQuery}
            accountIDs={accountIDs}
            HandleCredentialsFormChange={this.HandleCredentialsFormChange}
            credentialsData={this.state.credentials}
            disableGeneralConfigurationSubmit={
              this.state.disableGeneralConfigurationSubmit
            }
            licenseValidations={this.state.licenseValidations}
            resetCredentials={this.resetCredentials}
            ValidateIngestLicense={this.ValidateIngestLicense}
            ValidateUserApiKey={this.ValidateUserApiKey}
            ToggleEnableSubmit={this.ToggleEnableSubmit}
            handleSaveUpdateGeneralConfiguration={
              this.handleSaveUpdateGeneralConfiguration
            }
            installUpdateBackgroundScripts={this.installUpdateBackgroundScripts}
          />
          <div id="cover-spin" style={{ display: loading ? '' : 'none' }} />
        </div>
      );
    }
  }
}
