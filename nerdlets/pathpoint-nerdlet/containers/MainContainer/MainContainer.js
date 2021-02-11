import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Stage from "../../components/Stage/Stage.js";
import Header from "../../components/Header/Header.js";
import StepContainer from "../StepContainer/StepContainer.js";
import TouchPointContainer from "../TouchPointContainer/TouchPointContainer.js";
import { nerdlet, NerdGraphQuery } from "nr1";
import medalIconOn from "../../images/medalIconOn.svg";
import medalIcon from "../../images/medalIcon.svg";
import startIcon from "../../images/StartIcon.svg";
import startIconOn from "../../images/StartIconOn.svg";
import goutBlack from "../../images/goutBlack.svg";
import Emulator from "../../helpers/Emulator.js";
import Modal from "../../components/Modal";
import UpdateData from "../../services/UpdateData";
import Setup from "../../config/setup.json";
import TooltipStages from "../../components/Tooltip/TooltipStages";
import TooltipSteps from "../../components/Tooltip/TooltipSteps";
import TooltipTouchPoints from "../../components/Tooltip/TooltipTouchPoints";

import canaryStates from "../../config/canary_states.json";
import StorageUpdate from "../../services/StorageUpdate";
import AppContext from "../../Provider/AppProvider";
import Version from "../../../../package.json";
import { visitWithTypeInfo } from "graphql";

import support from "../../images/support_on.svg";
import setup from "../../images/setup_on.svg";

import right_icon from "../../images/right.svg";
import flame_icon from "../../images/flame_icon.svg";
import gout_icon from "../../images/gout_icon.svg";
import star_icon from "../../images/star_icon.svg";
import down from "../../images/down.svg";
import DownloadLink from "react-download-link";
import messages from "../../config/messages.json";
//import SlackConnector from "../../services/SlackConnector";

import logo_icon from '../../images/logo_icon.svg'

import { sendLogsSlack } from "../../services/SlackConnector";
import { CreateJiraIssue } from "../../services/JiraConnector";
import LogoSetupData from '../../services/LogoSetupData'

import Configuration from "../../services/Configuration";
import {
  mainContainerStyle,
  contentStyle,
  contentContainerStyle,
  mainColumn,
} from "./stylesFuntion";
import ValidationQuery from "../../services/Validations.js";
import logoNewRelic from "../../images/logoNewRelic.png";
import loadin from "../../images/Loading.gif";

/**
 *Main container component
 *
 * @export
 * @class MainContainer
 * @extends {React.Component}
 */
export default class MainContainer extends React.Component {
  constructor(props) {
    super(props);
    nerdlet.setConfig({
      header: false,
    });
    this.state = {
      waiting: true,
      stages: null,
      iconFireStatus: false,
      iconStartStatus: false,
      iconGoutStatus: false,
      iconCanaryStatus: false,
      iconSixthSenseStatus: false,
      hidden: false,
      stageNameSelected: "",
      viewModal: 0,
      checkMoney: false,
      city: 0,
      timeRange: "5 MINUTES AGO",
      getOldSessions: true,
      loading: false,
      canaryData: null,
      colors: null,

      tuneOptions: null,
      checkAllStatus: false,
      visible: false,
      idVisible: "",
      version: "0.0.0",
      showCanaryWelcomeMat: true,
      showFireWelcomeMat: true,
      backdrop: false,
      showLeftPanel: false,
      supportForm: {
        subject: "",
        name: "",
        email: "",
        phone: "",
        message: "",
      },
      showRightPanel: false,
      MenuRightDefault: 0,
      flameForm: {
        days: 0,
        percentage: 0,
      },
      errorsList: [],
      starForm: {
        starHours: 12,
        starTraffic: 100,
        starCongestion: 25,
        starTransactions: 400,
      },
      dropForm: {
        money: 0,
        fileContent: "demo file json ....",
      },
      logoSetupData: null,
      configuration: null,
      updateData: null,
      querySample: "",
      testText: "",
      goodQuery: true,
      logoSetup: {
        type: 'Default'
      },
      banner_kpis: null
    };
  }

  // =========================================================== EMULATOR
  /*
  componentWillMount() {
    const { state } = this.context;
    const { stages, colors } = state;
    this.state.stages = stages;
    this.state.colors = colors;
    const configuration = new Configuration(this.state);
    this.state.configuration = configuration;
    this.state.version = Version.version;
    this.updateData = new UpdateData(this.state.stages, this.state.version);
    this.state.updateData = this.updateData;

    this.emulator = new Emulator(this.state.stages);
    this.emulator.init();

    this.StorageCanary = new StorageUpdate(); //activa data canary
    console.log("Canary");
  }

  componentDidMount() {
    this.setState({ waiting: false });
    setTimeout(() => {
      this.initialized = true;
    }, 4000);
    this.setState({ stages: this.emulator.getDataState() });

    this.interval = setInterval(() => {
      this.setState({ stages: this.emulator.getDataState() });
    }, Setup.time_refresh);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.emulator.closeConnections();
  }

  updateDataNow() {
    console.log("UPDATE-NOW");
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
    }, 2000);
  }
*/
  // =========================================================== UPDATE DATA API
  updateDataNow(){
    console.log("UPDATE-NOW");
    this.setState({ loading: true });
    this.updateDataNow();
  }

