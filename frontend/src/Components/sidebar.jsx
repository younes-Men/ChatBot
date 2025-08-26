"use client"
import React from "react"
import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus, MessageSquare, Mic, Settings, LogOut, X, Trash2, User, Sliders, Archive } from "lucide-react"
import { ConfirmationDialog } from "./confirmation-dialog"

export function Sidebar({
  onClose,
  chats,
  currentChat,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  onArchiveChat,
  onOpenProfile,
  onOpenConfiguration,
}) {
  const [showHistory, setShowHistory] = useState(true) // Toujours afficher l'historique par défaut
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    chatId: null,
    action: null, // 'delete' ou 'archive'
  })
  const dropdownRef = useRef(null)

  const user = {
    name: "Utilisateur",
  }

  // Fonction pour déterminer l'icône à utiliser en fonction du type de chat
  const getIconForChat = (chat) => {
    if (chat.isVoice) {
      return Mic
    }
    return MessageSquare
  }

  // Fonction pour obtenir le titre du chat (utilise le premier message si disponible)
  const getChatTitle = (chat) => {
    if (chat.title && chat.title !== "Nouvelle discussion") {
      return chat.title
    }

    // Si le titre est générique, on pourrait utiliser le premier message
    // Cette logique devrait être implémentée côté serveur ou dans le ChatContext
    return chat.title || "Nouvelle discussion"
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSettingsDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleNewChatClick = () => {
    onNewChat()
  }

  const handleChatSelect = (chatId) => {
    onChatSelect(chatId)
  }

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation()
    // Ouvrir la boîte de dialogue de confirmation personnalisée
    setConfirmDialog({
      isOpen: true,
      chatId: chatId,
      action: "delete",
    })
  }

  const handleArchiveChat = (e, chatId) => {
    e.stopPropagation()
    // Ouvrir la boîte de dialogue de confirmation personnalisée
    setConfirmDialog({
      isOpen: true,
      chatId: chatId,
      action: "archive",
    })
  }

  const handleConfirmAction = () => {
    // Si l'utilisateur confirme l'action
    if (confirmDialog.chatId) {
      if (confirmDialog.action === "delete") {
        onDeleteChat(confirmDialog.chatId)
        if (currentChat && currentChat._id === confirmDialog.chatId) {
          onNewChat()
        }
      } else if (confirmDialog.action === "archive") {
        onArchiveChat(confirmDialog.chatId, true)
        if (currentChat && currentChat._id === confirmDialog.chatId) {
          onNewChat()
        }
      }
    }
    // Fermer la boîte de dialogue
    setConfirmDialog({
      isOpen: false,
      chatId: null,
      action: null,
    })
  }

  const handleCancelAction = () => {
    // Fermer la boîte de dialogue sans action
    setConfirmDialog({
      isOpen: false,
      chatId: null,
      action: null,
    })
  }

  const toggleSettingsDropdown = () => {
    setShowSettingsDropdown(!showSettingsDropdown)
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

  return (
    <div className="flex h-full flex-col bg-gray-900 p-4 relative">
      {/* Boîte de dialogue de confirmation personnalisée */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={handleCancelAction}
        onConfirm={handleConfirmAction}
        title={confirmDialog.action === "delete" ? "Supprimer la conversation" : "Archiver la conversation"}
        message={
          confirmDialog.action === "delete"
            ? "Êtes-vous sûr de vouloir supprimer cette conversation ?"
            : "Êtes-vous sûr de vouloir archiver cette conversation ?"
        }
      />

      {/* Bouton nouvelle conversation */}
      <button
        className="mb-4 flex w-full items-center justify-start gap-2 rounded-md bg-purple-800 px-4 py-2 text-white hover:bg-purple-700 transition-colors"
        onClick={handleNewChatClick}
      >
        <Plus size={16} />
        <span>Nouvelle conversation</span>
      </button>

      {/* Historique des conversations */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-2 px-2">
          <h3 className="text-xs font-semibold uppercase text-gray-500">Historique</h3>
          <Link to="/archives" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
            <Archive size={12} />
            <span>Archives</span>
          </Link>
        </div>

        {chats.length > 0 ? (
          <div className="space-y-2">
            {chats.map((chat) => {
              const ChatIcon = getIconForChat(chat)
              const isActive = currentChat && currentChat._id === chat._id

              return (
                <div
                  key={chat._id}
                  className={`flex cursor-pointer items-center gap-3 rounded-md p-2 ${
                    isActive ? "bg-gray-800" : "hover:bg-gray-800"
                  } group relative`}
                  onClick={() => handleChatSelect(chat._id)}
                >
                  <ChatIcon size={18} className={`${isActive ? "text-purple-400" : "text-gray-400"}`} />
                  <div className="flex flex-1 flex-col overflow-hidden">
                    <span className={`text-sm truncate ${isActive ? "text-white font-medium" : "text-gray-300"}`}>
                      {getChatTitle(chat)}
                    </span>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{formatDate(chat.lastUpdated)}</span>
                      <span className="mx-1">•</span>
                      <span>{formatTime(chat.lastUpdated)}</span>
                    </div>
                  </div>
                  <div className="absolute right-2 opacity-0 group-hover:opacity-100 flex gap-1">
                    <button
                      onClick={(e) => handleArchiveChat(e, chat._id)}
                      className="text-gray-400 hover:text-purple-400 transition-opacity p-1 rounded-full hover:bg-gray-700"
                      title="Archiver"
                    >
                      <Archive size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteChat(e, chat._id)}
                      className="text-gray-400 hover:text-red-400 transition-opacity p-1 rounded-full hover:bg-gray-700"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="px-2 py-4 text-center text-sm text-gray-500">Aucune conversation</div>
        )}
      </div>

      <div className="mt-auto border-t border-gray-800 pt-4">
        <div className="relative" ref={dropdownRef}>
          <div
            className="mb-2 flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-gray-800"
            onClick={toggleSettingsDropdown}
          >
            <div className="flex items-center gap-3">
              <Settings size={18} className="text-gray-400" />
              <span className="text-sm">Paramètres</span>
            </div>
            <span className={`transition-transform duration-200 ${showSettingsDropdown ? "rotate-180" : ""}`}>▼</span>
          </div>

          {showSettingsDropdown && (
            <div className="absolute bottom-full left-0 mb-1 w-full rounded-md bg-gray-800 py-2 shadow-lg">
              <div className="border-b border-gray-700 px-3 py-2">
                <div className="text-sm font-medium text-white">{user.name}</div>
              </div>
              <div
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-gray-700"
                onClick={onOpenProfile}
              >
                <User size={16} className="text-gray-400" />
                <span>Profil</span>
              </div>
              <div
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-gray-700"
                onClick={onOpenConfiguration}
              >
                <Sliders size={16} className="text-gray-400" />
                <span>Options de conversation</span>
              </div>
            </div>
          )}
        </div>

        <Link to="/">
          <div className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-gray-800">
            <LogOut size={18} className="text-gray-400" />
            <span className="text-sm">Déconnexion</span>
          </div>
        </Link>
      </div>

      {/* Bouton Fermer mobile */}
      <button
        onClick={onClose}
        className="absolute right-2 top-2 md:hidden rounded-full p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
      >
        <span className="sr-only">Fermer</span>
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
