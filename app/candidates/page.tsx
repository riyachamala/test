"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { UploadResumeModal } from '../../components/upload-resume-modal';
import { AddCandidateModal } from '../../components/add-candidate-modal';

import {
  Search,
  Filter,
  Building,
  Upload,
  Plus,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Star,
  Calendar,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { ChatBot } from "@/components/chat-bot"
import { ReviewApplicationModal } from "@/components/review-application-modal"

const initialCandidates = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    experience: "6 years",
    currentRole: "Senior Frontend Developer at TechCorp",
    skills: ["React", "TypeScript", "Next.js", "GraphQL", "Jest", "Figma"],
    education: "BS Computer Science, Stanford University",
    summary: "Passionate frontend developer with 6 years of experience building scalable web applications.",
    appliedDate: "1 day ago",
    status: "New",
    avatar: "/placeholder.svg?height=40&width=40",
    matchingJobs: ["Senior Frontend Developer", "Lead React Developer"],
    rating: 5,
    salary: "$140,000",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    email: "michael.r@email.com",
    phone: "+1 (555) 234-5678",
    location: "San Jose, CA",
    experience: "8 years",
    currentRole: "Lead Frontend Engineer at StartupXYZ",
    skills: ["React", "TypeScript", "Vue.js", "Node.js", "AWS", "Docker"],
    education: "MS Computer Science, UC Berkeley",
    summary: "Full-stack developer with strong frontend expertise and team leadership experience.",
    appliedDate: "2 days ago",
    status: "Reviewed",
    avatar: "/placeholder.svg?height=40&width=40",
    matchingJobs: ["Senior Frontend Developer", "Engineering Manager"],
    rating: 5,
    salary: "$155,000",
  },
  {
    id: 3,
    name: "Emily Johnson",
    email: "emily.johnson@email.com",
    phone: "+1 (555) 345-6789",
    location: "Oakland, CA",
    experience: "4 years",
    currentRole: "Frontend Developer at DesignCo",
    skills: ["React", "JavaScript", "CSS", "Sass", "Webpack", "Git"],
    education: "BS Web Development, San Francisco State",
    summary: "Creative frontend developer with strong design sensibilities and user-focused approach.",
    appliedDate: "3 days ago",
    status: "Interview Scheduled",
    avatar: "/placeholder.svg?height=40&width=40",
    matchingJobs: ["UX Designer", "Frontend Developer"],
    rating: 4,
    salary: "$95,000",
  },
  {
    id: 4,
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    phone: "+1 (555) 456-7890",
    location: "Boston, MA",
    experience: "8 years",
    currentRole: "Senior Data Scientist at DataCorp",
    skills: ["Python", "Machine Learning", "TensorFlow", "Statistics", "SQL", "R"],
    education: "PhD Data Science, MIT",
    summary: "Experienced data scientist with expertise in machine learning and statistical analysis.",
    appliedDate: "5 days ago",
    status: "Reviewed",
    avatar: "/placeholder.svg?height=40&width=40",
    matchingJobs: ["Data Scientist", "ML Engineer"],
    rating: 5,
    salary: "$165,000",
  },
  {
    id: 5,
    name: "Alex Thompson",
    email: "alex.thompson@email.com",
    phone: "+1 (555) 567-8901",
    location: "New York, NY",
    experience: "4 years",
    currentRole: "Product Marketing Manager at SaasCorp",
    skills: ["Product Marketing", "B2B SaaS", "Analytics", "Go-to-Market", "Content Strategy"],
    education: "MBA Marketing, NYU Stern",
    summary: "Strategic product marketer with proven track record in B2B SaaS growth.",
    appliedDate: "1 week ago",
    status: "New",
    avatar: "/placeholder.svg?height=40&width=40",
    matchingJobs: ["Product Marketing Manager", "Growth Marketing Manager"],
    rating: 4,
    salary: "$110,000",
  },
  {
    id: 6,
    name: "Marcus Johnson",
    email: "marcus.johnson@email.com",
    phone: "+1 (555) 678-9012",
    location: "Remote",
    experience: "5 years",
    currentRole: "Senior UX Designer at DesignStudio",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Usability Testing"],
    education: "BFA Design, RISD",
    summary: "User-centered designer with expertise in creating intuitive digital experiences.",
    appliedDate: "4 days ago",
    status: "Interview Scheduled",
    avatar: "/placeholder.svg?height=40&width=40",
    matchingJobs: ["UX Designer", "Product Designer"],
    rating: 5,
    salary: "$125,000",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "New":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Reviewed":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Interview Scheduled":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState(initialCandidates)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<(typeof initialCandidates)[0] | null>(null)

  const handleStatusUpdate = (candidateId: number, newStatus: string, notes?: string) => {
    setCandidates((prev) =>
      prev
        .map((candidate) => (candidate.id === candidateId ? { ...candidate, status: newStatus } : candidate))
        .filter(
          (candidate) =>
            // Remove rejected candidates
            !(candidate.id === candidateId && newStatus === "Rejected"),
        ),
    )

    console.log("Status update:", { candidateId, newStatus, notes, timestamp: new Date().toISOString() })
  }

  const handleQuickReject = (candidateId: number) => {
    setCandidates((prev) => prev.filter((candidate) => candidate.id !== candidateId))
    console.log("Quick reject:", { candidateId, timestamp: new Date().toISOString() })
  }

  const handleReviewApplication = (candidate: (typeof initialCandidates)[0]) => {
    setSelectedCandidate(candidate)
    setShowReviewModal(true)
  }

  const renderCandidateCard = (candidate: (typeof initialCandidates)[0], showQuickActions = false) => (
    <Card key={candidate.id} className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <Avatar className="h-16 w-16">
              <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
              <AvatarFallback className="text-lg">
                {candidate.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{candidate.name}</h3>
                <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < candidate.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-2">{candidate.currentRole}</div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {candidate.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {candidate.experience}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {candidate.salary}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Applied {candidate.appliedDate}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{candidate.summary}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {candidate.skills.slice(0, 5).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {candidate.skills.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{candidate.skills.length - 5} more
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Matching Jobs: </span>
                {candidate.matchingJobs.join(", ")}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 ml-6">
            {showQuickActions && (
              <>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleReviewApplication(candidate)}
                >
                  Review Application
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleQuickReject(candidate.id)}>
                  Quick Reject
                </Button>
              </>
            )}
            {!showQuickActions && (
              <>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </div>
                <Button size="sm">View Profile</Button>
                <Button size="sm" variant="outline">
                  Schedule Interview
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

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
              <Link href="/candidates" className="text-blue-600 font-medium">
                Candidates
              </Link>
              <Link href="/interviews" className="text-gray-500 hover:text-gray-900">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Candidate Management</h2>
            <p className="text-gray-600">View, manage, and upload candidate profiles</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowUploadModal(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Resume
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Candidate
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
              <TabsTrigger value="all">All Candidates</TabsTrigger>
              <TabsTrigger value="new">New ({candidates.filter((c) => c.status === "New").length})</TabsTrigger>
              <TabsTrigger value="reviewed">
                Reviewed ({candidates.filter((c) => c.status === "Reviewed").length})
              </TabsTrigger>
              <TabsTrigger value="interviews">
                Interviews ({candidates.filter((c) => c.status === "Interview Scheduled").length})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search candidates..." className="pl-10" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Skills" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Skills</SelectItem>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="sf">San Francisco</SelectItem>
                      <SelectItem value="ny">New York</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <TabsContent value="all" className="space-y-6">
            <div className="grid gap-6">{candidates.map((candidate) => renderCandidateCard(candidate))}</div>
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            <div className="grid gap-6">
              {candidates.filter((c) => c.status === "New").map((candidate) => renderCandidateCard(candidate, true))}
            </div>
          </TabsContent>

          <TabsContent value="reviewed" className="space-y-6">
            <div className="grid gap-6">
              {candidates.filter((c) => c.status === "Reviewed").map((candidate) => renderCandidateCard(candidate))}
            </div>
          </TabsContent>

          <TabsContent value="interviews" className="space-y-6">
            <div className="grid gap-6">
              {candidates
                .filter((c) => c.status === "Interview Scheduled")
                .map((candidate) => renderCandidateCard(candidate))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {showUploadModal && <UploadResumeModal onClose={() => setShowUploadModal(false)} />}
      {showAddModal && <AddCandidateModal onClose={() => setShowAddModal(false)} />}
      {showReviewModal && selectedCandidate && (
        <ReviewApplicationModal
          candidate={selectedCandidate}
          onClose={() => setShowReviewModal(false)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
      <ChatBot />
    </div>
  )
}
