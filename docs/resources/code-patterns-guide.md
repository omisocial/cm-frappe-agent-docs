---
title: "Production Code Patterns Guide"
description: "Resource: code-patterns-guide"
---

# Production Code Patterns Guide

> Battle-tested patterns from real Frappe production apps. Use these as reference
> when building controllers, engines, APIs, tasks, reports, and client-side JS.


## 📐 Layer 1: DocType Design

### Controller Pattern (Python)

```python
import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import now


class WarehouseViolation(Document):
    def validate(self):
        """Auto-fill derived fields BEFORE save."""
        self.fetch_employee_details()
        self.set_period()
        self.fetch_penalty_from_type()

    def fetch_employee_details(self):
        """Pull company, branch, name from Employee — avoid manual entry."""
        if self.employee:
            emp = frappe.db.get_value(
                "Employee", self.employee,
                ["company", "branch", "employee_name"], as_dict=True,
            )
            if emp:
                self.company = emp.company
                self.branch = emp.branch
                self.employee_name = emp.employee_name

    def set_period(self):
        """Auto-derive period (YYYY-MM) from date field."""
        if self.date:
            self.period = str(self.date)[:7]

    def fetch_penalty_from_type(self):
        """Auto-fill penalty points from master data if not manually set."""
        if self.violation_type and not self.penalty_points:
            pts = frappe.db.get_value(
                "Warehouse Violation Type", self.violation_type, "penalty_points"
            )
            if pts:
                self.penalty_points = pts

    def on_submit(self):
        """Record who confirmed and when."""
        self.confirmed_by = frappe.session.user
        self.confirmed_at = now()
        self.db_update()
        frappe.msgprint(
            _("Confirmed. Penalty: {0} pts for {1}.").format(
                self.penalty_points, self.employee_name
            ),
            indicator="orange", alert=True,
        )

    def on_cancel(self):
        frappe.msgprint(
            _("Cancelled for {0}.").format(self.employee_name), alert=True
        )
```

**Key patterns:**
- `validate()` = auto-fill derived fields (period from date, employee details from Link)
- `on_submit()` = record audit trail (who, when), show user feedback
- `on_cancel()` = cleanup or notify
- Use `self.db_update()` after modifying fields in `on_submit` (doc already saved)
- Use `frappe.db.get_value()` for single-field lookups (fast, no full doc load)

### Controller Pattern (JavaScript)

```javascript
frappe.ui.form.on("Warehouse Violation", {
    refresh(frm) {
        // Color-coded workflow state indicator
        if (frm.doc.workflow_state) {
            const colors = {
                "Pending": "orange", "Confirmed": "green",
                "Appealed": "blue", "Waived": "red"
            };
            frm.page.set_indicator(
                frm.doc.workflow_state,
                colors[frm.doc.workflow_state] || "gray"
            );
        }

        // Dashboard indicators for key metrics
        if (frm.doc.penalty_points) {
            frm.dashboard.add_indicator(
                __("Penalty: {0} pts", [frm.doc.penalty_points]),
                frm.doc.penalty_points >= 8 ? "red" :
                frm.doc.penalty_points >= 5 ? "orange" : "blue"
            );
        }

        // Custom action buttons (non-submitted docs only)
        if (!frm.is_new() && frm.doc.docstatus === 0) {
            frm.add_custom_button(__("View Dashboard"), function () {
                frappe.set_route("query-report", "Employee Summary", {
                    period: frm.doc.period
                });
            }, __("Actions"));
        }
    },

    date(frm) {
        // Auto-fill period from date
        myapp.autoSetPeriod(frm, "date", "period");
    },

    violation_type(frm) {
        // Auto-fill penalty from master data
        if (frm.doc.violation_type) {
            frappe.db.get_value(
                "Warehouse Violation Type",
                frm.doc.violation_type,
                "penalty_points",
                (r) => {
                    if (r && r.penalty_points) {
                        frm.set_value("penalty_points", r.penalty_points);
                    }
                }
            );
        }
    }
});
```

