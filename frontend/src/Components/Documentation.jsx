import React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, ChevronUp, Book, HelpCircle, FileText, BotMessageSquare } from "lucide-react"

const FAQ = () => {
  const [activeSection, setActiveSection] = useState("faq")
  const [expandedQuestions, setExpandedQuestions] = useState({})

  const handleQuestionToggle = (id) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
    }
  }

  // FAQ data - translated to French
  const faqSections = [
    {
      id: "general",
      title: "Questions Générales",
      questions: [
        {
          id: "what-is-chatassist",
          question: "Qu'est-ce que ChatAssist?",
          answer:
            "ChatAssist est une plateforme de chatbot alimentée par l'IA qui aide les entreprises à automatiser le support client, à interagir avec les visiteurs et à fournir des réponses instantanées aux questions courantes 24h/24 et 7j/7.",
        },
        {
          id: "who-can-use",
          question: "Ai-je besoin de compétences en programmation pour configurer mon bot ChatAssist?",
          answer:
            "Non, ChatAssist est conçu pour être convivial avec un processus de configuration sans code. Notre interface intuitive vous permet de configurer votre chatbot sans aucune connaissance en programmation.",
        },
        {
          id: "pricing",
          question: "Quels forfaits sont disponibles et comment choisir?",
          answer:
            "Nous proposons des forfaits Gratuit, Basique, Professionnel et Entreprise. Le meilleur forfait dépend de la taille de votre entreprise, du volume de chat attendu et des fonctionnalités requises. Visitez notre page de tarification pour des comparaisons détaillées.",
        },
      ],
    },
    {
      id: "features",
      title: "Fonctionnalités",
      questions: [
        {
          id: "upgrade-downgrade",
          question: "Puis-je mettre à niveau ou rétrograder mon forfait ultérieurement?",
          answer:
            "Oui, vous pouvez mettre à niveau ou rétrograder votre forfait à tout moment. Les modifications apportées à votre abonnement seront reflétées dans votre prochain cycle de facturation.",
        },
        {
          id: "integrations",
          question: "ChatAssist s'intègre-t-il à d'autres plateformes?",
          answer:
            "Oui, ChatAssist s'intègre parfaitement aux plateformes populaires, notamment WordPress, Shopify, Facebook Messenger, WhatsApp et de nombreux systèmes CRM.",
        },
        {
          id: "customization",
          question: "Dans quelle mesure l'interface du chatbot est-elle personnalisable?",
          answer:
            "ChatAssist offre de nombreuses options de personnalisation. Vous pouvez ajuster les couleurs, les polices et les styles pour correspondre à votre marque, créer des flux de discussion personnalisés et personnaliser les réponses du bot pour refléter la voix de votre marque.",
        },
      ],
    },
    {
      id: "technical",
      title: "Questions Techniques",
      questions: [
        {
          id: "data-security",
          question: "Comment ChatAssist assure-t-il la sécurité des données?",
          answer:
            "ChatAssist prend la sécurité des données au sérieux. Nous utilisons le chiffrement SSL/TLS pour toutes les communications, stockons les données sur des serveurs sécurisés avec chiffrement au repos et effectuons des sauvegardes régulières. Nous sommes conformes au RGPD et proposons des options d'authentification à deux facteurs.",
        },
        {
          id: "languages",
          question: "Quelles langues ChatAssist prend-il en charge?",
          answer:
            "ChatAssist prend en charge plus de 50 langues, notamment l'anglais, l'espagnol, le français, l'allemand, le chinois, le japonais, l'arabe et bien d'autres. Notre IA peut détecter automatiquement la langue de l'utilisateur et y répondre.",
        },
        {
          id: "offline-access",
          question: "Puis-je utiliser ChatAssist hors ligne?",
          answer:
            "ChatAssist nécessite une connexion Internet pour fonctionner car il s'appuie sur notre IA basée sur le cloud. Cependant, vous pouvez configurer des messages de secours pour les cas où les utilisateurs essaient d'interagir avec le bot pendant des problèmes de connectivité.",
        },
      ],
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white bg-fixed bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <main className="flex-grow">
        {/* Header with modern gradient */}
        <div className="relative text-white">
          {/* Background image with overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-purple-800/80 to-purple-700/70"></div>
          </div>

          <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-4">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <div className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg">
                  <BotMessageSquare size={23} />
                </div>
                <h1 className="text-2xl font-bold">ChatBot</h1>
              </Link>
            </div>
          </div>

          <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-16 sm:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Documentation ChatAssist</h1>
              <p className="text-xl md:text-2xl max-w-2xl mb-8 text-white/90 font-light">
                Tout ce que vous devez savoir pour maîtriser votre chatbot avec ChatAssist
              </p>
              <div className="h-1 w-24 bg-white/70 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation with modern styling */}
            <div className="md:w-1/4">
              <div className="sticky top-4 backdrop-blur-sm bg-white/80 rounded-xl shadow-lg shadow-purple-100/50 p-6 border border-purple-100/50">
                {/* Avatar with animation */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 blur-md opacity-30 animate-pulse"></div>
                    <img
                      src="https://i.pinimg.com/originals/7d/9b/1d/7d9b1d662b28cd365b33a01a3d0288e1.gif"
                      alt="Chatbot IA"
                      className="relative rounded-full border-2 border-white p-1 w-24 h-24 object-cover"
                    />
                  </div>
                </div>

                <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-purple-600" />
                  Contenu
                </h2>
                <nav className="space-y-2">
                  <button
                    onClick={() => scrollToSection("introduction")}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center ${
                      activeSection === "introduction"
                        ? "bg-purple-100/80 text-purple-800 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100/80"
                    }`}
                  >
                    <Book
                      className={`h-4 w-4 mr-3 ${activeSection === "introduction" ? "text-purple-600" : "text-gray-500"}`}
                    />
                    Introduction
                  </button>
                  <button
                    onClick={() => scrollToSection("faq")}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center ${
                      activeSection === "faq"
                        ? "bg-purple-100/80 text-purple-800 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100/80"
                    }`}
                  >
                    <HelpCircle
                      className={`h-4 w-4 mr-3 ${activeSection === "faq" ? "text-purple-600" : "text-gray-500"}`}
                    />
                    FAQ
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content with modern styling */}
            <div className="md:w-3/4">
              {/* Introduction Section */}
              <section
                id="introduction"
                className="mb-12 backdrop-blur-sm bg-white/90 rounded-xl shadow-lg shadow-purple-100/30 p-8 border border-purple-50"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <Book className="h-6 w-6 text-purple-600" />
                  </div>
                  Introduction à ChatAssist
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-6 text-lg leading-relaxed">
                    <strong className="text-purple-700">ChatAssist</strong> est une solution complète de chatbot conçue
                    pour simplifier les interactions avec les clients et le support. Notre plateforme intuitive aide les
                    entreprises de toutes tailles à interagir efficacement avec leurs clients, à répondre rapidement aux
                    questions et à fournir un support 24h/24 et 7j/7.
                  </p>
                  <p className="mb-8 text-lg leading-relaxed">
                    Que vous soyez propriétaire d'une petite entreprise, professionnel du marketing ou spécialiste du
                    support client, ChatAssist vous donne les outils nécessaires pour rester organisé et réactif. Notre
                    interface conviviale et nos fonctionnalités puissantes vous permettent de vous concentrer sur ce qui
                    compte le plus : le succès de votre entreprise.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                    <div className="bg-gradient-to-br from-purple-50/90 to-white/80 p-6 rounded-xl border border-purple-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                      <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-purple-800 mb-3">Réponses alimentées par l'IA</h3>
                      <p className="text-gray-600">
                        Fournissez automatiquement des réponses intelligentes et contextuelles aux demandes des clients.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50/90 to-white/80 p-6 rounded-xl border border-purple-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                      <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-purple-800 mb-3">Support multi-canal</h3>
                      <p className="text-gray-600">
                        Déployez votre chatbot sur votre site web, votre application mobile et vos plateformes de médias
                        sociaux.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50/90 to-white/80 p-6 rounded-xl border border-purple-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                      <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-purple-800 mb-3">Analyses et insights</h3>
                      <p className="text-gray-600">
                        Suivez les performances et obtenez des informations précieuses sur les besoins et le
                        comportement des clients.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* FAQ Section */}
              <section
                id="faq"
                className="mb-12 backdrop-blur-sm bg-white/90 rounded-xl shadow-lg shadow-purple-100/30 p-8 border border-purple-50"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <HelpCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  Foire Aux Questions
                </h2>

                <div className="space-y-10">
                  {faqSections.map((section) => (
                    <div key={section.id}>
                      <h3 className="text-xl font-semibold text-gray-800 mb-5 pb-2 border-b border-purple-100">
                        {section.title}
                      </h3>
                      <div className="space-y-4">
                        {section.questions.map((item) => (
                          <div
                            key={item.id}
                            className={`border border-gray-100 rounded-xl overflow-hidden transition-all ${
                              expandedQuestions[item.id] ? "shadow-md" : "shadow-sm hover:shadow"
                            }`}
                          >
                            <button
                              className={`w-full text-left p-5 flex justify-between items-center focus:outline-none transition-colors ${
                                expandedQuestions[item.id] ? "bg-purple-50/80" : "bg-white/80 hover:bg-gray-50/80"
                              }`}
                              onClick={() => handleQuestionToggle(item.id)}
                            >
                              <span
                                className={`font-medium ${expandedQuestions[item.id] ? "text-purple-800" : "text-gray-800"}`}
                              >
                                {item.question}
                              </span>
                              <div
                                className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                                  expandedQuestions[item.id]
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {expandedQuestions[item.id] ? (
                                  <ChevronUp className="h-5 w-5" />
                                ) : (
                                  <ChevronDown className="h-5 w-5" />
                                )}
                              </div>
                            </button>
                            <div
                              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                expandedQuestions[item.id] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                              }`}
                            >
                              <div className="p-5 bg-gradient-to-br from-purple-50/90 to-white/80 border-t border-purple-100">
                                <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default FAQ
