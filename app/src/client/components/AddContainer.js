import React from 'react';
import * as container from './build/server/container.js';

const AddContainer = ({ params, addContainer }) => {
  let image = '';
  const handler = event => {image = event.target.value;};

  const submit = () => {
    container.add(params.uuid, image)
      .then(result => addContainer(params.uuid, result));
  };

  return (
    <div>
      <input type="text" onChange={handler} />
      AddContainer
      <button onClick={submit}>Submit</button>
    </div>
  );
};

AddContainer.propTypes = {
  params: React.PropTypes.object,
  addContainer: React.PropTypes.func
};


export default AddContainer;
