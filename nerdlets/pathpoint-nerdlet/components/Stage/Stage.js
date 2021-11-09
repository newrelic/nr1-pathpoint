// IMPORT LIBRARIES AND DEPENDENCIES
import React from 'react';
import PropTypes from 'prop-types';

// IMPORT IMAGES AND STATIC FILES
import Arrow from '../Arrow/Arrow';
import Workload from '../Workload/workload';
import dangerHeart from '../../images/Red.svg';
import goodHeart from '../../images/Green.svg';
import warningHeart from '../../images/Yellow.svg';

const Stage = ({ stage, onClickStage }) => {
  const textLevelBar = ``;
  let healthIcon = warningHeart;
  if (stage.status_color === 'danger') {
    healthIcon = dangerHeart;
  }
  if (stage.status_color === 'good') {
    healthIcon = goodHeart;
  }
  const capacity = GetCapacity(stage.capacity);
  const status = GetStatus(stage.capacity);
  return (
    <div className="stage">
      <div className="titleStage">
        <div className="growFlex4">
          <div className="contentHealth growFlex4">
            <span className="growFlex4">
              <img style={{ height: '10px' }} src={healthIcon} />
              <span className="brakeTittle">{`${stage.title}`}</span>
            </span>
            <span className="quantiyTitleStage">{`${transformK(
              stage.total_count
            )}`}</span>
          </div>
        </div>
      </div>
      <div className="arrowStage">
        <div
          onClick={() => {
            onClickStage(stage.index);
          }}
          style={{ cursor: 'pointer' }}
        >
          <Arrow
            arrowWidth={250}
            valueCongestion={stage.congestion.percentage}
            percentageCongestion={stage.congestion.percentage}
            trafficIconType={stage.trafficIconType}
            textLevelBar={textLevelBar}
            arrowMode={stage.arrowMode ?? ''}
          />
        </div>
        <div
          className="capacityBar"
          style={SetCursorStyle(stage.capacity_link)}
          onClick={() => {
            if (stage.capacity_link !== false) {
              window.open(stage.capacity_link);
            }
          }}
        >
          <Workload workloadWidth={40} workloadValue={status} />
        </div>
        <div className="percentText">{`Infra: ${capacity}`}</div>
      </div>
    </div>
  );
};

const SetCursorStyle = link => {
  if (link !== false) {
    return { cursor: 'pointer' };
  }
  return { cursor: 'default' };
};

const GetCapacity = capacity => {
  if (
    capacity === 'OPERATIONAL' ||
    capacity === 'DEGRADED' ||
    capacity === 'DISRUPTED' ||
    capacity === 'UNKNOWN'
  ) {
    return capacity;
  }
  return '';
};

const GetStatus = capacity => {
  switch (capacity) {
    case 'OPERATIONAL':
      return 4;
    case 'DEGRADED':
      return 3;
    case 'DISRUPTED':
      return 2;
    case 'UNKNOWN':
      return 1;
    default:
      return 0;
  }
};

const transformK = value => {
  if (value > 1000000) {
    return `${Math.round(value / 1000000)} M`;
  }
  if (value > 1000) {
    return `${Math.round(value / 1000)} K`;
  }
  return value;
};

export default Stage;

Stage.propTypes = {
  stage: PropTypes.object.isRequired,
  onClickStage: PropTypes.func.isRequired
};
