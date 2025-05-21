// App.tsx
// Main application component for the Volunteer Dashboard. Handles routing, state, and UI for listing, searching, filtering, and managing volunteer opportunities.
import { useEffect, useState } from 'react';
import AddOpportunity from './pages/AddOpportunity';
import Profile from './pages/Profile';
import './App.css';

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

// Spinner for loading state
function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
      <div style={{
        border: '4px solid #e3e7fd',
        borderTop: '4px solid #2563eb',
        borderRadius: '50%',
        width: 38,
        height: 38,
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
    </div>
  );
}

interface Opportunity {
  id: number;
  title: string;
  organization: string;
  location: string;
  category: string;
  datePosted: string;
  description: string;
  duration: string;
  skillsRequired: string;
  contactEmail: string;
  owner?: string; // email of the user who created the opportunity
}

function App() {
  // State for all opportunities loaded from JSON
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  // State for selected category filter
  const [selectedCategory, setSelectedCategory] = useState('');
  // State for search input
  const [searchTerm, setSearchTerm] = useState('');
  // State for currently selected opportunity (for modal)
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  // State for dropdown open/close
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  // State for hamburger menu open/close
  const [menuOpen, setMenuOpen] = useState(false);
  // State for showing add opportunity form
  const [showAddForm, setShowAddForm] = useState(false);
  // State for showing profile page
  const [showProfile, setShowProfile] = useState(false);
  // State for toast messages
  const [toast, setToast] = useState('');
  // State for loading spinner
  const [loading, setLoading] = useState(true);
  // State for edit mode
  const [editMode, setEditMode] = useState(false);

  const categories = Array.from(new Set([
    ...opportunities.map(o => o.category),
    'Health',
    'Education',
    'Environment',
    'Technology',
    'Sports',
    'Arts',
    'Community',
    'Animal Welfare',
    'Disaster Relief',
    'Other',
  ]));

  // Filter opportunities by search and category
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === '' || opp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Fetch opportunities from JSON file on mount
  useEffect(() => {
    setLoading(true);
    fetch('/opportunities.json')
      .then((res) => res.json())
      .then((data) => setOpportunities(data))
      .finally(() => setLoading(false));
  }, []);

  // Category color and emoji map
  const categoryStyles: Record<string, { color: string; emoji: string }> = {
    Environment: { color: 'hsl(180, 62%, 55%)', emoji: '🌳' },
    Education: { color: 'hsl(0, 78%, 62%)', emoji: '📚' },
    Health: { color: 'hsl(34, 97%, 64%)', emoji: '🩺' },
    Technology: { color: 'hsl(212, 86%, 64%)', emoji: '💻' },
    Sports: { color: 'hsl(120, 61%, 50%)', emoji: '⚽' },
    Arts: { color: 'hsl(291, 64%, 42%)', emoji: '🎨' },
    Community: { color: 'hsl(25, 98%, 60%)', emoji: '🤝' },
    'Animal Welfare': { color: 'hsl(45, 100%, 51%)', emoji: '🐾' },
    'Disaster Relief': { color: 'hsl(0, 0%, 40%)', emoji: '🚨' },
    Other: { color: 'hsl(234, 12%, 34%)', emoji: '✨' },
  };

  // Delete an opportunity by id
  const handleDelete = (id: number) => {
    setOpportunities(prev => prev.filter(o => o.id !== id));
    setToast('Opportunity deleted!');
  };
  // Edit an opportunity (replace by id)
  const handleEdit = (opp: Opportunity) => {
    setOpportunities(prev => prev.map(o => o.id === opp.id ? opp : o));
    setToast('Opportunity updated!');
  };

  // When adding a new opportunity, tag it with the user's email as owner
  if (showAddForm) {
    return <AddOpportunity onBack={() => setShowAddForm(false)} onAdd={(opp) => {
      const user = JSON.parse(localStorage.getItem('userProfile') || '{}');
      setOpportunities((prev) => [
        { ...opp, id: Date.now(), owner: user.email },
        ...prev,
      ]);
      setShowAddForm(false);
      setToast('Opportunity added!');
    }} />;
  }
  if (showProfile) {
    return <Profile onBack={() => setShowProfile(false)} />;
  }

  // Only allow delete/edit if the current user is the owner
  const user = JSON.parse(localStorage.getItem('userProfile') || '{}');

  return (
    <div className="app">
      {/* Hamburger Menu: toggles side navigation */}
      <div
        className={`hamburger-menu${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setMenuOpen(open => !open); }}
        style={{ position: 'absolute', top: 24, left: 24 }}
      >
        {!menuOpen ? (
          // Hamburger icon (open)
          <>
            <div className={`bar`}></div>
            <div className={`bar`}></div>
            <div className={`bar`}></div>
          </>
        ) : (
          // Close (X) icon styled for visibility
          <span style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            fontSize: 32,
            color: '#3949ab',
            fontWeight: 700,
            lineHeight: 1
          }}>&#10005;</span>
        )}
      </div>
      {/* Side navigation menu */}
      <nav className={`side-menu${menuOpen ? ' open' : ''}`}
        aria-label="Main menu"
        style={{ pointerEvents: menuOpen ? 'auto' : 'none' }}
      >
        <ul onClick={e => e.stopPropagation()}>
          <li
            onClick={() => { setMenuOpen(false); setShowAddForm(false); setShowProfile(false); }}
            style={{
              background: !showAddForm && !showProfile ? '#f0f4ff' : undefined,
              color: !showAddForm && !showProfile ? '#1a237e' : undefined,
              fontWeight: !showAddForm && !showProfile ? 700 : 500,
              borderRadius: 8,
              transition: 'background 0.18s, color 0.18s',
            }}
            aria-current={!showAddForm && !showProfile ? 'page' : undefined}
          >
            Search Opportunities
          </li>
          <li
            onClick={() => { setMenuOpen(false); setShowAddForm(true); setShowProfile(false); }}
            style={{
              background: showAddForm ? '#f0f4ff' : undefined,
              color: showAddForm ? '#1a237e' : undefined,
              fontWeight: showAddForm ? 700 : 500,
              borderRadius: 8,
              transition: 'background 0.18s, color 0.18s',
            }}
            aria-current={showAddForm ? 'page' : undefined}
          >
            Add New Opportunity
          </li>
          <li
            onClick={() => { setMenuOpen(false); setShowProfile(true); setShowAddForm(false); }}
            style={{
              background: showProfile ? '#f0f4ff' : undefined,
              color: showProfile ? '#1a237e' : undefined,
              fontWeight: showProfile ? 700 : 500,
              borderRadius: 8,
              transition: 'background 0.18s, color 0.18s',
            }}
            aria-current={showProfile ? 'page' : undefined}
          >
            Profile
          </li>
        </ul>
      </nav>
      {menuOpen && <div className="side-menu-backdrop" onClick={() => setMenuOpen(false)}></div>}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
      <h1>Volunteer Opportunities</h1>
      {/* Filter bar for search and category dropdown */}
      <div className="filter-bar">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by title, organization, or location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className={`dropdown-container${filterDropdownOpen ? ' open' : ''}`}
          tabIndex={0}
          onBlur={() => setFilterDropdownOpen(false)}
        >
          <div
            className="dropdown-selected"
            onClick={() => setFilterDropdownOpen((open) => !open)}
          >
            {selectedCategory || 'All Categories'}
            <span className={`dropdown-arrow${filterDropdownOpen ? ' up' : ''}`}></span>
          </div>
          {filterDropdownOpen && (
            <div className="dropdown-list animate-dropdown">
              <div
                className="dropdown-item"
                onClick={() => {
                  setSelectedCategory('');
                  setFilterDropdownOpen(false);
                }}
              >
                All Categories
              </div>
              {categories.map((cat) => (
                <div
                  key={cat}
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setFilterDropdownOpen(false);
                  }}
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* List of opportunity cards */}
      {loading ? (
        <Spinner />
      ) : (
        <div className="opportunity-list features">
          {filteredOpportunities.length === 0 && (
            <div className="no-results">No jobs available.</div>
          )}
          {filteredOpportunities.map((opp) => {
            const style = categoryStyles[opp.category] || categoryStyles.Other;
            const isOwner = opp.owner && user.email && opp.owner === user.email;
            return (
              <div
                key={opp.id}
                className="feature-card"
                style={{ borderTop: `4px solid ${style.color}` }}
                onClick={() => setSelectedOpportunity(opp)}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem', alignSelf: 'flex-end' }}>
                  {style.emoji}
                </div>
                <h3>{opp.title}</h3>
                <p style={{ fontWeight: 500, color: style.color, marginBottom: 4 }}>{opp.category}</p>
                <p><strong>Organization:</strong> {opp.organization}</p>
                <p><strong>Location:</strong> {opp.location}</p>
                <p className="date">{opp.datePosted}</p>
                {isOwner && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button style={{ background: '#f3f4f6', color: '#2563eb', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 500, cursor: 'pointer' }}
                      onClick={e => { e.stopPropagation(); setSelectedOpportunity(opp); setEditMode(true); }}
                    >Edit</button>
                    <button style={{ background: '#fbe9e7', color: '#b71c1c', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 500, cursor: 'pointer' }}
                      onClick={e => { e.stopPropagation(); handleDelete(opp.id); }}
                    >Delete</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {/* Opportunity details modal with edit support */}
      {selectedOpportunity && !editMode && (
        <div className="modal-overlay" onClick={() => setSelectedOpportunity(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{selectedOpportunity.title}</h2>
            <p><strong>Organization:</strong> {selectedOpportunity.organization}</p>
            <p><strong>Location:</strong> {selectedOpportunity.location}</p>
            <p><strong>Date:</strong> {selectedOpportunity.datePosted}</p>
            <p><strong>Description:</strong> {selectedOpportunity.description || 'No description available.'}</p>
            <p><strong>Duration:</strong> {selectedOpportunity.duration || 'N/A'}</p>
            <p><strong>Skills:</strong> {selectedOpportunity.skillsRequired || 'Not specified'}</p>
            <p><strong>Contact:</strong> {selectedOpportunity.contactEmail || 'Not provided'}</p>
            <button onClick={() => setSelectedOpportunity(null)}>Close</button>
          </div>
        </div>
      )}
      {/* Edit modal */}
      {selectedOpportunity && editMode && (
        <EditOpportunityModal
          opportunity={selectedOpportunity}
          onSave={opp => { handleEdit(opp); setSelectedOpportunity(null); setEditMode(false); }}
          onCancel={() => { setEditMode(false); setSelectedOpportunity(null); }}
        />
      )}
    </div>
  );
}

// Edit modal for opportunities
function EditOpportunityModal({ opportunity, onSave, onCancel }: { opportunity: Opportunity, onSave: (opp: Opportunity) => void, onCancel: () => void }) {
  const [form, setForm] = useState(opportunity);
  const [error, setError] = useState('');
  // Validate and save edits
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.organization.trim() || !form.location.trim() || !form.datePosted.trim()) {
      setError('All fields are required.');
      return;
    }
    if (form.contactEmail && !form.contactEmail.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      setError('Please enter a valid email address.');
      return;
    }
    onSave(form);
  };
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Edit Opportunity</h2>
        {error && <div style={{ color: '#b71c1c', marginBottom: 10 }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input name="title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" required />
          <input name="organization" value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} placeholder="Organization" required />
          <input name="location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Location" required />
          <input name="datePosted" value={form.datePosted} onChange={e => setForm(f => ({ ...f, datePosted: e.target.value }))} type="date" required />
          <input name="category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Category" required />
          <textarea name="description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" />
          <input name="duration" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="Duration" />
          <input name="skillsRequired" value={form.skillsRequired} onChange={e => setForm(f => ({ ...f, skillsRequired: e.target.value }))} placeholder="Skills Required" />
          <input name="contactEmail" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} placeholder="Contact Email" type="email" />
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: 16, flex: 1, cursor: 'pointer' }}>Save</button>
            <button type="button" onClick={onCancel} style={{ background: '#f3f4f6', color: '#2563eb', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: 16, flex: 1, cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
