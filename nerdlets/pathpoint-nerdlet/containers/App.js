import React from "react";
import MainContainer from "./MainContainer/MainContainer.js";
import { AppProvider } from "../Provider/AppProvider.js";
export default class SlingNerdletNerdletNerdlet extends React.Component {
  render() {
    return (
      <AppProvider>
        <MainContainer />
      </AppProvider>
    );
  }
}
