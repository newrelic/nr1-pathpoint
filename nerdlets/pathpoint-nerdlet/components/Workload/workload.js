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
        if (workloadValue === 0) {
          return (
            <path
              id="arrow"
              d={workload}
              stroke="#BDBDBD"
              strokeWidth="1"
              fill="#BDBDBD"
            />
          );
        } else if (index < workloadValue) {
          return (
            <path
              id="arrow"
              d={workload}
              stroke="#0aaf77"
              strokeWidth="1"
              fill="#0aaf77"
            />
          );
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
