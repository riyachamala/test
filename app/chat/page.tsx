"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, Bot, User, Sparkles, Building, TrendingUp, Users, Target } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const quickQuestions = [
  "What metrics should I use to evaluate frontend developers?",
  "How do I assess cultural fit during interviews?",
  "What are red flags to look for in candidate resumes?",
  "How can I improve our time-to-hire metrics?",
  "What questions should I ask data science candidates?",
  "How do I evaluate soft skills effectively?",
  "What's the best way to structure technical interviews?",
  "How can I reduce bias in our hiring process?",
]

const categories = [
  {
    title: "Candidate Evaluation",
    icon: Users,
    questions: [
      "What metrics should I use to evaluate frontend developers?",
      "How do I assess problem-solving skills?",
      "What are the key indicators of a strong candidate?",
      "How can I evaluate leadership potential?",
    ],
  },
  {
    title: "Interview Strategies",
    icon: MessageCircle,
    questions: [
      "What questions should I ask data science candidates?",
      "How do I structure behavioral interviews?",
      "What's the best way to conduct technical assessments?",
      "How can I make candidates feel comfortable?",
    ],
  },
  {
    title: "Hiring Metrics",
    icon: TrendingUp,
    questions: [
      "How can I improve our time-to-hire metrics?",
      "What's a good candidate-to-hire ratio?",
      "How do I measure interview effectiveness?",
      "What KPIs should I track for recruitment?",
    ],
  },
  {
    title: "Best Practices",
    icon: Target,
    questions: [
      "How can I reduce bias in our hiring process?",
      "What are red flags to look for in resumes?",
      "How do I assess cultural fit?",
      "What makes a great job description?",
    ],
  },
]

