"use client"
import React from "react"
import { useState, useEffect } from "react"
import { useChat } from "../context/ChatContext"
import { useMessage } from "../context/MessageContext"
import { useAuth } from "../context/AuthContext"
import { Sidebar } from "../Components/sidebar"
import { ChatHeader } from "../Components/chat-header"
import { ChatMessages } from "../Components/chat-messages"
import { ChatInput } from "../Components/chat-input"

import { Archive, Trash2, Sliders, User, Edit, LogOut, X, AlertTriangle, MessageCircle, Info } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { getUserProfile, updateUserProfile, deleteAccount } from "../api/users"

export function ChatInterface() {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuth()
  const {
    chats,
    currentChat,
    createChat,
    deleteChat,
    archiveChat,
    deleteAllChats,
    setCurrentChat,
    fetchChats,
    selectChat,
  } = useChat()
  const { messages, sendMessage, fetchMessages, resetMessages, loading: messageLoading } = useMessage()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [showAIInfo, setShowAIInfo] = useState(false)
  const [userProfile, setUserProfile] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    password: "",
  })
  const [profileErrors, setProfileErrors] = useState({})

  // Charger les conversations au chargement
  useEffect(() => {
    fetchChats()
  }, [])

  // Charger les messages lorsque la conversation change
  useEffect(() => {
    if (currentChat) {
      fetchMessages(currentChat._id)
    } else {
      resetMessages()
    }
  }, [currentChat])

  // Charger le profil utilisateur
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await getUserProfile()
        setUserProfile({
          fullName: profile.fullName,
          email: profile.email,
          password: "",
        })
        updateUser(profile)
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error)
      }
    }

    loadUserProfile()
  }, [])

  const saveProfile = async () => {
    try {
      setIsLoading(true)
      const response = await updateUserProfile({
        fullName: userProfile.fullName,
        email: userProfile.email,
      })
      updateUser(response.user)
      setIsEditingProfile(false)
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error)
      setProfileErrors({ api: error.message || "Erreur lors de la mise à jour du profil" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true)
      await deleteAccount(userProfile.password)
      logout()
      navigate("/login")
    } catch (error) {
      console.error("Erreur lors de la suppression du compte:", error)
      setProfileErrors({ api: error.message || "Erreur lors de la suppression du compte" })
    } finally {
      setIsLoading(false)
      setShowProfileModal(false)
      setShowDeleteConfirm(false)
    }
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const createNewChat = async () => {
    try {
      const newChat = await createChat("Nouvelle discussion")
      setCurrentChat(newChat)
      setSidebarOpen(false)
    } catch (error) {
      console.error("Erreur lors de la création d'une nouvelle conversation:", error)
    }
  }

  const switchChat = async (chatId) => {
    try {
      setIsLoading(true)
      const { chat, messages } = await selectChat(chatId)
      setSidebarOpen(false)
    } catch (error) {
      console.error("Erreur lors du changement de conversation:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (message) => {
    if (!message.trim()) return

    try {
      setIsLoading(true)

      // Si aucune conversation active, en créer une nouvelle
      if (!currentChat) {
        const newChat = await createChat("Nouvelle discussion")
        setCurrentChat(newChat)
        await sendMessage(newChat._id, message)
      } else {
        await sendMessage(currentChat._id, message)
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleArchiveChat = async (chatId, isArchived) => {
    try {
      await archiveChat(chatId, isArchived)
      if (currentChat && currentChat._id === chatId) {
        createNewChat()
      }
    } catch (error) {
      console.error("Erreur lors de l'archivage de la conversation:", error)
    }
  }

  const deleteAllChatsHandler = async () => {
    try {
      await deleteAllChats()
      setShowConfigModal(false)
      createNewChat()
    } catch (error) {
      console.error("Erreur lors de la suppression des conversations:", error)
    }
  }

  const archiveAllChats = async () => {
    try {
      // Archiver toutes les conversations actives
      for (const chat of chats) {
        await archiveChat(chat._id, true)
      }
      setShowConfigModal(false)
      createNewChat()
    } catch (error) {
      console.error("Erreur lors de l'archivage des conversations:", error)
    }
  }

  const manageChats = () => {
    navigate("/archives")
    setShowConfigModal(false)
  }

  const openProfile = () => {
    setShowProfileModal(true)
    setShowConfigModal(false)
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-300">
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className="relative bg-gray-800 rounded-xl border border-gray-700 shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-gray-700/80 to-gray-700/80 p-4">
              <div className="flex items-center">
                <Archive className="text-white mr-2" size={22} />
                <h3 className="text-xl font-semibold text-white">Gestion des conversations</h3>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="ml-auto p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="text-white" size={20} />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <button
                onClick={archiveAllChats}
                className="w-full flex items-center gap-4 p-3 hover:bg-gray-700/80 rounded-lg transition-all duration-200 group border border-gray-700"
              >
                <div className="p-2 rounded-lg bg-purple-900/30 group-hover:bg-purple-800/50 transition-colors">
                  <Archive size={18} className="text-purple-400" />
                </div>
                <div className="text-left">
                  <span className="block font-medium text-gray-100">Archiver tous les chats</span>
                  <span className="block text-xs text-gray-400">Sauvegarde toutes les conversations</span>
                </div>
              </button>

              <button
                onClick={deleteAllChatsHandler}
                className="w-full flex items-center gap-4 p-3 hover:bg-gray-700/80 rounded-lg transition-all duration-200 group border border-gray-700"
              >
                <div className="p-2 rounded-lg bg-red-900/30 group-hover:bg-red-800/50 transition-colors">
                  <Trash2 size={18} className="text-red-400" />
                </div>
                <div className="text-left">
                  <span className="block font-medium text-gray-100">Supprimer tous les chats</span>
                  <span className="block text-xs text-gray-400">Action irréversible</span>
                </div>
              </button>
              <Link to="/archives">
                <button
                  onClick={manageChats}
                  className="w-full flex items-center gap-4 p-3 hover:bg-gray-700/80 rounded-lg transition-all duration-200 group border border-gray-700"
                >
                  <div className="p-2 rounded-lg bg-blue-900/30 group-hover:bg-blue-800/50 transition-colors">
                    <Sliders size={18} className="text-blue-400" />
                  </div>
                  <div className="text-left">
                    <span className="block font-medium text-gray-100">Gérer les archives</span>
                    <span className="block text-xs text-gray-400">Voir les conversations archivées</span>
                  </div>
                </button>
              </Link>
            </div>
            <div className="p-3 border-t border-gray-700 bg-gray-800/50 flex justify-end">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 text-sm rounded-lg bg-gray-700 border border-gray-600 hover:bg-gray-600 transition-colors text-gray-200"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 bg-black/50 backdrop-blur-sm">
          <div
            className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-sm border border-gray-200 dark:border-gray-700 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 text-purple-700 dark:text-purple-400">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg mr-2">
                <MessageCircle size={25} />
              </div>
              <h1 className="text-xl font-bold">ChatBot</h1>
              <button
                onClick={() => {
                  setShowProfileModal(false)
                  setIsEditingProfile(false)
                }}
                className="ml-auto text-purple transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              {profileErrors.api && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                  {profileErrors.api}
                </div>
              )}

              {!isEditingProfile ? (
                <>
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-600">
                        <User className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{userProfile.fullName}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{userProfile.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200 text-gray-700 dark:text-gray-300"
                    >
                      <Edit className="text-gray-500" size={18} />
                      <span>Modifier le profil</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Nom complet</label>
                    <input
                      type="text"
                      value={userProfile.fullName}
                      onChange={(e) => setUserProfile({ ...userProfile, fullName: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Mot de passe</label>
                    <input
                      type="password"
                      value={userProfile.password}
                      onChange={(e) => setUserProfile({ ...userProfile, password: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Nouveau mot de passe"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 text-sm rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-700 dark:text-gray-300"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={saveProfile}
                      disabled={isLoading}
                      className="px-4 py-2 text-sm rounded bg-purple-600 hover:bg-purple-500 transition-colors duration-200 text-white disabled:opacity-70"
                    >
                      {isLoading ? "Enregistrement..." : "Enregistrer"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              {!isEditingProfile && (
                <>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200 text-gray-700 dark:text-gray-300 text-sm"
                  >
                    <LogOut className="text-gray-500" size={16} />
                    <span>Déconnexion</span>
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200 text-red-600 text-sm"
                  >
                    <Trash2 className="text-red-500" size={16} />
                    <span>Supprimer mon compte</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-sm p-6 border border-gray-200 dark:border-gray-700 shadow-xl relative z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <AlertTriangle className="text-red-500" size={20} />
                <span>Confirmer la suppression</span>
              </h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible et
              supprimera toutes vos données.
            </p>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                Entrez votre mot de passe pour confirmer
              </label>
              <input
                type="password"
                value={userProfile.password}
                onChange={(e) => setUserProfile({ ...userProfile, password: e.target.value })}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                placeholder="Votre mot de passe"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-700 dark:text-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700 transition-colors duration-200 text-white disabled:opacity-70"
              >
                {isLoading ? "Suppression..." : "Supprimer définitivement"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAIInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 border border-gray-200 dark:border-gray-700 shadow-xl relative z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Info className="text-blue-500" size={20} />
                <span>À propos de l'IA</span>
              </h3>
              <button
                onClick={() => setShowAIInfo(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                Ce chatbot est alimenté par <strong>OpenAI GPT</strong>, un modèle d'intelligence artificielle avancé
                capable de comprendre et de générer du texte de manière naturelle.
              </p>

              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Capacités</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Répondre à des questions générales</li>
                  <li>Fournir des informations sur divers sujets</li>
                  <li>Aider à la rédaction et à la génération de contenu</li>
                  <li>Assister dans la résolution de problèmes</li>
                </ul>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Limites</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Peut parfois générer des informations incorrectes</li>
                  <li>Connaissances limitées aux données sur lesquelles il a été formé</li>
                  <li>Ne peut pas accéder à Internet en temps réel</li>
                  <li>Ne peut pas exécuter de code ou interagir avec d'autres systèmes</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAIInfo(false)}
                className="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-gray-900 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
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
          onArchiveChat={handleArchiveChat}
          onOpenConfiguration={() => setShowConfigModal(true)}
          onOpenProfile={openProfile}
        />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <ChatHeader toggleSidebar={toggleSidebar} title={currentChat?.title || "Nouvelle discussion"} />

        <div className="flex-1 overflow-hidden">
          <ChatMessages messages={messages} isLoading={messageLoading || isLoading} />
        </div>

        <div className="p-4">
          <ChatInput onSendMessage={handleSendMessage} isLoading={messageLoading || isLoading} />
          <div className="mt-2 flex justify-between items-center">
            <p className="text-center text-xs text-gray-500">Le chatbot peut produire des informations inexactes.</p>
            <button
              onClick={() => setShowAIInfo(true)}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <Info size={12} />
              <span>À propos de l'IA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface

