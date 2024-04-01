import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-bootstrap';

class index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      visible: false
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

  myRef = React.createRef();

  /* istanbul ignore next */
  handleClickOutside = e => {
    if (!this.myRef.current.contains(e.target)) {
      this.setState({ visible: false });
    }
  };

  handleCheckItem = element => {
    const { dataValues } = this.props;
    const index = dataValues.findIndex(item => item.name === element.name);
    dataValues[index].check = !dataValues[index].check;
    this.props.updateDataChecked(this.GetValues(dataValues));
  };

  GetValues(values) {
    const data = [];
    values.forEach(item => {
      if (item.check) {
        data.push(item.name);
      }
    });
    return data;
  }

  showTitles(data) {
    let titles = '';
    data.forEach(element => {
      if (element.check) {
        if (titles !== '') {
          titles += '+';
        }
        titles += element.name;
      }
    });
    return titles;
  }

  render() {
    const { visible } = this.state;
    const { dataValues } = this.props;
    return (
      <div ref={this.myRef} style={{ display: 'inline-block' }}>
        <div
          style={{
            height: '90%',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            width: '100%',
            paddingTop: '5px',
            paddingBottom: '3px',
            paddingLeft: '5px',
            paddingRight: '5px',
            backgroundColor: '#E7E9EA',
            marginLeft: '10px',
            borderRadius: '4px'
          }}
          onClick={this.handleMenu}
        >
          <span
            className="AAQMAC-wnd-DropdownTrigger-button-title"
            style={{ fontSize: '9px' }}
          >
            {this.showTitles(dataValues)}
          </span>
          <span
            className="AAQMAC-wnd-Icon AAQMAC-wnd-Spacing AAQMAC-wnd-DropdownTrigger-button-chevron ic-Icon"
            style={{ fontSize: '8px' }}
          >
            <Icon />
          </span>
        </div>
        {visible && (
          <div className="listAlert">
            <div className="listAlert__content">
              {dataValues.map((item, index) => (
                <div key={index} className="listAlert__content--item">
                  <Checkbox
                    id="checkbox"
                    checked={item.check}
                    onChange={() => this.handleCheckItem(item)}
                  />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const Icon = () => (
  <svg
    role="presentation"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 8 8"
    focusable="false"
  >
    <path d="M6.6 1.6L4 4.3 1.4 1.6l-.8.8L4 5.7l3.4-3.3z" />
  </svg>
);

export default index;

index.propTypes = {
  dataValues: PropTypes.array.isRequired,
  updateDataChecked: PropTypes.func.isRequired
};