const mockResponses: Record<string, string> = {
  "What metrics should I use to evaluate frontend developers?":
    "For frontend developers, focus on these key metrics:\n\n• **Technical Skills**: React/Vue proficiency, JavaScript fundamentals, CSS expertise\n• **Code Quality**: Clean, maintainable code, proper testing practices\n• **Performance Awareness**: Understanding of web performance, optimization techniques\n• **User Experience**: Attention to detail, accessibility knowledge\n• **Collaboration**: Ability to work with designers and backend developers\n• **Problem-Solving**: Debugging skills, logical thinking approach\n\nConsider using coding challenges that mirror real work scenarios rather than abstract algorithms.",

  "How do I assess cultural fit during interviews?":
    "Assessing cultural fit requires a structured approach:\n\n• **Values Alignment**: Ask about situations where they demonstrated company values\n• **Work Style**: Understand their preferred communication and collaboration methods\n• **Adaptability**: Explore how they handle change and ambiguity\n• **Growth Mindset**: Look for curiosity, learning orientation, and feedback receptiveness\n• **Team Dynamics**: Ask about past team experiences and conflict resolution\n\n⚠️ **Important**: Focus on work-related cultural aspects, not personal characteristics that could introduce bias.",

  "What are red flags to look for in candidate resumes?":
    "Key red flags to watch for:\n\n• **Frequent Job Changes**: Multiple short tenures without clear progression\n• **Employment Gaps**: Unexplained periods without work or education\n• **Skill Inflation**: Claims of expertise in too many diverse technologies\n• **Vague Descriptions**: Lack of specific achievements or quantifiable results\n• **Inconsistent Information**: Dates, titles, or details that don't align\n• **Poor Communication**: Spelling errors, unclear formatting, unprofessional email\n\nHowever, always give candidates a chance to explain - there may be valid reasons behind apparent red flags.",

  "How can I improve our time-to-hire metrics?":
    "To reduce time-to-hire:\n\n• **Streamline Process**: Eliminate unnecessary interview rounds\n• **Parallel Processing**: Conduct reference checks while scheduling final interviews\n• **Clear Requirements**: Define must-haves vs nice-to-haves upfront\n• **Interview Training**: Ensure interviewers can make quick, confident decisions\n• **Technology**: Use ATS automation and scheduling tools\n• **Pipeline Management**: Maintain relationships with passive candidates\n• **Quick Feedback**: Establish 24-48 hour decision timelines\n\nCurrent industry average is 23 days - aim for 15-18 days for competitive advantage.",

  "What questions should I ask data science candidates?":
    "Essential data science interview questions:\n\n**Technical:**\n• How do you handle missing data in datasets?\n• Explain the bias-variance tradeoff\n• When would you use supervised vs unsupervised learning?\n\n**Practical:**\n• Walk me through a recent project from problem to solution\n• How do you validate model performance?\n• Describe your approach to feature engineering\n\n**Business Acumen:**\n• How do you communicate complex findings to non-technical stakeholders?\n• How do you ensure your models are ethical and unbiased?\n\nInclude a practical exercise with real data they might encounter in the role.",

  "How do I evaluate soft skills effectively?":
    "Effective soft skills evaluation techniques:\n\n• **Behavioral Questions**: Use STAR method (Situation, Task, Action, Result)\n• **Scenario-Based**: Present realistic workplace challenges\n• **Active Listening**: Pay attention to how they listen and respond\n• **Communication Style**: Observe clarity, empathy, and adaptability\n• **Team Exercises**: Group interviews or collaborative problem-solving\n• **Reference Checks**: Ask specific questions about soft skills\n• **Multiple Perspectives**: Have different team members assess the same skills\n\nFocus on skills most critical for the role - leadership, collaboration, adaptability, etc.",
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI recruitment consultant. I can help you with candidate evaluation strategies, interview best practices, hiring metrics, and recruitment insights. What would you like to explore today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      const response = mockResponses[input] || generateResponse(input)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const generateResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes("interview") || lowerQuestion.includes("question")) {
      return "Great question about interviews! Here are some key strategies:\n\n• **Structured Approach**: Use consistent questions across candidates\n• **Behavioral Focus**: Ask about past experiences and specific examples\n• **Role-Specific**: Tailor questions to the actual job requirements\n• **Two-Way**: Allow time for candidate questions\n• **Diverse Panel**: Include multiple perspectives in the process\n\nWould you like me to elaborate on any specific aspect of interviewing?"
    }

    if (lowerQuestion.includes("metric") || lowerQuestion.includes("measure")) {
      return "Key recruitment metrics to track:\n\n• **Time-to-Hire**: Average days from job posting to offer acceptance\n• **Quality of Hire**: Performance ratings of new hires after 6-12 months\n• **Source Effectiveness**: Which channels bring the best candidates\n• **Candidate Experience**: Feedback scores from applicants\n• **Offer Acceptance Rate**: Percentage of offers accepted\n• **Cost-per-Hire**: Total recruitment costs divided by number of hires\n\nWhich specific metric would you like to dive deeper into?"
    }

    if (lowerQuestion.includes("bias") || lowerQuestion.includes("diversity")) {
      return "Reducing bias in hiring is crucial. Here's how:\n\n• **Structured Interviews**: Use standardized questions and scoring\n• **Diverse Interview Panels**: Include people from different backgrounds\n• **Blind Resume Reviews**: Focus on skills and experience first\n• **Inclusive Job Descriptions**: Use neutral language and avoid unnecessary requirements\n• **Bias Training**: Educate hiring managers on unconscious bias\n• **Data Tracking**: Monitor diversity metrics throughout the funnel\n\nWhat specific area of bias reduction interests you most?"
    }

    return "I'd be happy to help with that! Could you be more specific about what aspect of recruitment you'd like to explore? I can provide insights on candidate evaluation, interview techniques, hiring metrics, or recruitment best practices."
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
    const event = { preventDefault: () => {} } as React.FormEvent
    handleSubmit(event)
  }

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
              <Link href="/chat" className="text-blue-600 font-medium">
                AI Assistant
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">AI Recruitment Assistant</h2>
              <p className="text-gray-600">
                Get expert guidance on candidate evaluation, interview strategies, and hiring best practices
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-280px)]">
          {/* Chat Interface */}
          <div className="lg:col-span-3 h-full">
            <Card className="h-full flex flex-col">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Bot className="h-5 w-5 text-blue-600" />
                  </div>
                  Recruitment Consultant
                  <Badge variant="outline" className="ml-auto">
                    Online
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                {/* Messages */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-6 space-y-4"
                  style={{ maxHeight: "calc(100vh - 400px)" }}
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-3 ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                            : "bg-gray-50 text-gray-900 border"
                        }`}
                      >
                        <div className="whitespace-pre-line">{message.content}</div>
                        <div className={`text-xs mt-2 ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      {message.role === "user" && (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="bg-gray-50 border rounded-lg px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-6 border-t bg-gray-50">
                  <form onSubmit={handleSubmit} className="flex gap-3">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about recruitment strategies, candidate evaluation, or interview techniques..."
                      className="flex-1 bg-white"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 h-full overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Quick Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categories.map((category, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-2 mb-2">
                      <category.icon className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-sm">{category.title}</span>
                    </div>
                    <div className="space-y-1">
                      {category.questions.slice(0, 2).map((question, qIndex) => (
                        <Badge
                          key={qIndex}
                          variant="outline"
                          className="cursor-pointer hover:bg-blue-50 text-xs block w-full text-left justify-start h-auto py-2 px-3"
                          onClick={() => handleQuickQuestion(question)}
                        >
                          {question}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickQuestions.slice(0, 4).map((question, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50 text-xs block w-full text-left justify-start h-auto py-2 px-3"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
