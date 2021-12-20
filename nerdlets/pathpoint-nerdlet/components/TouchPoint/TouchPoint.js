import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { Form } from 'react-bootstrap';

// IMPORT IMAGES
import onOffIcon from '../../images/on-off.svg';
import onIcon from '../../images/icon-on.svg';
import offIcon from '../../images/icon-off.svg';
import tuneIcon from '../../images/Tune.svg';
import queriesIcon from '../../images/Queries.svg';

export default class TouchPoint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idVisible: shortid.generate(),
      stylesContext: {
        top: '',
        left: ''
      }
    };
  }

  componentDidMount() {
    document.addEventListener('contextmenu', this.HandleContextMenuPrevent);
  }

  /* istanbul ignore next */
  shouldComponentUpdate(nextProps) {
    if (nextProps === this.props) {
      return false;
    }
    return true;
  }

  /* istanbul ignore next */
  componentWillUnmount() {
    document.removeEventListener('contextmenu', this.HandleContextMenuPrevent);
  }

  HandleContextMenuPrevent(event) {
    event.preventDefault();
  }

  HandleContextMenu = event => {
    if (event.button === 2 && !this.props.iconCanaryStatus) {
      event.preventDefault();
      const clickX = event.clientX;
      const clickY = event.clientY;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const stylesContext = {
        left: '',
        top: ''
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
    }
  };

  HandleClickonOff = () => {
    const { idVisible } = this.state;
    const { updateTouchpointOnOff, renderProps, touchpoint } = this.props;
    updateTouchpointOnOff(touchpoint);
    renderProps(idVisible, touchpoint);
  };

  HandleClickTune = () => {
    const { idVisible } = this.state;
    const { openModalParent, renderProps, touchpoint } = this.props;
    openModalParent(touchpoint, 2);
    renderProps(idVisible, touchpoint);
    // const { active } = touchpoint;
    // this.props.touchpoint.active = !active;
  };

  HandleClickQueries = () => {
    this.props.openModalParent(this.props.touchpoint, 1);
    this.props.renderProps(this.state.idVisible, this.props.touchpoint);
    // const { active } = this.props.touchpoint;
    // this.props.touchpoint.active = !active;
  };

  DisplayItem = (touchpoint, checkAllStatus, iconFireStatus) => {
    if (touchpoint.sixth_sense) {
      return `flex`;
    } else if (touchpoint.highlighted) {
      return `flex`;
    } else if (touchpoint.error) {
      return `flex`;
    } else if (iconFireStatus && touchpoint.history_error) {
      return `flex`;
    } else if (checkAllStatus) {
      return `flex`;
    } else {
      return `none`;
    }
  };

  ColorBorder = (touchpoint, colors, iconFireStatus) => {
    const {
      select_color,
      unselect_color,
      error_color
    } = colors.steps_touchpoints[0];
    if (touchpoint.highlighted) {
      return `2px solid rgb(${select_color[0]},${select_color[1]},${select_color[2]})`;
    } else if (iconFireStatus && touchpoint.history_error) {
      return `2px solid rgb(${error_color[0]},${error_color[1]},${error_color[2]})`;
    } else {
      return `1px solid rgb(${unselect_color[0]},${unselect_color[1]},${unselect_color[2]})`;
    }
  };

  ColorSquare = (touchpoint, colors) => {
    const { good, error_color, unselect_color } = colors.steps_touchpoints[0];
    if (touchpoint.show_grey_square) {
      return `rgb(${unselect_color[0]},${unselect_color[1]},${unselect_color[2]})`;
    } else if (touchpoint.response_error) {
      return `rgb(${unselect_color[0]},${unselect_color[1]},${unselect_color[2]})`;
    } else if (touchpoint.error) {
      return `rgb(${error_color[0]},${error_color[1]},${error_color[2]})`;
    } else if (touchpoint.status_on_off) {
      return `rgb(${good[0]},${good[1]},${good[2]})`;
    } else {
      return `rgb(${unselect_color[0]},${unselect_color[1]},${unselect_color[2]})`;
    }
  };

  BackgroundTouchPoint = (status_on_off, active) => {
    if (active) {
      return '#D7EBF6';
    }
    if (!status_on_off) {
      return '#D7DADB';
    }
    return '';
  };

  ActivateCursor = (touchpoint, city) => {
    if (touchpoint.dashboard_url !== false) {
      if (touchpoint.dashboard_url[city]) {
        return 'pointer';
      } else return 'default';
    } else return 'default';
  };

  render() {
    const { stylesContext } = this.state;
    const {
      touchpoint,
      city,
      colors,
      iconFireStatus,
      checkAllStatus,
      visible,
      idVisible
    } = this.props;
    const { status_on_off, active } = touchpoint;
    return (
      <div className="divStep">
        <div className="divContentPoint">
          <div
            className="textContentPoint"
            style={{
              border: this.ColorBorder(touchpoint, colors, iconFireStatus),
              display: this.DisplayItem(
                touchpoint,
                checkAllStatus,
                iconFireStatus
              ),
              cursor: this.ActivateCursor(touchpoint, city),
              background: this.BackgroundTouchPoint(status_on_off, active)
            }}
            onMouseDown={this.HandleContextMenu}
            onClick={() => {
              if (touchpoint.dashboard_url !== false) {
                if (touchpoint.dashboard_url[city] !== false) {
                  window.open(touchpoint.dashboard_url[city]);
                }
              }
            }}
          >
            <div
              className="squareState"
              style={{ background: this.ColorSquare(touchpoint, colors) }}
            />
            <div
              style={{
                cursor: this.ActivateCursor(touchpoint, city)
              }}
            >
              {touchpoint.value}
            </div>
          </div>
        </div>

        <div>
          {visible && idVisible === this.state.idVisible && (
            <div
              ref={
                /* istanbul ignore next */ ref => {
                  this.root = ref;
                }
              }
              style={{
                left: stylesContext.left,
                top: stylesContext.top,
                zIndex: 2001
              }}
              className="contextMenu"
            >
              <div>
                <Form>
                  <div
                    className="contextMenuItem"
                    onClick={this.HandleClickonOff}
                  >
                    <span className="functionIcon">
                      <img style={{ height: '15px' }} src={onOffIcon} />
                    </span>
                    <span className="onoffIcon">
                      <img
                        style={{ height: '20px' }}
                        src={status_on_off ? onIcon : offIcon}
                      />
                    </span>
                  </div>
                  <div className="contextMenuItem">
                    <div
                      onClick={this.HandleClickTune}
                      className="contextMenu--option"
                    >
                      <span className="functionIcon">
                        <img style={{ height: '15px' }} src={tuneIcon} />
                      </span>
                      Tune
                    </div>
                  </div>
                  <div className="contextMenuItem">
                    <div
                      onClick={this.HandleClickQueries}
                      className="contextMenu--option"
                    >
                      <span className="functionIcon">
                        <img style={{ height: '15px' }} src={queriesIcon} />
                      </span>
                      Queries
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

TouchPoint.propTypes = {
  touchpoint: PropTypes.object.isRequired,
  city: PropTypes.number.isRequired,
  colors: PropTypes.object.isRequired,
  iconFireStatus: PropTypes.bool.isRequired,
  checkAllStatus: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
  idVisible: PropTypes.string.isRequired,
  renderProps: PropTypes.func.isRequired,
  updateTouchpointOnOff: PropTypes.func.isRequired,
  openModalParent: PropTypes.func.isRequired,
  iconCanaryStatus: PropTypes.bool.isRequired
};
