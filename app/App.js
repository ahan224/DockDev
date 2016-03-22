import React from 'react';
import ReactDom from 'react-dom';
// import * as utils from './lib/utils.js';
// import About from './components/AddProject';
import { Router, Route, hashHistory, IndexRoute, Link, RouteHandler } from 'react-router';

import Home from './src/components/Home.js';
import AddProject from './src/components/AddProject.js';

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

   updateProject (memory) {
    this.setState({ projects: memory });
  }

  settingsClick (e) {
  }

  projectSelect(uuid) {
    console.log(uuid)
  }

  render(){
    return (
    <Router history={hashHistory}>
      <Route path="/" component={Home}/>
      <Route path="/addproject" handler={Home} component={AddProject} addProj={this.addProject} />
    </Router>
    );
  }

}

ReactDom.render(
  <App />
  , document.getElementById('app')
);
