"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const quickQuestions = [
  "What's the average time to hire?",
  "Show me top candidates for engineering roles",
  "Which positions have the highest application rates?",
  "What are the most in-demand skills?",
  "How many interviews are scheduled this week?",
]

const mockResponses: Record<string, string> = {
  "What's the average time to hire?":
    "Based on our current data, the average time to hire is 18 days. Engineering roles typically take 21 days, while sales positions average 14 days.",
  "Show me top candidates for engineering roles":
    "Our top engineering candidates include Sarah Chen (96% match, 6 years experience), Michael Rodriguez (94% match, 8 years experience), and David Kim (87% match, 5 years experience).",
  "Which positions have the highest application rates?":
    "UX Designer has the highest application rate with 31 applicants, followed by Senior Frontend Developer with 23 applicants and Data Scientist with 27 applicants.",
  "What are the most in-demand skills?":
    "The most in-demand skills currently are: React (45% of job postings), TypeScript (38%), Python (32%), and UX Design (28%).",
  "How many interviews are scheduled this week?":
    "There are 89 interviews scheduled for this week across all departments. Engineering has 34, Sales has 22, Marketing has 18, and Design has 15.",
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your recruitment assistant. I can help you with candidate information, hiring metrics, and answer questions about your recruitment process. What would you like to know?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
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
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const generateResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes("candidate") || lowerQuestion.includes("applicant")) {
      return "I can help you with candidate information. We currently have 1,247 total applicants across all positions. Would you like details about specific candidates or positions?"
    }

    if (lowerQuestion.includes("interview")) {
      return "We have 89 interviews scheduled this week. I can help you with interview scheduling, candidate preparation, or interview feedback tracking."
    }

    if (lowerQuestion.includes("hire") || lowerQuestion.includes("hiring")) {
      return "This month we've made 35 hires with an average time to hire of 18 days. Our hiring pipeline is performing well with a 28% increase from last month."
    }

    if (lowerQuestion.includes("job") || lowerQuestion.includes("position")) {
      return "We currently have 24 open positions across Engineering (12), Sales (6), Marketing (4), and Design (2). Which department would you like to know more about?"
    }

    return "I can help you with recruitment metrics, candidate information, job postings, and hiring analytics. Could you be more specific about what you'd like to know?"
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
    const event = { preventDefault: () => {} } as React.FormEvent
    handleSubmit(event)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl border-0 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-blue-600 text-white rounded-t-lg">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Recruitment Assistant
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-blue-700">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                {message.content}
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
              <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Quick questions:
            </div>
            <div className="flex flex-wrap gap-1">
              {quickQuestions.slice(0, 3).map((question, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50 text-xs"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about candidates, metrics, or hiring..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
