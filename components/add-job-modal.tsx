"use client"

import type React from "react"
import { useState } from "react"
import styles from "@/styles/components.module.css"
import { createJobPosting } from "@/lib/api"

interface AddJobModalProps {
  onClose: () => void
  onJobCreated?: (jobData: any) => void
}

export function AddJobModal({ onClose, onJobCreated }: AddJobModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
    requirements: [] as string[],
    benefits: [] as string[],
  })

  const [currentRequirement, setCurrentRequirement] = useState("")
  const [currentBenefit, setCurrentBenefit] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.description.trim()) {
      setSubmitStatus("error")
      setSubmitMessage("Title and description are required")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const result = await createJobPosting({
        title: formData.title,
        description: formData.description,
      })

      if (result.error) {
        setSubmitStatus("error")
        setSubmitMessage(result.error)
      } else {
        setSubmitStatus("success")
        setSubmitMessage("Job posting created successfully!")

        if (onJobCreated) {
          onJobCreated({
            ...formData,
            id: Date.now(),
            posted: "Just now",
            status: "Active",
            applicants: 0,
            matchScore: 0,
          })
        }

        setTimeout(() => {
          onClose()
        }, 1500)
      }
    } catch (error) {
      setSubmitStatus("error")
      setSubmitMessage("Failed to create job posting. Please try again.")
      console.error("Job creation error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addRequirement = () => {
    if (currentRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, currentRequirement.trim()],
      }))
      setCurrentRequirement("")
    }
  }

  const addBenefit = () => {
    if (currentBenefit.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, currentBenefit.trim()],
      }))
      setCurrentBenefit("")
    }
  }

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }))
  }

  const removeBenefit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Add New Job</h2>
          <button className={styles.closeButton} onClick={onClose} disabled={isSubmitting} type="button">
            ×
          </button>
        </div>
        <div className={styles.modalContent}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Submit Status */}
            {submitStatus !== "idle" && (
              <div
                className={`${styles.statusMessage} ${submitStatus === "success" ? styles.statusSuccess : styles.statusError}`}
              >
                <span>{submitStatus === "success" ? "✓" : "⚠"}</span>
                <span>{submitMessage}</span>
              </div>
            )}

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="title">
                  Job Title *
                </label>
                <input
                  id="title"
                  className={styles.input}
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Senior Frontend Developer"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="department">
                  Department
                </label>
                <select
                  id="department"
                  className={styles.select}
                  value={formData.department}
                  onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                  disabled={isSubmitting}
                >
                  <option value="">Select department</option>
                  <option value="engineering">Engineering</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="design">Design</option>
                  <option value="operations">Operations</option>
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="location">
                  Location
                </label>
                <input
                  id="location"
                  className={styles.input}
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g. San Francisco, CA or Remote"
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="type">
                  Employment Type
                </label>
                <select
                  id="type"
                  className={styles.select}
                  value={formData.type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                  disabled={isSubmitting}
                >
                  <option value="">Select type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="salaryMin">
                  Salary Range (Min)
                </label>
                <input
                  id="salaryMin"
                  type="number"
                  className={styles.input}
                  value={formData.salaryMin}
                  onChange={(e) => setFormData((prev) => ({ ...prev, salaryMin: e.target.value }))}
                  placeholder="80000"
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="salaryMax">
                  Salary Range (Max)
                </label>
                <input
                  id="salaryMax"
                  type="number"
                  className={styles.input}
                  value={formData.salaryMax}
                  onChange={(e) => setFormData((prev) => ({ ...prev, salaryMax: e.target.value }))}
                  placeholder="120000"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="description">
                Job Description *
              </label>
              <textarea
                id="description"
                className={styles.textarea}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                rows={4}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Requirements</label>
              <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <input
                  className={styles.input}
                  value={currentRequirement}
                  onChange={(e) => setCurrentRequirement(e.target.value)}
                  placeholder="Add a requirement..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                  disabled={isSubmitting}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className={`${styles.button} ${styles.buttonSecondary}`}
                  onClick={addRequirement}
                  disabled={isSubmitting}
                >
                  +
                </button>
              </div>
              <div className={styles.badgeList}>
                {formData.requirements.map((req, index) => (
                  <span
                    key={index}
                    className={`${styles.badge} ${styles.badgeOutline}`}
                    onClick={() => !isSubmitting && removeRequirement(index)}
                  >
                    {req} ×
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Benefits</label>
              <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <input
                  className={styles.input}
                  value={currentBenefit}
                  onChange={(e) => setCurrentBenefit(e.target.value)}
                  placeholder="Add a benefit..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
                  disabled={isSubmitting}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className={`${styles.button} ${styles.buttonSecondary}`}
                  onClick={addBenefit}
                  disabled={isSubmitting}
                >
                  +
                </button>
              </div>
              <div className={styles.badgeList}>
                {formData.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className={`${styles.badge} ${styles.badgeOutline}`}
                    onClick={() => !isSubmitting && removeBenefit(index)}
                  >
                    {benefit} ×
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonSecondary}`}
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className={styles.loading}></span>
                    Creating...
                  </>
                ) : (
                  "Post Job"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
