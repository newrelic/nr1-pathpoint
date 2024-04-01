import React, { Component } from 'react';
import PropTypes from 'prop-types';
import lens_icon from '../../../images/lens_icon_black.svg';
import right_icon from '../../../images/right.svg';

class index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      visible: false
    };
  }

  componentDidMount() {
    // document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    // document.removeEventListener('mousedown', this.handleClickOutside);
  }

  render() {
    const { visible } = this.state;
    const { lensForm, CloseMenuRight, LensHandleChange } = this.props;
    return (
      <div className="container_rmenu">
        <div className="content_rmenu">
          <div className="col1_rmenu">
            <img
              src={lens_icon}
              height="15px"
              width="15px"
              style={{ paddingBottom: '2px' }}
            />
            <span className="title_rmenu">Lens</span>
            <span className="subtitle_rmenu">Tunning</span>
          </div>
          <div className="col2_rmenu">
            {' '}
            <img
              src={right_icon}
              height="18px"
              width="18px"
              style={{ cursor: 'pointer' }}
              onClick={CloseMenuRight}
            />{' '}
          </div>
        </div>
        <div className="content_rmenu">
          <div className="col3_rmenu">
            <div className="subTitleRight_container flex-center">
              <input
                id="error"
                name="error"
                type="checkbox"
                checked={lensForm.error}
                onChange={LensHandleChange}
                className="input_checkbox"
              />
              <span className="checkbox_label">Error %</span>
            </div>
            <div className="subTitleRight_container flex-center">
              <input
                id="response"
                name="response"
                type="checkbox"
                checked={lensForm.response}
                onChange={LensHandleChange}
                className="input_checkbox"
              />
              <span className="checkbox_label">Response</span>
            </div>
            <div className="subTitleRight_container flex-center add50height">
              <input
                id="duration"
                name="duration"
                type="checkbox"
                checked={lensForm.duration}
                onChange={LensHandleChange}
                className="input_checkbox"
              />
              <span className="checkbox_label">Duration</span>
            </div>
            <div className="subTitleRight_container">
              <input
                id="durationMin"
                name="durationMin"
                type="text"
                value={lensForm.durationMin}
                onChange={LensHandleChange}
                className="input_mr"
              />
              Minutes Min
            </div>
          </div>
        </div>
      </div>
    );
  }
}

index.propTypes = {
  lensForm: PropTypes.object.isRequired,
  CloseMenuRight: PropTypes.func.isRequired,
  LensHandleChange: PropTypes.func.isRequired
};
export default index;
