import React from 'react';

const Container = (props) => {

  console.log('ContainerComponent: ',props);
  return (
    <li>
      <ul>
        <li>
          <h3>{props.details[1].image}</h3>
        </li>
        <li>
          <p>Some description here.</p>
        </li>
      </ul>
      <button>Start</button>
      <button>Stop</button>
      <button>Restart</button>
      <button>Delete</button>
    </li>
  );
};

export default Container;
