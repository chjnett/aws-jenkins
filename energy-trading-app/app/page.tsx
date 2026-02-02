'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LoginScreen } from '@/components/login-screen'
import { Dashboard } from '@/components/dashboard'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <main className="min-h-screen">
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoginScreen onLogin={() => setIsLoggedIn(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard onLogout={() => setIsLoggedIn(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
