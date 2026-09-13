# 🌐 CryptoPulse.Analytics - Realtime Crypto Dashboard

Dashboard theo dõi tỷ giá tiền mã hóa theo thời gian thực sử dụng **CoinGecko REST API**, hỗ trợ phân tích xu hướng thị trường, biểu đồ SVG động đa khung thời gian và tra cứu chi tiết các dự án Blockchain.

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

| Thành viên | Module Code đảm nhiệm | Nội dung phụ trách viết trong Báo cáo |
| :--- | :--- | :--- |
| **Thành viên 1**<br>*(Backend & Data)* | • `coingecko.js`<br>• `cache.js`<br>• `CryptoContext.jsx` | • Tích hợp REST API CoinGecko qua Vite Proxy.<br>• Thuật toán Cache In-Memory + LocalStorage 30s chống lỗi 429.<br>• State quản lý thị trường & chuyển đổi tiền tệ USD/VND. |
| **Thành viên 2**<br>*(UI & Biểu đồ SVG)* | • `PriceChart.jsx`<br>• `MarketOverview.jsx` | • Thuật toán vẽ biểu đồ SVG động & miền màu Gradient.<br>• Ma trận đảo tọa độ `SVG ScreenCTM` giúp chuột bắt dính 100%.<br>• Trục thời gian ngang X-axis đa khung giờ (24H, 7D, 30D, 1Y). |
| **Thành viên 3**<br>*(Market Trends)* | • `MarketTrends.jsx` | • Phân hệ phát hiện xu hướng thị trường nổi bật 24H.<br>• Thuật toán lọc Top Gainers (Tăng mạnh nhất), Top Losers (Giảm sâu nhất) và Highest Volume.<br>• Liên kết tương tác với biểu đồ chính khi click chọn coin. |
| **Thành viên 4**<br>*(Bảng giá & Chi tiết)* | • `CoinTable.jsx`<br>• `CoinDetailModal.jsx`<br>• `Navbar.jsx` | • Bảng giá Top coins với Mini Sparklines 7 ngày.<br>• Thuật toán tìm kiếm, phân loại danh mục (Layer 1, DeFi, Meme).<br>• Phân tích chỉ số On-chain: Đỉnh ATH, Đáy ATL, Contract Address. |

---

## 🚀 3. Điểm nổi bật kỹ thuật của Hệ thống

1. **Dữ liệu thật 100% từ CoinGecko:** Tích hợp Vite Proxy (`/coingecko-api`) loại bỏ hoàn toàn lỗi chặn CORS của trình duyệt, cập nhật sát theo từng phút của thị trường toàn cầu.
2. **Biểu đồ trực quan chính xác:** Mặc định mở khung **24H** (khớp với CoinGecko & Binance), chuột bắt dính 100% nhờ ma trận `SVG ScreenCTM`, có trục thời gian ngang X-axis rõ ràng.
3. **Phân tích xu hướng thông minh (Market Trends):** Tự động phát hiện Top 3 đồng coin tăng/giảm mạnh nhất trong 24 giờ.
4. **Chuyển đổi tiền tệ linh hoạt:** Hỗ trợ xem tỷ giá theo cả **USD ($)** và **VND (₫)**.

---

> 📖 **Xem chi tiết kịch bản trả lời câu hỏi vấn đáp tại:** [TEAM_ASSIGNMENT.md](./TEAM_ASSIGNMENT.md).
