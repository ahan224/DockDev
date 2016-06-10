import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadConfig, appInitiation } from '../../actions/index';

import NavLink from '../../components/assets/NavLink';
import ProjectLinks from '../../components/assets/ProjectLinks';
import TopNav from './TopNav';
import ReactTooltip from 'react-tooltip';

class App extends Component {

  componentWillMount() {
    // this.props.appInitiation();
  }

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
              <img src="./client/images/png/addIcon@2x.png"  data-tip data-for='sadFace' ></img>
            </NavLink>
          </li>
          <ProjectLinks projects={projects} />
          <div className="sidebar-logo">
            <img src="./client/images/png/dockdevPNG.png" />
          </div>
        </ul>
        <TopNav params={this.props.params} />
        <div id="right-column">
          <div id="content">
            {children}
          </div>
        </div>
        <ReactTooltip id='sadFace' type='warning' effect='solid'>
  <span>Show sad face</span>
</ReactTooltip>

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
  appInitiation: PropTypes.func.isRequired,
  params: PropTypes.object,
};

export default connect(
  mapStateToProps,
  { loadConfig, appInitiation }
)(App);
