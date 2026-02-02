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
import { KakaoMap } from '@/components/kakao-map'
import { MapPin, Truck, Battery, CheckCircle2 } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

interface BuyDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BuyDrawer({ open, onOpenChange }: BuyDrawerProps) {
  const [energy, setEnergy] = useState('')
  const [isOrdering, setIsOrdering] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  const pricePerKwh = 250
  const calculatedPrice = energy ? Number.parseFloat(energy) * pricePerKwh : 0

  useEffect(() => {
    if (!open) {
      setEnergy('')
      setIsOrdering(false)
      setOrderComplete(false)
    }
  }, [open])

  const handleOrder = () => {
    if (!energy || Number.parseFloat(energy) <= 0) return
    setIsOrdering(true)

    setTimeout(() => {
      setIsOrdering(false)
      setOrderComplete(true)
    }, 2000)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-card border-border rounded-t-3xl">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
              <Battery className="w-5 h-5 text-primary" />
            </div>
            에너지 충전하기
          </DrawerTitle>
          <DrawerDescription className="text-muted-foreground">
            원하는 만큼의 에너지를 충전하세요
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-8 space-y-5">
          <AnimatePresence mode="wait">
            {!orderComplete ? (
              <motion.div
                key="order-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {/* Map Area */}
                <div className="relative h-[200px] bg-secondary rounded-xl overflow-hidden border border-border">
                  <KakaoMap
                    center={{ lat: 33.4996, lng: 126.5312 }}
                    level={9}
                    markers={[
                      {
                        position: { lat: 33.5050, lng: 126.5350 },
                        title: 'Truck #1024',
                        content: '<strong>Truck #1024</strong><br/>이동중',
                      },
                      {
                        position: { lat: 33.4950, lng: 126.5250 },
                        title: '내 위치',
                        content: '<strong>내 위치</strong>',
                      }
                    ]}
                    className="h-full w-full"
                  />

                  {/* Overlay Info */}
                  <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2 border border-border shadow-lg z-10">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-foreground">주변 트럭 3대 대기중</span>
                  </div>
                </div>

                {/* Energy Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    충전할 에너지 (kWh)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={energy}
                      onChange={(e) => setEnergy(e.target.value)}
                      placeholder="0"
                      className="w-full h-14 px-4 pr-16 text-2xl font-bold bg-secondary rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground placeholder:text-muted-foreground"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                      kWh
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {[5, 10, 20, 50].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setEnergy(String(amount))}
                        className="flex-1 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-sm font-medium text-foreground transition-colors border border-border"
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Calculation */}
                <div className="bg-secondary rounded-xl p-4 space-y-2 border border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">단가</span>
                    <span className="text-foreground">{pricePerKwh.toLocaleString()}원/kWh</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">수량</span>
                    <span className="text-foreground">{energy || 0} kWh</span>
                  </div>
                  <div className="border-t border-border pt-2 mt-2" />
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">예상 결제금액</span>
                    <span className="text-xl font-bold text-primary">
                      {calculatedPrice.toLocaleString()}원
                    </span>
                  </div>
                </div>

                {/* Order Button */}
                <button
                  onClick={handleOrder}
                  disabled={!energy || Number.parseFloat(energy) <= 0 || isOrdering}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isOrdering ? (
                    <>
                      <Spinner className="w-5 h-5" />
                      주문 처리중...
                    </>
                  ) : (
                    '충전 주문하기'
                  )}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="order-complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center space-y-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground">주문 완료!</h3>
                <p className="text-muted-foreground text-sm">
                  {energy} kWh 에너지 충전이 요청되었습니다.
                  <br />
                  트럭이 곧 도착합니다.
                </p>
                <div className="bg-secondary rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-card rounded-lg flex items-center justify-center border border-border">
                      <Truck className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Truck #1024</p>
                      <p className="text-sm text-muted-foreground">예상 도착: 약 15분</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="w-full h-14 bg-secondary hover:bg-secondary/80 text-foreground font-bold text-base rounded-xl transition-all active:scale-[0.98] mt-4 border border-border"
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
