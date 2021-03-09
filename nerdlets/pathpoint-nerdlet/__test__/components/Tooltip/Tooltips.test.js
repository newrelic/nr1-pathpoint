import React from 'react';
import { mount } from 'enzyme';

import TooltipStages from '../../../components/Tooltip/TooltipStages';
import TooltipSteps from '../../../components/Tooltip/TooltipSteps';
import TooltipTouchPoints from '../../../components/Tooltip/TooltipTouchPoints';

describe('Tooltips', () => {
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
