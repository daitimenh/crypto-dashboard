// Global Crypto Context: market data, USD/VND currency conversion and polling

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { coinGeckoService } from '../services/coingecko';
import { cacheService } from '../services/cache';

const CryptoContext = createContext(null);

export const CryptoProvider = ({ children }) => {
  const [coins, setCoins] = useState([]);
  const [globalData, setGlobalData] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [currency, setCurrency] = useState('usd'); // 'usd' | 'vnd'
  const [loading, setLoading] = useState(true);
  const [isMockActive, setIsMockActive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Tỷ giá chuyển đổi USD -> VND
  const USD_VND_RATE = 25450;

  const fetchData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    if (forceRefresh) {
      cacheService.clear();
    }

    try {
      const [coinsRes, globalRes] = await Promise.all([
        coinGeckoService.getTopCoins('usd', 25),
        coinGeckoService.getGlobalData()
      ]);

      // Nếu API bị rate limit nhưng đã có dữ liệu thật trong State thì giữ nguyên dữ liệu thật!
      setCoins(prev => {
        if (coinsRes.isMock && prev && prev.length > 0) {
          return prev;
        }
        return coinsRes.data || [];
      });

      setGlobalData(prev => {
        if (globalRes.isMock && prev) return prev;
        return globalRes.data || null;
      });

      setIsMockActive(coinsRes.isMock || globalRes.isMock);
      setLastUpdated(new Date());

      // Chọn mặc định coin đầu tiên (Bitcoin) nếu chưa chọn
      if (!selectedCoin && coinsRes.data?.length > 0) {
        setSelectedCoin(coinsRes.data[0]);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu thị trường:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCoin]);

  useEffect(() => {
    fetchData();
    // Tự động làm mới mỗi 60 giây (tôn trọng cache)
    const interval = setInterval(() => {
      fetchData();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  /**
   * Helper format giá theo loại tiền tệ USD / VND
   */
  const formatPrice = (valInUsd) => {
    if (valInUsd === undefined || valInUsd === null) return '$0.00';
    if (currency === 'vnd') {
      const vndVal = valInUsd * USD_VND_RATE;
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(vndVal);
    }
    
    // Điều chỉnh số chữ số thập phân linh hoạt theo mệnh giá tài sản (chuẩn CoinGecko)
    let fractionDigits = 2;
    const absVal = Math.abs(valInUsd);
    if (absVal < 0.0001) {
      fractionDigits = 6;
    } else if (absVal < 1.05 && absVal >= 0.95) {
      // Dành riêng cho Stablecoin (Tether USDT, USDC) quanh mốc 1$: hiển thị 4 chữ số thập phân ($0.9998)
      fractionDigits = 4;
    } else if (absVal < 2) {
      fractionDigits = 4;
    }

    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits
    }).format(valInUsd);
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    return num.toLocaleString();
  };

  return (
    <CryptoContext.Provider
      value={{
        coins,
        globalData,
        selectedCoin,
        setSelectedCoin,
        currency,
        setCurrency,
        loading,
        isMockActive,
        lastUpdated,
        refreshData: () => fetchData(true),
        formatPrice,
        formatNumber,
        USD_VND_RATE
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
};
