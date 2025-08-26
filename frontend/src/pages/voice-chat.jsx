"use client"
import React from "react"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useChat } from "../context/ChatContext"
import { useMessage } from "../context/MessageContext"
import { Sidebar } from "../components/sidebar"
import { MessageCircle, Mic, MicOff, ArrowLeft, Volume2, VolumeX, Menu, Globe, Sparkles } from "lucide-react"

export default function VoiceChat() {
  const navigate = useNavigate()
  const { chats, currentChat, createChat, deleteChat, archiveChat, selectChat } = useChat()
  const { messages, sendMessage, fetchMessages, resetMessages } = useMessage()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [botResponse, setBotResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [muted, setMuted] = useState(false)
  const [detectedLanguage, setDetectedLanguage] = useState("fr-FR") // Default language
  const [languageDisplay, setLanguageDisplay] = useState("")
  const [audioWaves, setAudioWaves] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState("") // Track the current question

  const recognitionRef = useRef(null)
  const synthRef = useRef(window.speechSynthesis)
  const waveIntervalRef = useRef(null)
  const messagesRef = useRef([]) // Reference to track messages

  // Language mapping for display and speech synthesis
  const languageMap = {
    ar: { name: "Arabe", code: "ar-SA" },
    fr: { name: "Français", code: "fr-FR" },
    en: { name: "Anglais", code: "en-US" },
    es: { name: "Espagnol", code: "es-ES" },
    de: { name: "Allemand", code: "de-DE" },
    it: { name: "Italien", code: "it-IT" },
    pt: { name: "Portugais", code: "pt-PT" },
    ru: { name: "Russe", code: "ru-RU" },
    zh: { name: "Chinois", code: "zh-CN" },
    ja: { name: "Japonais", code: "ja-JP" },
    ko: { name: "Coréen", code: "ko-KR" },
    nl: { name: "Néerlandais", code: "nl-NL" },
    pl: { name: "Polonais", code: "pl-PL" },
    tr: { name: "Turc", code: "tr-TR" },
  }

  // Keep messagesRef updated with the latest messages
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  // Generate random audio waves for visualization
  useEffect(() => {
    if (isListening) {
      // Generate initial waves
      setAudioWaves(Array.from({ length: 30 }, () => Math.random() * 100))

      // Update waves periodically
      waveIntervalRef.current = setInterval(() => {
        setAudioWaves((prev) =>
          prev.map((wave) => {
            const newHeight = wave + (Math.random() * 20 - 10)
            return Math.max(10, Math.min(100, newHeight)) // Keep between 10 and 100
          }),
        )
      }, 100)
    } else {
      clearInterval(waveIntervalRef.current)
    }

    return () => clearInterval(waveIntervalRef.current)
  }, [isListening])

  // Load current chat messages when component mounts
  useEffect(() => {
    if (currentChat) {
      fetchMessages(currentChat._id)
    }
  }, [currentChat])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = detectedLanguage // Use detected language or default

      recognition.onresult = (event) => {
        let interimTranscript = ""
        let finalTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript

            // Get language from the recognition result if available
            if (event.results[i][0].lang) {
              updateLanguage(event.results[i][0].lang)
            }
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }

        setTranscript(finalTranscript || interimTranscript)
      }

      recognition.onend = () => {
        if (isListening) {
          recognition.start()
        }
      }

      recognition.onerror = (event) => {
        console.error("Erreur de reconnaissance vocale:", event.error)
        setIsListening(false)
      }

      recognitionRef.current = recognition
    } else {
      console.warn("La reconnaissance vocale n'est pas supportée par ce navigateur.")
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [detectedLanguage])

  // Function to detect language from text
  const detectLanguage = (text) => {
    // Simple language detection based on character sets and common words
    // This is a basic implementation - for production, use a proper language detection library

    // Check for Arabic script
    if (/[\u0600-\u06FF]/.test(text)) {
      return "ar-SA"
    }

    // Check for common French words
    const frenchWords = [
      "je",
      "tu",
      "il",
      "elle",
      "nous",
      "vous",
      "ils",
      "elles",
      "bonjour",
      "merci",
      "oui",
      "non",
      "le",
      "la",
      "les",
      "un",
      "une",
      "des",
      "et",
      "ou",
      "mais",
      "donc",
      "car",
      "pour",
      "avec",
      "sans",
      "dans",
      "sur",
      "sous",
      "comment",
      "pourquoi",
      "quand",
      "où",
    ]
    const words = text.toLowerCase().split(/\s+/)
    const frenchWordCount = words.filter((word) => frenchWords.includes(word)).length

    // Check for common English words
    const englishWords = [
      "i",
      "you",
      "he",
      "she",
      "we",
      "they",
      "hello",
      "thank",
      "yes",
      "no",
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "so",
      "because",
      "for",
      "with",
      "without",
      "in",
      "on",
      "under",
      "how",
      "why",
      "when",
      "where",
    ]
    const englishWordCount = words.filter((word) => englishWords.includes(word)).length

    // Determine language based on word count
    if (frenchWordCount > englishWordCount) {
      return "fr-FR"
    } else if (englishWordCount > frenchWordCount) {
      return "en-US"
    }

    // Default to French if can't determine
    return "fr-FR"
  }

  // Update language based on detection
  const updateLanguage = (langCode) => {
    // Restrict to only French or English as requested
    const langPrefix = langCode.split("-")[0].toLowerCase()

    if (langPrefix === "fr") {
      setDetectedLanguage("fr-FR")
      setLanguageDisplay("Français")
    } else {
      // Default to English for any non-French language
      setDetectedLanguage("en-US")
      setLanguageDisplay("Anglais")
    }

    // Update recognition language
    if (recognitionRef.current) {
      recognitionRef.current.lang = langCode
    }
  }

  // Handle speech recognition toggle
  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)

      // If there's a transcript, send it as a message
      if (transcript.trim()) {
        // Detect language from transcript
        const detectedLang = detectLanguage(transcript)
        updateLanguage(detectedLang)

        // Save the current question before sending
        setCurrentQuestion(transcript)
        handleSendMessage(transcript)
        setTranscript("")
      }
    } else {
      setTranscript("")
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  // Handle sending message and getting response
  const handleSendMessage = async (message) => {
    if (!message.trim()) return

    try {
      setIsLoading(true)

      // Store the message length before sending to track new messages
      const previousMessagesLength = messagesRef.current.length

      // If no active chat, create a new one
      if (!currentChat) {
        const newChat = await createChat("Conversation vocale")

        // Add language instruction to the message
        const langInstruction = `${message} (Please respond in ${detectedLanguage === "fr-FR" ? "French" : "English"} only)`
        await sendMessage(newChat._id, langInstruction)
      } else {
        // Add language instruction to the message
        const langInstruction = `${message} (Please respond in ${detectedLanguage === "fr-FR" ? "French" : "English"} only)`
        await sendMessage(currentChat._id, langInstruction)
      }

      // Wait for the response to be added to messages
      // This is a simple approach - you might need to adjust based on your API
      setTimeout(async () => {
        // Check if we have new messages
        if (messagesRef.current.length > previousMessagesLength) {
          // Find the latest assistant message that came after our question
          const assistantMessages = messagesRef.current.filter(
            (msg) => msg.role === "assistant" && messagesRef.current.indexOf(msg) > previousMessagesLength - 1,
          )

          if (assistantMessages.length > 0) {
            const latestAssistantMessage = assistantMessages[assistantMessages.length - 1]

            // Don't set bot response text at all - just speak it
            if (!muted) {
              speakText(latestAssistantMessage.content)
            }
          }
        }

        setIsLoading(false)
      }, 1000) // Adjust timeout as needed based on your API response time
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error)
      setIsLoading(false)
    }
  }

  // Text-to-speech function
  const speakText = (text) => {
    if (synthRef.current && !muted) {
      synthRef.current.cancel() // Stop any current speech

      const utterance = new SpeechSynthesisUtterance(text)

      // Use detected language for speech synthesis
      utterance.lang = detectedLanguage
      utterance.rate = 1.0
      utterance.pitch = 1.0

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => {
        setIsSpeaking(false)
      }
      utterance.onerror = (event) => {
        console.error("Erreur de synthèse vocale:", event.error)
        setIsSpeaking(false)
      }

      synthRef.current.speak(utterance)
    }
  }

  // Toggle mute for speech synthesis
  const toggleMute = () => {
    if (isSpeaking && !muted) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
    setMuted(!muted)
  }

  // Toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  // Create new chat
  const createNewChat = async () => {
    try {
      const newChat = await createChat("Conversation vocale")
      setSidebarOpen(false)
    } catch (error) {
      console.error("Erreur lors de la création d'une nouvelle conversation:", error)
    }
  }

  // Switch to another chat
  const switchChat = async (chatId) => {
    try {
      await selectChat(chatId)
      setSidebarOpen(false)
    } catch (error) {
      console.error("Erreur lors du changement de conversation:", error)
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 text-gray-200">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 transform backdrop-blur-lg bg-gray-900/80 border-r border-purple-900/30 transition-all duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          onClose={() => setSidebarOpen(false)}
          chats={chats}
          currentChat={currentChat}
          onChatSelect={switchChat}
          onNewChat={createNewChat}
          onDeleteChat={deleteChat}
          onArchiveChat={archiveChat}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-purple-900/30 bg-gray-900/50 backdrop-blur-md p-4">
          <button
            onClick={toggleSidebar}
            className="rounded-md p-2 text-gray-400 hover:bg-purple-900/20 hover:text-purple-300 transition-all duration-200 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 flex-1 text-center">
            Mode Vocal
          </h1>
          <button
            onClick={() => navigate("/chat")}
            className="rounded-md p-2 text-gray-400 hover:bg-purple-900/20 hover:text-purple-300 transition-all duration-200"
            title="Retour au chat texte"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </header>

        {/* Voice Chat Interface */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl"></div>
          </div>

          <div className="w-full max-w-md mx-auto flex flex-col items-center">
            {/* Language Display */}
            {languageDisplay && (
              <div className="mb-6 flex items-center gap-2 bg-gray-800/40 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-500/20 shadow-lg">
                <Globe className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">{languageDisplay}</span>
              </div>
            )}

            {/* Voice Visualization */}
            <div className="mb-10 relative">
              <div
                className={`w-48 h-48 rounded-full flex items-center justify-center bg-gradient-to-br ${
                  isListening
                    ? "from-purple-900/40 to-blue-900/40 border-purple-500/50"
                    : "from-gray-800/40 to-gray-900/40 border-gray-700/30"
                } backdrop-blur-md border-4 shadow-lg transition-all duration-300`}
              >
                <div
                  className={`w-36 h-36 rounded-full flex items-center justify-center ${
                    isListening ? "bg-gradient-to-br from-purple-800/30 to-blue-800/30" : "bg-gray-900/50"
                  } transition-all duration-300`}
                >
                  {isListening ? (
                    <div className="relative">
                      <Mic className="h-16 w-16 text-purple-300 animate-pulse z-10 relative" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="h-20 w-20 text-purple-500/30 animate-spin-slow" />
                      </div>
                    </div>
                  ) : (
                    <Mic className="h-16 w-16 text-gray-500 transition-all duration-300" />
                  )}
                </div>
              </div>

              {/* Audio waves visualization */}
              {isListening && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-end justify-center gap-[2px] h-16 w-64">
                  {audioWaves.map((height, index) => (
                    <div
                      key={index}
                      className="w-1 bg-gradient-to-t from-purple-500 to-blue-400 rounded-full"
                      style={{
                        height: `${height * 0.16}rem`,
                        opacity: 0.7,
                        transition: "height 100ms ease",
                      }}
                    ></div>
                  ))}
                </div>
              )}
            </div>

            {/* Status Text */}
            <div className="text-center mb-8 min-h-[120px]">
              {isListening ? (
                <p className="text-lg font-medium text-purple-300 flex items-center justify-center gap-2">
                  <span className="inline-block w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
                  Je vous écoute...
                </p>
              ) : isLoading ? (
                <p className="text-lg font-medium text-blue-300 flex items-center justify-center gap-2">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                  Traitement en cours...
                </p>
              ) : isSpeaking ? (
                <p className="text-lg font-medium text-green-300 flex items-center justify-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                  Je vous réponds...
                </p>
              ) : (
                <p className="text-lg font-medium text-gray-400">Appuyez sur le bouton pour parler</p>
              )}

              {/* Transcript */}
              {transcript && (
                <div className="mt-4 p-4 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl max-w-md mx-auto shadow-lg transform transition-all duration-200 hover:scale-[1.02]">
                  <p className="text-gray-200">{transcript}</p>
                </div>
              )}

              {/* Current Question (when waiting for response) */}
              {currentQuestion && isLoading && (
                <div className="mt-4 p-4 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl max-w-md mx-auto shadow-lg">
                  <p className="text-sm text-gray-400 mb-1">Votre question:</p>
                  <p className="text-gray-200">{currentQuestion}</p>
                </div>
              )}

              {/* Removed bot response text display completely */}
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={toggleMute}
                className={`p-4 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg ${
                  muted
                    ? "bg-red-900/30 text-red-400 border border-red-700/30"
                    : "bg-gray-800/40 text-gray-300 border border-gray-700/30 hover:bg-gray-700/40"
                }`}
                title={muted ? "Activer le son" : "Couper le son"}
              >
                {muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              </button>

              <button
                onClick={toggleListening}
                className={`p-6 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg transform hover:scale-105 ${
                  isListening
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white border border-red-500/50"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 text-white border border-purple-500/50"
                }`}
                disabled={isLoading || isSpeaking}
              >
                {isListening ? (
                  <MicOff className="h-8 w-8 drop-shadow-lg" />
                ) : (
                  <Mic className="h-8 w-8 drop-shadow-lg" />
                )}
                <span className="absolute inset-0 rounded-full bg-white/10 animate-pulse-slow opacity-0"></span>
              </button>

              <button
                onClick={() => navigate("/chat")}
                className="p-4 rounded-full bg-gray-800/40 text-gray-300 border border-gray-700/30 backdrop-blur-sm hover:bg-gray-700/40 transition-all duration-300 shadow-lg"
                title="Retour au chat texte"
              >
                <MessageCircle className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.3;
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  )
}
