import React from "react";

import lines from "../../images/lines.svg";
import close from "../../images/close.svg";

import logo from "../../images/logo.png";
import fireIcon from "../../images/FireIcon.svg";
import fireIconOn from "../../images/FireIconOn.svg";
import startIcon from "../../images/StartIcon.svg";
import startIconOn from "../../images/StartIconOn.svg";
import goutIcon from "../../images/gout.svg";
import goutIconOn from "../../images/goutBlack.svg";
import canaryIcon from "../../images/CanaryIcon.svg";
import canaryIconOn from "../../images/CanaryIconOn.svg";
import sixthSenseIcon from "../../images/SixthSense.svg";
import sixthSenseIconOn from "../../images/SixthSenseOn.svg";
import Select from "react-select";
import messages from "../../config/messages.json";
import { Spinner } from "nr1";
/**
 *Component header class
 * @export
 * @class Header
 * @extends {React.Component}
 */
export default class Header extends React.Component {
  /**
   *Method that capture click action above icon fire
   *
   * @memberof Header
   */

  activeIconFire = () => {
    this.props.activeFireIcon();
  };

  checkBudget = () => {
    this.props.checkBudget();
  };

  formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

      const negativeSign = amount < 0 ? "-" : "";

      let i = parseInt(
        (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
      ).toString();
      let j = i.length > 3 ? i.length % 3 : 0;

      return (
        negativeSign +
        "$" +
        (j ? i.substr(0, j) + thousands : "") +
        i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
        (decimalCount
          ? decimal +
            Math.abs(amount - i)
              .toFixed(decimalCount)
              .slice(2)
          : "")
      );
    } catch (e) {
      console.log(e);
    }
  }

  RenderLogo = () => {
    if (this.props.logoSetup.type.toLowerCase() === 'default') {
      return (
        <div className="logo-container">
          <img src={logo} />
        </div>
      )
    } else if (this.props.logoSetup.type === 'Text') {
      return (
        <div className="logo-text-container">
          <p>
            { this.props.logoSetup.text }
          </p>
        </div>
      )
    } else {
      return (
        <div className="logo-container">
          <img src={this.props.logoSetup.url} />
        </div>
      )
    }
  }

  render() {
    let {
      iconSixthSenseStatus,
      activeSixthSenseIcon,
      iconCanaryStatus,
      iconFireStatus,
      iconStartStatus,
      changeTimeRange,
      iconGoutStatus,
      showLeftPanel,
      openLeftMenu,
      handleContextMenuGout,
      handleContextMenuStar,
      handleContextMenuFire,
      banner_kpis,
      ToggleHeaderButtons
    } = this.props;
    let bannerLeftMessage = banner_kpis[0].description;
    let bannerCenterMessage = banner_kpis[1].description;
    let bannerRightMessage = banner_kpis[2].description;
    let bannerLeftValue = (banner_kpis[0].prefix=='$') ? this.formatMoney(banner_kpis[0].value) + ' ' + banner_kpis[0].suffix : banner_kpis[0].prefix + ' ' + banner_kpis[0].value+ ' ' + banner_kpis[0].suffix;
    let bannerCenterValue = (banner_kpis[1].prefix=='$') ? this.formatMoney(banner_kpis[1].value) + ' ' + banner_kpis[1].suffix : banner_kpis[1].prefix + ' ' + banner_kpis[1].value+ ' ' + banner_kpis[1].suffix;
    let bannerRightValue = (banner_kpis[2].prefix=='$') ? this.formatMoney(banner_kpis[2].value) + ' ' + banner_kpis[2].suffix : banner_kpis[2].prefix + ' ' + banner_kpis[2].value+ ' ' + banner_kpis[2].suffix;
    const options = [
      { label: "now", value: "5 MINUTES AGO" },
      { label: "30 minutes", value: "30 MINUTES AGO" },
      { label: "60 minutes", value: "60 MINUTES AGO" },
      { label: "3 hours", value: "3 HOURS AGO" },
      { label: "6 hours", value: "6 HOURS AGO" },
      { label: "12 hours", value: "12 HOURS AGO" },
      { label: "24 hours", value: "24 HOURS AGO" },
      { label: "3 days", value: "3 DAYS AGO" },
      { label: "7 days", value: "7 DAYS AGO" },
    ];
    return (
      <div className="containerHeader">
        <div className="quantityDinner">
          <div onClick={openLeftMenu} className="menuLogo">
            <img
              src={showLeftPanel ? close : lines}
              height="12px"
              width="18px"
            />{" "}
          </div>
          {
            this.RenderLogo()
          }
          <div className="citiesSelect" style={{ visibility: "hidden" }}>
            {/* <Select
              onChange={changeMerchant}
              placeholder={merchants[0].label}
              isSearchable={false}
              classNamePrefix="react-select"
              options={merchants}
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
              })}
            /> */}
          </div>
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
                ? "visible"
                : "hidden",
            color: iconFireStatus && "red",
          }}
        ></span>
        <div className="distributionIcons">
          <div
            style={{ visibility: "hidden" }}
            className="fireIconContainer"
            onClick={() => {
              activeSixthSenseIcon();
            }}
          >
            <img
              style={{ height: "18px" }}
              src={iconSixthSenseStatus ? sixthSenseIconOn : sixthSenseIcon}
            />
          </div>
          <div
            className="fireIconContainer"
            onClick={() => {
              ToggleHeaderButtons('iconCanaryStatus')
            }}
          >
            <img
              style={{ height: "18px" }}
              src={iconCanaryStatus ? canaryIconOn : canaryIcon}
            />
          </div>
          <div
            className="fireIconContainer"
            onClick={() => {
              ToggleHeaderButtons('iconGoutStatus')
            }}
            onMouseDown={handleContextMenuGout}
          >
            <img
              style={{ height: "18px" }}
              src={iconGoutStatus ? goutIconOn : goutIcon}
            />
          </div>
          <div
            className="fireIconContainer"
            onClick={() => {
              ToggleHeaderButtons('iconStartStatus')
            }}
            onMouseDown={handleContextMenuStar}
          >
            <img
              style={{ height: "18px" }}
              src={iconStartStatus ? startIconOn : startIcon}
            />
          </div>
          <div
            className="fireIconContainer"
            onClick={() => {
              ToggleHeaderButtons('iconFireStatus')
            }}
            onMouseDown={handleContextMenuFire}
          >
            <img
              style={{ height: "18px" }}
              src={iconFireStatus ? fireIconOn : fireIcon}
            />
          </div>
          <Select
            onChange={changeTimeRange}
            placeholder={"now"}
            isSearchable={false}
            classNamePrefix="react-select"
            options={options}
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
            })}
          />
        </div>
      </div>
    );
  }
}
