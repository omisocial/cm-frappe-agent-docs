---
title: "Workflow: cm-brainstorm-idea"
description: "Quy trình phân tích chiến lược cho sản phẩm và tính năng mới."
---

# cm-brainstorm-idea — Phân tích Chiến lược

Workflow này giúp bạn đánh giá các ý tưởng sản phẩm hoặc tính năng mới thông qua các mô hình tư duy đa chiều, đảm bảo tính khả thi và giá trị kinh doanh.

## 1. Các mô hình cốt lõi

Workflow tích hợp 3 phương pháp luận nổi tiếng:

- **Design Thinking**: Đồng cảm với người dùng và xác định vấn đề thực sự.
- **9 Windows (TRIZ)**: Xem xét hệ thống trong quá khứ, hiện tại và tương lai ở 3 cấp độ (Siêu hệ thống, Hệ thống, Hệ thống con).
- **Double Diamond**: Khám phá rộng (Divergence) và tập trung giải pháp (Convergence).

## 2. Cách kích hoạt

Khi bạn có một ý tưởng sơ khai hoặc một yêu cầu phức tạp từ khách hàng, hãy gọi:

```bash
/brainstorm [tên ý tưởng hoặc mô tả ngắn]
```

## 3. Đầu ra của Workflow

Kết quả trả về sẽ bao gồm:

1.  **Phân tích 9 Windows**: Bảng ma trận giúp nhìn nhận sự tiến hóa của tính năng.
2.  **Ma trận Ưu tiên**: Đánh giá dựa trên Nỗ thực (Effort) vs Tác động (Impact).
3.  **2-3 Phương án Thực thi**: Các lựa chọn từ "MVP tối giản" đến "Full-featured".
4.  **Khuyến nghị**: Lựa chọn tối ưu nhất dựa trên bối cảnh hiện tại của codebase.

## 4. Khi nào nên dùng?

- Trước khi bắt đầu một dự án mới từ con số 0.
- Khi muốn thêm một module lớn vào ERPNext mà chưa rõ cấu trúc.
- Khi gặp bài toán hóc búa về logic kinh doanh cần tối ưu hóa.
