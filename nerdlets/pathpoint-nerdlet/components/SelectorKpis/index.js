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

  handleCheckKpi = kpi => {
    const { listKpis } = this.props;
    const index = listKpis.findIndex(kpiObj => kpiObj.index === kpi.index);
    if (this.validateQuantityChecks(listKpis, !listKpis[index].check)) {
      listKpis[index].check = !listKpis[index].check;
      this.props.updateDataKpisChecked(listKpis);
    }
  };

  validateQuantityChecks(kpis, check) {
    let quantity = 0;
    const quantityChecked = kpis.filter(
      kpiObj => kpiObj.query !== '' && kpiObj.check
    );
    quantity = quantityChecked.length;
    if (check) quantity++;
    else quantity--;
    if (quantity > 5) {
      return false;
    } else if (quantity < 1) {
      return false;
    }
    return true;
  }

  render() {
    const { visible } = this.state;
    const { listKpis } = this.props;
    const filterKpis = listKpis.filter(kpiObj => kpiObj.query !== '');
    return (
      <div ref={this.myRef}>
        <div
          style={{
            height: '90%',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={this.handleMenu}
        >
          <Icon />
        </div>
        {visible && (
          <div className="listKpis">
            <div className="listKpis--title">KPI'S</div>
            <div className="listKpis__content">
              {filterKpis.map((kpi, index) => (
                <div key={index} className="listKpis__content--item">
                  <Checkbox
                    id="checkbox"
                    checked={kpi.check}
                    onChange={() => this.handleCheckKpi(kpi)}
                  />
                  <span>{kpi.name}</span>
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
    width="5"
    height="22"
    viewBox="0 0 5 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="2.5" cy="2.5" r="2.5" fill="#828282" />
    <circle cx="2.5" cy="13.5" r="2.5" fill="#828282" />
    <circle cx="2.5" cy="24.5" r="2.5" fill="#828282" />
  </svg>
);
export default index;

index.propTypes = {
  listKpis: PropTypes.array.isRequired,
  updateDataKpisChecked: PropTypes.func.isRequired
};
