# 🖥️ Dashboard App — Electron

A cross-platform **desktop application** version of the Dashboard App, built with **Electron** wrapping the Angular web app. Runs natively on Windows, macOS, and Linux.

## 🔗 Live Demo

> 🌐 **[Live Demo](https://drive.google.com/file/d/1TiWOSZmcs-Zo69uGD9pF5AnOlgT3y9Da/view?usp=sharing)**

## ✨ Features

- 🖥️ **Native Desktop App** — Runs on Windows, macOS, and Linux
- 🔐 **Sign In** — authentication with form validation
- 📊 **Dashboard** — Interactive donut chart & bar chart
- 📋 **User Table** — Data grid displaying users from API
- 🔒 **Route Guard** — Protected routes; unauthenticated users are redirected to Sign In
- 📦 **Packaged Installer** — Build distributable `.exe` / `.dmg` / `.AppImage`

## 📁 Project Structure

```
src/
├── app/
│   ├── features/
│   │   ├── dashboard/      # Dashboard module
│   │   └── login/          # Sign In module
│   ├── core/
│   │   ├── guards/         # Auth route guard
│   │   ├── interceptor/    # HTTP interceptor
│   │   └── services/       # Service API
│   ├── main.js             # Configuration Electron
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 14.x`
- NPM `>= 6.x`
- Angular CLI `>= 14.x`

```bash
npm install -g @angular/cli@14
```

### Installation

```bash
# Clone the repository
git clone https://github.com/allail-qadrillah/fe-tasks-desktop

# Navigate to project folder
cd fe-tasks-desktop

# Install dependencies
npm install
```

## 🧪 Development

### Run in Development Mode

Run Angular dev server and Electron together:

```bash
# Terminal 1 — Start Angular dev server
ng serve

# Terminal 2 — Start Electron (pointing to localhost:4200)
npm run electron
```

Or use a combined script if configured:

```bash
npm run start:electron
```

---

## 📦 Build & Package

### Step 1 — Build Angular for Production

```bash
ng build --configuration production --base-href ./
```

### Step 2 — Package with Electron Builder

```bash
# Package for current OS
npm run electron:build

# Package for specific OS
npm run electron:build -- --win     # Windows (.exe)
npm run electron:build -- --mac     # macOS (.dmg)
npm run electron:build -- --linux   # Linux (.AppImage)
```

Installers will be output to the `release/` folder.

---

## 🔑 Credentials (Demo)

| Field | Value |
|-------|-------|
| Email | `user@aemenersol.com` |
| Password | `Test@123` |

---

## 🌐 API Reference

### Sign In

```
POST http://test-demo.aemenersol.com/api/account/login
```

### Dashboard Data

```
GET http://test-demo.aemenersol.com/api/dashboard
Authorization: Bearer <token>
```