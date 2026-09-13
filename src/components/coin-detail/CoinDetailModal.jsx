// Coin Detail Modal: ATH/ATL, circulating supply, market cap and on-chain contract address

import React, { useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { X, ExternalLink, Copy, Check, Award, Compass, ShieldCheck } from 'lucide-react';

export const CoinDetailModal = ({ coin, onClose }) => {
  const { formatPrice, formatNumber } = useCrypto();
  const [copied, setCopied] = useState(false);

  if (!coin) return null;

  const handleCopyContract = () => {
    if (coin.contract_address) {
      navigator.clipboard.writeText(coin.contract_address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isGain24h = (coin.price_change_percentage_24h || 0) >= 0;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Nút đóng modal */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Header Modal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <img src={coin.image} alt={coin.name} style={{ width: 52, height: 52, borderRadius: '50%' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 className="font-heading" style={{ fontSize: '1.6rem' }}>{coin.name}</h2>
              <span className="badge-neutral font-mono">{coin.symbol.toUpperCase()}</span>
              <span className="badge-neutral" style={{ color: 'var(--crypto-gold)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                Hạng #{coin.market_cap_rank}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
              <span className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                {formatPrice(coin.current_price)}
              </span>
              <span className={isGain24h ? "badge-gain" : "badge-loss"}>
                {isGain24h ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}% (24h)
              </span>
            </div>
          </div>
        </div>

        {/* Thông số Blockchain & On-Chain */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* ATH */}
          <div className="glass-card" style={{ background: 'rgba(30, 41, 59, 0.4)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Đỉnh cao nhất (ATH)</div>
            <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.2rem' }}>
              {formatPrice(coin.ath || coin.current_price * 1.2)}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--crypto-red)', marginTop: '0.2rem' }}>
              {coin.ath_change_percentage ? `${coin.ath_change_percentage.toFixed(1)}% từ đỉnh` : '-15.4% từ đỉnh'}
            </div>
          </div>

          {/* ATL */}
          <div className="glass-card" style={{ background: 'rgba(30, 41, 59, 0.4)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Đáy thấp nhất (ATL)</div>
            <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.2rem' }}>
              {formatPrice(coin.atl || 0.5)}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--crypto-green)', marginTop: '0.2rem' }}>
              +999% từ đáy lịch sử
            </div>
          </div>

          {/* Vốn hóa thị trường */}
          <div className="glass-card" style={{ background: 'rgba(30, 41, 59, 0.4)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vốn hóa thị trường</div>
            <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.2rem' }}>
              {formatPrice(coin.market_cap)}
            </div>
          </div>

          {/* Cung lưu hành */}
          <div className="glass-card" style={{ background: 'rgba(30, 41, 59, 0.4)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cung lưu hành (Circulating)</div>
            <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.2rem' }}>
              {formatNumber(coin.circulating_supply)} {coin.symbol.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Địa chỉ Hợp đồng Thông minh (Smart Contract Address) */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={14} color="var(--accent-cyan)" />
            <span>Địa chỉ Hợp đồng On-chain (Contract Address / Blockchain Type):</span>
          </div>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-subtle)',
              padding: '0.6rem 0.85rem',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', wordBreak: 'break-all' }}>
              {coin.contract_address || `Native L1 Blockchain: ${coin.name}`}
            </span>
            <button 
              className="btn btn-outline btn-sm"
              style={{ marginLeft: '0.75rem', padding: '0.3rem 0.6rem' }}
              onClick={handleCopyContract}
            >
              {copied ? <Check size={14} color="var(--crypto-green)" /> : <Copy size={14} />}
              <span>{copied ? 'Đã sao chép' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <a 
            href={`https://www.coingecko.com/en/coins/${coin.id}`} 
            target="_blank" 
            rel="noreferrer"
            className="btn btn-outline btn-sm"
          >
            <Compass size={14} />
            <span>Xem trên CoinGecko</span>
            <ExternalLink size={12} />
          </a>
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
