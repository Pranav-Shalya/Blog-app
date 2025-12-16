import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';
import API from '../api';

function LoginPage() {
  const [form, setForm] = useState({ emailOrUsername: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleLogin = async () => {
    try {
      setError('');
      const res = await API.post('/auth/login', form);
    //   localStorage.setItem('token', res.data.token);
    //   localStorage.setItem('userId', res.data.user.id);
      login(res.data.token, res.data.user.id); 
      showToast('success', 'Logged in successfully');
      navigate('/');
    } catch (err) {
        const msg=err.response?.data?.message || 'Login failed';
        setError(msg);
        showToast('error', msg);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        name="emailOrUsername"
        placeholder="Email or username"
        value={form.emailOrUsername}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;
