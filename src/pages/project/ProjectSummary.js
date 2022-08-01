import { useNavigate } from 'react-router-dom';

// custom hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';

// components
import Avatar from '../../component/Avatar';

export default function ProjectSummary({ project, id }) {
  const { deleteDocument } = useFirestore('projects');
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleClick = () => {
    deleteDocument(id);
    navigate('/');
  };

  return (
    <div>
      <div className='project-summary'>
        <h2 className='page-title'>{project.name}</h2>
        <p className='due-date'>
          Project due by {project.dueDate.toDate().toDateString()}
        </p>
        <p className='details'>{project.details}</p>
        <h4>Project assigned to:</h4>
        <div className='assigned-users'>
          {project.assignedUsersList.map((user) => (
            <div key={user.id}>
              <Avatar src={user.photoURL} />
            </div>
          ))}
        </div>
      </div>
      {user.uid === project.createdBy.id && (
        <button className='btn' onClick={handleClick}>
          Mark as Complete
        </button>
      )}
    </div>
  );
}
