import React from 'react';
import { mount } from 'enzyme';
import {
  BodyBackgroundProcessesFormModal,
  HeaderBackgroundProcessesFormModal,
  getFireSyntheticFilter
} from '../../../components/Modal/BackgroundProcessesFormModal';

describe('<BackgroundProcessesFormModal/>', () => {
  it('Render body', () => {
    const backgroundBody = mount(
      <BodyBackgroundProcessesFormModal
        _onClose={jest.fn()}
        GetCurrentHistoricErrorScript={jest.fn()}
      />
    );
    expect(backgroundBody.length).toEqual(1);
  });

  it('Render header', () => {
    const backgroundHeader = mount(<HeaderBackgroundProcessesFormModal />);
    expect(backgroundHeader.length).toEqual(1);
  });

  it('Function getFireSyntheticFilter', () => {
    const close = () => {};
    const cb = () => {
      return 0;
    };
    const result = getFireSyntheticFilter(cb, close);
    expect(result).toEqual(0);
  });
});
