import React, { Component } from "react";
import { Tooltip } from "@material-ui/core";

import iconInformation from "../../images/information.svg";
import imagen1 from "../../images/imagesTouchpoints/imagen1.svg";
import imagen2 from "../../images/imagesTouchpoints/imagen2.svg";
import imagen3 from "../../images/imagesTouchpoints/imagen3.svg";
import messages from "../../config/messages.json";
// import closeIcon from "../../images/closeIcon.svg";

export default class TooltipTouchPoints extends Component {
  methodRenderTooltp() {
    return (
      <>
        <Tooltip
          id="toolTipTouchPoints"
          //open={true}
          classes={{ tooltip: "MuiTooltip-tooltip-3" }}
          disableFocusListener
          title={
            <>
              <div>
                <div className="arrow-down " />

                <div style={{ width: "800px" }} className="tooltipTitle">
                  <div className="tooltipTitle__title">Touchpoints</div>
                </div>
                <div className="tooltipTitleLine" />
                <div className="tooltipContent">
                  <div className="tooltipContent__content--two">
                    <div className="tooltipContent__space">
                      <p className="tooltipContent__text">
                        {messages.tooltip.touchpoints.message_touchpoints_01}
                      </p>                   
                    </div>
                    <div className="tooltipContent__space">
                      <img width="300" height="200" src={imagen1} />
                    </div>
                  </div>
                  <div className="tooltipContent__content--two">
                    <div className="tooltipContent__space">
                      <img src={imagen2} />
                    </div>
                    <div className="tooltipContent__space">
                      <p className="tooltipContent__text">
                        {messages.tooltip.touchpoints.message_touchpoints_02}
                      </p>
                    </div>
                    <div className="tooltipContent__space">
                      <img src={imagen3} />
                    </div>
                    <div className="tooltipContent__space">
                      <p className="tooltipContent__text">
                        {messages.tooltip.touchpoints.message_touchpoints_03}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          }
        >
          <a>
            <img height="10px" src={iconInformation} />
          </a>
        </Tooltip>
      </>
    );
  }

  render() {
    return <div className="mainTooltip">{this.methodRenderTooltp()}</div>;
  }
}
