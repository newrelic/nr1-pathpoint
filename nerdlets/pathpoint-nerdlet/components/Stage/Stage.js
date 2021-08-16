// IMPORT LIBRARIES AND DEPENDENCIES
import React from 'react';
import PropTypes from 'prop-types';

// IMPORT IMAGES AND STATIC FILES

import DiamondBlue from '../../images/DiamondBlue.svg';
import DiamondWhite from '../../images/Diamond.svg';
import Arrow from '../Arrow/Arrow';
import dangerHeart from '../../images/heart_red.svg';
import goodHeart from '../../images/heart_green.svg';
import warningHeart from '../../images/heart_yellow.svg';

const Stage = ({ stage, onClickStage }) => {
  const textLevelBar = `CONGESTION`;
  let healthIcon = warningHeart;
  if (stage.status_color === 'danger') {
    healthIcon = dangerHeart;
  }
  if (stage.status_color === 'good') {
    healthIcon = goodHeart;
  }
  const indicators = calculate(stage.capacity);
  return (
    <div className="stage">
      <div className="titleStage">
        <div className="growFlex4">
          <div className="contentHealth growFlex4">
            <span className="growFlex4">
              <img style={{ height: '25px' }} src={healthIcon} />
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
          />
        </div>
        <div className="capacityBar">
          {indicators.map((entry, index) => {
            return (
              <img
                key={index}
                style={{ width: '1.27vw', height: '1.27vw' }}
                src={entry.name === 'white' ? DiamondWhite : DiamondBlue}
              />
            );
          })}
        </div>
        <div className="percentText">
          {stage.index === 1
            ? `Infra Workload: ${Math.round(stage.capacity * 100) / 100}%`
            : `${Math.round(stage.capacity * 100) / 100}%`}
        </div>
      </div>
    </div>
  );
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

const calculate = level => {
  const newIndicators = [];
  const quantityObjects = 13;
  const quantityArrowsBlue = parseInt((quantityObjects / 100) * level);
  if (level <= 5) {
    newIndicators.push({ name: 'blue' });
    for (let i = 0; i < quantityObjects - 1; i++) {
      newIndicators.push({ name: 'white' });
    }
  } else if (level >= 100) {
    for (let i = 0; i < quantityObjects; i++) {
      newIndicators.push({ name: 'blue' });
    }
  } else {
    for (let i = 0; i < quantityArrowsBlue; i++) {
      newIndicators.push({ name: 'blue' });
    }
    for (let i = 0; i < quantityObjects - quantityArrowsBlue; i++) {
      newIndicators.push({ name: 'white' });
    }
  }
  return newIndicators;
};

export default Stage;

Stage.propTypes = {
  stage: PropTypes.object.isRequired,
  onClickStage: PropTypes.func.isRequired
};
