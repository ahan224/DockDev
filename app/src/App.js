'use-strict';

import React from 'react';
import { render } from 'react-dom';
import SideMenu from './components/SideMenu.js';
import * as utils from './lib/utils.js';



class App extends React.Component {
  constructor() {
    super();
    this.addProject = this.addProject.bind(this);
    this.state = {
      projects: {
        'first': {
          projectName: 'test',
          uuid: 1234556667
        }
      }
    }
  }

  addProject(e) {
    remote.dialog
      .showOpenDialog(
        { properties: ['openDirectory', 'createDirectory'] },
        selectedDir => {
          return utils.initProject(selectedDir[0], 'TEST')
            .then(() => this.updateProject(utils.memory))
        }
      )
  }

  updateProject(memory) {
    this.setState({ projects: memory })
  }

  settingsClick(e) {

  }

  componentDidUpdate() {
    console.log('state updated', this.state);
  }

  render() {
    return (
      <div className="pane-group">
        <SideMenu projects={this.state.projects} addProject={this.addProject} settingsClick={this.settingsClick}/>
      </div>
    );
  }
}


render(<App/>, document.getElementById('main'));

// console.log(utils.memory);
//
// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); // prints "pong"
//
// ipcRenderer.on('asynchronous-reply', function(event, arg) {
//   console.log(arg); // prints "pong"
// });
//
// ipcRenderer.send('asynchronous-message', 'ping');
