"use client"

import { useState, useEffect } from "react"
import styles from "@/styles/components.module.css"
import { apiClient, Analytics } from "@/lib/api"

export function DashboardAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics>({
    total_jobs: 0,
    total_candidates: 0,
    total_matches: 0,
    active_jobs: 0,
    shortlisted_candidates: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchAnalytics = async () => {
    setIsLoading(true)
    setError("")

    try {
      const data = await apiClient.getAnalytics()
      setAnalytics(data)
      setLastUpdated(new Date())
      setError("")
    } catch (error) {
      console.error("Analytics fetch error:", error)
      setError("Failed to fetch analytics")
      // Fallback to demo data
      setAnalytics({
        total_jobs: 24,
        total_candidates: 1247,
        total_matches: 156,
        active_jobs: 18,
        shortlisted_candidates: 89,
      })
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
          Real-time Analytics
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

      {/* Show error if we couldn't get data */}
      {error && (
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
              <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>Active Jobs</span>
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
                analytics.active_jobs
              )}
            </div>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
              {analytics.total_jobs} total positions
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
                analytics.total_candidates
              )}
            </div>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
              Indexed resumes
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>AI Matches</span>
              <span>🤖</span>
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
                analytics.total_matches
              )}
            </div>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
              AI-generated matches
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>Shortlisted</span>
              <span>✅</span>
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
                analytics.shortlisted_candidates
              )}
            </div>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
              Ready for interviews
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
