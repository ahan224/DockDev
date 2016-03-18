import React from 'react';

const TopNavList = ({ addProject }) => {
  return (
    <div>
      <ul className="list-group container-list container-links topNav">
        <li className="list-group-item add-container">
        <button type="button" name="button" onClick={addProject}>
        Add
        </button>
      </li>
      </ul>
    </div>
  )
}

export default TopNavList;
