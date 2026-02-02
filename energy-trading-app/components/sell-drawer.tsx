'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'
import { Zap, Truck, Calculator, MapPin, CheckCircle2 } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'

interface SellDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Step = 'input' | 'result' | 'active'

export function SellDrawer({ open, onOpenChange }: SellDrawerProps) {
  const [step, setStep] = useState<Step>('input')
  const [area, setArea] = useState('')
  const [isCalculating, setIsCalculating] = useState(false)
  const [isListingActive, setIsListingActive] = useState(false)
  const [calculatedEnergy, setCalculatedEnergy] = useState(0)
  const [calculatedProfit, setCalculatedProfit] = useState(0)
  
  useEffect(() => {
    if (!open) {
      setStep('input')
      setArea('')
      setIsCalculating(false)
      setIsListingActive(false)
      setCalculatedEnergy(0)
      setCalculatedProfit(0)
    }
  }, [open])
  
  const handleCalculate = () => {
    if (!area || Number.parseFloat(area) <= 0) return
    setIsCalculating(true)
    
    setTimeout(() => {
      const areaNum = Number.parseFloat(area)
      const dailyEnergy = (areaNum * 0.15 * 5)
      const monthlyEnergy = dailyEnergy * 30
      const surplusEnergy = monthlyEnergy * 0.7
      const profit = surplusEnergy * 250
      
      setCalculatedEnergy(Math.round(surplusEnergy * 10) / 10)
      setCalculatedProfit(Math.round(profit))
      setIsCalculating(false)
      setStep('result')
    }, 1500)
  }
  
  const handleActivateListing = () => {
    setIsListingActive(true)
    setStep('active')
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-card border-border rounded-t-3xl">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            에너지 판매하기
          </DrawerTitle>
          <DrawerDescription className="text-muted-foreground">
            잉여 에너지를 판매하고 수익을 얻으세요
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 pb-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Input Area */}
            {step === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* Step Indicator */}
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <span className="font-medium text-foreground">설치 면적 입력</span>
                </div>
                
                {/* Area Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    태양광 패널 설치 면적 (m2)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="0"
                      className="w-full h-14 px-4 pr-16 text-2xl font-bold bg-secondary rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground placeholder:text-muted-foreground"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                      m2
                    </span>
                  </div>
                  
                  {/* Quick Select */}
                  <div className="flex gap-2">
                    {[10, 20, 50, 100].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setArea(String(amount))}
                        className="flex-1 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-sm font-medium text-foreground transition-colors border border-border"
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Info Box */}
                <div className="bg-secondary rounded-xl p-4 text-sm text-muted-foreground border border-border">
                  <p>
                    설치 면적을 입력하면 예상 잉여 에너지와 수익을 계산해 드립니다.
                    실제 수익은 날씨, 계절 등에 따라 달라질 수 있습니다.
                  </p>
                </div>
                
                {/* Calculate Button */}
                <button
                  onClick={handleCalculate}
                  disabled={!area || Number.parseFloat(area) <= 0 || isCalculating}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCalculating ? (
                    <>
                      <Spinner className="w-5 h-5" />
                      계산중...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-5 h-5" />
                      예상 수익 계산하기
                    </>
                  )}
                </button>
              </motion.div>
            )}
            
            {/* Step 2: Result */}
            {step === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-5"
              >
                {/* Step Indicator */}
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <span className="font-medium text-foreground">예상 수익 확인</span>
                </div>
                
                {/* Results */}
                <div className="space-y-3">
                  <div className="bg-secondary rounded-xl p-4 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">예상 잉여 에너지 (월)</p>
                    <p className="text-2xl font-bold text-foreground">
                      {calculatedEnergy.toLocaleString()} <span className="text-base font-medium text-muted-foreground">kWh</span>
                    </p>
                  </div>
                  
                  <div className="bg-primary rounded-xl p-4">
                    <p className="text-sm text-primary-foreground/80 mb-1">예상 월 수익</p>
                    <p className="text-2xl font-bold text-primary-foreground">
                      {calculatedProfit.toLocaleString()}원
                    </p>
                    <p className="text-xs text-primary-foreground/70 mt-2">
                      연간 약 {(calculatedProfit * 12).toLocaleString()}원 예상
                    </p>
                  </div>
                </div>
                
                {/* Toggle */}
                <div className="bg-secondary rounded-xl p-4 border border-border flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">판매 리스팅 활성화</p>
                    <p className="text-xs text-muted-foreground">활성화하면 트럭이 에너지를 수거합니다</p>
                  </div>
                  <Switch
                    checked={isListingActive}
                    onCheckedChange={setIsListingActive}
                  />
                </div>
                
                {/* Activate Button */}
                <button
                  onClick={handleActivateListing}
                  disabled={!isListingActive}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  판매 시작하기
                </button>
                
                <button
                  onClick={() => setStep('input')}
                  className="w-full h-11 text-muted-foreground hover:text-foreground font-medium transition-colors text-sm"
                >
                  다시 계산하기
                </button>
              </motion.div>
            )}
            
            {/* Step 3: Active Listing */}
            {step === 'active' && (
              <motion.div
                key="active"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-5"
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </motion.div>
                
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground">판매 리스팅 활성화됨!</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    트럭이 에너지를 수거하러 이동중입니다
                  </p>
                </div>
                
                {/* Truck Info Card */}
                <div className="bg-secondary rounded-xl p-4 border border-border space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center border border-border">
                      <Truck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Truck #1024</p>
                      <p className="text-primary font-medium text-sm">ETA: 8분</p>
                    </div>
                  </div>
                  
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">수거 진행</span>
                      <span className="text-foreground font-medium">이동중</span>
                    </div>
                    <div className="h-1.5 bg-card rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: '0%' }}
                        animate={{ width: '30%' }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                  
                  {/* Live Status */}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-muted-foreground">실시간 위치 추적중</span>
                  </div>
                </div>
                
                {/* Map Preview */}
                <div className="relative h-[120px] bg-secondary rounded-xl overflow-hidden border border-border">
                  <div className="absolute inset-0 bg-[#161B22]">
                    <div className="absolute inset-0 opacity-30">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={`h-${i}`}
                          className="absolute w-full h-px bg-border"
                          style={{ top: `${(i + 1) * 16.67}%` }}
                        />
                      ))}
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={`v-${i}`}
                          className="absolute w-px h-full bg-border"
                          style={{ left: `${(i + 1) * 16.67}%` }}
                        />
                      ))}
                    </div>
                    
                    <div className="absolute bottom-1/4 right-1/4">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    
                    <motion.div 
                      className="absolute"
                      initial={{ top: '20%', left: '20%' }}
                      animate={{ 
                        top: ['20%', '40%', '60%'],
                        left: ['20%', '50%', '65%'],
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: 'reverse'
                      }}
                    >
                      <div className="bg-secondary p-1 rounded-md border border-border">
                        <Truck className="w-3.5 h-3.5 text-primary" />
                      </div>
                    </motion.div>
                  </div>
                </div>
                
                <button
                  onClick={() => onOpenChange(false)}
                  className="w-full h-14 bg-secondary hover:bg-secondary/80 text-foreground font-bold text-base rounded-xl transition-all active:scale-[0.98] border border-border"
                >
                  확인
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
