import React from 'react';
import { create } from 'react-test-renderer';
import {
  BodyFileErrorFormModal,
  HeaderFileErrorFormModal
} from '../../../components/Modal/FileErrorFormModal';

describe('FileErrorFormModal component', () => {
  test('Render body with default data', () => {
    const body = create(
      <BodyFileErrorFormModal
        SetConfigurationJSON={jest.fn()}
        validateKpiQuery={{}}
        _onClose={jest.fn()}
        errorsList={[
          { dataPath: '/data/0', message: 'message error 1' },
          { dataPath: '/data/1', message: 'message error 2' }
        ]}
      />
    );
    expect(body.toJSON()).toMatchSnapshot();
  });

  test('Render header with default data', () => {
    const header = create(<HeaderFileErrorFormModal />);
    expect(header.toJSON()).toMatchSnapshot();
  });
});
