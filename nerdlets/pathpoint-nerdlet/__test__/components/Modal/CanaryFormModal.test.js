import React from 'react';
import { mount } from 'enzyme';
import {
  BodyCanaryFormModal,
  HeaderCanaryFormModal
} from '../../../components/Modal/CanaryFormModal';

describe('<CanaryFormModal/>', () => {
  it('Render body', () => {
    const canaryBody = mount(
      <BodyCanaryFormModal handleSaveUpdateCanary={jest.fn()} />
    );
    expect(canaryBody.length).toEqual(1);
  });

  it('Render header', () => {
    const canaryHeader = mount(<HeaderCanaryFormModal />);
    expect(canaryHeader.length).toEqual(1);
  });
});
