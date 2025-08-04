import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faBriefcase, 
  faCheckCircle, 
  faClock,
  faChartLine 
} from '@fortawesome/free-solid-svg-icons';
import { apiService, DashboardStats } from '../services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // For demo purposes, using mock data since backend isn't set up yet
        const mockStats: DashboardStats = {
          openJobs: 12,
          totalCandidates: 156,
          reviewedCandidates: 89,
          pendingCandidates: 67,
          averageMatchingScore: 78.5
        };
        setStats(mockStats);
      } catch (err) {
        setError('Failed to load dashboard statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faBriefcase} />
          </div>
          <div className="stat-content">
            <h3>{stats?.openJobs}</h3>
            <p>Open Job Roles</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="stat-content">
            <h3>{stats?.totalCandidates}</h3>
            <p>Total Candidates</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <div className="stat-content">
            <h3>{stats?.reviewedCandidates}</h3>
            <p>Candidates Reviewed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faClock} />
          </div>
          <div className="stat-content">
            <h3>{stats?.pendingCandidates}</h3>
            <p>Pending Review</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className="stat-content">
            <h3>{stats?.averageMatchingScore}%</h3>
            <p>Avg Matching Score</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-time">2 hours ago</span>
              <span className="activity-text">New candidate applied for Frontend Developer</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">4 hours ago</span>
              <span className="activity-text">Job posting created: Senior Backend Engineer</span>
            </div>
            <div className="activity-item">
              <span className="activity-time">1 day ago</span>
              <span className="activity-text">5 candidates reviewed for Data Scientist role</span>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <button className="action-btn">Upload Resume</button>
            <button className="action-btn">Create Job Posting</button>
            <button className="action-btn">Review Candidates</button>
            <button className="action-btn">Chat with AI</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;