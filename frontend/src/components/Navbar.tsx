import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>
        SimplePG
      </div>
      <div className="flex items-center gap-4">
        <span style={{ color: 'var(--text-muted)' }}>Hai, {user.name}</span>
        <Button variant="outline" onClick={handleLogout} style={{ padding: '0.4rem 1rem' }}>
          Logout
        </Button>
      </div>
    </nav>
  );
};
