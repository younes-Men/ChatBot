// import React from "react"
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
// import { AuthProvider } from "./context/AuthContext"
// import { ChatProvider } from "./context/ChatContext"
// import { MessageProvider } from "./context/MessageContext"
// import PrivateRoute from "./Components/PrivateRoute"

// import Home from "./Pages/Home"
// import ChatInterface from "./pages/interface_chat"
// import SignUp from "./Components/SignUp"
// import Login from "./Components/Login"
// import ChatbotArchives from "./Components/archives"

// export default function App() {
//   return (
//     <AuthProvider>
//       <ChatProvider>
//         <MessageProvider>
//           <BrowserRouter>
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route
//                 path="/chat"
//                 element={
//                   <PrivateRoute>
//                     <ChatInterface />
//                   </PrivateRoute>
//                 }
//               />
//               <Route path="/login" element={<Login />} />
//               <Route path="/signup" element={<SignUp />} />
//               <Route
//                 path="/archives"
//                 element={
//                   <PrivateRoute>
//                     <ChatbotArchives />
//                   </PrivateRoute>
//                 }
//               />
//               <Route path="*" element={<Navigate to="/" replace />} />
//             </Routes>
//           </BrowserRouter>
//         </MessageProvider>
//       </ChatProvider>
//     </AuthProvider>
//   )
// }

import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ChatProvider } from "./context/ChatContext"
import { MessageProvider } from "./context/MessageContext"
import PrivateRoute from "./Components/PrivateRoute"

import Home from "./Pages/Home"
import ChatInterface from "./pages/interface_chat"
import VoiceChat from "./pages/voice-chat" // Import the new VoiceChat component
import SignUp from "./Components/SignUp"
import Login from "./Components/Login"
import ChatbotArchives from "./Components/archives"

export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <MessageProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/chat"
                element={
                  <PrivateRoute>
                    <ChatInterface />
                  </PrivateRoute>
                }
              />
              <Route
                path="/voice-chat"
                element={
                  <PrivateRoute>
                    <VoiceChat />
                  </PrivateRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/archives"
                element={
                  <PrivateRoute>
                    <ChatbotArchives />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </MessageProvider>
      </ChatProvider>
    </AuthProvider>
  )
}
