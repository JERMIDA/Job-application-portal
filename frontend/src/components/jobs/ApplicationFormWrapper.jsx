import RestrictedApplicationPage from './RestrictedApplicationPage';
import useAuth from '../../hooks/useAuth';
import ApplicationForm from './ApplicationForm';

const ApplicationFormWrapper = ({ job }) => {
  const { auth } = useAuth();

  if (auth?.role === 'admin' || auth?.role === 'super-admin') {
    return <RestrictedApplicationPage />;
  }

  return <ApplicationForm job={job} />;
};

export default ApplicationFormWrapper;