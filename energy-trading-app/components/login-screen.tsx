'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TruckIllustration } from './truck-illustration'
import { Zap, Moon } from 'lucide-react'

interface LoginScreenProps {
  onLogin: () => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false)

  const [stars, setStars] = useState<Array<{ id: number; style: any }>>([])

  useEffect(() => {
    const newStars = [...Array(20)].map((_, i) => ({
      id: i,
      style: {
        width: Math.random() * 2 + 1 + 'px',
        height: Math.random() * 2 + 1 + 'px',
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        animationDuration: Math.random() * 3 + 2 + 's',
      },
    }))
    setStars(newStars)
  }, [])

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onLogin()
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#05060A] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Background Starry Effect - Simplified for performance */}
      <div className="absolute inset-0 z-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white opacity-40 animate-pulse"
            style={star.style}
          />
        ))}
      </div>

      {/* Background Gradient Lines */}
      <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent top-1/3" />
      <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-900/10 to-transparent bottom-1/3" />

      {/* Header Section */}
      <motion.header
        className="pt-16 pb-2 text-center relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Top Badge */}
        <div className="mb-8 relative">
          <div className="bg-[#1A1E2E] px-4 py-1.5 rounded-full flex items-center gap-2 border border-blue-500/10">
            <Zap className="w-3 h-3 text-blue-500" fill="currentColor" />
            <span className="text-[10px] fon-bold tracking-widest text-blue-300">NEXT GEN P2P ENERGY</span>
          </div>
          {/* Dark Mode Icon */}
          <div className="absolute -right-16 top-0 w-8 h-8 bg-[#1A1E2E] rounded-full flex items-center justify-center border border-blue-500/10">
            <Moon className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Logo Text */}
        <h1 className="text-4xl font-black tracking-tight mb-2">
          ENERGY <span className="text-[#5E8BFF] italic">TRUCK</span>
        </h1>
        <p className="text-gray-400 text-xs font-medium tracking-wide">
          대한민국 No.1 에너지 직거래 네트워크
        </p>
      </motion.header>

      {/* Main Illustration */}
      <motion.div
        className="flex-1 flex items-center justify-center relative z-10 py-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <TruckIllustration />
      </motion.div>

      {/* Login Section */}
      <motion.div
        className="px-6 pb-12 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="text-center mb-6">
          <p className="text-xs text-gray-500 font-medium">간편 로그인</p>
          <div className="h-[1px] w-24 bg-gray-800 mx-auto mt-3" />
        </div>

        <div className="flex justify-center gap-4">
          {/* Kakao Login */}
          <button
            onClick={() => handleSocialLogin('kakao')}
            className="w-14 h-14 bg-[#1A1E2E] hover:bg-[#252A40] rounded-2xl flex items-center justify-center transition-all active:scale-95 border border-gray-800"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FEE500">
              <path d="M12 3C6.477 3 2 6.463 2 10.697c0 2.727 1.819 5.117 4.545 6.474-.2.742-.726 2.687-.832 3.102-.13.511.188.504.396.367.163-.109 2.599-1.766 3.653-2.485.733.105 1.486.16 2.238.16 5.523 0 10-3.463 10-7.697C22 6.463 17.523 3 12 3z" />
            </svg>
          </button>

          {/* Naver Login */}
          <button
            onClick={() => handleSocialLogin('naver')}
            className="w-14 h-14 bg-[#1A1E2E] hover:bg-[#252A40] rounded-2xl flex items-center justify-center transition-all active:scale-95 border border-gray-800"
          >
            <span className="text-white font-black text-xl">N</span>
          </button>

          {/* Google Login */}
          <button
            onClick={() => handleSocialLogin('google')}
            className="w-14 h-14 bg-[#1A1E2E] hover:bg-[#252A40] rounded-2xl flex items-center justify-center transition-all active:scale-95 border border-gray-800"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </button>

          {/* Apple Login */}
          <button
            onClick={() => handleSocialLogin('apple')}
            className="w-14 h-14 bg-[#1A1E2E] hover:bg-[#252A40] rounded-2xl flex items-center justify-center transition-all active:scale-95 border border-gray-800"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
          </button>
        </div>

        <p className="text-center text-[10px] text-gray-600 mt-8">
          로그인 시 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </motion.div>
    </div>
  )
}
