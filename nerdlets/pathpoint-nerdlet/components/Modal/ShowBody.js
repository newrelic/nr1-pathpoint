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
import { BodyGeneralConfigurationFormModal } from './GeneralConfigurationFormModal';
import { BodyBackgroundProcessesFormModal } from './BackgroundProcessesFormModal';

export default class ShowBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      text: '',
      type: '',
      subject: '',
      name: '',
      company: '',
      account: '',
      email: '',
      phone: '',
      message: '',
      min_count: 0,
      max_count: 0,
      min_apdex: 0,
      max_response_time: 0,
      max_error_percentage: 0,
      max_avg_response_time: 0,
      max_total_check_time: 0,
      min_success_percentage: 0
    };
  }

  componentDidMount() {
    const { stageNameSelected } = this.props;
    if (
      stageNameSelected &&
      stageNameSelected.datos &&
      stageNameSelected.datos[0]
    ) {
      let {
        min_count,
        max_count,
        min_apdex,
        max_response_time,
        max_error_percentage,
        max_avg_response_time,
        max_total_check_time,
        min_success_percentage
      } = this.state;
      switch (stageNameSelected.datos[0].type) {
        case 'PRC':
        case 'PCC':
          min_count = stageNameSelected.datos[0].min_count;
          max_count = stageNameSelected.datos[0].max_count;
          break;
        case 'APP':
        case 'FRT':
          min_apdex = stageNameSelected.datos[0].min_apdex;
          max_response_time = stageNameSelected.datos[0].max_response_time;
          max_error_percentage =
            stageNameSelected.datos[0].max_error_percentage;
          break;
        case 'SYN':
          max_avg_response_time =
            stageNameSelected.datos[0].max_avg_response_time;
          max_total_check_time =
            stageNameSelected.datos[0].max_total_check_time;
          min_success_percentage =
            stageNameSelected.datos[0].min_success_percentage;
      }
      this.setState({
        min_count: min_count,
        max_count: max_count,
        min_apdex: min_apdex,
        max_response_time: max_response_time,
        max_error_percentage: max_error_percentage,
        max_avg_response_time: max_avg_response_time,
        max_total_check_time: max_total_check_time,
        min_success_percentage: min_success_percentage
      });
    }
    if (messages.configuration.support.options_select_support_02.service_1) {
      this.setState({
        subject:
          messages.configuration.support.options_select_support_02.service_1
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
    const {
      min_count,
      max_count,
      min_apdex,
      max_response_time,
      max_error_percentage,
      max_avg_response_time,
      max_total_check_time,
      min_success_percentage
    } = this.state;
    const { handleSaveUpdateTune } = this.props;
    handleSaveUpdateTune({
      min_count,
      max_count,
      min_apdex,
      max_response_time,
      max_error_percentage,
      max_avg_response_time,
      max_total_check_time,
      min_success_percentage
    });
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
        return (
          <BodyGeneralConfigurationFormModal
            {...this.props}
            handleOnChange={this.props.HandleCredentialsFormChange}
            handleFormSubmit={this.props.handleSaveUpdateGeneralConfiguration}
            resetCredentials={this.props.resetCredentials}
          />
        );
      case 10:
        return (
          <BodyLogoFormModal
            handleSubmitLogo={this.handleSubmitLogo}
            handleOnChange={this.handleOnChange}
            type={type}
          />
        );
      case 11:
        return <BodyBackgroundProcessesFormModal {...this.props} />;
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
  HandleCredentialsFormChange: PropTypes.func,
  resetCredentials: PropTypes.func,
  stageNameSelected: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  handleSaveUpdateGeneralConfiguration: PropTypes.func
};
