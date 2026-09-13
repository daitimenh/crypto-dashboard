// Macro Market Overview: Total Market Cap, 24h Volume, BTC Dominance and Active Projects

import React from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { TrendingUp, TrendingDown, Activity, DollarSign, PieChart, Zap } from 'lucide-react';

export const MarketOverview = () => {
  const { globalData, formatPrice, formatNumber, loading } = useCrypto();

  if (loading && !globalData) {
    return (
      <div className="market-stats-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card stat-card skeleton" style={{ height: '100px' }} />
        ))}
      </div>
    );
  }

  const totalCap = globalData?.total_market_cap?.usd || 0;
  const totalVol = globalData?.total_volume?.usd || 0;
  const btcDominance = globalData?.market_cap_percentage?.btc || 0;
  const change24h = globalData?.market_cap_change_percentage_24h_usd || 0;
  const isPositive = change24h >= 0;

  return (
    <div className="market-stats-grid">
      {/* 1. Tổng vốn hóa */}
      <div className="glass-card stat-card">
        <div className="stat-label">
          <span>Tổng Vốn Hóa (Total M.Cap)</span>
          <DollarSign size={16} color="var(--accent-primary)" />
        </div>
        <div className="stat-value font-mono">
          {formatPrice(totalCap)}
        </div>
        <div className="stat-sub">
          <span className={isPositive ? "badge-gain" : "badge-loss"}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change24h).toFixed(2)}% (24h)
          </span>
          <span style={{ color: 'var(--text-muted)' }}>thị trường chung</span>
        </div>
      </div>

      {/* 2. Khối lượng giao dịch 24h */}
      <div className="glass-card stat-card">
        <div className="stat-label">
          <span>Khối lượng 24H (24h Volume)</span>
          <Activity size={16} color="var(--accent-cyan)" />
        </div>
        <div className="stat-value font-mono">
          {formatPrice(totalVol)}
        </div>
        <div className="stat-sub">
          <span className="badge-neutral font-mono">
            {formatNumber(totalVol / 1e9)} Tỷ USD
          </span>
          <span style={{ color: 'var(--text-muted)' }}>tổng giao dịch</span>
        </div>
      </div>

      {/* 3. Tỷ lệ thống trị Bitcoin (BTC Dominance) */}
      <div className="glass-card stat-card">
        <div className="stat-label">
          <span>Thống trị Bitcoin (BTC.D)</span>
          <PieChart size={16} color="var(--crypto-gold)" />
        </div>
        <div className="stat-value font-mono" style={{ color: 'var(--crypto-gold)' }}>
          {btcDominance.toFixed(1)}%
        </div>
        <div className="stat-sub">
          <span className="badge-neutral font-mono">ETH: {globalData?.market_cap_percentage?.eth?.toFixed(1) || 15}%</span>
          <span style={{ color: 'var(--text-muted)' }}>thị phần crypto</span>
        </div>
      </div>

      {/* 4. Tổng số Crypto & Sàn */}
      <div className="glass-card stat-card">
        <div className="stat-label">
          <span>Mạng lưới & Dự án Active</span>
          <Zap size={16} color="var(--accent-purple)" />
        </div>
        <div className="stat-value font-mono">
          {globalData?.active_cryptocurrencies?.toLocaleString() || '14,000+'}
        </div>
        <div className="stat-sub">
          <span className="badge-neutral">
            {globalData?.markets || 1100} sàn giao dịch
          </span>
          <span style={{ color: 'var(--crypto-green)' }}>● Real-time</span>
        </div>
      </div>
    </div>
  );
};
