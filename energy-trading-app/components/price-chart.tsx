'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

type TimeFilter = '1H' | '1D' | '1W'

function generateChartData(filter: TimeFilter) {
  const now = new Date()
  const data = []

  let points: number
  let interval: number

  switch (filter) {
    case '1H':
      points = 60
      interval = 1
      break
    case '1D':
      points = 24
      interval = 60
      break
    case '1W':
      points = 7
      interval = 1440
      break
  }

  let basePrice = 235
  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * interval * 60 * 1000)
    const fluctuation = (Math.random() - 0.45) * 15
    basePrice = Math.max(200, Math.min(300, basePrice + fluctuation))

    data.push({
      time: filter === '1H'
        ? time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        : filter === '1D'
          ? time.toLocaleTimeString('ko-KR', { hour: '2-digit' }) + '시'
          : time.toLocaleDateString('ko-KR', { weekday: 'short' }),
      price: Math.round(basePrice),
    })
  }

  return data
}

export function PriceChart() {
  const [filter, setFilter] = useState<TimeFilter>('1D')

  const data = useMemo(() => generateChartData(filter), [filter])

  const currentPrice = data[data.length - 1]?.price || 250
  const startPrice = data[0]?.price || 235
  const priceChange = currentPrice - startPrice
  const percentChange = ((priceChange / startPrice) * 100).toFixed(1)
  const isPositive = priceChange >= 0

  const filters: TimeFilter[] = ['1H', '1D', '1W']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-card rounded-2xl p-5 border border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">가격 추이</p>

        {/* Time Filters */}
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${filter === f
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[160px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#8B949E' }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={['dataMin - 10', 'dataMax + 10']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#8B949E' }}
              width={40}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#21262D',
                border: '1px solid #30363D',
                borderRadius: '12px',
                padding: '8px 12px',
              }}
              labelStyle={{ color: '#8B949E', fontSize: 11 }}
              itemStyle={{ color: '#F0F6FC', fontSize: 13, fontWeight: 600 }}
              formatter={(value: number) => [`${value.toLocaleString()}원`, '가격']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-border mt-3">
        <div>
          <p className="text-xs text-muted-foreground">시작가</p>
          <p className="text-sm font-medium text-foreground">{startPrice.toLocaleString()}원</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">변동</p>
          <p className={`text-sm font-medium ${isPositive ? 'text-primary' : 'text-destructive'}`}>
            {isPositive ? '+' : ''}{priceChange}원 ({isPositive ? '+' : ''}{percentChange}%)
          </p>
        </div>
      </div>
    </motion.div>
  )
}