  updateDataNowCall() {
    if (!this.updateData.loading) {
      let {
        timeRange,
        city,
        getOldSessions,
        stages,
        banner_kpis
      } = this.state;
      //console.log('goto updater');
      this.updateData
        .startUpdate(timeRange, city, getOldSessions, stages, banner_kpis)
        .then(() => {
          //console.log('show updates');
          this.setState({
            getOldSessions: false,
            banner_kpis: this.state.banner_kpis,
            stages: this.state.stages,
            loading: false
          })
        });
    } else {
      setTimeout(() => {
        this.updateDataNowCall();
      }, 1000);
    }
  }

  componentWillMount() {
    const configuration = new Configuration(this.state);

    const { state } = this.context;
    const { stages, colors, banner_kpis } = state;
    //this.setState({configuration});
    this.state.configuration = configuration;
    this.state.stages = stages;
    this.state.colors = colors;
    this.state.version = Version.version;
    this.state.banner_kpis = banner_kpis;
    this.updateData = new UpdateData(this.state.stages, this.state.version);

    //this.setState({updateData: this.updateData});
    this.state.updateData = this.updateData;

    this.state.updateData.loading = true;
    configuration.loadInitialData().then(() => {
      console.log("WAITING-FALSE");
      this.updateData.setTouchpointsStatusFromMainContainer(this.state.stages)

      this.validationQuery = new ValidationQuery(configuration.accountId);
      this.StorageCanary = new StorageUpdate(configuration.accountId); //activa data canary
      this.InitLogoSetupData(configuration.accountId)

      this.state.updateData.loading = false;
      //this.setState({ waiting: true });
      this.setState({ stages: this.state.stages, banner_kpis: this.state.banner_kpis });
      setTimeout(() => {
        let {
          timeRange,
          city,
          getOldSessions,
          stages,
          banner_kpis
        } = this.state;
        this.updateData
          .startUpdate(timeRange, city, getOldSessions, stages, banner_kpis)
          .then(() => {
            //console.log('show updates');
            this.setState({
              waiting: false,
              getOldSessions: false,
              banner_kpis: this.state.banner_kpis,
              stages: this.state.stages
            })
          });
      }, 1500);
    });
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      if (!this.updateData.loading) {
        let {
          timeRange,
          city,
          getOldSessions,
          stages,
          banner_kpis
        } = this.state;
        console.log("goto updater");
        this.updateData
          .startUpdate(timeRange, city, getOldSessions, stages, banner_kpis)
          .then(() => {
            console.log("show updates");
            this.setState({
              getOldSessions: false,
              banner_kpis: this.state.banner_kpis,
              stages: this.state.stages
            })
          });
      }
    }, Setup.time_refresh);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // ===========================================================

  updateNewGui = () => {
    this.setState({ stages: this.state.stages });
  };

  onClickStage = (stageIndex) => {
    //console.log("StageonCLick:",stageIndex);
    this.state.stages[stageIndex - 1].latencyStatus = !this.state.stages[
      stageIndex - 1
    ].latencyStatus;
    this.setState({ stages: this.state.stages });
  };

  InitLogoSetupData = async (accountId) => {
    this.LogoSetupData = new LogoSetupData(accountId)
    const logoSetup = await this.LogoSetupData.GetLogoSetupData()
    if (logoSetup) {
      this.setState({
        logoSetup
      })
    }
  }

  onclickStep = (stepEntry) => {
    const { stages, iconFireStatus, iconCanaryStatus, canaryData } = this.state;
    if (iconFireStatus) {
      this.resetAllStages();
    }

    let touchpoin = [];
    let newStages = [];
    let flag = false;
    let stage = stages[stepEntry.index_stage - 1];
    for (const step of stage.steps) {
      if (step.value === "") {
        for (const substep of step.sub_steps) {
          if (substep.value === stepEntry.value) {
            if (iconCanaryStatus) {
              //substep.canary_state = true;
              substep.canary_state = substep.canary_state ? false : true;
              if (this.updateData) {
                this.updateData.setCanaryData();
                this.updateDataNow();
              }
              //aca actualizo el nnuevo array -- aun no se como guardar el proceso SUBSTEP
              canaryData[substep.index_stage - 1].states[substep.index - 1] =
                substep.canary_state;
              this.StorageCanary.update(canaryData);
              //actulizamos el nuevo array
              //console.log(substep);
              //console.table(canaryData[substep.index_stage - 1].states[substep.index - 1]);
            } else {
              flag = substep.highlighted;
              substep.highlighted = !substep.highlighted;
              for (const id_touchpoint of substep.relationship_touchpoints) {
                touchpoin.push(id_touchpoint);
              }
            }
          } else {
            substep.highlighted = false;
          }
        }
      } else {
        if (step.value === stepEntry.value) {
          if (iconCanaryStatus) {
            step.canary_state = step.canary_state ? false : true;
            if (this.updateData) {
              this.updateData.setCanaryData();
              this.updateDataNow();
            }
            //aca actualizo el nnuevo array -- aun no se como guardar el proceso SUBSTEP
            canaryData[step.index_stage - 1].states[step.index - 1] =
              step.canary_state;
            this.StorageCanary.update(canaryData);
            //actulizamos el nuevo array
            //console.log(stepEntry);
            //console.table(canaryData[step.index_stage - 1].states[step.index - 1]);
          } else {
            flag = step.highlighted;
            step.highlighted = !step.highlighted;
            for (const id_touchpoint of step.relationship_touchpoints) {
              touchpoin.push(id_touchpoint);
            }
          }
        } else {
          step.highlighted = false;
        }
      }
    }
    for (const key in stage.touchpoints) {
      stage.touchpoints[key].highlighted = false;
    }
    if (!flag) {
      if (touchpoin.length !== 0) {
        for (const id_to of touchpoin) {
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
    this.setState({ stages: newStages, iconFireStatus: false });
  };

  resetAllStages = () => {
    const { stages } = this.state;
    //unselect all steps and touchpoints
    for (const stage of stages) {
      for (const step of stage.steps) {
        if (step.value === "") {
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
    this.setState({ stages });
  };

  checkMoneyBudget = () => {
    let { checkMoney, stages, iconStartStatus } = this.state;
    let newData = [];
    for (const stage of stages) {
      stage.money_enabled = !checkMoney;
      stage.icon_visible = iconStartStatus;
      newData.push(stage);
    }
    this.setState({
      stages: newData,
      checkMoney: !checkMoney,
    });
  };

  _onClose = (errors) => {
    let actualValue = this.state.hidden;
    this.setState({ hidden: !actualValue });
    this.restoreTouchPoints();
    if (errors) {
      this.setState({
        viewModal: 8,
        hidden: true,
        errorsList: errors,
      });
    } else {
      this.setState({
        errorsList: [],
      });
    }
  };

  preSelectCanaryData = (canaryData) => {
    const { stages } = this.state;
    for (const stage of stages) {
      for (const step of stage.steps) {
        if (step.value === "") {
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
    if (this.updateData) {
      this.updateData.setCanaryData();
    }
  };

  clearStepsSixthSense() {
    let { stages } = this.state;
    stages.forEach((state) => {
      state.steps.forEach((step) => {
        step.sub_steps.forEach((sub_step) => {
          sub_step.sixth_sense = false;
        });
      });
    });
  }

  setStepsSixthSense(stage_index, relation_steps) {
    let rsteps = JSON.stringify(relation_steps).replace(/[,\[\]]/g, "-");
    this.state.stages[stage_index - 1].steps.forEach((step) => {
      step.sub_steps.forEach((sub_step) => {
        if (rsteps.indexOf("-" + sub_step.index + "-") != -1) {
          sub_step.sixth_sense = true;
        }
      });
    });
  }

  updateSixthSenseSteps() {
    this.clearStepsSixthSense();
    this.state.stages.forEach((stage) => {
      stage.touchpoints.forEach((touchpoint) => {
        if (touchpoint.sixth_sense) {
          this.setStepsSixthSense(stage.index, touchpoint.relation_steps);
        }
      });
    });
  }

  activeSixthSenseIcon = () => {
    let { iconSixthSenseStatus } = this.state;
    iconSixthSenseStatus = !iconSixthSenseStatus;
    if (iconSixthSenseStatus) {
      this.updateSixthSenseSteps();
    }
    this.setState({
      iconStartStatus: false,
      iconGoutStatus: false,
      iconCanaryStatus: false,
      iconSixthSenseStatus: iconSixthSenseStatus,
      iconFireStatus: false,
    });
  };

  activeCanaryIcon = () => {
    // console.log('aca canario');
    let {
      iconStartStatus,
      iconFireStatus,
      iconGoutStatus,
      iconCanaryStatus,
    } = this.state;
    let actualCanaryStatus = !this.state.iconCanaryStatus;
    if (actualCanaryStatus && this.state.showCanaryWelcomeMat) {
      this.setState({
        viewModal: 6,
        stageNameSelected: null
      })
      // this.setState({ viewModal: 6 });
      // this.setState({ stageNameSelected: null });
      this._onClose();
    }
    //desactivamos todo el resto
    this.setState({
      iconGoutStatus: false,
      iconFireStatus: false,
      iconStartStatus: false,
      iconSixthSenseStatus: false,
    });

    this.resetIcons(
      iconStartStatus,
      iconFireStatus,
      iconGoutStatus,
      !actualCanaryStatus
    );

    if (!iconCanaryStatus) {
      //console.log('aca prendido:' + iconCanaryStatus);
      this.state.canaryData = this.StorageCanary.getLoadData();
      this.preSelectCanaryData(this.state.canaryData);
    } else {
      if (this.updateData) {
        this.updateData.clearCanaryData(this.state.stages);
      }
    }

    this.setState({ iconCanaryStatus: !iconCanaryStatus });

    //Data.canary_status = !iconCanaryStatus;
    this.state.iconCanaryStatus = !iconCanaryStatus;
    this.updateDataNow();
  };
  activeStartIcon = () => {
    //console.log('este es la estrella');

    let {
      stages,
      iconStartStatus,
      iconFireStatus,
      iconGoutStatus,
      iconCanaryStatus,
    } = this.state;
    this.setState({
      iconGoutStatus: false,
      iconFireStatus: false,
      iconCanaryStatus: false,
      iconSixthSenseStatus: false,
    });
    this.resetIcons(
      !iconStartStatus,
      iconFireStatus,
      iconGoutStatus,
      iconCanaryStatus
    );
    if (!iconStartStatus) {
      let newData = [];
      for (const stage of stages) {
        stage.money_enabled = !iconStartStatus;
        stage.icon_visible = !iconStartStatus;
        newData.push(stage);
      }
      this.setState({
        stages: newData,
        iconStartStatus: !iconStartStatus,
        checkMoney: true,
      });
    } else {
      let newData = [];
      for (const stage of stages) {
        stage.money_enabled = !iconStartStatus;
        stage.icon_visible = !iconStartStatus;
        newData.push(stage);
      }
      this.setState({
        stages: newData,
        iconStartStatus: !iconStartStatus,
      });
    }
  };

  clearStepsHistoricError() {
    let { stages } = this.state;
    stages.forEach((state) => {
      state.steps.forEach((step) => {
        step.sub_steps.forEach((sub_step) => {
          sub_step.history_error = false;
        });
      });
    });
  }

  setStepsHistoricError(stage_index, relation_steps) {
    let rsteps = JSON.stringify(relation_steps).replace(/[,\[\]]/g, "-");
    this.state.stages[stage_index - 1].steps.forEach((step) => {
      step.sub_steps.forEach((sub_step) => {
        if (rsteps.indexOf("-" + sub_step.index + "-") != -1) {
          sub_step.history_error = true;
        }
      });
    });
  }

  updateHistoricErrors() {
    this.clearStepsHistoricError();
    this.state.stages.forEach((stage) => {
      stage.touchpoints.forEach((touchpoint) => {
        if (touchpoint.history_error) {
          this.setStepsHistoricError(stage.index, touchpoint.relation_steps);
        }
      });
    });
  }

  activeFireIcon = () => {
    let { iconFireStatus, iconCanaryStatus } = this.state;
    iconFireStatus = !iconFireStatus;
    if (iconFireStatus && this.state.showFireWelcomeMat) {
      this.setState({
        viewModal: 7,
        stageNameSelected: null
      })
      // this.setState({ viewModal: 7 });
      // this.setState({ stageNameSelected: null });
      this._onClose();
    }
    // check if Canary is ENABLED
    if (iconCanaryStatus) {
      if (this.updateData) {
        this.updateData.clearCanaryData(this.state.stages);
      }
    }
    if (iconFireStatus) {
      if (this.updateData) {
        this.updateData.readHistoricErrors().then(() => {
          //console.log('Getting Historic Errors');
          //this.setState({ stages: this.state.stages });
          this.updateHistoricErrors();
        });
      } else {
        // to work in emulation mode
        this.updateHistoricErrors();
      }
    }
    this.setState({
      iconStartStatus: false,
      iconGoutStatus: false,
      iconCanaryStatus: false,
      iconSixthSenseStatus: false,
      iconFireStatus: iconFireStatus,
    });
  };

  activeGout = () => {
    let {
      iconStartStatus,
      iconFireStatus,
      iconGoutStatus,
      iconCanaryStatus,
    } = this.state;
    let next = !this.state.iconGoutStatus;
    this.setState({
      iconStartStatus: false,
      iconFireStatus: false,
      iconCanaryStatus: false,
      iconSixthSenseStatus: false,
    });
    this.resetIcons(
      iconStartStatus,
      iconFireStatus,
      !iconGoutStatus,
      iconCanaryStatus
    );
    if (next) {
      const { stages } = this.state;
      for (const stage of stages) {
        stage.gout_enable = true;
      }
      this.setState({ stages });
    } else {
      const { stages } = this.state;
      for (const stage of stages) {
        stage.gout_enable = false;
      }
      this.setState({ stages });
    }
    this.setState({ iconGoutStatus: next });
  };

  removeDuplicates(originalArray) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i]] = originalArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  openModal = (stage) => {
    this.setState({
      viewModal: 0,
      stageNameSelected: stage
    })
    // this.setState({ viewModal: 0 });
    // this.setState({ stageNameSelected: stage });
    this._onClose();
  };

  updateTouchpointStageOnOff(touchpoint) {
    touchpoint.status_on_off = !touchpoint.status_on_off;
    this.setState({ stages: this.state.stages });
  }

  updateTouchpointOnOff = (touchpoint) => {
    this.updateTouchpointStageOnOff(touchpoint);
    if (this.updateData) {
      this.updateData.updateTouchpointOnOff(touchpoint, true);
    }
  };

  openModalParent = (touchpoint, view) => {
    let datos = null;
    if (this.updateData) {
      if (view == 2) {
        datos = this.updateData.getTouchpointTune(touchpoint);
        if (touchpoint.value == "Wex" || touchpoint.value == "DutyCalc") {
          view = 3;
        }
      } else if (view == 1) {
        datos = this.updateData.getTouchpointQuerys(touchpoint);
      }
      //console.log("DATOS:",datos);
    }
    //console.log('aca estamos');
    //console.table(touchpoint);
    this.setState({
      viewModal: view,
      stageNameSelected: { touchpoint, datos },
      querySample: "",
      testText: "",
    });
    this._onClose();
  };

  changeTimeRange = ({ value }) => {
    this.setState(
      { timeRange: value, getOldSessions: true },
      this.updateDataNow
    );
  };

  resetIcons = (statusStar, statusFire, statusGot, statusCanary) => {
    if (statusStar) {
      const { stages } = this.state;
      let newData = [];
      for (const stage of stages) {
        stage.money_enabled = false;
        stage.icon_visible = false;
        newData.push(stage);
      }
      this.setState({
        stages: newData,
        iconStartStatus: false,
      });
    }
    if (statusFire) {
      const { stages } = this.state;
      //unselect all steps and touchpoints
      for (const stage of stages) {
        for (const step of stage.steps) {
          if (step.value === "") {
            for (const substep of step.sub_steps) {
              //substep.history_error = false;
              substep.highlighted = false;
            }
            //step.history_error = false;
            step.highlighted = false;
          } else {
            //step.history_error = false;
            step.highlighted = false;
          }
        }
        for (const touch of stage.touchpoints) {
          touch.highlighted = false;
          //touch.history_error = false;
        }
      }
      this.setState({
        stages,
        iconFireStatus: false,
      });
    }
    if (statusGot) {
      const { stages } = this.state;
      for (const stage of stages) {
        stage.gout_enable = false;
      }
      this.setState({
        stages,
        iconGoutStatus: false,
      });
    }
    if (statusCanary) {
      //console.log('aca deberiamos reiniciar todo y guardar data')ta
      // Data.canary_status = !statusCanary;
      this.state.iconCanaryStatus = !statusCanary;
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
                {element.icon_description === "medal" ? (
                  <img
                    className="sizeIconMedal"
                    src={medalIcon}
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
          <div className="cashStage" style={{ color: "#C59400" }}>
            {element.money}
          </div>
        </div>
      );
    }
    if (statusGot) {
      return (
        <div className="moneyStage">
          <div style={{ alignItems: "center", marginRight: "5%" }}>
            <img src={goutBlack} height="15px" width="11px" />
            <span className="goutTxt">{element.gout_quantity}</span>
          </div>
          <div className="cashStage" style={{ color: "#333333" }}>
            {element.money}
          </div>
        </div>
      );
    }
    if (statusFire) {
      return (
        <div className="moneyStageHistoryError">
          <div className="cashStage" style={{ color: "red" }}>
            {element.money}
          </div>
        </div>
      );
    }
  };

  changeTouchpointsView(event) {
    this.setState({ checkAllStatus: event.target.checked });
    //console.log(event.target.checked);
  }
  //----------------------------------------------------------
  handleClick = (event, data) => {
    console.log(`clicked`, { event, data });
  };

  /**
   * Function to close the TouchPoint
   *
   * @memberof MainContainer
   */
  _onCloseBackdropTouch = () => {
    const { idVisible } = this.state;
    this.setState({
      visible: false,
      idVisible: idVisible,
    });
    this.restoreTouchPoints();
  };

  renderProps = (idVisible, touchActive) => {
    //console.log(idVisible);
    // console.table(this.state);
    const { visible } = this.state;
    this.setState({ visible: !visible, idVisible: idVisible });
    this.restoreTouchPoints();
    if (!visible) {
      touchActive.active = true;
    }
  };

  restoreTouchPoints = () => {
    const { stages } = this.state;
    //unselect all steps and touchpoints
    for (const stage of stages) {
      for (const touch of stage.touchpoints) {
        touch.active = false;
        //touch.history_error = false;
      }
    }
  };

  handleChange(valor1, valor3, this_props) {
    console.log("valores", valor1, valor3);
    this_props.renderProps("", null);
  }

  changeMessage = (value) => {
    const { stageNameSelected } = this.state;
    stageNameSelected.selectedCase = value;
    this.setState({
      stageNameSelected,
      querySample: "",
      testText: ""
    })
    // this.setState(stageNameSelected);
    // this.setState({ querySample: "", testText: "" });
  };

  chargueSample = (value) => {
    let querySample = "";
    const { stageNameSelected } = this.state;
    switch (stageNameSelected.datos[value].label) {
      case "Count Query":
        querySample = messages.sample_querys.count;
        break;
      case "Apdex Query":
        querySample = messages.sample_querys.apdex;
        break;
      case "Session Query":
        querySample = messages.sample_querys.session;
        break;
      case "Session Query Duration":
        querySample = messages.sample_querys.sessionDuration;
        break;
      case "Log Measure Query":
        querySample = messages.sample_querys.logMeasure;
        break;
    }
    this.setState({ querySample, testText: "" });
  };

  testQuery = async (query, value) => {
    const { stageNameSelected } = this.state;
    let type = stageNameSelected.datos[value].label;
    const { testText, goodQuery } = await this.validationQuery.validateQuery(
      type,
      query
    );
    this.setState({ testText, goodQuery });
  };

  handleChangeTexarea = (event) => {
    const { stageNameSelected } = this.state;
    if (stageNameSelected.selectedCase) {
      stageNameSelected.datos[stageNameSelected.selectedCase.value].query_body =
        event.target.value;
    } else {
      stageNameSelected.datos[0].query_body = event.target.value;
    }
    this.setState({
      stageNameSelected,
      testText: ""
    })
    // this.setState(stageNameSelected);
    // this.setState({ testText: "" });
  };
  handleChangeTexareaSupport = (event) => {
    const { supportForm } = this.state;
    supportForm.message = event.target.value;
    this.setState(supportForm);
  };

  handleChangeSubject = (value) => {
    const { supportForm } = this.state;
    supportForm.subject = value.label;
    this.setState(supportForm);
  };

  handleSaveUpdateQuery = () => {
    //console.log(this.state.stageNameSelected)
    if (this.updateData) {
      this.updateData.updateTouchpointQuerys(
        this.state.stageNameSelected.touchpoint,
        this.state.stageNameSelected.datos
      );
    }
    this._onClose();
  };

  handleSaveUpdateTune = (event) => {
    event.preventDefault();
    //console.log(this.state.stageNameSelected)
    //console.log(event.target.elements.threshold.value)
    //console.log(event.target.elements.apdex.value)
    if (this.updateData) {
      let datos = {
        error_threshold: event.target.elements.threshold.value,
        apdex_time: 0,
      };
      if ("apdex" in event.target.elements) {
        datos = {
          error_threshold: event.target.elements.threshold.value,
          apdex_time: event.target.elements.apdex.value,
        };
      }
      this.updateData.updateTouchpointTune(
        this.state.stageNameSelected.touchpoint,
        datos
      );
    }
    this._onClose();
  };

  handleSaveUpdateCanary = (event) => {
    event.preventDefault();
    //console.log('CANARY-RESPOND');
    //console.log(event.target.elements.checkbox_canary.checked);
    this.state.showCanaryWelcomeMat = !event.target.elements.checkbox_canary
      .checked;
    this._onClose();
  };

  handleSaveUpdateFire = (event) => {
    event.preventDefault();
    this.state.showFireWelcomeMat = !event.target.elements.checkbox_fire
      .checked;
    this._onClose();
  };

  LogoFormSubmit = async (values, _onClose) => {
    _onClose()
    this.LogoSetupData.SetLogoSetupData(values)
    this.setState({
      logoSetup: {
        ...values
      }
    })
  }

  handleSaveUpdateSupport = (values) => {
    const { subject, name, email, phone, message, account, company } = values;
    const datos = {
      subject: subject,
      name: name,
      email: email,
      phone: phone,
      message: message,
      account: account,
      company: company,
    };
    //console.log('aca estamos :'+this.updateData.accountId);
    this.sendLogs(datos, this.updateData.accountId);
    CreateJiraIssue(datos, this.updateData.accountId);
    this._resetFormSupport();
    this._onClose();
  };

  async sendLogs(info, accountId) {
    console.log("acabo de ingresar", info);
    await sendLogsSlack([info], accountId, "Form Support");
    console.log("acabo de salir");
  }

  _resetFormSupport = () => {
    const { supportForm } = this.state;
    supportForm.name = "";
    supportForm.subject = "";
    supportForm.email = "";
    supportForm.phone = "";
    supportForm.message = "";
    this.setState({ supportForm });
  };

  openLeftMenu = () => {
    const { backdrop, showLeftPanel } = this.state;
    console.log("opne" + backdrop);

    this.setState({
      backdrop: !backdrop,
      showLeftPanel: !showLeftPanel,
      MenuRightDefault: 0,
    });
    console.log("open");
  };
  _onCloseBackdrop = () => {
    console.log("cerrar");
    const { backdrop, showLeftPanel, MenuRightDefault } = this.state;
    this.setState({
      backdrop: false,
      showLeftPanel: false,
      MenuRightDefault: 0,
    });
  };
  _handleClickSetup = () => {
    this._onCloseBackdrop();
    this.openModalParent("null", 4);
  };

  _handleClickProcesses = () => {
    this._onCloseBackdrop();
    this.openModalParent("null", 9);
  };

  _handleClickSupport = () => {
    this._onCloseBackdrop();
    this.openModalParent("null", 5);
  };

  _handleClickSupport = () => {
    this._onCloseBackdrop();
    this.openModalParent("null", 5);
  };

  HandleChangeLogo = () => {
    this._onCloseBackdrop();
    this.openModalParent("null", 10);
  }

  _handleContextMenuGout = (event) => {
    if (event.button == 2) {
      console.log("GOUT 1");
      this.setState({
        backdrop: true,
        showRightPanel: true,
        MenuRightDefault: 1,
      });
    }
  };

  _handleContextMenuStar = (event) => {
    if (event.button == 2) {
      console.log("STAR 1");
      this.setState({
        backdrop: true,
        showRightPanel: true,
        MenuRightDefault: 2,
      });
    }
  };

  _handleContextMenuFire = (event) => {
    if (event.button == 2) {
      console.log("FIRE 1");
      if (this.updateData) {
        const values = this.updateData.getHistoricParameters();
        this.setState({ flameForm: values });
      }
      const { backdrop, showRightPanel } = this.state;
      this.setState({
        backdrop: true,
        showRightPanel: true,
        MenuRightDefault: 3,
      });
    }
  };

  _onCloseMenuRight = () => {
    const { MenuRightDefault, dropForm, starForm, flameForm } = this.state;
    this.setState({
      backdrop: false,
      showRightPanel: false,
      MenuRightDefault: 0,
      showLeftPanel: false,
    });
    console.log("cerrar backdrop:" + MenuRightDefault);
    // mostramos data por formulario
    if (MenuRightDefault == 3) {
      console.table(flameForm);
      if (this.updateData) {
        this.updateData.updateHistoricParameters(
          flameForm.days,
          flameForm.percentage
        );
      }
    }

    if (MenuRightDefault == 2) {
      console.table(starForm);
    }

    if (MenuRightDefault == 1) {
      console.table(dropForm);
    }
  };

  _DropHandleChange = (event) => {
    //this.setState({value: event.target.value});
    //console.log(event.target.name);
    const key = event.target.name;

    const { dropForm } = this.state;
    dropForm[key] = event.target.value;
    this.setState(dropForm);
  };
  _StarHandleChange = (event) => {
    //this.setState({value: event.target.value});
    //console.log(event.target.name);
    const key = event.target.name;

    const { starForm } = this.state;
    starForm[key] = event.target.value;
    this.setState(starForm);
  };

  _FlameHandleChange = (event) => {
    //this.setState({value: event.target.value});
    //console.log(event.target.name);
    const key = event.target.name;

    const { flameForm } = this.state;
    flameForm[key] = event.target.value;
    this.setState(flameForm);
  };

  render() {
    const {
      stages,
      iconSixthSenseStatus,
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
      querySample,
      testText,
      goodQuery,
      banner_kpis
    } = this.state;
    //console.log("PRUEBA", this.state.timeRange)
    // const attributes = {
    //   className: "custom-root",
    //   disabledClassName: "custom-disabled",
    //   dividerClassName: "custom-divider",
    //   selectedClassName: "custom-selected",
    // };
    // const ID1 = "ID1";
    // console.log(JSON.stringify(countrys))
    if (this.state.waiting) {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div className="corazon">
            <img src={logoNewRelic} height={"76px"} width={"94px"} />
          </div>
          <div style={{ paddingTop: "20px", fontSize: "30px" }}>Pathpoint</div>
          <div style={{ marginTop: "15px" }}>
            <img src={loadin} />
          </div>
        </div>
      );
    } else {
      return (
        <div
          style={mainContainerStyle(stages.length)}
          className="mainContainer"
        >
          <div>
            <Header
              iconSixthSenseStatus={iconSixthSenseStatus}
              activeSixthSenseIcon={this.activeSixthSenseIcon}
              activeFireIcon={this.activeFireIcon}
              activeCanaryIcon={this.activeCanaryIcon}
              activeStartIcon={this.activeStartIcon}
              activeGoutIcon={this.activeGout}
              checkBudget={this.checkMoneyBudget}
              changeTimeRange={this.changeTimeRange}
              checkMoney={checkMoney}
              iconStartStatus={iconStartStatus}
              iconFireStatus={iconFireStatus}
              iconCanaryStatus={iconCanaryStatus}
              iconGoutStatus={iconGoutStatus}
              loading={loading}
              tune={tune}
              showLeftPanel={showLeftPanel}
              openLeftMenu={this.openLeftMenu}
              handleContextMenuGout={this._handleContextMenuGout}
              handleContextMenuStar={this._handleContextMenuStar}
              handleContextMenuFire={this._handleContextMenuFire}
              logoSetup={this.state.logoSetup}
              banner_kpis={banner_kpis}
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
                display: this.state.backdrop == false ? "none" : "block",
                marginTop: "50px",
              }}
            >
              {" "}
            </div>
            <div
              className={
                this.state.showLeftPanel == false
                  ? " menuLeftClose "
                  : "menuLeft fadeInLeft"
              }
            >
              <ul className="vertical">
                <div className="setup">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: "20%",
                      width: "100%",
                    }}
                  >
                    <img
                      src={setup}
                      height="14"
                      style={{ marginRight: "5px" }}
                    />
                    Setup
                  </div>
                  <div style={{ paddingLeft: "25%", width: "100%" }}>
                    <div
                      className="subItem"
                      onClick={this._handleClickSetup}
                      style={{ padding: "5px" }}
                    >
                      Json configuration
                    </div>
                    <div
                      className="subItem"
                      onClick={this._handleClickProcesses}
                      style={{ padding: "5px" }}
                    >
                      Background processes
                    </div>
                  </div>
                </div>
                <li onClick={this._handleClickSupport}>
                  <img
                    src={support}
                    height="14"
                    style={{ marginRight: "5px" }}
                  />
                  Support
                </li>
                <li onClick={this.HandleChangeLogo}>
                  <img
                    src={logo_icon}
                    height="14"
                    style={{ marginRight: "5px" }}
                  />
                  Logo
                </li>
              </ul>
              <div className="version">v.{version}</div>
            </div>

            <div
              className={
                this.state.MenuRightDefault == 1
                  ? " menuRight fadeInRight"
                  : "menuLeftClose"
              }
            >
              <div className="container_rmenu">
                <div className="content_rmenu">
                  <div className="col1_rmenu">
                    <img
                      src={gout_icon}
                      height="13px"
                      width="10px"
                      style={{ paddingBottom: "2px" }}
                    />
                    <span className="title_rmenu">Drop</span>
                    <span className="subtitle_rmenu">Tunning</span>
                  </div>
                  <div className="col2_rmenu">
                    {" "}
                    <img
                      src={right_icon}
                      height="18px"
                      width="18px"
                      style={{ cursor: "pointer" }}
                      onClick={this._onCloseMenuRight}
                    />{" "}
                  </div>
                </div>
                <div className="content_rmenu">
                  <div className="col3_rmenu">
                    <div className="subTitleBlack_container">XXX-XXX</div>
                    <div className="subTitleRight_container">
                      <input
                        id="dropmoney"
                        name="dropmoney"
                        type="text"
                        value={dropForm.money}
                        onChange={this._DropHandleChange}
                        className="input_mr"
                      ></input>
                      USD
                    </div>
                    <div className="subTitleRight_container">
                      average order value{" "}
                    </div>
                  </div>
                </div>

                <div className="content_rmenu">
                  <div className="col4_rmenu">
                    <div className="subTitle_container">
                      <img src={down} height="14" />
                      <DownloadLink
                        label="All Merchants"
                        filename="All_Merchants.json"
                        className="formDrop"
                        style={{ cursor: "pointer" }}
                        exportFile={() => dropForm.fileContent}
                      />
                    </div>
                  </div>
                  <div className="col5_rmenu"></div>
                </div>
                <div className="content_rmenu">
                  <div className="col3_rmenu">
                    <label
                      htmlFor="file-upload2"
                      className="button"
                      color="primary"
                    >
                      Update
                    </label>
                    <input
                      id="file-upload2"
                      type="file"
                      accept=".json"
                      onChange={this.handleFiles}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              className={
                this.state.MenuRightDefault == 2
                  ? " menuRight fadeInRight"
                  : "menuLeftClose"
              }
            >
              <div className="container_rmenu">
                <div className="content_rmenu">
                  <div className="col1_rmenu">
                    <img
                      src={star_icon}
                      height="13px"
                      width="10px"
                      style={{ paddingBottom: "2px" }}
                    />
                    <span className="title_rmenu">Star</span>
                    <span className="subtitle_rmenu">Tunning</span>
                  </div>
                  <div className="col2_rmenu">
                    {" "}
                    <img
                      src={right_icon}
                      height="18px"
                      width="18px"
                      style={{ cursor: "pointer" }}
                      onClick={this._onCloseMenuRight}
                    />{" "}
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
                    ></input>
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
                    ></input>
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
                    ></input>
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
                    ></input>
                    Transactions
                  </div>
                </div>
              </div>
            </div>

            <div
              className={
                this.state.MenuRightDefault == 3
                  ? " menuRight fadeInRight"
                  : "menuLeftClose"
              }
            >
              <div className="container_rmenu">
                <div className="content_rmenu">
                  <div className="col1_rmenu">
                    <img
                      src={flame_icon}
                      height="13px"
                      width="10px"
                      style={{ paddingBottom: "2px" }}
                    />
                    <span className="title_rmenu">Flame</span>
                    <span className="subtitle_rmenu">Tunning</span>
                  </div>
                  <div className="col2_rmenu">
                    {" "}
                    <img
                      src={right_icon}
                      height="18px"
                      width="18px"
                      style={{ cursor: "pointer" }}
                      onClick={this._onCloseMenuRight}
                    />{" "}
                  </div>
                </div>
                <div className="content_rmenu">
                  <div className="col3_rmenu">
                    <div className="subTitle_container">In the last </div>
                    <div className="subTitleRight_container add50height">
                      <input
                        id="days"
                        name="days"
                        type="text"
                        value={flameForm.days}
                        onChange={this._FlameHandleChange}
                        className="input_mr"
                      ></input>
                      Days
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
                      ></input>{" "}
                      %{" "}
                    </div>
                    <div className="subTitleRight_container">
                      of the most problematic touchpoints{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="title">
              Stages
              <TooltipStages />
            </div>
            <div style={contentStyle(stages.length)}>
              {stages.map((element) => (
                <div
                  key={element.index}
                  style={mainColumn(
                    element.active_dotted,
                    element.active_dotted_color
                  )}
                >
                  <Stage
                    index={element.index}
                    onClickStage={this.onClickStage}
                    title={element.title}
                    circleColor={element.errors}
                    percentageCongestion={element.congestion.percentage}
                    valueCongestion={element.congestion.value}
                    capacityPercentage={element.capacity}
                    totalCountStage={element.total_count}
                    goutActive={element.gout_enable}
                    goutQuantity={element.gout_quantity}
                    status={element.status_color}
                    tune={tune}
                    url={
                      element.dashboard_url == false
                        ? "false"
                        : element.dashboard_url
                    }
                    colors={colors}
                    trafficIconType={element.trafficIconType}
                  />
                </div>
              ))}
            </div>

            <div
              style={contentStyle(stages.length)}
              className="mainContainerSteps"
            >
              <div className="mainContainerSteps__title">
                Steps
                <TooltipSteps />
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
              {stages.map((element) => {
                return (
                  <div key={element.title}>
                    <div
                      style={mainColumn(
                        element.active_dotted,
                        element.active_dotted_color
                      )}
                    >
                      {element.money_enabled |
                      element.gout_enable |
                      iconFireStatus ? (
                        <div
                          style={{
                            display: "grid",
                            gridTemplate: "5% 1fr/ 1fr",
                            width: "100%",
                          }}
                        >
                          {this.renderContentAboveStep(
                            element.money_enabled,
                            element.gout_enable,
                            iconFireStatus,
                            element
                          )}
                          <div
                            className="stepColumn"
                            style={{ width: "100%"}}
                          >
                            <StepContainer
                              steps={element.steps}
                              latencyStatus={element.latencyStatus}
                              onclickStep={this.onclickStep}
                              iconGoutStatus={iconGoutStatus}
                              iconCanaryStatus={iconCanaryStatus}
                              colors={colors}
                              iconFireStatus={iconFireStatus}
                              iconSixthSenseStatus={iconSixthSenseStatus}
                              tune={tune}
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
                            iconSixthSenseStatus={iconSixthSenseStatus}
                            tune={tune}
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
                <TooltipTouchPoints />
                <span className="touchPointCheckbox">
                  <input
                    type="Checkbox"
                    onChange={(event) => this.changeTouchpointsView(event)}
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
              {stages.map((element, index) => {
                return (
                  <div key={element.title}>
                    <div
                      style={mainColumn(
                        element.active_dotted,
                        element.active_dotted_color
                      )}
                    >
                      <TouchPointContainer
                        handleChange={this.handleChange}
                        visible={visible}
                        idVisible={idVisible}
                        renderProps={this.renderProps}
                        touchpoints={element.touchpoints}
                        city={city}
                        colors={colors}
                        iconFireStatus={iconFireStatus}
                        checkAllStatus={checkAllStatus}
                        iconSixthSenseStatus={iconSixthSenseStatus}
                        openModalParent={this.openModalParent}
                        updateTouchpointOnOff={this.updateTouchpointOnOff}
                        tune={tune}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Modal
            updateNewGui={this.updateNewGui}
            errorsList={this.state.errorsList}
            configuration={this.state.configuration}
            hidden={hidden}
            _onClose={this._onClose}
            stageNameSelected={stageNameSelected}
            viewModal={viewModal}
            querySample={querySample}
            testText={testText}
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
          />
          <div id="cover-spin" style={{ display: loading ? "" : "none" }}></div>
        </div>
      );
    }
  }
}

MainContainer.contextType = AppContext;
