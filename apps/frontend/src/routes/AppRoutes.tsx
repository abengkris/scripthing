import { Routes, Route } from 'react-router-dom';
import { AuthPage } from './auth';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

export function AppRoutes() {
  return (
    <Routes>
      <Route path=\"/auth\" element={<AuthPage />} />
      <Route path=\"/\" element={<ProtectedRoute><div>Dashboard</div></ProtectedRoute>} />
      <Route path=\"/editor/:id\" element={<ProtectedRoute><div>Editor</div></ProtectedRoute>} />
      <Route path=\"/settings\" element={<ProtectedRoute><div>Settings</div></ProtectedRoute>} />
    </Routes>
  );
}
