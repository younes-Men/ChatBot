import { fetchWithAuth } from "./auth"
import { generateOpenAIResponse } from "../api/openai"

// Auth API
export const loginUser = async (email, password) => {
  const response = await fetchWithAuth("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
  return response.json()
}

export const registerUser = async (fullName, email, password, confirmPassword) => {
  const response = await fetchWithAuth("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ fullName, email, password, confirmPassword }),
  })
  return response.json()
}

export const verifyToken = async () => {
  const response = await fetchWithAuth("/auth/verify")
  return response.json()
}

// User API
export const getUserProfile = async () => {
  const response = await fetchWithAuth("/users/profile")
  return response.json()
}

export const updateUserProfile = async (data) => {
  const response = await fetchWithAuth("/users/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  })
  return response.json()
}

export const changePassword = async (currentPassword, newPassword) => {
  const response = await fetchWithAuth("/users/change-password", {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  return response.json()
}

export const deleteAccount = async (password) => {
  const response = await fetchWithAuth("/users/account", {
    method: "DELETE",
    body: JSON.stringify({ password }),
  })
  return response.json()
}

// Chat API
export const getChats = async () => {
  const response = await fetchWithAuth("/chats")
  return response.json()
}

export const getArchivedChats = async () => {
  const response = await fetchWithAuth("/chats/archives")
  return response.json()
}

export const createChat = async (title, isVoice = false, duration = null) => {
  const response = await fetchWithAuth("/chats", {
    method: "POST",
    body: JSON.stringify({ title, isVoice, duration }),
  })
  return response.json()
}

export const getChat = async (chatId) => {
  const response = await fetchWithAuth(`/chats/${chatId}`)
  return response.json()
}

export const updateChatTitle = async (chatId, title) => {
  const response = await fetchWithAuth(`/chats/${chatId}`, {
    method: "PUT",
    body: JSON.stringify({ title }),
  })
  return response.json()
}

export const archiveChat = async (chatId, isArchived) => {
  const response = await fetchWithAuth(`/chats/${chatId}/archive`, {
    method: "PUT",
    body: JSON.stringify({ isArchived }),
  })
  return response.json()
}

export const deleteChat = async (chatId) => {
  const response = await fetchWithAuth(`/chats/${chatId}`, {
    method: "DELETE",
  })
  return response.json()
}

export const deleteAllChats = async () => {
  const response = await fetchWithAuth("/chats", {
    method: "DELETE",
  })
  return response.json()
}

// Message API
export const getMessages = async (chatId) => {
  const response = await fetchWithAuth(`/messages/${chatId}`)
  return response.json()
}

export const sendMessage = async (chatId, content) => {
  const response = await fetchWithAuth(`/messages/${chatId}`, {
    method: "POST",
    body: JSON.stringify({ role: "user", content }),
  })
  return response.json()
}

// Modifié pour utiliser l'API OpenAI
export const getBotResponse = async (chatId, userMessage, chatHistory = []) => {
  try {
    // Générer une réponse avec l'API OpenAI
    const aiResponse = await generateOpenAIResponse(userMessage, chatHistory)

    // Envoyer la réponse générée au backend
    const response = await fetchWithAuth(`/messages/${chatId}`, {
      method: "POST",
      body: JSON.stringify({ role: "assistant", content: aiResponse }),
    })

    return response.json()
  } catch (error) {
    console.error("Erreur lors de la génération de la réponse:", error)

    // En cas d'erreur, envoyer un message d'erreur
    const fallbackResponse = await fetchWithAuth(`/messages/${chatId}`, {
      method: "POST",
      body: JSON.stringify({
        role: "assistant",
        content: "Je suis désolé, je n'ai pas pu générer une réponse. Veuillez réessayer plus tard.",
      }),
    })

    return fallbackResponse.json()
  }
}

export const deleteMessage = async (messageId) => {
  const response = await fetchWithAuth(`/messages/${messageId}`, {
    method: "DELETE",
  })
  return response.json()
}
