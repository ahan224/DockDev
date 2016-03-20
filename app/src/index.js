'use-strict';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

import App from './components/App';




// import SideMenu from './components/SideMenu.js';
// import * as utils from './lib/utils.js';

render((
  <Router history={hashHistory}>
    <Route path="/" component={App} />
  </Router>
), document.getElementclassName('app'));
