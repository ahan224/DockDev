import React from 'react';
import { connect } from 'react-redux';
import Container from '../../components/assets/Container';

const ProjectDetail = ({ project }) => {
  const server = project.containers
    .filter(cont => cont.server)
    .map(cont =>
      <Container
        key={cont.projectName}
        container={cont}
      />
    );

  const dbs = project.containers
    .filter(cont => !cont.server)
    .map(cont =>
      <Container
        key={cont.projecName}
        container={cont}
      />
    );
  return (
    <div className="project-wrapper">
        <div className="row">
          <div className="col-xs-12" id="servers">
            <h5>Servers</h5>
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
};

function mapStateToProps(state, ownProps) {
  const project = state.projects[ownProps.params.projectName];
  return { project };
}

export default connect(mapStateToProps)(ProjectDetail);
