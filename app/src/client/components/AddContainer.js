import React from 'react';
import * as container from './server/container.js';
import * as images from './server/availableImages.js';
import DockerImage from './DockerImage';

class AddContainer extends React.Component {
  constructor() {
    super();
    this.clickServer = this.clickServer.bind(this);
    this.clickDb = this.clickDb.bind(this);
    this.submit = this.submit.bind(this);
    this.state = {
      selServer: 'node',
      selDbs: [],
      servers: [],
      dbs: [],
    };
  }

  componentDidMount() {
    this.addImagesToState();
  }

  addImagesToState() {
    const servers = images.getServers();
    const dbs = images.getDbs();
    this.setState({ servers, dbs });
  }

  clickServer(selServer) {
    return () => {
      this.setState({ selServer });
    };
  }

  clickDb(selDb) {
    return () => {
      // if already in the array, remove it
      const selDbs = this.state.selDbs;
      const idx = selDbs.indexOf(selDb);
      if (idx > -1) {
        selDbs.splice(idx, 1);
      } else {
        selDbs.push(selDb);
      }
      this.setState({ selDbs });
    };
  }

  submit() {
    const containers = this.state.selDbs.concat(this.state.selServer);
    containers.forEach(val => {
      container.add(this.props.params.uuid, val, this.props.addContainer);
    });

    this.props.context.router.replace(`/projects/${this.props.params.uuid}`);
  }

  render() {
    const serverDisplay = this.state.servers.map((val, idx) => {
      const style = {};
      if (val.name === this.state.selServer) {
        style.color = 'white';
        style.backgroundColor = '#286090';
        style.borderRadius = '6px';
        style.borderColor = '#286090';
      }
      return (
        <DockerImage key={idx} style={style} className="col-xs-6"
          name={val.name} handler={this.clickServer(val.name)}
        />
      );
    });

    // adds blue text onclick to container selection
    const dbDisplay = this.state.dbs.map((val, idx) => {
      const style = {};
      if (this.state.selDbs.indexOf(val.name) > -1) {
        style.color = 'white';
        style.backgroundColor = '#286090';
        style.borderRadius = '6px';
        style.borderColor = '#286090';
      }
      return (
        <DockerImage key={idx} style={style}
          name={val.name} handler={this.clickDb(val.name)}
        />
      );
    });

    return (
      <div className="project-wrapper">
          <div className="col-xs-4 proj-detail-title" id="servers" style={{ padding: '0px' }}>
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
            {serverDisplay}
          </div>
          <div className="col-xs-12" id="databases">
            <h5>Databases</h5>
            <div className="divider"></div>
            {dbDisplay}
          </div>
      </div>
    );
  }
}

AddContainer.propTypes = {
  params: React.PropTypes.object,
  addContainer: React.PropTypes.func,
  context: React.PropTypes.object,
};

export default AddContainer;
