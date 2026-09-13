# 🌐 CryptoPulse.Web3 - Crypto Analytics Dashboard

Dashboard theo dõi tỷ giá tiền mã hóa thời gian thực bằng **CoinGecko REST API**, tích hợp **Web3 MetaMask** và quản lý danh mục đầu tư (**Portfolio PnL**).

---

## ⚡ 1. Khởi chạy nhanh

```bash
# Cài đặt thư viện
npm install

# Chạy server phát triển (Mở http://localhost:3000)
npm run dev

# Đóng gói sản phẩm nộp bài
npm run build
```

---

## 👥 2. Phân công Code & Viết Báo cáo (Tất cả 4 thành viên đều trực tiếp viết Code)

> ⚠️ **Đảm bảo tính công bằng & Điểm số:** Mỗi thành viên đều làm chủ một module kỹ thuật độc lập, có file code riêng đứng tên để giảng viên kiểm tra Git commit log và vấn đáp trực tiếp.

| Thành viên | Module Code đảm nhiệm | Nội dung phụ trách viết trong Báo cáo |
| :--- | :--- | :--- |
| **Thành viên 1**<br>*(Backend & Data)* | • `coingecko.js`<br>• `cache.js`<br>• `CryptoContext.jsx` | • Tích hợp REST API CoinGecko.<br>• Thuật toán Cache In-Memory + LocalStorage 30s chống lỗi 429.<br>• State quản lý thị trường & chuyển đổi tiền tệ USD/VND. |
| **Thành viên 2**<br>*(UI & Biểu đồ SVG)* | • `PriceChart.jsx`<br>• `MarketOverview.jsx` | • Thuật toán vẽ biểu đồ SVG động & miền màu Gradient.<br>• Ma trận đảo tọa độ `SVG ScreenCTM` giúp chuột bắt dính 100%.<br>• Trục thời gian ngang X-axis đa khung giờ (24H, 7D, 30D, 1Y). |
| **Thành viên 3**<br>*(Blockchain & Web3)* | • `web3Service.js`<br>• `WalletContext.jsx`<br>• `WalletConnectButton.jsx`<br>• `GasTracker.jsx` | • Kết nối ví phi tập trung MetaMask & Provider ví Demo Sepolia.<br>• Truy vấn số dư ETH on-chain và theo dõi phí Gas mạng lưới (Gwei). |
| **Thành viên 4**<br>*(Portfolio & On-Chain)* | • `PortfolioView.jsx`<br>• `CoinDetailModal.jsx`<br>• `CoinTable.jsx` | • Thuật toán tính toán tài chính: Vốn đầu tư, Giá DCA, Lời/Lỗ ròng (PnL % và $).<br>• Phân tích chỉ số On-chain: ATH/ATL, tra cứu Smart Contract Address.<br>• Thuật toán tìm kiếm, phân loại danh mục và Mini Sparklines 7D. |

---

## 🚀 3. Điểm nổi bật kỹ thuật của Hệ thống

1. **Đồng bộ hóa thời gian:** Biểu đồ mặc định mở khung **24H** khớp trực tiếp với CoinGecko & Binance; nối điểm giá tức thời và hiển thị mốc `CoinGecko Sync`.
2. **Chuột bắt dính 100%:** Dùng phép biến đổi ma trận `ScreenCTM` giải quyết triệt để lỗi lệch tọa độ trục khi rê chuột.
3. **Phù hợp môi trường chấm bài:** Có sẵn **Ví Web3 Sepolia Demo** (có 2.458 ETH) và **Safe Mode Cache** đảm bảo khi thầy cô chấm bài luôn chạy mượt mà, không phụ thuộc vào tiện ích cài trên máy.

---

> 📖 **Xem chi tiết kịch bản trả lời câu hỏi vấn đáp tại:** [TEAM_ASSIGNMENT.md](./TEAM_ASSIGNMENT.md).
