import React from 'react';
import Editor from '../../../components/Editor/Editor';
import { mount } from 'enzyme';

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
    const wrapper = mount(
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
    expect(typeof wrapper).toEqual('object');
  });

  it('Function handleOnInput', () => {
    const handleOnInput = jest.fn();
    const wrapper = mount(
      <Editor
        name={name}
        style={style}
        value={value}
        defaultValue={defaultValue}
        isReadOnly={isReadOnly}
        onChange={onChange}
        onPressEnter={onPressEnter}
        handleOnInput={handleOnInput}
      />
    );
    const e = { target: { value: 'SELECT' } };
    wrapper.find('textarea').simulate('input', e);
    expect(handleOnInput).toHaveBeenCalledTimes(0);
  });

  it('Function handleOnScroll', () => {
    const handleOnScroll = jest.fn();
    const wrapper = mount(
      <Editor
        name={name}
        style={style}
        value={value}
        defaultValue={defaultValue}
        isReadOnly={isReadOnly}
        onChange={onChange}
        onPressEnter={onPressEnter}
        handleOnScroll={handleOnScroll}
      />
    );
    wrapper.find('textarea').simulate('scroll');
    expect(handleOnScroll).toHaveBeenCalledTimes(0);
  });

  it('Function handleOnKeyDown', () => {
    const handleOnKeyDown = jest.fn();
    const wrapper = mount(
      <Editor
        name={name}
        style={style}
        value={value}
        defaultValue={defaultValue}
        isReadOnly={isReadOnly}
        onChange={onChange}
        onPressEnter={onPressEnter}
        handleOnKeyDown={handleOnKeyDown}
      />
    );
    const e = { keyCode: 1 };
    wrapper.find('textarea').simulate('keydown', e);
    expect(handleOnKeyDown).toHaveBeenCalledTimes(0);
  });

  it('Function handleOnKeyDown with keyCode = 13', () => {
    const handleOnKeyDown = jest.fn();
    const wrapper = mount(
      <Editor
        name={name}
        style={style}
        value={value}
        defaultValue={defaultValue}
        isReadOnly={isReadOnly}
        onChange={onChange}
        onPressEnter={onPressEnter}
        handleOnKeyDown={handleOnKeyDown}
      />
    );
    const e = { keyCode: 13, preventDefault: jest.fn() };
    wrapper.find('textarea').simulate('keydown', e);
    expect(handleOnKeyDown).toHaveBeenCalledTimes(0);
  });
});
