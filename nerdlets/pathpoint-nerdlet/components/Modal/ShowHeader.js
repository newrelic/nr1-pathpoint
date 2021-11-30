import React from 'react';
import PropTypes from 'prop-types';

// IMPORT ICONS
import medalIcon from '../../images/medalIcon.svg';
import startIcon from '../../images/StartIcon.svg';
import startIconOn from '../../images/StartIconOn.svg';
import medalIconOn from '../../images/medalIconOn.svg';

// IMPORT COMPONENTS
import { HeaderTuneFormModal } from './TuneFormModal';
import { HeaderLogoFormModal } from './LogoFormModal';
import { HeaderQueryFormModal } from './QueryFormModal';
import { HeaderFlameFormModal } from './FlameFormModal';
import { HeaderCanaryFormModal } from './CanaryFormModal';
import { HeaderSupportFormModal } from './SupportFormModal';
import { HeaderFileErrorFormModal } from './FileErrorFormModal';
import { HeaderJsonConfigurationFormModal } from './JsonConfigurationFormModal';
import { HeaderGeneralConfigurationFormModal } from './GeneralConfigurationFormModal';
import { HeaderBackgroundProcessesFormModal } from './BackgroundProcessesFormModal';

export default function ShowHeader(props) {
  const {
    viewModal,
    stageNameSelected,
    changeMessage
    // accountIDs,
    // changeID
  } = props;
  switch (viewModal) {
    case 0:
      return (
        <>
          {stageNameSelected.icon_description === 'medal' ? (
            <div style={{ display: 'flex' }}>
              <img
                style={{
                  width: '26px',
                  height: '26px',
                  marginLeft: '5px'
                }}
                src={stageNameSelected.icon_active ? medalIconOn : medalIcon}
              />
              <div className="titleModal">{stageNameSelected.title}</div>
            </div>
          ) : (
            <div style={{ display: 'flex' }}>
              <img
                style={{
                  width: '26px',
                  height: '26px',
                  marginLeft: '5px'
                }}
                src={stageNameSelected.icon_active ? startIconOn : startIcon}
              />
              <div className="titleModal">{stageNameSelected.title}</div>
            </div>
          )}
        </>
      );
    case 1:
      return (
        <HeaderQueryFormModal
          stageNameSelected={stageNameSelected}
          changeMessage={changeMessage}
          // accountIDs={accountIDs}
          // changeID={changeID}
        />
      );
    case 2:
      return <HeaderTuneFormModal stageNameSelected={stageNameSelected} />;
    case 3:
      return (
        <>
          <div style={{ display: 'flex' }}>
            <div className="titleModal">
              {stageNameSelected.touchpoint.value}
            </div>
          </div>
        </>
      );
    case 4:
      return <HeaderJsonConfigurationFormModal />;
    case 5:
      return <HeaderSupportFormModal />;
    case 6:
      return <HeaderCanaryFormModal />;
    case 7:
      return <HeaderFlameFormModal />;
    case 8:
      return <HeaderFileErrorFormModal />;
    case 9:
      return <HeaderGeneralConfigurationFormModal />;
    case 10:
      return <HeaderLogoFormModal />;
    case 11:
      return <HeaderBackgroundProcessesFormModal />;
  }
}

ShowHeader.propTypes = {
  viewModal: PropTypes.number.isRequired,
  stageNameSelected: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.object.isRequired,
    PropTypes.number.isRequired
  ]),
  changeMessage: PropTypes.func.isRequired
  // accountIDs: PropTypes.array.isRequired,
  // changeID: PropTypes.number.isRequired
};
