import React, { Component } from 'react';
import { AccountsQuery } from 'nr1';

class index extends Component {
  state = {
    id: 0
  };

  componentDidMount() {
    this.setAccountId();
  }

  setAccountId = async () => {
    const idAccount = await this.recoveId();
    this.setState({ id: idAccount });
  };

  calculateSum = (a, b) => a + b;

  recoveId = async () => {
    const { data } = await AccountsQuery.query();
    return data[0].id;
  };

  render() {
    return <div>Este es mi account id {this.state.id}</div>;
  }
}

export default index;
