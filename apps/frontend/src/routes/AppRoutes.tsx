import { Routes, Route } from 'react-router-dom';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>Dashboard</div>} />
      <Route path="/auth" element={<div>Auth</div>} />
      <Route path="/editor/:id" element={<div>Editor</div>} />
      <Route path="/settings" element={<div>Settings</div>} />
    </Routes>
  );
}
