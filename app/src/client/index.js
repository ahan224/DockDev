import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import App from './components/app/App';
import Home from './components/app/Home';
import AddProject from './components/app/AddProject';
import ProjectDetails from './components/project/ProjectDetails';
import ProjectSettings from './components/project/ProjectSettings';
import ProjectDeploy from './components/project/ProjectDeploy';
import ProjectNav from './components/project/ProjectNav';
import AddContainer from './components/project/AddContainer';
import Init from './components/app/Init';
import Settings from './components/app/Settings';

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
