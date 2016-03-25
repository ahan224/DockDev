import React from 'react';
import * as container from './server/container.js';
import * as images from './server/availableImages.js';
import DockerImage from './DockerImage';

class AddContainer extends React.Component {
  constructor() {
    super();
    this.clickServer = this.clickServer.bind(this);
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

  clickServer(server) {
    return () => {
      console.log(server);
      this.setState({ server });
    };
  }

  render() {
    // if val = selServer, add a class to it
    const serverDisplay = this.state.servers.map((val, idx) =>
      <DockerImage key={idx} name={val} handler={this.clickServer(val)} />);

    // same concept for databases

    return (
      <div>
        {serverDisplay}
      </div>
    );
  }
}


// const AddContainer = ({ params, addContainer }) => {
//   let error;
//   const errors = [
//     <div key="1">Error</div>,
//     '',
//   ];
//
//   const server = ['node', 'notNode'];
//   let serverSelect = server[0];
//   const serverChange = event => {
//     console.log(event.target.value);
//     serverSelect = event.target.value;
//   };
//
//   const submit = () => {
//     if (serverSelect === 'notNode') {
//       error = errors[0];
//       console.log(error);
//     } else {
//       container.add(params.uuid, serverSelect)
//       .then(result => addContainer(params.uuid, result));
//     }
//   };
//
//   const serverElements = server.map((val, idx) => <option key={idx} value={val}>{val}</option>);
//
//   return (
//     <div>
//       <select onChange={serverChange}>
//         {serverElements}
//       </select>
//       AddContainer
//       <button onClick={submit}>Submit</button>
//       {error}
//     </div>
//   );
// };

AddContainer.propTypes = {
  params: React.PropTypes.object,
  addContainer: React.PropTypes.func,
};


export default AddContainer;
