import React from 'react';
import { Tooltip } from '@material-ui/core';

import iconInformation from '../../images/information.svg';
import imagen1 from '../../images/imagesStages/imagen1.svg';
import imagen2 from '../../images/imagesStages/imagen2.svg';
import imagen3 from '../../images/imagesStages/imagen3.svg';
import imagen4 from '../../images/imagesStages/imagen4.svg';
import imagen5 from '../../images/imagesStages/imagen5.svg';
import imagen6 from '../../images/imagesStages/imagen6.svg';
import messages from '../../config/messages.json';

const TooltipStages = () => {
  return (
    <div className="mainTooltip">
      <Tooltip
        id="toolTipStages"
        classes={{ tooltip: 'MuiTooltip-tooltip-3' }}
        disableFocusListener
        title={
          <>
            <div>
              <div style={{ width: '1060px' }} className="tooltipTitle">
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
          </>
        }
      >
        <a>
          <img height="10px" src={iconInformation} />
        </a>
      </Tooltip>
    </div>
  );
};

export default TooltipStages;
