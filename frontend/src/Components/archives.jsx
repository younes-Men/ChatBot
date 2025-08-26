"use client"
import React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useChat } from "../context/ChatContext"
import { ArrowLeft, MessageSquare, Mic, Trash2, RefreshCw } from "lucide-react"
import { ConfirmationDialog } from "./confirmation-dialog"

export default function ChatbotArchives() {
  const navigate = useNavigate()
  const { archivedChats, fetchChats, deleteChat, archiveChat, selectChat } = useChat()
  const [loading, setLoading] = useState(true)
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    chatId: null,
    action: null, // 'delete' ou 'unarchive'
  })

  useEffect(() => {
    const loadArchivedChats = async () => {
      try {
        await fetchChats()
      } catch (error) {
        console.error("Erreur lors du chargement des archives:", error)
      } finally {
        setLoading(false)
      }
    }

    loadArchivedChats()
  }, [])

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation()
    setConfirmDialog({
      isOpen: true,
      chatId: chatId,
      action: "delete",
    })
  }

  const handleUnarchiveChat = (e, chatId) => {
    e.stopPropagation()
    setConfirmDialog({
      isOpen: true,
      chatId: chatId,
      action: "unarchive",
    })
  }

  const handleConfirmAction = async () => {
    if (confirmDialog.chatId) {
      try {
        if (confirmDialog.action === "delete") {
          await deleteChat(confirmDialog.chatId)
        } else if (confirmDialog.action === "unarchive") {
          await archiveChat(confirmDialog.chatId, false)
        }
      } catch (error) {
        console.error("Erreur lors de l'action:", error)
      }
    }
    setConfirmDialog({
      isOpen: false,
      chatId: null,
      action: null,
    })
  }

  const handleCancelAction = () => {
    setConfirmDialog({
      isOpen: false,
      chatId: null,
      action: null,
    })
  }

  const handleRestoreAndOpen = async (chatId) => {
    try {
      // Désarchiver la conversation
      await archiveChat(chatId, false)

      // Sélectionner la conversation et naviguer vers l'interface de chat
      await selectChat(chatId)
      navigate("/chat")
    } catch (error) {
      console.error("Erreur lors de la restauration:", error)
    }
  }

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })
  }

  // Formater l'heure pour l'affichage
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Fonction pour déterminer l'icône à utiliser en fonction du type de chat
  const getIconForChat = (chat) => {
    if (chat.isVoice) {
      return <Mic size={18} className="text-gray-400" />
    }
    return <MessageSquare size={18} className="text-gray-400" />
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-950">
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={handleCancelAction}
        onConfirm={handleConfirmAction}
        title={confirmDialog.action === "delete" ? "Supprimer la conversation" : "Désarchiver la conversation"}
        message={
          confirmDialog.action === "delete"
            ? "Êtes-vous sûr de vouloir supprimer définitivement cette conversation archivée ?"
            : "Êtes-vous sûr de vouloir désarchiver cette conversation ?"
        }
      />

      <header className="flex items-center border-b border-gray-800 bg-gray-900 p-4">
        <button
          onClick={() => navigate("/chat")}
          className="mr-4 rounded-md p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-medium text-gray-200">Archives</h1>
      </header>

      <main className="flex-1 p-4">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-purple-600"></div>
          </div>
        ) : archivedChats.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {archivedChats.map((chat) => (
              <div
                key={chat._id}
                className="group relative rounded-lg border border-gray-800 bg-gray-900 p-4 hover:border-gray-700 transition-colors"
              >
                <div className="mb-2 flex items-center gap-2">
                  {getIconForChat(chat)}
                  <h3 className="flex-1 truncate text-sm font-medium text-gray-300">{chat.title}</h3>
                </div>
                <div className="mb-4 text-xs text-gray-500">
                  <span>{formatDate(chat.lastUpdated)}</span>
                  <span className="mx-1">•</span>
                  <span>{formatTime(chat.lastUpdated)}</span>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={(e) => handleUnarchiveChat(e, chat._id)}
                    className="rounded-md bg-gray-800 px-3 py-1 text-xs text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    <RefreshCw size={14} className="mr-1 inline" />
                    Désarchiver
                  </button>
                  <button
                    onClick={(e) => handleDeleteChat(e, chat._id)}
                    className="rounded-md bg-red-900/30 px-3 py-1 text-xs text-red-400 hover:bg-red-900/50 transition-colors"
                  >
                    <Trash2 size={14} className="mr-1 inline" />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-40 flex-col items-center justify-center text-center">
            <MessageSquare className="mb-2 h-10 w-10 text-gray-700" />
            <h2 className="mb-1 text-lg font-medium text-gray-300">Aucune conversation archivée</h2>
            <p className="text-sm text-gray-500">Les conversations archivées apparaîtront ici</p>
          </div>
        )}
      </main>
    </div>
  )
}
