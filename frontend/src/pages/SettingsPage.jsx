import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuth, getUser } from '../utils/auth';
import { disconnectSocket } from '../utils/socket';

const settingsMenu = [
  'My Account',
  'Privacy & Safety',
  'Notifications',
  'Appearance',
  'Accessibility',
  'Language',
  'Connections',
];

const appMenu = ['Voice & Video', 'Text & Images', 'Advanced'];

const SettingsPage = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    disconnectSocket();
    clearAuth();
    navigate('/');
  };

  const alias = user?.alias || 'CoolPhoenix336';
  const email = user?.email || 'coolphoenix336@gmail.com';

  return (
    <main className="settings-mock-page">
      <section className="settings-shell">
        <aside className="settings-sidebar">
          <p>User Settings</p>
          {settingsMenu.map(item => (
            <button key={item} className={item === 'My Account' ? 'active' : ''}>{item}</button>
          ))}
          <hr />
          <p>App Settings</p>
          {appMenu.map(item => <button key={item}>{item}</button>)}
          <button onClick={handleLogout}>Log Out</button>
        </aside>

        <section className="account-panel">
          <h1>My Account</h1>
          <div className="account-card">
            <div className="profile-strip">
              <span className="avatar blue">{alias.charAt(0)}</span>
              <div>
                <strong>{alias}</strong>
                <small>Online</small>
              </div>
              <button>Edit Profile</button>
            </div>
            <div className="account-row">
              <div><span>Username</span><strong>{alias}</strong></div>
              <button>Edit</button>
            </div>
            <div className="account-row">
              <div><span>Email</span><strong>{email}</strong></div>
              <button>Edit</button>
            </div>
            <div className="account-row">
              <div><span>Anonymous Alias</span><strong>{alias}</strong></div>
              <button>Edit</button>
            </div>
            <div className="account-row">
              <div><span>About Me</span><strong>I love automobiles and make food people remember</strong></div>
              <button>Edit</button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default SettingsPage;
