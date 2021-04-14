// IMPORT LIBRARIES
import React from 'react';
import PropTypes from 'prop-types';
import Step from '../../components/Step/Step.js';

export default class StepContainer extends React.Component {
  state = {
    quantityOfContainer: [],
    stylesContext: {
      top: '',
      left: '',
      show: false,
      step: {}
    }
  };

  componentDidMount() {
    const { quantityOfContainer } = this.state;
    let control = 0;
    while (control !== 6) {
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

  handleContextStep = (event, step) => {
    if (event.button === 2) {
      event.preventDefault();
      const clickX = event.clientX;
      const clickY = event.clientY;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const stylesContext = {
        left: '',
        top: '',
        show: true,
        step
      };
      stylesContext.left = `${clickX + 5}px`;
      stylesContext.top = `${clickY + 5}px`;
      if (clickX + 160 > screenW) {
        stylesContext.left = `${clickX - 160 + 5}px`;
      }
      if (clickY + 180 > screenH) {
        stylesContext.top = `${clickY - 180 + 5}px`;
      }
      this.setState({ stylesContext });
    }
  };

  closeContext = (event) => {
    event.preventDefault();
    this.setState({
      stylesContext: {
        top: '',
        left: '',
        show: false,
        step: {}
      }
    });
  };

  render() {
    const {
      onclickStep,
      title,
      iconSixthSenseStatus,
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
              iconSixthSenseStatus={iconSixthSenseStatus}
              latencyStatus={latencyStatus}
              totalSteps={steps.length}
              onclickStep={onclickStep}
              iconGoutStatus={iconGoutStatus}
              iconCanaryStatus={iconCanaryStatus}
              colors={colors}
              iconFireStatus={iconFireStatus}
              handleContextStep={this.handleContextStep}
            />
          );
        })}
        {this.state.stylesContext.show && (
          <div>
            <div
              onClick={event => this.closeContext(event)}
              onMouseDown={event => this.closeContext(event)}
              style={{
                position: 'fixed',
                top: '0',
                bottom: '0',
                left: '0',
                right: '0',
                zIndex: '8888'
              }}
            />
            <div
              style={{
                position: 'fixed',
                top: this.state.stylesContext.top,
                left: this.state.stylesContext.left,
                backgroundColor: 'white',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'lightgrey',
                zIndex: '999999',
                padding: '15px',
                borderRadius: '3px'
              }}
            >
              <p style={{ margin: '0px' }}>
                Count: {this.state.stylesContext.step.sub_steps[0].count}
              </p>
            </div>
          </div>
        )}
      </>
    );
  }
}

StepContainer.propTypes = {
  steps: PropTypes.array.isRequired,
  onclickStep: PropTypes.func.isRequired,
  title: PropTypes.string,
  iconSixthSenseStatus: PropTypes.bool.isRequired,
  iconGoutStatus: PropTypes.bool.isRequired,
  latencyStatus: PropTypes.bool.isRequired,
  iconCanaryStatus: PropTypes.bool.isRequired,
  colors: PropTypes.object.isRequired,
  iconFireStatus: PropTypes.bool.isRequired
};
