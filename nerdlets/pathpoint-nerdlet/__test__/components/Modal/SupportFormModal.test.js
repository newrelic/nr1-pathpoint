import React from 'react';
import { mount } from 'enzyme';
import {
  BodySupportFormModal,
  HeaderSupportFormModal
} from '../../../components/Modal/SupportFormModal';
import { jest } from '@jest/globals';

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

  it('Simulate onSubmit', () => {
    const handleSaveUpdateSupport = jest.fn();
    const bodySupport = mount(
      <BodySupportFormModal handleSaveUpdateSupport={handleSaveUpdateSupport} />
    );
    const button = bodySupport.find('button');
    button.simulate('submit');
    expect(handleSaveUpdateSupport).toHaveBeenCalledTimes(1);
  });

  it('Simulate onChange dropwdown', () => {
    const bodySupport = mount(
      <BodySupportFormModal handleSaveUpdateSupport={jest.fn()} />
    );
    bodySupport
      .find('.react-support__control')
      .first()
      .simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });
    bodySupport
      .find('.react-support__control')
      .first()
      .simulate('keyDown', { key: 'Enter', keyCode: 13 });
    expect(
      bodySupport
        .find('.react-support__single-value')
        .first()
        .text()
    ).toEqual(
      'Data Error - It appears as though the data shown by Pathpoint is not consistent with the telemetry based on other NR1 visualizations.'
    );
  });

  it('Simulate onChange name input', () => {
    const bodySupport = mount(
      <BodySupportFormModal handleSaveUpdateSupport={jest.fn()} />
    );
    const textArea = bodySupport.find('input').at(2);
    const event = { target: { value: 'sometext' } };
    textArea.simulate('change', event);
  });

  it('Simulate onChange company input', () => {
    const bodySupport = mount(
      <BodySupportFormModal handleSaveUpdateSupport={jest.fn()} />
    );
    const textArea = bodySupport.find('input').at(3);
    const event = { target: { value: 'sometext' } };
    textArea.simulate('change', event);
  });

  it('Simulate onChange Account name input', () => {
    const bodySupport = mount(
      <BodySupportFormModal handleSaveUpdateSupport={jest.fn()} />
    );
    const textArea = bodySupport.find('input').at(4);
    const event = { target: { value: 'sometext' } };
    textArea.simulate('change', event);
  });

  it('Simulate onChange email input', () => {
    const bodySupport = mount(
      <BodySupportFormModal handleSaveUpdateSupport={jest.fn()} />
    );
    const textArea = bodySupport.find('input').at(5);
    const event = { target: { value: 'sometext' } };
    textArea.simulate('change', event);
  });

  it('Simulate onChange mobile input', () => {
    const bodySupport = mount(
      <BodySupportFormModal handleSaveUpdateSupport={jest.fn()} />
    );
    const textArea = bodySupport.find('input').at(6);
    const event = { target: { value: 'sometext' } };
    textArea.simulate('change', event);
  });

  it('Simulate onChange details input', () => {
    const bodySupport = mount(
      <BodySupportFormModal handleSaveUpdateSupport={jest.fn()} />
    );
    const textArea = bodySupport.find('textarea');
    const event = { target: { value: 'sometext' } };
    textArea.simulate('change', event);
  });
});
