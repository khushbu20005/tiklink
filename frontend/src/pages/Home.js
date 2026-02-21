import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>🎯 TikLink</h1>
        <p className="tagline">Convert Your Study Notes into Flashcards & Mind Maps</p>
        <p className="subtitle">Learn smarter with AI-powered study tools</p>
        
        <div className="hero-buttons">
          <Link to="/signup" className="btn btn-primary">Get Started Free</Link>
          <Link to="/login" className="btn btn-secondary">Already have account?</Link>
        </div>
      </section>

      <section className="features">
        <h2>✨ Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📤</div>
            <h3>Upload PDFs</h3>
            <p>Upload any PDF study notes easily</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Flashcards</h3>
            <p>Auto-generate flashcards from notes</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Mind Maps</h3>
            <p>Create visual mind maps instantly</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>Monitor your learning progress</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>🚀 How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Upload</h3>
            <p>Upload your PDF notes</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Generate</h3>
            <p>AI creates flashcards</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Visualize</h3>
            <p>Create mind maps</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Study</h3>
            <p>Study with flashcards</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;