import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from "react-router-dom";
import { AuthPage } from "./auth";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import EditorPage from "./editor.$id";
export function AppRoutes() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/auth", element: _jsx(AuthPage, {}) }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx("div", { children: "Dashboard" }) }) }), _jsx(Route, { path: "/editor/:id", element: _jsx(ProtectedRoute, { children: _jsx(EditorPage, {}) }) }), _jsx(Route, { path: "/settings", element: _jsx(ProtectedRoute, { children: _jsx("div", { children: "Settings" }) }) })] }));
}
