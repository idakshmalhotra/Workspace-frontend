import React from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton, SignOutButton } from '@clerk/clerk-react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/dashboard" className="brand" aria-label="Go to dashboard">
          <div className="brand-icon">⚡</div>
          <span className="brand-text">WorkSpace</span>
        </Link>
        
        <nav className="navigation">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/dashboard/analytics" className="nav-link">Analytics</Link>
          <Link to="/dashboard/schedule" className="nav-link">Schedule</Link>
          <Link to="/dashboard/settings" className="nav-link">Settings</Link>
        </nav>

        <div className="header-actions">
          <button className="notification-btn">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>

          <SignedIn>
            <div className="user-menu" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <UserButton afterSignOutUrl="/" />
              <SignOutButton>
                <button className="nav-link" style={{ padding: '6px 10px' }}>Sign out</button>
              </SignOutButton>
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <button className="nav-link" style={{ padding: '6px 10px' }}>Sign in</button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
