"use client"

import { useState } from "react"
import Link from "next/link"
import styles from "@/styles/components.module.css"
import { AddJobModal } from "@/components/add-job-modal"
import { AIMatchingPanel } from "@/components/ai-matching-panel"

const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    applicants: 23,
    matchScore: 92,
    status: "Active",
    posted: "2 days ago",
    description: "Looking for an experienced frontend developer to join our engineering team...",
    requirements: ["React", "TypeScript", "5+ years experience", "Next.js"],
  },
  {
    id: 2,
    title: "Product Marketing Manager",
    department: "Marketing",
    location: "New York, NY",
    type: "Full-time",
    applicants: 18,
    matchScore: 87,
    status: "Active",
    posted: "5 days ago",
    description: "Drive product marketing strategy and go-to-market execution...",
    requirements: ["Product Marketing", "B2B SaaS", "3+ years experience", "Analytics"],
  },
  {
    id: 3,
    title: "UX Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    applicants: 31,
    matchScore: 95,
    status: "Active",
    posted: "1 week ago",
    description: "Create exceptional user experiences for our digital products...",
    requirements: ["Figma", "User Research", "Prototyping", "4+ years experience"],
  },
]

export default function JobsPage() {
  const [showAddJobModal, setShowAddJobModal] = useState(false)
  const [activeTab, setActiveTab] = useState("jobs")

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Header */}
      <header style={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb" }}>
        <div className={styles.container}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: "2rem", marginRight: "12px" }}>🏢</span>
              <h1 style={{ fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>TalentHub</h1>
            </div>
            <nav style={{ display: "flex", gap: "32px" }}>
              <Link href="/" style={{ color: "#6b7280", textDecoration: "none" }}>
                Dashboard
              </Link>
              <Link href="/jobs" style={{ color: "#3b82f6", fontWeight: "500", textDecoration: "none" }}>
                Jobs & Matching
              </Link>
              <Link href="/candidates" style={{ color: "#6b7280", textDecoration: "none" }}>
                Candidates
              </Link>
              <Link href="/interviews" style={{ color: "#6b7280", textDecoration: "none" }}>
                Interviews
              </Link>
              <Link href="/chat" style={{ color: "#6b7280", textDecoration: "none" }}>
                AI Assistant
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className={styles.container} style={{ padding: "32px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
          <div>
            <h2 style={{ fontSize: "1.875rem", fontWeight: "700", margin: "0 0 8px 0" }}>Jobs & AI Matching</h2>
            <p style={{ color: "#6b7280", margin: 0 }}>Manage job postings and discover AI-powered candidate matches</p>
          </div>
          <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={() => setShowAddJobModal(true)}>
            ➕ Add New Job
          </button>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
            <button
              style={{
                padding: "12px 24px",
                border: "none",
                background: "none",
                borderBottom: activeTab === "jobs" ? "2px solid #3b82f6" : "2px solid transparent",
                color: activeTab === "jobs" ? "#3b82f6" : "#6b7280",
                fontWeight: activeTab === "jobs" ? "500" : "400",
                cursor: "pointer",
              }}
              onClick={() => setActiveTab("jobs")}
            >
              All Jobs
            </button>
            <button
              style={{
                padding: "12px 24px",
                border: "none",
                background: "none",
                borderBottom: activeTab === "matching" ? "2px solid #3b82f6" : "2px solid transparent",
                color: activeTab === "matching" ? "#3b82f6" : "#6b7280",
                fontWeight: activeTab === "matching" ? "500" : "400",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onClick={() => setActiveTab("matching")}
            >
              ✨ AI Matching
            </button>
          </div>
        </div>

        {activeTab === "jobs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Search and Filters */}
            <div className={styles.card}>
              <div className={styles.cardContent}>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ position: "relative" }}>
                      <input className={styles.input} placeholder="Search jobs..." style={{ paddingLeft: "40px" }} />
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>
                        🔍
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <select className={styles.select} style={{ width: "180px" }}>
                      <option>All Departments</option>
                      <option>Engineering</option>
                      <option>Marketing</option>
                      <option>Design</option>
                      <option>Sales</option>
                    </select>
                    <select className={styles.select} style={{ width: "140px" }}>
                      <option>All Status</option>
                      <option>Active</option>
                      <option>Draft</option>
                      <option>Closed</option>
                    </select>
                    <button className={`${styles.button} ${styles.buttonSecondary}`}>🔍 More Filters</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Listings */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {jobs.map((job) => (
                <div key={job.id} className={styles.card} style={{ transition: "box-shadow 0.2s" }}>
                  <div className={styles.cardContent}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "16px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                          <Link
                            href={`/jobs/${job.id}`}
                            style={{
                              fontSize: "1.25rem",
                              fontWeight: "600",
                              color: "#111827",
                              textDecoration: "none",
                            }}
                          >
                            {job.title}
                          </Link>
                          <span
                            className={`${styles.badge} ${job.status === "Active" ? styles.badgeOutline : styles.badgeOutline}`}
                          >
                            {job.status}
                          </span>
                          {job.matchScore >= 90 && (
                            <span
                              className={`${styles.badge}`}
                              style={{ backgroundColor: "#dcfce7", color: "#166534" }}
                            >
                              ✨ High Match
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            fontSize: "0.875rem",
                            color: "#6b7280",
                            marginBottom: "12px",
                          }}
                        >
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>🏢 {job.department}</span>
                          <span>{job.location}</span>
                          <span>{job.type}</span>
                          <span>Posted {job.posted}</span>
                        </div>
                        <p style={{ color: "#6b7280", marginBottom: "12px", margin: "0 0 12px 0" }}>
                          {job.description}
                        </p>
                        <div className={styles.badgeList}>
                          {job.requirements.map((req, index) => (
                            <span key={index} className={`${styles.badge} ${styles.badgeOutline}`}>
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", marginLeft: "24px" }}>
                        <div style={{ fontSize: "2rem", fontWeight: "700", color: "#111827" }}>{job.applicants}</div>
                        <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>applicants</div>
                        <div style={{ marginTop: "8px" }}>
                          <div style={{ fontSize: "0.875rem", fontWeight: "500", color: "#10b981" }}>
                            Match Score: {job.matchScore}%
                          </div>
                        </div>
                        <Link href={`/jobs/${job.id}`} style={{ marginTop: "16px", display: "inline-block" }}>
                          <button className={`${styles.button} ${styles.buttonPrimary}`}>View Details →</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "matching" && (
          <div>
            <div className={styles.card} style={{ marginBottom: "24px" }}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>✨ AI-Powered Job-Candidate Matching</h3>
              </div>
              <div className={styles.cardContent}>
                <p style={{ color: "#6b7280", margin: 0 }}>
                  Our AI analyzes candidate profiles, skills, experience, and preferences to find the best matches for
                  your open positions.
                </p>
              </div>
            </div>

            <AIMatchingPanel />
          </div>
        )}
      </div>

      {showAddJobModal && <AddJobModal onClose={() => setShowAddJobModal(false)} />}
    </div>
  )
}
