import React from 'react';
import R from 'ramda'

const ProjectList = ({ projects }) => {
  const projArray = R.toPairs(projects);
  const projToRender = projArray.map((proj, idx) => {
    return (
      <div key={proj[1].uuid}>
        <li className="list-group-item active-projects">
          <div className="media-body project">
            <div className="col-xs-2">
            </div>
            <div className="col-xs-10">
              <strong>{proj[1].name}</strong>
            </div>
          </div>
        </li>
      </div>
    )
  })

  return (
    <div>
      <ul className=" list-group container-list container-links projects">
        { projToRender }
      </ul>
    </div>
  )
}

export default ProjectList;
