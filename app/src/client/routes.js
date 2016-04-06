import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import Home from './components/Home';
import AddProject from './containers/AddProject';
import ProjectDetails from './containers/ProjectDetails';
// import ProjectSettings from './components/ProjectSettings';
// import ProjectDeploy from './components/ProjectDeploy';
import ProjectNav from './components/ProjectNav';
import AddContainerPage from './containers/AddContainerPage';
// import Init from './components/Init';
// import Settings from './components/Settings';

export default (
  <Route path="/" component={App} >
    <IndexRoute component={Home} />
    <Route path="/addProject" component={AddProject} />
    <Route path="/projects/:projectName" component={ProjectNav} >
      <IndexRoute component={ProjectDetails} />
      <Route path="/projects/:projectName/container" component={AddContainerPage} />
    </Route>
  </Route>
);

// <Route path="/init/:id" component={Init} />
// <Route path="/settings" component={Settings} />
//   <Route path="/projects/:projectName/settings" component={ProjectSettings} />
//   <Route path="/projects/:projectName/deploy" component={ProjectDeploy} />
