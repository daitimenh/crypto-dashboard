// Portfolio View: Holdings breakdown, average buy price, current valuation and live PnL

import React, { useState, useEffect, useMemo } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { useWallet } from '../../context/WalletContext';
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, Wallet, PieChart, ShieldAlert } from 'lucide-react';

export const PortfolioView = ({ initialCoinToAdd, onClearInitialCoin }) => {
  const { coins, formatPrice } = useCrypto();
  const { isConnected, wallet, connectWallet } = useWallet();

  // Danh mục tài sản mẫu ban đầu
  const DEFAULT_HOLDINGS = [
    { id: 'bitcoin', symbol: 'btc', amount: 0.45, buyPrice: 58000 },
    { id: 'ethereum', symbol: 'eth', amount: 3.2, buyPrice: 3100 },
    { id: 'solana', symbol: 'sol', amount: 18.5, buyPrice: 135 }
  ];

  const [holdings, setHoldings] = useState(() => {
    try {
      const saved = localStorage.getItem('cryptopulse_portfolio');
      return saved ? JSON.parse(saved) : DEFAULT_HOLDINGS;
    } catch (e) {
      return DEFAULT_HOLDINGS;
    }
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCoinId, setSelectedCoinId] = useState('bitcoin');
  const [inputAmount, setInputAmount] = useState('');
  const [inputBuyPrice, setInputBuyPrice] = useState('');

  // Nếu có coin được truyền từ bảng giá (Quick Add)
  useEffect(() => {
    if (initialCoinToAdd) {
      setSelectedCoinId(initialCoinToAdd.id);
      setInputBuyPrice(initialCoinToAdd.current_price.toString());
      setIsAddModalOpen(true);
      onClearInitialCoin();
    }
  }, [initialCoinToAdd, onClearInitialCoin]);

  // Lưu vào localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cryptopulse_portfolio', JSON.stringify(holdings));
    } catch (e) {}
  }, [holdings]);

  // Tính toán PnL và Tổng tài sản
  const { totalCurrentValue, totalCost, totalProfitLoss, totalProfitLossPct, enrichedHoldings } = useMemo(() => {
    let currentValSum = 0;
    let costSum = 0;

    const enriched = holdings.map(item => {
      const coin = coins.find(c => c.id === item.id) || {
        name: item.id.toUpperCase(),
        symbol: item.symbol,
        current_price: item.buyPrice,
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
      };

      const currentValue = item.amount * coin.current_price;
      const initialCost = item.amount * item.buyPrice;
      const pnl = currentValue - initialCost;
      const pnlPct = initialCost > 0 ? (pnl / initialCost) * 100 : 0;

      currentValSum += currentValue;
      costSum += initialCost;

      return {
        ...item,
        coin,
        currentValue,
        initialCost,
        pnl,
        pnlPct
      };
    });

    const netPnl = currentValSum - costSum;
    const netPnlPct = costSum > 0 ? (netPnl / costSum) * 100 : 0;

    return {
      totalCurrentValue: currentValSum,
      totalCost: costSum,
      totalProfitLoss: netPnl,
      totalProfitLossPct: netPnlPct,
      enrichedHoldings: enriched
    };
  }, [holdings, coins]);

  const handleAddAsset = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(inputAmount);
    const buyPriceNum = parseFloat(inputBuyPrice);

    if (!amountNum || amountNum <= 0) return;

    const coinInfo = coins.find(c => c.id === selectedCoinId);
    const symbol = coinInfo?.symbol || selectedCoinId;

    setHoldings(prev => {
      const existingIndex = prev.findIndex(h => h.id === selectedCoinId);
      if (existingIndex >= 0) {
        // Cập nhật số lượng và tính trung bình giá (DCA)
        const currentItem = prev[existingIndex];
        const newTotalAmount = currentItem.amount + amountNum;
        const avgPrice = ((currentItem.amount * currentItem.buyPrice) + (amountNum * buyPriceNum)) / newTotalAmount;
        const updated = [...prev];
        updated[existingIndex] = { ...currentItem, amount: newTotalAmount, buyPrice: avgPrice };
        return updated;
      }
      return [...prev, { id: selectedCoinId, symbol, amount: amountNum, buyPrice: buyPriceNum || coinInfo?.current_price || 0 }];
    });

    setInputAmount('');
    setInputBuyPrice('');
    setIsAddModalOpen(false);
  };

  const handleRemoveAsset = (coinId) => {
    setHoldings(prev => prev.filter(h => h.id !== coinId));
  };

  const isOverallGain = totalProfitLoss >= 0;

  return (
    <div>
      {/* Portfolio Header Banner */}
      <div className="portfolio-header-banner">
        <div className="portfolio-balance-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)' }}>
            <Wallet size={18} color="var(--accent-primary)" />
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.8rem', fontWeight: 600 }}>
              Tổng Giá Trị Danh Mục (Portfolio Net Worth)
            </span>
          </div>
          <div className="font-heading" style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            {formatPrice(totalCurrentValue)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span className={isOverallGain ? "badge-gain" : "badge-loss"}>
              {isOverallGain ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {isOverallGain ? '+' : ''}{formatPrice(totalProfitLoss)} ({totalProfitLossPct.toFixed(2)}%)
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tổng Lời / Lỗ (All-time PnL)</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} />
            <span>Thêm Coin Nắm Giữ</span>
          </button>
          {!isConnected && (
            <button className="btn btn-outline" onClick={() => connectWallet(true)}>
              <span>Đồng bộ Ví Web3</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="portfolio-metrics-row" style={{ marginBottom: '2rem' }}>
        <div className="glass-card stat-card">
          <div className="stat-label">Tổng vốn đầu tư gốc (Invested)</div>
          <div className="stat-value font-mono">{formatPrice(totalCost)}</div>
          <div className="stat-sub" style={{ color: 'var(--text-muted)' }}>Chi phí mua ban đầu</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-label">Lợi nhuận ròng (Net Profit)</div>
          <div className="stat-value font-mono" style={{ color: isOverallGain ? 'var(--crypto-green)' : 'var(--crypto-red)' }}>
            {isOverallGain ? '+' : ''}{formatPrice(totalProfitLoss)}
          </div>
          <div className="stat-sub" style={{ color: 'var(--text-muted)' }}>Đã tính theo giá realtime</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-label">Số loại tài sản (Assets)</div>
          <div className="stat-value font-mono">{holdings.length} đồng coin</div>
          <div className="stat-sub" style={{ color: 'var(--text-muted)' }}>Đa dạng hóa danh mục</div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 className="font-heading" style={{ fontSize: '1.2rem' }}>Tài sản đang nắm giữ (Holdings Breakdown)</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tự động lưu trữ trên LocalStorage & Web3</span>
        </div>

        <div className="table-container">
          <table className="crypto-table">
            <thead>
              <tr>
                <th>Tài sản</th>
                <th style={{ textAlign: 'right' }}>Số lượng nắm giữ</th>
                <th style={{ textAlign: 'right' }}>Giá mua trung bình</th>
                <th style={{ textAlign: 'right' }}>Giá thị trường</th>
                <th style={{ textAlign: 'right' }}>Tổng giá trị</th>
                <th style={{ textAlign: 'right' }}>Lời / Lỗ (PnL)</th>
                <th style={{ textAlign: 'center' }}>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {enrichedHoldings.map((item) => {
                const isGain = item.pnl >= 0;
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="coin-cell">
                        <img src={item.coin.image} alt={item.coin.name} className="coin-logo" />
                        <div className="coin-names">
                          <span className="coin-name">{item.coin.name}</span>
                          <span className="coin-symbol">{item.symbol}</span>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono" style={{ textAlign: 'right', fontWeight: 600 }}>
                      {item.amount.toLocaleString()} {item.symbol.toUpperCase()}
                    </td>
                    <td className="font-mono" style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                      {formatPrice(item.buyPrice)}
                    </td>
                    <td className="font-mono" style={{ textAlign: 'right', fontWeight: 600 }}>
                      {formatPrice(item.coin.current_price)}
                    </td>
                    <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>
                      {formatPrice(item.currentValue)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span className={isGain ? 'badge-gain' : 'badge-loss'}>
                          {isGain ? '+' : ''}{item.pnlPct.toFixed(2)}%
                        </span>
                        <span className="font-mono" style={{ fontSize: '0.75rem', color: isGain ? 'var(--crypto-green)' : 'var(--crypto-red)' }}>
                          {isGain ? '+' : ''}{formatPrice(item.pnl)}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--crypto-red)', borderColor: 'transparent' }}
                        onClick={() => handleRemoveAsset(item.id)}
                        title="Xóa khỏi danh mục"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {enrichedHoldings.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Danh mục chưa có coin nào. Hãy nhấn "Thêm Coin Nắm Giữ" để bắt đầu theo dõi lợi nhuận!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm Coin vào Danh mục */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <h3 className="font-heading" style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}>
              Thêm Coin Vào Danh Mục
            </h3>

            <form onSubmit={handleAddAsset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Chọn đồng tiền mã hóa
                </label>
                <select 
                  className="currency-select" 
                  style={{ width: '100%', padding: '0.65rem' }}
                  value={selectedCoinId}
                  onChange={(e) => {
                    setSelectedCoinId(e.target.value);
                    const coin = coins.find(c => c.id === e.target.value);
                    if (coin) setInputBuyPrice(coin.current_price.toString());
                  }}
                >
                  {coins.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.symbol.toUpperCase()}) - ${c.current_price?.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Số lượng coin nắm giữ
                </label>
                <input 
                  type="number" 
                  step="any" 
                  required
                  placeholder="Ví dụ: 0.5"
                  className="search-input"
                  style={{ paddingLeft: '1rem' }}
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Giá mua trung bình (USD)
                </label>
                <input 
                  type="number" 
                  step="any" 
                  required
                  placeholder="Ví dụ: 62000"
                  className="search-input"
                  style={{ paddingLeft: '1rem' }}
                  value={inputBuyPrice}
                  onChange={(e) => setInputBuyPrice(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsAddModalOpen(false)}>
                  Hủy bỏ
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Lưu tài sản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
