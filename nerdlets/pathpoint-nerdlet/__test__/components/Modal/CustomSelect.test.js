import React from 'react';
import { mount } from 'enzyme';
import CustomSelect from '../../../components/Modal/CustomSelect';

describe('<CustomSelect/>', () => {
  it('Render', () => {
    const select = mount(
      <CustomSelect
        placeholder="text test"
        form={{}}
        field={{}}
        options={[
          { label: 'option1', value: 0 },
          { label: 'option2', value: 1 }
        ]}
      />
    );
    expect(select.length).toEqual(1);
  });
});
