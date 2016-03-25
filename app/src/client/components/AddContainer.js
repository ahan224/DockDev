import React from 'react';
import * as container from './build/server/container.js';
import { Link } from 'react-router';

import createBrowserHistory from 'history/lib/createBrowserHistory'

const AddContainer = ({ params, addContainer }) => {
  let image = '';
  const handler = event => {image = event.target.value;};

  const submit = () => {
    console.log(
    container.add(params.uuid, image)
      .then(result => addContainer(params.uuid, result)));
  };

  return (
    <div className="row">
      <div className="col-xs-8">
        <input type="text" className="form-control form-control-md" onChange={handler} placeholder="Container Name"/>
      </div>
      <div>
        <button onClick={submit} className="btn btn-primary-outline" name="submit">Add</button>
      </div>
    </div>
  );
};

AddContainer.propTypes = {
  params: React.PropTypes.object,
  addContainer: React.PropTypes.func
};


export default AddContainer;
