"use client"

import { useState } from "react"
import { ScheduleInterviewModal } from "@/components/schedule-interview-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Video, Phone, MapPin, CheckCircle, Circle, Building, Plus } from "lucide-react"
import Link from "next/link"
import { ChatBot } from "@/components/chat-bot"

const interviews = [
  {
    id: 1,
    candidateName: "Sarah Chen",
    candidateAvatar: "/placeholder.svg?height=40&width=40",
    jobTitle: "Senior Frontend Developer",
    date: "2024-01-15",
    time: "2:00 PM",
    type: "Video Call",
    interviewer: "John Smith",
    status: "Scheduled",
    stage: "Technical Interview",
    duration: "60 min",
    location: "Zoom",
  },
  {
    id: 2,
    candidateName: "Michael Rodriguez",
    candidateAvatar: "/placeholder.svg?height=40&width=40",
    jobTitle: "Senior Frontend Developer",
    date: "2024-01-15",
    time: "10:00 AM",
    type: "In-Person",
    interviewer: "Jane Doe",
    status: "Completed",
    stage: "Final Interview",
    duration: "45 min",
    location: "Conference Room A",
  },
  {
    id: 3,
    candidateName: "Emily Johnson",
    candidateAvatar: "/placeholder.svg?height=40&width=40",
    jobTitle: "UX Designer",
    date: "2024-01-16",
    time: "11:00 AM",
    type: "Video Call",
    interviewer: "Mike Wilson",
    status: "Scheduled",
    stage: "Portfolio Review",
    duration: "90 min",
    location: "Google Meet",
  },
  {
    id: 4,
    candidateName: "Dr. Emily Rodriguez",
    candidateAvatar: "/placeholder.svg?height=40&width=40",
    jobTitle: "Data Scientist",
    date: "2024-01-16",
    time: "3:00 PM",
    type: "Phone",
    interviewer: "Sarah Johnson",
    status: "Scheduled",
    stage: "HR Screening",
    duration: "30 min",
    location: "Phone Call",
  },
]

const pipelineStages = [
  { name: "Application", icon: Circle, color: "text-gray-400" },
  { name: "HR Screening", icon: Circle, color: "text-blue-500" },
  { name: "Technical Interview", icon: Circle, color: "text-yellow-500" },
  { name: "Portfolio/Case Study", icon: Circle, color: "text-orange-500" },
  { name: "Final Interview", icon: Circle, color: "text-purple-500" },
  { name: "Reference Check", icon: Circle, color: "text-green-500" },
  { name: "Offer", icon: CheckCircle, color: "text-green-600" },
]

const candidatePipeline = [
  {
    id: 1,
    name: "Sarah Chen",
    jobTitle: "Senior Frontend Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    currentStage: 2, // Technical Interview
    stages: [
      { name: "Application", status: "completed", date: "Jan 10" },
      { name: "HR Screening", status: "completed", date: "Jan 12" },
      { name: "Technical Interview", status: "current", date: "Jan 15" },
      { name: "Portfolio Review", status: "pending", date: "TBD" },
      { name: "Final Interview", status: "pending", date: "TBD" },
      { name: "Reference Check", status: "pending", date: "TBD" },
      { name: "Offer", status: "pending", date: "TBD" },
    ],
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    jobTitle: "Senior Frontend Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    currentStage: 4, // Final Interview
    stages: [
      { name: "Application", status: "completed", date: "Jan 8" },
      { name: "HR Screening", status: "completed", date: "Jan 10" },
      { name: "Technical Interview", status: "completed", date: "Jan 12" },
      { name: "Portfolio Review", status: "completed", date: "Jan 14" },
      { name: "Final Interview", status: "current", date: "Jan 15" },
      { name: "Reference Check", status: "pending", date: "TBD" },
      { name: "Offer", status: "pending", date: "TBD" },
    ],
  },
  {
    id: 3,
    name: "Emily Johnson",
    jobTitle: "UX Designer",
    avatar: "/placeholder.svg?height=40&width=40",
    currentStage: 3, // Portfolio Review
    stages: [
      { name: "Application", status: "completed", date: "Jan 9" },
      { name: "HR Screening", status: "completed", date: "Jan 11" },
      { name: "Technical Interview", status: "completed", date: "Jan 13" },
      { name: "Portfolio Review", status: "current", date: "Jan 16" },
      { name: "Final Interview", status: "pending", date: "TBD" },
      { name: "Reference Check", status: "pending", date: "TBD" },
      { name: "Offer", status: "pending", date: "TBD" },
    ],
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Scheduled":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Completed":
      return "bg-green-100 text-green-800 border-green-200"
    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStageStatus = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500"
    case "current":
      return "bg-blue-500"
    case "pending":
      return "bg-gray-300"
    default:
      return "bg-gray-300"
  }
}

