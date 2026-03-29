---
title: "Hướng dẫn Gọi Agent (CM Frappe)"
description: "Cách tiếp cận đúng khi sử dụng CM Frappe Agent và 7-Layer Architecture."
keywords: "frappe agents, how to use, 7 layer, ai code generation"
---

# Hướng dẫn Gọi Agent (Frappe Workflow)

Thay vì viết prompt tuỳ ý, bạn sẽ làm việc với Frappe Kit một cách **hiệu quả gấp 10 lần** nếu hiểu được mô hình chia để trị (_divide and conquer_). CM Frappe phân chia vòng đời dự án Frappe thành các Agent khác nhau. 

Dưới đây là công thức chuẩn để ra lệnh cho AI (hay kích hoạt Agent):

---

## 1. Nguyên lý 7-Layer Architecture

Để tránh code rối rắm (Spaghetti code) thường gặp ở Frappe, bạn luôn phải ép Agent hoặc bản thân tuân thủ **7 Lớp Kiến trúc**:

1. **DocType (Layer 1):** Chỉ khai báo trường dữ liệu (Schema). Không có tính toán trong file `.json`.
2. **Engines (Layer 2 - Cực Kỳ Quan Trọng):** Thuần Python, chứa logic nghiệp vụ cốt lõi. **Không được gọi `frappe.db` ở đây để dễ test.**
3. **API (Layer 3):** `@frappe.whitelist` làm nhiệm vụ lấy request từ client và đẩy vào Engine.
4. **Tasks (Layer 4):** Lịch trình (Cron Jobs) bọc Engine.
5. **Setup (Layer 5):** `after_install`, `after_migrate` để nạp dữ liệu mặc định.
6. **Tests (Layer 6):** Viết test độc lập cho Layer 2.
7. **Client JS (Layer 7):** Form/List script gọi lại giao tiếp với Layer 3.

---

## 2. Các Bước Gọi AI Agent Chuẩn

Bạn có thể ra lệnh (prompt) theo đúng vòng đời sau để máy móc sinh code chuẩn xác theo 7 Layer trên:

### Bước 1: Thiết kế Cơ sở Dữ liệu (DocType Architect)

Khi cần tính năng mới (ví dụ Quản lý Lương), khoan vội bảo AI "Viết code tính lương đi". Hãy gọi:
> _`@doctype-architect` Thiết kế cho tôi DocType "Payroll" với các field cơ bản và DocType "Payroll Detail" liên kết bằng Table._

Agent sẽ phác thảo Schema chuẩn Frappe mà không nhảy vào code logic ngay.

### Bước 2: Viết Logic Backend (Frappe Backend)

Sau khi có DocType, bạn cần có xử lý nghiệp vụ (ví dụ: Chốt lương cuối tháng). Gọi Backend Agent:
> _`@frappe-backend` Viết Engine tính lương cho "Payroll" (Layer 2). Sau đó tạo Endpoint `@frappe.whitelist()` (Layer 3) để client gọi._

Việc này giúp Agent không tự ý quăng toàn bộ code vào `validate()` của DocType.

### Bước 3: Gắn Frontend (Frappe Frontend)

Khi Backend đã xong, bạn bắt đầu muốn giao diện Frontend. Lúc này gọi:
> _`@frappe-frontend` Viết Client Script `payroll.js`. Gọi whitelist API từ Backend đã tạo._

### Bước 4: Sửa Bug (Frappe Fixer / Debugger)

Khi phát sinh lỗi "Nút Submit bị crash 500", bạn **Không nên** dùng prompt cộc lốc "Lỗi rồi sửa đi". Hãy gọi rõ ràng:
> _`@frappe-debugger` Kiểm tra lỗi ở file `error.log` / `worker.log` để xem vì sao Submit hỏng._

Sau khi máy đã bắt được lỗi:
> _`@frappe-fixer` Lên kế hoạch sửa lỗi và tiến hành sửa theo 7-Layer._

---

## 3. Top Prompt Thông Dụng

Với bộ công cụ đã setup sẵn, mọi từ khóa liên quan đến Frappe đều tự động bắt tín hiệu vào hệ thống (Auto Trigger). Bạn chỉ cần nhớ cấu trúc: **[Agent Mong Muốn] + [Tác vụ rõ ràng]**.

- **"Tối ưu code":** _`@frappe-performance` Truy vấn danh sách Hóa Đơn đang bị chậm, tìm cách đánh index và batch fetch nhé._
- **"Viết API từ bên ngoài":** _`@frappe-remote-ops` Tạo curl script để lấy danh sách Item từ Cloud ERPNext._
- **"Customize core thay vì sửa source":** _`@erpnext-customizer` Add field priority vào Sales Invoice mà không chạm vào file core của ERPNext._

:::tip[Lời khuyên từ Codymaster]
Giao tiếp với Agent tương tự như quản lý Dev Junior. Bạn cần chia nhỏ công việc thành Từng Bước Nhỏ (Thiết kế Schema -> Viết API -> Gắn UI). Cách làm này đảm bảo bạn sẽ có 1 hệ thống hoàn toàn dễ bảo trì sau 3 năm!
:::
