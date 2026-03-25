---
title: "Frappe Installation & Setup Guide"
description: "Resource: installation-guide"
---

# Frappe Installation & Setup Guide

> Complete reference for installing bench, creating sites, and production deployment.


## Bench Installation

### Install via pip
```bash
pip3 install frappe-bench
```

### Initialize Bench
```bash
# Latest version
bench init frappe-bench --frappe-branch version-15
cd frappe-bench

# Specific version
bench init frappe-bench --frappe-branch version-14
```

### Verify Installation
```bash
bench --version
bench find .  # Should find the bench directory
```


## Custom App Development Setup

### Create New App
```bash
bench new-app my_custom_app
# Follow interactive prompts for title, description, etc.
```

### Install on Site
```bash
bench --site mysite.localhost install-app my_custom_app
```

### Development Workflow
```bash
# Watch for changes (auto-rebuild JS/CSS)
bench watch

# Manual build
bench build --app my_custom_app

# Run migrations after schema changes
bench --site mysite.localhost migrate

# Clear cache
bench --site mysite.localhost clear-cache
```


## Docker Setup (Development)

### Using frappe_docker
```bash
git clone https://github.com/frappe/frappe_docker.git
cd frappe_docker

# Development setup
cp example.env .env
docker compose -f compose.yaml \
  -f overrides/compose.noproxy.yaml \
  -f overrides/compose.mariadb.yaml \
  up -d

# Create site
docker compose exec backend \
  bench new-site mysite.localhost --mariadb-root-password 123
```


## Multi-Site Setup

```bash
# Enable DNS-based multi-tenancy
bench config dns_multitenant on

# Create additional sites
bench new-site site2.localhost
bench --site site2.localhost install-app erpnext

# Add to hosts file
echo "127.0.0.1 site2.localhost" | sudo tee -a /etc/hosts
```


## Version Upgrade

```bash
# Update to latest patch
bench update

# Switch major version
bench switch-to-branch version-15 frappe erpnext
bench update --patch
```
