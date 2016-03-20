'use-strict';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import SideMenu from './components/SideMenu.js';
import * as utils from './lib/utils.js';

class App extends React.Component {
  constructor() {
    super();
    this.addProject = this.addProject.bind(this);
    this.projectSelect = this.projectSelect.bind(this);
    this.state = {
      projects: {
        first: {
          projectName: 'test',
          uuid: 1234556667
        }
      }
    };
  }

  componentDidUpdate() {
    console.log('state updated', this.state);
  }

  addProject(e) {
    remote.dialog
      .showOpenDialog(
        { properties: ['openDirectory', 'createDirectory'] },
        selectedDir => {
          const name = selectedDir[0].split('/').pop();
          return utils.initProject(selectedDir[0], name)
            .then(() => this.updateProject(utils.memory));
        }
      );
  }

  updateProject(memory) {
    this.setState({ projects: memory });
  }

  // settingsClick(e) {
  //
  // }

  projectSelect(uuid) {
    console.log(uuid);
  }

  render() {
    return (
      <div className="pane-group">
        <SideMenu projects={this.state.projects}
          addProject={this.addProject}
          settingsClick={this.settingsClick}
          projectSelect={this.projectSelect}
        />
      </div>
    );
  }
}


// console.log(utils.memory);
//
// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); // prints "pong"
//
// ipcRenderer.on('asynchronous-reply', function(event, arg) {
//   console.log(arg); // prints "pong"
// });
//
// ipcRenderer.send('asynchronous-message', 'ping');
