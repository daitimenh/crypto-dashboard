// CoinGecko API Service with 30s cache and graceful fallback

import { cacheService } from './cache';
import { MOCK_COINS, MOCK_GLOBAL_DATA, generateMockChartData } from '../mock/mockData';

// Sử dụng proxy /coingecko-api ở môi trường dev để tránh hoàn toàn lỗi CORS / Rate-Limit từ trình duyệt
const BASE_URL = typeof window !== 'undefined' && window.location.origin
  ? '/coingecko-api'
  : 'https://api.coingecko.com/api/v3';

export const coinGeckoService = {
  /**
   * Lấy danh sách Top Coins theo vốn hóa
   */
  async getTopCoins(vsCurrency = 'usd', perPage = 20) {
    const cacheKey = `top_coins_${vsCurrency}_${perPage}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return { data: cached, isMock: false, fromCache: true };

    try {
      const response = await fetch(
        `${BASE_URL}/coins/markets?vs_currency=${vsCurrency}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=true&price_change_percentage=24h,7d`,
        { headers: { 'Accept': 'application/json' } }
      );

      if (response.status === 429) {
        console.warn('⚠️ CoinGecko Rate Limit (429). Using fallback.');
        return { data: MOCK_COINS, isMock: true, reason: 'rate_limited' };
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      cacheService.set(cacheKey, data, 45 * 1000); // Cache 45s
      return { data, isMock: false, fromCache: false };
    } catch (error) {
      console.warn('⚠️ CoinGecko API unreachable, using Mock Data:', error.message);
      return { data: MOCK_COINS, isMock: true, reason: error.message };
    }
  },

  /**
   * Lấy dữ liệu tổng quan thị trường toàn cầu (Global stats)
   */
  async getGlobalData() {
    const cacheKey = 'global_market_data';
    const cached = cacheService.get(cacheKey);
    if (cached) return { data: cached, isMock: false, fromCache: true };

    try {
      const response = await fetch(`${BASE_URL}/global`);
      if (response.status === 429 || !response.ok) {
        return { data: MOCK_GLOBAL_DATA.data, isMock: true };
      }
      const json = await response.json();
      cacheService.set(cacheKey, json.data, 60 * 1000); // 1 phút
      return { data: json.data, isMock: false };
    } catch (e) {
      return { data: MOCK_GLOBAL_DATA.data, isMock: true };
    }
  },

  /**
   * Lấy biểu đồ lịch sử giá của một Coin (Market Chart)
   */
  async getCoinChart(coinId = 'bitcoin', vsCurrency = 'usd', days = 1, currentPrice = null) {
    const cacheKey = `chart_${coinId}_${vsCurrency}_${days}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return { data: cached, isMock: false, fromCache: true };

    try {
      const response = await fetch(
        `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=${vsCurrency}&days=${days}`
      );

      if (response.status === 429 || !response.ok) {
        const found = MOCK_COINS.find(c => c.id === coinId) || MOCK_COINS[0];
        const basePrice = currentPrice || found.current_price;
        const mockChart = generateMockChartData(basePrice, days, coinId);
        // KHÔNG lưu dữ liệu giả vào cache dài hạn để lần sau gọi lại dữ liệu thật ngay khi hết chặn
        return { data: mockChart, isMock: true };
      }

      const data = await response.json();
      if (data && data.prices && data.prices.length > 0) {
        cacheService.set(cacheKey, data, 60 * 1000); // Lưu cache 60s cho dữ liệu thật từ CoinGecko
        return { data, isMock: false };
      }
      
      const found = MOCK_COINS.find(c => c.id === coinId) || MOCK_COINS[0];
      const mockChart = generateMockChartData(currentPrice || found.current_price, days, coinId);
      return { data: mockChart, isMock: true };
    } catch (e) {
      const found = MOCK_COINS.find(c => c.id === coinId) || MOCK_COINS[0];
      const mockChart = generateMockChartData(currentPrice || found.current_price, days, coinId);
      return { data: mockChart, isMock: true };
    }
  }
};
