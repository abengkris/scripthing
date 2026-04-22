import { Routes, Route } from "react-router-dom";
import { AuthPage } from "./auth";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import EditorPage from "./editor.$id";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div>Dashboard</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/editor/:id"
        element={
          <ProtectedRoute>
            <EditorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <div>Settings</div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
