import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Select extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selected: 0
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  myRef = React.createRef();

  /* istanbul ignore next */
  handleClickOutside = e => {
    if (!this.myRef.current.contains(e.target)) {
      this.setState({ open: false });
    }
  };

  clickAction = () => {
    this.setState(prevState => ({ open: !prevState.open }));
  };

  clickSelected = (optionSelected, obj) => {
    const { name, handleOnChange } = this.props;
    const event = { target: { value: obj.value, name } };
    this.setState({ selected: parseInt(optionSelected) });
    handleOnChange(event);
  };

  render() {
    const { options, width } = this.props;
    const { selected, open } = this.state;
    return (
      <div
        className="custom-select-wrapper"
        onClick={this.clickAction}
        ref={this.myRef}
      >
        <div
          className="custom-select"
          style={
            open
              ? { visibility: 'visible', pointerEvents: 'all', opacity: 1 }
              : {}
          }
        >
          <div className="custom-select__trigger">
            <span
              style={{
                width: width ?? '230px',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}
            >
              {options[selected].label}
            </span>
            <div className="arrow" />
          </div>
          <div
            className="custom-options"
            style={
              open
                ? { visibility: 'visible', pointerEvents: 'all', opacity: 1 }
                : {}
            }
          >
            {options.map((obj, index) => (
              <span
                key={index}
                onClick={() => this.clickSelected(index, obj)}
                className={
                  selected === index
                    ? 'custom-option selected'
                    : 'custom-option'
                }
              >
                {obj.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

Select.propTypes = {
  options: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  width: PropTypes.string
};
