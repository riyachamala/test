"use client"

import { useState, useEffect } from "react"
import styles from "@/styles/components.module.css"
import { getDashboardAnalytics } from "@/lib/api"

export function DashboardAnalytics() {
  const [analytics, setAnalytics] = useState({
    job_postings: 0,
    candidates: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchAnalytics = async () => {
    setIsLoading(true)
    setError("")

    try {
      const result = await getDashboardAnalytics()

      if (result.data) {
        setAnalytics(result.data)
        setLastUpdated(new Date())
        setIsDemoMode(result.message?.includes("demo") || false)
        setError("") // Clear any previous errors
      } else if (result.error) {
        setError(result.error)
        // Still set demo data even if there's an error
        setAnalytics({
          job_postings: 24,
          candidates: 1247,
        })
        setIsDemoMode(true)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error("Analytics fetch error:", error)
      setError("Failed to fetch analytics")
      // Fallback to demo data
      setAnalytics({
        job_postings: 24,
        candidates: 1247,
      })
      setIsDemoMode(true)
      setLastUpdated(new Date())
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  return (
    <div style={{ marginBottom: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", margin: 0 }}>
          Real-time Analytics{" "}
          {isDemoMode && <span style={{ fontSize: "0.875rem", color: "#f59e0b" }}>(Demo Mode)</span>}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {lastUpdated && (
            <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={fetchAnalytics}
            disabled={isLoading}
          >
            {isLoading ? <span className={styles.loading}></span> : "🔄"} Refresh
          </button>
        </div>
      </div>

      {/* Show warning if in demo mode */}
      {isDemoMode && (
        <div
          className={`${styles.statusMessage}`}
          style={{ backgroundColor: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d", marginBottom: "16px" }}
        >
          <span>⚠</span>
          <span>Backend service unavailable. Displaying demo data for interface preview.</span>
        </div>
      )}

      {/* Show error only if we couldn't get any data */}
      {error && !isDemoMode && (
        <div className={`${styles.statusMessage} ${styles.statusError}`} style={{ marginBottom: "16px" }}>
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Key Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px",
        }}
      >
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>Open Positions</span>
              <span>💼</span>
            </div>
          </div>
          <div className={styles.cardContent}>
            <div style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "4px" }}>
              {isLoading ? (
                <div
                  style={{
                    height: "32px",
                    width: "64px",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "4px",
                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  }}
                ></div>
              ) : (
                analytics.job_postings
              )}
            </div>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
              {isDemoMode ? "Demo data" : "From backend API"}
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>Total Candidates</span>
              <span>👥</span>
            </div>
          </div>
          <div className={styles.cardContent}>
            <div style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "4px" }}>
              {isLoading ? (
                <div
                  style={{
                    height: "32px",
                    width: "64px",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "4px",
                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  }}
                ></div>
              ) : (
                analytics.candidates
              )}
            </div>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
              {isDemoMode ? "Demo data" : "Indexed resumes"}
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>Interviews Scheduled</span>
              <span>🕐</span>
            </div>
          </div>
          <div className={styles.cardContent}>
            <div style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "4px" }}>89</div>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>This week</p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>Hires This Month</span>
              <span>✅</span>
            </div>
          </div>
          <div className={styles.cardContent}>
            <div style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "4px" }}>35</div>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>+25% from last month</p>
          </div>
        </div>
      </div>
    </div>
  )
}
