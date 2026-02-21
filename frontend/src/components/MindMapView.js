import React, { useEffect } from 'react';
import mermaid from 'mermaid';
import './MindMapView.css';

function MindMapView({ flashcards, topicName = 'Study Topic' }) {
  useEffect(() => {
    if (flashcards && flashcards.length > 0) {
      mermaid.initialize({ startOnLoad: true, theme: 'default' });
      mermaid.contentLoaded();
    }
  }, [flashcards]);

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="no-mindmap">
        <p>🗺️ Generate flashcards first to create a mind map</p>
      </div>
    );
  }

  // Create mind map from flashcards
  const generateMermaidDiagram = () => {
    let diagram = `graph TD\n    A["${topicName}"]\n`;

    flashcards.slice(0, 10).forEach((card, idx) => {
      const nodeId = String.fromCharCode(66 + idx);
      const question = card.question.substring(0, 25);
      diagram += `    A --> ${nodeId}["${question}..."]\n`;
    });

    return diagram;
  };

  return (
    <div className="mindmap-container">
      <h2>🧠 Mind Map Visualization</h2>
      <p>Visual structure of your study topic</p>
      
      <div className="mermaid mindmap-diagram">
        {generateMermaidDiagram()}
      </div>

      <div className="mindmap-info">
        <p>📊 Topics Covered: {flashcards.length}</p>
      </div>
    </div>
  );
}