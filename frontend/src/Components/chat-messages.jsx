"use client"
import React from "react"
import { useEffect, useRef } from "react"
import { Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function ChatMessages({ messages, isLoading }) {
  const messagesEndRef = useRef(null)

  // Fonction pour faire défiler vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Faire défiler vers le bas lorsque les messages changent
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Formater la date pour l'affichage
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="max-w-md text-center">
            <h2 className="mb-2 text-xl font-semibold text-gray-300">Bienvenue sur ChatBot</h2>
            <p className="text-gray-400">
              Commencez à discuter avec notre assistant intelligent . Posez-lui des questions ou
              demandez-lui de l'aide.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message._id || index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-purple-700 text-white"
                      : "bg-gray-800 text-gray-200 border border-gray-700"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div
                    className={`mt-1 text-right text-xs ${message.role === "user" ? "text-purple-300" : "text-gray-400"}`}
                  >
                    {formatTime(message.createdAt)}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex max-w-[80%] items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-gray-200 border border-gray-700">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                <span>En train de réfléchir...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  )
}
