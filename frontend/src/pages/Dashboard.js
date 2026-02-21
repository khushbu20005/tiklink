import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from '../components/FileUpload';
import FlashcardViewer from '../components/FlashcardViewer';
import MindMapView from '../components/MindMapView';
import './Dashboard.css';

function Dashboard() {
  const [currentFlashcards, setCurrentFlashcards] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [activeTab, setActiveTab] = useState('upload'); // upload, flashcards, mindmap
  const [notes, setNotes] = useState([]);
  
  useEffect(() => {
    fetchUserNotes();
  }, []);

  const fetchUserNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/notes',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes(response.data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  };

  const handleUploadSuccess = (data) => {
    setCurrentFlashcards(data.flashcards || []);
    setCurrentNote(data);
    setActiveTab('flashcards');
    fetchUserNotes(); // Refresh notes list
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `http://localhost:5000/api/notes/${noteId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchUserNotes();
        if (currentNote && currentNote._id === noteId) {
          setCurrentNote(null);
          setCurrentFlashcards([]);
          setActiveTab('upload');
        }
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  const handleSelectNote = (note) => {
    setCurrentNote(note);
    setCurrentFlashcards(note.flashcards || []);
    setActiveTab('flashcards');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-layout">
        {/* Sidebar with Notes List */}
        <aside className="dashboard-sidebar">
          <h3>📚 Your Notes</h3>
          
          <div className="notes-list">
            {notes.length === 0 ? (
              <p className="no-notes">No notes yet. Upload your first PDF!</p>
            ) : (
              notes.map((note) => (
                <div 
                  key={note._id} 
                  className={`note-item ${currentNote?._id === note._id ? 'active' : ''}`}
                >
                  <div 
                    className="note-info"
                    onClick={() => handleSelectNote(note)}
                  >
                    <p className="note-title">{note.title}</p>
                    <p className="note-meta">
                      📄 {note.pages} pages • 🔖 {note.flashcards?.length || 0} cards
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDeleteNote(note._id)}
                    className="delete-btn"
                    title="Delete note"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1>📚 Your Study Space</h1>
            <p>Create, study, and track your learning</p>
          </div>

          {/* Tabs */}
          <div className="dashboard-tabs">
            <button 
              className={activeTab === 'upload' ? 'tab-btn active' : 'tab-btn'}
              onClick={() => setActiveTab('upload')}
            >
              📤 Upload PDF
            </button>
            <button 
              className={activeTab === 'flashcards' ? 'tab-btn active' : 'tab-btn'}
              onClick={() => setActiveTab('flashcards')}
              disabled={!currentFlashcards.length}
            >
              📇 Study Cards
            </button>
            <button 
              className={activeTab === 'mindmap' ? 'tab-btn active' : 'tab-btn'}
              onClick={() => setActiveTab('mindmap')}
              disabled={!currentFlashcards.length}
            >
              🧠 Mind Map
            </button>
          </div>

          {/* Tab Content */}
          <div className="dashboard-content">
            {activeTab === 'upload' && (
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            )}
            
            {activeTab === 'flashcards' && currentFlashcards.length > 0 && (
              <div className="flashcards-section">
                <div className="section-info">
                  <h2>📇 Study Flashcards</h2>
                  {currentNote && (
                    <p>From: <strong>{currentNote.title}</strong></p>
                  )}
                </div>
                <FlashcardViewer flashcards={currentFlashcards} />
              </div>
            )}
            
            {activeTab === 'mindmap' && currentFlashcards.length > 0 && (
              <div className="mindmap-section">
                <div className="section-info">
                  <h2>🧠 Mind Map</h2>
                  {currentNote && (
                    <p>Topic: <strong>{currentNote.title}</strong></p>
                  )}
                </div>
                <MindMapView 
                  flashcards={currentFlashcards}
                  topicName={currentNote?.title}
                />
              </div>
            )}

            {/* Empty state messages */}
            {activeTab === 'flashcards' && !currentFlashcards.length && (
              <div className="empty-state">
                <p>📭 No flashcards to display.</p>
                <p>Upload a PDF or select a note from the list.</p>
              </div>
            )}

            {activeTab === 'mindmap' && !currentFlashcards.length && (
              <div className="empty-state">
                <p>🗺️ No mind map available yet.</p>
                <p>Upload a PDF or select a note to create a mind map.</p>
              </div>
            )}
          </div>

          {/* Statistics */}
          {currentNote && (
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-icon">📄</div>
                <div className="stat-content">
                  <h4>Pages</h4>
                  <p>{currentNote.pages}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔖</div>
                <div className="stat-content">
                  <h4>Flashcards</h4>
                  <p>{currentFlashcards.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-content">
                  <h4>Created</h4>
                  <p>{new Date(currentNote.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
