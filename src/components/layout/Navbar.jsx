// Navigation bar: Tabs, Gas tracker, USD/VND currency switch and Web3 wallet connector

import React from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { WalletConnectButton } from '../web3/WalletConnectButton';
import { GasTracker } from '../web3/GasTracker';
import { LayoutDashboard, Briefcase, RefreshCw, Layers } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { currency, setCurrency, refreshData, loading, isMockActive } = useCrypto();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}>
            <div className="brand-icon-wrapper">
              <Layers size={22} color="#fff" />
            </div>
            <span>CryptoPulse<span style={{ color: 'var(--accent-cyan)' }}>.Web3</span></span>
          </a>

          {/* Navigation Tabs */}
          <div className="nav-links">
            <button 
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={16} />
              <span>Bảng Giá Thị Trường</span>
            </button>
            <button 
              className={`nav-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
              onClick={() => setActiveTab('portfolio')}
            >
              <Briefcase size={16} />
              <span>Danh Mục Đầu Tư (PnL)</span>
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* Status Indicator (API Live / Cache) */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              fontSize: '0.75rem', 
              color: 'var(--text-muted)' 
            }}
            title={isMockActive ? 'Đang chạy cơ chế Mock Data an toàn (Tránh 429)' : 'Dữ liệu trực tiếp từ CoinGecko'}
          >
            <span 
              style={{ 
                width: 7, 
                height: 7, 
                borderRadius: '50%', 
                background: isMockActive ? 'var(--crypto-gold)' : 'var(--crypto-green)' 
              }} 
            />
            <span style={{ display: 'none', md: 'inline' }}>
              {isMockActive ? 'Safe Mode' : 'Live API'}
            </span>
          </div>

          {/* Ethereum Gas Tracker */}
          <GasTracker />

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
            title="Làm mới dữ liệu thị trường"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>

          {/* Web3 Wallet Connect */}
          <WalletConnectButton />
        </div>
      </div>
    </nav>
  );
};
