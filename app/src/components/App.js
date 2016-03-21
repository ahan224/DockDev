import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import AddProject from './components/AddProject';
import { Link } from 'react-router';

import utils from './app/src/utils.js';

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
    }
  }

  // componentDidUpdate() {
  //   console.log('state updated', this.state);
  // }

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

  // projectSelect(uuid) {
  //   console.log(uuid);
  // }

  render() {
    return (
      <div id="header">
  			<h5>DockDev <small>beta</small></h5>
  		</div>
  		<div id="menu">
  			<div id="createProject">
  				Add
  			</div>
  			<div id="bottomNav">
  				Settings
  			</div>
  		  <div>Home</div>
  		  <div>About</div>
  		</div>
  		<div id="content">
  		  <div class="container-fluid" id="content-container">
  		    <div class="row">
  		      <div class="col-md-6">
  		        <div class="card">
  		        </div>
  		      </div>
  		      <div class="col-md-6">
  		        <div class="card">
  		        </div>
  		      </div>
  		    </div>
  		  </div>
  		</div>

    );
  }
}
