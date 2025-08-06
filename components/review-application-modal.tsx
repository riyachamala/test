"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  X,
  Star,
  MapPin,
  Briefcase,
  Calendar,
  TrendingUp,
  Mail,
  Phone,
  ExternalLink,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react"

interface Candidate {
  id: number
  name: string
  email: string
  phone: string
  location: string
  experience: string
  currentRole: string
  skills: string[]
  education: string
  summary: string
  appliedDate: string
  status: string
  avatar: string
  matchingJobs: string[]
  rating: number
  salary: string
}

interface ReviewApplicationModalProps {
  candidate: Candidate
  onClose: () => void
  onStatusUpdate: (candidateId: number, newStatus: string, notes?: string) => void
}

export function ReviewApplicationModal({ candidate, onClose, onStatusUpdate }: ReviewApplicationModalProps) {
  const [rating, setRating] = useState(candidate.rating)
  const [notes, setNotes] = useState("")
  const [nextStage, setNextStage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAdvanceStage = async () => {
    if (!nextStage) return

    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      onStatusUpdate(candidate.id, nextStage, notes)
      setIsProcessing(false)
      onClose()
      alert(`Candidate moved to ${nextStage} stage successfully!`)
    }, 1000)
  }

  const handleReject = async () => {
    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      onStatusUpdate(candidate.id, "Rejected", notes)
      setIsProcessing(false)
      onClose()
      alert("Candidate has been rejected and removed from active applications.")
    }, 1000)
  }

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
    // Here you would typically save the rating to your backend
    console.log(`Rating updated for candidate ${candidate.id}: ${newRating} stars`)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
              <AvatarFallback>
                {candidate.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">Review Application</h2>
              <p className="text-sm text-gray-600">{candidate.name}</p>
            </div>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Candidate Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Candidate Overview</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{candidate.name}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 cursor-pointer transition-colors ${
                            i < rating ? "text-yellow-400 fill-current" : "text-gray-300 hover:text-yellow-300"
                          }`}
                          onClick={() => handleRatingChange(i + 1)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{candidate.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{candidate.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{candidate.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <span>{candidate.experience} experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <span>{candidate.salary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Applied {candidate.appliedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Role */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Current Position</h3>
                <p className="text-gray-700">{candidate.currentRole}</p>
              </div>

              {/* Professional Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Professional Summary</h3>
                <p className="text-gray-700 leading-relaxed">{candidate.summary}</p>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Skills & Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Education</h3>
                <p className="text-gray-700">{candidate.education}</p>
              </div>

              {/* Matching Jobs */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Matching Positions</h3>
                <div className="space-y-2">
                  {candidate.matchingJobs.map((job, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium text-blue-900">{job}</span>
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Review Actions */}
            <div className="space-y-6">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Review Actions</h3>

                {/* Notes */}
                <div className="mb-6">
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Review Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your thoughts about this candidate, interview feedback, or next steps..."
                    rows={4}
                    className="mt-2"
                  />
                </div>

                {/* Next Stage Selection */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-2 block">Advance to Next Stage</Label>
                  <Select onValueChange={setNextStage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select next stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Phone Screening">Phone Screening</SelectItem>
                      <SelectItem value="Technical Interview">Technical Interview</SelectItem>
                      <SelectItem value="Portfolio Review">Portfolio Review</SelectItem>
                      <SelectItem value="Team Interview">Team Interview</SelectItem>
                      <SelectItem value="Final Interview">Final Interview</SelectItem>
                      <SelectItem value="Reference Check">Reference Check</SelectItem>
                      <SelectItem value="Offer">Make Offer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleAdvanceStage}
                    disabled={!nextStage || isProcessing}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isProcessing ? "Processing..." : "Advance Candidate"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>

                  <Button onClick={handleReject} disabled={isProcessing} variant="destructive" className="w-full">
                    <XCircle className="h-4 w-4 mr-2" />
                    {isProcessing ? "Processing..." : "Reject Candidate"}
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <Phone className="h-4 w-4 mr-2" />
                    Schedule Call
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Resume
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
