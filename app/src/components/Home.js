import React from 'react';
import ReactDOM from 'react-dom';
import AddProject from './AddProject.js';

import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

export default React.createClass ({
  render() {
    return(
      <div>
      <div id="header">
      <h5>DockDev <small>beta</small></h5>
      </div>
      <div id="menu">
      <div>
        <Link to="/addproject">Add</Link>
      </div>
      </div>
      <div id="content">
      <div className="container-fluid" id="content-container">
      <div className="row">
      <div className="col-md-6"><div className="card"></div>
      </div>
      <div className="col-md-6"><div className="card"></div>
      </div>
      </div>
      </div>
      </div>
    </div>);
  }
})
