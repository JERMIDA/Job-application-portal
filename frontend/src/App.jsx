import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import DashboardPage from './pages/DashBoardPage';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import RulesPage from './pages/RulesPage';
import ReportsPage from './pages/ReportsPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navigation from './components/common/Navigation';
import Footer from './components/common/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApplicationFormWrapper from './components/jobs/ApplicationFormWrapper';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import InternClassification from './components/dashboard/InternClassification';
import JobApplicationRoute from "./routes/JobApplicationRoute";

function AppContent() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow px-4 sm:px-6 lg:px-8 pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/profile/edit" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/rules" element={
              <ProtectedRoute adminOnly={true}>
                <RulesPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute adminOnly={true}>
                <ReportsPage />
              </ProtectedRoute>
            } />
            <Route path="/superadmin" element={
              <ProtectedRoute adminOnly={true}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/jobs/:id/apply" element={<JobApplicationRoute />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/admin/intern-classification" element={<InternClassification />} />
            <Route path="*" element={<div className="text-center py-8">Page not found</div>} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;