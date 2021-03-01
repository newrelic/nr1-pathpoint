import React from 'react';
import PropTypes from 'prop-types';

// IMPORT ICONS
import graphImage from '../../images/graph.png';

// IMPORT COMPONENTS
import { BodyTuneFormModal } from './TuneFormModal';
import { BodyLogoFormModal } from './LogoFormModal';
import { BodyQueryFormModal } from './QueryFormModal';
import { BodyFlameFormModal } from './FlameFormModal';
import { BodyCanaryFormModal } from './CanaryFormModal';
import { BodySupportFormModal } from './SupportFormModal';
import { BodyFileErrorFormModal } from './FileErrorFormModal';
import { BodyJsonConfigurationFormModal } from './JsonConfigurationFormModal';
import { BodyBackgroundProcessesFormModal } from './BackgroundProcessesFormModal';

export default function ShowBody(props) {
  const { viewModal } = props;
  switch (viewModal) {
    case 0:
      return <img src={graphImage} />;
    case 1:
      return <BodyQueryFormModal {...props} />;
    case 2:
      return <BodyTuneFormModal {...props} />;
    case 3:
      return <div />;
    case 4:
      return <BodyJsonConfigurationFormModal {...props} />;
    case 5:
      return <BodySupportFormModal {...props} />;
    case 6:
      return <BodyCanaryFormModal {...props} />;
    case 7:
      return <BodyFlameFormModal {...props} />;
    case 8:
      return <BodyFileErrorFormModal {...props} />;
    case 9:
      return <BodyBackgroundProcessesFormModal {...props} />;
    case 10:
      return <BodyLogoFormModal {...props} />;
  }
}

ShowBody.propTypes = {
  viewModal: PropTypes.number.isRequired
};
