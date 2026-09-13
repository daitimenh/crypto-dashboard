// Interactive SVG Price Chart with ScreenCTM mouse coordinate alignment and horizontal time axis

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { coinGeckoService } from '../../services/coingecko';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

export const PriceChart = ({ onOpenDetail }) => {
  const { selectedCoin, formatPrice } = useCrypto();
  const [timeframe, setTimeframe] = useState(1); // Mặc định 24H (1 ngày) giống CoinGecko & Binance
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoverPoint, setHoverPoint] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    if (!selectedCoin) return;

    let isMounted = true;
    setLoading(true);

    coinGeckoService.getCoinChart(selectedCoin.id, 'usd', timeframe, selectedCoin.current_price)
      .then(res => {
        if (isMounted) {
          const prices = res.data?.prices || [];
          setChartData(prices);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [selectedCoin, timeframe]);

  // Thiết lập kích thước hệ trục tọa độ SVG
  const SVG_WIDTH = 860;
  const SVG_HEIGHT = 330;
  const PADDING_TOP = 25;
  const PADDING_BOTTOM = 55; // Dành không gian cho trục thời gian ngang X-axis
  const PADDING_LEFT = 20;
  const PADDING_RIGHT = 75;  // Dành không gian cho nhãn giá Y-axis bên phải

  // Tính toán đường cong SVG, min/max và các điểm mốc
  const { pathD, areaD, minPrice, maxPrice, points, priceLevels } = useMemo(() => {
    if (!chartData || chartData.length < 2) {
      return { pathD: '', areaD: '', minPrice: 0, maxPrice: 0, points: [], priceLevels: [] };
    }

    const priceValues = chartData.map(p => p[1]);
    const min = Math.min(...priceValues);
    const max = Math.max(...priceValues);
    const range = max - min || 1;

    const chartWidth = SVG_WIDTH - PADDING_LEFT - PADDING_RIGHT;
    const chartHeight = SVG_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

    const computedPoints = chartData.map((d, index) => {
      const x = PADDING_LEFT + (index / (chartData.length - 1)) * chartWidth;
      const y = PADDING_TOP + chartHeight - ((d[1] - min) / range) * chartHeight;
      return { x, y, time: d[0], price: d[1] };
    });

    let pD = `M ${computedPoints[0].x.toFixed(1)} ${computedPoints[0].y.toFixed(1)}`;
    for (let i = 1; i < computedPoints.length; i++) {
      pD += ` L ${computedPoints[i].x.toFixed(1)} ${computedPoints[i].y.toFixed(1)}`;
    }

    const firstPoint = computedPoints[0];
    const lastPoint = computedPoints[computedPoints.length - 1];
    const bottomY = PADDING_TOP + chartHeight;
    const aD = `${pD} L ${lastPoint.x.toFixed(1)} ${bottomY} L ${firstPoint.x.toFixed(1)} ${bottomY} Z`;

    // 4 mức giá ngang (Y-axis gridlines)
    const levels = [0, 0.33, 0.66, 1].map(ratio => {
      const price = min + ratio * range;
      const y = PADDING_TOP + chartHeight - ratio * chartHeight;
      return { y, price };
    });

    return { 
      pathD: pD, 
      areaD: aD, 
      minPrice: min, 
      maxPrice: max, 
      points: computedPoints,
      priceLevels: levels 
    };
  }, [chartData]);

  // Tạo các mốc thời gian hiển thị trên trục ngang X (5-6 mốc trải đều)
  const timeTicks = useMemo(() => {
    if (!points || points.length < 2) return [];
    const tickCount = 6;
    const step = (points.length - 1) / (tickCount - 1);
    const ticks = [];

    for (let i = 0; i < tickCount; i++) {
      const idx = Math.min(Math.round(i * step), points.length - 1);
      const pt = points[idx];
      if (pt) {
        const date = new Date(pt.time);
        let label = '';
        if (timeframe === 1) {
          label = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        } else if (timeframe === 7) {
          const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
          label = `${daysOfWeek[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}`;
        } else if (timeframe === 30) {
          label = `${date.getDate()}/${date.getMonth() + 1}`;
        } else {
          label = `Thg ${date.getMonth() + 1}/${date.getFullYear()}`;
        }
        ticks.push({ x: pt.x, label });
      }
    }
    return ticks;
  }, [points, timeframe]);

  if (!selectedCoin) {
    return (
      <div className="glass-card chart-container" style={{ minHeight: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="skeleton" style={{ width: '100%', height: '300px', borderRadius: 12 }} />
      </div>
    );
  }

  // Xác định màu sắc biểu đồ theo xu hướng của khung thời gian đang xem (Gain: Xanh, Loss: Đỏ)
  const isGain = chartData.length >= 2 
    ? (chartData[chartData.length - 1][1] >= chartData[0][1])
    : (selectedCoin.price_change_percentage_24h || 0) >= 0;

  const strokeColor = isGain ? '#10b981' : '#f43f5e';
  const gradientId = `gradient-${selectedCoin.id}`;

  const currentDisplayPrice = hoverPoint ? hoverPoint.price : selectedCoin.current_price;
  const currentDisplayDate = hoverPoint 
    ? new Date(hoverPoint.time).toLocaleString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }) 
    : selectedCoin.last_updated 
      ? `CoinGecko Sync: ${new Date(selectedCoin.last_updated).toLocaleTimeString('vi-VN')}` 
      : 'Thời gian thực (Live)';

  /**
   * Chuyển đổi chính xác tọa độ con trỏ chuột sang hệ tọa độ SVG
   * Giải quyết triệt để lỗi chuột không đồng nhất với trục hiển thị
   */
  const handleMouseMove = (e) => {
    if (!svgRef.current || points.length === 0) return;
    const svg = svgRef.current;
    
    // Sử dụng ma trận đảo chuẩn của SVG CTM (Current Transformation Matrix)
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgCoords = pt.matrixTransform(svg.getScreenCTM().inverse());
    const svgX = svgCoords.x;

    // Tìm điểm dữ liệu có tọa độ x gần nhất với chuột
    let closest = points[0];
    let minDiff = Math.abs(points[0].x - svgX);
    for (let i = 1; i < points.length; i++) {
      const diff = Math.abs(points[i].x - svgX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = points[i];
      }
    }
    setHoverPoint(closest);
  };

  const handleMouseLeave = () => {
    setHoverPoint(null);
  };

  const chartBottomY = SVG_HEIGHT - PADDING_BOTTOM;

  return (
    <div className="glass-card chart-container">
      {/* 1. Header Biểu đồ */}
      <div className="chart-header">
        <div className="chart-coin-info">
          <img src={selectedCoin.image} alt={selectedCoin.name} style={{ width: 44, height: 44, borderRadius: '50%' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 className="font-heading" style={{ fontSize: '1.4rem' }}>{selectedCoin.name}</h2>
              <span className="coin-symbol" style={{ fontSize: '0.85rem' }}>{selectedCoin.symbol.toUpperCase()}</span>
              <button 
                className="btn btn-outline btn-sm" 
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}
                onClick={() => onOpenDetail(selectedCoin)}
              >
                Chi tiết on-chain
              </button>
            </div>
            <div className="stat-sub" style={{ marginTop: '0.2rem' }}>
              <Clock size={12} color="var(--text-muted)" />
              <span style={{ color: 'var(--text-muted)' }}>{currentDisplayDate}</span>
            </div>
          </div>
        </div>

        {/* Current Price and Timeframe Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div className="chart-price-display">
            <span className="chart-current-price font-mono" style={{ color: isGain ? 'var(--crypto-green)' : 'var(--crypto-red)' }}>
              {formatPrice(currentDisplayPrice)}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <span className={isGain ? 'badge-gain' : 'badge-loss'}>
                {isGain ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {selectedCoin.price_change_percentage_24h?.toFixed(2)}% (24h)
              </span>
            </div>
          </div>

          <div className="timeframe-group">
            {[
              { label: '24H', val: 1 },
              { label: '7D', val: 7 },
              { label: '30D', val: 30 },
              { label: '1Y', val: 365 }
            ].map(tf => (
              <button
                key={tf.val}
                className={`timeframe-btn ${timeframe === tf.val ? 'active' : ''}`}
                onClick={() => {
                  setTimeframe(tf.val);
                  setHoverPoint(null);
                }}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. SVG Chart Canvas với Trục thời gian ngang (X-Axis) và Trục giá (Y-Axis) */}
      <div className="canvas-wrapper" style={{ height: 'auto', minHeight: '340px' }}>
        {loading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.4)', zIndex: 10, borderRadius: 12 }}>
            <div className="skeleton" style={{ width: '90%', height: '80%', borderRadius: 12 }} />
          </div>
        )}

        <svg 
          ref={svgRef}
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} 
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible', cursor: 'crosshair' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.32" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Lưới ngang giá (Horizontal Grid lines) & Nhãn giá bên phải */}
          {priceLevels.map((lvl, idx) => (
            <g key={idx}>
              <line 
                x1={PADDING_LEFT} 
                y1={lvl.y} 
                x2={SVG_WIDTH - PADDING_RIGHT} 
                y2={lvl.y} 
                stroke="rgba(255,255,255,0.06)" 
                strokeDasharray="4 4" 
              />
              <text 
                x={SVG_WIDTH - PADDING_RIGHT + 8} 
                y={lvl.y + 4} 
                fill="#64748b" 
                fontSize="11" 
                fontFamily="JetBrains Mono, monospace"
              >
                {formatPrice(lvl.price)}
              </text>
            </g>
          ))}

          {/* Trục hoành cơ sở ngăn cách đồ thị và nhãn thời gian */}
          <line 
            x1={PADDING_LEFT} 
            y1={chartBottomY} 
            x2={SVG_WIDTH - PADDING_RIGHT} 
            y2={chartBottomY} 
            stroke="rgba(255,255,255,0.12)" 
            strokeWidth="1"
          />

          {/* TRỤC THỜI GIAN NGANG (X-Axis Time Ticks) */}
          {timeTicks.map((tick, idx) => (
            <g key={idx}>
              {/* Vạch chia nhỏ */}
              <line 
                x1={tick.x} 
                y1={chartBottomY} 
                x2={tick.x} 
                y2={chartBottomY + 5} 
                stroke="rgba(255,255,255,0.2)" 
                strokeWidth="1"
              />
              {/* Nhãn thời gian */}
              <text 
                x={tick.x} 
                y={chartBottomY + 22} 
                textAnchor="middle" 
                fill="#94a3b8" 
                fontSize="11"
                fontFamily="Inter, sans-serif"
                fontWeight="500"
              >
                {tick.label}
              </text>
            </g>
          ))}

          {/* Miền màu chuyển sắc và Đường cong giá chính */}
          {areaD && <path d={areaD} fill={`url(#${gradientId})`} />}
          {pathD && <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

          {/* HIỆU ỨNG CROSSHAIR KHI RÊ CHUỘT (ĐỒNG NHẤT 100% VỚI CON TRỎ) */}
          {hoverPoint && (
            <g>
              {/* Đường gióng dọc xuống trục thời gian */}
              <line 
                x1={hoverPoint.x} 
                y1={PADDING_TOP} 
                x2={hoverPoint.x} 
                y2={chartBottomY} 
                stroke="rgba(255,255,255,0.35)" 
                strokeDasharray="3 3" 
                strokeWidth="1.2"
              />

              {/* Đường gióng ngang sang trục giá */}
              <line 
                x1={PADDING_LEFT} 
                y1={hoverPoint.y} 
                x2={SVG_WIDTH - PADDING_RIGHT} 
                y2={hoverPoint.y} 
                stroke="rgba(255,255,255,0.25)" 
                strokeDasharray="3 3" 
                strokeWidth="1.2"
              />

              {/* Điểm tròn sáng tại vị trí giá trên đồ thị */}
              <circle 
                cx={hoverPoint.x} 
                cy={hoverPoint.y} 
                r="6" 
                fill={strokeColor} 
                stroke="#ffffff" 
                strokeWidth="2.5" 
              />
              <circle 
                cx={hoverPoint.x} 
                cy={hoverPoint.y} 
                r="12" 
                fill={strokeColor} 
                opacity="0.25"
              />

              {/* Badge hiển thị thời gian chính xác trên trục hoành X */}
              <g transform={`translate(${hoverPoint.x}, ${chartBottomY + 10})`}>
                <rect 
                  x="-45" 
                  y="0" 
                  width="90" 
                  height="22" 
                  rx="4" 
                  fill="#1e293b" 
                  stroke="rgba(255,255,255,0.2)" 
                />
                <text 
                  x="0" 
                  y="15" 
                  textAnchor="middle" 
                  fill="#38bdf8" 
                  fontSize="11" 
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="600"
                >
                  {new Date(hoverPoint.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </text>
              </g>

              {/* Badge hiển thị mức giá trên trục tung Y bên phải */}
              <g transform={`translate(${SVG_WIDTH - PADDING_RIGHT + 5}, ${hoverPoint.y - 11})`}>
                <rect 
                  x="0" 
                  y="0" 
                  width="70" 
                  height="22" 
                  rx="4" 
                  fill={isGain ? 'rgba(16, 185, 129, 0.9)' : 'rgba(244, 63, 94, 0.9)'} 
                />
                <text 
                  x="35" 
                  y="15" 
                  textAnchor="middle" 
                  fill="#ffffff" 
                  fontSize="10" 
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="700"
                >
                  {formatPrice(hoverPoint.price)}
                </text>
              </g>
            </g>
          )}
        </svg>

        {/* Chân biểu đồ hiển thị giá thấp/cao nhất */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 1.25rem 0', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
          <span>Thấp nhất chu kỳ: <strong className="font-mono" style={{ color: 'var(--text-secondary)' }}>{formatPrice(minPrice)}</strong></span>
          <span>Cao nhất chu kỳ: <strong className="font-mono" style={{ color: 'var(--text-secondary)' }}>{formatPrice(maxPrice)}</strong></span>
        </div>
      </div>
    </div>
  );
};
