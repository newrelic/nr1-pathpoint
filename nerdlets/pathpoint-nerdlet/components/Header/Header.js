// IMPORT LIBRARIES AND DEPENDENCIES
import React from 'react';
import PropTypes from 'prop-types';
import Select from '../Select/Select';

// IMPORT IMAGES AND STATIC FILES
import lines from '../../images/lines.svg';
import close from '../../images/close.svg';
import logo from '../../images/logo.png';
import fireIcon from '../../images/FireIcon.svg';
import fireIconOn from '../../images/FireIconOn.svg';
import canaryIcon from '../../images/CanaryIcon.svg';
import canaryIconOn from '../../images/CanaryIconOn.svg';
import sixthSenseIcon from '../../images/SixthSense.svg';
import sixthSenseIconOn from '../../images/SixthSenseOn.svg';
import goutIcon from '../../images/GoutIcon.svg';
import goutIconOn from '../../images/goutBlack.svg';

// New KPI Tool Components
import RangeDateSelector from '../RangeTime';
import SelectorKpis from '../SelectorKpis';

const Header = ({
  iconSixthSenseStatus,
  activeSixthSenseIcon,
  iconCanaryStatus,
  iconFireStatus,
  iconStartStatus,
  changeTimeRange,
  iconGoutStatus,
  showLeftPanel,
  openLeftMenu,
  handleContextMenuFire,
  handleContextMenuGout,
  ToggleHeaderButtons,
  logoSetup,
  DisplayConsole,
  // KPI PROPS
  timeRangeKpi,
  changeTimeRangeKpi,
  kpis,
  updateDataKpisChecked,
  saveKpis,
}) => {

  const merchant = 0;
  const filterKpis = kpis.filter(kpi=>kpi.query!==''&&kpi.check);

  return (
    <div className="containerHeader">
      <div className="quantityDinner">
        <div onClick={openLeftMenu} className="menuLogo">
          <img src={showLeftPanel ? close : lines} height="12px" width="18px" />{' '}
        </div>
        {RenderLogo(logoSetup)}
      </div>
      <div className="kpi">
        <RangeDateSelector
          timeRangeKpi={timeRangeKpi}
          additionalAction={changeTimeRangeKpi}
          options={[
            {
              label: 'DAY',
              value: '24 HOURS AGO'
            },
            {
              label: 'WEEK',
              value: '7 DAYS AGO'
            },
            {
              label: 'MONTH',
              value: '30 DAYS AGO'
            },
            {
              label: 'YDT',
              value: '365 DAYS AGO'
            }
          ]}
        />
        {merchant === 0 ? <>{filterKpis.map((kpi, index) =>
          <div key={index} style={{ cursor: kpi.link !== '' ? 'pointer' : 'default' }} onClick={() => { kpi.link !== '' && window.open(kpi.link) }} className="kpicontent">
            <div className="kpicontent--colorgrey kpicontent--size10">
              {kpi.shortName}
            </div>
            <div className="kpicontent--colorblack kpicontent--size12">
              {kpi.value}
            </div>
          </div>
        )}</> : <>
          <div className="kpicontent" style={{ cursor: kpisMerchant[1].link !== '' ? 'pointer' : 'default' }} onClick={() => { kpisMerchant[0].link !== '' && window.open(kpisMerchant[0].link) }}>
            <div className="kpicontent--colorgrey kpicontent--size10">
              {kpisMerchant[0].shortName}
            </div>
            <div className="kpicontent--colorblack kpicontent--size12">
              {kpisMerchant[0].value}
            </div>
          </div>
          <div className="kpicontent" style={{ cursor: kpisMerchant[1].link !== '' ? 'pointer' : 'default' }} onClick={() => { kpisMerchant[1].link !== '' && window.open(kpisMerchant[1].link) }}>
            <div className="kpicontent--colorgrey kpicontent--size10">
              {kpisMerchant[1].shortName}
            </div>
            <div className="kpicontent--colorblack kpicontent--size12">
              {fkpiUSD}
            </div>
          </div>
          <div className="kpicontent" style={{ cursor: kpisMerchant[1].link !== '' ? 'pointer' : 'default' }} onClick={() => { kpisMerchant[2].link !== '' && window.open(kpisMerchant[2].link) }}>
            <div className="kpicontent--colorgrey kpicontent--size10">
              {kpisMerchant[2].shortName}
            </div>
            <div className="kpicontent--colorblack kpicontent--size12">
              {kpiAVG}
            </div>
          </div>
        </>}
        {merchant === 0 && <SelectorKpis listKpis={kpis} updateDataKpisChecked={updateDataKpisChecked} saveKpis={saveKpis} />}
      </div>
      <span
        className="budgetLoss"
        style={{
          visibility:
            iconGoutStatus | iconStartStatus | iconFireStatus
              ? 'visible'
              : 'hidden',
          color: iconFireStatus && 'red'
        }}
      />
      <div className="distributionIcons">
        <div
          style={{ visibility: 'hidden' }}
          className="fireIconContainer"
          onClick={() => {
            activeSixthSenseIcon();
          }}
        >
          <img
            style={{ height: '18px' }}
            src={iconSixthSenseStatus ? sixthSenseIconOn : sixthSenseIcon}
          />
        </div>
        <div
          className="fireIconContainer"
          onClick={() => {
            ToggleHeaderButtons('iconCanaryStatus');
          }}
        >
          <img
            style={{ height: '18px' }}
            src={iconCanaryStatus ? canaryIconOn : canaryIcon}
          />
        </div>
        <div
          className="fireIconContainer"
          onClick={() => {
            ToggleHeaderButtons('iconFireStatus');
          }}
          onMouseDown={handleContextMenuFire}
        >
          <img
            style={{ height: '18px' }}
            src={iconFireStatus ? fireIconOn : fireIcon}
          />
        </div>
        <div
          className="fireIconContainer"
          onClick={() => {
            ToggleHeaderButtons('iconGoutStatus');
          }}
          onMouseDown={handleContextMenuGout}
        >
          <img
            style={{ height: '18px' }}
            src={iconGoutStatus ? goutIconOn : goutIcon}
          />
        </div>


        <Select
          name="header"
          handleOnChange={changeTimeRange}
          options={options}
        />
      </div>
    </div>
  );
};

