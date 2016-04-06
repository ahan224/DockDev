import React from 'react';
// import DockerImage from './DockerImage';

const AddContainer = ({ loadImages }) => (
  <div className="project-wrapper">
      <div className="col-xs-4 proj-detail-title" style={{ padding: '0px' }}>
        <h5 className="text-capitalize">
          Add Container
        </h5>
      </div>
      <div className="col-xs-12" >
        <h5>Servers</h5>
        <button className="btn btn-sm btn-primary-outline container-save" onClick={this.submit}>
          Save
        </button>
        <div className="divider"></div>
      </div>
      <div className="col-xs-12" id="databases">
        <h5>Databases</h5>
        <div className="divider"></div>
      </div>
  </div>
);

AddContainer.propTypes = {
  loadImages: React.PropTypes.func,
};

export default AddContainer;
