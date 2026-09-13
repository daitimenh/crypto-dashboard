// Navigation bar: Brand, Live API status indicator, Currency switch and Manual Refresh

import React from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { RefreshCw, Layers, TrendingUp } from 'lucide-react';

export const Navbar = () => {
  const { currency, setCurrency, refreshData, loading, isMockActive } = useCrypto();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="#" className="brand-logo" onClick={(e) => e.preventDefault()}>
            <div className="brand-icon-wrapper">
              <Layers size={22} color="#fff" />
            </div>
            <span>CryptoPulse<span style={{ color: 'var(--accent-cyan)' }}>.Analytics</span></span>
          </a>

          <span 
            className="badge-neutral" 
            style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}
          >
            <TrendingUp size={12} color="var(--accent-cyan)" />
            <span>Dashboard Theo Dõi Tỷ Giá Realtime</span>
          </span>
        </div>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* Status Indicator (API Live / Cache) */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.45rem', 
              fontSize: '0.775rem', 
              color: 'var(--text-secondary)',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-subtle)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)'
            }}
            title={isMockActive ? 'Đang chạy cơ chế Mock Data an toàn (Tránh 429)' : 'Dữ liệu trực tiếp từ CoinGecko REST API'}
          >
            <span 
              style={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                background: isMockActive ? 'var(--crypto-gold)' : 'var(--crypto-green)',
                boxShadow: isMockActive ? '0 0 8px var(--crypto-gold)' : '0 0 8px var(--crypto-green)'
              }} 
            />
            <span>{isMockActive ? 'Safe Mode' : 'CoinGecko Live API'}</span>
          </div>

          {/* Currency Selector (USD / VND) */}
          <select 
            className="currency-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            title="Đổi đơn vị hiển thị tỷ giá"
          >
            <option value="usd">USD ($)</option>
            <option value="vnd">VND (₫)</option>
          </select>

          {/* Manual Refresh Button */}
          <button 
            className="btn btn-outline btn-sm"
            onClick={refreshData}
            disabled={loading}
            title="Làm mới dữ liệu từ CoinGecko"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span style={{ fontSize: '0.78rem' }}>Làm mới</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
