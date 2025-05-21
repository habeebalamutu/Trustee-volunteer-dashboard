// AddOpportunity.tsx
// Page for adding a new volunteer opportunity.
import { useState } from 'react';

const initialState = {
  title: '',
  organization: '',
  location: '',
  datePosted: '',
  category: '',
  description: '',
  duration: '',
  skillsRequired: '',
  contactEmail: '',
};

export default function AddOpportunity({ onBack, onAdd }: { onBack: () => void, onAdd: (opp: any) => void }) {
  // form state
  const [form, setForm] = useState(initialState);
  // state for form submission and alert
  const [submitted, setSubmitted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // This handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onAdd(form);
      setForm(initialState);
      setSubmitted(false);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        onBack();
      }, 1500);
    }, 800);
  };

  return (
    <div className="add-opportunity-form-wrapper">
      <button className="back-btn" onClick={onBack}>&larr; Back</button>
      <h2>Add New Opportunity</h2>
      {showAlert && (
        <div className="alert-success">Opportunity has been added successfully!</div>
      )}
      <form className="opportunity-form" onSubmit={handleSubmit}>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
        <input name="organization" value={form.organization} onChange={handleChange} placeholder="Organization" required />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
        <input name="datePosted" value={form.datePosted} onChange={handleChange} type="date" required />
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="Environment">Environment</option>
          <option value="Education">Education</option>
          <option value="Health">Health</option>
          <option value="Technology">Technology</option>
          <option value="Sports">Sports</option>
          <option value="Arts">Arts</option>
          <option value="Community">Community</option>
          <option value="Animal Welfare">Animal Welfare</option>
          <option value="Disaster Relief">Disaster Relief</option>
          <option value="Other">Other</option>
        </select>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
        <input name="duration" value={form.duration} onChange={handleChange} placeholder="Duration" />
        <input name="skillsRequired" value={form.skillsRequired} onChange={handleChange} placeholder="Skills Required" />
        <input name="contactEmail" value={form.contactEmail} onChange={handleChange} placeholder="Contact Email" type="email" />
        <button type="submit" disabled={submitted}>{submitted ? 'Submitting...' : 'Add Opportunity'}</button>
      </form>
    </div>
  );
}
