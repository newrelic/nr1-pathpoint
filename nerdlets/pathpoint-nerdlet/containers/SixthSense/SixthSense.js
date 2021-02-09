import React from 'react';
import { Modal, Button, HeadingText, BlockText} from 'nr1';


export default class SixthSense extends React.PureComponent {
    constructor() {
      super(...arguments);
      this._onClose = this._onClose.bind(this);
      this.state = {
        hidden: true,
      };
    }
    _onClose() {
      this.setState({ hidden: true });
    }
    render() {
      return (
        <>
          <Button onClick={() => this.setState({ hidden: false })}>
            Open Modal
          </Button>
          <Modal hidden={this.state.hidden} onClose={this._onClose}>
            <HeadingText type={HeadingText.TYPE.HEADING_1}>Modal</HeadingText>
            <BlockText type={BlockText.TYPE.PARAGRAPH}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Dictumst
              quisque sagittis purus sit amet.
            </BlockText>
            <Button onClick={this._onClose}>Close</Button>
          </Modal>
        </>
      );
    }
  }