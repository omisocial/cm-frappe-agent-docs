---
title: Hướng dẫn Nhanh
description: Hướng dẫn bắt đầu sử dụng CM Frappe Agent — cài đặt skill, trigger agents, và workflow phát triển.
---

> **CM Frappe Agent** là một AI Skill được cài đặt trong hệ thống Antigravity/Claude/Cursor. Nó tự động kích hoạt khi bạn nhắc đến Frappe/ERPNext.

## Cài đặt (Installation)

Bộ skill được cung cấp đầy đủ trên GitHub repository. Để thiết lập, làm theo các bước sau:

**1. Clone Repository:**
```bash
git clone https://github.com/omisocial/cm-frappe-agent-docs.git cm-frappe-agent
```

**2. Copy vào IDE của bạn:**

- **Dành cho Google DeepMind/Antigravity:**
Copy toàn bộ thư mục `cm-frappe-agent` (loại trừ `docs/`) vào thư mục skills:
```bash
mkdir -p ~/.gemini/antigravity/skills/cm-frappe-agent
cp -r cm-frappe-agent/* ~/.gemini/antigravity/skills/cm-frappe-agent/
```

- **Dành cho Cursor IDE / Windsurf:**
Copy các file Markdown trong thư mục `agents/` và `commands/` vào thư mục `.cursor/rules` hoặc cấu trúc Rule tương đương của dự án bạn.

## Cách sử dụng

### 1. Trigger tự động
Skill tự kích hoạt khi prompt chứa các từ khóa:
- `frappe app`, `frappe doctype`, `bench`, `erpnext`
- `create frappe app`, `bench migrate`, `fix bug`
- `frappe performance`, `REST API`, `web form`

### 2. Ví dụ Prompt

```
# Tạo app mới
"Tạo frappe app quản lý KPI nhân viên"

# Sửa lỗi
"Fix error: ValidationError on Sales Invoice submit"

# Tối ưu hiệu năng  
"Query lấy danh sách nhân viên rất chậm, optimize giúp"

# Vận hành remote
"Lấy danh sách Sales Invoice status=Paid trên mysite.com"
```

### 3. Hiểu Cách Hoạt Động Của Frappe Kit

Bạn không cần chỉ định rõ Agent (ví dụ: Fixer, Frontend, Planner), hệ thống sẽ tự động bắt từ khóa từ Prompt của bạn. Tuy nhiên, để tận dụng **100% sức mạnh** của bộ Kit tránh sinh code Spaghetti, Frappe Team khuyên bạn đọc qua hướng dẫn chia nhỏ luồng việc dưới đây:

👉 [**Đọc Mẹo Gọi Frappe Agent Chuẩn (Nguyên lý 7 Lớp)**](/sop/using-frappe-agents.md)

## Workflow Phát triển Chuẩn

```
1. INSTALL  → bench init, new-site, install-app
2. PLAN     → DocType design, ADR
3. BUILD    → Engine (Layer 2) → Controller (Layer 1) → API (Layer 3)
4. TEST     → pytest -v (pure logic tests)
5. DEPLOY   → bench build && bench migrate
```

:::tip[Pro Tip]
Luôn bắt đầu từ **Engine (Layer 2)** trước khi viết Controller. Engine thuần Python → test nhanh, không cần Frappe instance.
:::
