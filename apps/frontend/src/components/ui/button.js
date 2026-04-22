import { jsx as _jsx } from "react/jsx-runtime";
export const Button = ({ children, ...props }) => (_jsx("button", { ...props, className: `px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 ${props.className || ''}`, children: children }));
