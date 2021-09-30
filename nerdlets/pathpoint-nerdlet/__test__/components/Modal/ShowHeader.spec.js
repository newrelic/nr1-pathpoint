import React from 'react';
import { create } from 'react-test-renderer';
import ShowHeader from '../../../components/Modal/ShowHeader';

describe('ShowHeader component', () => {
  test('ShowHeader with default data in 0 view', () => {
    const header = create(
      <ShowHeader
        handleSaveUpdateSupport={jest.fn()}
        viewModal={0}
        changeMessage={jest.fn()}
        stageNameSelected={{
          icon_description: 'medal',
          icon_active: true,
          title: 'touchpoint one'
        }}
        accountIDs={{ type: 'default' }}
        changeID={1213212}
      />
    );
    expect(header.toJSON()).toMatchSnapshot();
  });
});
