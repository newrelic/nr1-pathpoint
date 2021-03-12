import React from 'react';
import { mount } from 'enzyme';
import {
  BodyFlameFormModal,
  HeaderFlameFormModal
} from '../../../components/Modal/FlameFormModal';

describe('<FlameFormModal/>', () => {
  it('Render body', () => {
    const bodyFlameModal = mount(
      <BodyFlameFormModal handleSaveUpdateFire={jest.fn()} />
    );
    expect(bodyFlameModal.length).toEqual(1);
  });

  it('Render header', () => {
    const headerFlameModal = mount(<HeaderFlameFormModal />);
    expect(headerFlameModal.length).toEqual(1);
  });
});
