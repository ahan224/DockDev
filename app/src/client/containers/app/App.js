import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadConfig } from '../../actions/index';

import NavLink from '../../components/assets/NavLink';
import ProjectLinks from '../../components/assets/ProjectLinks';
import TopNav from './TopNav';

class App extends Component {
  componentDidMount() {
    this.props.loadConfig();
  }

  render() {
    const { children, projects } = this.props;
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
          {<ProjectLinks projects={projects} />}
        </ul>
          <div id="right-column">
            <TopNav />
            <div id="content">
              {children}
            </div>
          </div>
        </div>
    );
  }
}

function mapStateToProps(state) {
  const { projects } = state;
  return { projects };
}

App.propTypes = {
  children: PropTypes.object,
  projects: PropTypes.object,
  loadConfig: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  { loadConfig }
)(App);
