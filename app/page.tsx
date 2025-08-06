"use client"

import Link from "next/link"
import styles from "@/styles/components.module.css"
import { DashboardAnalytics } from "@/components/dashboard-analytics"

const recentJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    applicants: 23,
    status: "Active",
    posted: "2 days ago",
  },
  {
    id: 2,
    title: "Product Marketing Manager",
    department: "Marketing",
    applicants: 18,
    status: "Active",
    posted: "5 days ago",
  },
  { id: 3, title: "UX Designer", department: "Design", applicants: 31, status: "Active", posted: "1 week ago" },
  { id: 4, title: "Sales Development Rep", department: "Sales", applicants: 12, status: "Draft", posted: "3 days ago" },
]

export default function Dashboard() {
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
              <Link href="/" style={{ color: "#3b82f6", fontWeight: "500", textDecoration: "none" }}>
                Dashboard
              </Link>
              <Link href="/jobs" style={{ color: "#6b7280", textDecoration: "none" }}>
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
        {/* Real-time Analytics */}
        <DashboardAnalytics />

        {/* Recent Job Postings */}
        <div className={styles.card}>
          <div
            className={styles.cardHeader}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <h3 className={styles.cardTitle}>Recent Job Postings</h3>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "4px 0 0 0" }}>
                Latest positions and their application status
              </p>
            </div>
            <Link href="/jobs">
              <button className={`${styles.button} ${styles.buttonSecondary}`}>View All Jobs →</button>
            </Link>
          </div>
          <div className={styles.cardContent}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <Link
                        href={`/jobs/${job.id}`}
                        style={{
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
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        marginTop: "4px",
                        fontSize: "0.875rem",
                        color: "#6b7280",
                      }}
                    >
                      <span>{job.department}</span>
                      <span>•</span>
                      <span>{job.applicants} applicants</span>
                      <span>•</span>
                      <span>Posted {job.posted}</span>
                    </div>
                  </div>
                  <Link href={`/jobs/${job.id}`}>
                    <button className={`${styles.button} ${styles.buttonSecondary}`}>View Details</button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
