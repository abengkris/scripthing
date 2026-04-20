import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
export function AppRoutes() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx("div", { children: "Dashboard" }) }), _jsx(Route, { path: "/auth", element: _jsx("div", { children: "Auth" }) }), _jsx(Route, { path: "/editor/:id", element: _jsx("div", { children: "Editor" }) }), _jsx(Route, { path: "/settings", element: _jsx("div", { children: "Settings" }) })] }));
}
