# 📘 BẢNG PHÂN CÔNG CODE & NỘI DUNG BÁO CÁO 4 THÀNH VIÊN
*(Đề tài: Hệ thống Dashboard Theo Dõi Tỷ Giá Tiền Mã Hóa - CoinGecko Analytics)*

> ⚠️ **Quy tắc bắt buộc:** Cả 4 thành viên đều **trực tiếp viết code** cho module chức năng của mình trên Dashboard, đảm bảo lịch sử Git commit đồng đều. Mỗi người tự phụ trách viết thuyết minh kỹ thuật và chụp ảnh minh chứng cho module mình lập trình.

---

## 👥 1. Phân chia Module Code & Viết Báo cáo chi tiết

```
                         [HỆ THỐNG CRYPTOPULSE DASHBOARD]
                                        │
     ┌──────────────────┬───────────────┴───────────────┬──────────────────┐
     ▼                  ▼                               ▼                  ▼
[Thành viên 1]     [Thành viên 2]                 [Thành viên 3]     [Thành viên 4]
Tầng Dữ liệu &      Tầng Biểu đồ SVG &             Tầng Xu hướng      Tầng Bảng giá,
Cache chống 429     Trục thời gian X-axis          Gainers/Losers 24H Tra cứu ATH/ATL
```

---

### 👨‍💻 **Thành viên 1: Backend / Data Engine & Caching Lead**
* **Files code đảm nhiệm:**
  * `src/services/coingecko.js`: Viết REST client kết nối API CoinGecko, định tuyến các endpoint (`markets`, `market_chart`, `global`), xử lý retry và chuẩn hóa dữ liệu.
  * `src/services/cache.js`: Lập trình thuật toán Cache In-Memory + LocalStorage với cơ chế tự hết hạn (TTL 30s) để giải quyết triệt để lỗi `HTTP 429 Too Many Requests`.
  * `src/context/CryptoContext.jsx`: Quản lý State toàn cục của thị trường, bộ đếm chu kỳ làm mới và logic chuyển đổi tiền tệ USD ↔ VND.
  * `src/mock/mockData.js`: Xây dựng tập dữ liệu fallback chuẩn khi mất kết nối mạng.
* **Nội dung viết Báo cáo:**
  * Chương: *Kiến trúc dữ liệu & Tích hợp REST API*.
  * Trình bày cơ chế bộ đệm Cache chống nghẽn và giải thuật Fallback an toàn.

---

### 👨‍💻 **Thành viên 2: Visual Analytics / Biểu đồ SVG Lead**
* **Files code đảm nhiệm:**
  * `src/components/charts/PriceChart.jsx`: Lập trình thuật toán vẽ biểu đồ SVG động (tính toán tọa độ `viewBox`, đường cong giá `M/L`, miền màu chuyển sắc Gradient).
  * Thuật toán biến đổi ma trận `svg.createSVGPoint().matrixTransform(svg.getScreenCTM().inverse())` để thanh gióng Crosshair bắt dính 100% theo con trỏ chuột không bị lệch trục.
  * Xây dựng trục thời gian ngang (**X-Axis**) chia mốc tự động theo 4 khung giờ: `24H`, `7D`, `30D`, `1Y`.
  * `src/components/dashboard/MarketOverview.jsx`: Thống kê vĩ mô vốn hóa toàn cầu, khối lượng giao dịch và tỷ lệ thống trị Bitcoin (BTC.D).
* **Nội dung viết Báo cáo:**
  * Chương: *Thiết kế Giao diện Trực quan & Thuật toán vẽ Biểu đồ*.
  * Trình bày giải thuật tính toán tọa độ SVG và xử lý tương tác đa khung thời gian.

---

### 👨‍💻 **Thành viên 3: Market Trends & Highlights Lead**
* **Files code đảm nhiệm:**
  * `src/components/dashboard/MarketTrends.jsx`: Lập trình phân hệ phát hiện xu hướng thị trường nóng:
    * Thuật toán lọc & sắp xếp **Top 3 Coin tăng giá mạnh nhất 24H (Top Gainers)**.
    * Thuật toán lọc & sắp xếp **Top 3 Coin giảm giá sâu nhất 24H (Top Losers)**.
    * Thuật toán lọc & sắp xếp **Top 3 Coin có khối lượng giao dịch đột biến (Highest Volume)**.
    * Tích hợp sự kiện tương tác: Click vào bất kỳ coin nào trong Top Trends sẽ tự động chuyển biểu đồ chính sang theo dõi coin đó.
