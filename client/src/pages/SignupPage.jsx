import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useToast } from '../ToastContext';
import API from '../api';

function SignupPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
   const { login } = useAuth();
   const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      setError('');
      const res = await API.post('/auth/signup', form);
    //   localStorage.setItem('token', res.data.token);
    //   localStorage.setItem('userId', res.data.user.id); // add this
      login(res.data.token, res.data.user.id);
      showToast('success', 'Signed up successfully');
      navigate('/');
    } catch (err) {
        const msg=err.response?.data?.message || 'Signup failed';
      setError(msg);
      showToast('error', msg);
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}

export default SignupPage;
