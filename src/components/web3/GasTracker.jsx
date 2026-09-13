/**
 * [THÀNH VIÊN 3 - Ethereum Gas Tracker]
 * Widget theo dõi phí Gas mạng lưới Ethereum (Gwei) theo thời gian thực.
 */

import React from 'react';
import { useWallet } from '../../context/WalletContext';
import { Fuel } from 'lucide-react';

export const GasTracker = () => {
  const { gasInfo } = useWallet();

  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.6rem',
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid var(--border-subtle)',
        padding: '0.35rem 0.75rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem'
      }}
      title="Ethereum Network Gas Tracker (Gwei)"
    >
      <Fuel size={14} color="var(--accent-cyan)" />
      <span style={{ color: 'var(--text-muted)' }}>Gas:</span>
      <span className="font-mono" style={{ color: 'var(--crypto-green)', fontWeight: 600 }}>
        {gasInfo?.standard || 15} Gwei
      </span>
    </div>
  );
};
