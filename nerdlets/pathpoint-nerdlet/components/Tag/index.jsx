/* eslint-disable react/react-in-jsx-scope */
// Librarys
import { memo } from 'react';
import PropTypes from 'prop-types';
import classnames from '../../utils/classnames';

function Tag({ color, value, style, className, backgroundColor }) {
  return (
    <span
      className={classnames(['tag open-sans', className])}
      style={{
        ...style,
        color: color,
        backgroundColor: backgroundColor
      }}
    >
      {value}
    </span>
  );
}

Tag.propTypes = {
  color: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired
};

export default memo(Tag);
