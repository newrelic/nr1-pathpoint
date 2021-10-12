/* eslint-disable react/no-unused-state */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      visible: false,
      selected: 0
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleMenu = () => {
    this.setState(prevState => ({ visible: !prevState.visible }));
  };

  handleOption = (index, option) => {
    this.setState(prevState => ({
      visible: !prevState.visible,
      selected: index
    }));
    this.props.additionalAction(option, index);
  };

  myRef = React.createRef();

  /* istanbul ignore next */
  handleClickOutside = e => {
    if (!this.myRef.current.contains(e.target)) {
      this.setState({ visible: false });
    }
  };

  render() {
    const { visible } = this.state;
    const { options, timeRangeKpi } = this.props;
    return (
      <div ref={this.myRef}>
        <div className="timeRangeContent " onClick={this.handleMenu}>
          {options[timeRangeKpi.index].label}
        </div>
        {visible && (
          <div className="options">
            {options.map((option, index) => (
              <div
                id="optionsBox"
                key={index}
                className={
                  index === timeRangeKpi.index
                    ? 'options--optionselected'
                    : 'options--option'
                }
                onClick={() => this.handleOption(index, option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

index.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.number.isRequired
      ])
    })
  ).isRequired,
  additionalAction: PropTypes.func
};

export default index;
