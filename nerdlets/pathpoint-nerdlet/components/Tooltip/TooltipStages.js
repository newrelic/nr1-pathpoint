import React from 'react';
import imagen1 from '../../images/imagesStages/imagen1.png';
import imagen2 from '../../images/imagesStages/imagen2.png';
import imagen3 from '../../images/imagesStages/imagen3.png';
import imagen4 from '../../images/imagesStages/imagen4.png';
import imagen5 from '../../images/imagesStages/imagen5.png';
import imagen6 from '../../images/imagesStages/imagen6.png';
import messages from '../../config/messages.json';

const TooltipStages = () => {
  return (
    <div>
      <div>
        <div className="tooltipTitle">
          <div className="tooltipTitle__title">Stages</div>
        </div>
        <div className="tooltipTitleLine" />
        <div className="tooltipContent">
          <div className="tooltipContent__content">
            <div className="tooltipContent__space">
              <p className="tooltipContent__text">
                {messages.tooltip.stages.message_stages_01}
              </p>
            </div>
            <div className="tooltipContent__space">
              <img width="300" src={imagen1} />
            </div>
          </div>
          <div className="tooltipContent__content">
            <div className="tooltipContent__space">
              <img src={imagen2} />
            </div>
            <div className="tooltipContent__space">
              <p className="tooltipContent__text">
                {messages.tooltip.stages.message_stages_02}
              </p>
            </div>
            <div className="tooltipContent__space">
              <img src={imagen3} />
            </div>
            <div className="tooltipContent__space">
              <p className="tooltipContent__text">
                {messages.tooltip.stages.message_stages_03}
              </p>
            </div>
            <div className="tooltipContent__space">
              <img src={imagen4} />
            </div>
            <div className="tooltipContent__space">
              <p className="tooltipContent__text">
                {messages.tooltip.stages.message_stages_04}
              </p>
            </div>
          </div>
          <div className="tooltipContent__content">
            <div className="tooltipContent__space">
              <img src={imagen5} />
            </div>
            <div className="tooltipContent__space">
              <p className="tooltipContent__text">
                {messages.tooltip.stages.message_stages_05}
              </p>
            </div>
            <div className="tooltipContent__space">
              <img src={imagen6} />
            </div>
            <div className="tooltipContent__space">
              <p className="tooltipContent__text">
                {messages.tooltip.stages.message_stages_06}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TooltipStages;
