// IMPORT LIBRARIES
import React, { Component } from 'react';
import iconInformation from '../../images/information.svg';
import PropTypes from 'prop-types';

// DEFINE COMPONENT
export default class Tooltip extends Component {
  // COMPONENT CONSTRUCTOR
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      clientX: 0,
      clientY: 0
    };
  }

  // COMPONENT METHODS
  /* istanbul ignore next */
  handleOnMouseEnter = e => {
    if (this.props.bottom) {
      this.setState(
        {
          show: true,
          clientX: 0,
          clientY: `${parseInt(e.clientY) + 30}px`
        },
        () => {
          const wrapper = document.getElementsByClassName('tooltip-wrapper')[0];
          wrapper.classList.add('fade-in');
        }
      );
    } else if (this.props.top) {
      this.setState(
        {
          show: true
        },
        () => {
          const wrapper = document.getElementsByClassName('tooltip-wrapper')[0];
          const clientY = parseInt(e.clientY) - wrapper.clientHeight - 30;
          this.setState(
            {
              clientX: 0,
              clientY: `${clientY}px`
            },
            () => {
              wrapper.classList.add('fade-in');
            }
          );
        }
      );
    }
  };

  /* istanbul ignore next */
  handleOnMouseLeave = () => {
    const wrapper = document.getElementsByClassName('tooltip-wrapper')[0];
    wrapper.classList.add('fade-out');
    setTimeout(() => {
      wrapper.style.opacity = 0;
      this.setState(
        {
          show: false
        },
        () => {
          wrapper.classList.remove('fade-in');
          wrapper.classList.remove('fade-out');
        }
      );
    }, 200);
  };

  // COMPONENT RENDERS
  render() {
    const { show, clientX, clientY } = this.state;
    const { width, children } = this.props;
    return (
      <div>
        <div className="tooltip-icon">
          <img
            height="10px"
            src={iconInformation}
            onMouseEnter={this.handleOnMouseEnter}
            onMouseLeave={this.handleOnMouseLeave}
          />
        </div>
        {show && (
          <div
            className="tooltip-wrapper"
            style={{ left: clientX, top: clientY, width: `${width}px` }}
          >
            {children}
          </div>
        )}
      </div>
    );
  }
}

Tooltip.propTypes = {
  width: PropTypes.string.isRequired,
  top: PropTypes.bool,
  bottom: PropTypes.bool,
  children: PropTypes.object
};
