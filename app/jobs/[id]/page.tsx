import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Building, MapPin, Clock, Users, Star, Download, Mail, Calendar, TrendingUp, Briefcase } from "lucide-react"
import Link from "next/link"
import { ChatBot } from "@/components/chat-bot"

// Mock data for the job and candidates
const jobData = {
  id: 1,
  title: "Senior Frontend Developer",
  department: "Engineering",
  location: "San Francisco, CA",
  type: "Full-time",
  salary: "$120,000 - $160,000",
  posted: "2 days ago",
  status: "Active",
  description: `We are looking for an experienced Senior Frontend Developer to join our growing engineering team. You will be responsible for building and maintaining our web applications using modern technologies like React, TypeScript, and Next.js.

Key Responsibilities:
• Develop and maintain high-quality web applications
• Collaborate with designers and backend developers
• Optimize applications for maximum speed and scalability
• Mentor junior developers and contribute to code reviews
• Stay up-to-date with emerging technologies and best practices`,
  requirements: [
    "5+ years of experience in frontend development",
    "Expert knowledge of React and TypeScript",
    "Experience with Next.js and modern build tools",
    "Strong understanding of responsive design",
    "Experience with testing frameworks (Jest, Cypress)",
    "Knowledge of GraphQL and REST APIs",
    "Bachelor's degree in Computer Science or equivalent",
  ],
  benefits: [
    "Competitive salary and equity package",
    "Comprehensive health, dental, and vision insurance",
    "Flexible work arrangements and remote options",
    "Professional development budget",
    "Unlimited PTO policy",
    "Modern office with free meals and snacks",
  ],
}

const candidates = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    experience: "6 years",
    currentRole: "Senior Frontend Developer at TechCorp",
    matchScore: 96,
    avatar: "/placeholder.svg?height=40&width=40",
    skills: ["React", "TypeScript", "Next.js", "GraphQL", "Jest", "Figma"],
    education: "BS Computer Science, Stanford University",
    summary:
      "Passionate frontend developer with 6 years of experience building scalable web applications. Led multiple successful product launches and mentored junior developers.",
    appliedDate: "1 day ago",
    status: "New",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    email: "michael.r@email.com",
    phone: "+1 (555) 234-5678",
    location: "San Jose, CA",
    experience: "8 years",
    currentRole: "Lead Frontend Engineer at StartupXYZ",
    matchScore: 94,
    avatar: "/placeholder.svg?height=40&width=40",
    skills: ["React", "TypeScript", "Vue.js", "Node.js", "AWS", "Docker"],
    education: "MS Computer Science, UC Berkeley",
    summary:
      "Full-stack developer with strong frontend expertise. Experience leading teams and architecting complex applications.",
    appliedDate: "2 days ago",
    status: "Reviewed",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Johnson",
    email: "emily.johnson@email.com",
    phone: "+1 (555) 345-6789",
    location: "Oakland, CA",
    experience: "4 years",
    currentRole: "Frontend Developer at DesignCo",
    matchScore: 89,
    avatar: "/placeholder.svg?height=40&width=40",
    skills: ["React", "JavaScript", "CSS", "Sass", "Webpack", "Git"],
    education: "BS Web Development, San Francisco State",
    summary:
      "Creative frontend developer with strong design sensibilities. Specializes in creating beautiful, user-friendly interfaces.",
    appliedDate: "3 days ago",
    status: "Interview Scheduled",
    rating: 4,
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "+1 (555) 456-7890",
    location: "Palo Alto, CA",
    experience: "5 years",
    currentRole: "Senior Developer at BigTech",
    matchScore: 87,
    avatar: "/placeholder.svg?height=40&width=40",
    skills: ["React", "TypeScript", "Redux", "Testing", "CI/CD", "Agile"],
    education: "BS Computer Engineering, UCLA",
    summary:
      "Detail-oriented developer with expertise in testing and quality assurance. Strong advocate for clean code and best practices.",
    appliedDate: "4 days ago",
    status: "Reviewed",
    rating: 4,
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

export default function JobDetailPage({ params }: { params: { id: string } }) {
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
        {/* Job Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/jobs" className="hover:text-gray-700">
              Jobs
            </Link>
            <span>/</span>
            <span>{jobData.title}</span>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{jobData.title}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  {jobData.department}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {jobData.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Posted {jobData.posted}
                </span>
                <Badge variant="default">{jobData.status}</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{candidates.length}</div>
              <div className="text-sm text-gray-500">Total Applicants</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="candidates" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="candidates">Candidates ({candidates.length})</TabsTrigger>
                <TabsTrigger value="job-details">Job Details</TabsTrigger>
              </TabsList>

              <TabsContent value="candidates" className="space-y-6">
                <div className="space-y-4">
                  {candidates.map((candidate) => (
                    <Card key={candidate.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
                              <AvatarFallback>
                                {candidate.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                                <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="h-4 w-4 text-green-600" />
                                  <span className="text-sm font-medium text-green-600">
                                    {candidate.matchScore}% Match
                                  </span>
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
                                  <Calendar className="h-3 w-3" />
                                  Applied {candidate.appliedDate}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{candidate.summary}</p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {candidate.skills.slice(0, 4).map((skill, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {candidate.skills.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{candidate.skills.length - 4} more
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1 mb-2">
                                <span className="text-sm text-gray-500">Match Score:</span>
                                <Progress value={candidate.matchScore} className="w-24 h-2" />
                                <span className="text-sm font-medium">{candidate.matchScore}%</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < candidate.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <Button size="sm" variant="outline">
                              <Mail className="h-4 w-4 mr-2" />
                              Contact
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              Resume
                            </Button>
                            <Button size="sm">Schedule Interview</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="job-details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-line text-gray-700">{jobData.description}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {jobData.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Benefits & Perks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {jobData.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Salary Range</div>
                  <div className="font-semibold">{jobData.salary}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Employment Type</div>
                  <div className="font-semibold">{jobData.type}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-semibold">{jobData.location}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Department</div>
                  <div className="font-semibold">{jobData.department}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Applications</span>
                  <span className="font-semibold">{candidates.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">New Applications</span>
                  <span className="font-semibold">{candidates.filter((c) => c.status === "New").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Interviews Scheduled</span>
                  <span className="font-semibold">
                    {candidates.filter((c) => c.status === "Interview Scheduled").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Average Match Score</span>
                  <span className="font-semibold">
                    {Math.round(candidates.reduce((acc, c) => acc + c.matchScore, 0) / candidates.length)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Bulk Actions
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export Candidates
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Interviews
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ChatBot />
    </div>
  )
}
