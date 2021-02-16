import React from "react";
import PropTypes from "prop-types";
import goutBlack from "../../images/goutBlack.svg";
import DiamondBlue from '../../images/DiamondBlue.svg';
import DiamondWhite from '../../images/Diamond.svg';
import trafficIcon from "../../images/traffic.svg";
import peopleIcon from "../../images/People.svg";
import Arrow from "../Arrow/Arrow";

/**
 * Stage component class
 *
 * @export
 * @class Stage
 * @extends {React.Component}
 */
export default class Stage extends React.Component {

    state = {
        indicators: []
    }

    /**
     * Function that configures the circle alert color
     *
     * @param {number} circleColor the number of alert (1 to 3)
     * @returns
     * @memberof Stage
     */
    calcCircleColor(status, colors) {
        let { danger, warning, good } = colors.status_color;
        let result = [];
        switch (status) {
            case "good":
                result =
                    "rgb(" +
                    good[0] +
                    "," +
                    good[1] +
                    "," +
                    good[2] +
                    ")";
                break;
            case "waning":
                result =
                    "rgb(" +
                    warning[0] +
                    "," +
                    warning[1] +
                    "," +
                    warning[2] +
                    ")";
                break;
            case "danger":
                result =
                    "rgb(" +
                    danger[0] +
                    "," +
                    danger[1] +
                    "," +
                    danger[2] +
                    ")";
                break;
            default:
                result =
                    "rgb(" +
                    warning[0] +
                    "," +
                    warning[1] +
                    "," +
                    warning[2] +
                    ")";
                break;
        }
        return result;
    }

    /**
     *Method that calculate values over thousand
     *
     * @memberof Stage
     */
    transformK(value) {
        if (value > 1000000) {
            return Math.round(value / 1000000) + ' M';
        }
        if (value > 1000) {
            return Math.round(value / 1000) + ' K';
        }
        return value;
    }

    /**
     *Method that calcule quantity of progress in progress bar
     *
     * @memberof Stage
     */
    calculate = (level) => {
        let newIndicators = [];
        let quantityObjects = 13;
        let quantityArrowsBlue = parseInt((quantityObjects / 100) * level);
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
                newIndicators.push({ name: 'blue' })
            }
            for (let i = 0; i < quantityObjects - quantityArrowsBlue; i++) {
                newIndicators.push({ name: 'white' })
            }
        }
        return newIndicators;
    }

    render() {
        const { title, valueCongestion, percentageCongestion, index, goutQuantity, status, capacityPercentage, totalCountStage, onClickStage, colors, trafficIconType } = this.props;
        let textLevelBar = (index == 1) ? `APDEX` : ``;
        let showHealth = (index == 1) ? true : false;
        let showTrafficIcon = (trafficIconType == "traffic")?true:false; // values: traffic|people
        let colorCircle = this.calcCircleColor(status, colors);
        let indicators = this.calculate(capacityPercentage);

        return (
            <div>
                <div className="stage">
                    <div className="titleStage">
                        <div>
                            {`${title}`}
                            <div>
                                <span className="quantiyTitleStage">{`${this.transformK(totalCountStage)}`}</span>
                                <span className="separator"></span>

                                <span className="quantiyTitleStage">{`${this.transformK(valueCongestion)}`}%</span>
                                <span className="quantiyIcon">
                                    <img
                                        style={{ height: showTrafficIcon ? '11px':'15px' }}
                                        src={ showTrafficIcon ? trafficIcon:peopleIcon}
                                    />
                                </span>
                            </div>
                        </div>
                        <div style={{ alignItems: "center", marginRight: "5%", visibility: "hidden" }}>
                            <img src={goutBlack} height="15px" width="11px" />
                            <span className="goutTxt">{goutQuantity}</span>
                        </div>
                    </div>
                    <div className="arrowStage">
                        <div onClick={() => { onClickStage(index) }} style={{ cursor: "pointer" }} >
                            <Arrow arrowWidth={250} showHealth={showHealth} lightColor={colorCircle} latencyPercentage={percentageCongestion} textLevelBar={textLevelBar} />
                        </div>
                        <div className="capacityBar" >
                            {indicators.map((entry, index) => {
                                return (<img
                                    key={index}
                                    style={{ width: '1.27vw', height: '1.27vw' }}
                                    src={entry.name === 'white' ? DiamondWhite : DiamondBlue}
                                />)
                            })}
                        </div>
                        <div className="percentText">
                            {index === 1 ? `Utilization: ${Math.round(capacityPercentage * 100) / 100}%` : `${Math.round(capacityPercentage * 100) / 100}%`}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Stage.propTypes = {
    title: PropTypes.string.isRequired,
    percentageCongestion: PropTypes.number.isRequired,
    valueCongestion: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
};
