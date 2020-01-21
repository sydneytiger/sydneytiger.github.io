import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import Editor from './editor';
import Viewer from './viewer';

export default class App extends Component {
  render() {
    const width = window.innerHeight * 0.7;
    return (
      <SplitPane split="horizontal" defaultSize={width}>
        <Editor />
        <Viewer />
      </SplitPane>
    );
  }
}
