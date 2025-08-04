import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCloudUploadAlt, 
  faFilePdf, 
  faCheckCircle, 
  faTimesCircle,
  faSpinner,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { apiService } from '../services/api';

interface UploadedFile {
  id: string;
  name: string;
  type: 'resume' | 'jobDescription';
  size: number;
  url: string;
  uploadedAt: string;
}

const Upload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    
    for (const file of acceptedFiles) {
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        
        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(prev => ({ ...prev, [file.name]: i }));
        }

        // Determine file type based on name or content
        const isResume = file.name.toLowerCase().includes('resume') || 
                        file.name.toLowerCase().includes('cv');
        const fileType = isResume ? 'resume' : 'jobDescription';

        // Upload to backend
        const uploadResult = fileType === 'resume' 
          ? await apiService.uploadResume(file)
          : await apiService.uploadJobDescription(file);

        const uploadedFile: UploadedFile = {
          id: uploadResult.id,
          name: file.name,
          type: fileType,
          size: file.size,
          url: uploadResult.url,
          uploadedAt: new Date().toISOString()
        };

        setUploadedFiles(prev => [...prev, uploadedFile]);
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        setUploadProgress(prev => ({ ...prev, [file.name]: -1 }));
      }
    }
    
    setUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt', '.doc', '.docx']
    },
    multiple: true
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ext === 'pdf' ? faFilePdf : faFilePdf; // Default to PDF icon
  };

  return (
    <div className="upload-page">
      <div className="upload-header">
        <h2>Upload Files</h2>
        <p>Upload resumes and job descriptions to the system</p>
      </div>

      <div className="upload-container">
        <div 
          {...getRootProps()} 
          className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="dropzone-content">
            <FontAwesomeIcon icon={faCloudUploadAlt} className="upload-icon" />
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <>
                <h3>Drag & Drop files here</h3>
                <p>or click to select files</p>
                <p className="file-types">Supports: PDF, DOC, DOCX, TXT</p>
              </>
            )}
          </div>
        </div>

        {uploading && (
          <div className="upload-progress">
            <h4>Uploading files...</h4>
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="progress-item">
                <span className="file-name">{fileName}</span>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${progress === -1 ? 'error' : ''}`}
                    style={{ width: `${progress === -1 ? 100 : progress}%` }}
                  />
                </div>
                <span className="progress-text">
                  {progress === -1 ? (
                    <FontAwesomeIcon icon={faTimesCircle} className="error-icon" />
                  ) : progress === 100 ? (
                    <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
                  ) : (
                    `${progress}%`
                  )}
                </span>
              </div>
            ))}
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="uploaded-files">
            <h3>Uploaded Files</h3>
            <div className="files-grid">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="file-card">
                  <div className="file-icon">
                    <FontAwesomeIcon icon={getFileIcon(file.name)} />
                  </div>
                  <div className="file-info">
                    <h4>{file.name}</h4>
                    <p className="file-type">{file.type === 'resume' ? 'Resume' : 'Job Description'}</p>
                    <p className="file-size">{formatFileSize(file.size)}</p>
                    <p className="file-date">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="file-actions">
                    <a 
                      href={file.url} 
                      download 
                      className="btn btn-primary btn-sm"
                    >
                      <FontAwesomeIcon icon={faDownload} />
                    </a>
                    <button 
                      onClick={() => removeFile(file.id)}
                      className="btn btn-danger btn-sm"
                    >
                      <FontAwesomeIcon icon={faTimesCircle} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="upload-instructions">
        <h3>Upload Guidelines</h3>
        <div className="instructions-grid">
          <div className="instruction-card">
            <h4>Resumes</h4>
            <ul>
              <li>Upload candidate resumes in PDF format</li>
              <li>Include candidate name in filename</li>
              <li>Maximum file size: 10MB</li>
            </ul>
          </div>
          <div className="instruction-card">
            <h4>Job Descriptions</h4>
            <ul>
              <li>Upload job descriptions in PDF or DOC format</li>
              <li>Include job title in filename</li>
              <li>Maximum file size: 5MB</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;