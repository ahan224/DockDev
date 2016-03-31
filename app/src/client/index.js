import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import App from './components/App';
import Home from './components/Home';
import AddProject from './components/AddProject';
import ProjectDetails from './components/ProjectDetails';
import ProjectSettings from './components/ProjectSettings';
import ProjectDeploy from './components/ProjectDeploy';
import ProjectNav from './components/ProjectNav';
import AddContainer from './components/AddContainer';
import Init from './components/Init';
import Settings from './components/Settings';

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/addProject" component={AddProject} />
      <Route path="/init/:id" component={Init} />
      <Route path="/settings" component={Settings} />
      <Route path="/projects/:uuid" component={ProjectNav} >
        <IndexRoute component={ProjectDetails} />
        <Route path="/projects/:uuid/settings" component={ProjectSettings} />
        <Route path="/projects/:uuid/deploy" component={ProjectDeploy} />
        <Route path="/projects/:uuid/container" component={AddContainer} />
      </Route>
    </Route>
  </Router>
), document.getElementById('app'));
