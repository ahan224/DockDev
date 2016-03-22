import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import App from './components/App';
import Repos from './components/Repos';
import Repo from './components/Repo';
import About from './components/About';
import Home from './components/Home';
import AddProject from './components/AddProject';
import Project from './components/Project';
import Projects from './components/Projects';

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/repos" component={Repos} >
        <Route path="/repos/:userName/:repoName" component={Repo} />
      </Route>
      <Route path="/about" component={About} />
      <Route path="/addProject" component={AddProject} />
      <Route path="/projects" component={Projects} />
      <Route path="/projects/:id" component={Project} />
    </Route>
  </Router>
), document.getElementById('app'));
