import React from 'react';
import { mount, shallow } from 'enzyme';
import SelectIDs from '../../../components/SelectIDs/SelectIDs';

describe('<SelectIDs/>', () => {
  it('Render default', () => {
    const wrapper = mount(
      <SelectIDs
        options={[{ label: 'option one' }]}
        name=""
        handleOnChange={jest.fn()}
        idSeleccionado={2789648}
      />
    );
    const wrapper2 = shallow(
      <SelectIDs
        options={[{ name: 'WigiBoards', id: 2710112 }]}
        name=""
        handleOnChange={jest.fn()}
        idSeleccionado={2710112}
      />
    ).instance();
    wrapper2.componentDidMount({ selected: 0 });
    expect(wrapper.length).toEqual(1);
    wrapper.unmount();
  });

  it('Function clickAction()', () => {
    const idSeleccionado = 2789648;
    const wrapper = mount(
      <SelectIDs
        options={[{ name: 'WigiBoards', id: 2710112 }]}
        name=""
        handleOnChange={jest.fn()}
        idSeleccionado={idSeleccionado}
      />
    );
    wrapper.instance().clickAction();
    expect(wrapper.state('open')).toBeTruthy();
  });

  it('Function clickSelected()', () => {
    const idSeleccionado = 2789648;
    const handleOnChange = jest.fn();
    const wrapper = mount(
      <SelectIDs
        options={[
          { name: 'WigiBoards', id: 2710112 },
          { name: 'Account 2', id: 7859641 }
        ]}
        name=""
        handleOnChange={handleOnChange}
        idSeleccionado={idSeleccionado}
      />
    );
    wrapper.instance().clickSelected(1, { value: 1 });
    expect(handleOnChange).toHaveBeenCalledTimes(1);
    expect(wrapper.state('selected')).toEqual(1);
  });

  it('emulate click in the option', () => {
    const idSeleccionado = 2789648;
    const wrapper = mount(
      <SelectIDs
        options={[{ name: 'WigiBoards', id: 2710112 }]}
        name=""
        handleOnChange={jest.fn()}
        idSeleccionado={idSeleccionado}
      />
    );
    wrapper
      .find('span')
      .at(1)
      .simulate('click');
    expect(wrapper.state('selected')).toEqual(0);
  });
});
