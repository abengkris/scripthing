import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin, useRegister } from '../hooks/useAuth';
export function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const login = useLogin();
    const register = useRegister();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (isLogin) {
                await login.mutateAsync({ email, password });
            }
            else {
                await register.mutateAsync({ name, email, password });
            }
            navigate('/');
        }
        catch (err) {
            setError(isLogin ? 'Invalid email or password' : (err.response?.data?.message || 'Registration failed'));
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-900 text-white", children: _jsxs("form", { onSubmit: handleSubmit, className: "bg-gray-800 p-8 rounded shadow-md w-96", children: [_jsx("h2", { className: "text-2xl mb-4", children: isLogin ? 'Sign In' : 'Create Account' }), !isLogin && (_jsx("input", { type: "text", placeholder: "Name", value: name, onChange: e => setName(e.target.value), className: "w-full p-2 mb-4 bg-gray-700 rounded" })), _jsx("input", { type: "email", placeholder: "Email", value: email, onChange: e => setEmail(e.target.value), className: "w-full p-2 mb-4 bg-gray-700 rounded", required: true }), _jsx("input", { type: "password", placeholder: "Password", value: password, onChange: e => setPassword(e.target.value), className: "w-full p-2 mb-4 bg-gray-700 rounded", required: true, minLength: 8 }), error && _jsx("p", { className: "text-red-500 mb-4", children: error }), _jsx("button", { type: "submit", className: "w-full bg-blue-600 p-2 rounded", disabled: login.isPending || register.isPending, children: login.isPending || register.isPending ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account') }), _jsx("p", { className: "mt-4 text-center cursor-pointer text-blue-400", onClick: () => setIsLogin(!isLogin), children: isLogin ? "Don't have an account? Register" : "Already have an account? Sign in" })] }) }));
}
