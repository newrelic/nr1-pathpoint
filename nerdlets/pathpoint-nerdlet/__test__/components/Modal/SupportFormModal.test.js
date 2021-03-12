import React from 'react';
import { mount } from 'enzyme';
import {
  BodySupportFormModal,
  HeaderSupportFormModal
} from '../../../components/Modal/SupportFormModal';

describe('<SupportFormModal/>', () => {
  it('Render body', () => {
    const bodySupport = mount(
      <BodySupportFormModal handleSaveUpdateSupport={jest.fn()} />
    );
    expect(bodySupport.length).toEqual(1);
  });
  it('Render header', () => {
    const headerSupport = mount(<HeaderSupportFormModal />);
    expect(headerSupport.length).toEqual(1);
  });
});
