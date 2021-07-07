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
  banner_kpis,
  ToggleHeaderButtons,
  logoSetup,
  DisplayConsole
}) => {
  const bannerLeftMessage = banner_kpis[0].description;
  const bannerCenterMessage = banner_kpis[1].description;
  const bannerRightMessage = banner_kpis[2].description;
  const bannerLeftValue =
    banner_kpis[0].prefix === '$'
      ? `${FormatMoney(banner_kpis[0].value, DisplayConsole)} ${banner_kpis[0].suffix
      }`
      : `${banner_kpis[0].prefix} ${banner_kpis[0].value} ${banner_kpis[0].suffix}`;
  const bannerCenterValue =
    banner_kpis[1].prefix === '$'
      ? `${FormatMoney(banner_kpis[1].value, DisplayConsole)} ${banner_kpis[1].suffix
      }`
      : `${banner_kpis[1].prefix} ${banner_kpis[1].value} ${banner_kpis[1].suffix}`;
  const bannerRightValue =
    banner_kpis[2].prefix === '$'
      ? `${FormatMoney(banner_kpis[2].value, DisplayConsole)} ${banner_kpis[2].suffix
      }`
      : `${banner_kpis[2].prefix} ${banner_kpis[2].value} ${banner_kpis[2].suffix}`;
  return (
    <div className="containerHeader">
      <div className="quantityDinner">
        <div onClick={openLeftMenu} className="menuLogo">
          <img src={showLeftPanel ? close : lines} height="12px" width="18px" />{' '}
        </div>
        {RenderLogo(logoSetup)}
      </div>
      <div className="kpi">
        <div className="kpicontent">
          <div className="kpicontent--colorgrey kpicontent--size12">
            {bannerLeftMessage}
          </div>
          <div className="kpicontent--colorblack  kpicontent--size16">
            {bannerLeftValue}
          </div>
        </div>
        <div className="kpicontent">
          <div className="kpicontent--colorgrey kpicontent--size12">
            {bannerCenterMessage}
          </div>
          <div className="kpicontent--colorblack  kpicontent--size16">
            {bannerCenterValue}
          </div>
        </div>
        <div className="kpicontent">
          <div className="kpicontent--colorgrey kpicontent--size12">
            {bannerRightMessage}
          </div>
          <div className="kpicontent--colorblack  kpicontent--size16">
            {bannerRightValue}
          </div>
        </div>
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
  banner_kpis: PropTypes.array.isRequired,
  ToggleHeaderButtons: PropTypes.func.isRequired,
  logoSetup: PropTypes.object.isRequired,
  DisplayConsole: PropTypes.func.isRequired
};
