import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

const CustomSelect = ({ placeholder, field, form, options }) => {
  /* istanbul ignore next */
  const onChange = option => {
    form.setFieldValue(field.name, option.label);
  };

  const getValue = () => {
    return options.find(option => option.value === field.value);
  };

  return (
    <Select
      name={field.name}
      value={getValue()}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
      styles={customStyles}
      theme={theme => ({
        ...theme,
        borderRadius: 0
      })}
    />
  );
};

const customStyles = {
  container: provided => ({
    ...provided,
    width: '100%'
  }),
  control: styles => ({
    ...styles,
    width: '100%',
    height: '30px !important',
    minHeight: '30px !important'
  }),
  menu: provided => ({
    ...provided,
    width: '100%'
  }),
  indicatorsContainer: styles => ({
    ...styles,
    height: '30px !important'
  })
};

CustomSelect.propTypes = {
  placeholder: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
  field: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired
};

export default CustomSelect;
