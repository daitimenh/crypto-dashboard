/**
 * [THÀNH VIÊN 4 - Toast Notification]
 * Thông báo nổi trạng thái (Thành công, cảnh báo Rate Limit, thông báo ví)
 */

import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 100,
        background: '#0f172a',
        border: `1px solid ${isSuccess ? 'var(--crypto-green)' : 'var(--crypto-gold)'}`,
        boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      {isSuccess ? <CheckCircle2 size={18} color="var(--crypto-green)" /> : <AlertTriangle size={18} color="var(--crypto-gold)" />}
      <span style={{ fontSize: '0.85rem', color: '#fff' }}>{message}</span>
      <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
        <X size={15} />
      </button>
    </div>
  );
};
