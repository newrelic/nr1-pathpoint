import React from 'react';
import PropTypes from 'prop-types';

const Workload = ({ workloadWidth, workloadValue }) => {
  const arrowHead = 10;
  const arrayPath = [];
  for (let i = 1; i <= 4; i++) {
    const pathWorkload = `M ${arrowHead * i + (i - 1) * workloadWidth} 0 L ${i *
      workloadWidth +
      arrowHead * i} 0 L ${i * workloadWidth + arrowHead * (i - 1)} 13 L ${(i -
      1) *
      workloadWidth +
      arrowHead * (i - 1) +
      0} 13 Z`;
    arrayPath.push(pathWorkload);
  }
  return (
    <svg fill="#ff0000" height="100%" width="100%">
      {arrayPath.map((workload, index) => {
        if (index < workloadValue) {
          if (workloadValue === 1) {
            return (
              <path
                id="arrow"
                d={workload}
                stroke="#e3e6e8"
                strokeWidth="1"
                fill="#e3e6e8"
              />
            );
          } else {
            return (
              <path
                id="arrow"
                d={workload}
                stroke="#01b2ff"
                strokeWidth="1"
                fill="#01b2ff"
              />
            );
          }
        } else {
          return (
            <path
              id="arrow"
              d={workload}
              stroke="#e3e6e8"
              strokeWidth="1"
              fill="#ffffff"
            />
          );
        }
      })}
    </svg>
  );
};

Workload.propTypes = {
  workloadWidth: PropTypes.number.isRequired,
  workloadValue: PropTypes.number.isRequired
};

export default Workload;
