import React from 'react';
import PropTypes from "prop-types";
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
        let filter = [];
        for (const touchpoint of touchpoints) {
            for (const country of touchpoint.countrys) {
                if (country === city) {
                    filter.push(touchpoint);
                }
            }
        }
        filter.sort(function (a, b) {
            if (a.error > b.error) {
                return -1;
            }
            if (a.error < b.error) {
                return 1;
            }
            return 0;
        });

        return filter;
    }

    render() {
        let { touchpoints, city, colors, iconFireStatus, checkAllStatus, iconSixthSenseStatus, element, handleChange, visible,
            idVisible, renderProps, openModalParent, updateTouchpointOnOff } = this.props;
        let touchpointsFilter = this.filterTouchpoints(touchpoints, city);
        return (
            <>
                {touchpointsFilter.map((touchpoint) => {
                    return (
                        <TouchPoint
                            handleChange={handleChange}
                            idVisible={idVisible}
                            visible={visible}
                            renderProps={renderProps}
                            key={touchpoint.index}
                            touchpoint={touchpoint}
                            city={city}
                            colors={colors}
                            iconFireStatus={iconFireStatus}
                            checkAllStatus={checkAllStatus}
                            iconSixthSenseStatus={iconSixthSenseStatus}
                            element={element}
                            openModalParent={openModalParent}
                            updateTouchpointOnOff={updateTouchpointOnOff}
                        />
                    )
                })}
            </>
        );
    }
}

TouchPointerContainer.propTypes = {
    touchpoints: PropTypes.array.isRequired
}