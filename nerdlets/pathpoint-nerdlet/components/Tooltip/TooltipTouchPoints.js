import React from 'react';

import imagen1 from '../../images/imagesTouchpoints/imagen1.svg';
import imagen2 from '../../images/imagesTouchpoints/imagen2.svg';
import imagen3 from '../../images/imagesTouchpoints/imagen3.svg';
import messages from '../../config/messages.json';

const TooltipTouchPoints = () => {
  return (
    <div className="mainTooltip">
      <div>
        <div className="tooltipTitle">
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
    </div>
  );
};

export default TooltipTouchPoints;
