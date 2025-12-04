"use client"

import React, { useState, useEffect, useRef } from "react"
import { Send, Loader, ArrowDown } from "lucide-react"
import axios from "axios"

export default function ChatbotPage() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    {
      sender: "bot",
      text: "Bonjour! Je suis votre assistant spécialisé en énergie solaire, batteries, optimisation énergétique et LabVIEW. Comment puis-je vous aider ?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    setShowScrollButton(false)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userText = input
    setInput("")

    setMessages((prev) => [...prev, { sender: "user", text: userText }])
    setIsLoading(true)

    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `Tu es un assistant spécialisé EXCLUSIVEMENT dans :
- l'énergie solaire
- les panneaux photovoltaïques
- les batteries
- l'optimisation énergétique
- les transferts d'énergie
- l'analyse et prédiction basée sur des données CSV
- les systèmes LabVIEW liés à l'énergie
- LabVIEW en général (programmation, instrumentation, acquisition de données, contrôle de systèmes)
- MPIAS (Multi-Purpose Integrated Analysis System) pour l'analyse énergétique
Si la question n'est PAS liée à l'énergie ou LabVIEW → tu réponds seulement :
"Je suis un assistant spécialisé uniquement dans l'énergie solaire, les batteries, l'optimisation énergétique et LabVIEW. Comment puis-je vous aider dans ces domaines ?"
Tu réponds toujours en français.`,
            },
            { role: "user", content: userText },
          ],
          temperature: 0.7,
          max_tokens: 300,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      )

      const botText =
        response.data.choices?.[0]?.message?.content ||
        response.data?.choices?.[0]?.text ||
        "Désolé, je n'ai pas de réponse."

      setMessages((prev) => [...prev, { sender: "bot", text: botText }])
    } catch (error) {
      console.error(error)
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Une erreur est survenue lors de la génération de la réponse.",
        },
      ])
    }

    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 pb-24"
        style={{ scrollBehavior: "smooth" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl transition-all ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none shadow-md hover:shadow-lg"
                  : "bg-muted text-foreground border border-border/60 rounded-bl-none shadow-sm hover:shadow-md"
              }`}
            >
              <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-muted text-foreground border border-border/60 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-2 shadow-sm">
              <Loader className="w-4 h-4 animate-spin" />
              <p className="text-sm">Réflexion en cours...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-6 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 animate-fade-in"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      )}

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border/40 p-4 md:p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Posez votre question sur l'énergie ou LabVIEW..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-lg border border-border/60 bg-card focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent disabled:opacity-50 text-sm md:text-base transition-all"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
