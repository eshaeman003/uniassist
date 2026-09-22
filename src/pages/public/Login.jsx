import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, LogIn, Sparkles } from 'lucide-react';
import Field from '../../components/Field';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import * as authService from '../../services/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState('');

  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Enter your email and password to continue.');
      return;
    }
    setLoading(true);
    const res = await authService.login({ email, password });
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    await refreshUser();
    const current = await authService.getCurrentUser();
    showToast(`Welcome back, ${current?.name?.split(' ')[0] || 'there'}.`);
    navigate(current?.role === 'admin' ? '/admin' : '/app');
  };

  const handleDemo = async (which) => {
    setDemoLoading(which);
    const res = which === 'student' ? await authService.loginAsDemoStudent() : await authService.loginAsDemoAdmin();
    setDemoLoading('');
    if (!res.ok) {
      setError(res.error);
      return;
    }
    await refreshUser();
    const current = await authService.getCurrentUser();
    showToast(`Continuing as ${current?.name}.`);
    navigate(current?.role === 'admin' ? '/admin' : '/app');
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-head" style={{ textAlign: 'center' }}>
          <div className="brand" style={{ justifyContent: 'center', marginBottom: 16 }}>
            <span className="brand-mark"><GraduationCap size={18} /></span>
            UniAssist
          </div>
          <h1>Welcome back</h1>
          <p>Log in to your campus account.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Field label="Email" htmlFor="login-email">
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Password" htmlFor="login-password">
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          {error && <span className="field-error">{error}</span>}

          <Button type="submit" variant="primary" block loading={loading} icon={LogIn}>
            Log in
          </Button>
        </form>

        <div className="auth-divider">or try the prototype</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button variant="secondary" block icon={Sparkles} loading={demoLoading === 'student'} onClick={() => handleDemo('student')}>
            Continue as Demo Student
          </Button>
          <Button variant="secondary" block icon={Sparkles} loading={demoLoading === 'admin'} onClick={() => handleDemo('admin')}>
            Continue as Demo Admin
          </Button>
        </div>

        <p className="auth-footer-note">
          New to UniAssist? <Link to="/register/student">Create a student account</Link> or{' '}
          <Link to="/register/university">register your university</Link>.
        </p>
      </div>
    </div>
  );
}