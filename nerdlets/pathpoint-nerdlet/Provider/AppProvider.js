import React from "react";
import Data from "../config/view.json";

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

export default AppContext;