### DocType Design Rules

```
✅ DO:
- Use Link fields to reference other DocTypes (Employee, Company, Branch)
- Add "period" field (Data, YYYY-MM) auto-derived from date
- Use Submittable DocTypes for records that need approval workflows
- Set "module" in DocType JSON to your app module name
- Add naming_rule or autoname for meaningful document names

❌ DON'T:
- Hardcode company/branch/employee names — always use Link fields
- Put business logic in DocType controllers — use engines/ instead
- Forget to add "module" property — makes fixtures export fail
- Create DocType without think about workflow states first
```


## 🌐 Layer 3: API Endpoints

### External Webhook Pattern (WMS/ERP Integration)

```python
@frappe.whitelist(allow_guest=False)
def receive_data(data):
    """
    POST /api/method/my_app.api.external.receive_data
    Body: {"data": [{...}, {...}]}
    Auth: token api_key:api_secret
    """
    if isinstance(data, str):
        data = json.loads(data)

    created = skipped = 0
    errors = []

    for rec in data:
        emp_code = rec.get("employee_code")
        try:
            employee = frappe.db.get_value(
                "Employee", {"employee_number": emp_code}, "name"
            )
            if not employee:
                errors.append({"code": emp_code, "error": f"Not found"})
                skipped += 1
                continue

            # Deduplicate: skip if already exists
            if frappe.db.exists("My DocType", {"employee": employee, "date": rec["date"]}):
                skipped += 1
                continue

            doc = frappe.get_doc({
                "doctype": "My DocType",
                "employee": employee,
                "date": rec.get("date"),
                "value": rec.get("value", 0),
                "source": "external_system",
            })
            doc.insert(ignore_permissions=True)
            created += 1

        except Exception as exc:
            errors.append({"code": emp_code, "error": str(exc)})
            skipped += 1
            frappe.log_error(str(exc), "receive_data")

    frappe.db.commit()
    return {"status": "ok" if not errors else "partial",
            "created": created, "skipped": skipped, "errors": errors}
```

### Internal API Pattern (UI + Dashboard)

```python
@frappe.whitelist()
def calculate_for_employee(employee, period_type, period_value, overwrite=False):
    """Manual trigger with idempotent upsert."""
    if not frappe.has_permission("My DocType", "write"):
        frappe.throw(_("Permission denied"), frappe.PermissionError)

    data = engine.calculate(employee, period_type, period_value)

    existing = frappe.db.get_value("My DocType", {
        "employee": employee, "period_type": period_type,
        "period_value": period_value,
    })

    if existing:
        if not overwrite:
            return {"status": "exists", "name": existing}
        doc = frappe.get_doc("My DocType", existing)
        if doc.docstatus == 1:
            frappe.throw(_("Cannot overwrite submitted record"))
        doc.update(data)
        doc.save(ignore_permissions=True)
        frappe.db.commit()
        return {"status": "updated", "name": doc.name}

    doc = frappe.get_doc({"doctype": "My DocType", **data})
    doc.insert(ignore_permissions=True)
    frappe.db.commit()
    return {"status": "created", "name": doc.name}
```

### Permission Query Pattern

```python
def get_permission_query(user: str) -> str:
    """Row-level security: user sees only their own records unless manager/admin."""
    roles = frappe.get_roles(user)
    admin_roles = {"System Manager", "HR Reviewer", "Department Manager"}
    if admin_roles & set(roles):
        return ""  # No filter = see all
    emp = frappe.db.get_value("Employee", {"user_id": user}, "name")
    if emp:
        return f"`tabMy DocType`.employee = '{emp}'"
    return "1=0"  # See nothing
```

**Key patterns:**
- `allow_guest=False` for webhooks (requires API key auth)
- Parse `data` as string or dict (Frappe may pass either)
- Batch processing with created/skipped/errors counters
- Idempotent upsert: check existing → update or insert
- `frappe.db.commit()` after bulk operations
- Permission queries for row-level security


