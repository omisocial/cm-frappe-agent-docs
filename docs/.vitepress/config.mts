import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "CM Frappe Agent",
  description: "Bộ công cụ AI toàn diện cho phát triển Frappe/ERPNext — từ cài đặt tới vận hành production.",
  base: '/cm-frappe-agent-docs/',
  themeConfig: {
    nav: [
      { text: 'Trang chủ', link: '/' },
      { text: 'Kiến trúc', link: '/architecture' },
      { text: 'Bắt đầu', link: '/getting-started' }
    ],
    sidebar: [
      {
        text: 'Bắt đầu',
        items: [
          { text: 'Tổng quan', link: '/' },
          { text: 'Kiến trúc Hệ thống', link: '/architecture' },
          { text: 'Hướng dẫn Nhanh', link: '/getting-started' }
        ]
      },
      {
        text: 'AI Agents (13)',
        collapsed: false,
        items: [
          { text: 'DocType Architect', link: '/agents/doctype-architect' },
          { text: 'ERPNext Customizer', link: '/agents/erpnext-customizer' },
          { text: 'Frappe Backend', link: '/agents/frappe-backend' },
          { text: 'Frappe Custom Frontend', link: '/agents/frappe-custom-frontend' },
          { text: 'Frappe Debugger', link: '/agents/frappe-debugger' },
          { text: 'Frappe Fixer', link: '/agents/frappe-fixer' },
          { text: 'Frappe Frontend', link: '/agents/frappe-frontend' },
          { text: 'Frappe Installer', link: '/agents/frappe-installer' },
          { text: 'Frappe Performance', link: '/agents/frappe-performance' },
          { text: 'Frappe Planner', link: '/agents/frappe-planner' },
          { text: 'Frappe Remote Ops', link: '/agents/frappe-remote-ops' },
          { text: 'GitHub Workflow', link: '/agents/github-workflow' }
        ]
      },
      {
        text: 'CLI Commands (16)',
        collapsed: true,
        items: [
          { text: 'frappe-app', link: '/commands/frappe-app' },
          { text: 'frappe-backend', link: '/commands/frappe-backend' },
          { text: 'frappe-bench', link: '/commands/frappe-bench' },
          { text: 'frappe-debug', link: '/commands/frappe-debug' },
          { text: 'frappe-doctype-create', link: '/commands/frappe-doctype-create' },
          { text: 'frappe-doctype-field', link: '/commands/frappe-doctype-field' },
          { text: 'frappe-erpnext', link: '/commands/frappe-erpnext' },
          { text: 'frappe-fix', link: '/commands/frappe-fix' },
          { text: 'frappe-frontend', link: '/commands/frappe-frontend' },
          { text: 'frappe-fullstack', link: '/commands/frappe-fullstack' },
          { text: 'frappe-github', link: '/commands/frappe-github' },
          { text: 'frappe-install', link: '/commands/frappe-install' },
          { text: 'frappe-plan', link: '/commands/frappe-plan' },
          { text: 'frappe-remote', link: '/commands/frappe-remote' },
          { text: 'frappe-test', link: '/commands/frappe-test' }
        ]
      },
      {
        text: 'Resources (10)',
        collapsed: true,
        items: [
          { text: '7-Layer Architecture', link: '/resources/7-layer-architecture' },
          { text: 'Bench Commands', link: '/resources/bench_commands' },
          { text: 'Code Patterns Guide', link: '/resources/code-patterns-guide' },
          { text: 'Common Pitfalls', link: '/resources/common_pitfalls' },
          { text: 'Doctype Registry', link: '/resources/doctype-registry' },
          { text: 'Installation Guide', link: '/resources/installation-guide' },
          { text: 'REST API Patterns', link: '/resources/rest-api-patterns' },
          { text: 'Scaffold Checklist', link: '/resources/scaffold_checklist' },
          { text: 'Upgrade Patterns', link: '/resources/upgrade_patterns' },
          { text: 'Web Form Patterns', link: '/resources/web-form-patterns' }
        ]
      },
      {
        text: 'Sub-Skills (7)',
        collapsed: true,
        items: [
          { text: 'Bench Commands', link: '/sub-skills/bench-commands' },
          { text: 'Client Scripts', link: '/sub-skills/client-scripts' },
          { text: 'DocType Patterns', link: '/sub-skills/doctype-patterns' },
          { text: 'Frappe API', link: '/sub-skills/frappe-api' },
          { text: 'Remote Operations', link: '/sub-skills/remote-operations' },
          { text: 'Server Scripts', link: '/sub-skills/server-scripts' },
          { text: 'Web Forms', link: '/sub-skills/web-forms' }
        ]
      },
      {
        text: 'Hướng dẫn SOP',
        items: [
          { text: 'Hướng dẫn Gọi Ai Agent', link: '/sop/using-frappe-agents' },
          { text: 'Hướng dẫn Sử dụng', link: '/sop/user-guide' },
          { text: 'Vibe Coding Guide', link: '/sop/vibe-coding-guide' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/omisocial' }
    ]
  }
})
