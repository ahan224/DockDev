import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { clickRemoveProject, redirect } from '../../actions/index';

const ProjNavLinks = ({ cleanName, remove }) => (
  <div className="btn-group">
    <button type="button" className="btn btn-info-outline dropdown-toggle"
      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
    >
      <span className="sr-only">Toggle Dropdown</span>
    </button>
    <div className="dropdown-menu">
      <ul>
        <li>
          <div className="row">
            <div className="col-xs-4">
              <div className="placeholder-icon"></div>
            </div>
            <div className="col-xs-8">
              <button className="dropdown-item">
                <Link className="nav-link" to={`/projects/${cleanName}`}>Home</Link>
              </button>
            </div>
          </div>
        </li>
        <li>
          <div className="row">
            <div className="col-xs-4">
              <div className="placeholder-icon"></div>
            </div>
            <div className="col-xs-8">
              <button className="dropdown-item">
                <Link className="nav-link" to={`/projects/${cleanName}/container`}>Add</Link>
              </button>
            </div>
          </div>
        </li>
      </ul>
      <div className="dropdown-divider"></div>
      <div className="row">
        <div className="col-xs-4">
          <div className="placeholder-icon"></div>
        </div>
        <div className="col-xs-8">
          <button className="dropdown-item" onClick={remove}>Delete</button>
        </div>
      </div>
    </div>
  </div>
);

ProjNavLinks.propTypes = {
  cleanName: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch, ownProps) {
  const { cleanName } = ownProps;
  return {
    remove: () => {
      dispatch(clickRemoveProject(cleanName));
      return dispatch(redirect(''));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjNavLinks);
