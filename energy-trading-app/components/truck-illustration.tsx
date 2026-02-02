'use client'

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export function TruckIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Background glow effect - Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 bg-blue-500/10 rounded-full blur-[60px]" />
      </div>

      <motion.div
        className="relative z-10 w-[320px] h-[160px]"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Truck SVG */}
        <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main Body (Battery Container) - Black */}
          <path
            d="M20 40 H200 V120 H20 V40 Z"
            fill="#161821"
            className="drop-shadow-lg"
          />
          <path
            d="M20 40 H200 V120 H20 V40 Z"
            fill="#161821"
            stroke="#1F2333"
            strokeWidth="1"
          />

          {/* Cabin - Blue */}
          <path
            d="M200 60 H290 V120 H200 V60 Z"
            fill="#5E8BFF"
            className="drop-shadow-lg"
          />
          {/* Cabin Rounded Top Right */}
          <path
            d="M290 60 Q300 60 300 70 V120 H290 V60 Z"
            fill="#5E8BFF"
          />

          {/* Horizontal Strike Line */}
          <rect x="20" y="75" width="180" height="8" fill="#2C3249" />
          <rect x="200" y="75" width="100" height="8" fill="#7AA0FF" />

          {/* Yellow Headlight */}
          <rect x="300" y="70" width="12" height="24" rx="2" fill="#FCD34D" />

          {/* Wheels - Black with Blue Inner */}
          {/* Rear Wheel 1 */}
          <circle cx="70" cy="120" r="24" fill="#111318" />
          <circle cx="70" cy="120" r="10" fill="#3B82F6" />

          {/* Rear Wheel 2 */}
          <circle cx="150" cy="120" r="24" fill="#111318" />
          <circle cx="150" cy="120" r="10" fill="#3B82F6" />

          {/* Front Wheel */}
          <circle cx="250" cy="120" r="24" fill="#111318" />
          <circle cx="250" cy="120" r="10" fill="#3B82F6" />
        </svg>

        {/* Lightning Icon Overlay */}
        <div className="absolute top-[35px] left-[95px]">
          <Zap
            className="w-16 h-16 text-[#FCD34D]"
            fill="#FCD34D"
            strokeWidth={0}
            style={{ filter: "drop-shadow(0 0 10px rgba(252, 211, 77, 0.5))" }}
          />
        </div>
      </motion.div>
    </div>
  )
}
