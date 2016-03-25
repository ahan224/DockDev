import React from 'react';

const Container = (props) => {

  console.log('ContainerComponent: ',props);
  return (
    <li>
      <ul>
        <li>
          {props.details[1].image}
        </li>
        <li>

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
