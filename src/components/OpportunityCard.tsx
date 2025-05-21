// OpportunityCard.tsx
// Card component for displaying a single volunteer opportunity summary.
import React from 'react';
import './OpportunityCard.css';

interface Props {
  title: string;
  organization: string;
  location: string;
  datePosted: string;
}

// shows a card with the opportunity.
const OpportunityCard: React.FC<Props> = ({ title, organization, location, datePosted }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p><strong>Organization:</strong> {organization}</p>
      <p><strong>Location:</strong> {location}</p>
      <p className="date">{new Date(datePosted).toDateString()}</p>
    </div>
  );
};

export default OpportunityCard;
