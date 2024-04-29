// IMPORT LIBRARIES AND DEPENDENCIES
import React from 'react';
import { nerdlet, logger, UserQuery } from 'nr1';
import Setup from '../../config/setup.json';
import messages from '../../config/messages.json';
import {
  mainContainerStyle,
  contentStyle,
  contentContainerStyle,
  mainColumn
} from './stylesFuntion';
import shortid from 'shortid';

// IMPORT CONTAINERS AND COMPONENTS
import TouchPointContainer from '../TouchPointContainer/TouchPointContainer.js';
import StepContainer from '../StepContainer/StepContainer.js';
import Stage from '../../components/Stage/Stage.js';
import Header from '../../components/Header/Header.js';
import Modal from '../../components/Modal';

// IMPORT SERVICES
import DataManager from '../../services/DataManager';
import ValidationQuery from '../../services/Validations.js';
import LogoSetupData from '../../services/LogoSetupData';
import { CreateJiraIssue } from '../../services/JiraConnector';
import InterfaceEditor from '../../services/InterfaceEditor';
import InterfaceMigration from '../../services/InterfaceMigration';

// IMPORT STATIC FILES AND IMAGES
import logoNewRelic from '../../images/logoNewRelic.svg';
import loadin from '../../images/Loading.gif';
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
import iconInformation from '../../images/information.svg';
import onIcon from '../../images/icon-on.svg';
import offIcon from '../../images/icon-off.svg';
import setup_icon from '../../images/setup.svg';

