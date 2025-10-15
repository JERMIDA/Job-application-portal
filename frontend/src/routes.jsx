import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashBoardPage'
import ProtectedRoute from './components/ProtectedRoute'
import ApplicationForm from './components/jobs/ApplicationForm' // Import the ApplicationForm component
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SuperAdminSettings from './pages/SuperAdminSettings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password/:token', element: <ResetPassword /> },
      {
        path: 'dashboard',
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'jobs/:id/apply', element: <ApplicationForm /> } // Add the new route here
          // Admin routes can be added here
        ]
      },
      { path: '/super-admin/settings', element: <SuperAdminSettings /> } // Super Admin settings route
    ]
  }
])