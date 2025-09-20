/**
 * NavBar.jsx
 * Top nav with auth shortcuts.
 */
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.75rem 0'}}>
      <Link to="/" style={{textDecoration:'none',fontWeight:700}}>🎬 Movie Search</Link>
      <div style={{display:'flex',gap:12}}>
        {!user ? (
          <>
            <Link to="/signin">Sign in</Link>
            <Link to="/signup">Sign up</Link>
          </>
        ) : (
          <>
            <Link to="/profile">{user.name}</Link>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
