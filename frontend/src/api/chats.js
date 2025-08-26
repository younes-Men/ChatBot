import authAPI from "./auth"

// Récupérer toutes les conversations
export const getAllChats = async () => {
  try {
    const response = await authAPI.get("/chats")
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la récupération des conversations" }
  }
}

// Récupérer les conversations archivées
export const getArchivedChats = async () => {
  try {
    const response = await authAPI.get("/chats/archives")
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la récupération des archives" }
  }
}

// Créer une nouvelle conversation
export const createChat = async (chatData) => {
  try {
    const response = await authAPI.post("/chats", chatData)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la création de la conversation" }
  }
}

// Récupérer une conversation avec ses messages
export const getChatWithMessages = async (chatId) => {
  try {
    const response = await authAPI.get(`/chats/${chatId}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la récupération de la conversation" }
  }
}

// Mettre à jour le titre d'une conversation
export const updateChatTitle = async (chatId, title) => {
  try {
    const response = await authAPI.put(`/chats/${chatId}`, { title })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la mise à jour du titre" }
  }
}

// Archiver/désarchiver une conversation
export const toggleArchiveChat = async (chatId, isArchived) => {
  try {
    const response = await authAPI.put(`/chats/${chatId}/archive`, { isArchived })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de l'archivage de la conversation" }
  }
}

// Supprimer une conversation
export const deleteChat = async (chatId) => {
  try {
    const response = await authAPI.delete(`/chats/${chatId}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la suppression de la conversation" }
  }
}

// Supprimer toutes les conversations
export const deleteAllChats = async () => {
  try {
    const response = await authAPI.delete("/chats")
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la suppression des conversations" }
  }
}
