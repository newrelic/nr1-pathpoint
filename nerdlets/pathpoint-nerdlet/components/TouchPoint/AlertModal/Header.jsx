/* eslint-disable react/react-in-jsx-scope */
// Librarys
import { memo } from 'react';
import PropTypes from 'prop-types';

// Images
import alertCog from '../../../images/alert-cog.svg';
import closeIcon from '../../../images/closeIcon.svg';
import alertTriangleWarning from '../../../images/alert-triangle-warning.svg';

function Header({
  itemName,
  totalIssues,
  totalIncidents,
  currentTotalIssues,
  currentTotalIncidents,
  hideModal
}) {
  return (
    <div className="modal-header">
      <div className="headerModal">
        <div className="sections center-inline">
          <section className="section center-inline item-name">
            <h3 className="open-sans">{itemName}</h3>
          </section>

          <section className="section center-inline issues">
            <img src={alertCog} className="img" alt="alert-cog-icon" />

            <span className="center-inline">
              <span className="count current-issues">
                {currentTotalIssues}&nbsp;
              </span>
              <span className="short-text">
                <span>of {totalIssues}&nbsp;&nbsp;</span>
                <span className="text open-sans">total&nbsp;</span>
                <span className="open-sans subtitle">ISSUES</span>
              </span>
            </span>
          </section>

          <section className="section center-inline incidents">
            <img
              className="img"
              src={alertTriangleWarning}
              alt="alert-triangle-warning"
            />

            <span className="center-inline">
              <span className="count">{currentTotalIncidents}&nbsp;</span>
              <span className="short-text">
                <span className="off">of {totalIncidents}&nbsp;</span>

                <span className="text open-sans" style={{ marginLeft: '5px' }}>
                  total&nbsp;
                </span>

                <span className="open-sans subtitle">INCIDENTS</span>
              </span>
            </span>
          </section>
        </div>

        <div role="button" onClick={hideModal} className="selectIcon">
          <img
            src={closeIcon}
            alt="close-modal-icon"
            className="img mainModal__closeIcon"
          />
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  itemName: PropTypes.string.isRequired,
  totalIssues: PropTypes.number.isRequired,
  totalIncidents: PropTypes.number.isRequired,
  currentTotalIssues: PropTypes.number.isRequired,
  currentTotalIncidents: PropTypes.number.isRequired,
  hideModal: PropTypes.func.isRequired
};

export default memo(Header, (prevProps, nextProps) => {
  return (
    prevProps.currentTotalIssues === nextProps.currentTotalIssues &&
    prevProps.currentTotalIncidents === nextProps.currentTotalIncidents
  );
});
