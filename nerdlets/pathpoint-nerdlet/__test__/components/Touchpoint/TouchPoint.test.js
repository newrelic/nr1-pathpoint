import React from 'react';
import { mount } from 'enzyme';
import TouchPoint from '../../../components/TouchPoint/TouchPoint';

describe('<Touchpoint/>', () => {
  const colors = {
    background_capacity: [19, 72, 104],
    stage_capacity: [255, 255, 255],
    status_color: {
      danger: [255, 76, 76],
      warning: [242, 201, 76],
      good: [39, 174, 96]
    },
    steps_touchpoints: [
      {
        select_color: [18, 167, 255],
        unselect_color: [189, 189, 189],
        error_color: [255, 76, 76],
        dark: [51, 51, 51]
      }
    ]
  };

  describe('DisplayItem function', () => {
    it('none value', () => {
      const touchPoint = {
        status_on_off: false,
        city: 0,
        index: 0,
        error: false,
        countrys: [0, 1],
        dashboard_url: ['www.google.com'],
        sixth_sense_url: [[]]
      };
      const wrapper = mount(
        <TouchPoint
          touchpoint={touchPoint}
          city={0}
          colors={colors}
          iconFireStatus={false}
          checkAllStatus={false}
          iconCanaryStatus={false}
          iconSixthSenseStatus={false}
          visible={false}
          idVisible=""
          handleChange={jest.fn()}
          renderProps={jest.fn()}
          updateTouchpointOnOff={jest.fn()}
          openModalParent={jest.fn()}
        />
      );

      const result = wrapper
        .instance()
        .DisplayItem(touchPoint, false, false, true);
      expect(result).toMatch('none');
    });

    it('flex value touchpoint error', () => {
      const touchPoint = {
        status_on_off: false,
        city: 0,
        index: 0,
        error: true,
        countrys: [0, 1],
        dashboard_url: ['www.google.com'],
        sixth_sense_url: [[]]
      };
      const wrapper = mount(
        <TouchPoint
          touchpoint={touchPoint}
          city={0}
          colors={colors}
          iconFireStatus={false}
          checkAllStatus={false}
          iconCanaryStatus={false}
          iconSixthSenseStatus={false}
          visible={false}
          idVisible=""
          handleChange={jest.fn()}
          renderProps={jest.fn()}
          updateTouchpointOnOff={jest.fn()}
          openModalParent={jest.fn()}
        />
      );

      const result = wrapper
        .instance()
        .DisplayItem(touchPoint, false, false, true);
      expect(result).toMatch('flex');
    });

    it('flex value touchpoint sixth_sense', () => {
      const touchPoint = {
        status_on_off: false,
        city: 0,
        index: 0,
        error: true,
        countrys: [0, 1],
        dashboard_url: ['www.google.com'],
        sixth_sense: true,
        sixth_sense_url: [[]]
      };
      const wrapper = mount(
        <TouchPoint
          touchpoint={touchPoint}
          city={0}
          colors={colors}
          iconFireStatus={false}
          checkAllStatus={false}
          iconCanaryStatus={false}
          iconSixthSenseStatus={false}
          visible={false}
          idVisible=""
          handleChange={jest.fn()}
          renderProps={jest.fn()}
          updateTouchpointOnOff={jest.fn()}
          openModalParent={jest.fn()}
        />
      );

      const result = wrapper
        .instance()
        .DisplayItem(touchPoint, false, true, false);
      expect(result).toMatch('flex');
    });

    it('flex value touchpoint highlighted', () => {
      const touchPoint = {
        status_on_off: false,
        city: 0,
        index: 0,
        error: true,
        countrys: [0, 1],
        dashboard_url: ['www.google.com'],
        sixth_sense: false,
        highlighted: true,
        sixth_sense_url: [[]]
      };
      const wrapper = mount(
        <TouchPoint
          touchpoint={touchPoint}
          city={0}
          colors={colors}
          iconFireStatus={false}
          checkAllStatus={false}
          iconCanaryStatus={false}
          iconSixthSenseStatus={false}
          visible={false}
          idVisible=""
          handleChange={jest.fn()}
          renderProps={jest.fn()}
          updateTouchpointOnOff={jest.fn()}
          openModalParent={jest.fn()}
        />
      );

      const result = wrapper
        .instance()
        .DisplayItem(touchPoint, false, false, false);
      expect(result).toMatch('flex');
    });

    it('flex value touchpoint history_error', () => {
      const touchPoint = {
        status_on_off: false,
        city: 0,
        index: 0,
        error: false,
        countrys: [0, 1],
        dashboard_url: ['www.google.com'],
        sixth_sense: false,
        highlighted: false,
        history_error: true,
        sixth_sense_url: [[]]
      };
      const wrapper = mount(
        <TouchPoint
          touchpoint={touchPoint}
          city={0}
          colors={colors}
          iconFireStatus={false}
          checkAllStatus={false}
          iconCanaryStatus={false}
          iconSixthSenseStatus={false}
          visible={false}
          idVisible=""
          handleChange={jest.fn()}
          renderProps={jest.fn()}
          updateTouchpointOnOff={jest.fn()}
          openModalParent={jest.fn()}
        />
      );

      const result = wrapper
        .instance()
        .DisplayItem(touchPoint, false, false, true);
      expect(result).toMatch('none');
    });

    it('flex value checkAllStatus', () => {
      const touchPoint = {
        status_on_off: false,
        city: 0,
        index: 0,
        error: false,
        countrys: [0, 1],
        dashboard_url: ['www.google.com'],
        sixth_sense: false,
        highlighted: false,
        history_error: false,
        sixth_sense_url: [[]]
      };
      const wrapper = mount(
        <TouchPoint
          touchpoint={touchPoint}
          city={0}
          colors={colors}
          iconFireStatus={false}
          checkAllStatus={false}
          iconCanaryStatus={false}
          iconSixthSenseStatus={false}
          visible={false}
          idVisible=""
          handleChange={jest.fn()}
          renderProps={jest.fn()}
          updateTouchpointOnOff={jest.fn()}
          openModalParent={jest.fn()}
        />
      );

      const result = wrapper
        .instance()
        .DisplayItem(touchPoint, true, false, false);
      expect(result).toMatch('flex');
    });
  });

  describe('ColorBorder function', () => {
    it('touchpoint highlighted', () => {
      const touchPoint = {
        status_on_off: false,
        city: 0,
        index: 0,
        error: false,
        highlighted: true,
        countrys: [0, 1],
        dashboard_url: ['www.google.com'],
        sixth_sense_url: [[]]
      };
      const wrapper = mount(
        <TouchPoint
          touchpoint={touchPoint}
          city={0}
          colors={colors}
          iconFireStatus={false}
          checkAllStatus={false}
          iconSixthSenseStatus={false}
          iconCanaryStatus={false}
          visible={false}
          idVisible=""
          handleChange={jest.fn()}
          renderProps={jest.fn()}
          updateTouchpointOnOff={jest.fn()}
          openModalParent={jest.fn()}
        />
      );

      const result = wrapper.instance().ColorBorder(touchPoint, colors, false);
      expect(result).toMatch('2px solid rgb(18,167,255)');
    });

    it('touchpoint history_error', () => {
      const touchPoint = {
        status_on_off: false,
        city: 0,
        index: 0,
        error: false,
        highlighted: false,
        countrys: [0, 1],
        history_error: true,
        dashboard_url: ['www.google.com'],
        sixth_sense_url: [[]]
      };
      const wrapper = mount(
        <TouchPoint
          touchpoint={touchPoint}
          city={0}
          colors={colors}
          iconFireStatus={false}
          checkAllStatus={false}
          iconSixthSenseStatus={false}
          iconCanaryStatus={false}
          visible={false}
          idVisible=""
          handleChange={jest.fn()}
          renderProps={jest.fn()}
          updateTouchpointOnOff={jest.fn()}
          openModalParent={jest.fn()}
        />
      );

      const result = wrapper.instance().ColorBorder(touchPoint, colors, true);
      expect(result).toMatch('2px solid rgb(255,76,76)');
    });

    it('touchpoint unselect', () => {
      const touchPoint = {
        status_on_off: false,
        city: 0,
        index: 0,
        error: false,
        highlighted: false,
        countrys: [0, 1],
        history_error: false,
        dashboard_url: ['www.google.com'],
        sixth_sense_url: [[]]
      };
      const wrapper = mount(
        <TouchPoint
          touchpoint={touchPoint}
          city={0}
          colors={colors}
          iconFireStatus={false}
          checkAllStatus={false}
          iconSixthSenseStatus={false}
          iconCanaryStatus={false}
          visible={false}
          idVisible=""
          handleChange={jest.fn()}
          renderProps={jest.fn()}
          updateTouchpointOnOff={jest.fn()}
          openModalParent={jest.fn()}
        />
      );

      const result = wrapper.instance().ColorBorder(touchPoint, colors, true);
      expect(result).toMatch('1px solid rgb(189,189,189)');
    });
  });

  describe('BackgroundTouchPoint function', () => {
    const touchPoint = {
      status_on_off: false,
      city: 0,
      index: 0,
      error: false,
      highlighted: false,
      countrys: [0, 1],
      history_error: false,
      dashboard_url: ['www.google.com'],
      sixth_sense_url: [[]]
    };

    const wrapper = mount(
      <TouchPoint
        touchpoint={touchPoint}
        city={0}
        colors={colors}
        iconFireStatus={false}
        checkAllStatus={false}
        iconSixthSenseStatus={false}
        iconCanaryStatus={false}
        visible={false}
        idVisible=""
        handleChange={jest.fn()}
        renderProps={jest.fn()}
        updateTouchpointOnOff={jest.fn()}
        openModalParent={jest.fn()}
      />
    );

    it('touchpoint active', () => {
      const result = wrapper.instance().BackgroundTouchPoint(false, true);
      expect(result).toMatch('#D7EBF6');
    });

    it('touchpoint status_on_off', () => {
      const result = wrapper.instance().BackgroundTouchPoint(false, false);
      expect(result).toMatch('#D7DADB');
    });

    it('touchpoint empty value', () => {
      const result = wrapper.instance().BackgroundTouchPoint(true, false);
      expect(result).toMatch('');
    });
  });

  describe('ActivateCursor function', () => {
    it('touchpoint not dashboard_url', () => {
      const touchPoint = {
        status_on_off: false,
        city: 0,
        index: 0,
        error: false,
        highlighted: false,
        countrys: [0, 1],
        dashboard_url: false,
        history_error: false,
        sixth_sense_url: [[]]
      };

      const wrapper = mount(
        <TouchPoint
          touchpoint={touchPoint}
          city={0}
          colors={colors}
          iconFireStatus={false}
          checkAllStatus={false}
          iconCanaryStatus={false}
          iconSixthSenseStatus={false}
          visible={false}
          idVisible=""
          handleChange={jest.fn()}
          renderProps={jest.fn()}
          updateTouchpointOnOff={jest.fn()}
          openModalParent={jest.fn()}
        />
      );
      const result = wrapper.instance().ActivateCursor(touchPoint, 0);
      expect(result).toMatch('default');
    });

    it('touchpoint dashboard_url with city', () => {
      const touchPoint = {
        status_on_off: false,
        city: 0,
        index: 0,
        error: false,
        highlighted: false,
        countrys: [0, 1],
        dashboard_url: ['www.google.com'],
        history_error: false,
        sixth_sense_url: [[]]
      };

      const wrapper = mount(
        <TouchPoint
          touchpoint={touchPoint}
          city={0}
          colors={colors}
          iconFireStatus={false}
          checkAllStatus={false}
          iconSixthSenseStatus={false}
          iconCanaryStatus={false}
          visible={false}
          idVisible=""
          handleChange={jest.fn()}
          renderProps={jest.fn()}
          updateTouchpointOnOff={jest.fn()}
          openModalParent={jest.fn()}
        />
      );
      const result = wrapper.instance().ActivateCursor(touchPoint, 0);
      expect(result).toMatch('pointer');
    });

    it('touchpoint dashboard_url with not exist city', () => {
      const touchPoint = {
        status_on_off: false,
        city: 0,
        index: 0,
        error: false,
        highlighted: false,
        countrys: [0, 1],
        dashboard_url: ['www.google.com'],
        history_error: false,
        sixth_sense_url: [[]]
      };

      const wrapper = mount(
        <TouchPoint
          touchpoint={touchPoint}
          city={0}
          colors={colors}
          iconFireStatus={false}
          checkAllStatus={false}
          iconSixthSenseStatus={false}
          iconCanaryStatus={false}
          visible={false}
          idVisible=""
          handleChange={jest.fn()}
          renderProps={jest.fn()}
          updateTouchpointOnOff={jest.fn()}
          openModalParent={jest.fn()}
        />
      );
      const result = wrapper.instance().ActivateCursor(touchPoint, 6);
      expect(result).toMatch('default');
    });
  });

  it('Simulate click', () => {
    window.open = jest.fn();
    const touchPoint = {
      status_on_off: false,
      city: 0,
      index: 0,
      error: false,
      highlighted: false,
      countrys: [0, 1],
      dashboard_url: ['www.google.com'],
      history_error: false,
      sixth_sense_url: [[]]
    };

    const wrapper = mount(
      <TouchPoint
        touchpoint={touchPoint}
        city={0}
        colors={colors}
        iconFireStatus={false}
        checkAllStatus={false}
        iconSixthSenseStatus={false}
        iconCanaryStatus={false}
        visible={false}
        idVisible=""
        handleChange={jest.fn()}
        renderProps={jest.fn()}
        updateTouchpointOnOff={jest.fn()}
        openModalParent={jest.fn()}
      />
    );
    wrapper
      .find('.textContentPoint')
      .at(0)
      .simulate('click');
    window.open.mockClear();
  });

  it('Change idVisible', () => {
    const touchPoint = {
      status_on_off: false,
      city: 0,
      index: 0,
      error: false,
      highlighted: false,
      countrys: [0, 1],
      dashboard_url: ['www.google.com'],
      history_error: false,
      sixth_sense_url: [[]]
    };

    const wrapper = mount(
      <TouchPoint
        touchpoint={touchPoint}
        city={0}
        colors={colors}
        iconFireStatus={false}
        checkAllStatus={false}
        iconSixthSenseStatus={false}
        iconCanaryStatus={false}
        visible
        idVisible="123ABC"
        handleChange={jest.fn()}
        renderProps={jest.fn()}
        updateTouchpointOnOff={jest.fn()}
        openModalParent={jest.fn()}
      />
    );
    wrapper.setState({ idVisible: '123ABC' });
    expect(wrapper.state('idVisible')).toMatch('123ABC');
  });

  it('Function HandleContextMenuPrevent', () => {
    const touchPoint = {
      status_on_off: false,
      city: 0,
      index: 0,
      error: false,
      highlighted: false,
      countrys: [0, 1],
      dashboard_url: ['www.google.com'],
      history_error: false,
      sixth_sense_url: [[]]
    };

    const wrapper = mount(
      <TouchPoint
        touchpoint={touchPoint}
        city={0}
        colors={colors}
        iconFireStatus={false}
        checkAllStatus={false}
        iconSixthSenseStatus={false}
        iconCanaryStatus={false}
        visible
        idVisible="123ABC"
        handleChange={jest.fn()}
        renderProps={jest.fn()}
        updateTouchpointOnOff={jest.fn()}
        openModalParent={jest.fn()}
      />
    );
    const preven = jest.fn();
    wrapper.instance().HandleContextMenuPrevent({
      preventDefault: preven
    });
    expect(preven).toHaveBeenCalledTimes(1);
  });

  it('Function HandleContextMenu', () => {
    window.innerWidth = 200;
    window.innerHeight = 200;
    const touchPoint = {
      status_on_off: false,
      city: 0,
      index: 0,
      error: false,
      highlighted: false,
      countrys: [0, 1],
      dashboard_url: ['www.google.com'],
      history_error: false,
      sixth_sense_url: [[]]
    };

    const wrapper = mount(
      <TouchPoint
        touchpoint={touchPoint}
        city={0}
        colors={colors}
        iconFireStatus={false}
        checkAllStatus={false}
        iconSixthSenseStatus={false}
        iconCanaryStatus={false}
        visible
        idVisible="123ABC"
        handleChange={jest.fn()}
        renderProps={jest.fn()}
        updateTouchpointOnOff={jest.fn()}
        openModalParent={jest.fn()}
      />
    );

    wrapper.instance().HandleContextMenu({
      preventDefault: jest.fn(),
      button: 2,
      clientX: 160,
      clientY: 180
    });
    expect(wrapper.state('stylesContext')).toEqual({
      left: '5px',
      top: '5px'
    });
  });

  it('Function HandleClickonOff', () => {
    const touchPoint = {
      status_on_off: false,
      city: 0,
      index: 0,
      error: false,
      highlighted: false,
      countrys: [0, 1],
      dashboard_url: ['www.google.com'],
      history_error: false,
      sixth_sense_url: [[]]
    };
    const renderProps = jest.fn();
    const updateTouchpointOnOff = jest.fn();
    const wrapper = mount(
      <TouchPoint
        touchpoint={touchPoint}
        city={0}
        colors={colors}
        iconFireStatus={false}
        checkAllStatus={false}
        iconSixthSenseStatus={false}
        iconCanaryStatus={false}
        visible
        idVisible="123ABC"
        handleChange={jest.fn()}
        renderProps={renderProps}
        updateTouchpointOnOff={updateTouchpointOnOff}
        openModalParent={jest.fn()}
      />
    );
    wrapper.instance().HandleClickonOff();
    expect(renderProps).toHaveBeenCalledTimes(1);
    expect(updateTouchpointOnOff).toHaveBeenCalledTimes(1);
  });

  it('Function HandleClickTune', () => {
    const touchPoint = {
      status_on_off: false,
      city: 0,
      index: 0,
      error: false,
      highlighted: false,
      countrys: [0, 1],
      dashboard_url: ['www.google.com'],
      history_error: false,
      sixth_sense_url: [[]]
    };
    const renderProps = jest.fn();
    const openModalParent = jest.fn();
    const wrapper = mount(
      <TouchPoint
        touchpoint={touchPoint}
        city={0}
        colors={colors}
        iconFireStatus={false}
        checkAllStatus={false}
        iconSixthSenseStatus={false}
        iconCanaryStatus={false}
        visible
        idVisible="123ABC"
        handleChange={jest.fn()}
        renderProps={renderProps}
        updateTouchpointOnOff={jest.fn()}
        openModalParent={openModalParent}
      />
    );
    wrapper.instance().HandleClickTune();
    expect(renderProps).toHaveBeenCalledTimes(1);
    expect(openModalParent).toHaveBeenCalledTimes(1);
  });

  it('Function HandleClickQueries', () => {
    const touchPoint = {
      status_on_off: false,
      city: 0,
      index: 0,
      error: false,
      highlighted: false,
      countrys: [0, 1],
      dashboard_url: ['www.google.com'],
      history_error: false,
      sixth_sense_url: [[]]
    };
    const renderProps = jest.fn();
    const openModalParent = jest.fn();
    const wrapper = mount(
      <TouchPoint
        touchpoint={touchPoint}
        city={0}
        colors={colors}
        iconFireStatus={false}
        checkAllStatus={false}
        iconSixthSenseStatus={false}
        iconCanaryStatus={false}
        visible
        idVisible="123ABC"
        handleChange={jest.fn()}
        renderProps={renderProps}
        updateTouchpointOnOff={jest.fn()}
        openModalParent={openModalParent}
      />
    );
    wrapper.instance().HandleClickQueries();
    expect(renderProps).toHaveBeenCalledTimes(1);
    expect(openModalParent).toHaveBeenCalledTimes(1);
  });
});
