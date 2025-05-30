import React from 'react';
import './Timeline.css';

const Timeline = ({ history }) => {
  if (!history || history.length === 0) {
    return <p className="no-history">No supervisor history available.</p>;
  }

  // Sort history by date to ensure chronological order
  const sortedHistory = [...history].sort((a, b) => new Date(a.manager_date) - new Date(b.manager_date));

  // Create timeline entries with end dates
  const timelineEntries = sortedHistory.map((entry, index) => {
    const startDate = new Date(entry.manager_date);
    const endDate = index < sortedHistory.length - 1 
      ? new Date(sortedHistory[index + 1].manager_date) 
      : new Date();

    return {
      id: entry.manager_history_id,
      managerId: entry.manager_id || entry.manager?.id || 'N/A',
      managerName: entry.manager?.name || 'No Manager',
      startDate: startDate,
      endDate: endDate,
      startDateFormatted: startDate.toLocaleDateString(),
      endDateFormatted: endDate.toLocaleDateString(),
      duration: Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)), // days
      isCurrent: index === sortedHistory.length - 1
    };
  });

  return (
    <div className="supervisor-timeline">
      <div className="timeline-header">
        <h3>Supervisor History Timeline</h3>
        <p>Scroll down to see progression from past to present</p>
      </div>
      
      <div className="timeline-container">
        {timelineEntries.map((entry, index) => (
          <div key={entry.id} className={`timeline-entry ${entry.isCurrent ? 'current' : ''}`}>
            <div className="timeline-marker">
              <div className="marker-dot"></div>
              {index < timelineEntries.length - 1 && <div className="marker-line"></div>}
            </div>
            
            <div className="timeline-content">
              <div className="timeline-card">
                <div className="card-header">
                  <h4 className="supervisor-name">{entry.managerName}</h4>
                  <span className={`status-badge ${entry.isCurrent ? 'current' : 'past'}`}>
                    {entry.isCurrent ? 'Current' : 'Past'}
                  </span>
                </div>
                
                <div className="card-details">
                  <div className="detail-row">
                    <span className="detail-label">Supervisor ID:</span>
                    <span className="detail-value">{entry.managerId}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">Start Date:</span>
                    <span className="detail-value">{entry.startDateFormatted}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">End Date:</span>
                    <span className="detail-value">
                      {entry.isCurrent ? 'Present' : entry.endDateFormatted}
                    </span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">
                      {entry.duration} days ({Math.floor(entry.duration / 30)} months)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;