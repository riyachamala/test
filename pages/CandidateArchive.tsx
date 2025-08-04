import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faFilter, 
  faEye, 
  faDownload,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faStar,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { apiService, Candidate } from '../services/api';

const CandidateArchive: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [candidates, searchTerm, statusFilter]);

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
          status: 'approved',
          appliedFor: 'Frontend Developer',
          feedback: 'Strong React experience, excellent portfolio'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.j@email.com',
          resumeUrl: '/resume_riya.pdf',
          matchingScore: 88,
          status: 'rejected',
          appliedFor: 'Backend Engineer',
          feedback: 'Good skills but lacks required experience'
        },
        {
          id: '3',
          name: 'Mike Chen',
          email: 'mike.chen@email.com',
          resumeUrl: '/resume_abhi.pdf',
          matchingScore: 85,
          status: 'approved',
          appliedFor: 'Data Scientist',
          feedback: 'Strong ML background, relevant research experience'
        },
        {
          id: '4',
          name: 'Emily Davis',
          email: 'emily.davis@email.com',
          resumeUrl: '/resume_emily.pdf',
          matchingScore: 78,
          status: 'rejected',
          appliedFor: 'Product Manager',
          feedback: 'Good communication skills but limited technical background'
        },
        {
          id: '5',
          name: 'Alex Rodriguez',
          email: 'alex.r@email.com',
          resumeUrl: '/resume_alex.pdf',
          matchingScore: 95,
          status: 'approved',
          appliedFor: 'Senior Developer',
          feedback: 'Excellent technical skills and leadership experience'
        }
      ];
      setCandidates(mockCandidates);
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCandidates = () => {
    let filtered = candidates;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(candidate => candidate.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(term) ||
        candidate.email.toLowerCase().includes(term) ||
        candidate.appliedFor.toLowerCase().includes(term)
      );
    }

    setFilteredCandidates(filtered);
  };

  const getStatusIcon = (status: Candidate['status']) => {
    switch (status) {
      case 'approved':
        return faCheckCircle;
      case 'rejected':
        return faTimesCircle;
      case 'pending':
        return faClock;
      default:
        return faClock;
    }
  };

  const getStatusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return <div className="loading">Loading archive...</div>;
  }

  return (
    <div className="candidate-archive-page">
      <div className="page-header">
        <h2>Candidate Archive</h2>
        <p>Review all previously processed candidates</p>
      </div>

      <div className="archive-controls">
        <div className="search-section">
          <div className="search-input">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Search by name, email, or job applied for..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <FontAwesomeIcon icon={faFilter} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="archive-stats">
        <div className="stat-item">
          <span className="stat-label">Total Candidates:</span>
          <span className="stat-value">{candidates.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Approved:</span>
          <span className="stat-value success">
            {candidates.filter(c => c.status === 'approved').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Rejected:</span>
          <span className="stat-value danger">
            {candidates.filter(c => c.status === 'rejected').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pending:</span>
          <span className="stat-value warning">
            {candidates.filter(c => c.status === 'pending').length}
          </span>
        </div>
      </div>

      <div className="archive-container">
        <div className="candidates-table">
          <div className="table-header">
            <div className="header-cell">Candidate</div>
            <div className="header-cell">Applied For</div>
            <div className="header-cell">Score</div>
            <div className="header-cell">Status</div>
            <div className="header-cell">Actions</div>
          </div>

          {filteredCandidates.map((candidate) => (
            <div key={candidate.id} className="table-row">
              <div className="cell candidate-info">
                <div className="candidate-name">{candidate.name}</div>
                <div className="candidate-email">
                  <FontAwesomeIcon icon={faEnvelope} />
                  {candidate.email}
                </div>
              </div>
              
              <div className="cell">
                <span className="job-title">{candidate.appliedFor}</span>
              </div>
              
              <div className="cell">
                <div className="score-badge">
                  <FontAwesomeIcon icon={faStar} />
                  {candidate.matchingScore}%
                </div>
              </div>
              
              <div className="cell">
                <span className={`status-badge ${getStatusColor(candidate.status)}`}>
                  <FontAwesomeIcon icon={getStatusIcon(candidate.status)} />
                  {candidate.status}
                </span>
              </div>
              
              <div className="cell actions">
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <FontAwesomeIcon icon={faEye} /> View
                </button>
                <a 
                  href={candidate.resumeUrl} 
                  download 
                  className="btn btn-secondary btn-sm"
                >
                  <FontAwesomeIcon icon={faDownload} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <div className="empty-state">
            <h3>No candidates found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {selectedCandidate && (
        <div className="candidate-detail-modal">
          <div className="modal-header">
            <h3>{selectedCandidate.name} - Details</h3>
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedCandidate(null)}
            >
              Close
            </button>
          </div>
          
          <div className="modal-content">
            <div className="detail-section">
              <h4>Contact Information</h4>
              <p><strong>Email:</strong> {selectedCandidate.email}</p>
              <p><strong>Applied for:</strong> {selectedCandidate.appliedFor}</p>
            </div>
            
            <div className="detail-section">
              <h4>Assessment</h4>
              <p><strong>Matching Score:</strong> {selectedCandidate.matchingScore}%</p>
              <p><strong>Status:</strong> 
                <span className={`status-badge ${getStatusColor(selectedCandidate.status)}`}>
                  {selectedCandidate.status}
                </span>
              </p>
            </div>
            
            {selectedCandidate.feedback && (
              <div className="detail-section">
                <h4>Feedback</h4>
                <p>{selectedCandidate.feedback}</p>
              </div>
            )}
            
            <div className="detail-section">
              <h4>Resume</h4>
              <div className="resume-preview">
                <iframe 
                  src={selectedCandidate.resumeUrl} 
                  title="Resume Preview"
                  width="100%" 
                  height="400px"
                />
              </div>
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
        </div>
      )}
    </div>
  );
};

export default CandidateArchive;