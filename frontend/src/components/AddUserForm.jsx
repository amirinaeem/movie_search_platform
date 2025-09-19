import React, { useState } from 'react';

export default function AddUserForm({ onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localMsg, setLocalMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitting(true);
    setLocalMsg('');
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to add user');
      }
      setName('');
      setEmail('');
      if (onSuccess) onSuccess(); // reload + banner handled in App
    } catch (err) {
      setLocalMsg(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Add User</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem' }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          style={{ padding: '0.6rem', border: '1px solid #ccc', borderRadius: 6 }}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ padding: '0.6rem', border: '1px solid #ccc', borderRadius: 6 }}
        />
        <button
          type="submit"
          disabled={submitting}
          style={{ padding: '0.6rem 1rem', background: '#111827', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          {submitting ? 'Submitting…' : 'Add User'}
        </button>
      </form>
      {localMsg && <p style={{ marginTop: '0.5rem', color: 'crimson' }}>{localMsg}</p>}
    </div>
  );
}
