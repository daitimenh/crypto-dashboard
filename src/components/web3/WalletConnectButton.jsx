/**
 * [THÀNH VIÊN 3 - Wallet Connect Button]
 * Nút kết nối ví Web3 với hiển thị địa chỉ rút gọn, mạng lưới, số dư ETH và nút ngắt kết nối.
 */

import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { Wallet, LogOut, CheckCircle2, ShieldCheck } from 'lucide-react';
import { web3Service } from '../../services/web3Service';

export const WalletConnectButton = () => {
  const { wallet, isConnected, isConnecting, connectWallet, disconnectWallet } = useWallet();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!isConnected) {
    return (
      <button 
        className="btn btn-primary btn-sm"
        onClick={() => connectWallet(false)}
        disabled={isConnecting}
      >
        <Wallet size={15} />
        <span>{isConnecting ? 'Đang kết nối...' : 'Kết nối Ví Web3'}</span>
      </button>
    );
  }

  const shortAddr = web3Service.truncateAddress(wallet.address || wallet.fullAddress);

  return (
    <div style={{ position: 'relative' }}>
      <button 
        className="btn btn-outline btn-sm"
        style={{ borderColor: 'var(--accent-primary)', background: 'rgba(99, 102, 241, 0.1)' }}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--crypto-green)' }} />
        <span className="font-mono">{shortAddr}</span>
        <span className="badge-neutral" style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}>
          {wallet.balance || '0.00'} ETH
        </span>
      </button>

      {dropdownOpen && (
        <div 
          className="glass-card" 
          style={{ 
            position: 'absolute', 
            top: '110%', 
            right: 0, 
            minWidth: '240px', 
            padding: '1rem',
            zIndex: 60,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={16} color="var(--crypto-green)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {wallet.isSimulated ? 'Ví Web3 Sepolia (Demo)' : 'MetaMask Connected'}
            </span>
          </div>

          <div style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: 6 }}>
            <div style={{ color: 'var(--text-muted)' }}>Địa chỉ ví đầy đủ:</div>
            <div className="font-mono" style={{ wordBreak: 'break-all', color: 'var(--accent-cyan)' }}>
              {wallet.fullAddress || wallet.address}
            </div>
          </div>

          <button 
            className="btn btn-outline btn-sm" 
            style={{ width: '100%', color: 'var(--crypto-red)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
            onClick={() => {
              disconnectWallet();
              setDropdownOpen(false);
            }}
          >
            <LogOut size={14} />
            <span>Ngắt kết nối ví</span>
          </button>
        </div>
      )}
    </div>
  );
};
