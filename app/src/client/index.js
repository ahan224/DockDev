import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import App from './components/App';
import Home from './components/appChild/Home';
import AddProject from './components/appChild/AddProject';
import ProjectDetails from './components/appChild/projChild/ProjectDetails';
import ProjectSettings from './components/appChild/projChild/ProjectSettings';
import ProjectDeploy from './components/appChild/projChild/ProjectDeploy';
import ProjectNav from './components/appChild/ProjectNav';
import AddContainer from './components/appChild/projChild/AddContainer';
import Init from './components/appChild/Init';
import Settings from './components/appChild/Settings';

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
