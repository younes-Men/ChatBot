import React from "react"
import { MessageCircle, Heart } from 'lucide-react'
import imagef from '../image/imageFooter.gif'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-pink-50 to-purple-100 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg relative">
              <img src={imagef || "/placeholder.svg"} alt="Robochat" className="w-full h-full object-cover" />
            </div>
            <div
              className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full 
                transform transition-all duration-700 ease-in-out"
            ></div>
            <div
              className="absolute -bottom-3 -left-3 w-6 h-6 bg-teal-400 rounded-full 
                transform transition-all duration-700 ease-in-out"
            ></div>
            <div
              className="absolute top-1/4 -left-4 w-4 h-4 bg-pink-400 rounded-full 
                transform transition-all duration-700 ease-in-out"
            ></div>
          </div>

          <div className="text-center mt-4">
            <span className="text-xl font-bold text-purple-900">Bienvenue</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-purple-600 text-white p-2 rounded-lg">
              <MessageCircle size={20} />
            </div>
            <span className="text-xl font-bold text-purple-900">chatbot</span>
          </div>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Transformer les conversations grâce à l'intelligence artificielle avancée. Notre chatbot utilise des technologies de pointe pour offrir une expérience de conversation fluide et interactive, permettant une assistance instantanée et efficace.
          </p>
        </div>

        <div className="w-full border-t border-purple-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-purple-600 text-white p-1 rounded-md mr-2">
                <MessageCircle size={14} />
              </div>
              <p className="text-gray-600 text-sm">© 2025 Votre assistant intelligent.</p>
            </div>
            <div className="flex space-x-6">
              <div className="mt-4 md:mt-0 items-center">
                <span className="text-sm text-gray-500 flex items-center">
                  Réalisé avec <Heart className="h-3 w-3 text-red-500 mx-1" /> par l'équipe chatBot
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}