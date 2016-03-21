import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import App from './components/App';
import AddProject from './components/AddProject';

import About from './components/AddProject';
import Home from './components/Home';
// import * as utils from 'lib/utils.js';

render((
  <Home/>
), document.getElementbyId('app'));

<Router history={hashHistory}>
  <Route path="/" component={App} />
  <Route path="/about" component={AddProject} />
</Router>
