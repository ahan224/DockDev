import { connect } from 'react-redux';
import ProjectNav from '../../components/project/ProjectNav';
import { clickStartProject } from '../../actions/index';

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    clickStartProject: () => dispatch(clickStartProject(ownProps.params.projectName)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectNav);
