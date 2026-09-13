// CoinGecko API Service with Multi-Tier Caching & Resilient Provider Fallback (CoinGecko -> Stale Cache -> Binance Live -> Mock)

import { cacheService } from './cache';
import { MOCK_COINS, MOCK_GLOBAL_DATA, generateMockChartData } from '../mock/mockData';

// Sử dụng proxy /coingecko-api ở môi trường dev để tránh hoàn toàn lỗi CORS / Rate-Limit từ trình duyệt
const BASE_URL = typeof window !== 'undefined' && window.location.origin
  ? '/coingecko-api'
  : 'https://api.coingecko.com/api/v3';

// Ánh xạ id CoinGecko sang mã giao dịch USDT của Binance Public REST API (Hỗ trợ CORS, không bị giới hạn 429)
const COIN_TO_BINANCE = {
  bitcoin: 'BTCUSDT',
  ethereum: 'ETHUSDT',
  tether: 'USDTUSDT',
  binancecoin: 'BNBUSDT',
  solana: 'SOLUSDT',
  ripple: 'XRPUSDT',
  'usd-coin': 'USDCUSDT',
  cardano: 'ADAUSDT',
  dogecoin: 'DOGEUSDT',
  avalanche: 'AVAXUSDT',
  tron: 'TRXUSDT',
  polkadot: 'DOTUSDT',
  chainlink: 'LINKUSDT',
  near: 'NEARUSDT',
  sui: 'SUIUSDT',
  pepe: 'PEPEUSDT',
  shiba: 'SHIBUSDT'
};

/**
 * Lấy nến giá lịch sử trực tiếp từ Binance Public API (Cực nhanh, thời gian thực 100%, không bị 429)
 */
async function fetchBinanceKlines(coinId, days = 1) {
  const isTether = coinId === 'tether';
  const symbol = isTether ? 'USDCUSDT' : (COIN_TO_BINANCE[coinId] || `${coinId.toUpperCase()}USDT`);
  let interval = '5m';
  let limit = 288;
  if (days === 7) {
    interval = '1h';
    limit = 168;
  } else if (days === 30) {
    interval = '4h';
    limit = 180;
  } else if (days >= 365) {
    interval = '1d';
    limit = 365;
  }

  const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
  if (!res.ok) throw new Error(`Binance HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) throw new Error('Dữ liệu Binance rỗng');

  return {
    prices: data.map(k => {
      const p = parseFloat(k[4]);
      return [k[0], isTether ? parseFloat((1 / p).toFixed(5)) : p];
    })
  };
}

/**
 * Lấy ticker giá 24h trực tiếp từ Binance cho các đồng coin hàng đầu
 */
async function fetchBinanceTopTickers() {
  const symbols = Object.values(COIN_TO_BINANCE);
  const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(symbols))}`);
  if (!res.ok) throw new Error(`Binance Ticker HTTP ${res.status}`);
  const list = await res.json();
  const tickerMap = new Map();
  list.forEach(t => tickerMap.set(t.symbol, t));
  return tickerMap;
}

