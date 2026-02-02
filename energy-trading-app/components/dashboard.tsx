'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, Bell, Zap, Battery, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { PriceChart } from './price-chart'
import { BuyDrawer } from './buy-drawer'
import { SellDrawer } from './sell-drawer'

interface DashboardProps {
  onLogout: () => void
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [buyDrawerOpen, setBuyDrawerOpen] = useState(false)
  const [sellDrawerOpen, setSellDrawerOpen] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <motion.header 
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between px-4 h-14">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-xl hover:bg-secondary transition-colors relative"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-base font-bold text-foreground tracking-tight">
              ENERGY TRUCK
            </span>
          </div>
          
          <button className="p-2 rounded-xl hover:bg-secondary transition-colors relative">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </button>
        </div>
        
        {/* Dropdown Menu */}
        {showMenu && (
          <motion.div 
            className="absolute top-14 left-4 bg-card rounded-xl shadow-2xl border border-border p-2 min-w-[160px] z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button 
              onClick={() => setShowMenu(false)}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-sm font-medium text-foreground"
            >
              내 거래 내역
            </button>
            <button 
              onClick={() => setShowMenu(false)}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-sm font-medium text-foreground"
            >
              설정
            </button>
            <button 
              onClick={() => {
                setShowMenu(false)
                onLogout()
              }}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-sm font-medium text-destructive"
            >
              로그아웃
            </button>
          </motion.div>
        )}
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-5 pb-24 space-y-4 overflow-y-auto">
        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
              <Battery className="w-4 h-4 text-primary" />
              <span>보유 에너지</span>
            </div>
            <p className="text-xl font-bold text-foreground">42.5 <span className="text-sm font-medium text-muted-foreground">kWh</span></p>
            <p className="text-xs text-muted-foreground mt-1">약 10,625원</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>이번달 수익</span>
            </div>
            <p className="text-xl font-bold text-primary">+18,420<span className="text-sm font-medium">원</span></p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3 text-primary" />
              <span className="text-xs text-primary">12%</span>
              <span className="text-xs text-muted-foreground">지난달 대비</span>
            </div>
          </div>
        </motion.div>
        
        {/* Current Price Card */}
        <motion.div
          className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/70 text-sm">현재 에너지 가격</p>
              <p className="text-3xl font-bold text-primary-foreground mt-1">250원<span className="text-lg font-medium">/kWh</span></p>
            </div>
            <div className="w-14 h-14 bg-primary-foreground/10 rounded-xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1 bg-primary-foreground/20 rounded-lg px-2 py-1">
              <ArrowUpRight className="w-3 h-3 text-primary-foreground" />
              <span className="text-xs font-medium text-primary-foreground">+5.2%</span>
            </div>
            <span className="text-xs text-primary-foreground/70">오늘 오전 대비</span>
          </div>
        </motion.div>
        
        {/* Price Chart */}
        <PriceChart />
        
        {/* Recent Activity */}
        <motion.div
          className="bg-card rounded-2xl p-5 border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="font-semibold text-foreground mb-4">최근 거래</h3>
          <div className="space-y-3">
            {[
              { type: 'sell', amount: 5.2, price: 1300, time: '2시간 전' },
              { type: 'buy', amount: 10.0, price: 2450, time: '어제' },
              { type: 'sell', amount: 8.3, price: 2075, time: '3일 전' },
            ].map((tx, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type === 'sell' ? 'bg-primary/10' : 'bg-secondary'
                  }`}>
                    {tx.type === 'sell' ? (
                      <ArrowUpRight className="w-5 h-5 text-primary" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {tx.type === 'sell' ? '에너지 판매' : '에너지 구매'}
                    </p>
                    <p className="text-xs text-muted-foreground">{tx.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold text-sm ${tx.type === 'sell' ? 'text-primary' : 'text-foreground'}`}>
                    {tx.type === 'sell' ? '+' : '-'}{tx.price.toLocaleString()}원
                  </p>
                  <p className="text-xs text-muted-foreground">{tx.amount} kWh</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Action Footer */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-lg border-t border-border z-50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex gap-3">
          <button
            onClick={() => setBuyDrawerOpen(true)}
            className="flex-1 h-14 bg-secondary hover:bg-secondary/80 text-foreground font-bold text-base rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-border"
          >
            <Battery className="w-5 h-5" />
            충전하기
          </button>
          <button
            onClick={() => setSellDrawerOpen(true)}
            className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Zap className="w-5 h-5" />
            수익내기
          </button>
        </div>
      </motion.div>

      {/* Drawers */}
      <BuyDrawer open={buyDrawerOpen} onOpenChange={setBuyDrawerOpen} />
      <SellDrawer open={sellDrawerOpen} onOpenChange={setSellDrawerOpen} />
    </div>
  )
}
