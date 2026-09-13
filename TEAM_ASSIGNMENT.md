# 📘 BẢNG PHÂN CÔNG CODE & NỘI DUNG BÁO CÁO 4 THÀNH VIÊN

> ⚠️ **Quy tắc bắt buộc:** Cả 4 thành viên đều **trực tiếp viết code** cho module chức năng của mình (đảm bảo lịch sử Git commit đồng đều, không ai chỉ làm báo cáo để tránh bị đánh giá thấp điểm). Mỗi người tự phụ trách viết nội dung và chụp ảnh minh chứng cho module mình code.

---

## 👥 1. Phân chia Module Code & Viết Báo cáo chi tiết

```
                         [HỆ THỐNG CRYPTOPULSE DASHBOARD]
                                        │
     ┌──────────────────┬───────────────┴───────────────┬──────────────────┐
     ▼                  ▼                               ▼                  ▼
[Thành viên 1]     [Thành viên 2]                 [Thành viên 3]     [Thành viên 4]
Tầng Dữ liệu &      Tầng Biểu đồ &                 Tầng Web3 &        Tầng Quản lý PnL &
Cache chống 429     Trực quan hóa SVG             Blockchain On-chain Tra cứu On-chain
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

### 👨‍💻 **Thành viên 3: Blockchain & Web3 Specialist**
* **Files code đảm nhiệm:**
  * `src/services/web3Service.js`: Kết nối RPC với ví phi tập trung MetaMask (`window.ethereum`), lấy địa chỉ tài khoản on-chain (`eth_requestAccounts`) và số dư ETH (`eth_getBalance`).
  * Xây dựng Provider giả lập ví Web3 Testnet Sepolia phục vụ môi trường máy giảng viên không cài extension.
  * `src/context/WalletContext.jsx`: Quản lý phiên kết nối ví, xử lý sự kiện thay đổi ví và theo dõi phí Gas mạng lưới Ethereum (Gwei).
  * `src/components/web3/WalletConnectButton.jsx` & `GasTracker.jsx`: Xây dựng giao diện tương tác ví và widget phí Gas.
* **Nội dung viết Báo cáo:**
  * Chương: *Ứng dụng Công nghệ Chuỗi khối (Blockchain Integration)*.
  * Trình bày cơ chế kết nối ví phi tập trung, đọc dữ liệu on-chain và đo lường phí giao dịch Gas.

---

### 👨‍💻 **Thành viên 4: Financial Logic & On-Chain Explorer Lead**
* **Files code đảm nhiệm:**
  * `src/components/portfolio/PortfolioView.jsx`: Lập trình module Quản lý danh mục đầu tư; tính toán tài chính: Vốn đầu tư gốc, Giá mua trung bình (DCA), Giá trị thị trường hiện tại và tỷ lệ Lời/Lỗ ròng (**Net PnL % và $**) theo dữ liệu giá realtime; đồng bộ LocalStorage.
  * `src/components/coin-detail/CoinDetailModal.jsx`: Phân tích chỉ số On-chain chuyên sâu (Đỉnh ATH, Đáy ATL, Nguồn cung lưu hành, Smart Contract Address kèm sao chép clipboard).
  * `src/components/dashboard/CoinTable.jsx`: Bảng xếp hạng Top Coins, thuật toán lọc phân loại (Layer 1, DeFi, Meme, Stablecoin), thuật toán sắp xếp đa tiêu chí và biểu đồ Mini Sparkline 7D.
* **Nội dung viết Báo cáo:**
  * Chương: *Thuật toán Quản lý Danh mục Đầu tư (PnL) & Tra cứu Hợp đồng On-Chain*.
  * Trình bày công thức tính toán tài chính PnL và cấu trúc dữ liệu lưu trữ danh mục.

---

## 🎯 2. Trách nhiệm chung về Báo cáo & Thuyết trình

* **Phần mở đầu & Kết luận:** Cả 4 thành viên cùng đóng góp 1 phần.
* **Lắp ráp & Format Báo cáo:** Cả 4 người gom nội dung từng chương vào file Word/PDF theo mẫu của trường.
* **Slide thuyết trình:** Mỗi người tự thiết kế 2–3 slide tương ứng với đúng phần code của mình để khi vấn đáp, ai cũng tự tin mở code của mình ra giải thích cho thầy cô.

---

## 💡 3. Các câu hỏi phản biện trọng tâm của Giảng viên

1. **Câu hỏi cho Thành viên 1 (Data):** *"Làm sao hệ thống không bị lỗi HTTP 429 khi CoinGecko giới hạn lượt gọi?"*
   * *Trả lời:* Dùng cơ chế Cache 2 tầng (In-memory + LocalStorage 30s). Mọi request trùng lặp đều đọc từ cache. Nếu bị 429 thì tự động kích hoạt Safe Mode nạp dữ liệu dự phòng chuẩn, không bao giờ để web bị sập.
2. **Câu hỏi cho Thành viên 2 (Biểu đồ):** *"Tại sao chuột di chuyển trên biểu đồ bắt dính chính xác vào các mốc thời gian?"*
   * *Trả lời:* Sử dụng ma trận đảo tọa độ `SVG ScreenCTM` của phần tử SVG để ánh xạ trực tiếp pixel màn hình chuột sang tọa độ viewBox nội bộ, không bị ảnh hưởng bởi CSS scale.
3. **Câu hỏi cho Thành viên 3 (Blockchain):** *"Dự án tương tác với Blockchain ở điểm nào?"*
   * *Trả lời:* Tích hợp Web3 Provider kết nối ví MetaMask, truy vấn số dư ETH on-chain và theo dõi phí Gas của mạng lưới Ethereum thời gian thực.
4. **Câu hỏi cho Thành viên 4 (Portfolio & On-chain):** *"Công thức tính PnL và việc quản lý danh mục đầu tư hoạt động ra sao?"*
   * *Trả lời:* Hệ thống tính `PnL = (Giá thị trường - Giá mua) × Khối lượng`, kết hợp tra cứu Smart Contract on-chain và phân loại token theo Layer 1/DeFi/Meme.
