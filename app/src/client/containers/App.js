import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadConfig } from '../actions/index';

import NavLink from '../components/NavLink';
import ProjectLinks from '../components/ProjectLinks';

class App extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(loadConfig());
  }

  render() {
    const { children, config } = this.props;
    return (
      <div>
        <ul role="nav" id="menu" className="nav">
          <li className="nav-item proj-anchor">
            <NavLink to="/" onlyActiveOnIndex>
                Projects
            </NavLink>
          </li>
          <li className="add-proj-wrapper">
            <NavLink to="/addProject" className="add-proj-icon">
              <img src="./client/images/png/addIcon@2x.png"></img>
            </NavLink>
          </li>
          {<ProjectLinks projects={config.projects} />}
        </ul>
          <div id="right-column">
            <div className="content-top-nav">
             <div className="btn-group top-nav-btn-group" data-toggle="buttons">
               <label className="btn btn-primary active">
                <input type="radio" name="options" id="option1" autoComplete="off"></input>
                  <img src="./client/images/png/music@2x.png"></img>
               </label>
               <label className="btn btn-primary">
                 <input type="radio" name="options" id="option2" autoComplete="off"></input>
                   <img src="./client/images/png/power@2x.png"></img>
               </label>
               <label className="btn btn-primary">
                 <input type="radio" name="options" id="option3" autoComplete="off"></input>
                   <img src="./client/images/png/tool@2x.png"></img>
               </label>
             </div>
            </div>
            <div id="content">
              {children}
            </div>
          </div>
        </div>
    );
  }
}

function mapStateToProps(state) {
  const { config } = state;
  return { config };
}

App.propTypes = {
  children: PropTypes.object,
  config: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
};

App.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(App);
