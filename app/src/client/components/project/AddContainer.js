import React, { Component, PropTypes } from 'react';
import DockerImage from '../assets/DockerImage';

class AddContainer extends Component {
  componentDidMount() {
    this.props.getImages(this.props.project.cleanName);
  }

  render() {
    const { availableImages } = this.props;
    const servers = availableImages.filter(image => image.server)
      .map((image, idx) => {
        const style = {};
        if (image.selected) {
          style.color = 'white';
          style.backgroundColor = '#286090';
          style.borderRadius = '6px';
          style.borderColor = '#286090';
        }
        const onClick = () => this.props.onClick(image, idx);

        return (
          <DockerImage key={idx} style={style} className="col-xs-6"
            name={image.name} handler={onClick}
          />
        );
      });

    const dbs = availableImages.filter(image => !image.server)
      .map((image, idx) => {
        const style = {};
        if (image.selected) {
          style.color = 'white';
          style.backgroundColor = '#286090';
          style.borderRadius = '6px';
          style.borderColor = '#286090';
        }
        const onClick = () => this.props.onClick(image, idx + servers.length);

        return (
          <DockerImage key={idx} style={style} className="col-xs-6"
            name={image.name} handler={onClick}
          />
        );
      });

    return (
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
              {servers}
          </div>
          <div className="col-xs-12" id="databases">
            <h5>Databases</h5>
            <div className="divider"></div>
              {dbs}
          </div>
      </div>
    );
  }
}

AddContainer.propTypes = {
  getImages: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  availableImages: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default AddContainer;
