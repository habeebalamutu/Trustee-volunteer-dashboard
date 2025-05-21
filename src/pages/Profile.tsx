// Profile.tsx
// page for displaying and editing user profile information.
import React, { useState, useEffect } from 'react';

// Toast component for modern alerts
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div style={{
      position: 'fixed',
      bottom: 32,
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#2563eb',
      color: '#fff',
      padding: '14px 32px',
      borderRadius: 10,
      fontWeight: 600,
      fontSize: 16,
      boxShadow: '0 4px 24px 0 rgba(37,99,235,0.13)',
      zIndex: 2000,
      animation: 'toastIn 0.3s',
    }}>
      {message}
    </div>
  );
}

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
type FormEvent = React.FormEvent;

const defaultProfile = {
  name: 'John Doe',
  email: 'johndoe@email.com',
  role: 'Volunteer',
  image: '', // base64 or data url
};

export default function Profile({ onBack }: { onBack: () => void }) {
  // State for profile data, edit mode, and image preview
  const [profile, setProfile] = useState(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [toast, setToast] = useState('');

  // On mount, load profile from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      setProfile(JSON.parse(saved));
      setImagePreview(JSON.parse(saved).image || '');
    }
  }, []);

  // Handle text input changes for profile fields
  const handleChange = (e: ChangeEvent) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle image file input and preview
  const handleImageChange = (e: ChangeEvent) => {
    const file = e.target.files?.[0];
    if (file) {
      // Read file as data URL for preview and storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((p) => ({ ...p, image: reader.result as string }));
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile to localStorage and exit edit mode
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Simple email validation
    if (!profile.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      setToast('Please enter a valid email address.');
      return;
    }
    if (!profile.name.trim() || !profile.role.trim()) {
      setToast('Name and Role are required.');
      return;
    }
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setEditing(false);
    setToast('Profile updated successfully!');
  };

  return (
    <div className="profile-page-wrapper" style={{
      maxWidth: 420,
      margin: '40px auto',
      background: '#fff',
      borderRadius: 18,
      boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)',
      padding: '2.5rem 2rem',
      position: 'relative',
      minHeight: 350
    }}>
      <button className="back-btn" onClick={onBack} style={{
        position: 'absolute',
        left: 24,
        top: 18,
        background: 'none',
        border: 'none',
        color: '#555',
        fontSize: 18,
        cursor: 'pointer',
        fontWeight: 500
      }}>&larr; Back</button>
      <h2 style={{
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: 700,
        color: '#2a2a2a',
        letterSpacing: 0.5
      }}>Profile</h2>
      <div className="profile-content" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24
      }}>
        <div className="profile-avatar" style={{
          overflow: 'hidden',
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: '#f3f3f3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)',
          marginBottom: 8
        }}>
          {imagePreview ? (
            <img src={imagePreview} alt="Profile" style={{width: 90, height: 90, borderRadius: '50%', objectFit: 'cover'}} />
          ) : (
            <span style={{fontSize: '3rem', color: '#bbb'}}>👤</span>
          )}
        </div>
        <div className="profile-details" style={{width: '100%'}}>
          {editing ? (
            <form onSubmit={handleSubmit} className="profile-edit-form" style={{display: 'flex', flexDirection: 'column', gap: 16}}>
              <input name="name" value={profile.name} onChange={handleChange} placeholder="Name" required style={{
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                fontSize: 16,
                marginBottom: 4
              }} />
              <input name="email" value={profile.email} onChange={handleChange} placeholder="Email" type="email" required style={{
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                fontSize: 16,
                marginBottom: 4
              }} />
              <input name="role" value={profile.role} onChange={handleChange} placeholder="Role" required style={{
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                fontSize: 16,
                marginBottom: 4
              }} />
              <input type="file" accept="image/*" onChange={handleImageChange} style={{
                margin: '8px 0',
                fontSize: 15
              }} />
              <button type="submit" style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 0',
                fontWeight: 600,
                fontSize: 16,
                marginTop: 8,
                cursor: 'pointer',
                boxShadow: '0 2px 8px 0 rgba(37,99,235,0.08)'
              }}>Save</button>
            </form>
          ) : (
            <div style={{textAlign: 'center'}}>
              <p style={{fontSize: 18, margin: '8px 0'}}><strong>Name:</strong> {profile.name}</p>
              <p style={{fontSize: 16, margin: '8px 0'}}><strong>Email:</strong> {profile.email}</p>
              <p style={{fontSize: 16, margin: '8px 0 18px 0'}}><strong>Role:</strong> {profile.role}</p>
              <button className="edit-btn" onClick={() => setEditing(true)} style={{
                background: '#f3f4f6',
                color: '#2563eb',
                border: 'none',
                borderRadius: 8,
                padding: '10px 24px',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: '0 2px 8px 0 rgba(37,99,235,0.06)'
              }}>Edit</button>
            </div>
          )}
        </div>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}
