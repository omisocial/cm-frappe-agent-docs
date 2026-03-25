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

### 3. Agent tự động chọn

Bạn không cần chỉ định agent — SKILL.md tự động routing:

| Bạn muốn... | Agent được chọn |
|---|---|
| Cài đặt Frappe từ đầu | **Installer** |
| Thiết kế DocType | **DocType Architect** |
| Viết Python API/logic | **Backend** |
| Viết Client Script/UI | **Frontend** |
| Customize ERPNext | **ERPNext Customizer** |
| Phân tích lỗi (không sửa) | **Debugger** |
| Sửa lỗi (có sửa code) | **Fixer** |
| Tối ưu performance | **Performance** |
| Thao tác remote site | **Remote Ops** |
| Git/CI/CD | **GitHub Workflow** |

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
