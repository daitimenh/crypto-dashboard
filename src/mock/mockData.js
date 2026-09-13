// Fallback mock dataset when offline or rate-limited

export const MOCK_GLOBAL_DATA = {
  data: {
    active_cryptocurrencies: 14250,
    markets: 1120,
    total_market_cap: {
      usd: 2684129581023,
      vnd: 68176891357984200
    },
    total_volume: {
      usd: 89452103490,
      vnd: 2272083428646000
    },
    market_cap_percentage: {
      btc: 56.4,
      eth: 14.8,
      sol: 3.5,
      bnb: 3.2
    },
    market_cap_change_percentage_24h_usd: 2.84
  }
};

export const MOCK_COINS = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 77280.00,
    market_cap: 1520901240120,
    market_cap_rank: 1,
    total_volume: 38940129032,
    high_24h: 77850.00,
    low_24h: 76920.00,
    price_change_percentage_24h: -0.08,
    price_change_percentage_7d_in_currency: 2.15,
    circulating_supply: 19754200,
    total_supply: 21000000,
    ath: 108900.00,
    ath_change_percentage: -29.0,
    ath_date: "2025-01-20T07:10:36.635Z",
    atl: 67.81,
    contract_address: "Native Layer 1",
    sparkline_in_7d: {
      price: [75800, 76200, 76900, 76400, 77100, 77800, 77500, 77900, 77400, 77280]
    }
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3450.25,
    market_cap: 414890120300,
    market_cap_rank: 2,
    total_volume: 18450190230,
    high_24h: 3510.00,
    low_24h: 3380.50,
    price_change_percentage_24h: -1.24,
    price_change_percentage_7d_in_currency: 4.65,
    circulating_supply: 120250000,
    total_supply: 120250000,
    ath: 4891.70,
    ath_change_percentage: -29.47,
    ath_date: "2021-11-16T08:44:26.000Z",
    atl: 0.42,
    contract_address: "Native Layer 1 / EVM Host",
    sparkline_in_7d: {
      price: [3300, 3320, 3390, 3410, 3380, 3440, 3470, 3490, 3420, 3450]
    }
  },
  {
    id: "tether",
    symbol: "usdt",
    name: "Tether USD",
    image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    current_price: 1.00,
    market_cap: 118450200100,
    market_cap_rank: 3,
    total_volume: 48102390120,
    high_24h: 1.002,
    low_24h: 0.998,
    price_change_percentage_24h: 0.02,
    price_change_percentage_7d_in_currency: -0.05,
    circulating_supply: 118450000000,
    total_supply: 118450000000,
    ath: 1.32,
    ath_change_percentage: -24.2,
    ath_date: "2018-07-24T00:00:00.000Z",
    atl: 0.57,
    contract_address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    sparkline_in_7d: {
      price: [1.00, 0.999, 1.001, 1.00, 0.999, 1.00, 1.00, 1.001, 1.00, 1.00]
    }
  },
  {
    id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 585.80,
    market_cap: 89450120300,
    market_cap_rank: 4,
    total_volume: 1205019020,
    high_24h: 598.00,
    low_24h: 578.00,
    price_change_percentage_24h: 1.85,
    price_change_percentage_7d_in_currency: 3.12,
    circulating_supply: 153850000,
    total_supply: 153850000,
    ath: 720.67,
    ath_change_percentage: -18.7,
    ath_date: "2024-06-06T12:30:00.000Z",
    atl: 0.096,
    contract_address: "0xb8c77482e45f1f44de1745f52c74426c631bdd52",
    sparkline_in_7d: {
      price: [565, 570, 575, 572, 580, 582, 579, 588, 582, 585.8]
    }
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 156.40,
    market_cap: 72890120400,
    market_cap_rank: 5,
    total_volume: 3845012030,
    high_24h: 161.20,
    low_24h: 151.80,
    price_change_percentage_24h: 5.62,
    price_change_percentage_7d_in_currency: 14.85,
    circulating_supply: 466000000,
    total_supply: 580000000,
    ath: 260.06,
    ath_change_percentage: -39.8,
    ath_date: "2021-11-06T21:54:35.825Z",
    atl: 0.505,
    contract_address: "Native High-Speed L1",
    sparkline_in_7d: {
      price: [136, 138, 142, 140, 146, 149, 151, 154, 153, 156.4]
    }
  },
  {
    id: "ripple",
    symbol: "xrp",
    name: "XRP",
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    current_price: 0.585,
    market_cap: 32890120400,
    market_cap_rank: 6,
    total_volume: 1245012030,
    high_24h: 0.605,
    low_24h: 0.575,
    price_change_percentage_24h: -0.85,
    price_change_percentage_7d_in_currency: 2.10,
    circulating_supply: 56000000000,
    total_supply: 99987000000,
    ath: 3.84,
    ath_change_percentage: -84.7,
    ath_date: "2018-01-04T00:00:00.000Z",
    atl: 0.0028,
    contract_address: "XRP Ledger Native",
    sparkline_in_7d: {
      price: [0.57, 0.575, 0.58, 0.578, 0.584, 0.59, 0.587, 0.592, 0.588, 0.585]
    }
  },
  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    current_price: 0.128,
    market_cap: 18590120400,
    market_cap_rank: 7,
    total_volume: 980120300,
    high_24h: 0.134,
    low_24h: 0.123,
    price_change_percentage_24h: 4.15,
    price_change_percentage_7d_in_currency: 12.30,
    circulating_supply: 145000000000,
    total_supply: 145000000000,
    ath: 0.7376,
    ath_change_percentage: -82.6,
    ath_date: "2021-05-08T05:08:48.000Z",
    atl: 0.000085,
    contract_address: "Dogecoin Core Chain",
    sparkline_in_7d: {
      price: [0.114, 0.116, 0.118, 0.121, 0.120, 0.124, 0.126, 0.131, 0.127, 0.128]
    }
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 0.362,
    market_cap: 12990120400,
    market_cap_rank: 8,
    total_volume: 320120300,
    high_24h: 0.375,
    low_24h: 0.354,
    price_change_percentage_24h: 1.12,
    price_change_percentage_7d_in_currency: -1.45,
    circulating_supply: 35600000000,
    total_supply: 45000000000,
    ath: 3.10,
    ath_change_percentage: -88.3,
    ath_date: "2021-09-02T06:00:00.000Z",
    atl: 0.017,
    contract_address: "Cardano Ouroboros",
    sparkline_in_7d: {
      price: [0.368, 0.365, 0.362, 0.360, 0.358, 0.364, 0.366, 0.365, 0.360, 0.362]
    }
  }
];

