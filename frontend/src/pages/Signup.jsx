/**
 * Signup.jsx
 * Email/password signup.
 */
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import NavBar from '../components/NavBar';

const API_BASE = import.meta.env.MODE === 'development'
  ? 'http://localhost:5000/api'
  : 'https://movie-search-platform.onrender.com/api';

export default function Signup() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      login(data.user, data.token);
      window.location.href = '/profile';
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 480, margin:'0 auto', padding:'1.25rem' }}>
      <NavBar />
      <h2>Sign up</h2>
      {error && <p style={{ color:'crimson' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display:'grid', gap:10 }}>
        <input placeholder="Name"  value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})}/>
        <input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})}/>
        <input type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})}/>
        <button type="submit">Create account</button>
      </form>
    </div>
  );
}
