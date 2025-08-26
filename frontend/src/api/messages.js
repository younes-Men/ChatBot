import authAPI from "./auth"
import { generateOpenAIResponse } from "./openai"

// Récupérer les messages d'une conversation
export const getMessages = async (chatId) => {
  try {
    const response = await authAPI.get(`/messages/${chatId}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la récupération des messages" }
  }
}

// Ajouter un message à une conversation
export const addMessage = async (chatId, messageData) => {
  try {
    const response = await authAPI.post(`/messages/${chatId}`, messageData)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de l'ajout du message" }
  }
}

// Obtenir une réponse du bot avec l'API OpenAI
export const getBotResponse = async (chatId, userMessage, chatHistory = []) => {
  try {
    // Générer une réponse avec l'API OpenAI
    const aiResponse = await generateOpenAIResponse(userMessage, chatHistory)

    // Envoyer la réponse générée au backend
    const response = await authAPI.post(`/messages/${chatId}`, {
      role: "assistant",
      content: aiResponse,
    })

    return response.data
  } catch (error) {
    console.error("Erreur lors de la génération de la réponse:", error)

    // En cas d'erreur, envoyer un message d'erreur
    const fallbackResponse = await authAPI.post(`/messages/${chatId}`, {
      role: "assistant",
      content: "Je suis désolé, je n'ai pas pu générer une réponse. Veuillez réessayer plus tard.",
    })

    return fallbackResponse.data
  }
}

// Supprimer un message
export const deleteMessage = async (messageId) => {
  try {
    const response = await authAPI.delete(`/messages/${messageId}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: "Erreur lors de la suppression du message" }
  }
}
