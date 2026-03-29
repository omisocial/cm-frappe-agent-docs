---
title: "Playbook — 50 Tình huống Thực tế với cm-frappe-agent"
description: "50 kịch bản thực tế sử dụng cm-frappe-agent — từ cài đặt, xây dựng feature, debug, tối ưu, đến vận hành production. Mỗi tình huống có trigger phrase, agent phụ trách, và các bước thực hiện."
keywords: "frappe playbook, use cases, how-to, scenarios, erpnext, cli, ai agent"
robots: "index, follow"
---

# Playbook — 50 Tình huống Thực tế

> Mỗi tình huống bao gồm: **Trigger** (câu lệnh gõ với AI), **Agent** phụ trách, **Bước thực hiện**, và **Output mong đợi**.

---

## 🗂️ Mục lục nhanh

| # | Nhóm | Số tình huống |
|---|------|--------------|
| A | [INSTALL — Cài đặt & Setup](#a-install--cài-đặt--setup) | 1–8 |
| B | [PLAN — Kiến trúc & Thiết kế](#b-plan--kiến-trúc--thiết-kế) | 9–15 |
| C | [BUILD Backend](#c-build--backend) | 16–24 |
| D | [BUILD Frontend](#d-build--frontend) | 25–31 |
| E | [TEST — Kiểm thử](#e-test--kiểm-thử) | 32–36 |
| F | [DEBUG & FIX — Gỡ lỗi](#f-debug--fix--gỡ-lỗi) | 37–43 |
| G | [OPTIMIZE — Tối ưu hóa](#g-optimize--tối-ưu-hóa) | 44–47 |
| H | [OPERATE — Vận hành](#h-operate--vận-hành) | 48–50 |

---

## A. INSTALL — Cài đặt & Setup

### #1 — Cài Frappe từ đầu trên máy mới

**Trigger:** `frappe install check` hoặc `"cài đặt frappe bench mới"`

**Agent:** `frappe-installer`

**Bước thực hiện:**
```bash
# 1. Kiểm tra prerequisites
frappe install check

# 2. Cài đặt dependencies (Ubuntu/Debian)
sudo apt-get install python3-dev python3-pip redis-server mariadb-server nodejs npm

# 3. Cài bench CLI
pip install frappe-bench

# 4. Khởi tạo bench
bench init frappe-bench --frappe-branch version-15
cd frappe-bench

# 5. Tạo site đầu tiên
bench new-site mysite.localhost --db-root-password root --admin-password admin

# 6. Bắt đầu development server
bench start
```

**Output:** Frappe chạy tại `http://mysite.localhost:8000`

---

### #2 — Tạo custom app mới từ đầu

**Trigger:** `frappe app` hoặc `"tạo frappe app tên my_app"`

**Agent:** `frappe-installer` → `frappe-planner`

**Bước thực hiện:**
```bash
# 1. Scaffold app structure
bench new-app my_app
# Nhập: App Title, Description, Publisher, Email, Icon

# 2. Install app vào site
bench --site mysite.localhost install-app my_app

# 3. Kiểm tra cấu trúc được tạo
ls apps/my_app/my_app/
# → doctype/  hooks.py  __init__.py  modules.txt

# 4. Verify cài đặt thành công
bench --site mysite.localhost list-apps
```

**Output:** App scaffold sẵn sàng phát triển với 7-Layer structure

---

### #3 — Setup production server (Nginx + Supervisor)

**Trigger:** `"setup production frappe"` hoặc `frappe install production`

**Agent:** `frappe-installer`

**Bước thực hiện:**
```bash
# 1. Enable production mode
sudo bench setup production frappe_user

# 2. Setup Nginx
bench setup nginx
sudo service nginx reload

# 3. Setup Supervisor
bench setup supervisor
sudo supervisorctl reread
sudo supervisorctl update

# 4. Enable SSL (optional)
sudo bench setup lets-encrypt mysite.com

# 5. Verify
sudo supervisorctl status
sudo nginx -t
```

**Output:** Site chạy trên port 80/443, tự restart khi reboot

---

### #4 — Cài thêm một Frappe app từ GitHub

**Trigger:** `"cài app frappe từ github"` hoặc `bench get-app`

**Agent:** `frappe-installer`

**Bước thực hiện:**
```bash
# 1. Lấy app từ GitHub
bench get-app https://github.com/frappe/erpnext --branch version-15

# 2. Install vào site
bench --site mysite.localhost install-app erpnext

# 3. Chạy migrate để tạo tables
bench --site mysite.localhost migrate

# 4. Build assets
bench build --app erpnext

# 5. Clear cache
bench --site mysite.localhost clear-cache
```

**Output:** App mới được cài và chạy bình thường

---

### #5 — Tạo thêm site mới trên cùng bench

**Trigger:** `"tạo site mới"` hoặc `bench new-site`

**Agent:** `frappe-installer`

**Bước thực hiện:**
```bash
# 1. Tạo site mới
bench new-site site2.localhost --db-root-password root

# 2. Install apps cần thiết
bench --site site2.localhost install-app frappe
bench --site site2.localhost install-app erpnext

# 3. Set site làm default (optional)
bench use site2.localhost

# 4. Verify
bench --site site2.localhost doctor
```

---

### #6 — Nâng cấp Frappe lên version mới

**Trigger:** `"upgrade frappe version-15"` hoặc `bench update`

**Agent:** `frappe-installer`

**Bước thực hiện:**
```bash
# 1. Backup trước khi upgrade (BẮT BUỘC)
bench --site mysite.localhost backup --with-files

# 2. Maintenance mode
bench --site mysite.localhost set-maintenance-mode on

# 3. Pull updates
bench update --pull

# 4. Run patches và migrate
bench --site mysite.localhost migrate

# 5. Build assets
bench build

# 6. Tắt maintenance mode
bench --site mysite.localhost set-maintenance-mode off

# 7. Reload
sudo supervisorctl restart all
```

**Output:** Site chạy trên version mới, data không mất

---

### #7 — Setup môi trường Docker cho development

**Trigger:** `"frappe docker setup"` hoặc `"cài frappe bằng docker"`

**Agent:** `frappe-installer`

**Bước thực hiện:**
```bash
# 1. Clone frappe_docker
git clone https://github.com/frappe/frappe_docker
cd frappe_docker

# 2. Copy env file
cp example.env .env
# Chỉnh sửa .env: DB password, site name, apps cần cài

# 3. Start containers
docker compose -f compose.yaml \
  -f overrides/compose.mariadb.yaml \
  -f overrides/compose.redis.yaml up -d

# 4. Create site
docker compose exec backend \
  bench new-site mysite.localhost \
  --mariadb-root-password 123 \
  --admin-password admin

# 5. Install apps
docker compose exec backend \
  bench --site mysite.localhost install-app erpnext
```

---

### #8 — Restore backup vào site mới

**Trigger:** `"restore frappe backup"` hoặc `bench restore`

**Agent:** `frappe-installer`

**Bước thực hiện:**
```bash
# 1. Tạo site mới (empty)
bench new-site restore.localhost --db-root-password root

# 2. Restore từ backup file
bench --site restore.localhost restore \
  /path/to/backup/20260329_120000-mysite-database.sql.gz \
  --with-public-files /path/to/backup/20260329-files.tar \
  --with-private-files /path/to/backup/20260329-private-files.tar

# 3. Migrate sau khi restore
bench --site restore.localhost migrate

# 4. Clear cache
bench --site restore.localhost clear-cache
```

---

## B. PLAN — Kiến trúc & Thiết kế

### #9 — Thiết kế DocType mới từ requirements

**Trigger:** `frappe plan` hoặc `"thiết kế doctype Employee Score"`

**Agent:** `frappe-planner` → `doctype-architect`

**Bước thực hiện:**

1. **Mô tả yêu cầu với AI:**
   ```
   "Tôi cần DocType theo dõi điểm số nhân viên hàng tháng.
    Fields cần: nhân viên, tháng, điểm kỹ năng, điểm thái độ,
    điểm chuyên cần, điểm tổng, trạng thái (draft/approved).
    Có approval workflow."
   ```

2. **Agent tạo JSON schema:**
   ```json
   {
     "doctype": "DocType",
     "name": "Employee Score",
     "module": "My App",
     "fields": [
       {"fieldname": "employee", "fieldtype": "Link", "options": "Employee", "reqd": 1},
       {"fieldname": "month", "fieldtype": "Data", "reqd": 1},
       {"fieldname": "skill_score", "fieldtype": "Float"},
       {"fieldname": "attitude_score", "fieldtype": "Float"},
       {"fieldname": "attendance_score", "fieldtype": "Float"},
       {"fieldname": "total_score", "fieldtype": "Float", "read_only": 1}
     ]
   }
   ```

3. **Review và điều chỉnh** với Agent

**Output:** JSON schema + migration plan

---

### #10 — Thiết kế hệ thống phân quyền phức tạp

**Trigger:** `"thiết kế permission frappe"` hoặc `frappe plan permissions`

**Agent:** `frappe-planner`

**Bước thực hiện:**

1. Mô tả các roles cần có:
   ```
   "Hệ thống có 3 roles:
    - Manager: xem và duyệt tất cả
    - HR Staff: tạo và chỉnh sửa của phòng mình
    - Employee: chỉ xem của bản thân"
   ```

2. Agent tạo Permission Table:

   | Role | Read | Write | Create | Delete | Submit | Condition |
   |------|------|-------|--------|--------|--------|-----------|
   | Manager | ✅ | ✅ | ✅ | ✅ | ✅ | — |
   | HR Staff | ✅ | ✅ | ✅ | — | — | `department == user_department` |
   | Employee | ✅ | — | — | — | — | `employee == session_user` |

3. Implement trong DocType JSON

---

### #11 — Lên kế hoạch tích hợp bên thứ 3

**Trigger:** `"tích hợp frappe với hệ thống ngoài"` hoặc `frappe plan integration`

**Agent:** `frappe-planner`

**Bước thực hiện:**
1. Xác định: Push hay Pull data? One-way hay Two-way sync?
2. Chọn pattern: Webhook outbound / REST API polling / Queue-based
3. Agent thiết kế: Endpoint schema, error handling, retry logic
4. Tạo DocType `Integration Log` để tracking

---

### #12 — Thiết kế Workflow phê duyệt đa cấp

**Trigger:** `"tạo approval workflow frappe"` hoặc `frappe plan workflow`

**Agent:** `frappe-planner` → `doctype-architect`

**Bước thực hiện:**
1. Xác định các states: Draft → Manager Review → HR Review → Approved/Rejected
2. Xác định transitions và người có quyền transition
3. Agent tạo Workflow JSON:
   ```json
   {
     "states": ["Draft", "Pending Manager", "Pending HR", "Approved"],
     "transitions": [
       {"state": "Draft", "action": "Submit to Manager", "next_state": "Pending Manager", "allowed": "Employee"},
       {"state": "Pending Manager", "action": "Approve", "next_state": "Pending HR", "allowed": "Manager"}
     ]
   }
   ```

---

### #13 — Thiết kế cấu trúc Custom App lớn

**Trigger:** `"thiết kế kiến trúc frappe app"` hoặc `frappe plan architecture`

**Agent:** `frappe-planner`

**Output từ Agent:**
```
my_app/
├── my_app/
│   ├── hr_module/          ← Module 1
│   │   ├── doctype/
│   │   └── engine/         ← Pure logic (Layer 2)
│   ├── payroll_module/     ← Module 2
│   ├── api/                ← Shared API endpoints (Layer 3)
│   ├── tasks/              ← Scheduler (Layer 4)
│   ├── setup/              ← Install hooks (Layer 5)
│   └── tests/              ← Layer 6
```

---

### #14 — Ước lượng độ phức tạp feature trước khi build

**Trigger:** `"estimate effort frappe feature"` hoặc `frappe plan estimate`

**Agent:** `frappe-planner`

**Output:** Bảng estimate theo layers:

| Layer | Công việc | Giờ ước tính |
|-------|-----------|-------------|
| DocType | 3 DocTypes, 15 fields mỗi cái | 4h |
| Engine | 5 pure functions | 6h |
| API | 3 endpoints | 3h |
| Client JS | 2 form scripts | 4h |
| Tests | 10 test cases | 5h |
| **Tổng** | | **22h** |

---

### #15 — Thiết kế báo cáo tùy chỉnh (Custom Report)

**Trigger:** `"tạo frappe report"` hoặc `frappe plan report`

**Agent:** `frappe-planner` → `frappe-backend`

**Bước thực hiện:**
1. Xác định loại: Script Report hay Query Report?
2. Xác định filters và columns
3. Agent viết SQL/Python query
4. Tạo Report DocType và config
5. Test với sample data

---

## C. BUILD — Backend

### #16 — Tạo DocType với fields đầy đủ

**Trigger:** `frappe doctype-create` hoặc `"tạo doctype Product Request"`

**Agent:** `doctype-architect`

**Bước thực hiện:**
```bash
# 1. Trigger command
frappe doctype-create "Product Request" my_app

# Agent tạo file JSON tại:
# apps/my_app/my_app/product_request/product_request.json
```

```python
# 2. Tạo Controller skeleton
# apps/my_app/my_app/product_request/product_request.py
class ProductRequest(Document):
    def validate(self):
        self._validate_quantity()

    def on_submit(self):
        ProductRequestEngine.process(self)
```

---

### #17 — Viết Engine (Pure Business Logic)

**Trigger:** `frappe backend` hoặc `"viết engine tính lương"`

**Agent:** `frappe-backend`

**Bước thực hiện:**
```python
# apps/my_app/my_app/payroll_module/engine/salary_engine.py

class SalaryEngine:
    """Pure Python — KHÔNG gọi frappe.db trực tiếp"""

    @staticmethod
    def calculate(base_salary: float, deductions: list[dict]) -> dict:
        total_deductions = sum(d["amount"] for d in deductions)
        net_salary = base_salary - total_deductions

        return {
            "gross": base_salary,
            "deductions": total_deductions,
            "net": net_salary,
        }
```

**Nguyên tắc:** Engine không import frappe, có thể test độc lập

---

### #18 — Tạo API endpoint (@frappe.whitelist)

**Trigger:** `frappe backend api` hoặc `"tạo frappe api endpoint"`

**Agent:** `frappe-backend`

**Bước thực hiện:**
```python
# apps/my_app/my_app/api/salary.py

import frappe
from my_app.payroll_module.engine.salary_engine import SalaryEngine

@frappe.whitelist()
def get_salary_preview(employee: str, month: str) -> dict:
    """Idempotent — GET-safe, no side effects"""

    employee_doc = frappe.get_doc("Employee", employee)
    deductions = frappe.get_all(
        "Salary Deduction",
        filters={"employee": employee, "month": month},
        fields=["amount", "type"]
    )

    return SalaryEngine.calculate(employee_doc.base_salary, deductions)
```

**Test:**
```bash
bench --site mysite.localhost console
>>> frappe.call("my_app.api.salary.get_salary_preview", employee="EMP-001", month="2026-03")
```

---

### #19 — Tạo Scheduled Task (Background Job)

**Trigger:** `"tạo frappe scheduler task"` hoặc `frappe backend scheduler`

**Agent:** `frappe-backend`

**Bước thực hiện:**
```python
# hooks.py — đăng ký task
scheduler_events = {
    "daily": ["my_app.tasks.daily.run_daily_sync"],
    "weekly": ["my_app.tasks.weekly.generate_weekly_report"],
    "cron": {
        "0 9 * * 1-5": ["my_app.tasks.daily.morning_reminder"]
    }
}
```

```python
# tasks/daily.py
import frappe
from my_app.sync_module.engine.sync_engine import SyncEngine

def run_daily_sync():
    """Wrapper — chỉ call Engine, không có business logic"""
    records = frappe.get_all("Integration Queue", filters={"status": "Pending"})
    for r in records:
        SyncEngine.process(r.name)
```

---

### #20 — Tạo Frappe Hook (doc_events)

**Trigger:** `"frappe doc_events hook"` hoặc `frappe backend hooks`

**Agent:** `frappe-backend`

**Bước thực hiện:**
```python
# hooks.py
doc_events = {
    "Sales Order": {
        "on_submit": "my_app.integrations.on_sales_order_submit",
        "on_cancel": "my_app.integrations.on_sales_order_cancel",
    },
    "*": {
        "after_insert": "my_app.audit.log_creation"
    }
}
```

```python
# integrations.py
def on_sales_order_submit(doc, method):
    """Triggered sau khi Sales Order được submit"""
    if doc.custom_needs_sync:
        frappe.enqueue(
            "my_app.sync.push_to_erp",
            doc_name=doc.name,
            queue="long"
        )
```

---

### #21 — Tạo Server Script không dùng custom app

**Trigger:** `"frappe server script"` hoặc `frappe backend server-script`

**Agent:** `frappe-backend`

**Bước thực hiện** (qua Frappe UI):
1. Vào **Frappe Settings → Server Script → New**
2. Chọn Script Type: `DocType Event` / `API` / `Permission Query`
3. Viết Python:
   ```python
   # Script Type: DocType Event, DocType: Purchase Order, Event: on_submit
   if doc.grand_total > 10_000_000:
       frappe.sendmail(
           recipients=["finance@company.com"],
           subject=f"Large PO: {doc.name}",
           message=f"Purchase Order {doc.name} amount: {doc.grand_total}"
       )
   ```
4. Enable và Test

---

### #22 — Tạo Fixture (install data)

**Trigger:** `"frappe fixture"` hoặc `"tạo default data frappe"`

**Agent:** `frappe-backend`

**Bước thực hiện:**
```python
# hooks.py
fixtures = [
    {"dt": "Role", "filters": [["name", "in", ["Custom Manager", "Custom Staff"]]]},
    {"dt": "Custom Field", "filters": [["module", "=", "My App"]]},
    {"dt": "Property Setter", "filters": [["module", "=", "My App"]]},
]
```

```bash
# Export fixtures
bench --site mysite.localhost export-fixtures

# Import tự động khi install app
bench --site newsite.localhost install-app my_app
```

---

### #23 — Tạo REST API nhận webhook từ bên ngoài

**Trigger:** `"frappe nhận webhook"` hoặc `frappe backend webhook-receiver`

**Agent:** `frappe-backend`

**Bước thực hiện:**
```python
# api/webhook.py
import frappe
import hmac, hashlib

@frappe.whitelist(allow_guest=True)
def receive_payment_webhook():
    """Nhận webhook từ payment gateway"""

    # Verify signature
    payload = frappe.request.data
    signature = frappe.get_request_header("X-Signature")
    secret = frappe.conf.get("payment_webhook_secret", "")

    expected = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(f"sha256={expected}", signature):
        frappe.throw("Invalid signature", frappe.AuthenticationError)

    data = frappe.parse_json(payload)

    # Upsert pattern — idempotent
    frappe.db.set_value(
        "Payment Entry", {"reference_no": data["transaction_id"]},
        "payment_status", data["status"]
    )
    return {"status": "received"}
```

---

### #24 — Viết Custom Permission Query

**Trigger:** `"frappe permission query conditions"` hoặc `frappe backend permission`

**Agent:** `frappe-backend`

**Bước thực hiện:**
```python
# hooks.py
permission_query_conditions = {
    "Employee Score": "my_app.permissions.get_employee_score_conditions"
}
```

```python
# permissions.py
def get_employee_score_conditions(user):
    if not user:
        user = frappe.session.user

    if "HR Manager" in frappe.get_roles(user):
        return ""  # Xem tất cả

    employee = frappe.db.get_value("Employee", {"user_id": user}, "name")
    if employee:
        return f"`tabEmployee Score`.employee = '{employee}'"

    return "1=0"  # Không cho xem gì
```

---

## D. BUILD — Frontend

### #25 — Viết Client Script cho Form

**Trigger:** `frappe frontend` hoặc `"client script cho doctype Sales Order"`

**Agent:** `frappe-frontend`

**Bước thực hiện:**
```javascript
// Client Script — DocType: Sales Order, Event: refresh

frappe.ui.form.on("Sales Order", {
    refresh(frm) {
        if (frm.doc.docstatus === 1) {
            frm.add_custom_button("Sync to ERP", () => {
                frappe.call({
                    method: "my_app.api.sync.push_order",
                    args: { order_name: frm.doc.name },
                    callback(r) {
                        if (!r.exc) frappe.msgprint("Đã đồng bộ thành công!");
                    }
                });
            }, "Actions");
        }
    },

    grand_total(frm) {
        frm.set_value("requires_approval", frm.doc.grand_total > 10_000_000 ? 1 : 0);
    }
});
```

---

### #26 — Tạo Dialog tùy chỉnh (Custom Dialog)

**Trigger:** `"frappe tạo dialog"` hoặc `frappe frontend dialog`

**Agent:** `frappe-frontend`

**Bước thực hiện:**
```javascript
// Hiển thị dialog nhập thông tin trước khi submit
function showApprovalDialog(frm) {
    const d = new frappe.ui.Dialog({
        title: "Xác nhận phê duyệt",
        fields: [
            { label: "Ghi chú", fieldname: "note", fieldtype: "Small Text" },
            { label: "Ngày hiệu lực", fieldname: "effective_date", fieldtype: "Date" }
        ],
        primary_action_label: "Xác nhận",
        primary_action({ note, effective_date }) {
            frappe.call({
                method: "my_app.api.approval.approve",
                args: { doc_name: frm.doc.name, note, effective_date },
                callback(r) {
                    if (!r.exc) {
                        d.hide();
                        frm.reload_doc();
                    }
                }
            });
        }
    });
    d.show();
}
```

---

### #27 — Tạo trang Web Form (Portal)

**Trigger:** `"tạo web form frappe"` hoặc `frappe frontend webform`

**Agent:** `frappe-frontend`

**Bước thực hiện:**
1. Vào **Frappe → Web Form → New**
2. Chọn DocType và Route (`/apply-leave`)
3. Chọn fields hiển thị
4. Thêm Web Form Client Script:
   ```javascript
   frappe.web_form.on("leave_type", (field, value) => {
       if (value === "Annual Leave") {
           frappe.web_form.set_df_property("reason", "reqd", 1);
       }
   });
   ```
5. Set Login Required và Permission

---

### #28 — Viết Custom List View Button

**Trigger:** `"frappe list view button"` hoặc `frappe frontend list`

**Agent:** `frappe-frontend`

**Bước thực hiện:**
```javascript
// List View JS cho DocType: Employee Score
frappe.listview_settings["Employee Score"] = {
    add_fields: ["status", "total_score"],

    get_indicator(doc) {
        if (doc.status === "Approved") return ["Approved", "green", "status,=,Approved"];
        if (doc.total_score < 60) return ["Low Score", "red", "total_score,<,60"];
        return ["Draft", "gray", "status,=,Draft"];
    },

    button: {
        show(doc) { return doc.status === "Draft"; },
        get_label() { return "Quick Approve"; },
        action(doc) {
            frappe.call("my_app.api.approval.bulk_approve", { name: doc.name })
                .then(() => cur_list.refresh());
        }
    }
};
```

---

### #29 — Tạo trang Frontend tùy chỉnh (Custom Page)

**Trigger:** `"frappe custom page"` hoặc `frappe custom-frontend`

**Agent:** `frappe-custom-frontend`

**Bước thực hiện:**
```python
# hooks.py — đăng ký page
website_route_rules = [
    {"from_route": "/dashboard", "to_route": "dashboard"}
]
```

```html
<!-- templates/pages/dashboard.html -->
{% extends "templates/web.html" %}
{% block page_content %}
<div id="dashboard-app">
  <div id="kpi-cards"></div>
</div>
<script src="/assets/my_app/js/dashboard.js"></script>
{% endblock %}
```

```javascript
// public/js/dashboard.js
window.MyDashboard = {
    async init() {
        const data = await frappe.call("my_app.api.dashboard.get_kpis");
        this.render(data.message);
    }
};
frappe.ready(() => window.MyDashboard.init());
```

---

### #30 — Tùy chỉnh ERPNext module có sẵn

**Trigger:** `"customize erpnext"` hoặc `frappe erpnext`

**Agent:** `erpnext-customizer`

**Bước thực hiện:**
```python
# ĐÚNG — Thêm field qua Customize Form (không sửa core)
# Vào Setup → Customize Form → Sales Invoice
# Thêm Custom Field: custom_delivery_note (Data)

# ĐÚNG — Override bằng Hooks, không sửa file gốc
# hooks.py
override_doctype_class = {
    "Sales Invoice": "my_app.custom.sales_invoice.CustomSalesInvoice"
}
```

```python
# custom/sales_invoice.py
from erpnext.accounts.doctype.sales_invoice.sales_invoice import SalesInvoice

class CustomSalesInvoice(SalesInvoice):
    def validate(self):
        super().validate()
        self._check_custom_rules()

    def _check_custom_rules(self):
        if self.custom_delivery_note and not self.custom_delivery_note.startswith("DN-"):
            frappe.throw("Delivery note phải bắt đầu bằng DN-")
```

---

### #31 — Tạo Print Format tùy chỉnh

**Trigger:** `"frappe print format"` hoặc `frappe frontend print`

**Agent:** `frappe-frontend`

**Bước thực hiện:**
1. Vào **Settings → Print Format → New**
2. Chọn DocType, đặt tên
3. Viết Jinja template:
   ```html
   <div class="print-format">
     <h2>{{ doc.name }}</h2>
     <p>Nhân viên: {{ doc.employee_name }}</p>
     <table>
       {% for item in doc.items %}
       <tr><td>{{ item.description }}</td><td>{{ item.amount }}</td></tr>
       {% endfor %}
     </table>
   </div>
   ```
4. Set CSS và test in thử

---

## E. TEST — Kiểm thử

### #32 — Viết Unit Test cho Engine

**Trigger:** `frappe test` hoặc `"viết test cho frappe engine"`

**Agent:** `frappe-backend` + `commands/frappe-test`

**Bước thực hiện:**
```python
# tests/test_salary_engine.py
import unittest
from my_app.payroll_module.engine.salary_engine import SalaryEngine

class TestSalaryEngine(unittest.TestCase):

    def test_basic_calculation(self):
        result = SalaryEngine.calculate(
            base_salary=10_000_000,
            deductions=[{"amount": 500_000, "type": "Tax"}]
        )
        self.assertEqual(result["net"], 9_500_000)

    def test_zero_deductions(self):
        result = SalaryEngine.calculate(10_000_000, [])
        self.assertEqual(result["net"], 10_000_000)

    def test_negative_salary_raises(self):
        with self.assertRaises(ValueError):
            SalaryEngine.calculate(-1, [])
```

```bash
# Chạy test
bench run-tests --app my_app --module my_app.tests.test_salary_engine
```

---

### #33 — Chạy Integration Test với Frappe ORM

**Trigger:** `"frappe integration test"` hoặc `frappe test integration`

**Agent:** `commands/frappe-test`

**Bước thực hiện:**
```python
# tests/test_employee_score.py
import frappe
import unittest
from frappe.tests.utils import FrappeTestCase

class TestEmployeeScore(FrappeTestCase):

    def setUp(self):
        self.employee = frappe.get_doc({
            "doctype": "Employee",
            "employee_name": "Test Employee",
            "status": "Active"
        }).insert(ignore_permissions=True)

    def test_score_creation(self):
        score = frappe.get_doc({
            "doctype": "Employee Score",
            "employee": self.employee.name,
            "month": "2026-03",
            "skill_score": 8.5
        }).insert()
        self.assertEqual(score.employee, self.employee.name)

    def tearDown(self):
        frappe.delete_doc("Employee", self.employee.name, force=True)
```

---

### #34 — Test API endpoint

**Trigger:** `"test frappe api"` hoặc `frappe test api`

**Agent:** `frappe-backend`

**Bước thực hiện:**
```bash
# Dùng curl để test
curl -X POST http://mysite.localhost:8000/api/method/my_app.api.salary.get_salary_preview \
  -H "Authorization: token api_key:api_secret" \
  -H "Content-Type: application/json" \
  -d '{"employee": "EMP-001", "month": "2026-03"}'

# Kết quả mong đợi:
# {"message": {"gross": 10000000, "deductions": 500000, "net": 9500000}}
```

---

### #35 — Kiểm tra toàn bộ app trước khi release

**Trigger:** `"frappe test tất cả"` hoặc `frappe test --all`

**Agent:** `commands/frappe-test`

**Bước thực hiện:**
```bash
# 1. Chạy toàn bộ tests của app
bench --site mysite.localhost run-tests --app my_app --verbose

# 2. Kiểm tra code quality
bench --site mysite.localhost doctor

# 3. Lint Python
cd apps/my_app && python -m pylint my_app --ignore=node_modules

# 4. Kiểm tra migration sẽ chạy ok
bench --site mysite.localhost migrate --skip-failing

# 5. Build production assets
bench build --app my_app --production
```

---

### #36 — Load Testing (Kiểm thử tải)

**Trigger:** `"frappe load test"` hoặc `frappe test performance`

**Agent:** `frappe-performance`

**Bước thực hiện:**
```bash
# Dùng locust để load test
pip install locust

# locustfile.py
from locust import HttpUser, task, between

class FrappeUser(HttpUser):
    wait_time = between(1, 3)

    @task
    def get_list(self):
        self.client.get(
            "/api/resource/Sales Order",
            headers={"Authorization": "token key:secret"}
        )

# Chạy
locust -f locustfile.py --host=http://mysite.localhost:8000
# Mở http://localhost:8089 — set 100 users, spawn rate 10
```

---

## F. DEBUG & FIX — Gỡ lỗi

### #37 — Đọc và phân tích Frappe error log

**Trigger:** `frappe debug` hoặc `"phân tích lỗi frappe"`

**Agent:** `frappe-debugger`

**Bước thực hiện:**
```bash
# 1. Xem error log realtime
tail -f ~/frappe-bench/logs/worker.error.log

# 2. Lọc lỗi theo app
grep "my_app" ~/frappe-bench/logs/error.log | tail -50

# 3. Xem Frappe Error Log qua UI
# Frappe → Error Log → Lọc theo ngày và doctype

# 4. Lấy traceback đầy đủ
bench --site mysite.localhost console
>>> frappe.get_doc("Error Log", "ERR-00001").error
```

**Mô tả lỗi với Agent:**
```
"Tôi thấy lỗi này trong log, giải thích nguyên nhân và cách fix:
[paste traceback vào đây]"
```

---

### #38 — Debug lỗi Permission "Not permitted"

**Trigger:** `"frappe permission denied"` hoặc `frappe debug permission`

**Agent:** `frappe-debugger`

**Bước thực hiện:**
```python
# Debug qua console
bench --site mysite.localhost console

# Kiểm tra roles của user
>>> frappe.get_roles("user@example.com")

# Kiểm tra permission cụ thể
>>> frappe.has_permission("Employee Score", "write", user="user@example.com")

# Xem permission table
>>> frappe.get_all("DocPerm",
...     filters={"parent": "Employee Score"},
...     fields=["role", "read", "write", "submit"]
... )
```

---

### #39 — Debug lỗi Migration thất bại

**Trigger:** `"frappe migrate failed"` hoặc `frappe debug migration`

**Agent:** `frappe-debugger` → `frappe-fixer`

**Bước thực hiện:**
```bash
# 1. Xem chi tiết lỗi migration
bench --site mysite.localhost migrate 2>&1 | tee migration.log

# 2. Nếu lỗi do column conflict
bench --site mysite.localhost console
>>> frappe.db.sql("SHOW COLUMNS FROM `tabEmployee Score`")

# 3. Skip patch đang lỗi (cẩn thận)
bench --site mysite.localhost set-config skip_failing_patches 1
bench --site mysite.localhost migrate

# 4. Sau khi fix, bỏ skip
bench --site mysite.localhost set-config skip_failing_patches 0
```

---

### #40 — Fix lỗi theo Structured Bug Fix Loop

**Trigger:** `frappe fix` hoặc `"fix bug frappe [mô tả lỗi]"`

**Agent:** `frappe-fixer` (6 bước bắt buộc)

**Bước thực hiện:**

| Bước | Action | Agent làm gì |
|------|--------|--------------|
| 1. Reproduce | Xác nhận bug tồn tại | Tạo test case để reproduce |
| 2. Isolate | Thu hẹp phạm vi lỗi | Trace call stack, tìm file/line |
| 3. Diagnose | Hiểu root cause | Explain tại sao code sai |
| 4. Fix | Viết code sửa | Minimal change, không over-engineer |
| 5. Test | Verify fix hoạt động | Chạy test case từ bước 1 |
| 6. Document | Ghi lại trong commit | Rõ ràng "fix: [mô tả]" |

---

### #41 — Fix lỗi Circular Import

**Trigger:** `"frappe circular import error"` hoặc `frappe fix circular`

**Agent:** `frappe-fixer`

**Bước thực hiện:**
```python
# LỖI phổ biến:
# my_app/hooks.py imports from my_app/utils.py
# my_app/utils.py imports from my_app/hooks.py → circular!

# FIX: Lazy import
def get_something():
    from my_app.utils import helper  # Import bên trong function
    return helper()

# HOẶC: Tạo base module không import module khác trong app
# my_app/constants.py — chỉ chứa constants, không import
```

---

### #42 — Xử lý Zombie Process (Worker bị treo)

**Trigger:** `"frappe worker treo"` hoặc `frappe fix zombie`

**Agent:** `frappe-doctor`

**Bước thực hiện:**
```bash
# 1. Xem danh sách workers đang chạy
supervisorctl status

# 2. Tìm process treo
ps aux | grep "frappe worker"

# 3. Xem queue
bench --site mysite.localhost console
>>> frappe.utils.background_jobs.get_jobs()

# 4. Clear queue nếu cần
>>> from rq import Queue
>>> from frappe.utils.background_jobs import get_redis_conn
>>> q = Queue("default", connection=get_redis_conn())
>>> q.empty()

# 5. Restart workers
supervisorctl restart frappe-bench-frappe-default-worker:*
```

---

### #43 — Repair User Record bị corrupt

**Trigger:** `"frappe user bị lỗi"` hoặc `frappe fix user`

**Agent:** `frappe-doctor`

**Bước thực hiện:**
```bash
# 1. Check user health
bench --site mysite.localhost console
>>> frappe.get_doc("User", "user@example.com").as_dict()

# 2. Repair permissions
bench --site mysite.localhost execute frappe.core.doctype.user.user.desk_access
--args='["user@example.com"]'

# 3. Reset to factory defaults nếu cần
bench --site mysite.localhost add-user user@example.com --role "System User"

# 4. Clear user cache
bench --site mysite.localhost clear-website-cache
```

---

## G. OPTIMIZE — Tối ưu hóa

### #44 — Tối ưu slow SQL query

**Trigger:** `"frappe query chậm"` hoặc `frappe optimize query`

**Agent:** `frappe-performance`

**Bước thực hiện:**
```python
# 1. Bật slow query log trong Frappe console
import frappe
frappe.db.sql("SET GLOBAL slow_query_log = 'ON'")
frappe.db.sql("SET GLOBAL long_query_time = 1")  # Log query > 1 giây

# 2. Xem explain plan
query = """SELECT * FROM `tabSales Order`
           WHERE customer = 'CUST-001' AND docstatus = 1"""
frappe.db.sql(f"EXPLAIN {query}", as_dict=True)

# 3. Tối ưu với index
frappe.db.sql("""
    ALTER TABLE `tabSales Order`
    ADD INDEX idx_customer_status (customer, docstatus)
""")

# 4. Dùng frappe.db.get_all đúng cách — chỉ lấy fields cần
frappe.get_all("Sales Order",
    filters={"customer": "CUST-001", "docstatus": 1},
    fields=["name", "grand_total"],  # KHÔNG dùng fields="*"
    limit=100  # LUÔN có limit
)
```

---

### #45 — Setup caching với Redis

**Trigger:** `"frappe caching"` hoặc `frappe optimize cache`

**Agent:** `frappe-performance`

**Bước thực hiện:**
```python
# Cache kết quả tính toán nặng
import frappe

def get_monthly_summary(employee: str, month: str) -> dict:
    cache_key = f"monthly_summary:{employee}:{month}"

    # Đọc từ cache
    cached = frappe.cache().get_value(cache_key)
    if cached:
        return cached

    # Tính toán (chậm)
    result = _calculate_summary(employee, month)

    # Lưu cache 1 giờ
    frappe.cache().set_value(cache_key, result, expires_in_sec=3600)
    return result

# Xóa cache khi data thay đổi
def on_score_save(doc, method):
    cache_key = f"monthly_summary:{doc.employee}:{doc.month}"
    frappe.cache().delete_value(cache_key)
```

---

### #46 — Convert task nặng sang Background Job

**Trigger:** `"frappe background job"` hoặc `frappe optimize async`

**Agent:** `frappe-performance`

**Bước thực hiện:**
```python
# TRƯỚC: Chạy đồng bộ — block UI 30 giây
@frappe.whitelist()
def generate_annual_report(year: str):
    # ... tính toán nặng 30 giây ...
    return result

# SAU: Chạy bất đồng bộ — trả về ngay
@frappe.whitelist()
def generate_annual_report(year: str):
    job = frappe.enqueue(
        "my_app.reports.annual.generate",
        year=year,
        queue="long",
        job_name=f"annual_report_{year}",
        timeout=600  # 10 phút
    )
    return {"job_id": job.id, "status": "queued"}

# Client JS poll status
@frappe.whitelist()
def get_report_status(job_id: str):
    from rq.job import Job
    job = Job.fetch(job_id, connection=frappe.cache().redis)
    return {"status": job.get_status(), "result": job.result}
```

---

### #47 — Profile và tối ưu hóa tổng thể

**Trigger:** `"frappe performance profile"` hoặc `frappe optimize profile`

**Agent:** `frappe-performance`

**Bước thực hiện:**
```bash
# 1. Enable Frappe Profiler
bench --site mysite.localhost set-config enable_profiler 1

# 2. Bật SQL profiling
bench --site mysite.localhost console
>>> frappe.db.sql("SET profiling = 1")

# 3. Dùng /api/method/__debug để xem timing
# Sau khi gọi API, check header X-Page-Generation-Time

# 4. Xem Slow Requests trong Monitor
# Settings → System Settings → Enable Telemetry

# 5. Tối ưu theo kết quả
# - N+1 queries → dùng frappe.get_all với parent/child
# - Slow render → move logic to background
# - Heavy on_load → lazy load data
```

---

## H. OPERATE — Vận hành

### #48 — Gọi Frappe REST API từ hệ thống ngoài

**Trigger:** `frappe remote` hoặc `"gọi frappe api từ bên ngoài"`

**Agent:** `frappe-remote-ops`

**Bước thực hiện:**
```python
# Python client gọi remote Frappe site
import requests

class FrappeClient:
    def __init__(self, url: str, api_key: str, api_secret: str):
        self.url = url.rstrip("/")
        self.session = requests.Session()
        self.session.headers["Authorization"] = f"token {api_key}:{api_secret}"

    def get_doc(self, doctype: str, name: str) -> dict:
        r = self.session.get(f"{self.url}/api/resource/{doctype}/{name}")
        r.raise_for_status()
        return r.json()["data"]

    def create_doc(self, doctype: str, data: dict) -> dict:
        r = self.session.post(
            f"{self.url}/api/resource/{doctype}",
            json=data
        )
        r.raise_for_status()
        return r.json()["data"]

# Sử dụng
client = FrappeClient("https://erp.company.com", "abc123", "xyz789")
order = client.get_doc("Sales Order", "SAL-ORD-2026-00001")
```

---

### #49 — Backup tự động hàng ngày

**Trigger:** `"frappe backup tự động"` hoặc `frappe operate backup`

**Agent:** `frappe-remote-ops` + cron

**Bước thực hiện:**
```bash
# 1. Backup thủ công
bench --site mysite.localhost backup --with-files

# 2. Tạo backup script
cat > ~/backup_frappe.sh << 'EOF'
#!/bin/bash
cd ~/frappe-bench
bench --site mysite.localhost backup --with-files --backup-path /backup/frappe/

# Xóa backup cũ hơn 30 ngày
find /backup/frappe/ -mtime +30 -delete

# Upload lên S3 (optional)
aws s3 sync /backup/frappe/ s3://my-bucket/frappe-backups/
EOF

chmod +x ~/backup_frappe.sh

# 3. Cài cron chạy 2:00 AM mỗi ngày
crontab -e
# Thêm: 0 2 * * * /home/frappe/backup_frappe.sh >> /var/log/frappe_backup.log 2>&1
```

---

### #50 — Monitoring và Alert khi có sự cố

**Trigger:** `"frappe monitoring"` hoặc `frappe operate monitor`

**Agent:** `frappe-remote-ops`

**Bước thực hiện:**
```bash
# 1. Health check script
cat > ~/health_check.sh << 'EOF'
#!/bin/bash
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://mysite.localhost/api/method/ping)
if [ "$STATUS" != "200" ]; then
    # Gửi alert qua Telegram
    curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
      -d chat_id="${CHAT_ID}" \
      -d text="🚨 ALERT: Frappe site DOWN! Status: ${STATUS}"

    # Auto-restart
    supervisorctl restart all
fi
EOF

# 2. Monitor Error Log
bench --site mysite.localhost console
>>> # Đếm lỗi trong 1 giờ qua
>>> import frappe
>>> from frappe.utils import now_datetime, add_to_date
>>> frappe.db.count("Error Log", {
...     "creation": (">", add_to_date(now_datetime(), hours=-1))
... })

# 3. Setup Frappe's built-in Monitor
# bench set-config monitor 1
# bench --site mysite.localhost set-config monitor 1
```

---

## 📌 Quick Reference — Trigger Phrases

| Tình huống | Câu trigger |
|------------|------------|
| Cài môi trường | `frappe install check` |
| Tạo app mới | `frappe app` |
| Thiết kế DocType | `frappe plan` + mô tả |
| Tạo DocType | `frappe doctype-create [tên]` |
| Viết Backend | `frappe backend` |
| Viết Frontend JS | `frappe frontend` |
| ERPNext customize | `frappe erpnext` |
| Chạy tests | `frappe test` |
| Debug lỗi | `frappe debug` + paste log |
| Fix bug | `frappe fix` + mô tả bug |
| Tối ưu hiệu năng | `frappe optimize` |
| Gọi Remote API | `frappe remote` |
| Full feature mới | `frappe fullstack` |
| GitHub/CI/CD | `frappe github` |
| Bench commands | `frappe bench` |

---

*Playbook v1.0 — Frappe Dev Master — 2026-03-29*
*Tổng: 50 tình huống thực tế với step-by-step instructions*
