// Footer: Attribution, live network status and project meta

import React from 'react';
import { ShieldCheck, Code2, Users, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <ShieldCheck size={18} color="var(--accent-primary)" />
              <span>Đồ Án Môn Học: Công Nghệ Chuỗi Khối (Blockchain Technology)</span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Hệ thống Crypto Analytics Dashboard tích hợp CoinGecko REST API và Web3 MetaMask Wallet.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Dữ liệu cung cấp bởi:</span>
            <a 
              href="https://www.coingecko.com/api" 
              target="_blank" 
              rel="noreferrer"
              style={{ color: 'var(--accent-cyan)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              CoinGecko API <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Bảng phân chia 4 thành viên */}
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Users size={14} />
            <span>Phân công trách nhiệm nhóm 4 thành viên:</span>
          </div>
          <div className="footer-team">
            <div className="member-chip">
              <span>Thành viên 1:</span> Backend, CoinGecko API & Cache 30s
            </div>
            <div className="member-chip">
              <span>Thành viên 2:</span> Biểu đồ SVG, Trục thời gian & ScreenCTM
            </div>
            <div className="member-chip">
              <span>Thành viên 3:</span> Kết nối Web3 MetaMask & Phí Gas on-chain
            </div>
            <div className="member-chip">
              <span>Thành viên 4:</span> Quản lý Danh mục PnL & Tra cứu Smart Contract
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
