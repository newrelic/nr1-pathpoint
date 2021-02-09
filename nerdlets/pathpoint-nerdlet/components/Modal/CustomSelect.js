import React from "react";
import Select from "react-select";

export const CustomSelect = ({
  placeholder,
  field,
  form,
  options,
}) => {
  const onChange = (option) => {
    form.setFieldValue(
      field.name,
      option.label
    );
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
      theme={(theme) => ({
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
  }),
};

export default CustomSelect;
