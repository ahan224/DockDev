'use-strict';

import React from 'react';
import { render } from 'react-dom';
import SideMenu from './components/SideMenu.js';
import * as utils from './lib/utils.js';

console.log(utils.memory);

console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); // prints "pong"

ipcRenderer.on('asynchronous-reply', function(event, arg) {
  console.log(arg); // prints "pong"
});

ipcRenderer.send('asynchronous-message', 'ping');


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      projects: {}
    }
  }

  handleProjects(e) {
    this.setState({ projects: e });
  }

  componentDidUpdate() {
    console.log('state updated', this.state);
  }

  render() {
    return (
      <div className="pane-group">
        <SideMenu projects={this.state.projects} handleProjects={this.handleProjects}/>
      </div>
    );
  }
}

//
// <ProjectDetailList projects={this.state.projects}/>

render(<App/>, document.getElementById('main'));
