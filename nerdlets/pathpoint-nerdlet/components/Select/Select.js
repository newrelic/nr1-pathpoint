import React from 'react';
import PropTypes from 'prop-types';

const Select = ({ name, handleOnChange, options }) => {
  return (
    <select
      className="custom-select"
      name={name}
      id={name}
      onChange={handleOnChange}
    >
      {options.map((item, index) => (
        <option key={index} label={item.label} value={item.value} />
      ))}
    </select>
  );
};

// const customStyles = {
//   position: 'revert',
//   borderRadius: '0px',
//   backgroundColor: '#fff',
//   border: '1px solid rgb(189, 189, 189)',
//   minHeight: '30px',
//   minWidth: '150px'
// };

Select.propTypes = {
  name: PropTypes.string.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired
};

export default Select;