/**
 * Hàm sinh chuỗi giá theo khung thời gian phục vụ vẽ biểu đồ (Chart).
 * Sử dụng hàm sóng lượng giác cố định (Deterministic Wave), không dùng Math.random()
 * để đảm bảo biểu đồ luôn ổn định, không bị nhảy lung tung hay đổi màu bất thường.
 */
export function generateMockChartData(basePrice = 77000, days = 1, coinId = 'bitcoin', priceChange24h = null) {
  const pointsCount = days === 1 ? 24 : days === 7 ? 48 : days === 30 ? 60 : 90;
  // Làm tròn mốc thời gian theo 5 phút để các lần gọi cùng thời điểm trả về kết quả giống nhau 100%
  const now = Math.floor(Date.now() / (5 * 60 * 1000)) * (5 * 60 * 1000);
  const step = (days * 24 * 3600 * 1000) / pointsCount;
  
  // Tạo seed cố định từ tên coin
  const charSum = (coinId || 'btc').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const phase = (charSum % 10) * 0.3;

  // Xác định xu hướng dốc lên hay xuống theo biến động giá
  // Nếu priceChange24h âm, đồ thị xuôi dốc xuống (ĐỎ) để đồng nhất hoàn toàn với nhãn phần trăm
  let trendSign = 1;
  if (priceChange24h !== null && priceChange24h !== undefined) {
    trendSign = priceChange24h >= 0 ? 1 : -1;
  } else {
    // Mặc định Bitcoin âm nhẹ theo thị trường hiện nay
    trendSign = (coinId === 'bitcoin' || coinId === 'ethereum') ? -1 : 1;
  }

  const prices = [];
  for (let i = pointsCount; i >= 0; i--) {
    const timestamp = now - i * step;
    const t = i / pointsCount; // Từ 1 (quá khứ) về 0 (hiện tại)
    
    // Sóng lượng giác dao động nhẹ
    const wave = Math.sin(t * Math.PI * 4 + phase) * 0.008 + Math.cos(t * Math.PI * 2) * 0.005;
    // Khi t=1 (quá khứ), trend = -0.008 * trendSign
    // Khi t=0 (hiện tại), trend = +0.008 * trendSign
    const trend = (0.5 - t) * 0.016 * trendSign;
    const price = basePrice * (1 + trend + wave);
    
    prices.push([timestamp, parseFloat(price.toFixed(2))]);
  }
  return { prices };
}
