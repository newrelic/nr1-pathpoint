// IMPORT LIBRARIES AND DEPENDENCIES
import React from 'react';
import PropTypes from 'prop-types';
import Select from '../Select/Select';
import { Icon, navigation } from 'nr1';

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
// import goutIcon from '../../images/GoutIcon.svg';
// import goutIconOn from '../../images/goutBlack.svg';

// New KPI Tool Components
import RangeDateSelector from '../RangeTime';
import SelectorKpis from '../SelectorKpis';
import kpiStatusEqual from '../../images/kpiStatusEqual.svg';
import kpiStatusUpper from '../../images/kpiStatusUpper.svg';
import kpiStatusLower from '../../images/kpiStatusLower.svg';

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
  // handleContextMenuGout,
  ToggleHeaderButtons,
  logoSetup,
  // KPI PROPS
  timeRangeKpi,
  changeTimeRangeKpi,
  kpis,
  updateDataKpisChecked,
  credentials,
  accountId
}) => {
  const filterKpis = kpis.filter(kpi => kpi.check);
  const showLogsLink = credentials.loggin; // TODO logic to hidden
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
        <>
          {filterKpis.map((kpi, index) => {
            return (
              <div
                key={index}
                style={{ cursor: kpi.link !== '' ? 'pointer' : 'default' }}
                onClick={() => {
                  kpi.link !== '' && window.open(kpi.link);
                }}
                className="kpicontent"
              >
                <div className="kpicontent--colorgrey kpicontent--size10">
                  {kpi.shortName}
                </div>
                <div className="kpicontent--colorblack kpicontent--size12">
                  {PrintKPI(kpi)}
                </div>
              </div>
            );
          })}
        </>
        <SelectorKpis
          listKpis={kpis}
          updateDataKpisChecked={updateDataKpisChecked}
        />
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
      <div className="containerRigthtHand">
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
          {/* <div
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
          </div> */}
          <Select
            name="header"
            handleOnChange={changeTimeRange}
            options={options}
          />
        </div>
        <div
          className="viewLogs"
          style={{
            visibility: showLogsLink ? 'visible' : 'hidden',
            cursor: 'pointer'
          }}
          onClick={() => {
            console.log('ACCOUNT-ID:', accountId);
            navigation.openStackedNerdlet({
              id: 'logger.home',
              urlState: {
                accountId: accountId,
                query: 'application: Pathpoint'
              }
            });
          }}
        >
          {/* <Icon type={Icon.TYPE.HARDWARE_AND_SOFTWARE__SOFTWARE__LOGS} /> */}
          See logs
        </div>
      </div>
    </div>
  );
};

const options = [
  { label: 'last 5 minutes', value: '5 MINUTES AGO' },
  { label: '30 minutes ago', value: '30 MINUTES AGO' },
  { label: '60 minutes ago', value: '60 MINUTES AGO' },
  { label: '3 hours ago', value: '3 HOURS AGO' },
  { label: '6 hours ago', value: '6 HOURS AGO' },
  { label: '12 hours ago', value: '12 HOURS AGO' },
  { label: '24 hours ago', value: '24 HOURS AGO' },
  { label: '3 days ago', value: '3 DAYS AGO' },
  { label: '7 days ago', value: '7 DAYS AGO' }
];

const transformK = (value, type) => {
  let decimalCount = 1;
  let million = 1000000;
  let millar = 1000;
  if (type === 'FLOAT') {
    decimalCount = 100;
    million = 10000;
    millar = 10;
  }
  if (value > 1000000) {
    return `${Math.round(value / million) / decimalCount} M`;
  }
  if (value > 1000) {
    return `${Math.round(value / millar) / decimalCount} K`;
  }
  return `${Math.round(value * decimalCount) / decimalCount}`;
};

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
    return `${amount < 0 ? '-' : ''}$${
      j ? i.substr(0, j) + thousands : ''
    }${i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${thousands}`)}${
      decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : ''
    }`;
  } catch (e) {
    /* istanbul ignore next */
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

const CurrentAndPreviousStatus = kpi => {
  return (
    <div className="kpi">
      {kpi.prefix}
      {transformK(kpi.value.current, kpi.value_type)}
      {kpi.suffix}
      <span>{PrintStatus(kpi.value.current - kpi.value.previous)}</span>
    </div>
  );
};

const PrintStatus = value => {
  let printStatus = kpiStatusLower;
  printStatus = value === 0 ? kpiStatusEqual : printStatus;
  printStatus = value > 0 ? kpiStatusUpper : printStatus;
  return (
    <div className="kpi-status">
      <img src={printStatus} />
    </div>
  );
};

const PrintKPI = kpi => {
  if (kpi.type === 100) {
    return (
      <div className="kpi">
        {kpi.prefix}
        {transformK(kpi.value, kpi.value_type)}
        {kpi.suffix}
      </div>
    );
  } else if (kpi.type === 101) {
    return CurrentAndPreviousStatus(kpi);
  } else {
    return `NONE`;
  }
};

export {
  CurrentAndPreviousStatus,
  RenderLogo,
  FormatMoney,
  transformK,
  PrintKPI
};
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
  // handleContextMenuGout: PropTypes.func.isRequired,
  ToggleHeaderButtons: PropTypes.func.isRequired,
  logoSetup: PropTypes.object.isRequired,
  timeRangeKpi: PropTypes.object.isRequired,
  changeTimeRangeKpi: PropTypes.func.isRequired,
  kpis: PropTypes.array.isRequired,
  updateDataKpisChecked: PropTypes.func.isRequired,
  credentials: PropTypes.object.isRequired,
  accountId: PropTypes.number.isRequired
};
