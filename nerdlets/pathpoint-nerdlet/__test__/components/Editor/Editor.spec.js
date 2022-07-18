import React from 'react';
import { create } from 'react-test-renderer';
import Editor from '../../../components/Editor/Editor';

describe('<Editor />', () => {
  const name = 'Editor';
  const style = {
    width: '85px',
    heigth: '70px',
    backgroundColor: '#FFFFFF'
  };
  const value = 'value';
  const defaultValue = 'Previous value';
  const isReadOnly = true;
  const onChange = jest.fn();
  const onPressEnter = jest.fn();
  it('Render Editor correctly', () => {
    const wrapper = create(
      <Editor
        name={name}
        style={style}
        value={value}
        defaultValue={defaultValue}
        isReadOnly={isReadOnly}
        onChange={onChange}
        onPressEnter={onPressEnter}
      />
    );
    expect(wrapper.toJSON()).toMatchSnapshot();
  });
});
