import React from 'react';
import { HeaderKPIEditor } from '../../../../components/Modal/KPIEditor/KPIEditor';
import { shallow } from 'enzyme';

jest.mock('../../../../components/Editor/Editor');

jest.mock(
  'react-bootstrap',
  () => {
    const Button = () => <div />;
    const Form = () => <div />;
    return {
      Button,
      Form
    };
  },
  { virtual: true }
);

jest.mock(
  'React.memo',
  () => {
    const Checkbox = () => <div />;
    return {
      Checkbox
    };
  },
  { virtual: true }
);

describe('KPIEditor test', () => {
  it('Render KPIEditor', () => {
    const wrapper = shallow(<HeaderKPIEditor />);
    wrapper
      .find('#DuplicateKPIEditor')
      .simulate('action', 'DuplicateKPIEditor');
  });

  it('Render KPIEditor with Delete KPIEditor', () => {
    const wrapper = shallow(<HeaderKPIEditor />);
    wrapper.find('#DeleteKPIEditor').simulate('action', 'DeleteKPIEditor');
  });
});

// describe('<BodyKPIEditor />', () => {
//   const kpis = [
//     {
//       index: 0,
//       type: 100,
//       name: '1 Account',
//       shortName: '1 Acc.',
//       queryByCity: [
//         {
//           accountID: 1606862,
//           query:
//             'SELECT count(*) as value  FROM  Public_APICall COMPARE WITH 2 day ago',
//           link: 'https://onenr.io/01qwL8KPxw5'
//         }
//       ],
//       value: {
//         current: 0,
//         previous: 0
//       },
//       value_type: 'FLOAT',
//       prefix: '',
//       suffix: '%',
//       check: false,
//       accountId: 1606862
//     }
//   ];
//   const accountId = 1606862;
//   const accountIDs = [
//     {
//       name: 'WigiBoards',
//       id: 2710112
//     }
//   ];
//   const timeRangeKpi = {
//     index: 0
//   };
//   const handleKPIEditorUpdate = jest.fn();
//   const EditorValidateQuery = jest.fn();

//   it('Render BodyKPIEditor currenTab = tab-query', () => {
//     const handleUpdateCurrentTab = jest.fn();
//     const realUseState = React.useState;
//     const kpisState = kpis;
//     const currentTab = 'tab-general';
//     const defaultQueryStatus = {
//       goodQuery: true,
//       testingNow: false,
//       testQueryValue: '',
//       testQueryResult: ''
//     };
//     jest
//       .spyOn(React, 'useState')
//       .mockImplementationOnce(() => realUseState(kpisState))
//       .mockImplementationOnce(() => realUseState(currentTab))
//       .mockImplementationOnce(() => realUseState(0))
//       .mockImplementationOnce(() => realUseState(timeRangeKpi))
//       .mockImplementationOnce(() => realUseState(defaultQueryStatus))
//       .mockImplementationOnce(() => realUseState(true));
//     const wrapper = mount(
//       <BodyKPIEditor
//         kpis={kpis}
//         accountId={accountId}
//         accountIDs={accountIDs}
//         timeRangeKpi={timeRangeKpi}
//         handleKPIEditorUpdate={handleKPIEditorUpdate}
//         EditorValidateQuery={EditorValidateQuery}
//         handleUpdateCurrentTab={handleUpdateCurrentTab}
//       />
//     );
//     expect(typeof wrapper).toEqual('object');
//   });

//   // it('Render BodyKPIEditor currenTab = tab-general', () => {
//   //   const handleUpdateCurrentTab = jest.fn();
//   //   const realUseState = React.useState;
//   //   const kpisState = kpis;
//   //   const currentTab = 'tab-general';
//   //   const defaultQueryStatus = {
//   //     goodQuery: true,
//   //     testingNow: false,
//   //     testQueryValue: '',
//   //     testQueryResult: ''
//   //   };
//   //   jest
//   //     .spyOn(React, 'useState')
//   //     .mockImplementationOnce(() => realUseState(kpisState))
//   //     .mockImplementationOnce(() => realUseState(currentTab))
//   //     .mockImplementationOnce(() => realUseState(0))
//   //     .mockImplementationOnce(() => realUseState(timeRangeKpi))
//   //     .mockImplementationOnce(() => realUseState(defaultQueryStatus))
//   //     .mockImplementationOnce(() => realUseState(false));
//   //   const wrapper = mount(
//   //     <BodyKPIEditor
//   //       kpis={kpis}
//   //       accountId={accountId}
//   //       accountIDs={accountIDs}
//   //       timeRangeKpi={timeRangeKpi}
//   //       handleKPIEditorUpdate={handleKPIEditorUpdate}
//   //       EditorValidateQuery={EditorValidateQuery}
//   //       handleUpdateCurrentTab={handleUpdateCurrentTab}
//   //     />
//   //   );
//   //   expect(typeof wrapper).toEqual('object');
//   // });
// });
