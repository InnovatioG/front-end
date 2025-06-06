# Innovatio DApp

Welcome to the **Innovatio** Decentralized Crowdfunding Platform — built on **Cardano** and powered by **Plutus smart contracts**. This is the web application (frontend + backend) implemented with **Next.js**, **React**, and **TypeScript**, integrating directly with the blockchain and the SmartDB layer.

## 🚀 Features

- 📦 Full integration with Cardano blockchain (on-chain campaign management)
- 🧠 SmartDB sync between blockchain & PostgreSQL
- 🖼️ Dynamic UI with React & SCSS Modules
- 🔐 Web3 login via Cardano wallets (Eternl, Nami, etc.)
- 🧾 Campaign creation, investment, milestone validation, and fund management
- 🔧 Admin and user dashboards

## 🛠️ Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open <http://localhost:3000> in your browser to view the app.

## 🔗 Backend Integration

This frontend connects to:

- 🧠 **SmartDB**: Unified backend service managing PostgreSQL + Blockchain sync
- 🧾 Smart contracts written in **Plutus V2 / Aiken** (see `/smart_contracts`)
- 📡 Uses **Lucid** for transaction construction

> For backend configuration and API routes, see `src/lib/SmartDB` and `pages/api/`.

## 🧪 Development Notes

- Pages live under `src/pages/`
- Components live under `src/components/`
- Smart contract interaction logic is in `src/lib/SmartDB`
- Reusable hooks and contexts are in `src/hooks/` and `src/contexts/`

## 🧬 Technologies

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind + SCSS Modules**
- **Plutus / Lucid / CIP-68**
- **PostgreSQL**
- **SmartDB (custom off-chain layer)**

## 🧾 Scripts

```bash
# Innovatio DApp

Welcome to the **Innovatio** Decentralized Crowdfunding Platform — built on **Cardano** and powered by **Plutus smart contracts**. This is the web application (frontend + backend) implemented with **Next.js**, **React**, and **TypeScript**, integrating directly with the blockchain and the SmartDB layer.

## 🚀 Features

- 📦 Full integration with Cardano blockchain (on-chain campaign management)
- 🧠 SmartDB sync between blockchain & PostgreSQL
- 🖼️ Dynamic UI with React & SCSS Modules
- 🔐 Web3 login via Cardano wallets (Eternl, Nami, etc.)
- 🧾 Campaign creation, investment, milestone validation, and fund management
- 🔧 Admin and user dashboards

## 🛠️ Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open <http://localhost:3000> in your browser to view the app.

## 🔗 Backend Integration

This frontend connects to:

- 🧠 **SmartDB**: Unified backend service managing PostgreSQL + Blockchain sync
- 🧾 Smart contracts written in **Plutus V2 / Aiken** (see `/smart_contracts`)
- 📡 Uses **Lucid** for transaction construction

> For backend configuration and API routes, see `src/lib/SmartDB` and `pages/api/`.

## 🧪 Development Notes

- Pages live under `src/pages/`
- Components live under `src/components/`
- Smart contract interaction logic is in `src/lib/SmartDB`
- Reusable hooks and contexts are in `src/hooks/` and `src/contexts/`

## 🧬 Technologies

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind + SCSS Modules**
- **Plutus / Lucid / CIP-68**
- **PostgreSQL**
- **SmartDB (custom off-chain layer)**

## 🧾 Scripts

```bash
npm run dev                          # Start development server with increased memory
npm run deb                          # Start dev server with debugger enabled
npm run kill                         # Kill port 3000 if in use
npm run build                        # Clean and build production bundle
npm run start                        # Start production server
npm run clean                        # Remove .next folder
npm run cleanAll                     # Remove node_modules and .next
npm run lint                         # Run Next.js linter
npm run smartDBInstall               # Reinstall local smart-db.tgz (force)
npm run watchSmartDBAndInstall       # Watch local smart-db.tgz and reinstall on change
npm run watchOriginSmartDBAndInstall # Watch SmartDB from external source and reinstall locally
npm run swagger-dev                 # Start Swagger server in dev mode
npm run swagger-start               # Start Swagger server in production mode
npm run resetTime                   # Reset mocked blockchain time
npm run setTime                     # Set mocked blockchain time
```
## 📄 Technical Specification

For detailed technical documentation, see the [documentation](./.docs/INNOVATIO_OFF_CHAIN_TECHNICAL.md).
## 📦 Deployment

This project is ready to deploy on:

- Vercel (<https://vercel.com>)
- Docker (./Dockerfile - if present)
- Custom server environments (check env vars)

## 👥 Contributors

- Protocol team: governance, approvals
- Campaign managers: create & run campaigns
- Investors: fund campaigns with ADA
- Editors: manage content off-chain
