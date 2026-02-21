import React, { useState } from 'react';
import axios from 'axios';
function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid PDF file');
      setFile(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('No file selected');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name.replace('.pdf', ''));

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/upload',
        formData,
        { 
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          } 
        }
      );
      
      setSuccess('Flashcards generated successfully!');
      setFile(null);
      
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <h2>📤 Upload Your Study Notes</h2>
      <p>Upload a PDF file (max 32 pages) to auto-generate flashcards</p>
      
      <form onSubmit={handleUpload} className="upload-form">
        <div className="file-input-wrapper">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="file-input"
            id="pdf-input"
            disabled={loading}
          />
          <label htmlFor="pdf-input" className="file-label">
            📁 Choose PDF File
          </label>
        </div>

        {file && <p className="file-name">✓ Selected: {file.name}</p>}

        <button 
          type="submit" 
          disabled={!file || loading}
          className="upload-btn"
        >
          {loading ? '⏳ Uploading...' : '🚀 Generate Flashcards'}
        </button>
      </form>

      {error && <div className="error-message">❌ {error}</div>}
      {success && <div className="success-message">✅ {success}</div>}
    </div>
  );
}
export default FileUpload;