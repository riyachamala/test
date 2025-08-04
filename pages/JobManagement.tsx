import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faEye,
  faBriefcase,
  faMapMarkerAlt,
  faUsers,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';
import { apiService, Job } from '../services/api';

interface JobFormData {
  title: string;
  department: string;
  location: string;
  description: string;
}

const JobManagement: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    department: '',
    location: '',
    description: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Mock data for demo
      const mockJobs: Job[] = [
        {
          id: '1',
          title: 'Senior Frontend Developer',
          department: 'Engineering',
          location: 'San Francisco, CA',
          description: 'We are looking for an experienced frontend developer with React expertise...',
          applicantsCount: 15,
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          title: 'Data Scientist',
          department: 'Data Science',
          location: 'New York, NY',
          description: 'Join our data science team to build machine learning models...',
          applicantsCount: 8,
          createdAt: '2024-01-10T14:30:00Z'
        },
        {
          id: '3',
          title: 'Product Manager',
          department: 'Product',
          location: 'Remote',
          description: 'Lead product strategy and development for our core platform...',
          applicantsCount: 12,
          createdAt: '2024-01-08T09:15:00Z'
        }
      ];
      setJobs(mockJobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingJob) {
        await apiService.updateJob(editingJob.id, formData);
        setJobs(prev => prev.map(job => 
          job.id === editingJob.id ? { ...job, ...formData } : job
        ));
      } else {
        const newJob = await apiService.createJob(formData);
        setJobs(prev => [...prev, newJob]);
      }
      
      resetForm();
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      description: job.description
    });
    setShowForm(true);
  };

  const handleDelete = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await apiService.deleteJob(jobId);
        setJobs(prev => prev.filter(job => job.id !== jobId));
      } catch (error) {
        console.error('Failed to delete job:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      department: '',
      location: '',
      description: ''
    });
    setEditingJob(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Loading jobs...</div>;
  }

  return (
    <div className="job-management-page">
      <div className="page-header">
        <h2>Job Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <FontAwesomeIcon icon={faPlus} /> Add New Job
        </button>
      </div>

      {showForm && (
        <div className="job-form-container">
          <div className="form-header">
            <h3>{editingJob ? 'Edit Job' : 'Create New Job'}</h3>
            <button 
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="job-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Job Title *</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="department">Department *</label>
                <input
                  type="text"
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., San Francisco, CA or Remote"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Job Description *</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={6}
                placeholder="Describe the role, responsibilities, and requirements..."
                required
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingJob ? 'Update Job' : 'Create Job'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="jobs-grid">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-header">
              <h3>{job.title}</h3>
              <div className="job-actions">
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleEdit(job)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(job.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
            
            <div className="job-details">
              <div className="job-meta">
                <span className="meta-item">
                  <FontAwesomeIcon icon={faBriefcase} />
                  {job.department}
                </span>
                <span className="meta-item">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  {job.location}
                </span>
                <span className="meta-item">
                  <FontAwesomeIcon icon={faUsers} />
                  {job.applicantsCount} applicants
                </span>
                <span className="meta-item">
                  <FontAwesomeIcon icon={faCalendar} />
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="job-description">
                <p>{job.description.substring(0, 150)}...</p>
              </div>
            </div>
            
            <div className="job-footer">
              <button className="btn btn-primary btn-sm">
                <FontAwesomeIcon icon={faEye} /> View Applicants
              </button>
            </div>
          </div>
        ))}
      </div>

      {jobs.length === 0 && !showForm && (
        <div className="empty-state">
          <FontAwesomeIcon icon={faBriefcase} className="empty-icon" />
          <h3>No jobs posted yet</h3>
          <p>Create your first job posting to start receiving applications</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> Create First Job
          </button>
        </div>
      )}
    </div>
  );
};

export default JobManagement;