## 🔗 hooks.py — The Nervous System

```python
app_name = "my_app"
app_title = "My App"
app_publisher = "My Company"
app_description = "App description"
app_license = "MIT"

required_apps = ["frappe/hrms"]  # Declare dependencies

# ── Assets ────────────────────────────────────────────────────────────────
app_include_js = ["/assets/my_app/js/my_app.js"]

# ── DocType JS overrides (for core DocTypes like Employee) ────────────────
doctype_js = {
    "Employee": "public/js/employee.js"
}

# ── After install / migrate ───────────────────────────────────────────────
after_install = "my_app.setup.install.after_install"
after_migrate = "my_app.setup.install.after_migrate"

# ── Doc Events (server-side hooks) ────────────────────────────────────────
doc_events = {
    "My Submittable Doc": {
        "on_submit": "my_app.engines.my_engine.on_doc_submit",
        "on_cancel": "my_app.engines.my_engine.on_doc_cancel",
    },
    "My Auto Doc": {
        "after_insert": "my_app.engines.my_engine.on_doc_insert",
    },
}

# ── Fixtures (portable across sites) ─────────────────────────────────────
fixtures = [
    {"dt": "Role", "filters": [["name", "in", ["My Role 1", "My Role 2"]]]},
    {"dt": "Custom Field", "filters": [["module", "=", "My App"]]},
    {"dt": "Workflow", "filters": [["document_type", "in", ["My Doc"]]]},
    {"dt": "Workflow State", "filters": [["name", "in", [
        "Draft", "Pending", "Approved", "Rejected"
    ]]]},
]

# ── Permission query conditions ───────────────────────────────────────────
permission_query_conditions = {
    "My Score Doc": "my_app.api.internal.get_permission_query",
}
```


## 📊 Layer 6: Reports

### Script Report Pattern

**Python (employee_scoring_summary.py):**

```python
def execute(filters=None):
    filters = filters or {}
    columns = get_columns()
    data = get_data(filters)
    chart = get_chart(data)
    report_summary = get_report_summary(data)
    return columns, data, None, chart, report_summary

def get_columns():
    return [
        {"fieldname": "employee", "label": "Employee", "fieldtype": "Link",
         "options": "Employee", "width": 120},
        {"fieldname": "value", "label": "Value", "fieldtype": "Float",
         "precision": 1, "width": 90},
        # ... more columns
    ]

def get_data(filters):
    conditions = "WHERE d.docstatus != 2"
    values = {}
    if filters.get("company"):
        conditions += " AND d.company = %(company)s"
        values["company"] = filters["company"]
    # ... more filters
    return frappe.db.sql(f"""
        SELECT d.employee, d.value, ...
        FROM `tabMy Doc` d {conditions}
        ORDER BY d.value DESC
    """, values, as_dict=True)

def get_chart(data):
    if not data:
        return None
    top = data[:10]
    return {
        "data": {
            "labels": [r.employee_name for r in top],
            "datasets": [
                {"name": "Value", "values": [r.value for r in top]},
            ],
        },
        "type": "bar",
        "colors": ["#2980b9"],
    }

def get_report_summary(data):
    if not data:
        return []
    total = len(data)
    avg = sum(r.value for r in data) / total if total else 0
    return [
        {"value": total, "label": "Total", "datatype": "Int", "indicator": "Blue"},
        {"value": round(avg, 1), "label": "Average", "datatype": "Float",
         "indicator": "Green" if avg >= 50 else "Orange"},
    ]
```

**JavaScript (employee_scoring_summary.js):**

```javascript
frappe.query_reports["Employee Scoring Summary"] = {
    filters: [
        {
            fieldname: "company",
            label: __("Company"),
            fieldtype: "Link",
            options: "Company",
            default: frappe.defaults.get_user_default("Company"),
        },
        {
            fieldname: "period",
            label: __("Period (YYYY-MM)"),
            fieldtype: "Data",
            default: frappe.datetime.get_today().substring(0, 7),
        },
    ],
};
```


