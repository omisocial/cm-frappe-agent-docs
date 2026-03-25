---
title: "Web Form Development Patterns"
description: "Resource: web-form-patterns"
---

# Web Form Development Patterns

> Patterns for building Frappe Web Forms (portal pages) — client scripts, CSS, and gotchas.


## Client Script Patterns

### Basic Structure
```javascript
frappe.ready(function() {
    // All Web Form code goes inside frappe.ready()
    // This ensures the form is fully loaded before running

    // Set initial values
    frappe.web_form.set_values({
        date: frappe.datetime.get_today(),
        status: 'Open'
    });

    // Listen for field changes
    frappe.web_form.on('change', function(field, value) {
        if (field === 'category') {
            handle_category_change(value);
        }
    });
});
```

### Set Read-Only Fields
```javascript
frappe.ready(function() {
    // Read-only fields CAN still be set via set_values()
    frappe.web_form.set_values({
        employee_name: frappe.session.user_fullname,
        submit_date: frappe.datetime.get_today()
    });
});
```

### Conditional Field Visibility
```javascript
frappe.ready(function() {
    frappe.web_form.on('change', function(field, value) {
        if (field === 'request_type') {
            // Show/hide fields based on selection
            let show_urgency = (value === 'Emergency');
            frappe.web_form.fields_dict.urgency_level.$wrapper.toggle(show_urgency);
            frappe.web_form.fields_dict.emergency_contact.$wrapper.toggle(show_urgency);
        }
    });
});
```

### Custom Validation Before Submit
```javascript
frappe.ready(function() {
    frappe.web_form.validate = function() {
        let values = frappe.web_form.get_values();

        if (!values.email || !values.email.includes('@')) {
            frappe.msgprint(__('Please enter a valid email address'));
            return false; // Prevents submission
        }

        if (values.start_date > values.end_date) {
            frappe.msgprint(__('End date must be after start date'));
            return false;
        }

        return true; // Allow submission
    };
});
```

### Call Server Methods
```javascript
frappe.ready(function() {
    frappe.web_form.on('change', function(field, value) {
        if (field === 'employee_id') {
            frappe.call({
                method: 'my_app.api.get_employee_details',
                args: { employee_id: value },
                callback: function(r) {
                    if (r.message) {
                        frappe.web_form.set_values({
                            employee_name: r.message.employee_name,
                            department: r.message.department
                        });
                    }
                }
            });
        }
    });
});
```

### After Load / After Save
```javascript
frappe.ready(function() {
    // After form loads
    frappe.web_form.after_load = function() {
        console.log('Form loaded with data:', frappe.web_form.doc);
    };

    // After form saves
    frappe.web_form.after_save = function() {
        frappe.msgprint(__('Thank you! Your submission has been recorded.'));
    };
});
```


## Common Gotchas

### 1. Timing Issues
```javascript
// ❌ WRONG: Code runs before form is ready
frappe.web_form.set_values({ field: 'value' });

// ✅ CORRECT: Always wrap in frappe.ready()
frappe.ready(function() {
    frappe.web_form.set_values({ field: 'value' });
});
```

### 2. set_value vs set_values
```javascript
// ❌ WRONG: set_value doesn't exist on WebForm
frappe.web_form.set_value('field', 'value');

// ✅ CORRECT: Use set_values (plural) with object
frappe.web_form.set_values({ field: 'value' });
```

### 3. Guest Access
```javascript
// For forms allowing guest submissions, check login state:
frappe.ready(function() {
    if (frappe.session.user === 'Guest') {
        // Show limited fields
        frappe.web_form.fields_dict.internal_field.$wrapper.hide();
    }
});
```

### 4. File Uploads in Web Forms
```javascript
// Web Forms handle file uploads differently
// Use the Attach field type in DocType, Web Form will auto-create upload widget
// For custom upload handling:
frappe.ready(function() {
    frappe.web_form.on('change', function(field, value) {
        if (field === 'attachment' && value) {
            console.log('File uploaded:', value);
        }
    });
});
```
