// IMPORT LIBRARIES
import React, { Component } from 'react';
import iconInformation from '../../images/information.svg';

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
  handleOnMouseEnter = e => {
    this.setState({
      show: true,
      clientX: e.clientX,
      clientY: e.clientY
    });
  };

  handleOnMouseLeave = () => {
    this.setState({
      show: false
    });
  };

  // COMPONENT RENDERS
  render() {
    const { show, clientX, clientY, width } = this.state;
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
            style={{ left: clientX, top: clientY, width }}
          >
            {this.props.children}
          </div>
        )}
      </div>
    );
  }
}