import LensPage from './LensPage';

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
    this.InterfaceEditor = null;
    this.InterfaceMigration = null;
    this.state = {
      useEmulator: false,
      accountName: 'HPE IT Operations',
      username: '',
      guiEditor: false,
      jsonMetaData: {
        description: '',
        note: ''
      },
      stagesInterface: null,
      currentHistoricSelected: null,
      updating: false,
      queryModalShowing: false,
      updateBackgroundScript: false,
      generalConfigurationSaved: false,
      disableGeneralConfigurationSubmit: false,
      JSONModal: {
        view: 0,
        historic: []
      },
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
        range: 'TODAY'
      },
      kpis: [],
      accountIDs: [],
      accountId: 0,
      credentialsBackup: false,
      sendingLogsEnableDisable: true,
      configurationOptionSelected: 'download',
      fileName: null,
      fileNote: null,
      showMessageInformationStage: false,
      showMessageInformationStep: false,
      showMessageInformationTouchpoint: false,
      alertsTimeWindow: 10,
      alertsRefreshDelay: 5,
      iconLensStatus: false,
      lensForm: {
        error: true,
        response: true,
        duration: true,
        durationMin: 7,
        status: 'disable'
      },
      UAMAccessKeys: [
        'sacaro0159',
        'Gr#xt0IUzu',
        'ac!Ij@81fY',
        'emd!XR6Sm0',
        'I73eA#Cyv1',
        '!ajkTQ!1Gi',
        'uDPSL1@SGf',
        '2n!18UBbGT',
        '@Bg@9nc3FY',
        'p1sz!Uc70m',
        'Sg1uUC#0X0'
      ],
      UAMModal: {
        view: 0,
        continueButton: false,
        showKeyError: false,
        ingestUAMkey: ''
      },
      accessToConfig: false,
      showMouseOver: false
    };
  }

  // =========================================================== UPDATE DATA API
  componentDidMount() {
    this.BoootstrapApplication();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.updating &&
      !this.state.updating &&
      this.state.pending &&
      this.state.loading
    ) {
      this.ExecuteUpdateData(true);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  BoootstrapApplication = async () => {
    const { useEmulator, lensForm } = this.state;
    this.DataManager = new DataManager(useEmulator);
    const { accountName } = this.state;
    const data = await this.DataManager.BootstrapInitialData(accountName);
    let credentials = {};
    if (data && data.credentials && data.credentials.ingestLicense) {
      const item = data.credentials.ingestLicense;
      let value = '';
      if (item !== '_') {
        item.split('').forEach((char, i) => {
          if (i <= 3) {
            value = `${value}${char}`;
          } else {
            value = `${value}x`;
          }
        });
      }
      credentials.ingestLicense = value;
    }
    if (data && data.credentials && data.credentials.userAPIKey) {
      const item = data.credentials.userAPIKey;
      let value = '';
      if (item !== '_') {
        item.split('').forEach((char, i) => {
          if (i <= 3) {
            value = `${value}${char}`;
          } else {
            value = `${value}x`;
          }
        });
      }
      credentials.userAPIKey = value;
    }
    if (data && data.generalConfiguration) {
      credentials = {
        ...credentials,
        ...data.generalConfiguration
      };
    }
    const userAccessInfo = await this.DataManager.GetUserAccessInfo();
    const user = await UserQuery.query();
    let accessToConfig = false;
    if (userAccessInfo && userAccessInfo.constructor.name === 'Array') {
      const validAccess = userAccessInfo.find(
        item => item.email === user.data.email
      );
      if (validAccess) {
        accessToConfig = true;
      }
    }
    this.setState(
      {
        stages: data ? data.stages : [],
        colors: data ? data.colors : [],
        version: data ? data.version : '',
        accountId: data ? data.accountId : 0,
        kpis: data ? data.kpis : [],
        totalContainers: data ? data.totalContainers : 1,
        accountIDs: data ? data.accountIDs : [],
        credentials,
        credentialsBackup: credentials,
        alertsRefreshDelay: data ? data.alertsRefreshDelay : 5,
        alertsTimeWindow: data ? data.alertsTimeWindow : 10,
        accessToConfig,
        lensForm: data ? data.lensForm : lensForm,
        iconLensStatus: !!(data && data.lensForm.status === 'enable')
      },
      async () => {
        this.validationQuery = new ValidationQuery(this.state.accountId);
        this.InitLogoSetupData(this.state.accountId);
        this.InitInterfaceEditor(this.state.accountId);
        this.InterfaceMigration = new InterfaceMigration(this.state.accountId);
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
    const {
      updating,
      queryModalShowing,
      alertsTimeWindow,
      alertsRefreshDelay
    } = this.state;
    if (!updating && !queryModalShowing) {
      this.setState(
        {
          updating: true
        },
        async () => {
          const {
            timeRange,
            city,
            stages,
            kpis,
            timeRangeKpi,
            lensForm
          } = this.state;
          const data = await this.DataManager.UpdateData(
            timeRange,
            city,
            stages,
            kpis,
            timeRangeKpi,
            alertsTimeWindow,
            alertsRefreshDelay,
            lensForm
          );
          this.setState(
            {
              stages: data ? data.stages : [],
              kpis: data ? data.kpis : [],
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
      loading: true
    });
    const { updating } = this.state;
    if (updating) {
      setTimeout(() => {
        this.updateDataNow();
      }, 1000);
    } else {
      this.ExecuteUpdateData(true);
    }
  }

  // ===========================================================
  ToggleLensButton = async () => {
    const { iconLensStatus, lensForm } = this.state;
    let newIconstatus = false;
    if (!iconLensStatus) {
      lensForm.status = 'enable';
      // console.log('LENS-ENABLE');
      newIconstatus = true;
    } else {
      // console.log('LENS-DISABLE');
      lensForm.status = 'disable';
    }
    await this.DataManager.SetLensFormValues(lensForm);
    this.setState({
      lensForm,
      iconLensStatus: newIconstatus
    });
  };

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

  InitInterfaceEditor = async accountId => {
    this.InterfaceEditor = new InterfaceEditor(accountId);
    const stages = await this.InterfaceEditor.GetStagesInterface();
    let stagesInterface = null;
    if (stages) {
      stagesInterface = [];
      Object.keys(stages).forEach(key => {
        stagesInterface.push({
          ...stages[key]
        });
      });
    }
    if (stagesInterface) {
      this.setState({
        stagesInterface
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
    this.setState({
      hidden: !actualValue,
      queryModalShowing: false
    });
    if (this.state.JSONModal.view !== 0) {
      this.setState({
        JSONModal: {
          view: 0
        }
      });
    }
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
        stages: data ? data.stages : []
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
            stages: data ? data.stages : []
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
          stages: data ? data.stages : []
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

  updateTouchpointOnOff = async touchpoint => {
    if (!this.state.iconCanaryStatus) {
      this.updateTouchpointStageOnOff(touchpoint);
      this.DataManager.UpdateTouchpointOnOff(touchpoint, true);
      const stagesInterface = await this.UpdateStagesEditor();
      this.setState({
        stagesInterface
      });
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

  renderProps = async (idVisible, touchActive) => {
    const { visible } = this.state;
    this.setState({ visible: !visible, idVisible: idVisible });
    this.restoreTouchPoints();
    if (!visible) {
      touchActive.active = true;
    }
  };

  renderMouseOver = showMouseOver => {
    // console.log('Mouse-OVER:', showMouseOver);
    this.setState({ showMouseOver });
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
      case 'Person-Count':
        querySample = messages.sample_querys.prc;
        break;
      case 'Process-Count':
        querySample = messages.sample_querys.pcc;
        break;
      case 'Application-Performance':
        querySample = messages.sample_querys.app;
        break;
      case 'FrontEnd-Performance':
        querySample = messages.sample_querys.frt;
        break;
      case 'Synthetics-Check':
        querySample = messages.sample_querys.syn;
        break;
      case 'Workload-Status':
        querySample = messages.sample_querys.wld;
        break;
      case 'Drops-Count':
        querySample = messages.sample_querys.drp;
        break;
      case 'API-Performance':
        querySample = messages.sample_querys.api;
        break;
      case 'API-Count':
        querySample = messages.sample_querys.apc;
        break;
      case 'API-Status':
        querySample = messages.sample_querys.aps;
        break;
      case 'Alert-Check':
        querySample = messages.sample_querys.ale;
        break;
      case 'Value-Performance':
        querySample = messages.sample_querys.val;
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
      query
        .replace(/\r?\n|\r/g, ' ')
        .split('\\')
        .join('\\\\'),
      accountID
    );
    const data = await this.DataManager.ReadQueryResults(query, accountID);
    const ifUndefined = {
      error: 'Syntax Error: Unterminated string.'
    };
    const results = data.results ? data.results : ifUndefined;
    this.setState({
      testText,
      testingNow: false,
      modifiedQuery: false,
      goodQuery,
      resultsTestQuery: results
    });
  };

  timeRangeTransform = () => {
    const timeRangeTransform = this.DataManager.TimeRangeTransform(
      this.state.timeRange
    );
    return timeRangeTransform;
  };

  EditorValidateQuery = async (type, query, accountID) => {
    const { testText, goodQuery } = await this.validationQuery.validateQuery(
      type,
      query
        .replace(/\r?\n|\r/g, ' ')
        .split('\\')
        .join('\\\\'),
      accountID
    );
    const ifUndefined = {
      error: 'Syntax Error: Unterminated string.'
    };
    const data = await this.DataManager.ReadQueryResults(query, accountID);
    const results = data.results ? data.results : ifUndefined;
    return {
      testText,
      goodQuery,
      testQueryValue: results
    };
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
    this.DataManager.UpdateTouchpointQuerys(
      this.state.stageNameSelected.touchpoint,
      this.state.stageNameSelected.datos
    );
    this.DataManager.SendToLogs({
      action: 'update-query-configuration',
      set_data: {
        ...this.state.stageNameSelected.touchpoint,
        ...this.state.stageNameSelected.datos
      }
    });
    const stagesInterface = await this.UpdateStagesEditor();
    this.setState({
      updating: false,
      updateBackgroundScript: true,
      stagesInterface
    });
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
    min_success_percentage,
    max_value
  }) => {
    const datos = {
      min_count: min_count,
      max_count: max_count,
      min_apdex: min_apdex,
      max_response_time: max_response_time,
      max_error_percentage: max_error_percentage,
      max_avg_response_time: max_avg_response_time,
      max_total_check_time: max_total_check_time,
      min_success_percentage: min_success_percentage,
      max_value: max_value
    };
    await this.DataManager.UpdateTouchpointTune(
      this.state.stageNameSelected.touchpoint,
      datos
    );
    this.DataManager.SendToLogs({
      action: 'update-tune-configuration',
      set_data: {
        ...this.state.stageNameSelected.touchpoint,
        ...datos
      }
    });
    const stagesInterface = await this.UpdateStagesEditor();
    this.setState({ updateBackgroundScript: true, stagesInterface });
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

  MaskCredentials(credentials) {
    const maskCerdentials = { ...credentials };
    maskCerdentials.ingestLicense = `${maskCerdentials.ingestLicense.substring(
      0,
      4
    )}xxxxxxxxxxxxxxxxxxxxxxxxxxxx`;
    maskCerdentials.userAPIKey = `${maskCerdentials.userAPIKey.substring(
      0,
      4
    )}xxxxxxxxxxxxxxxxxxxxxxxxxxxx`;
    return maskCerdentials;
  }

  handleSaveUpdateGeneralConfiguration = e => {
    e.preventDefault();
    this.DataManager.SendToLogs({
      action: 'save-update-credentials',
      set_data: {
        ...this.MaskCredentials(this.state.credentials)
      }
    });
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
    this.DataManager.SendToLogs({
      action: 'install-update-flame-synthetic'
    });
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
    const { lensForm } = this.state;
    this.setState({
      backdrop: false,
      iconLensStatus: lensForm.status === 'enable',
      showLeftPanel: false,
      MenuRightDefault: 0
    });
  };

  _handleClickSetup = async () => {
    const user = await UserQuery.query();
    this.setState({ username: user.data.name });
    this._onCloseBackdrop();
    this.openModalParent('null', 4);
  };

  _handleClickUAM = async () => {
    this.setState({
      UAMModal: {
        view: 0,
        continueButton: true,
        showKeyError: false,
        ingestUAMkey: ''
      }
    });
    this._onCloseBackdrop();
    this.openModalParent('null', 16);
  };

  handleContinueUAMButton = async e => {
    e.preventDefault();
    const userAccessInfo = await this.DataManager.GetUserAccessInfo();
    if (userAccessInfo.length === 0) {
      userAccessInfo.push({
        id: 1,
        name: '',
        email: ''
      });
    }
    this.setState({
      UAMModal: {
        view: 1,
        userAccessInfo
      }
    });
  };

  ToggleEnableContinueButton = param => {
    const { UAMModal } = this.state;
    const _UAMModal = {
      ...UAMModal,
      continueButton: param,
      showKeyError: false
    };
    this.setState({
      UAMModal: _UAMModal
    });
  };

  ValidateAdminKey = async ingestKey => {
    const { UAMModal, UAMAccessKeys } = this.state;
    const _UAMModal = {
      ...UAMModal,
      continueButton: true,
      showKeyError: true
    };
    if (ingestKey && ingestKey !== '') {
      if (UAMAccessKeys.includes(ingestKey)) {
        _UAMModal.continueButton = false;
        _UAMModal.showKeyError = false;
      }
    }
    this.setState({
      UAMModal: _UAMModal
    });
  };

  HandleUAMkeyFormChange = event => {
    const { UAMAccessKeys } = this.state;
    let continueButton = true;
    if (UAMAccessKeys.includes(event.target.value)) {
      continueButton = false;
    }
    this.setState(state => {
      return {
        UAMModal: {
          ...state.UAMModal,
          [event.target.name]: event.target.value,
          continueButton,
          showKeyError: false
        }
      };
    });
  };

  handleKeyEditorSubmit = async e => {
    e.preventDefault();
    const { UAMModal } = this.state;
    const user = await UserQuery.query();
    let accessToConfig = false;
    const validAccess = UAMModal.userAccessInfo.find(
      item => item.email === user.data.email
    );
    if (validAccess) {
      accessToConfig = true;
      this.DataManager.SendToLogs({
        action: 'uam-admin-key-update'
      });
    }
    this.setState({
      accessToConfig
    });
    this.DataManager.SetUserAccessInfo(UAMModal.userAccessInfo);
    this._onClose();
  };

  HandleOnChange = (target, value, id) => {
    this.setState(state => {
      const UAMModal = { ...state.UAMModal };
      if (target === 'addEntry') {
        UAMModal.userAccessInfo.unshift({
          id: UAMModal.userAccessInfo.length + 1,
          name: '',
          email: ''
        });
      } else {
        const userInfo = UAMModal.userAccessInfo.find(
          element => element.id === id
        );
        userInfo[target] = value;
      }
      return {
        UAMModal
      };
    });
  };

  HandleDeleteUser = id => {
    this.setState(state => {
      const UAMModal = { ...state.UAMModal };
      const userInfo = UAMModal.userAccessInfo.findIndex(
        element => element.id === id
      );
      if (userInfo > -1) {
        UAMModal.userAccessInfo.splice(userInfo, 1);
      }
      return {
        UAMModal
      };
    });
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

  HandleOpenKPIEditor = () => {
    this._onCloseBackdrop();
    this.openModalParent('null', 15);
  };

  _handleContextMenuGout = event => {
    if (event.button === 2) {
      const values = this.DataManager.GetGoutParameters();
      const { lensForm } = this.state;
      lensForm.status = 'disable';
      this.setState({
        backdrop: true,
        lensForm,
        iconLensStatus: false,
        showRightPanel: true,
        MenuRightDefault: 1,
        dropForm: values
      });
    }
  };

  _handleContextMenuLens = async event => {
    if (event.button === 2) {
      const { lensForm } = this.state;
      const lensData = await this.DataManager.GetLensFormValues(lensForm);
      this.setState({
        lensForm: lensData,
        iconLensStatus: lensData.status === 'enable',
        backdrop: true,
        showRightPanel: true,
        MenuRightDefault: 4
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
      const { lensForm } = this.state;
      lensForm.status = 'disable';
      this.setState({
        flameForm: values,
        backdrop: true,
        lensForm,
        iconLensStatus: false,
        showRightPanel: true,
        MenuRightDefault: 3
      });
    }
  };

  _onCloseMenuRight = () => {
    const { MenuRightDefault, flameForm, dropForm, lensForm } = this.state;
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
    if (MenuRightDefault === 4) {
      this.DataManager.SetLensFormValues(lensForm);
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

  _LensHandleChange = event => {
    const key = event.target.name;
    const { lensForm } = this.state;
    if (key === 'durationMin') {
      lensForm[key] = event.target.value;
    } else {
      lensForm[key] = event.target.checked;
    }
    this.setState({
      lensForm,
      iconLensStatus: lensForm.status === 'enable'
    });
  };

  GetCurrentConfigurationJSON = () => {
    this.DataManager.SendToLogs({
      action: 'download-json-configuration'
    });
    const data = this.DataManager.GetCurrentConfigurationJSON();
    return data;
  };

  SetConfigurationJSON = async (payload, e) => {
    const data = this.DataManager.SetConfigurationJSON(payload);
    if (this.state.JSONModal.view === 0) {
      const user = await UserQuery.query();
      this.DataManager.StorageJSONDataInHistoric({
        payload,
        jsonMetaData: {
          ...this.state.jsonMetaData,
          filename: e.target.files[0].name,
          date: new Date(),
          user: user.data.name
        }
      });
      this.setState({
        jsonMetaData: {
          description: '',
          note: ''
        }
      });
    }
    const totalContainers = this.DataManager.SetTotalContainers();
    this.setState({
      stagesInterface: null,
      stages: data.stages,
      kpis: data.kpis ?? [],
      updateBackgroundScript: true,
      totalContainers
    });
  };

  GetCurrentHistoricErrorScript = () => {
    const data = this.DataManager.GetCurrentHistoricErrorScript_v2();
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
        j ? i.substring(0, j) + thousands : ''
      }${i.substring(j).replace(/(\d{3})(?=\d)/g, `$1${thousands}`)}${
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
    this.DataManager.SendToLogs({
      action: 'reset-credentials'
    });
    this.DataManager.ResetCredentialsInVault();
    this.DataManager.SaveGeneralConfiguration({
      loggin: false,
      flameTools: false,
      dropTools: false
    });
    document.getElementById('logginCheck').checked = false;
    document.getElementById('flameToolsCheck').checked = false;
    // document.getElementById('dropToolsCheck').checked = false;
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

  handleOptionConfigurationChange = configurationOptionSelected => {
    this.setState({ configurationOptionSelected });
  };

  handleFileChange = (type, value) => {
    if (type === 'name') this.setState({ fileName: value });
    else this.setState({ fileNote: value });
  };

  UpdateJSONMetaData = (name, value) => {
    this.setState(state => {
      const jsonMetaData = { ...state.jsonMetaData };
      jsonMetaData[name] = value;
      return {
        jsonMetaData
      };
    });
  };

  GetHistoricJSONData = async () => {
    const historic = await this.DataManager.GetHistoricJSONData();
    this.setState({
      JSONModal: {
        view: 1,
        historic
      }
    });
  };

  UpdateItemSelectFromHistoric = e => {
    this.setState({
      currentHistoricSelected: e.target.value
    });
  };

  ToggleGuiEditor = async () => {
    const userAccessInfo = await this.DataManager.GetUserAccessInfo();
    const user = await UserQuery.query();
    const validAccess = userAccessInfo.find(
      item => item.email === user.data.email
    );
    if (validAccess) {
      this.setState(state => {
        const guiEditor = !state.guiEditor;
        if (guiEditor) {
          this.DataManager.SendToLogs({
            action: 'enable-gui-editor'
          });
        } else {
          this.DataManager.SendToLogs({
            action: 'disable-gui-editor'
          });
        }
        return {
          guiEditor
        };
      });
    }
  };

  CreateStagesEditor = async (saveUpdate = true) => {
    let data = this.DataManager.GetCurrentConfigurationJSON(true);
    data = JSON.parse(data);
    const stagesInterface = [];
    data.stages.forEach((item, i) => {
      const id = shortid.generate();
      const steps = [];
      const touchpoints = [];
      item.steps.forEach((step, i) => {
        const stepId = shortid.generate();
        const sub_steps = [];
        step.values.forEach(value => {
          sub_steps.push({
            value: value.title
          });
        });
        steps.push({
          index: i + 1,
          id: stepId,
          sub_steps,
          visible: true
        });
      });
      item.touchpoints.forEach(tp => {
        const tpId = shortid.generate();
        const subs = [];
        tp.related_steps.split(',').forEach(related => {
          item.steps.forEach(st => {
            st.values.forEach(value => {
              if (related === value.id) {
                subs.push(value.title);
              }
            });
          });
        });
        touchpoints.push({
          id: tpId,
          title: tp.title,
          status_on_off: tp.status_on_off,
          subs,
          dashboard_url: tp.dashboard_url,
          queryData: {
            ...tp.queries[0]
          },
          visible: true
        });
      });
      this.AddingTouchpointTuneAttributes(touchpoints);
      stagesInterface.push({
        id,
        title: item.title,
        active_dotted: item.active_dotted,
        arrowMode: item.arrowMode,
        order: i + 1,
        index: i + 1,
        type: item.type,
        touchpoints,
        steps,
        visible: true
      });
    });
    if (saveUpdate) {
      await this.InterfaceEditor.SetStagesInterface(stagesInterface);
    }
    return stagesInterface;
  };

  UpdateStagesEditor = async () => {
    const { stagesInterface } = this.state;
    if (stagesInterface) {
      const currentStagesInterface = await this.CreateStagesEditor(false);
      const stagesInterfaceUpdated = this.InterfaceEditor.UpdateStagesInterface(
        stagesInterface,
        currentStagesInterface
      );
      await this.InterfaceEditor.SetStagesInterface(stagesInterfaceUpdated);
      return stagesInterfaceUpdated;
    }
    return stagesInterface;
  };

  AddingTouchpointTuneAttributes(touchpoints) {
    touchpoints.forEach(tp => {
      tp.queryData = this.InsertTuneAttributes(tp.queryData);
    });
  }

  InsertTuneAttributes(queryData) {
    let qData = {
      ...queryData
    };
    if (!Reflect.has(queryData, 'min_count')) {
      qData = {
        ...qData,
        min_count: 0
      };
    }
    if (!Reflect.has(queryData, 'max_count')) {
      qData = {
        ...qData,
        max_count: 0
      };
    }
    if (!Reflect.has(queryData, 'min_apdex')) {
      qData = {
        ...qData,
        min_apdex: 0
      };
    }
    if (!Reflect.has(queryData, 'max_response_time')) {
      qData = {
        ...qData,
        max_response_time: 0
      };
    }
    if (!Reflect.has(queryData, 'max_error_percentage')) {
      qData = {
        ...qData,
        max_error_percentage: 0
      };
    }
    if (!Reflect.has(queryData, 'min_success_percentage')) {
      qData = {
        ...qData,
        min_success_percentage: 0
      };
    }
    if (!Reflect.has(queryData, 'max_avg_response_time')) {
      qData = {
        ...qData,
        max_avg_response_time: 0
      };
    }
    if (!Reflect.has(queryData, 'max_total_check_time')) {
      qData = {
        ...qData,
        max_total_check_time: 0
      };
    }
    if (!Reflect.has(queryData, 'min_success_percentage')) {
      qData = {
        ...qData,
        min_success_percentage: 0
      };
    }
    if (!Reflect.has(queryData, 'session_count')) {
      qData = {
        ...qData,
        session_count: 0
      };
    }
    if (!Reflect.has(queryData, 'transaction_count')) {
      qData = {
        ...qData,
        transaction_count: 0
      };
    }
    if (!Reflect.has(queryData, 'apdex_value')) {
      qData = {
        ...qData,
        apdex_value: 0
      };
    }
    if (!Reflect.has(queryData, 'response_value')) {
      qData = {
        ...qData,
        response_value: 0
      };
    }
    if (!Reflect.has(queryData, 'error_percentage')) {
      qData = {
        ...qData,
        error_percentage: 0
      };
    }
    if (!Reflect.has(queryData, 'max_request_time')) {
      qData = {
        ...qData,
        max_request_time: 0
      };
    }
    if (!Reflect.has(queryData, 'max_duration')) {
      qData = {
        ...qData,
        max_duration: 0
      };
    }
    if (!Reflect.has(queryData, 'success_percentage')) {
      qData = {
        ...qData,
        success_percentage: 0
      };
    }
    if (!Reflect.has(queryData, 'api_count')) {
      qData = {
        ...qData,
        api_count: 0
      };
    }
    if (!Reflect.has(queryData, 'max_value')) {
      qData = {
        ...qData,
        max_value: 0
      };
    }
    if (!Reflect.has(queryData, 'value')) {
      qData = {
        ...qData,
        value: 0
      };
    }
    if (!Reflect.has(queryData, 'alertConditionId')) {
      qData = {
        ...qData,
        alertConditionId: []
      };
    }
    if (!Reflect.has(queryData, 'priority')) {
      qData = {
        ...qData,
        priority: ['CRITICAL']
      };
    }
    if (!Reflect.has(queryData, 'state')) {
      qData = {
        ...qData,
        state: ['ACTIVATED']
      };
    }
    return qData;
  }

  OpenGUIEditor = async viewModal => {
    const queryModalShowing = true; // DO NOT Update Data while Modals is Showing
    let { stagesInterface } = this.state;
    if (!stagesInterface) {
      stagesInterface = await this.CreateStagesEditor();
    } else if (viewModal === 14) {
      // Update current Touchpoint Values
      stagesInterface = await this.UpdateStagesEditor();
    }
    this.setState({
      stagesInterface,
      viewModal,
      hidden: true,
      queryModalShowing
    });
  };

  showInformation = (title, value) => {
    if (title === 'stage')
      this.setState({ showMessageInformationStage: value });
    if (title === 'step') this.setState({ showMessageInformationStep: value });
    if (title === 'touchpoint')
      this.setState({ showMessageInformationTouchpoint: value });
  };

  RestoreJSONFromHistoric = () => {
    const payload = this.state.JSONModal.historic[
      this.state.currentHistoricSelected
    ].payload;
    const metadata = this.state.JSONModal.historic[
      this.state.currentHistoricSelected
    ].jsonMetaData;
    this.DataManager.SendToLogs({
      action: 'restore-configuration',
      set_data: {
        ...metadata
      }
    });
    this.SetConfigurationJSON(payload);
    this._onClose();
    this.setState({
      JSONModal: {
        view: 0,
        historic: []
      }
    });
  };

  handleAlertParameterUpdate = parameter => {
    if (parameter.name === 'alertsTimeWindow') {
      this.setState({
        alertsTimeWindow: parameter.value
      });
    } else {
      this.setState({
        alertsRefreshDelay: parameter.value
      });
    }
  };

  handleStagesEditorSubmit = async stagesInterface => {
    this._onClose();
    this.setState({
      loading: true
    });
    this.setState({ stagesInterface });
    this.DataManager.SendToLogs({
      action: 'update-gui-configuration',
      set_data: {
        ...stagesInterface
      }
    });
    await this.InterfaceEditor.SetStagesInterface(stagesInterface);
    let data = this.DataManager.GetCurrentConfigurationJSON();
    data = JSON.parse(data);
    const { alertsTimeWindow, alertsRefreshDelay } = this.state;
    data.alertsTimeWindow = alertsTimeWindow;
    data.alertsRefreshDelay = alertsRefreshDelay;
    const updateData = this.InterfaceMigration.MigrateStagesInterface(
      stagesInterface,
      data
    );
    const payload = JSON.stringify(updateData);
    this.DataManager.SetConfigurationJSON(payload);
    await this.SavePayloadToHistoricConfig(payload);
    const totalContainers = this.DataManager.SetTotalContainers();
    const event = new Event('SetStagesInterfaceDone', {});
    document.dispatchEvent(event);
    this.setState({
      loading: false,
      totalContainers,
      updateBackgroundScript: true
    });
  };

  async SavePayloadToHistoricConfig(payload) {
    // console.log('UPDATE-Hadle submir');
    // FIX to SAVE all the Pathpoint Updates to historic
    const user = await UserQuery.query();
    const now = new Date();
    let hours = now.getHours();
    if (hours < 10) hours = `0${hours}`;
    let minutes = now.getMinutes();
    if (minutes < 10) minutes = `0${minutes}`;
    let seconds = now.getSeconds();
    if (seconds < 10) seconds = `0${seconds}`;
    this.DataManager.StorageJSONDataInHistoric({
      payload,
      jsonMetaData: {
        description: 'User Configuration Update',
        note: `Time : ${hours}:${minutes}:${seconds}`,
        filename: 'system update',
        date: now,
        user: user.data.name
      }
    });
  }

  handleKPIEditorUpdate = kpisUpdated => {
    this._onClose();
    this.setState({
      loading: true
    });
    let data = this.DataManager.GetCurrentConfigurationJSON();
    data = JSON.parse(data);
    const updateData = this.InterfaceMigration.MigrateKpisInterface(
      kpisUpdated,
      data
    );
    const payload = JSON.stringify(updateData);
    const newData = this.DataManager.SetConfigurationJSON(payload);
    this.SavePayloadToHistoricConfig(payload);
    const event = new Event('SetStagesInterfaceDone', {});
    document.dispatchEvent(event);
    this.setState({
      kpis: newData.kpis
    });
    setTimeout(() => {
      this.setState({
        loading: false
      });
    }, 2000);
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
      timeRange,
      accountId,
      credentials,
      configurationOptionSelected,
      fileName,
      fileNote,
      showMessageInformationStage,
      showMessageInformationStep,
      showMessageInformationTouchpoint,
      alertsTimeWindow,
      alertsRefreshDelay,
      accessToConfig,
      iconLensStatus,
      lensForm,
      showMouseOver
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
              guiEditor={this.state.guiEditor}
              HandleChangeLogo={this.HandleChangeLogo}
              HandleOpenKPIEditor={this.HandleOpenKPIEditor}
              iconLensStatus={iconLensStatus}
              ToggleLensButton={this.ToggleLensButton}
              handleContextMenuLens={this._handleContextMenuLens}
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
              <ul style={{ paddingTop: '40px' }} className="vertical">
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
                      Download Fire Script
                    </div> */}
                    <div
                      className="subItem"
                      onClick={this._handleClickProcesses}
                      style={{ padding: '5px' }}
                    >
                      Background Functions
                    </div>
                    <div
                      className="subItem"
                      onClick={() => this.ToggleGuiEditor()}
                      style={{ padding: '5px', marginBottom: '30px' }}
                    >
                      GUI Editor
                      <img
                        style={{ marginLeft: '10px' }}
                        src={this.state.guiEditor ? onIcon : offIcon}
                      />
                    </div>
                  </div>
                </div>
                <div className="setup">
                  <div className="support" onClick={this._handleClickSupport}>
                    <img
                      src={support}
                      height="14"
                      style={{ marginRight: '5px' }}
                    />
                    Support
                  </div>
                  <div style={{ paddingLeft: '25%', width: '100%' }}>
                    <div
                      className="subItem"
                      onClick={this._handleClickUAM}
                      style={{ padding: '5px' }}
                    >
                      UAM
                    </div>
                  </div>
                </div>
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
            <div
              className={
                this.state.MenuRightDefault === 4
                  ? 'menuRight fadeInRight'
                  : 'menuLeftClose'
              }
            >
              <LensPage
                lensForm={lensForm}
                CloseMenuRight={this._onCloseMenuRight}
                LensHandleChange={this._LensHandleChange}
              />
            </div>
            <div className="mainContainerTouchPoints__title">
              Stages
              {!this.state.guiEditor && (
                <a
                  href="https://github.com/newrelic/nr1-pathpoint/tree/main/docs/guides/Pathpoint-Stages#stages-guide"
                  style={{ marginLeft: '10px' }}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={iconInformation} />
                </a>
              )}
              {this.state.guiEditor && (
                <div
                  className="containerGearWheel"
                  onClick={() => this.OpenGUIEditor(12)}
                  onMouseEnter={() => this.showInformation('stage', true)}
                  onMouseLeave={() => this.showInformation('stage', false)}
                >
                  <img
                    src={setup_icon}
                    height="16"
                    style={{ marginRight: '5px' }}
                  />
                  {showMessageInformationStage === true ? (
                    <div className="panelInformation">Stages Editor</div>
                  ) : null}
                </div>
              )}
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
                {!this.state.guiEditor && (
                  <a
                    href="https://github.com/newrelic/nr1-pathpoint/tree/main/docs/guides/Pathpoint-Steps#steps-guide"
                    style={{ marginLeft: '10px' }}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={iconInformation} />
                  </a>
                )}
                {this.state.guiEditor && (
                  <div
                    className="containerGearWheel"
                    onClick={() => this.OpenGUIEditor(13)}
                    onMouseEnter={() => this.showInformation('step', true)}
                    onMouseLeave={() => this.showInformation('step', false)}
                  >
                    <img
                      src={setup_icon}
                      height="16"
                      style={{ marginRight: '5px', marginBottom: '2px' }}
                    />
                    {showMessageInformationStep === true ? (
                      <div className="panelInformation">Steps Editor</div>
                    ) : null}
                  </div>
                )}
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
                {!this.state.guiEditor && (
                  <a
                    href="https://github.com/newrelic/nr1-pathpoint/tree/main/docs/guides/Pathpoint-Touchpoints#touchpoint-guide"
                    style={{ marginLeft: '10px' }}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={iconInformation} />
                  </a>
                )}
                {this.state.guiEditor && (
                  <div
                    className="containerGearWheel"
                    onClick={() => this.OpenGUIEditor(14)}
                    onMouseEnter={() =>
                      this.showInformation('touchpoint', true)
                    }
                    onMouseLeave={() =>
                      this.showInformation('touchpoint', false)
                    }
                  >
                    <img
                      src={setup_icon}
                      height="16"
                      style={{ marginRight: '5px', marginBottom: '2px' }}
                    />
                    {showMessageInformationTouchpoint === true ? (
                      <div className="panelInformation">Touchpoints Editor</div>
                    ) : null}
                  </div>
                )}
                <div className="touchPointCheckbox">
                  <input
                    type="Checkbox"
                    onChange={event => this.changeTouchpointsView(event)}
                  />
                  <div className="labelViewAll">View All</div>
                </div>
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
                        accessToConfig={accessToConfig}
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
                        renderMouseOver={this.renderMouseOver}
                        showMouseOver={showMouseOver}
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
            timeRangeTransform={this.timeRangeTransform}
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
            accountId={
              credentials.accountId ? credentials.accountId : accountId
            }
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
            onOptionConfigurationChange={this.handleOptionConfigurationChange}
            configurationOptionSelected={configurationOptionSelected}
            onFileChange={this.handleFileChange}
            fileName={fileName}
            fileNote={fileNote}
            UpdateJSONMetaData={this.UpdateJSONMetaData}
            jsonMetaData={this.state.jsonMetaData}
            GetHistoricJSONData={this.GetHistoricJSONData}
            JSONModal={this.state.JSONModal}
            UpdateItemSelectFromHistoric={this.UpdateItemSelectFromHistoric}
            currentHistoricSelected={this.state.currentHistoricSelected}
            RestoreJSONFromHistoric={this.RestoreJSONFromHistoric}
            username={this.state.username}
            handleStagesEditorSubmit={this.handleStagesEditorSubmit}
            timeRangeBodyTouchpointsEditor={timeRange}
            stagesInterface={this.state.stagesInterface}
            EditorValidateQuery={this.EditorValidateQuery}
            kpis={this.state.kpis}
            timeRangeKpi={timeRangeKpi}
            handleKPIEditorUpdate={this.handleKPIEditorUpdate}
            UAMModal={this.state.UAMModal}
            handleContinueUAMButton={this.handleContinueUAMButton}
            ToggleEnableContinueButton={this.ToggleEnableContinueButton}
            ValidateAdminKey={this.ValidateAdminKey}
            HandleUAMkeyFormChange={this.HandleUAMkeyFormChange}
            handleKeyEditorSubmit={this.handleKeyEditorSubmit}
            HandleOnChange={this.HandleOnChange}
            HandleDeleteUser={this.HandleDeleteUser}
            alertsTimeWindow={alertsTimeWindow}
            alertsRefreshDelay={alertsRefreshDelay}
            handleAlertParameterUpdate={this.handleAlertParameterUpdate}
          />
          <div id="cover-spin" style={{ display: loading ? '' : 'none' }} />
        </div>
      );
    }
  }
}