const options = [
  { label: 'now', value: '5 MINUTES AGO' },
  { label: '30 minutes', value: '30 MINUTES AGO' },
  { label: '60 minutes', value: '60 MINUTES AGO' },
  { label: '3 hours', value: '3 HOURS AGO' },
  { label: '6 hours', value: '6 HOURS AGO' },
  { label: '12 hours', value: '12 HOURS AGO' },
  { label: '24 hours', value: '24 HOURS AGO' },
  { label: '3 days', value: '3 DAYS AGO' },
  { label: '7 days', value: '7 DAYS AGO' }
];

const FormatMoney = (
  amount,
  DisplayConsole,
  decimalCount = 2,
  decimal = '.',
  thousands = ','
) => {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
    const i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    const j = i.length > 3 ? i.length % 3 : 0;
    return `${amount < 0 ? '-' : ''}$${j ? i.substr(0, j) + thousands : ''
      }${i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${thousands}`)}${decimalCount
        ? decimal +
        Math.abs(amount - i)
          .toFixed(decimalCount)
          .slice(2)
        : ''
      }`;
  } catch (e) {
    DisplayConsole('error', `Error in format money ${e}`);
  }
};

const RenderLogo = logoSetup => {
  switch (logoSetup.type.toLowerCase()) {
    case 'default':
      return (
        <div className="logo-container">
          <img src={logo} />
        </div>
      );
    case 'text':
      return (
        <div className="logo-text-container">
          <p>{logoSetup.text}</p>
        </div>
      );
    default:
      return (
        <div className="logo-container">
          <img src={logoSetup.url} />
        </div>
      );
  }
};

export { RenderLogo, FormatMoney };
export default Header;

Header.propTypes = {
  iconSixthSenseStatus: PropTypes.bool.isRequired,
  activeSixthSenseIcon: PropTypes.func,
  iconCanaryStatus: PropTypes.bool.isRequired,
  iconFireStatus: PropTypes.bool.isRequired,
  iconStartStatus: PropTypes.bool.isRequired,
  changeTimeRange: PropTypes.func.isRequired,
  iconGoutStatus: PropTypes.bool.isRequired,
  showLeftPanel: PropTypes.bool.isRequired,
  openLeftMenu: PropTypes.func.isRequired,
  handleContextMenuFire: PropTypes.func.isRequired,
  handleContextMenuGout: PropTypes.func.isRequired,
  ToggleHeaderButtons: PropTypes.func.isRequired,
  logoSetup: PropTypes.object.isRequired,
  DisplayConsole: PropTypes.func.isRequired
};
