import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class SelectIDs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selected: 0
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    const { options, idSeleccionado } = this.props;
    let idIndex = 0;
    options.map(index => {
      if (index.id === idSeleccionado) {
        idIndex = options.indexOf(index);
        this.setState({ selected: parseInt(idIndex) });
      }
      return 0;
    });
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
    const event = { target: { value: obj.id, name } };
    this.setState({ selected: parseInt(optionSelected) });
    handleOnChange(event);
  };

  render() {
    const { options } = this.props;
    const { selected, open } = this.state;
    return (
      <div
        className="custom-select-wrapper_SelectID"
        onClick={this.clickAction}
        ref={this.myRef}
      >
        <div
          className="custom-select_SelectID"
          style={
            open
              ? { visibility: 'visible', pointerEvents: 'all', opacity: 1 }
              : {}
          }
        >
          <div className="custom-select__trigger_SelectID">
            <span
              style={{
                width: '80px',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}
            >
              {options[selected].id}
            </span>
            <div className="arrow" />
          </div>
          <div
            className="custom-options-SelectID"
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
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div className="id-custom-options">{obj.id}</div>
                  <div className="name-custom-options">{obj.name}</div>
                </div>
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

SelectIDs.propTypes = {
  options: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  idSeleccionado: PropTypes.number.isRequired
};
