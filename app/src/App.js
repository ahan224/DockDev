'use-strict';

import React from 'react';
import { render } from 'react-dom';
import SideMenu from './components/SideMenu.js';
import * as utils from './lib/utils.js';

console.log(utils.memory);


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      projects: {}
    }
  }

  handleProject(e) {
    this.setState({ projects: e });
  }

  addProject(e){
  console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); // prints "pong"
  ipcRenderer.on('asynchronous-reply', function(event, arg) {
    console.log(arg); // prints "pong"
  });
  ipcRenderer.send('asynchronous-message', 'ping');
  }

  componentDidUpdate() {
    console.log('state updated', this.state);
  }

  render() {
    return (
      <div className="pane-group">
        <SideMenu projects={this.state.projects} handleProject={this.handleProject} addProject={this.addProject}/>
      </div>
    );
  }
}

//
// <ProjectDetailList projects={this.state.projects}/>

render(<App/>, document.getElementById('main'));
