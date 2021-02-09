import React from 'react';
import PropTypes from "prop-types";
import Step from '../../components/Step/Step.js';

export default class StepContainer extends React.Component {
    state = {
        quantityOfContainer: []
    }

    componentWillMount() {
        let { quantityOfContainer } = this.state;
        let control = 0;
        while (control !== 5) {
            quantityOfContainer.push({ name: control });
            control += 1;
        }
    }

    calculateIndex = () => {
        let { steps } = this.props;
        let index = 1;
        let stepsNew = [];
        for (const iterator of steps) {
            if (iterator.value === '') {
                for (const sub of iterator.sub_steps) {
                    if (sub.dotted) {
                        iterator.dotted = true;
                    }
                }
            }
            if (!iterator.dotted) {
                iterator.index = index;
                index += 1;
            }
            stepsNew.push(iterator);
        }
        return stepsNew;
    }

    render() {
        let { onclickStep, title, iconSixthSenseStatus, iconGoutStatus, latencyStatus, iconCanaryStatus, colors ,iconFireStatus} = this.props;
        let { quantityOfContainer } = this.state;
        let steps = this.calculateIndex();
        return (
            <>
                {quantityOfContainer.map((entry, index) => {
                    let step = steps[index];
                    return (
                        <Step 
                            key={`${title}-${index}`} 
                            step={step} 
                            iconSixthSenseStatus={iconSixthSenseStatus} 
                            latencyStatus={latencyStatus} 
                            totalSteps={steps.length} 
                            onclickStep={onclickStep} 
                            iconGoutStatus={iconGoutStatus} 
                            iconCanaryStatus={iconCanaryStatus} 
                            colors={colors} 
                            iconFireStatus={iconFireStatus}/>
                    )
                })}
            </>
        );
    }
}

StepContainer.propTypes = {
    steps: PropTypes.array.isRequired
}