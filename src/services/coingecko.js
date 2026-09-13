// CoinGecko API Service with 30s cache and graceful fallback

import { cacheService } from './cache';
import { MOCK_COINS, MOCK_GLOBAL_DATA, generateMockChartData } from '../mock/mockData';

const BASE_URL = 'https://api.coingecko.com/api/v3';

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
        console.warn('⚠️ CoinGecko Rate Limit reached (429). Switching to robust Mock Data.');
        return { data: MOCK_COINS, isMock: true, reason: 'rate_limited' };
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      cacheService.set(cacheKey, data, 30 * 1000); // Lưu cache 30s để cập nhật sát realtime
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
  async getCoinChart(coinId = 'bitcoin', vsCurrency = 'usd', days = 1) {
    const cacheKey = `chart_${coinId}_${vsCurrency}_${days}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return { data: cached, isMock: false, fromCache: true };

    try {
      const response = await fetch(
        `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=${vsCurrency}&days=${days}`
      );

      if (response.status === 429 || !response.ok) {
        const found = MOCK_COINS.find(c => c.id === coinId) || MOCK_COINS[0];
        const mockChart = generateMockChartData(found.current_price, days);
        return { data: mockChart, isMock: true };
      }

      const data = await response.json();
      cacheService.set(cacheKey, data, 30 * 1000); // 30s
      return { data, isMock: false };
    } catch (e) {
      const found = MOCK_COINS.find(c => c.id === coinId) || MOCK_COINS[0];
      const mockChart = generateMockChartData(found.current_price, days);
      return { data: mockChart, isMock: true };
    }
  }
};
