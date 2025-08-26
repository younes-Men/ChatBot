"use client"
import React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import {
  getAllChats,
  getArchivedChats,
  createChat,
  deleteChat,
  deleteAllChats,
  updateChatTitle,
  getChatWithMessages,
  toggleArchiveChat,
} from "../api/chats"
import { useAuth } from "./AuthContext"

// Créer le contexte de chat
const ChatContext = createContext()

// Hook personnalisé pour utiliser le contexte de chat
export const useChat = () => useContext(ChatContext)

// Fournisseur du contexte de chat
export const ChatProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [chats, setChats] = useState([])
  const [archivedChats, setArchivedChats] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Charger les conversations au chargement si l'utilisateur est authentifié
  useEffect(() => {
    if (isAuthenticated) {
      fetchChats()
    }
  }, [isAuthenticated])

  // Récupérer toutes les conversations
  const fetchChats = async () => {
    setLoading(true)
    try {
      const chatsData = await getAllChats()
      setChats(chatsData)

      // Charger également les conversations archivées
      const archivedData = await getArchivedChats()
      setArchivedChats(archivedData)

      setError(null)
    } catch (error) {
      console.error("Erreur lors de la récupération des conversations:", error)
      setError(error.message || "Erreur lors de la récupération des conversations")
    } finally {
      setLoading(false)
    }
  }

  // Créer une nouvelle conversation
  const handleCreateChat = async (title) => {
    try {
      const newChat = await createChat({ title })
      setChats((prevChats) => [newChat, ...prevChats])
      setCurrentChat(newChat)
      return newChat
    } catch (error) {
      console.error("Erreur lors de la création de la conversation:", error)
      setError(error.message || "Erreur lors de la création de la conversation")
      throw error
    }
  }

  // Supprimer une conversation
  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat(chatId)
      setChats((prevChats) => prevChats.filter((chat) => chat._id !== chatId))
      setArchivedChats((prevChats) => prevChats.filter((chat) => chat._id !== chatId))

      if (currentChat && currentChat._id === chatId) {
        setCurrentChat(null)
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la conversation:", error)
      setError(error.message || "Erreur lors de la suppression de la conversation")
      throw error
    }
  }

  // Archiver ou désarchiver une conversation
  const handleArchiveChat = async (chatId, isArchived) => {
    try {
      const updatedChat = await toggleArchiveChat(chatId, isArchived)

      if (isArchived) {
        // Déplacer de la liste principale vers les archives
        setChats((prevChats) => prevChats.filter((chat) => chat._id !== chatId))
        setArchivedChats((prevChats) => [updatedChat, ...prevChats])
      } else {
        // Déplacer des archives vers la liste principale
        setArchivedChats((prevChats) => prevChats.filter((chat) => chat._id !== chatId))
        setChats((prevChats) => [updatedChat, ...prevChats])
      }

      // Si c'est la conversation courante, mettre à jour son état
      if (currentChat && currentChat._id === chatId) {
        setCurrentChat(updatedChat)
      }

      return updatedChat
    } catch (error) {
      console.error("Erreur lors de l'archivage de la conversation:", error)
      setError(error.message || "Erreur lors de l'archivage de la conversation")
      throw error
    }
  }

  // Supprimer toutes les conversations
  const handleDeleteAllChats = async () => {
    try {
      await deleteAllChats()
      setChats([])
      setArchivedChats([])
      setCurrentChat(null)
    } catch (error) {
      console.error("Erreur lors de la suppression de toutes les conversations:", error)
      setError(error.message || "Erreur lors de la suppression de toutes les conversations")
      throw error
    }
  }

  // Mettre à jour le titre d'une conversation basé sur le premier message
  const updateChatTitleFromMessage = async (chatId, message) => {
    try {
      // Limiter le titre à 30 caractères
      const newTitle = message.length > 30 ? message.substring(0, 27) + "..." : message
      await updateChatTitle(chatId, newTitle)

      // Mettre à jour la liste des conversations
      setChats((prevChats) => prevChats.map((chat) => (chat._id === chatId ? { ...chat, title: newTitle } : chat)))

      // Mettre à jour la conversation courante si nécessaire
      if (currentChat && currentChat._id === chatId) {
        setCurrentChat((prev) => ({ ...prev, title: newTitle }))
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du titre:", error)
    }
  }

  // Sélectionner une conversation
  const selectChat = async (chatId) => {
    try {
      setLoading(true)
      // Récupérer la conversation avec ses messages
      const { chat, messages } = await getChatWithMessages(chatId)
      setCurrentChat(chat)
      return { chat, messages }
    } catch (error) {
      console.error("Erreur lors de la sélection de la conversation:", error)
      setError(error.message || "Erreur lors de la sélection de la conversation")
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Mettre à jour la liste des conversations
  const updateChatsList = (updatedChat) => {
    setChats((prevChats) => prevChats.map((chat) => (chat._id === updatedChat._id ? updatedChat : chat)))

    if (currentChat && currentChat._id === updatedChat._id) {
      setCurrentChat(updatedChat)
    }
  }

  // Valeur du contexte
  const value = {
    chats,
    archivedChats,
    currentChat,
    loading,
    error,
    fetchChats,
    createChat: handleCreateChat,
    deleteChat: handleDeleteChat,
    archiveChat: handleArchiveChat,
    deleteAllChats: handleDeleteAllChats,
    setCurrentChat,
    updateChatsList,
    updateChatTitleFromMessage,
    selectChat,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export default ChatContext
