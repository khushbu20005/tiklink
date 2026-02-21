import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalFlashcards: 0,
    totalStudyTime: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
    fetchUserStats();
  }, []);

  const fetchUserProfile = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setEditData({
          name: userData.name,
          email: userData.email,
        });
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/user/stats',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      // Use default stats if fetch fails
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user.name,
      email: user.email,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
        await axios.put(
        'http://localhost:5000/api/user/profile',
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update user data
      const updatedUser = { ...user, ...editData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure? This action cannot be undone!')) {
      if (window.confirm('This will permanently delete your account and all data. Are you absolutely sure?')) {
        // Call delete API
        console.log('Account deletion requested');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="error-container">Failed to load profile</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">👤</div>
          <h1>{user.name}</h1>
          <p className="user-email">{user.email}</p>
          {user.joinedAt && (
            <p className="joined-date">
              Member since {new Date(user.joinedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Edit Section */}
        {isEditing ? (
          <div className="edit-section">
            <h2>Edit Profile</h2>
            <div className="edit-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="edit-actions">
                <button onClick={handleSave} className="save-btn">
                  💾 Save Changes
                </button>
                <button onClick={handleCancel} className="cancel-btn">
                  ✕ Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Statistics Section */}
        <div className="stats-section">
          <h2>📊 Your Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <h3>Notes Uploaded</h3>
                <p className="stat-value">{stats.totalNotes || 0}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔖</div>
              <div className="stat-info">
                <h3>Flashcards Created</h3>
                <p className="stat-value">{stats.totalFlashcards || 0}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-info">
                <h3>Study Time</h3>
                <p className="stat-value">{stats.totalStudyTime || '0h'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="preferences-section">
          <h2>⚙️ Preferences</h2>
          <div className="preference-item">
            <div className="preference-info">
              <h3>Notifications</h3>
              <p>Get reminded about your study sessions</p>
            </div>
            <input type="checkbox" defaultChecked />
          </div>

          <div className="preference-item">
            <div className="preference-info">
              <h3>Dark Mode</h3>
              <p>Use dark theme for better readability</p>
            </div>
            <input type="checkbox" />
          </div>

          <div className="preference-item">
            <div className="preference-info">
              <h3>Email Updates</h3>
              <p>Receive updates about new features</p>
            </div>
            <input type="checkbox" defaultChecked />
          </div>
        </div>

        {/* Account Actions */}
        <div className="account-actions">
          <h2>Account</h2>
          
          {!isEditing && (
            <button onClick={handleEdit} className="edit-btn">
              ✏️ Edit Profile
            </button>
          )}

          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>

          <button onClick={handleDeleteAccount} className="delete-btn">
            🗑️ Delete Account
          </button>
        </div>

        {/* About Section */}
        <div className="about-section">
          <h2>About TikLink</h2>
          <p>
            TikLink helps you convert study notes into interactive flashcards 
            and mind maps using AI. Learn smarter, not harder!
          </p>
          <div className="links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#support">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
