// components/CandidateCard.tsx
"use client"

import React from "react"

interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  location: string
  experience: string | number
  currentRole: string
  skills: string[]
  education: string
  summary: string
  appliedDate: string
  status: string
  avatar: string
  matchingJobs: string[]
  rating: number
  salary: string | number
}

interface CandidateCardProps {
  candidate: Candidate
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex flex-col space-y-3">
      <div className="flex items-center space-x-4">
        <img
          src={candidate.avatar || "/placeholder.svg"}
          alt={`${candidate.name} avatar`}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{candidate.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.currentRole}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.location}</p>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-700 dark:text-gray-300">{candidate.summary}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {candidate.skills.map((skill) => (
          <span
            key={skill}
            className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <div>Experience: {candidate.experience}</div>
        <div>Applied: {candidate.appliedDate}</div>
      </div>

      <div className="flex justify-between items-center text-sm">
        <div>Status: <span className="font-semibold">{candidate.status}</span></div>
        <div>Rating: <span className="font-semibold">{candidate.rating} ⭐</span></div>
      </div>
    </div>
  )
}
