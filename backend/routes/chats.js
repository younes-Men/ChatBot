const express = require("express")
const router = express.Router()
const Chat = require("../models/Chat")
const Message = require("../models/Message")
const { authenticateToken } = require("../middleware/auth")

// Obtenir toutes les conversations de l'utilisateur
router.get("/", authenticateToken, async (req, res) => {
  try {
    const chats = await Chat.find({
      user: req.user.userId,
      isArchived: false,
    }).sort({ lastUpdated: -1 })

    res.json(chats)
  } catch (error) {
    console.error("Erreur lors de la récupération des conversations:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// Obtenir les conversations archivées
router.get("/archives", authenticateToken, async (req, res) => {
  try {
    const archivedChats = await Chat.find({
      user: req.user.userId,
      isArchived: true,
    }).sort({ lastUpdated: -1 })

    res.json(archivedChats)
  } catch (error) {
    console.error("Erreur lors de la récupération des archives:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// Créer une nouvelle conversation
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, isVoice = false, duration = null } = req.body

    const newChat = new Chat({
      title,
      user: req.user.userId,
      isVoice,
      duration,
    })

    await newChat.save()

    res.status(201).json(newChat)
  } catch (error) {
    console.error("Erreur lors de la création de la conversation:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// Obtenir une conversation spécifique avec ses messages
router.get("/:chatId", authenticateToken, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      user: req.user.userId,
    })

    if (!chat) {
      return res.status(404).json({ message: "Conversation non trouvée" })
    }

    const messages = await Message.find({ chat: req.params.chatId }).sort({ createdAt: 1 })

    res.json({
      chat,
      messages,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération de la conversation:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// Mettre à jour le titre d'une conversation
router.put("/:chatId", authenticateToken, async (req, res) => {
  try {
    const { title } = req.body

    const updatedChat = await Chat.findOneAndUpdate(
      { _id: req.params.chatId, user: req.user.userId },
      {
        title,
        lastUpdated: Date.now(),
      },
      { new: true },
    )

    if (!updatedChat) {
      return res.status(404).json({ message: "Conversation non trouvée" })
    }

    res.json(updatedChat)
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la conversation:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// Archiver/Désarchiver une conversation
router.put("/:chatId/archive", authenticateToken, async (req, res) => {
  try {
    const { isArchived } = req.body

    const updatedChat = await Chat.findOneAndUpdate(
      { _id: req.params.chatId, user: req.user.userId },
      { isArchived },
      { new: true },
    )

    if (!updatedChat) {
      return res.status(404).json({ message: "Conversation non trouvée" })
    }

    res.json(updatedChat)
  } catch (error) {
    console.error("Erreur lors de l'archivage de la conversation:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// Supprimer une conversation
router.delete("/:chatId", authenticateToken, async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.chatId,
      user: req.user.userId,
    })

    if (!chat) {
      return res.status(404).json({ message: "Conversation non trouvée" })
    }

    // Supprimer tous les messages associés à cette conversation
    await Message.deleteMany({ chat: req.params.chatId })

    res.json({ message: "Conversation supprimée avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression de la conversation:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

// Supprimer toutes les conversations
router.delete("/", authenticateToken, async (req, res) => {
  try {
    // Supprimer toutes les conversations de l'utilisateur
    await Chat.deleteMany({ user: req.user.userId })

    // Trouver tous les IDs de conversations de l'utilisateur
    const userChats = await Chat.find({ user: req.user.userId }).select("_id")
    const chatIds = userChats.map((chat) => chat._id)

    // Supprimer tous les messages associés à ces conversations
    await Message.deleteMany({ chat: { $in: chatIds } })

    res.json({ message: "Toutes les conversations ont été supprimées" })
  } catch (error) {
    console.error("Erreur lors de la suppression des conversations:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
})

module.exports = router
