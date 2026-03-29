---
title: "Workflow: cm-dockit"
description: "Quy trình hệ thống hóa kiến thức và tạo tài liệu tự động từ codebase."
---

# cm-dockit — Hệ thống hóa Kiến thức

Workflow này biến mã nguồn thô thành một hệ thống tài liệu sống động, giúp cả AI và con người hiểu sâu sắc về dự án mà không cần đọc từng dòng code.

## 1. Cơ chế hoạt động

DocKit quét toàn bộ codebase, phân tích cấu trúc AST (Abstract Syntax Tree) và sử dụng AI để:

- **Trích xuất Persona**: Ai là người dùng mục tiêu?
- **JTBD (Jobs-To-Be-Done)**: Những "việc" mà hệ thống đang giải quyết.
- **Process Flows**: Luồng dữ liệu và logic nghiệp vụ chính.
- **API Reference**: Tự động tạo tài liệu cho REST API và các server methods.

## 2. Cách kích hoạt

Khi bạn muốn tổng hợp tài liệu cho một module mới hoặc toàn bộ dự án:

```bash
/dockit [đường dẫn thư mục hoặc module]
```

## 3. Các loại tài liệu được tạo ra

Workflow này có thể xuất dữ liệu dưới nhiều định dạng:

1.  **Markdown Files**: Lưu trực tiếp vào thư mục `docs/`.
2.  **VitePress Premium**: Cấu hình sẵn template VitePress chuyên nghiệp.
3.  **AGENTS.md**: Bản đồ chỉ đường cho các AI Agent khác khi vào dự án.
4.  **SOP Guides**: Hướng dẫn vận hành cho con người.

## 4. Tại sao cần DocKit?

- **Onboarding nhanh**: Giảm thời gian làm quen dự án từ tuần xuống còn giờ.
- **AI-Readable**: Giúp các AI Agent thế hệ sau hiểu được context dự án tốt hơn (95% token compression).
- **Đồng bộ hóa**: Tài liệu luôn đi kèm với code, không bao giờ bị lạc hậu.
