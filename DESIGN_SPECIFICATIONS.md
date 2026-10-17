# BẢNG THÔNG SỐ THIẾT KẾ (DESIGN SYSTEM & UI LAYOUT SPECIFICATIONS)
**Dự án:** FanG Esports — Giải Đấu Esports Sinh Viên Toàn Quốc  
**Phong cách:** Cyberpunk / Esports HUD Dark Theme (FPT Signature Orange)  
**Ngày cập nhật:** 2026-09-29  

---

## 1. THƯƠNG HIỆU & HỆ MÀU CHỦ ĐẠO (COLOR PALETTE)

### 🎨 Màu thương hiệu chính (Brand Colors)
| Tên màu | Mã HEX / RGBA | Ứng dụng |
| :--- | :--- | :--- |
| **FPT Signature Orange** | `#F37022` (RGB: 243, 112, 34) | Màu nhận diện chính, Nút bấm CTA, Viền Glow, Text Gradient |
| **Orange Hover / Bright** | `#ff8235` / `#ff9800` | Trạng thái Hover nút bấm, Điểm nhấn sáng |
| **FPT Blue Accent** | `#005A9E` | Logo phụ, điểm nhấn bổ trợ |
| **FPT Green Accent** | `#00A859` | Trạng thái online, hoàn thành |

### 🌑 Màu nền & Surface (Background & Surfaces)
| Tên thuộc tính | Mã HEX / RGBA | Mô tả |
| :--- | :--- | :--- |
| **Primary Background** | `#0e0906` | Nền tối chủ đạo toàn trang (FPT Midnight Orange Dark) |
| **Secondary Background** | `#150d09` | Nền các Section xen kẽ |
| **Card Background** | `#1e130d` | Nền các thẻ Card nội dung, Modal |
| **Card Hover Background** | `#291a12` | Nền thẻ Card khi Hover |
| **Glassmorphism Base** | `rgba(30, 19, 13, 0.75)` | Nền kính mờ (Backdrop Blur: 16px, Border: `rgba(243, 112, 34, 0.25)`) |
| **Glassmorphism Strong** | `rgba(14, 9, 6, 0.92)` | Nền kính mờ đậm cho Mobile Menu, Modal (Blur: 24px) |

### 🎮 Màu sắc từng Bộ môn (Game Theme Accents)
| Bộ môn | Màu đại diện | Hiệu ứng |
| :--- | :--- | :--- |
| **VALORANT** | Neon Red `#ff4655` | Neon Glowing Border, Red Pulse Animation |
| **AOV (Liên Quân)** | Royal Gold `#f39c12` / `#ff9800` | Gold Ambient Glow, Yellow-Orange Gradient |

---

## 2. HỆ PHÔNG CHỮ & TYPOGRAPHY (TYPOGRAPHY SYSTEM)

### ✍️ Phông chữ (Font Families)
* **Tiêu đề chính (Headings):** `'Outfit'`, system-ui, sans-serif
* **Nội dung văn bản (Body Text):** `'Be Vietnam Pro'`, system-ui, sans-serif
* **Bộ môn & Cyber Buttons (Accent Fonts):** `'Montserrat'` (Weight 800), `'Oswald'` (Weight 700)

### 📏 Cỡ chữ & Trọng lượng (Font Size & Weight)
* **Hero Title (H1):** `clamp(2rem, 5vw, 4.5rem)` | Font Weight: **800 - 900 (Black)**
* **Section Title (H2):** `2.25rem - 3rem` (36px - 48px) | Font Weight: **800 (Extra Bold)**
* **Card Title (H3):** `1.25rem - 1.5rem` (20px - 24px) | Font Weight: **700 (Bold)**
* **Body Normal:** `0.875rem - 1rem` (14px - 16px) | Font Weight: **400 - 500**
* **Caption / Meta:** `0.75rem - 0.875rem` (12px - 14px) | Font Weight: **400 - 600**

---

## 3. THÔNG SỐ LAYOUT & NỀN (LAYOUT GRID & BACKGROUND LIGHTING)

### 📐 Kích thước & Lưới Layout (Grid & Container)
* **Max Width Container:** 
  * Chuẩn Section: `1152px` (`max-w-6xl`)
  * Header & Navigation: `1280px` (`max-w-7xl`)
* **Section Padding:**
  * **Mobile:** `4rem 1rem` (64px trên/dưới, 16px trái/phải)
  * **Tablet:** `5rem 2rem` (80px trên/dưới, 32px trái/phải)
  * **Desktop:** `6rem 2rem` (96px trên/dưới, 32px trái/phải)
