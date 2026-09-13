import React, { useState } from 'react';
import { CryptoProvider } from './context/CryptoContext';
import { WalletProvider } from './context/WalletContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MarketOverview } from './components/dashboard/MarketOverview';
import { PriceChart } from './components/charts/PriceChart';
import { CoinTable } from './components/dashboard/CoinTable';
import { PortfolioView } from './components/portfolio/PortfolioView';
import { CoinDetailModal } from './components/coin-detail/CoinDetailModal';
import { Toast } from './components/common/Toast';
import './styles/index.css';
import './styles/components.css';

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'portfolio'
  const [detailCoin, setDetailCoin] = useState(null);
  const [initialCoinToAdd, setInitialCoinToAdd] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const handleQuickAddToPortfolio = (coin) => {
    setInitialCoinToAdd(coin);
    setActiveTab('portfolio');
    setToastMsg({ text: `Đã chuyển hướng: Thêm ${coin.name} vào danh mục!`, type: 'success' });
  };

  return (
    <div className="app-container">
      {/* 1. Header Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Main Content Body */}
      <main className="main-content">
        {activeTab === 'dashboard' ? (
          <>
            {/* Thống kê vĩ mô [Thành viên 2] */}
            <MarketOverview />

            {/* Biểu đồ giá trực quan [Thành viên 2] */}
            <PriceChart onOpenDetail={(coin) => setDetailCoin(coin)} />

            {/* Bảng giá toàn bộ coin & Tìm kiếm [Thành viên 2 & 4] */}
            <CoinTable 
              onOpenDetail={(coin) => setDetailCoin(coin)} 
              onQuickAddToPortfolio={handleQuickAddToPortfolio}
            />
          </>
        ) : (
          /* Quản lý danh mục & Lời lỗ Web3 [Thành viên 3] */
          <PortfolioView 
            initialCoinToAdd={initialCoinToAdd}
            onClearInitialCoin={() => setInitialCoinToAdd(null)}
          />
        )}
      </main>

      {/* 3. Modal chi tiết Coin [Thành viên 4] */}
      {detailCoin && (
        <CoinDetailModal 
          coin={detailCoin} 
          onClose={() => setDetailCoin(null)} 
        />
      )}

      {/* 4. Toast Alerts [Thành viên 4] */}
      {toastMsg && (
        <Toast 
          message={toastMsg.text} 
          type={toastMsg.type} 
          onClose={() => setToastMsg(null)} 
        />
      )}

      {/* 5. Footer thông tin nhóm & đồ án [Thành viên 4] */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <CryptoProvider>
      <WalletProvider>
        <MainDashboard />
      </WalletProvider>
    </CryptoProvider>
  );
}
