import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import App from './components/App';
import Home from './components/Home';
import AddProject from './components/AddProject';
import Project from './components/Project';
// import Projects from './components/Projects';

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/addProject" component={AddProject} />
      <Route path="/projects/:id" component={Project} />
    </Route>
  </Router>
), document.getElementById('app'));
