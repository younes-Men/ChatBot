import React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { MessageCircle, Check, Send } from "lucide-react"
import image from "../image/chatbot3.jpg"
import Footer from "../Components/Footer"
import { motion, AnimatePresence, useAnimation } from "framer-motion"

export default function ChatbotInterface() {
  const [isTyping, setIsTyping] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)
  const controls = useAnimation()

  // Messages for typing animation
  const messages = [
    "Salut! Comment puis-je vous aider ?",
    "Je peux répondre à vos questions.",
    "Essayez de me poser une question!",
  ]

  useEffect(() => {
    // Animate the header on mount
    controls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    })

    // Start typing animation
    const typingInterval = setInterval(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessageIndex((prev) => (prev + 1) % messages.length)
      }, 3000)
    }, 5000)

    return () => clearInterval(typingInterval)
  }, [controls, messages.length])

  // Staggered animation for features
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  // Floating animation for the phone
  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 6,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      <motion.header
        className="flex justify-between items-center p-4"
        initial={{ y: -50, opacity: 0 }}
        animate={controls}
      >
        <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/">
            <motion.div
              className="bg-purple-700 text-white p-2 rounded-lg"
              whileHover={{ rotate: 15 }}
              whileTap={{ scale: 0.9 }}
            >
              <MessageCircle size={20} />
            </motion.div>
          </Link>
          <motion.span
            className="text-xl font-bold text-purple-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Chatbot
          </motion.span>
        </motion.div>
        <div className="flex gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/login"
              className="px-4 py-1 border border-purple-300 rounded-full text-purple-700 hover:bg-purple-50 transition"
            >
              Se connecter
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/signup"
              className="px-4 py-1 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
            >
              S'inscrire
            </Link>
          </motion.div>
        </div>
      </motion.header>

      <section className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between">
        <motion.div
          className="md:w-1/2 mb-8 md:mb-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Découvrez l'avenir de
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              l'interaction intelligente
            </motion.div>
            <motion.span
              className="block text-orange-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.8,
                duration: 0.8,
                type: "spring",
                stiffness: 100,
              }}
            >
              Chatbot
            </motion.span>
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-gray-700 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            Découvrez la nouvelle génération de conversations alimentées par l'IA. Notre chatbot est là pour vous
            assister 24h/24 et 7j/7.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
           
          </motion.div>
        </motion.div>

        <motion.div
          className="md:w-1/2 max-w-md"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl">
            <div className="relative" style={{ backgroundColor: "#1f2937" }}>
              <div className="overflow-hidden" style={{ marginBottom: "-8px" }}>
                <motion.div
                  animate={{
                    scale: [1, 1.02, 1],
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 3,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                  className="transform-gpu"
                  style={{
                    transformOrigin: "center center",
                    paddingBottom: "10px",
                    marginBottom: "-10px",
                  }}
                >
                  <img src={image || "/placeholder.svg"} alt="AI Robot" className="w-full block" />
                </motion.div>
              </div>

              <AnimatePresence>
                <motion.div
                  className="absolute top-1/6 left-4"
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.5,
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  <div className="bg-white text-sm p-2 rounded-lg shadow-md max-w-[180px]">
                    <p>{messages[messageIndex]}</p>
                    {isTyping && (
                      <motion.div className="flex space-x-1 mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.5,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                            delay: 0.1,
                          }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.5,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                            delay: 0.2,
                          }}
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  className="absolute top-1/2 right-4"
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 1.2,
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  <div className="bg-purple-600 text-white text-sm p-2 rounded-lg shadow-md max-w-[180px]">
                    <p>Salut chatbot ! J'ai besoin de ton aide.</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 bg-gradient-to-r from-pink-500 via-purple-500 to-teal-400 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              className="md:w-1/2 text-white mb-10 md:mb-0"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div
                className="flex items-center space-x-2 mb-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                ></motion.div>
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
                ></motion.div>
                <motion.span
                  className="uppercase tracking-wider text-sm font-medium"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  About Us
                </motion.span>
              </motion.div>

              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Découvrez notre assistant chatbot IA - ChatBot
              </motion.h2>

              <motion.p
                className="text-white/90 mb-8 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              >
                Notre chatbot alimenté par l'IA est conçu pour transformer la manière dont vous interagissez avec la
                technologie. Grâce à des capacités avancées de traitement du langage naturel et d'apprentissage
                automatique, Chatbot comprend le contexte, apprend des interactions et fournit une assistance
                personnalisée adaptée à vos besoins.
              </motion.p>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <motion.div className="flex items-start space-x-2" variants={itemVariants}>
                  <motion.div
                    className="mt-1 bg-white/20 p-1 rounded-full"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Check size={16} className="text-white" />
                  </motion.div>
                  <span>Amélioration de l'efficacité</span>
                </motion.div>

                <motion.div className="flex items-start space-x-2" variants={itemVariants}>
                  <motion.div
                    className="mt-1 bg-white/20 p-1 rounded-full"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Check size={16} className="text-white" />
                  </motion.div>
                  <span>Collaboration créative</span>
                </motion.div>

                <motion.div className="flex items-start space-x-2" variants={itemVariants}>
                  <motion.div
                    className="mt-1 bg-white/20 p-1 rounded-full"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Check size={16} className="text-white" />
                  </motion.div>
                  <span>Apprentissage et exploration</span>
                </motion.div>

                <motion.div className="flex items-start space-x-2" variants={itemVariants}>
                  <motion.div
                    className="mt-1 bg-white/20 p-1 rounded-full"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Check size={16} className="text-white" />
                  </motion.div>
                  <span>Assistance instantanée 24/7</span>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex space-x-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/Login"
                    className="px-6 py-3 bg-white text-purple-700 font-medium rounded-md hover:bg-white/90 transition inline-block"
                  >
                    Parlons-en !
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Phone Mockup */}
            <motion.div
              className="md:w-1/2 relative"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div
                className="relative z-10 ml-auto w-[280px] md:w-[320px] lg:w-[380px]"
                animate={floatingAnimation}
              >
                <motion.div
                  className="rounded-[40px] overflow-hidden border-[8px] border-black bg-black shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative bg-gray-900 aspect-[9/19]">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-xl z-10"></div>

                    <div className="h-full overflow-hidden flex flex-col">
                      <motion.div
                        className="bg-gray-800 p-3 flex items-center justify-between"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <motion.div
                          className="bg-purple-700 text-white text-xs px-2 py-1 rounded-full"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          Nouvelle discussion
                        </motion.div>
                      </motion.div>

                      <div className="flex-1 p-3 overflow-y-auto space-y-3">
                        <motion.div
                          className="bg-gray-700 rounded-lg p-2 text-white text-xs max-w-[80%]"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <p>Bonjour, j'ai besoin de quelques conseils à propos des chatbots.</p>
                        </motion.div>

                        <motion.div
                          className="bg-purple-700 rounded-lg p-2 text-white text-xs max-w-[80%] ml-auto"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.0 }}
                        >
                          <p>Avec plaisir ! Que souhaitez-vous savoir ?</p>
                        </motion.div>

                        <motion.div
                          className="bg-gray-700 rounded-lg p-2 text-white text-xs max-w-[80%]"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.3 }}
                        >
                          <p>J'ai quelques questions concernant les chatbots.</p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: [0, 1, 0],
                            x: [-10, 0, -10],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                            delay: 2,
                          }}
                          className="bg-purple-700 rounded-lg p-2 text-white text-xs max-w-[80%] ml-auto"
                        >
                          <p>Je suis en train d'écrire...</p>
                        </motion.div>
                      </div>

                      <motion.div
                        className="bg-gray-800 p-3 flex items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                      >
                        <div className="bg-gray-700 rounded-full flex-1 flex items-center px-3 py-2">
                          <motion.span
                            className="text-gray-400 text-xs"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                          >
                            Message chatbot...
                          </motion.span>
                        </div>
                        <motion.div
                          className="ml-2 bg-purple-700 p-2 rounded-full"
                          whileHover={{ scale: 1.2, rotate: 15 }}
                          whileTap={{ scale: 0.8 }}
                        >
                          <Send className="h-4 w-4" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Decorative elements */}
              <motion.div
                className="absolute -bottom-10 -left-10 w-20 h-20 bg-pink-300 rounded-full opacity-30 z-0"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              />
              <motion.div
                className="absolute top-20 -right-10 w-16 h-16 bg-purple-400 rounded-full opacity-30 z-0"
                animate={{
                  scale: [1, 1.5, 1],
                  x: [0, 10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