* **Navbar Height:** `80px` (`h-20`), Cố định (`fixed top-0 left-0 right-0 z-50`)

### 💡 Ánh sáng Cyber (Ambient Glow & Lighting Layer)
* **Center Radial Light:** Vùng sáng mờ giữa trang `1000px x 600px`, màu `#F37021`/15, Blur `180px`
* **Side Ambient Orbs:** Vùng sáng hai bên `500px - 600px`, màu `#F37021`/20, Blur `160px - 170px`
* **Box Shadow Glow Standard:** `0 0 25px rgba(243, 112, 34, 0.4), 0 0 70px rgba(243, 112, 34, 0.2)`

---

## 4. CHI TIẾT CÁC COMPONENT CHÍNH (COMPONENTS SPECIFICATIONS)

### 1. GameSelector (Màn chọn Bộ môn)
* **Layout:** Chia đôi màn hình 50/50 (Responsive thành 1 cột trên Mobile).
* **Nút bấm Neon:**
  * VALORANT: Khung `#ff4655`, Text Shadow Neon, Hover Background `#ff4655`, Text Trắng.
  * AOV: Khung `#f39c12`, Text Shadow Neon, Hover Background `#f39c12`, Text Đen `#0f1923`.

### 2. Navbar & Livestream Banner
* **Thanh điều hướng (Navbar):**
  * Nền Kính mờ: `bg-[#090503]/95 backdrop-blur-md border-b border-[#F37022]/20`
  * Badge Bộ môn đang chọn: Viền tròn có animated pulse dot đỏ/vàng tương ứng.
* **Livestream Banner:** Tự động xuất hiện trên cùng khi có trận đấu trực tiếp, nút xem kèm icon phát sóng.

### 3. Hero Section
* **Key Visual (KV):** Hình ảnh đại diện Esports high-res với lớp Gradient Mask hòa trộn vào nền tối.
* **Nút Call To Action (CTA):** 
  * Nút "Đăng ký ngay": Gradient Orange (`#F37022` ➔ `#ff9d54`), viền glowing.
  * Nút "Xem thể lệ": Background mờ `bg-white/10` kèm hiệu ứng hover viền sáng.

### 4. Introduction (Thống kê HUD & Lộ trình)
* **HUD Stats Row:** 
  * 3 Thẻ chỉ số nổi bật: 32 Trường Đại Học | 64 Đội Thi Đấu | 80 Triệu VNĐ Giải Thưởng.
  * Khung viền góc Cyber cắt vát, glow `#F37022`/30 khi hover.
* **Roadmap Timeline:** 
  * Tiến trình từng giai đoạn thi đấu kết nối bằng đường nối phát sáng glowing line.

### 5. Rules (Thể lệ thi đấu)
* **Tab Navigation:** Chuyển đổi giữa *Thể lệ chung*, *Quy định Đội hình (6 thành viên)*, *Quy tắc Trận đấu*.
* **Accordion Item:** Mở rộng/thu gọn câu hỏi & thể lệ mượt mà với Framer Motion.

### 6. Team List (Danh sách Đội)
* **Bộ lọc Vùng miền:** Tabs chọn *Tất cả*, *Miền Bắc*, *Miền Trung*, *Miền Nam*.
* **Card Đội thi:** 
  * Hiển thị Logo trường, Tên Đội, Tên Trường, Danh sách 6 thành viên (5 Chính thức + 1 Dự bị) và Thông tin Liên hệ Trưởng đoàn.

### 7. Bracket (Sơ đồ Bảng đấu)
* **Thiết kế:** Cấu trúc nhánh đấu Loại trực tiếp (Single Elimination Tree).
* **Trận đấu (Match Card):** Khung viền Cyber HUD với thông số điểm số, tên 2 đội và tag trạng thái *(Đã xong / Sắp diễn ra)*.

### 8. News & Workshop
* **Card Tin tức & Workshop:** 
  * Tỷ lệ khung hình ảnh: `16:9` (`aspect-video`), bo góc `rounded-2xl`.
  * Tag phân loại: Valorant (`#ff4655`), AOV (`#f39c12`), Tin chung (`#F37022`).
  * Modal chi tiết: Tích hợp nút xem **"Link Bài Viết Gốc"** dẫn trực tiếp nguồn báo/bài viết chính thức.

### 9. Admin Console
* **Giao diện Quản trị:** Tích hợp quản lý Livestream per-game, Đăng ký đội, Danh sách tin tức, Thống kê lượt quét QR & lượt truy cập thời gian thực.
