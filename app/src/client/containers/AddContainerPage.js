import { connect } from 'react-redux';
import AddContainer from '../components/AddContainer';
import { loadImages } from '../actions/index';

function mapStateToProps(state) {
  return state;
}

export default connect(
  mapStateToProps, {
    loadImages,
  }
)(AddContainer);
