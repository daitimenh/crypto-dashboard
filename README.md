# 🌐 CryptoPulse.Analytics - Realtime Crypto Dashboard

Dashboard theo dõi tỷ giá tiền mã hóa theo thời gian thực sử dụng **CoinGecko REST API** kết hợp **Binance Realtime Data Engine**, hỗ trợ phân tích xu hướng thị trường, biểu đồ SVG động đa khung thời gian và tra cứu chi tiết các dự án Blockchain.

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
| **Thành viên 1**<br>*(Backend & Data)* | • `coingecko.js`<br>• `cache.js`<br>• `CryptoContext.jsx`<br>• `mockData.js` | • Tích hợp REST API CoinGecko qua Vite Proxy chống CORS.<br>• Thuật toán Cache Stale-While-Revalidate chống lỗi 429.<br>• Tầng dự phòng Live nến giá từ Binance Public REST API v3.<br>• State quản lý thị trường & chuyển đổi tiền tệ USD/VND. |
| **Thành viên 2**<br>*(UI & Biểu đồ SVG)* | • `PriceChart.jsx`<br>• `MarketOverview.jsx` | • Thuật toán vẽ biểu đồ SVG động & miền màu Gradient.<br>• Ma trận đảo tọa độ `SVG ScreenCTM` giúp chuột bắt dính 100%.<br>• Trục thời gian ngang X-axis đa khung giờ (24H, 7D, 30D, 1Y).<br>• Xử lý đồng bộ `isChartGain` chống lỗi sập màn hình khi hover. |
| **Thành viên 3**<br>*(Market Trends)* | • `MarketTrends.jsx` | • Phân hệ phát hiện xu hướng thị trường nổi bật 24H.<br>• Thuật toán lọc Top Gainers (Tăng mạnh nhất), Top Losers (Giảm sâu nhất) và Highest Volume.<br>• Liên kết tương tác với biểu đồ chính khi click chọn coin. |
| **Thành viên 4**<br>*(Bảng giá & Chi tiết)* | • `CoinTable.jsx`<br>• `CoinDetailModal.jsx`<br>• `Navbar.jsx`<br>• `Footer.jsx` | • Bảng giá Top coins với Mini Sparklines 7 ngày.<br>• Thuật toán tìm kiếm, phân loại danh mục (Layer 1, DeFi, Meme).<br>• Phân tích chỉ số On-chain: Đỉnh ATH, Đáy ATL, Contract Address. |

---

## 🚀 3. Điểm nổi bật kỹ thuật của Hệ thống

1. **Kiến trúc Dữ liệu 4 Tầng (Multi-Tier Resilient Engine):** Kết hợp CoinGecko API qua Vite Proxy, Cache Stale-While-Revalidate, và tầng nến giá thời gian thực từ Binance REST API v3, đảm bảo hệ thống không bao giờ bị gián đoạn hay lỗi 429.
2. **Biểu đồ trực quan chính xác:** Mặc định mở khung **24H** (khớp với CoinGecko & Binance), chuột bắt dính 100% nhờ ma trận `SVG ScreenCTM`, có trục thời gian ngang X-axis rõ ràng.
3. **Phân tích xu hướng thông minh (Market Trends):** Tự động phát hiện Top 3 đồng coin tăng/giảm mạnh nhất và khối lượng giao dịch đột biến trong 24 giờ.
4. **Chuyển đổi tiền tệ linh hoạt:** Hỗ trợ xem tỷ giá theo cả **USD ($)** và **VND (₫)**.

---

## 📚 4. Tài liệu Báo cáo & Thuyết minh Đồ án

* 📘 **Bảng phân công chi tiết & Kịch bản trả lời Giảng viên:** [TEAM_ASSIGNMENT.md](./TEAM_ASSIGNMENT.md)
* 📄 **Dàn ý chi tiết Báo cáo kỹ thuật theo chương (kèm Nhật ký xử lý sự cố):** [REPORT_OUTLINE.md](./REPORT_OUTLINE.md)
