import React from 'react';
import { create } from 'react-test-renderer';
import CustomSelect from '../../../components/Modal/CustomSelect';

describe('CustomSelect component', () => {
  test('Render body with default data', () => {
    const select = create(
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
    expect(select.toJSON()).toMatchSnapshot();
  });
});
