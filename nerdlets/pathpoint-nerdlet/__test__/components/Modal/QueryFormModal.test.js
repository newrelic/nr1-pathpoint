import React from 'react';
import { mount } from 'enzyme';
import {
  BodyQueryFormModal,
  HeaderQueryFormModal
} from '../../../components/Modal/QueryFormModal';

const accountIDs = [
  {
    name: 'WigiBoards',
    id: 2710112
  }
];
describe('<QueryFormModal/>', () => {
  it('Render body', () => {
    const resultsTestQuery = { str: 'asd', array: ['asd', 'ter'] };
    const bodyQueryForm = mount(
      <BodyQueryFormModal
        querySample="simple query"
        stageNameSelected={{
          selectedCase: 0,
          datos: [
            {
              label: 'Full Open Query',
              query_body: 'SELECT FILTER(count(*) FROM Log',
              query_footer: 'SINCE 5 MINUTES AGO',
              query_start: '',
              type: 20,
              value: 0,
              accountID: 2710112
            }
          ]
        }}
        chargueSample={jest.fn()}
        testQuery={jest.fn()}
        handleSaveUpdateQuery={jest.fn()}
        testText="Bad query"
        resultsTestQuery={resultsTestQuery}
        goodQuery={false}
        modifiedQuery
        handleChangeTexarea={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    expect(bodyQueryForm.length).toEqual(1);
  });

  it('Render body with good query true', () => {
    const bodyQueryForm = mount(
      <BodyQueryFormModal
        querySample="simple query"
        stageNameSelected={{
          datos: [
            {
              label: 'Full Open Query',
              query_body: 'SELECT FILTER(count(*) FROM Log',
              query_footer: 'SINCE 5 MINUTES AGO',
              query_start: '',
              type: 20,
              value: 0
            }
          ]
        }}
        chargueSample={jest.fn()}
        testQuery={jest.fn()}
        handleSaveUpdateQuery={jest.fn()}
        testText="good query"
        resultsTestQuery={{ type: 'default' }}
        goodQuery
        modifiedQuery={false}
        handleChangeTexarea={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    expect(bodyQueryForm.length).toEqual(1);
  });

  it('Emulate click in test query', () => {
    const testQuery = jest.fn();
    const bodyQueryForm = mount(
      <BodyQueryFormModal
        querySample="simple query"
        stageNameSelected={{
          datos: [
            {
              label: 'Full Open Query',
              query_body: 'SELECT FILTER(count(*) FROM Log',
              query_footer: 'SINCE 5 MINUTES AGO',
              query_start: '',
              type: 20,
              value: 0
            }
          ]
        }}
        chargueSample={jest.fn()}
        testQuery={testQuery}
        handleSaveUpdateQuery={jest.fn()}
        testText="good query"
        resultsTestQuery={{ type: 'default' }}
        goodQuery
        modifiedQuery={false}
        handleChangeTexarea={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    bodyQueryForm
      .find('Button')
      .at(0)
      .simulate('click');
    expect(testQuery).toHaveBeenCalledTimes(1);
  });

  it('Emulate click in sample query', () => {
    const sampleQuery = jest.fn();
    const bodyQueryForm = mount(
      <BodyQueryFormModal
        querySample="simple query"
        stageNameSelected={{
          datos: [
            {
              label: 'Full Open Query',
              query_body: 'SELECT FILTER(count(*) FROM Log',
              query_footer: 'SINCE 5 MINUTES AGO',
              query_start: '',
              type: 20,
              value: 0
            }
          ]
        }}
        chargueSample={sampleQuery}
        testQuery={jest.fn()}
        handleSaveUpdateQuery={jest.fn()}
        testText="good query"
        resultsTestQuery={{ type: 'default' }}
        goodQuery
        modifiedQuery={false}
        handleChangeTexarea={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    bodyQueryForm.find('a').simulate('click');
    expect(sampleQuery).toHaveBeenCalledTimes(1);
  });

  it('Render Header', () => {
    const headerQueryForm = mount(
      <HeaderQueryFormModal
        stageNameSelected={{
          touchpoint: {
            value: 'Test API'
          },
          datos: [
            {
              label: 'Full Open Query',
              query_body: 'SELECT FILTER(count(*) FROM Log',
              query_footer: 'SINCE 5 MINUTES AGO',
              query_start: '',
              type: 20,
              value: 0
            }
          ]
        }}
        changeMessage={jest.fn()}
      />
    );
    expect(headerQueryForm.length).toEqual(1);
  });

  it('Simulate onsubmit', () => {
    const handleSaveUpdateQuery = jest.fn();
    const bodyQueryForm = mount(
      <BodyQueryFormModal
        querySample="simple query"
        stageNameSelected={{
          datos: [
            {
              label: 'Full Open Query',
              query_body: 'SELECT FILTER(count(*) FROM Log',
              query_footer: 'SINCE 5 MINUTES AGO',
              query_start: '',
              type: 20,
              value: 0
            }
          ]
        }}
        chargueSample={jest.fn()}
        testQuery={jest.fn()}
        handleSaveUpdateQuery={handleSaveUpdateQuery}
        testText="good query"
        resultsTestQuery={{ type: 'default' }}
        goodQuery
        modifiedQuery={false}
        handleChangeTexarea={jest.fn()}
        accountIDs={accountIDs}
      />
    );
    const button = bodyQueryForm.find('button').at(1);
    button.simulate('submit');
    expect(handleSaveUpdateQuery).toHaveBeenCalledTimes(1);
  });

  it('Simulate onChange textArea', () => {
    const handleChangeTexarea = jest.fn();
    const bodyQueryForm = mount(
      <BodyQueryFormModal
        querySample="simple query"
        stageNameSelected={{
          datos: [
            {
              label: 'Full Open Query',
              query_body: 'SELECT FILTER(count(*) FROM Log',
              query_footer: 'SINCE 5 MINUTES AGO',
              query_start: '',
              type: 20,
              value: 0
            }
          ]
        }}
        chargueSample={jest.fn()}
        testQuery={jest.fn()}
        handleSaveUpdateQuery={jest.fn()}
        testText="good query"
        resultsTestQuery={{ type: 'default' }}
        goodQuery
        modifiedQuery={false}
        handleChangeTexarea={handleChangeTexarea}
        accountIDs={accountIDs}
      />
    );
    const textArea = bodyQueryForm.find('textarea');
    const event = { target: { value: 'sometext' } };
    textArea.simulate('change', event);
    expect(handleChangeTexarea).toHaveBeenCalledTimes(1);
  });

  it('Simulate handleOnChange selectID', () => {
    const handleOnChange = jest.fn();
    const bodyQueryForm = mount(
      <BodyQueryFormModal
        querySample="simple query"
        stageNameSelected={{
          datos: [
            {
              label: 'Full Open Query',
              query_body: 'SELECT FILTER(count(*) FROM Log',
              query_footer: 'SINCE 5 MINUTES AGO',
              query_start: '',
              type: 20,
              value: 0,
              accountID: 2710112
            }
          ]
        }}
        chargueSample={jest.fn()}
        testQuery={jest.fn()}
        handleSaveUpdateQuery={jest.fn()}
        testText="good query"
        resultsTestQuery={{ type: 'default' }}
        goodQuery
        modifiedQuery={false}
        handleChangeTexarea={jest.fn()}
        accountIDs={accountIDs}
        handleOnChange={handleOnChange}
      />
    );
    expect(bodyQueryForm.length).toEqual(1);
    expect(handleOnChange).toHaveBeenCalledTimes(0);
  });
});