* **Nội dung viết Báo cáo:**
  * Chương: *Thuật toán Phân tích Xu hướng Thị trường Nổi bật (Market Trends)*.
  * Trình bày logic sắp xếp động các mảng dữ liệu tài chính đa chiều.

---

### 👨‍💻 **Thành viên 4: Market Table, Search & Deep Analytics Lead**
* **Files code đảm nhiệm:**
  * `src/components/dashboard/CoinTable.jsx`: Bảng xếp hạng giá Top coins, thuật toán tìm kiếm thời gian thực (Search filter), bộ lọc danh mục (Layer 1, DeFi, Meme, Stablecoin), sắp xếp đa cột (Sort by Price, Volume, Market Cap) và biểu đồ mini Sparklines 7 ngày.
  * `src/components/coin-detail/CoinDetailModal.jsx`: Phân tích chuyên sâu từng dự án: Đỉnh cao nhất mọi thời đại (ATH), Đáy thấp nhất (ATL), Cung lưu hành (Circulating Supply), Smart Contract Address và liên kết trang web chính thức.
  * `src/components/layout/Navbar.jsx`: Thanh điều hướng, công tắc chuyển đổi tiền tệ USD ↔ VND và nút làm mới dữ liệu.
* **Nội dung viết Báo cáo:**
  * Chương: *Thiết kế Bảng Dữ liệu Thị trường & Tra cứu Chi tiết Dự án*.
  * Trình bày các thuật toán tìm kiếm, phân loại và kiến trúc cửa sổ Modal phân tích dữ liệu.

---

## 🎯 2. Trách nhiệm chung về Báo cáo & Thuyết trình

* **Phần mở đầu & Kết luận:** Cả 4 thành viên cùng đóng góp 1 phần.
* **Lắp ráp & Format Báo cáo:** Cả 4 người gom nội dung từng chương vào file Word/PDF theo mẫu của trường.
* **Slide thuyết trình:** Mỗi người tự thiết kế 2–3 slide tương ứng với đúng phần code của mình để khi vấn đáp, ai cũng tự tin mở code của mình ra giải thích cho thầy cô.

---

## 💡 3. Các câu hỏi phản biện trọng tâm của Giảng viên

1. **Câu hỏi cho Thành viên 1 (Data):** *"Làm sao hệ thống không bị lỗi HTTP 429 khi CoinGecko giới hạn lượt gọi?"*
   * *Trả lời:* Dùng cơ chế Cache 2 tầng (In-memory + LocalStorage 30s) và Vite Proxy trung gian (`/coingecko-api`) để loại bỏ hoàn toàn lỗi CORS và tránh spam request lên máy chủ.
2. **Câu hỏi cho Thành viên 2 (Biểu đồ):** *"Tại sao chuột di chuyển trên biểu đồ bắt dính chính xác vào các mốc thời gian?"*
   * *Trả lời:* Sử dụng ma trận đảo tọa độ `SVG ScreenCTM` của phần tử SVG để ánh xạ trực tiếp pixel màn hình chuột sang tọa độ viewBox nội bộ, không bị ảnh hưởng bởi CSS scale.
3. **Câu hỏi cho Thành viên 3 (Xu hướng):** *"Phân hệ Market Trends hoạt động như thế nào?"*
   * *Trả lời:* Hệ thống tính toán và sắp xếp mảng dữ liệu thị trường theo 3 trường `% thay đổi 24h tăng dần, giảm dần và tổng volume`, liên kết state với biểu đồ trung tâm.
4. **Câu hỏi cho Thành viên 4 (Bảng giá & Chi tiết):** *"Tính năng tìm kiếm và lọc danh mục hoạt động ra sao?"*
   * *Trả lời:* Áp dụng cơ chế lọc mảng nhiều lớp (Multi-stage array filtering) kết hợp tìm kiếm theo chuỗi (Symbol/Name) và kiểm tra danh mục Web3 (Layer 1, DeFi, Meme).
