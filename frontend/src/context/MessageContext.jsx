"use client"
import React from "react"
import { createContext, useState, useContext } from "react"
import { addMessage, getMessages, getBotResponse } from "../api/messages"
import { useChat } from "./ChatContext"

// Créer le contexte de messages
const MessageContext = createContext()

// Hook personnalisé pour utiliser le contexte de messages
export const useMessage = () => useContext(MessageContext)

// Fournisseur du contexte de messages
export const MessageProvider = ({ children }) => {
  const { currentChat, updateChatTitleFromMessage } = useChat()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Récupérer les messages d'une conversation
  const fetchMessages = async (chatId) => {
    setLoading(true)
    try {
      const messagesData = await getMessages(chatId)
      setMessages(messagesData)
      setError(null)
    } catch (error) {
      console.error("Erreur lors de la récupération des messages:", error)
      setError(error.message || "Erreur lors de la récupération des messages")
    } finally {
      setLoading(false)
    }
  }

  // Envoyer un message et obtenir une réponse du bot
  const sendMessage = async (chatId, content) => {
    try {
      // Ajouter le message de l'utilisateur
      const userMessage = await addMessage(chatId, {
        role: "user",
        content,
      })

      setMessages((prevMessages) => [...prevMessages, userMessage])

      // Si c'est le premier message, mettre à jour le titre de la conversation
      if (messages.length === 0) {
        updateChatTitleFromMessage(chatId, content)
      }

      // Obtenir la réponse du bot en passant l'historique des messages
      setLoading(true)
      // Limiter l'historique aux 10 derniers messages pour éviter de dépasser les limites de l'API
      const recentMessages = [...messages.slice(-10), userMessage]
      const botMessage = await getBotResponse(chatId, content, recentMessages)

      setMessages((prevMessages) => [...prevMessages, botMessage])
      return { userMessage, botMessage }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error)
      setError(error.message || "Erreur lors de l'envoi du message")
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Réinitialiser les messages
  const resetMessages = () => {
    setMessages([])
    setError(null)
  }

  // Valeur du contexte
  const value = {
    messages,
    loading,
    error,
    fetchMessages,
    sendMessage,
    resetMessages,
  }

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
}

export default MessageContext
