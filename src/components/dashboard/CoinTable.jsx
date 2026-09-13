// Ranked Coin Table with 7D sparklines, category filters and sorting

import React, { useState, useMemo } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { Search, TrendingUp, TrendingDown, Eye, PlusCircle, ArrowUpDown } from 'lucide-react';

export const CoinTable = ({ onOpenDetail, onQuickAddToPortfolio }) => {
  const { coins, selectedCoin, setSelectedCoin, formatPrice, formatNumber, loading } = useCrypto();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortField, setSortField] = useState('market_cap_rank');
  const [sortAsc, setSortAsc] = useState(true);

  // Danh mục phân loại Web3
  const categories = [
    { id: 'all', label: 'Tất cả (All)' },
    { id: 'layer1', label: 'Layer 1' },
    { id: 'defi', label: 'DeFi' },
    { id: 'stablecoin', label: 'Stablecoin' },
    { id: 'meme', label: 'Meme Coins' }
  ];

  // Helper lọc theo danh mục
  const filterByCategory = (coin, cat) => {
    if (cat === 'all') return true;
    const sym = coin.symbol.toLowerCase();
    if (cat === 'stablecoin') return ['usdt', 'usdc', 'dai'].includes(sym);
    if (cat === 'layer1') return ['btc', 'eth', 'sol', 'bnb', 'ada', 'avax', 'dot'].includes(sym);
    if (cat === 'defi') return ['uni', 'aave', 'mkr', 'link'].includes(sym);
    if (cat === 'meme') return ['doge', 'shib', 'pepe', 'floki'].includes(sym);
    return true;
  };

  const filteredAndSortedCoins = useMemo(() => {
    return coins
      .filter(coin => {
        const matchesSearch = 
          coin.name.toLowerCase().includes(search.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filterByCategory(coin, category);
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        return sortAsc ? (valA - valB) : (valB - valA);
      });
  }, [coins, search, category, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === 'market_cap_rank');
    }
  };

  // Vẽ biểu đồ nhỏ (Sparkline) 7 ngày
  const renderSparkline = (prices, isGain) => {
    if (!prices || prices.length < 2) return null;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    const w = 110;
    const h = 32;

    const points = prices.map((p, i) => {
      const x = (i / (prices.length - 1)) * w;
      const y = h - ((p - min) / range) * (h - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const color = isGain ? '#10b981' : '#f43f5e';

    return (
      <svg className="sparkline-svg" viewBox={`0 0 ${w} ${h}`}>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="glass-card" style={{ marginTop: '2rem' }}>
      {/* Search & Filter Header */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm theo tên coin hoặc ký hiệu (BTC, ETH, SOL)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="category-pills">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-pill ${category === cat.id ? 'active' : ''}`}
              onClick={() => setCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="table-container">
        <table className="crypto-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('market_cap_rank')} style={{ cursor: 'pointer', width: '50px' }}>
                # <ArrowUpDown size={12} style={{ display: 'inline' }} />
              </th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                Tài sản (Asset)
              </th>
              <th onClick={() => handleSort('current_price')} style={{ cursor: 'pointer', textAlign: 'right' }}>
                Giá hiện tại <ArrowUpDown size={12} style={{ display: 'inline' }} />
              </th>
              <th onClick={() => handleSort('price_change_percentage_24h')} style={{ cursor: 'pointer', textAlign: 'right' }}>
                24H % <ArrowUpDown size={12} style={{ display: 'inline' }} />
              </th>
              <th style={{ textAlign: 'right' }}>7D %</th>
              <th onClick={() => handleSort('total_volume')} style={{ cursor: 'pointer', textAlign: 'right' }}>
                Khối lượng 24h
              </th>
              <th onClick={() => handleSort('market_cap')} style={{ cursor: 'pointer', textAlign: 'right' }}>
                Vốn hóa (Market Cap)
              </th>
              <th style={{ textAlign: 'center' }}>Xu hướng 7D</th>
              <th style={{ textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedCoins.map((coin) => {
              const isSelected = selectedCoin?.id === coin.id;
              const isGain24h = (coin.price_change_percentage_24h || 0) >= 0;
              const isGain7d = (coin.price_change_percentage_7d_in_currency || 0) >= 0;
              const sparklinePrices = coin.sparkline_in_7d?.price || [];

              return (
                <tr 
                  key={coin.id} 
                  style={{ background: isSelected ? 'rgba(99, 102, 241, 0.12)' : undefined }}
                  onClick={() => setSelectedCoin(coin)}
                >
                  <td className="font-mono" style={{ color: 'var(--text-muted)' }}>
                    {coin.market_cap_rank}
                  </td>
                  <td>
                    <div className="coin-cell">
                      <img src={coin.image} alt={coin.name} className="coin-logo" />
                      <div className="coin-names">
                        <span className="coin-name">{coin.name}</span>
                        <span className="coin-symbol">{coin.symbol}</span>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 600 }}>
                    {formatPrice(coin.current_price)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={isGain24h ? 'badge-gain' : 'badge-loss'}>
                      {isGain24h ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={isGain7d ? 'badge-gain' : 'badge-loss'}>
                      {Math.abs(coin.price_change_percentage_7d_in_currency || 0).toFixed(2)}%
                    </span>
                  </td>
                  <td className="font-mono" style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                    {formatPrice(coin.total_volume)}
                  </td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 500 }}>
                    {formatPrice(coin.market_cap)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {renderSparkline(sparklinePrices, isGain7d)}
                  </td>
                  <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.75rem', gap: '0.35rem', padding: '0.3rem 0.65rem' }}
                      title="Xem chi tiết dự án & ATH/ATL"
                      onClick={() => onOpenDetail(coin)}
                    >
                      <Eye size={13} />
                      <span>Chi tiết</span>
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredAndSortedCoins.length === 0 && !loading && (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Không tìm thấy đồng coin nào khớp với từ khóa "{search}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
