# Cody Master Frappe Agent

Bộ kỹ năng AI hoàn chỉnh (AI Skill) dành cho Google DeepMind/Antigravity hoặc các IDE AI chuyên dụng (Cursor, Windsurf), được thiết kế đặc biệt cho quá trình phát triển, triển khai và vận hành hệ sinh thái **Frappe Framework** & **ERPNext**.

📚 **[Xem Tài Liệu Đầy Đủ (Documentation)](https://omisocial.github.io/cm-frappe-agent-docs/)**

## Tính năng nổi bật

- **13 AI Agents chuyên sâu:** Từ thiết kế kiến trúc DocType, viết API Backend, tạo Custom UI Frontend, đến dò lỗi (Debug) và sửa lỗi (Fix Loop).
- **16 Lệnh CLI (Commands):** Hỗ trợ gõ lệnh /slash command để các AI Agents thực hiện tác vụ tự động ngay lập tức (scaffold app, deploy, fix bug...).
- **Kho tàng 10 Templates/Resources:** Tổng hợp chuẩn kiến trúc 7-layers, Code Patterns, Upgrade Patterns, và tránh các lỗi phổ biến trong quá trình cấu trúc ERPNext.

## Cài đặt (Installation)

1. Clone Repository này về thiết bị của bạn.
2. Tùy thuộc vào phần mềm AI bạn đang dùng:
   - **Antigravity / CodyMaster**: Copy toàn bộ thư mục repo (ngoại trừ thư mục `docs/` hoặc có thể để nguyên) vào `~/.gemini/antigravity/skills/cm-frappe-agent`.
   - **Cursor IDE**: Copy các script trong `commands/` và `agents/` vào thư mục `.cursor/rules`.

```bash
git clone https://github.com/omisocial/cm-frappe-agent-docs.git cm-frappe-agent

# Dành cho Antigravity AI
mkdir -p ~/.gemini/antigravity/skills/cm-frappe-agent
cp -r cm-frappe-agent/* ~/.gemini/antigravity/skills/cm-frappe-agent/
```

## Đóng góp (Contributing)

Để chạy local server cho tài liệu (Documentation):

```bash
npm install
npm run dev
```

Build & test trước khi push:
```bash
npm run deploy
```

Thư mục `docs/` chứa mã nguồn VitePress cho website tài liệu. Mọi Pull Request cập nhật documentation đều được CI/CD Gate tự động kiểm tra Syntax và bảo mật trước khi cho phép Merge.

## License

MIT License
