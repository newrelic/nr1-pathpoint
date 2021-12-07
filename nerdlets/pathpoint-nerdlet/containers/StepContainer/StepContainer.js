// IMPORT LIBRARIES
import React from 'react';
import PropTypes from 'prop-types';
import Step from '../../components/Step/Step.js';

export default class StepContainer extends React.Component {
  state = {
    quantityOfContainer: []
  };

  componentDidMount() {
    const { totalContainers } = this.props;
    const { quantityOfContainer } = this.state;
    let control = 0;
    while (control !== totalContainers) {
      quantityOfContainer.push({ name: control });
      control += 1;
    }
    this.setState({ quantityOfContainer: quantityOfContainer });
  }

  calculateIndex = () => {
    const { steps } = this.props;
    let index = 1;
    const stepsNew = [];
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
  };

  render() {
    const {
      onclickStep,
      title,
      iconGoutStatus,
      latencyStatus,
      iconCanaryStatus,
      colors,
      iconFireStatus
    } = this.props;
    const { quantityOfContainer } = this.state;
    const steps = this.calculateIndex();
    return (
      <>
        {quantityOfContainer.map((entry, index) => {
          const step = steps[index];
          return (
            <Step
              key={`${title}-${index}`}
              step={step}
              latencyStatus={latencyStatus}
              totalSteps={steps.length}
              onclickStep={onclickStep}
              iconGoutStatus={iconGoutStatus}
              iconCanaryStatus={iconCanaryStatus}
              colors={colors}
              iconFireStatus={iconFireStatus}
            />
          );
        })}
      </>
    );
  }
}

StepContainer.propTypes = {
  steps: PropTypes.array.isRequired,
  onclickStep: PropTypes.func.isRequired,
  title: PropTypes.string,
  iconGoutStatus: PropTypes.bool.isRequired,
  latencyStatus: PropTypes.bool.isRequired,
  iconCanaryStatus: PropTypes.bool.isRequired,
  colors: PropTypes.object.isRequired,
  iconFireStatus: PropTypes.bool.isRequired,
  totalContainers: PropTypes.number.isRequired
};
