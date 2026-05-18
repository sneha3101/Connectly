import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const textVariant = {
  hidden: {
    y: 48,
    opacity: 0,
    rotate: 3,
  },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const LandingPage = () => {
  return (
    <main className="showcase-page">
      <section className="landing-frame">
        <nav className="marketing-nav">
          <Link to="/" className="brand-lockup">
            <span className="brand-mark" aria-hidden="true"></span>
            <span>Connectly</span>
          </Link>
          <div className="marketing-links">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
          </div>
          <Link to="/login" className="nav-login">Login</Link>
        </nav>

        <div className="hero-stage" id="home">
          <div className="hero-copy">
            <div className="title-wrapper" style={{ overflow: 'hidden', marginBottom: '10px' }}>
              <motion.h1
                custom={0}
                variants={textVariant}
                initial="hidden"
                animate="visible"
                style={{ marginBottom: 0 }}
              >
                Connect Through
              </motion.h1>
            </div>
            
            <div className="title-wrapper" style={{ overflow: 'hidden', marginBottom: '28px' }}>
              <motion.h1
                custom={1}
                variants={textVariant}
                initial="hidden"
                animate="visible"
                style={{ marginBottom: 0 }}
              >
                <span>Meaningful Conversations</span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.16,
                duration: 0.34,
              }}
            >
              Connectly is a modern chat platform designed for communities, teams and friends.
            </motion.p>
            
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.24,
                duration: 0.32,
              }}
            >
              <Link to="/register" className="cta-button">
                Get Started <span aria-hidden="true">→</span>
              </Link>
              <a href="#features" className="muted-button">Learn More</a>
            </motion.div>
            
            <motion.div 
              id="features"
              className="hero-features"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.32 }}
            >
              <div><strong>Smart Matching</strong><span>Meet people who share your interests and conversation style.</span></div>
              <div><strong>Real-Time Chat</strong><span>Send messages, voice notes and replies without missing a beat.</span></div>
              <div><strong>Safe Spaces</strong><span>Built-in moderation keeps communities respectful and welcoming.</span></div>
            </motion.div>
          </div>

          <motion.div 
            className="hero-art" aria-hidden="true"
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.14, duration: 0.36 }}
          >
            <div className="chat-preview">
              <div className="preview-top">
                <span>#</span>
                <strong>general</strong>
                <b>...</b>
              </div>
              <div className="preview-message pink">
                <span className="avatar">L</span>
                <p><strong>Luna</strong> <small>Today at 10:30 AM</small><br />Hey everyone! 👋</p>
              </div>
              <div className="preview-message blue">
                <span className="avatar">N</span>
                <p><strong>Nova</strong> <small>Today at 10:31 AM</small><br />Hi Luna! How's it going?</p>
              </div>
              <div className="preview-message gold">
                <span className="avatar">A</span>
                <p><strong>Ava</strong> <small>Today at 10:32 AM</small><br />Doing great! Working on a new project 🚀</p>
              </div>
              <div className="preview-message blue">
                <span className="avatar">M</span>
                <p><strong>Mason</strong> <small>Today at 10:33 AM</small><br />That's awesome!</p>
              </div>
              <div className="preview-input">Message #general <span>➤</span></div>
            </div>
            <div className="bot-buddy">☻</div>
            <div className="emoji-stack">
              <span>☻</span>
              <span>☻</span>
              <span>☻</span>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
