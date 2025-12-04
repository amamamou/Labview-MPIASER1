"use client";

import React, { useState } from "react";
import axios from "axios";
import "./chatbot-component.css";

const ChatbotComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    {
      sender: "bot",
      text: "Bonjour! Je suis votre assistant spécialisé en énergie solaire, batteries, optimisation énergétique et LabVIEW. Comment puis-je vous aider ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput("");

    // add user message immediately for snappy UI
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setIsLoading(true);

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
      );

      const botText = response.data.choices?.[0]?.message?.content || response.data?.choices?.[0]?.text || "Désolé, je n'ai pas de réponse.";

      setMessages((prev) => [...prev, { sender: "bot", text: botText }]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Une erreur est survenue lors de la génération de la réponse.",
        },
      ]);
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div>
      <button
        className="chatbot-toggle"
        onClick={toggleChat}
        aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
        title="Assistant"
      >
        {/* robot svg */}
        <svg className="chatbot-toggle-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="8" cy="11" r="1.4" fill="currentColor" />
          <circle cx="16" cy="11" r="1.4" fill="currentColor" />
          <rect x="10" y="14" width="4" height="1.2" rx="0.6" fill="currentColor" />
          <rect x="6" y="4" width="3" height="2" rx="0.5" fill="currentColor" />
          <rect x="15" y="4" width="3" height="2" rx="0.5" fill="currentColor" />
        </svg>
      </button>

      {isOpen && (
        <div className="chatbot-container-main">
          <div className="chatbot-header-top">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="chatbot-avatar-icon">
                  <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1" />
                  <circle cx="9" cy="10" r="1.2" fill="currentColor" />
                  <circle cx="15" cy="10" r="1.2" fill="currentColor" />
                  <rect x="10" y="13" width="4" height="1" rx="0.5" fill="currentColor" />
                </svg>
              </div>
              <div>
                <div className="chatbot-title">Assistant Énergie & LabVIEW</div>
                <div className="chatbot-sub">Optimisation, diagnostics & programmation</div>
              </div>
            </div>

            <button className="chatbot-close-btn" onClick={toggleChat} aria-label="Fermer"> 
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="chatbot-messages-area">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-msg ${msg.sender === "user" ? "chatbot-msg-user" : "chatbot-msg-bot"}`}
              >
                <div className="chatbot-msg-inner">{msg.text}</div>
              </div>
            ))}

            {isLoading && (
              <div className="chatbot-msg chatbot-msg-bot">
                <div className="chatbot-msg-inner chatbot-typing">●●●</div>
              </div>
            )}
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question sur l'énergie ou LabVIEW..."
              className="chatbot-input-field"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              className="chatbot-send-btn primary-btn"
              disabled={isLoading || !input.trim()}
              aria-label="Envoyer le message"
            >
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotComponent;

