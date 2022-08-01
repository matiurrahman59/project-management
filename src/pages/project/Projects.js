import React from 'react';
import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';

// components
import ProjectComments from './ProjectComments';
import ProjectSummary from './ProjectSummary';

// styles
import './Project.css';

const Project = () => {
  const { id } = useParams();
  const { document, error } = useDocument('projects', id);

  if (error) {
    return <div className='error'>{error}</div>;
  }

  if (!document) {
    return <div className='loading'>Loading...</div>;
  }

  return (
    <div className='project-details'>
      <ProjectSummary id={id} project={document} />
      <ProjectComments id={id} project={document} />
    </div>
  );
};

export default Project;