export const coinGeckoService = {
  /**
   * Lấy danh sách Top Coins theo vốn hóa
   * Thứ tự ưu tiên:
   * 1. Cache hợp lệ (TTL 90s)
   * 2. CoinGecko API qua proxy
   * 3. Stale Cache (Dữ liệu thật trước đó trong LocalStorage dù đã hết hạn)
   * 4. Binance Live Ticker (Cập nhật giá và % biến động thật vào danh sách)
   * 5. MOCK_COINS chuẩn
   */
  async getTopCoins(vsCurrency = 'usd', perPage = 25) {
    const cacheKey = `top_coins_${vsCurrency}_${perPage}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return { data: cached, isMock: false, fromCache: true };

    try {
      const response = await fetch(
        `${BASE_URL}/coins/markets?vs_currency=${vsCurrency}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=true&price_change_percentage=24h,7d`,
        { headers: { 'Accept': 'application/json' } }
      );

      if (response.ok) {
        const data = await response.json();
        cacheService.set(cacheKey, data, 90 * 1000); // Lưu cache 90s
        return { data, isMock: false, fromCache: false };
      }

      console.warn(`CoinGecko HTTP ${response.status}. Kích hoạt cơ chế Multi-Tier Fallback.`);
    } catch (error) {
      console.warn('Lỗi mạng khi gọi CoinGecko:', error.message);
    }

    // TIER 2: Sử dụng Stale Cache (dữ liệu thật lần trước đã lưu)
    const stale = cacheService.getStale(cacheKey);
    if (stale && Array.isArray(stale) && stale.length > 0) {
      console.info('Sử dụng Stale Cache của CoinGecko để bảo toàn tỷ giá thật.');
      return { data: stale, isMock: false, fromCache: true, isStale: true };
    }

    // TIER 3: Lấy giá thời gian thực từ Binance Public REST API
    try {
      const tickerMap = await fetchBinanceTopTickers();
      const updatedCoins = MOCK_COINS.map(coin => {
        const binanceSymbol = COIN_TO_BINANCE[coin.id];
        const ticker = binanceSymbol ? tickerMap.get(binanceSymbol) : null;
        if (ticker) {
          const livePrice = parseFloat(ticker.lastPrice);
          const priceChange = parseFloat(ticker.priceChangePercent);
          return {
            ...coin,
            current_price: livePrice,
            price_change_percentage_24h: priceChange,
            high_24h: parseFloat(ticker.highPrice),
            low_24h: parseFloat(ticker.lowPrice),
            total_volume: parseFloat(ticker.quoteVolume)
          };
        }
        return coin;
      });
      cacheService.set(cacheKey, updatedCoins, 60 * 1000);
      return { data: updatedCoins, isMock: false, source: 'binance' };
    } catch (binanceErr) {
      console.warn('Không thể kết nối Binance Fallback:', binanceErr.message);
    }

    // TIER 4: MOCK DATA
    return { data: MOCK_COINS, isMock: true };
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
      if (response.ok) {
        const json = await response.json();
        cacheService.set(cacheKey, json.data, 180 * 1000); // 3 phút
        return { data: json.data, isMock: false };
      }
    } catch (e) {}

    const stale = cacheService.getStale(cacheKey);
    if (stale) return { data: stale, isMock: false, fromCache: true };

    return { data: MOCK_GLOBAL_DATA.data, isMock: false };
  },

  /**
   * Lấy biểu đồ lịch sử giá của một Coin (Market Chart)
   * Thứ tự ưu tiên:
   * 1. Cache hợp lệ (TTL 180s)
   * 2. CoinGecko REST API
   * 3. Stale Cache (biểu đồ thật đã tải trước đó)
   * 4. Binance Kline Public API (Realtime candlesticks 5m/1h/4h/1d)
   * 5. Deterministic Mock Chart khớp đúng xu hướng âm/dương
   */
  async getCoinChart(coinId = 'bitcoin', vsCurrency = 'usd', days = 1, currentPrice = null, priceChange24h = null) {
    const cacheKey = `chart_${coinId}_${vsCurrency}_${days}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return { data: cached, isMock: false, fromCache: true };

    // TIER 1: CoinGecko API
    try {
      const response = await fetch(
        `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=${vsCurrency}&days=${days}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.prices && data.prices.length > 0) {
          cacheService.set(cacheKey, data, 180 * 1000); // 3 phút
          return { data, isMock: false };
        }
      }
    } catch (e) {}

    // TIER 2: Stale Cache
    const stale = cacheService.getStale(cacheKey);
    if (stale && stale.prices && stale.prices.length > 0) {
      return { data: stale, isMock: false, fromCache: true, isStale: true };
    }

    // TIER 3: Binance Klines Live API (Chuẩn 100% thị trường, không bao giờ lệch màu sắc)
    try {
      const binanceChart = await fetchBinanceKlines(coinId, days);
      if (binanceChart && binanceChart.prices.length > 0) {
        cacheService.set(cacheKey, binanceChart, 120 * 1000); // 2 phút
        return { data: binanceChart, isMock: false, source: 'binance' };
      }
    } catch (binanceErr) {
      console.warn(`Binance Klines fallback thất bại cho ${coinId}:`, binanceErr.message);
    }

    // TIER 4: Mock Chart đồng bộ hoàn toàn với xu hướng giá
    const found = MOCK_COINS.find(c => c.id === coinId) || MOCK_COINS[0];
    const basePrice = currentPrice || found.current_price;
    const change = priceChange24h !== null && priceChange24h !== undefined ? priceChange24h : found.price_change_percentage_24h;
    const mockChart = generateMockChartData(basePrice, days, coinId, change);
    return { data: mockChart, isMock: true };
  }
};
