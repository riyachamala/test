import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEye, 
  faCheck, 
  faTimes, 
  faStar,
  faDownload,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import { apiService, Candidate } from '../services/api';

const TopCandidates: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        // Mock data for demo
        const mockCandidates: Candidate[] = [
          {
            id: '1',
            name: 'John Smith',
            email: 'john.smith@email.com',
            resumeUrl: '/resume_john.pdf',
            matchingScore: 92,
            status: 'pending',
            appliedFor: 'Frontend Developer',
            feedback: 'Strong React experience, excellent portfolio'
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah.j@email.com',
            resumeUrl: '/resume_riya.pdf',
            matchingScore: 88,
            status: 'approved',
            appliedFor: 'Backend Engineer',
            feedback: 'Solid Python skills, good system design knowledge'
          },
          {
            id: '3',
            name: 'Mike Chen',
            email: 'mike.chen@email.com',
            resumeUrl: '/resume_abhi.pdf',
            matchingScore: 85,
            status: 'pending',
            appliedFor: 'Data Scientist',
            feedback: 'Strong ML background, relevant research experience'
          }
        ];
        setCandidates(mockCandidates);
      } catch (err) {
        console.error('Failed to fetch candidates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const handleStatusUpdate = async (candidateId: string, newStatus: Candidate['status']) => {
    try {
      await apiService.updateCandidateStatus(candidateId, newStatus);
      setCandidates(prev => 
        prev.map(c => c.id === candidateId ? { ...c, status: newStatus } : c)
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    if (filter === 'all') return true;
    return candidate.status === filter;
  });

  if (loading) {
    return <div className="loading">Loading candidates...</div>;
  }

  return (
    <div className="candidates-page">
      <div className="page-header">
        <h2>Top Candidates</h2>
        <div className="filters">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Candidates</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="candidates-container">
        <div className="candidates-list">
          {filteredCandidates.map((candidate) => (
            <div key={candidate.id} className="candidate-card">
              <div className="candidate-header">
                <h3>{candidate.name}</h3>
                <div className="score-badge">
                  <FontAwesomeIcon icon={faStar} />
                  {candidate.matchingScore}%
                </div>
              </div>
              
              <div className="candidate-details">
                <p><strong>Email:</strong> {candidate.email}</p>
                <p><strong>Applied for:</strong> {candidate.appliedFor}</p>
                <p><strong>Status:</strong> 
                  <span className={`status-badge ${candidate.status}`}>
                    {candidate.status}
                  </span>
                </p>
              </div>

              {candidate.feedback && (
                <div className="feedback">
                  <strong>Feedback:</strong> {candidate.feedback}
                </div>
              )}

              <div className="candidate-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <FontAwesomeIcon icon={faEye} /> View Resume
                </button>
                
                <div className="status-actions">
                  <button 
                    className="btn btn-success"
                    onClick={() => handleStatusUpdate(candidate.id, 'approved')}
                    disabled={candidate.status === 'approved'}
                  >
                    <FontAwesomeIcon icon={faCheck} /> Approve
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleStatusUpdate(candidate.id, 'rejected')}
                    disabled={candidate.status === 'rejected'}
                  >
                    <FontAwesomeIcon icon={faTimes} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedCandidate && (
          <div className="resume-viewer">
            <div className="viewer-header">
              <h3>{selectedCandidate.name} - Resume</h3>
              <button 
                className="btn btn-secondary"
                onClick={() => setSelectedCandidate(null)}
              >
                Close
              </button>
            </div>
            <div className="resume-content">
              <iframe 
                src={selectedCandidate.resumeUrl} 
                title="Resume Viewer"
                width="100%" 
                height="600px"
              />
              <div className="resume-actions">
                <a 
                  href={selectedCandidate.resumeUrl} 
                  download 
                  className="btn btn-primary"
                >
                  <FontAwesomeIcon icon={faDownload} /> Download Resume
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopCandidates;