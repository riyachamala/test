"use client"

import { useState } from "react"
import styles from "@/styles/components.module.css"
import { matchCandidates, getChatbotExplanation, formatMatchResults, getTopMatches } from "@/lib/api"

interface MatchResult {
  resumeId: string
  relevanceScore: number
  matchPercentage: number
}

export function AIMatchingPanel() {
  const [jobDescription, setJobDescription] = useState("")
  const [locationFilter, setLocationFilter] = useState("any")
  const [experienceFilter, setExperienceFilter] = useState("")
  const [skillsFilter, setSkillsFilter] = useState("")

  const [isMatching, setIsMatching] = useState(false)
  const [isGettingExplanation, setIsGettingExplanation] = useState(false)
  const [matchResults, setMatchResults] = useState<MatchResult[]>([])
  const [chatbotReply, setChatbotReply] = useState("")
  const [bestCandidate, setBestCandidate] = useState("")
  const [error, setError] = useState("")

  const handleMatch = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description")
      return
    }

    setIsMatching(true)
    setError("")
    setMatchResults([])

    try {
      const filters: any = {}
      if (locationFilter !== "any") {
        filters.location = { $eq: locationFilter }
      }
      if (experienceFilter) {
        filters.experience = { $gte: Number.parseInt(experienceFilter) }
      }
      if (skillsFilter) {
        filters.skills = { $in: skillsFilter.split(",").map((s) => s.trim()) }
      }

      const result = await matchCandidates(jobDescription, filters)

      if (result.error) {
        setError(result.error)
      } else if (result.data) {
        const formattedResults = formatMatchResults(result.data.matches)
        const topMatches = getTopMatches(result.data.matches, 10)
        setMatchResults(formatMatchResults(topMatches))
      }
    } catch (error) {
      setError("Failed to match candidates. Please try again.")
      console.error("Matching error:", error)
    } finally {
      setIsMatching(false)
    }
  }

  const handleGetExplanation = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description first")
      return
    }

    setIsGettingExplanation(true)
    setError("")

    try {
      const result = await getChatbotExplanation(jobDescription)

      if (result.error) {
        setError(result.error)
      } else if (result.data) {
        setChatbotReply(result.data.reply)
        setBestCandidate(result.data.best_candidate)
      }
    } catch (error) {
      setError("Failed to get explanation. Please try again.")
      console.error("Chatbot error:", error)
    } finally {
      setIsGettingExplanation(false)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Job Description Input */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>✨ AI-Powered Candidate Matching</h3>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="jobDescription">
                Job Description *
              </label>
              <textarea
                id="jobDescription"
                className={styles.textarea}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Enter the job description to find matching candidates..."
                rows={4}
              />
            </div>

            {/* Filters */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="location">
                  Location Filter
                </label>
                <select
                  id="location"
                  className={styles.select}
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="any">Any location</option>
                  <option value="remote">Remote</option>
                  <option value="san francisco">San Francisco</option>
                  <option value="new york">New York</option>
                  <option value="boston">Boston</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="experience">
                  Min Experience (years)
                </label>
                <input
                  id="experience"
                  type="number"
                  className={styles.input}
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                  placeholder="e.g. 3"
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="skills">
                  Required Skills (comma-separated)
                </label>
                <input
                  id="skills"
                  className={styles.input}
                  value={skillsFilter}
                  onChange={(e) => setSkillsFilter(e.target.value)}
                  placeholder="e.g. React, TypeScript, Node.js"
                />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className={`${styles.statusMessage} ${styles.statusError}`}>
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                className={`${styles.button} ${styles.buttonPrimary}`}
                onClick={handleMatch}
                disabled={isMatching || !jobDescription.trim()}
              >
                {isMatching ? (
                  <>
                    <span className={styles.loading}></span>
                    Matching...
                  </>
                ) : (
                  <>🔍 Find Matches</>
                )}
              </button>

              <button
                className={`${styles.button} ${styles.buttonSecondary}`}
                onClick={handleGetExplanation}
                disabled={isGettingExplanation || !jobDescription.trim()}
              >
                {isGettingExplanation ? (
                  <>
                    <span className={styles.loading}></span>
                    Getting Explanation...
                  </>
                ) : (
                  <>🤖 Get AI Explanation</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Match Results */}
      {matchResults.length > 0 && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>📈 Top Candidate Matches ({matchResults.length})</h3>
          </div>
          <div className={styles.cardContent}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {matchResults.map((match, index) => (
                <div key={match.resumeId} className={styles.matchResult}>
                  <div className={styles.matchInfo}>
                    <div className={styles.matchRank}>#{index + 1}</div>
                    <div className={styles.matchDetails}>
                      <h4>Resume ID: {match.resumeId}</h4>
                      <p>Relevance Score: {match.relevanceScore.toFixed(3)}</p>
                    </div>
                  </div>
                  <div className={styles.matchActions}>
                    <span
                      className={`${styles.matchBadge} ${
                        match.matchPercentage >= 80 ? styles.matchBadgeHigh : styles.matchBadgeNormal
                      }`}
                    >
                      {match.matchPercentage}% Match
                    </span>
                    <button className={`${styles.button} ${styles.buttonSecondary}`}>View Resume</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Explanation */}
      {chatbotReply && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>🤖 AI Matching Explanation</h3>
          </div>
          <div className={styles.cardContent}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {bestCandidate && (
                <div className={`${styles.statusMessage} ${styles.statusSuccess}`}>
                  <span>✓</span>
                  <div>
                    <div style={{ fontWeight: "500" }}>Best Candidate Found</div>
                    <div style={{ fontSize: "0.875rem" }}>Resume ID: {bestCandidate}</div>
                  </div>
                </div>
              )}

              <div
                style={{
                  whiteSpace: "pre-line",
                  backgroundColor: "#f9fafb",
                  padding: "16px",
                  borderRadius: "6px",
                  color: "#374151",
                }}
              >
                {chatbotReply}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
