import React from 'react';
import { connect } from 'react-redux';
import Container from '../../components/assets/Container';
import ServerDetails from '../../components/assets/ServerDetails';
import { clickDelContainer } from '../../actions/index';
import { availableImages } from './server/main';
import NavLink from '../../components/assets/NavLink';

const ProjectDetail = (props) => {
  const server = props.project.containers
    .filter(cont => cont.server)
    .map(cont => {
      const onClick = () => props.clickDelContainer(cont);
      return (
        <ServerDetails
          key={cont.name}
          details={cont}
          onClick={onClick}
          logo={availableImages.logo[cont.image]}
        />
      );
    });

  const dbs = props.project.containers
    .filter(cont => !cont.server)
    .map(cont => {
      const onClick = () => props.clickDelContainer(cont);
      return (
        <Container
          key={cont.name}
          details={cont}
          onClick={onClick}
          logo={availableImages.logo[cont.image]}
        />
      );
    });

  return (
    <div className="project-wrapper">
        <div className="row">
          <div className="col-xs-12" id="servers">
            <h5>Servers</h5>
            <NavLink to={`/projects/${props.project.cleanName}/container`}
              className="add-proj-wrapper"
            >
              <button className="btn btn-sm btn-primary-outline container-add">
                Add Container
              </button>
            </NavLink>
            <div className="divider"></div>
          </div>
          {server}
        </div>
        <div className="row" >
          <div className="col-xs-12" id="databases">
            <h5>Databases</h5>
            <div className="divider"></div>
            {dbs}
          </div>
        </div>
    </div>
  );
};

ProjectDetail.propTypes = {
  project: React.PropTypes.object,
  clickDelContainer: React.PropTypes.func,
};

function mapStateToProps(state, ownProps) {
  const project = state.projects[ownProps.params.projectName];
  return { project };
}

export default connect(
  mapStateToProps,
  { clickDelContainer }
)(ProjectDetail);
