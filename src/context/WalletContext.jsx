// Wallet Context: MetaMask and Demo wallet connection state & Gas tracking

import React, { createContext, useContext, useState, useEffect } from 'react';
import { web3Service } from '../services/web3Service';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(() => {
    // Kiểm tra đã lưu ví trước đó chưa
    try {
      const saved = localStorage.getItem('cryptopulse_wallet');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [gasInfo, setGasInfo] = useState({ slow: 12, standard: 16, fast: 24 });
  const [isConnecting, setIsConnecting] = useState(false);

  // Cập nhật phí Gas định kỳ
  useEffect(() => {
    web3Service.getGasEstimates().then(setGasInfo);
    const interval = setInterval(() => {
      web3Service.getGasEstimates().then(setGasInfo);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const connectWallet = async (forceDemo = false) => {
    setIsConnecting(true);
    try {
      if (!forceDemo && web3Service.hasMetaMask()) {
        const res = await web3Service.connectMetaMask();
        setWallet(res);
        localStorage.setItem('cryptopulse_wallet', JSON.stringify(res));
      } else {
        // Tự động fallback sang Demo Wallet để luôn demo thành công
        const demo = web3Service.connectDemoWallet();
        setWallet(demo);
        localStorage.setItem('cryptopulse_wallet', JSON.stringify(demo));
      }
    } catch (err) {
      console.warn("Chuyển sang Ví Web3 Giả lập (Demo Mode):", err.message);
      const demo = web3Service.connectDemoWallet();
      setWallet(demo);
      localStorage.setItem('cryptopulse_wallet', JSON.stringify(demo));
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    localStorage.removeItem('cryptopulse_wallet');
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        isConnected: Boolean(wallet),
        isConnecting,
        gasInfo,
        connectWallet,
        disconnectWallet,
        hasMetaMask: web3Service.hasMetaMask()
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
