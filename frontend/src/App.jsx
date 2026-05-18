import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { initSocket } from './utils/socket';
import { isAuthenticated, getUser } from './utils/auth';
import './styles/index.css';

// Pages
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function PageTransition({ children }) {
  return (
    <motion.div
      className="page-transition"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route
          path="/profile-setup"
          element={
            <PageTransition>
              <PrivateRoute>
                <ProfileSetupPage />
              </PrivateRoute>
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PageTransition>
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            </PageTransition>
          }
        />
        <Route
          path="/chat"
          element={
            <PageTransition>
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            </PageTransition>
          }
        />
        <Route
          path="/settings"
          element={
            <PageTransition>
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      initSocket();
      const user = getUser();
      if (user) {
        const socket = initSocket();
        socket.emit('userOnline', user.id);
      }
    }
    setIsReady(true);

    return () => {
      if (isAuthenticated()) {
        const user = getUser();
        if (user) {
          const socket = initSocket();
          socket.emit('userOffline', user.id);
        }
      }
    };
  }, []);

  if (!isReady) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
