import React, { useState } from 'react';
import { CryptoProvider, useCrypto } from './context/CryptoContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MarketOverview } from './components/dashboard/MarketOverview';
import { MarketTrends } from './components/dashboard/MarketTrends';
import { PriceChart } from './components/charts/PriceChart';
import { CoinTable } from './components/dashboard/CoinTable';
import { CoinDetailModal } from './components/coin-detail/CoinDetailModal';
import './styles/index.css';
import './styles/components.css';

const MainDashboard = () => {
  const { setSelectedCoin } = useCrypto();
  const [detailCoin, setDetailCoin] = useState(null);

  return (
    <div className="app-container">
      {/* 1. Header Navigation [Thành viên 4] */}
      <Navbar />

      {/* 2. Main Content Body */}
      <main className="main-content">
        {/* Thống kê vĩ mô vốn hóa thị trường [Thành viên 2] */}
        <MarketOverview />

        {/* Top Tăng Mạnh, Top Giảm Sâu & Khối Lượng Khủng [Thành viên 3] */}
        <MarketTrends onSelectCoin={(coin) => setSelectedCoin(coin)} />

        {/* Biểu đồ giá SVG tương tác chính xác cao [Thành viên 2] */}
        <PriceChart onOpenDetail={(coin) => setDetailCoin(coin)} />

        {/* Bảng giá toàn bộ coin, tìm kiếm & bộ lọc danh mục [Thành viên 4] */}
        <CoinTable onOpenDetail={(coin) => setDetailCoin(coin)} />
      </main>

      {/* 3. Modal chi tiết Coin [Thành viên 4] */}
      {detailCoin && (
        <CoinDetailModal 
          coin={detailCoin} 
          onClose={() => setDetailCoin(null)} 
        />
      )}

      {/* 4. Footer thông tin nhóm & đồ án [Thành viên 4] */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <CryptoProvider>
      <MainDashboard />
    </CryptoProvider>
  );
}
