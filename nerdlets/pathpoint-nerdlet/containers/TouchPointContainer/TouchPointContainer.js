import React from 'react';
import PropTypes from 'prop-types';
import TouchPoint from '../../components/TouchPoint/TouchPoint.js';

/**
 *Step container component
 *
 * @export
 * @class StepContainer
 * @extends {React.Component}
 */

export default class TouchPointerContainer extends React.Component {
  filterTouchpoints = (touchpoints, city) => {
    const filter = [];
    for (const touchpoint of touchpoints) {
      for (const country of touchpoint.countrys) {
        if (country === city) {
          filter.push(touchpoint);
        }
      }
    }
    filter.sort(function(a, b) {
      if (a.error > b.error) {
        return -1;
      }
      if (a.error < b.error) {
        return 1;
      }
      return 0;
    });
    return filter;
  };

  render() {
    const {
      touchpoints,
      city,
      colors,
      iconFireStatus,
      checkAllStatus,
      element,
      visible,
      idVisible,
      renderProps,
      openModalParent,
      updateTouchpointOnOff,
      iconCanaryStatus
    } = this.props;
    const touchpointsFilter = this.filterTouchpoints(touchpoints, city);
    return (
      <>
        {touchpointsFilter.map(touchpoint => {
          return (
            <TouchPoint
              idVisible={idVisible}
              visible={visible}
              renderProps={renderProps}
              key={touchpoint.index}
              touchpoint={touchpoint}
              city={city}
              colors={colors}
              iconFireStatus={iconFireStatus}
              checkAllStatus={checkAllStatus}
              element={element}
              openModalParent={openModalParent}
              updateTouchpointOnOff={updateTouchpointOnOff}
              iconCanaryStatus={iconCanaryStatus}
            />
          );
        })}
      </>
    );
  }
}

TouchPointerContainer.propTypes = {
  touchpoints: PropTypes.array.isRequired,
  city: PropTypes.number.isRequired,
  colors: PropTypes.object.isRequired,
  iconFireStatus: PropTypes.bool.isRequired,
  checkAllStatus: PropTypes.bool.isRequired,
  element: PropTypes.object,
  visible: PropTypes.bool.isRequired,
  idVisible: PropTypes.string.isRequired,
  renderProps: PropTypes.func.isRequired,
  openModalParent: PropTypes.func.isRequired,
  updateTouchpointOnOff: PropTypes.func.isRequired,
  iconCanaryStatus: PropTypes.bool.isRequired
};
