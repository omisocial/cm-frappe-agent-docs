---
title: "DocType Registry"
description: "Resource: doctype-registry"
---

# DocType Registry

> Reference for discovering and exploring DocTypes on Frappe/ERPNext sites.


## Core Frappe Modules (Standard)

These modules exist on every Frappe site:

| Module | Typical DocTypes | Purpose |
|--------|-----------------|---------|
| **Core** | DocType, User, Role, File, Report, Page | Framework foundation |
| **Custom** | Custom Field, Client Script, Property Setter | Customization layer |
| **Desk** | ToDo, Dashboard, Kanban Board, Workspace | User interface |
| **Email** | Email Account, Notification, Email Template | Email system |
| **Integrations** | Webhook, OAuth Client, Connected App | Third-party integrations |
| **Printing** | Print Format, Letter Head | Print templates |
| **Website** | Web Page, Web Form, Blog Post | Website/portal |
| **Workflow** | Workflow, Workflow State, Workflow Action | Document workflows |
| **Automation** | Assignment Rule, Auto Repeat | Automation rules |
| **Contacts** | Address, Contact | Contact management |
| **Geo** | Country, Currency | Geographic data |


## Quick DocType Discovery Commands

### Find DocTypes by keyword
```python
# In bench console
frappe.get_all("DocType",
    filters={"name": ["like", "%Invoice%"]},
    fields=["name", "module", "issingle"],
    limit_page_length=0
)
```

### Find custom app DocTypes
```python
frappe.get_all("DocType",
    filters={"module": "My Custom Module"},
    fields=["name", "issingle", "istable"],
    limit_page_length=0
)
```

### Check DocType metadata
```python
meta = frappe.get_meta("Sales Invoice")
print(f"Fields: {len(meta.fields)}")
print(f"Is Submittable: {meta.is_submittable}")
print(f"Is Child Table: {meta.istable}")
for df in meta.fields:
    print(f"  {df.fieldname} ({df.fieldtype})" + (" *" if df.reqd else ""))
```

### Find child tables of a DocType
```python
meta = frappe.get_meta("Sales Invoice")
for df in meta.fields:
    if df.fieldtype == "Table":
        print(f"  {df.fieldname} → {df.options}")
```
