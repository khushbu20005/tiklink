import React, { useState } from 'react';
import './FlashcardViewer.css';

function FlashcardViewer({ flashcards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="no-flashcards">
        <p>📭 No flashcards yet. Upload a PDF first!</p>
      </div>
    );
  }

  const current = flashcards[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  return (
    <div className="flashcard-viewer">
      <h2>📇 Study with Flashcards</h2>
      
      <div className="card-counter">
        Card {currentIndex + 1} of {flashcards.length}
      </div>

      <div 
        className={`flashcard ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <p className="card-label">❓ Question</p>
            <p className="card-text">{current.question}</p>
          </div>
          <div className="flashcard-back">
            <p className="card-label">✓ Answer</p>
            <p className="card-text">{current.answer}</p>
          </div>
        </div>
      </div>

      <p className="flip-hint">👆 Click card to flip</p>

      <div className="navigation-buttons">
        <button onClick={handlePrev} className="nav-btn">← Previous</button>
        <button onClick={handleNext} className="nav-btn">Next →</button>
      </div>

      <div className="card-stats">
        <span>📄 Page: {current.page || 'N/A'}</span>
      </div>
    </div>
  );
}