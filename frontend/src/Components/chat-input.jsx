"use client"
import React from "react"
import { useState, useEffect, useRef } from "react"
import { Send, Mic, Loader2, Globe } from "lucide-react"

export function ChatInput({ onSendMessage, isLoading }) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("auto") // "auto" pour détection automatique
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  const recognitionRef = useRef(null)
  const finalTranscriptRef = useRef("")
  const textareaRef = useRef(null)

  // Liste des langues supportées
  const languages = [
    { code: "auto", name: "Détection automatique" },
    { code: "ar-MA", name: "Arabe (Maroc)" },
    { code: "fr-FR", name: "Français" },
    { code: "en-US", name: "Anglais" },
  ]

  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true

      // Si "auto", la reconnaissance vocale détectera automatiquement la langue
      if (selectedLanguage !== "auto") {
        recognitionInstance.lang = selectedLanguage
      }

      recognitionInstance.onresult = (event) => {
        let interimTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += transcript
          } else {
            interimTranscript += transcript
          }
        }
        setMessage(finalTranscriptRef.current + interimTranscript)
      }

      recognitionInstance.onend = () => {
        setIsRecording(false)
      }

      recognitionInstance.onerror = (event) => {
        console.error("Erreur de reconnaissance vocale:", event.error)
        setIsRecording(false)
      }

      recognitionRef.current = recognitionInstance
    } else {
      console.warn("La reconnaissance vocale n'est pas supportée par ce navigateur.")
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [selectedLanguage]) // Recréer l'instance quand la langue change

  // Ajuster automatiquement la hauteur du textarea
  useEffect(() => {
    if (textareaRef.current) {
      // Réinitialiser la hauteur pour obtenir la hauteur correcte
      textareaRef.current.style.height = "auto"
      // Définir la nouvelle hauteur en fonction du contenu
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [message])

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage("")
      finalTranscriptRef.current = ""
      stopRecording()

      // Réinitialiser la hauteur du textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const toggleRecording = () => {
    if (!recognitionRef.current) return

    if (isRecording) {
      stopRecording()
    } else {
      setMessage("")
      finalTranscriptRef.current = ""

      // Recréer l'instance avec la langue sélectionnée
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true

      if (selectedLanguage !== "auto") {
        recognitionInstance.lang = selectedLanguage
      }

      recognitionInstance.onresult = (event) => {
        let interimTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscriptRef.current += transcript
          } else {
            interimTranscript += transcript
          }
        }
        setMessage(finalTranscriptRef.current + interimTranscript)
      }

      recognitionInstance.onend = () => {
        setIsRecording(false)
      }

      recognitionInstance.onerror = (event) => {
        console.error("Erreur de reconnaissance vocale:", event.error)
        setIsRecording(false)
      }

      recognitionRef.current = recognitionInstance
      recognitionRef.current.start()
      setIsRecording(true)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      {showLanguageSelector && (
        <div className="absolute bottom-full left-10 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 w-48">
          <div className="p-2 border-b border-gray-700">
            <h3 className="text-sm font-medium text-gray-300">Langue de reconnaissance</h3>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                className={`w-full text-left px-3 py-2 text-sm ${
                  selectedLanguage === lang.code
                    ? "bg-purple-700/30 text-purple-300"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
                onClick={() => {
                  setSelectedLanguage(lang.code)
                  setShowLanguageSelector(false)
                }}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center rounded-2xl border border-purple-600/50 bg-gray-900 focus-within:border-purple-500">
        <div className="flex items-center pl-3">
          <button
            type="button"
            onClick={() => setShowLanguageSelector(!showLanguageSelector)}
            className="mr-1 text-gray-400 hover:text-gray-300 transition-colors"
            title="Changer de langue"
          >
            <Globe className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={toggleRecording}
            className={`mr-1 ${isRecording ? "text-red-500 animate-pulse" : "text-gray-400 hover:text-gray-300"} transition-colors`}
            disabled={isLoading}
            title={isRecording ? "Arrêter l'enregistrement" : "Commencer l'enregistrement vocal"}
          >
            <Mic className="h-5 w-5" />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isRecording ? "Parlez maintenant..." : "Écrivez un message..."}
          className="flex-1 bg-transparent px-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none min-h-[40px] max-h-[120px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none overflow-auto"
          style={{
            direction: /[\u0600-\u06FF]/.test(message) ? "rtl" : "ltr",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
          rows={1}
        />

        <button
          type="submit"
          className="pr-3 text-gray-400 transition-colors hover:text-purple-400 disabled:opacity-50"
          disabled={!message.trim() || isLoading}
          title="Envoyer le message"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
      </div>

      {isRecording && (
        <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-red-400">
          Enregistrement en cours (
          {selectedLanguage === "auto" ? "détection auto" : languages.find((l) => l.code === selectedLanguage)?.name})
        </div>
      )}
    </form>
  )
}
