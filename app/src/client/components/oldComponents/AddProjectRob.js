import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home.js';

import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

export default React.createClass({
  render() {
    console.log(this.props);
    return (
        <div>
          <div id="header">
            <h5>DockDev <small>beta</small></h5>
          </div>
        <div id="addBody">
          <div>
            <Link to="/"> Back </Link>
          </div>
          <div className="container-fluid" id="content-container">
            <div>
              <h2>Add Project</h2>
              <p id="addText">DockDev will create a container for you after you assign a name and select a folder/create a directory.</p>
              <input className="form-control form-control-lg" type="text" placeholder="Name" />
              <button type="button" className="btn btn-primary-outline btn-block">Select Path</button>

            </div>
          </div>
        </div>
      </div>
    );
  }
});
