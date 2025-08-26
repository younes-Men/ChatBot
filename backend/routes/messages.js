const express = require("express")
const router = express.Router()
const Chat = require("../models/Chat")
const Message = require("../models/Message")
const { authenticateToken } = require("../middleware/auth")

// Ajouter un message à une conversation
router.post("/:chatId", authenticateToken, async (req, res) => {
  try {
    const { role, content } = req.body

    // Vérifier si la conversation existe et appartient à l'utilisateur
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      user: req.user.userId,
    })

    if (!chat) {
      return res.status(404).json({ message: "Conversation non trouvée" })
    }

    // Créer le nouveau message
    const newMessage = new Message({
      chat: req.params.chatId,
      role,
      content,
    })

    await newMessage.save()

    // Mettre à jour la date de dernière modification de la conversation
    chat.lastUpdated = Date.now()
    await chat.save()

    res.status(201).json(newMessage)
  } catch (error) {
    console.error("Erreur lors de l'ajout du message:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// Obtenir tous les messages d'une conversation
router.get("/:chatId", authenticateToken, async (req, res) => {
  try {
    // Vérifier si la conversation existe et appartient à l'utilisateur
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      user: req.user.userId,
    })

    if (!chat) {
      return res.status(404).json({ message: "Conversation non trouvée" })
    }

    // Récupérer les messages
    const messages = await Message.find({ chat: req.params.chatId }).sort({ createdAt: 1 })

    res.json(messages)
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// Supprimer un message spécifique
router.delete("/:messageId", authenticateToken, async (req, res) => {
  try {
    // Trouver le message
    const message = await Message.findById(req.params.messageId)

    if (!message) {
      return res.status(404).json({ message: "Message non trouvé" })
    }

    // Vérifier si la conversation appartient à l'utilisateur
    const chat = await Chat.findOne({
      _id: message.chat,
      user: req.user.userId,
    })

    if (!chat) {
      return res.status(403).json({ message: "Non autorisé" })
    }

    // Supprimer le message
    await Message.findByIdAndDelete(req.params.messageId)

    res.json({ message: "Message supprimé avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression du message:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// Générer une réponse du chatbot
router.post("/:chatId/bot-response", authenticateToken, async (req, res) => {
  try {
    const { userMessage } = req.body

    // Vérifier si la conversation existe et appartient à l'utilisateur
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      user: req.user.userId,
    })

    if (!chat) {
      return res.status(404).json({ message: "Conversation non trouvée" })
    }

    // Simuler une réponse du chatbot (à remplacer par une vraie IA)
    const botResponses = [
      "Je suis là pour vous aider. Comment puis-je vous assister aujourd'hui?",
      "Merci pour votre message. Que souhaitez-vous savoir?",
      "Bonjour! Je suis votre assistant virtuel. Comment puis-je vous aider?",
      "Je suis désolé, je ne comprends pas complètement. Pouvez-vous reformuler?",
      "C'est une question intéressante. Laissez-moi vous aider avec ça.",
    ]

    const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]

    // Créer le message de réponse du bot
    const botMessage = new Message({
      chat: req.params.chatId,
      role: "assistant",
      content: randomResponse,
    })

    await botMessage.save()

    // Mettre à jour la date de dernière modification de la conversation
    chat.lastUpdated = Date.now()
    await chat.save()

    res.status(201).json(botMessage)
  } catch (error) {
    console.error("Erreur lors de la génération de la réponse du bot:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

module.exports = router
