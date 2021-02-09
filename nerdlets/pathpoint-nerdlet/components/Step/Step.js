
import React from 'react';
import PropTypes from "prop-types";
import peopleIcon from "../../images/People.svg";

/**
 *Step component classs
 *
 * @export
 * @class Step
 * @extends {React.Component}
 */
export default class Step extends React.Component {
    /**
   * Method that configures the style object for the step
   *
   * @param {Object} step The step props
   * @param {number} totalSteps The total of steps for this Stage
   * @returns Object
   * @memberof Step
   */

    styleSubStep = (step, colors, iconFireStatus) => {
        let { select_color, unselect_color, error_color } = colors.steps_touchpoints[0];
        let errorColor = `rgb(${error_color[0]},${error_color[1]},${error_color[2]})`;
        let selectStepColor = `rgb(${select_color[0]},${select_color[1]},${select_color[2]})`;
        let unselectStepColor = `rgb(${unselect_color[0]},${unselect_color[1]},${unselect_color[2]})`;
        if (step.highlighted) {
            return `2px solid ${selectStepColor}`;
        } else if (step.error | (iconFireStatus && step.history_error)) {
            return `2px solid ${errorColor}`
        } else if (step.dotted) {
            return `1px dashed ${unselectStepColor}`
        }
        return `2px solid ${unselectStepColor}`;

    }
    backgroundSubStep = (step, iconGoutStatus, darkColor, iconCanaryStatus, latencyStatus, iconSixthSenseStatus) => {
        let color = "white";

        if (iconGoutStatus && step.dark) {
            color = darkColor
        }

        if (latencyStatus) {
            if (step.latency) {
                color = '#144869';
            }
        }

        if (iconCanaryStatus) {
            if (step.canary_state) {
                color = '#F2CA4B';
            }
        }

        if (iconSixthSenseStatus && step.sixth_sense) {
            color = '#C0C0C0';
        }

        return color;
    }
    backgroundStep = (step, iconGoutStatus, darkColor, iconCanaryStatus, latencyStatus) => {

        let color = "white";
        if (!iconCanaryStatus) {
            if (iconGoutStatus && step.dark) {
                color = darkColor;
            }
        }

        if (latencyStatus) {
            if (step.latency) {
                color = '#144869';
            }
        }

        if (iconCanaryStatus) {
            if (step.canary_state) {
                color = '#F2CA4B';
            }
        }

        return color;
    }

    textColorStep(iconGoutStatus, step, latencyStatus, iconCanaryStatus) {
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
    }


    render() {
        let { step, onclickStep, iconSixthSenseStatus, iconGoutStatus, latencyStatus, iconCanaryStatus, colors, iconFireStatus } = this.props;
        let { dark } = colors.steps_touchpoints[0];
        let darkColor = `rgb(${dark[0]},${dark[1]},${dark[2]})`;
        let setUrl = '';
        return (<>
            {step ?
                <div
                    className="divStep"
                    onClick={() => {
                        if (step.value !== '') {
                            onclickStep(step)
                        }
                    }}
                    style={{ cursor: setUrl !== "" ? "pointer" : null }}>
                    {step.dotted ? <></> : <div className="circleStep">
                        {step.index}
                    </div>}
                    <div className="divContentStep" >
                        {step.sub_steps.map((entry, index) => {
                            if (index === 0) {
                                return (
                                    <div key={`${entry.value}-${index}`} className="textContentSubFirstStep"
                                        style={{
                                            border: this.styleSubStep(entry, colors, iconFireStatus),
                                            background: this.backgroundSubStep(entry, iconGoutStatus, darkColor, iconCanaryStatus, latencyStatus, iconSixthSenseStatus),
                                            color: this.textColorStep(iconGoutStatus, entry, latencyStatus, iconCanaryStatus)
                                        }} onClick={() => {
                                            onclickStep(entry);
                                        }}>
                                        {entry.value}
                                    </div>
                                )
                            }
                            return <div key={`${entry.value}-${index}`} className="textContentSubSecondStep" style={{
                                border: this.styleSubStep(entry, colors, iconFireStatus),
                                background: this.backgroundSubStep(entry, iconGoutStatus, darkColor, iconCanaryStatus, latencyStatus, iconSixthSenseStatus),
                                color: this.textColorStep(iconGoutStatus, entry, latencyStatus, iconCanaryStatus)
                            }} onClick={() => {
                                onclickStep(entry);
                            }}>
                                {entry.value}
                            </div>
                        })}
                    </div>
                </div> :
                <div className="divStep">
                    <div className="divContentStep" >
                        <div className="textEmptyStep" />
                    </div>
                </div>
            }
        </>);
    }
}

Step.propTypes = {
    step: PropTypes.object,
    totalSteps: PropTypes.number
};
