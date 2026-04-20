import { useState } from 'react';
import { useRegister, useLogin } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const register = useRegister();
  const login = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login.mutateAsync({ email, password });
      } else {
        await register.mutateAsync({ name, email, password });
      }
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className=\"flex min-h-screen items-center justify-center bg-gray-50\">
      <form onSubmit={handleSubmit} className=\"w-full max-w-sm rounded bg-white p-8 shadow\">
        <h2 className=\"mb-6 text-2xl\">{isLogin ? 'Sign In' : 'Create Account'}</h2>
        {!isLogin && <input className=\"mb-4 w-full border p-2\" placeholder=\"Name\" value={name} onChange={e => setName(e.target.value)} />}
        <input className=\"mb-4 w-full border p-2\" type=\"email\" placeholder=\"Email\" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className=\"mb-4 w-full border p-2\" type=\"password\" placeholder=\"Password\" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type=\"submit\" className=\"w-full rounded bg-blue-600 p-2 text-white\" disabled={login.isPending || register.isPending}>
          {login.isPending || register.isPending ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
        </button>
        <button type=\"button\" className=\"mt-4 w-full text-blue-600\" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? \"Don't have an account? Register\" : 'Already have an account? Sign in'}
        </button>
      </form>
    </div>
  );
}