## 🧪 Layer 6b: Testing

### Standalone Pure-Logic Tests (No Frappe!)

```python
"""
Run: python -m pytest my_app/tests/test_engine.py -v
No Frappe instance needed — tests only pure-logic functions.
"""
import unittest

# Inline pure-logic (copy from engine, no frappe imports)
PPH_LEVEL_ORDER = ["needs_improvement", "average", "good", "excellent"]
_DEFAULT_THRESHOLDS = [
    {"level": "needs_improvement", "min_pph": 0,  "max_pph": 35},
    {"level": "average",           "min_pph": 35, "max_pph": 55},
]
# ... paste pure functions here

class TestClassifyLevel(unittest.TestCase):
    def test_boundary(self):
        self.assertEqual(classify_level(35, _DEFAULT_THRESHOLDS), "average")

    def test_empty_defaults(self):
        self.assertEqual(classify_level(60, []), "good")

class TestLevelOrdering(unittest.TestCase):
    def test_gte(self):
        self.assertTrue(level_gte("excellent", "good"))
        self.assertFalse(level_gte("average", "good"))

if __name__ == "__main__":
    unittest.main(verbosity=2)
```

**Why inline pure functions in test files?**
- Tests run with `pytest -v` — no bench, no MariaDB, no Frappe site
- CI/CD friendly — fast, isolated, reliable
- Keep the test file self-contained


## 🌍 Layer 8: Multi-Language (i18n)

### Translation Workflow

Frappe uses bare strings wrapped in translation functions: `_("String")` in Python and `__("String")` in JavaScript. Do not use translation keys; use the English baseline string as the key.

1. **Wrap all UI-facing strings:**
    - Python: `frappe._("User {0} not found").format(user_id)`
    - JS: `__("User {0} not found", [user_id])`
2. **Export strings to CSV:**
    `bench --site <site> get-untranslated <language-code> <path/to/output.csv>`
3. **Translate and Import:**
    Add translations to the CSV, then place the translated translations in `my_app/translations/<lang>.csv`.

### Translation Rules
```
✅ DO:
- Use English as the default bare string.
- Use `{0}`, `{1}` for interpolation (positional args) to allow word reordering in other languages.
- Run `bench --site <site> migrate` to clear caches and load new translations.

❌ DON'T:
- Translate log messages or internal system errors meant for developers.
- Use concatenation (`_("Hello") + " " + user`) — always interpolate (`_("Hello {0}").format(user)`).
```


## ⚔️ Strict Constraints

### NEVER
- Push directly to production branch
- Delete or modify DocType JSON files without `bench migrate` after
- Hardcode employee/company references — always use Link fields
- Skip `frappe.db.commit()` after bulk operations
- Use `frappe.db.sql` for INSERT/UPDATE when ORM is available
- Put complex business logic directly in DocType controllers
- Ignore `docstatus` when querying submitted documents

### ALWAYS
- Run `bench --site <site> migrate` after changing DocType schemas
- Run `bench build --app <app>` after changing JS/CSS
- Use `@frappe.whitelist()` decorator for API endpoints
- Use `frappe.has_permission()` before operations in APIs
- Separate pure logic into `engines/` for testability
- Use `frappe.logger("app_name")` for structured logging
- Make `after_install` and `after_migrate` idempotent
- Filter by `docstatus = 1` when aggregating submitted records
- Use `COALESCE(SUM(...), 0)` to avoid NULL in SQL aggregations
- Add `frappe.db.commit()` at the end of batch task functions

### CONFIRM BEFORE RUNNING
- `bench --site <site> reinstall` (destroys data)
- Bulk data migration scripts
- Modifying workflow states (affects existing records)
- `bench drop-site` or `--force` commands
