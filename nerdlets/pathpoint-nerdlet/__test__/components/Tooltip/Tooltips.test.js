import React from 'react';
import { mount, shallow } from 'enzyme';

import ToolTip from '../../../components/Tooltip/Tooltip';
import TooltipStages from '../../../components/Tooltip/TooltipStages';
import TooltipSteps from '../../../components/Tooltip/TooltipSteps';
import TooltipTouchPoints from '../../../components/Tooltip/TooltipTouchPoints';

describe('Tooltips', () => {
  it('<Tooltip/>', () => {
    const tooltip = mount(
      <ToolTip width="900" bottom>
        <div />
      </ToolTip>
    );
    expect(tooltip.length).toEqual(1);
  });

  it('Tooltip simulate setState show in true', () => {
    const tooltip = shallow(
      <ToolTip width="900" bottom>
        <div />
      </ToolTip>
    );
    tooltip.setState({ show: true });
    expect(tooltip.length).toEqual(1);
  });

  it('<TooltipSteps/>', () => {
    const tooltip = mount(<TooltipSteps />);
    expect(tooltip.length).toEqual(1);
  });

  it('<TooltipStages/>', () => {
    const tooltip = mount(<TooltipStages />);
    expect(tooltip.length).toEqual(1);
  });

  it('<TooltipTouchPoints/>', () => {
    const tooltip = mount(<TooltipTouchPoints />);
    expect(tooltip.length).toEqual(1);
  });
});
