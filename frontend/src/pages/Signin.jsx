/**
 * Signin.jsx
 * Email/password signin.
 */
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import NavBar from '../components/NavBar';

const API_BASE = import.meta.env.MODE === 'development'
  ? 'http://localhost:5000/api'
  : 'https://movie-search-platform.onrender.com/api';

export default function Signin() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/auth/signin`, {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signin failed');
      login(data.user, data.token);
      window.location.href = '/profile';
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 480, margin:'0 auto', padding:'1.25rem' }}>
      <NavBar />
      <h2>Sign in</h2>
      {error && <p style={{ color:'crimson' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display:'grid', gap:10 }}>
        <input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})}/>
        <input type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})}/>
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}
