import React from 'react';
import PropTypes from 'prop-types';
import Data from '../config/view.json';

const AppContext = React.createContext();

export class AppProvider extends React.Component {
  state = Data;

  render() {
    return (
      <AppContext.Provider value={{ state: this.state }}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

AppProvider.propTypes = {
  children: PropTypes.object.isRequired
};

export default AppContext;
