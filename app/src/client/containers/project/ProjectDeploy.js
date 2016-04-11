import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { clickDeployRemote } from '../../actions/index';

const ProjectDeploy = ({ deployProject }) => (
  <div>
    <div className="alert alert-success" role="alert">
      <button onClick={deployProject}>Deploy</button>
    </div>
  </div>
);

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    deployProject: () => dispatch(clickDeployRemote(ownProps.params.projectName)),
  };
}

ProjectDeploy.propTypes = {
  deployProject: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectDeploy);