export default function InterviewsPage() {
  const [showScheduleModal, setShowScheduleModal] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">TalentHub</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-500 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/jobs" className="text-gray-500 hover:text-gray-900">
                Jobs & Matching
              </Link>
              <Link href="/candidates" className="text-gray-500 hover:text-gray-900">
                Candidates
              </Link>
              <Link href="/interviews" className="text-blue-600 font-medium">
                Interviews
              </Link>
              <Link href="/chat" className="text-gray-500 hover:text-gray-900">
                AI Assistant
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Interview Management</h2>
            <p className="text-gray-600">
              Schedule interviews and track candidate progress through the hiring pipeline
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowScheduleModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Interview
          </Button>
        </div>

        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="schedule">Interview Schedule</TabsTrigger>
            <TabsTrigger value="pipeline">Candidate Pipeline</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6">
            {/* Today's Interviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Interviews
                </CardTitle>
                <CardDescription>January 15, 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interviews
                    .filter((interview) => interview.date === "2024-01-15")
                    .map((interview) => (
                      <div
                        key={interview.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={interview.candidateAvatar || "/placeholder.svg"}
                              alt={interview.candidateName}
                            />
                            <AvatarFallback>
                              {interview.candidateName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-gray-900">{interview.candidateName}</h3>
                              <Badge className={getStatusColor(interview.status)}>{interview.status}</Badge>
                            </div>
                            <div className="text-sm text-gray-600 mb-1">{interview.jobTitle}</div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {interview.time}
                              </span>
                              <span className="flex items-center gap-1">
                                {interview.type === "Video Call" ? (
                                  <Video className="h-3 w-3" />
                                ) : interview.type === "Phone" ? (
                                  <Phone className="h-3 w-3" />
                                ) : (
                                  <MapPin className="h-3 w-3" />
                                )}
                                {interview.location}
                              </span>
                              <span>{interview.duration}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{interview.stage}</Badge>
                          <Button size="sm" variant="outline">
                            {interview.status === "Scheduled" ? "Join" : "View Notes"}
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Interviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Interviews
                </CardTitle>
                <CardDescription>Next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interviews
                    .filter((interview) => interview.date !== "2024-01-15")
                    .map((interview) => (
                      <div
                        key={interview.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={interview.candidateAvatar || "/placeholder.svg"}
                              alt={interview.candidateName}
                            />
                            <AvatarFallback>
                              {interview.candidateName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-gray-900">{interview.candidateName}</h3>
                              <Badge className={getStatusColor(interview.status)}>{interview.status}</Badge>
                            </div>
                            <div className="text-sm text-gray-600 mb-1">{interview.jobTitle}</div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(interview.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {interview.time}
                              </span>
                              <span className="flex items-center gap-1">
                                {interview.type === "Video Call" ? (
                                  <Video className="h-3 w-3" />
                                ) : interview.type === "Phone" ? (
                                  <Phone className="h-3 w-3" />
                                ) : (
                                  <MapPin className="h-3 w-3" />
                                )}
                                {interview.location}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{interview.stage}</Badge>
                          <Button size="sm" variant="outline">
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hiring Pipeline Overview</CardTitle>
                <CardDescription>Track candidates through each stage of the interview process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {candidatePipeline.map((candidate) => (
                    <div key={candidate.id} className="border rounded-lg p-6">
                      <div className="flex items-center gap-4 mb-6">
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
                          <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                          <div className="text-sm text-gray-600">{candidate.jobTitle}</div>
                        </div>
                        <div className="ml-auto">
                          <Progress value={(candidate.currentStage / 7) * 100} className="w-32" />
                          <div className="text-xs text-gray-500 mt-1">Stage {candidate.currentStage} of 7</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        {candidate.stages.map((stage, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div className={`w-4 h-4 rounded-full ${getStageStatus(stage.status)} mb-2`} />
                            <div className="text-xs text-center">
                              <div className="font-medium text-gray-900">{stage.name}</div>
                              <div className="text-gray-500">{stage.date}</div>
                            </div>
                            {index < candidate.stages.length - 1 && (
                              <div
                                className="w-full h-px bg-gray-200 absolute mt-2"
                                style={{ left: "50%", width: "100%" }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pipeline Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Average Time per Stage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>HR Screening</span>
                      <span className="font-medium">2 days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Technical Interview</span>
                      <span className="font-medium">3 days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Final Interview</span>
                      <span className="font-medium">5 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Stage Conversion Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Application → HR</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>HR → Technical</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Technical → Final</span>
                      <span className="font-medium">65%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Current Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>HR Screening</span>
                      <span className="font-medium">12 candidates</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Technical Interview</span>
                      <span className="font-medium">8 candidates</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Final Interview</span>
                      <span className="font-medium">3 candidates</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {showScheduleModal && <ScheduleInterviewModal onClose={() => setShowScheduleModal(false)} />}
      <ChatBot />
    </div>
  )
}
