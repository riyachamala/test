"use client"

import type React from "react"
import { useState, useRef } from "react"
import styles from "@/styles/components.module.css"
import { uploadCandidateResumes } from "@/lib/api"

interface UploadResumeModalProps {
  onClose: () => void
}

export function UploadResumeModal({ onClose }: UploadResumeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    experience: "",
    currentRole: "",
    expectedSalary: "",
    skills: [] as string[],
    summary: "",
  })

  const [currentSkill, setCurrentSkill] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [uploadMessage, setUploadMessage] = useState("")
  const [isDemoMode, setIsDemoMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const pdfFiles = files.filter((file) => file.type === "application/pdf")

    if (pdfFiles.length !== files.length) {
      setUploadStatus("error")
      setUploadMessage("Please upload only PDF files")
      return
    }

    setUploadedFiles(pdfFiles)
    setUploadStatus("idle")
    setUploadMessage("")
    console.log(
      "Files selected:",
      pdfFiles.map((f) => f.name),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (uploadedFiles.length === 0) {
      setUploadStatus("error")
      setUploadMessage("Please select at least one PDF file to upload")
      return
    }

    setIsUploading(true)
    setUploadStatus("idle")

    try {
      const uploadResult = await uploadCandidateResumes(uploadedFiles)

      if (uploadResult.error) {
        if (uploadResult.message === "demo_mode") {
          setUploadStatus("success")
          setUploadMessage(`Demo mode: ${uploadedFiles.length} resume(s) processed locally for interface preview`)
          setIsDemoMode(true)
        } else {
          setUploadStatus("error")
          setUploadMessage(uploadResult.error)
        }
      } else {
        setUploadStatus("success")
        setUploadMessage(`Successfully uploaded ${uploadedFiles.length} resume(s) and indexed them for matching`)
      }

      const candidateData = {
        ...formData,
        resumeFiles: uploadedFiles.map((f) => f.name),
        uploadedAt: new Date().toISOString(),
        demoMode: isDemoMode,
      }
      console.log("Candidate data:", candidateData)

      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      setUploadStatus("error")
      setUploadMessage("Upload failed. Please try again.")
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const addSkill = () => {
    if (currentSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()],
      }))
      setCurrentSkill("")
    }
  }

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Upload Resume & Add Candidate</h2>
          <button className={styles.closeButton} onClick={onClose} disabled={isUploading} type="button">
            ×
          </button>
        </div>
        <div className={styles.modalContent}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* File Upload Section */}
            <div className={styles.uploadArea}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf"
                multiple
                style={{ display: "none" }}
                disabled={isUploading}
              />

              {uploadedFiles.length > 0 ? (
                <div>
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontSize: "1.125rem", fontWeight: "500", marginBottom: "4px" }}>
                      {uploadedFiles.length} file(s) selected
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Ready to upload</div>
                  </div>

                  <div className={styles.fileList}>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className={styles.fileItem}>
                        <span className={styles.fileName}>{file.name}</span>
                        <button
                          type="button"
                          className={styles.removeFileButton}
                          onClick={() => removeFile(index)}
                          disabled={isUploading}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className={styles.uploadIcon}>📄</div>
                  <div className={styles.uploadTitle}>Upload Resume(s)</div>
                  <div className={styles.uploadDescription}>Select one or more PDF files to upload and index</div>
                </div>
              )}

              <button
                type="button"
                className={`${styles.button} ${styles.buttonSecondary}`}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                style={{ marginTop: "8px" }}
              >
                {uploadedFiles.length > 0 ? "Change Files" : "Choose Files"}
              </button>
            </div>

            {/* Upload Status */}
            {uploadStatus !== "idle" && (
              <div
                className={`${styles.statusMessage} ${uploadStatus === "success" ? styles.statusSuccess : styles.statusError}`}
              >
                <span>{uploadStatus === "success" ? "✓" : "⚠"}</span>
                <span>{uploadMessage}</span>
              </div>
            )}

            {/* Optional Candidate Information */}
            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "20px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "16px" }}>
                Optional: Candidate Information
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "16px" }}>
                This information is optional. The resume content will be automatically indexed for matching.
              </p>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    className={styles.input}
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                    disabled={isUploading}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={styles.input}
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="john@example.com"
                    disabled={isUploading}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="phone">
                    Phone
                  </label>
                  <input
                    id="phone"
                    className={styles.input}
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                    disabled={isUploading}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="location">
                    Location
                  </label>
                  <input
                    id="location"
                    className={styles.input}
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="San Francisco, CA"
                    disabled={isUploading}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="currentRole">
                  Current Role
                </label>
                <input
                  id="currentRole"
                  className={styles.input}
                  value={formData.currentRole}
                  onChange={(e) => setFormData((prev) => ({ ...prev, currentRole: e.target.value }))}
                  placeholder="Senior Frontend Developer at TechCorp"
                  disabled={isUploading}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Skills</label>
                <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <input
                    className={styles.input}
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    disabled={isUploading}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className={`${styles.button} ${styles.buttonSecondary}`}
                    onClick={addSkill}
                    disabled={isUploading}
                  >
                    +
                  </button>
                </div>
                <div className={styles.badgeList}>
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className={`${styles.badge} ${styles.badgeOutline}`}
                      onClick={() => removeSkill(index)}
                    >
                      {skill} ×
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonSecondary}`}
                onClick={onClose}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${styles.button} ${styles.buttonPrimary}`}
                disabled={isUploading || uploadedFiles.length === 0}
              >
                {isUploading ? (
                  <>
                    <span className={styles.loading}></span>
                    Uploading...
                  </>
                ) : (
                  "Upload & Index Resumes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
