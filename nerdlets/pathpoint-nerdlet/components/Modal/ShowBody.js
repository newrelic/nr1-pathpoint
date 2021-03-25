import React, { Component } from 'react';
import PropTypes from 'prop-types';

// IMPORT ICONS
import graphImage from '../../images/graph.png';

// IMPORT MESSAGES
import messages from '../../config/messages.json';

// IMPORT COMPONENTS
import { BodyTuneFormModal } from './TuneFormModal';
import { BodyLogoFormModal } from './LogoFormModal';
import { BodyQueryFormModal } from './QueryFormModal';
import { BodyFlameFormModal } from './FlameFormModal';
import { BodyCanaryFormModal } from './CanaryFormModal';
import { BodySupportFormModal } from './SupportFormModal';
import { BodyFileErrorFormModal } from './FileErrorFormModal';
import { BodyJsonConfigurationFormModal } from './JsonConfigurationFormModal';
import { BodyBackgroundProcessesFormModal } from './BackgroundProcessesFormModal';

export default class ShowBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      text: '',
      type: '',
      threshold: '',
      apdex: '',
      subject: '',
      name: '',
      company: '',
      account: '',
      email: '',
      phone: '',
      message: ''
    };
  }

  componentDidMount() {
    const { stageNameSelected } = this.props;
    const error_threshold = stageNameSelected.datos.error_threshold;
    const apdex_time = stageNameSelected.datos.apdex_time;
    if (messages.configuration.support.options_select_support_02.service_1) {
      this.setState({
        subject:
          messages.configuration.support.options_select_support_02.service_1
      });
    }
    if (apdex_time) {
      this.setState({
        apdex: apdex_time
      });
    }
    if (error_threshold) {
      this.setState({
        threshold: error_threshold
      });
    }
  }

  handleOnChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmitSupport = event => {
    event.preventDefault();
    const {
      subject,
      name,
      company,
      account,
      email,
      phone,
      message
    } = this.state;
    const { handleSaveUpdateSupport } = this.props;
    handleSaveUpdateSupport({
      subject,
      name,
      company,
      account,
      email,
      phone,
      message
    });
  };

  handleSubmitLogo = event => {
    event.preventDefault();
    const { url, text, type } = this.state;
    const { LogoFormSubmit, _onClose } = this.props;
    LogoFormSubmit({ url, text, type }, _onClose);
  };

  handleSubmitTune = event => {
    event.preventDefault();
    const { threshold, apdex } = this.state;
    const { handleSaveUpdateTune } = this.props;
    handleSaveUpdateTune({ threshold, apdex });
  };

  showBodyRender = () => {
    const { type } = this.state;
    const { viewModal } = this.props;
    switch (viewModal) {
      case 0:
        return <img src={graphImage} />;
      case 1:
        return <BodyQueryFormModal {...this.props} />;
      case 2:
        return (
          <BodyTuneFormModal
            {...this.props}
            handleOnChange={this.handleOnChange}
            handleSubmitTune={this.handleSubmitTune}
          />
        );
      case 3:
        return <div />;
      case 4:
        return <BodyJsonConfigurationFormModal {...this.props} />;
      case 5:
        return (
          <BodySupportFormModal
            {...this.props}
            handleOnChange={this.handleOnChange}
            handleSubmitSupport={this.handleSubmitSupport}
          />
        );
      case 6:
        return <BodyCanaryFormModal {...this.props} />;
      case 7:
        return <BodyFlameFormModal {...this.props} />;
      case 8:
        return <BodyFileErrorFormModal {...this.props} />;
      case 9:
        return <BodyBackgroundProcessesFormModal {...this.props} />;
      case 10:
        return (
          <BodyLogoFormModal
            handleSubmitLogo={this.handleSubmitLogo}
            handleOnChange={this.handleOnChange}
            type={type}
          />
        );
    }
  };

  render() {
    return this.showBodyRender();
  }
}

ShowBody.propTypes = {
  viewModal: PropTypes.number.isRequired,
  LogoFormSubmit: PropTypes.func.isRequired,
  _onClose: PropTypes.func.isRequired,
  handleSaveUpdateTune: PropTypes.func.isRequired,
  handleSaveUpdateSupport: PropTypes.func.isRequired,
  stageNameSelected: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};
