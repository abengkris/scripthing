import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin, useRegister } from '../hooks/useAuth';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = useLogin();
  const register = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await login.mutateAsync({ email, password });
      } else {
        await register.mutateAsync({ name, email, password });
      }
      navigate('/');
    } catch (err: any) {
      setError(isLogin ? 'Invalid email or password' : (err.response?.data?.message || 'Registration failed'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">{isLogin ? 'Sign In' : 'Create Account'}</h2>
        {!isLogin && (
          <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 mb-4 bg-gray-700 rounded" />
        )}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 mb-4 bg-gray-700 rounded" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 mb-4 bg-gray-700 rounded" required minLength={8} />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 p-2 rounded" disabled={login.isPending || register.isPending}>
          {login.isPending || register.isPending ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
        </button>
        <p className="mt-4 text-center cursor-pointer text-blue-400" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Sign in"}
        </p>
      </form>
    </div>
  );
}
