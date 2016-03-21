import React from 'react';
import ReactDom from 'react-dom';
import AddProject from './AddProject.js';
import { Router, Route, hashHistory} from 'react-router'


export class Home extends React.Component {
  render() {
    return (<div>
      <div id="header">
        <h5>DockDev <small>beta</small></h5>
      </div>
      <div id="menu">
        <div>
          <AddProject path="/addproject" />
        </div>
        <div className="activeProjects">
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
}
