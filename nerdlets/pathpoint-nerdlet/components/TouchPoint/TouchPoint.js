import React from "react";
import PropTypes from "prop-types";
import Modal from "../ModalTouchPoint";
import { Formik, Form } from "formik";
import onOffIcon from "../../images/on-off.svg";
import onIcon from "../../images/icon-on.svg";
import offIcon from "../../images/icon-off.svg";
import tuneIcon from "../../images/Tune.svg";
import queriesIcon from "../../images/Queries.svg";

/**
 * TouchPoint component Class
 *
 * @export
 * @class TouchPoint
 * @extends {React.Component}
 */
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default class TouchPoint extends React.Component {
  constructor() {
    super(...arguments);
    this._onClose = this._onClose.bind(this);

    this.state = {
      hidden: false,
      idVisible: uuidv4(),
      visible: false,
      stylesContext: {
        top: "",
        left: "",
      },
      currentOnOffStatus: true,
      activeTouchPoint: 0,
      objectTPActive: null
    };
  }

  componentDidMount() {
    document.addEventListener("contextmenu", this._handleContextMenuPrevent);
  }

  componentWillUnmount() {
    document.removeEventListener("contextmenu", this._handleContextMenuPrevent);
  }

  _handleContextMenuPrevent(event) {
    event.preventDefault();
  }

  _handleContextMenu = (event) => {
    if (event.button == 2) {
      event.preventDefault();
      const clickX = event.clientX;
      const clickY = event.clientY;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const stylesContext = {
        left: "",
        top: "",
      };
      stylesContext.left = `${clickX + 5}px`;
      stylesContext.top = `${clickY + 5}px`;
      if (clickX + 160 > screenW) {
        stylesContext.left = `${clickX - 160 + 5}px`;
      }
      if (clickY + 180 > screenH) {
        stylesContext.top = `${clickY - 180 + 5}px`;
      }
      this.setState({ stylesContext: stylesContext });


      this.props.renderProps(this.state.idVisible, this.props.touchpoint);

      let {   active } = this.props.touchpoint;

     this.setState({ objectTPActive: this.props.touchpoint });

    
    }
  };

  _handleClickClosed = () => {
    this.props.renderProps(this.state.idVisible, this.props.touchpoint);
  };

  _handleClickonOff = () => {
    this.props.updateTouchpointOnOff(this.props.touchpoint);
    this.props.renderProps(this.state.idVisible, this.props.touchpoint);

  };

  _handleClickTune = () => {


    this.props.openModalParent(this.props.touchpoint, 2);
    this.props.renderProps(this.state.idVisible, this.props.touchpoint);

    let {   active } = this.props.touchpoint;
    this.props.touchpoint.active  = !active;

  };

  _handleClickQueries = () => {


    this.props.openModalParent(this.props.touchpoint, 1);
    this.props.renderProps(this.state.idVisible, this.props.touchpoint);
    
    
    let {   active } = this.props.touchpoint;
    this.props.touchpoint.active  = !active;

  };

  _openModal = (stage) => {
    this.setState({ stageNameSelected: stage });
    this._onClose();
  };


  _onClose() {
    this.setState({ hidden: false });
  }

  displayItem = (
    touchpoint,
    checkAllStatus,
    iconSixthSenseStatus,
    iconFireStatus
  ) => {
    if (iconSixthSenseStatus && touchpoint.sixth_sense) {
      return `flex`;
    } else if (touchpoint.highlighted) {
      return `flex`;
    } else if (touchpoint.error) {
      return `flex`;
    } else if (iconFireStatus && touchpoint.history_error) {
      return `flex`;
    } else {
      if (checkAllStatus) {
        return `flex`;
      } else {
        return `none`;
      }
    }
  };

  colorBorder = (touchpoint, colors, iconFireStatus) => {
    let {
      select_color,
      unselect_color,
      error_color,
    } = colors.steps_touchpoints[0];
    if (touchpoint.highlighted) {
      return `2px solid rgb(${select_color[0]},${select_color[1]},${select_color[2]})`;
    } else if (iconFireStatus && touchpoint.history_error) {
      return `2px solid rgb(${error_color[0]},${error_color[1]},${error_color[2]})`;
    } else {
      return `1px solid rgb(${unselect_color[0]},${unselect_color[1]},${unselect_color[2]})`;
    }
  };

  colorSquare = (touchpoint, colors) => {
    let {
      select_color,
      unselect_color,
      error_color,
    } = colors.steps_touchpoints[0];
    if (touchpoint.highlighted && !touchpoint.error) {
      return `rgb(${select_color[0]},${select_color[1]},${select_color[2]})`;
    } else if (touchpoint.error) {
      return `rgb(${error_color[0]},${error_color[1]},${error_color[2]})`;
    } else {
      return `rgb(${unselect_color[0]},${unselect_color[1]},${unselect_color[2]})`;
    }
  };

  backgroundTouchPoint = (currentOnOffStatus, activeTouchPoint) => {
    //console.log("pinta "+ activeTouchPoint);
    if(activeTouchPoint){
      return "#D7EBF6";//
    }
    if(!currentOnOffStatus){ //rgb(18, 167, 255);
      return "#D7DADB";
    }
    return "";

  }
  render() {
    const { stylesContext } = this.state;
    const {
      touchpoint,
      city,
      colors,
      iconFireStatus,
      checkAllStatus,
      iconSixthSenseStatus,
      visible,
      idVisible,
      handleChange
    } = this.props;

   // console.log("acac: " + touchpoint.active);
    
    const currentOnOffStatus = touchpoint.status_on_off;
    const touch_sense_url = touchpoint.sixth_sense_url;
    const activeTouchPoint = touchpoint.active;

    return (
      <div className="divStep">
        <div className="divContentPoint">
          <div
            className="textContentPoint"
            style={{
              border: this.colorBorder(touchpoint, colors, iconFireStatus),
              display: this.displayItem(
                touchpoint,
                checkAllStatus,
                iconSixthSenseStatus,
                iconFireStatus
              ),
              cursor: "pointer",
              background:this.backgroundTouchPoint(currentOnOffStatus,activeTouchPoint)
            }}
            onMouseDown={this._handleContextMenu}
          >
            <div
              className="squareState"
              style={{ background: this.colorSquare(touchpoint, colors) }}
            />
            <div
              onClick={() => {
                if (touchpoint.sixth_sense && iconSixthSenseStatus) {
                  this.setState({ hidden: true });
                } else if (touchpoint.dashboard_url !== false) {
                  if (touchpoint.dashboard_url[city] !== false) {
                    window.open(touchpoint.dashboard_url[city]);
                  }
                }
              }}
              style={{
                cursor:
                  touchpoint.dashboard_url !== false
                    ? touchpoint.dashboard_url[city] !== false
                      ? "pointer"
                      : null
                    : null
                  }}
            >
              {touchpoint.value}
            </div>

            <Modal
              hidden={this.state.hidden}
              _onClose={this._onClose}
              stageNameSelected=""
              viewModal=""
              iframembed={touch_sense_url}
            />
          </div>
        </div>

        <div>
          {visible && idVisible === this.state.idVisible ? (
            <div
              ref={(ref) => {
                this.root = ref;
              }}
              style={{
                left: stylesContext.left,
                top: stylesContext.top,
                zIndex: 2001,
              }}
              className="contextMenu"
            >
              <div>
                <Formik
                  initialValues={{
                    contextError: touchpoint.index,
                    contextApdex: "0.5",
                  }}
                  onSubmit={(values) =>
                    handleChange(values, touchpoint.index, this.props)
                  }
                  render={() => (
                    <Form>
                      <div className="contextMenuItem" onClick={this._handleClickonOff}>
                        <span className="functionIcon">
                          <img
                            style={{ height: '15px' }}
                            src={onOffIcon}
                          />
                        </span>
                        <span className="onoffIcon">
                          <img
                            style={{ height: '20px' }}
                            src={onIcon}
                            src={currentOnOffStatus ? onIcon : offIcon}
                          />
                        </span>
                      </div>
                      <div className="contextMenuItem">
                        <div
                          onClick={this._handleClickTune}
                          className="contextMenu--option"
                        >
                          <span className="functionIcon">
                            <img
                              style={{ height: '15px' }}
                              src={tuneIcon}
                            />
                          </span>
                        Tune
                        </div>
                      </div>
                      <div className="contextMenuItem">
                        <div
                          onClick={this._handleClickQueries}
                          className="contextMenu--option"
                        >
                          <span className="functionIcon">
                            <img
                              style={{ height: '15px' }}
                              src={queriesIcon}
                            />
                          </span>
                        Queries
                        </div>
                      </div>
                    </Form>
                  )}
                />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>

      </div>
    );
  }
}

TouchPoint.propTypes = {
  touchpoint: PropTypes.object.isRequired,
  city: PropTypes.number.isRequired,
};
