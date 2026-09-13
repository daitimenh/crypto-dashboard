// Market Trends: Top Gainers, Top Losers and Highest Volume assets in 24h

import React from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { TrendingUp, TrendingDown, Flame, BarChart2 } from 'lucide-react';

export const MarketTrends = ({ onSelectCoin }) => {
  const { coins, formatPrice, loading } = useCrypto();

  if (loading || !coins || coins.length < 5) return null;

  // 1. Top 3 Gainers (Tăng mạnh nhất 24h)
  const topGainers = [...coins]
    .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
    .slice(0, 3);

  // 2. Top 3 Losers (Giảm mạnh nhất 24h)
  const topLosers = [...coins]
    .sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0))
    .slice(0, 3);

  // 3. Top 3 Volume (Khối lượng giao dịch lớn nhất 24h)
  const topVolume = [...coins]
    .sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0))
    .slice(0, 3);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
      {/* Cột 1: Top Tăng Trưởng (Gainers) */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
            <TrendingUp size={18} color="var(--crypto-green)" />
            <span>Top Tăng Mạnh 24H</span>
          </div>
          <span className="badge-gain" style={{ fontSize: '0.7rem' }}>Gainers</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {topGainers.map((coin, index) => (
            <div 
              key={coin.id}
              onClick={() => onSelectCoin(coin)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.6rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.03)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: 14 }}>{index + 1}</span>
                <img src={coin.image} alt={coin.name} style={{ width: 24, height: 24, borderRadius: '50%' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{coin.name}</div>
                  <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{coin.symbol.toUpperCase()}</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{formatPrice(coin.current_price)}</div>
                <div className="badge-gain" style={{ padding: '0.1rem 0.35rem', fontSize: '0.7rem' }}>
                  +{coin.price_change_percentage_24h?.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cột 2: Top Giảm Sâu (Losers) */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
            <TrendingDown size={18} color="var(--crypto-red)" />
            <span>Top Giảm Sâu 24H</span>
          </div>
          <span className="badge-loss" style={{ fontSize: '0.7rem' }}>Losers</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {topLosers.map((coin, index) => (
            <div 
              key={coin.id}
              onClick={() => onSelectCoin(coin)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.6rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.03)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: 14 }}>{index + 1}</span>
                <img src={coin.image} alt={coin.name} style={{ width: 24, height: 24, borderRadius: '50%' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{coin.name}</div>
                  <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{coin.symbol.toUpperCase()}</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{formatPrice(coin.current_price)}</div>
                <div className="badge-loss" style={{ padding: '0.1rem 0.35rem', fontSize: '0.7rem' }}>
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cột 3: Khối Lượng Giao Dịch Lớn Nhất (High Volume) */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
            <Flame size={18} color="var(--crypto-gold)" />
            <span>Khối Lượng Khủng 24H</span>
          </div>
          <span className="badge-neutral" style={{ color: 'var(--crypto-gold)', borderColor: 'rgba(245, 158, 11, 0.3)', fontSize: '0.7rem' }}>Volume</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {topVolume.map((coin, index) => (
            <div 
              key={coin.id}
              onClick={() => onSelectCoin(coin)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.6rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.03)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: 14 }}>{index + 1}</span>
                <img src={coin.image} alt={coin.name} style={{ width: 24, height: 24, borderRadius: '50%' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{coin.name}</div>
                  <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{coin.symbol.toUpperCase()}</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{formatPrice(coin.current_price)}</div>
                <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  ${(coin.total_volume / 1e9).toFixed(1)}B Vol
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
