// IMPORT LIBRARIES AND DEPENDENCIES
import React from 'react';
import PropTypes from 'prop-types';

const Step = ({
  step,
  onclickStep,
  iconGoutStatus,
  latencyStatus,
  iconCanaryStatus,
  colors,
  iconFireStatus
}) => {
  const { dark } = colors.steps_touchpoints[0];
  const darkColor = `rgb(${dark[0]},${dark[1]},${dark[2]})`;
  const setUrl = '';
  return (
    <>
      {step ? (
        <div
          className="divStep"
          onClick={() => {
            if (step.value !== '') {
              onclickStep(step);
            }
          }}
          style={{ cursor: setUrl !== '' ? 'pointer' : null }}
        >
          {step.dotted ? <></> : <div className="circleStep">{step.index}</div>}
          <div className="divContentStep">
            {step.sub_steps.map((entry, index) => {
              if (index === 0) {
                return (
                  <div
                    key={`${entry.value}-${index}`}
                    className="textContentSubFirstStep"
                    style={{
                      border: StyleSubStep(entry, colors, iconFireStatus),
                      background: BackgroundSubStep(
                        entry,
                        iconGoutStatus,
                        darkColor,
                        iconCanaryStatus,
                        latencyStatus
                      ),
                      color: TextColorStep(
                        iconGoutStatus,
                        entry,
                        latencyStatus,
                        iconCanaryStatus
                      )
                    }}
                    onClick={() => {
                      onclickStep(entry);
                    }}
                  >
                    {entry.value}
                  </div>
                );
              }
              return (
                <div
                  key={`${entry.value}-${index}`}
                  className="textContentSubSecondStep"
                  style={{
                    border: StyleSubStep(entry, colors, iconFireStatus),
                    background: BackgroundSubStep(
                      entry,
                      iconGoutStatus,
                      darkColor,
                      iconCanaryStatus,
                      latencyStatus
                    ),
                    color: TextColorStep(
                      iconGoutStatus,
                      entry,
                      latencyStatus,
                      iconCanaryStatus
                    )
                  }}
                  onClick={() => {
                    onclickStep(entry);
                  }}
                >
                  {entry.value}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="divStep">
          <div className="divContentStep">
            <div className="textEmptyStep" />
          </div>
        </div>
      )}
    </>
  );
};

const StyleSubStep = (step, colors, iconFireStatus) => {
  const {
    select_color,
    unselect_color,
    error_color
  } = colors.steps_touchpoints[0];
  const errorColor = `rgb(${error_color[0]},${error_color[1]},${error_color[2]})`;
  const selectStepColor = `rgb(${select_color[0]},${select_color[1]},${select_color[2]})`;
  const unselectStepColor = `rgb(${unselect_color[0]},${unselect_color[1]},${unselect_color[2]})`;
  if (iconFireStatus && step.history_error) {
    return `2px solid ${errorColor}`;
  } else if (step.highlighted) {
    return `2px solid ${selectStepColor}`;
  } else if (step.error && !iconFireStatus) {
    return `2px solid ${errorColor}`;
  } else if (step.dotted) {
    return `1px dashed ${unselectStepColor}`;
  }
  return `2px solid ${unselectStepColor}`;
};

const BackgroundSubStep = (
  step,
  iconGoutStatus,
  darkColor,
  iconCanaryStatus,
  latencyStatus
) => {
  if (iconGoutStatus && step.dark) {
    return darkColor;
  }

  if (latencyStatus && step.latency) {
    return '#144869';
  }

  if (iconCanaryStatus && step.canary_state) {
    return '#F2CA4B';
  }

  return 'white';
};

const TextColorStep = (
  iconGoutStatus,
  step,
  latencyStatus,
  iconCanaryStatus
) => {
  if (iconCanaryStatus) {
    if (step.canary_state) {
      return '#333333';
    }
  }
  if (latencyStatus) {
    if (step.latency) {
      return 'white';
    }
  }
  if (iconGoutStatus && step.dark) {
    return 'white';
  }
  return '#333333';
};

export { TextColorStep, BackgroundSubStep, StyleSubStep };
export default Step;

Step.propTypes = {
  step: PropTypes.object,
  onclickStep: PropTypes.func.isRequired,
  iconGoutStatus: PropTypes.bool.isRequired,
  latencyStatus: PropTypes.bool.isRequired,
  iconCanaryStatus: PropTypes.bool.isRequired,
  colors: PropTypes.object.isRequired,
  iconFireStatus: PropTypes.bool.isRequired
};
