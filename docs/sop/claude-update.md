---
title: "Claude Code Integration Guide"
description: "Hướng dẫn tích hợp và sử dụng Anthropic Claude Code CLI với CM Frappe Agents."
---

# Claude Code Update — Tăng tốc Vibe Coding

**Claude Code** là CLI agent bản địa của Anthropic, cho phép bạn tương tác trực tiếp với codebase thông qua terminal với tốc độ và khả năng thực thi lệnh vượt trội.

## 1. Cài đặt Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

Sau khi cài đặt, chạy lệnh `claude` trong thư mục dự án của bạn để bắt đầu.

## 2. Tích hợp CM Frappe Skills

Để Claude hiểu được hệ thống Agent của chúng ta, bạn cần nạp bộ Skill vào bộ nhớ của nó.

### Cách 1: Sử dụng cấu trúc .claude/
Copy các hướng dẫn từ `cm-frappe-agent` vào thư mục `.claude/` của dự án:

```bash
mkdir -p .claude/skills
cp -r path/to/cm-frappe-agent/* .claude/skills/
```

### Cách 2: Gọi Agent qua Prompt
Bạn có thể gọi trực tiếp các Agent bằng cú pháp `@`:

- `@doctype-architect Thiết kế Schema cho tính năng X`
- `@frappe-backend Cấu trúc Layer 2 cho tác vụ Y`

## 3. Lợi ích khi dùng Claude Code

1.  **Thực thi lệnh trực tiếp**: Claude có thể chạy `bench migrate`, `bench restart` ngay trong phiên chat.
2.  **Tốc độ cực nhanh**: Phản hồi nhanh hơn đáng kể so với các AI Chat truyền thống.
3.  **Hỗ trợ 7-Layer Architecture**: Claude Code rất giỏi trong việc tuân thủ các quy tắc file hệ thống nếu được hướng dẫn đúng qua `SKILL.md`.

:::important[Lưu ý]
Luôn kiểm tra code sau khi Claude tự động chỉnh sửa bằng lệnh `git diff` trước khi commit.
:::
