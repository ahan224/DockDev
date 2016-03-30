import React from 'react';
import R from 'ramda';
import Container from './Container';

const ProjectDetail = ({ projects, params }) => {

  const proj = projects[params.uuid];
  const containers = R.toPairs(proj.containers)
    .map(container => <Container key={container[0]} details={container}>
                      </Container>
           );
  return (
      <div className="project-wrapper">
        <div className="col-xs-4 proj-detail-title" style={{'padding':'0px',}}>
          <h5 className="text-capitalize">
            {proj.projectName}
          </h5>
        </div>
          <div className="row">
            <div className="col-xs-12" id="servers">
              <h5>Servers</h5>
              <div className="divider"></div>
            </div>
            {containers}
          </div>
          <div className="row" >
            <div className="col-xs-12" id="databases">
              <h5>Databases</h5>
              <div className="divider"></div>
              {containers}
            </div>
          </div>
      </div>
  );
};

ProjectDetail.propTypes = {
  projects: React.PropTypes.object,
  params: React.PropTypes.object
};

export default ProjectDetail;
