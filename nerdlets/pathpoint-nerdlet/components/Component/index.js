import React, { Component } from 'react';
import { AccountsQuery } from 'nr1';

class index extends Component {
  calculateSum = (a, b) => a + b;

  recoveId = () => {
    const { data } = AccountsQuery.query();
    return data[0].id;
  };

  render() {
    return <div>Este es mi account id {this.recoveId()}</div>;
  }
}

export default index;
