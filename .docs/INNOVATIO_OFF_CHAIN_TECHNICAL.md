# INNOVATIO – OFF-CHAIN TECHNICAL SPECIFICATION

## Introduction and General Overview

The Innovatio protocol complements its on-chain logic with a robust off-chain system. This includes the web application (frontend and backend), traditional relational database, API management, synchronization infrastructure, admin tools, and all auxiliary services for user interaction, campaign management, and operational monitoring. The off-chain components ensure usability, scalability, and efficient project and user management.

---

## Off-Chain Architecture

### Overview

* **Web Application (Frontend):** Modern user interface for campaign creation, browsing, investing, management, and milestone validation.
* **Backend (SmartDB-based):** Handles API requests, authentication, business logic, transaction building, and blockchain/database synchronization.
* **Database (PostgreSQL):** Stores extensive descriptive information, user profiles, campaign metadata, updates, discussions, and off-chain-only entities.
* **SmartDB Framework:** Orchestrates entity management, state sync, API autogeneration, role-based permissions, and transaction lifecycle.

---

## Off-Chain Key Concepts

### Off-Chain

Refers to all components operating outside the blockchain: web application, backend services, and database. Manages user experience, descriptive content, user profiles, and any logic that does not require blockchain immutability.

### Entity

Off-chain entities form the data backbone. They exist as:

* **Regular Entities:** Pure database records (traditional ORM pattern)
* **SmartDB Entities:** Synchronized between off-chain DB and on-chain datums

Entities encapsulate projects, users, roles, milestones, admin settings, etc.

### System Users

#### Wallet

Primary user identity is a Cardano wallet. Wallet connection enables Web3-native authentication and transaction signing.

#### User Types & Roles

* **Protocol Team:** Admins registered in DB and mapped to on-chain admins
* **Campaign Managers:** Authorized wallets for a campaign (on-chain and DB)
* **Campaign Editors:** Identified by email, can update campaign metadata and content (DB-only)
* **Investors:** Any wallet; can invest in campaigns

---

## Identification and Access System

### Wallets & Wallet Connector

* Connect any Cardano-compatible wallet for authentication and authorization
* Link an email to a wallet for notifications and additional DB-only permissions
* Sign transactions securely

### Email Linking

* For communication and notifications
* For assigning campaign editor roles (DB-only permissions)

### Permission Hierarchy

* **Protocol Team:** Maximum privilege, approve/reject campaigns, validate milestones, manage parameters, run emergency ops
* **Campaign Managers:** Full campaign management, milestone requests, fund withdrawal (DB+on-chain)
* **Campaign Editors:** Content management, update campaign details, handle media (DB-only)
* **Investors:** Token purchase transactions (on-chain), DB profile

---

## User Interface Structure

### Home (`/index`)

* Curated list of featured campaigns
* Search/filter, explore projects

### Drafts & Manage (`/manage`)

* Panel for campaign creators/admins to see and manage their projects (draft and active)

### Create Campaign (`/create`)

* Guided multi-step form to define project, goals, milestones, team, and marketing materials

### Campaign Details Page (`/campaign?id=xx`)

* Full description, fundraising status, milestones, team, history, progress
* Action buttons based on user role and campaign state

### Edit Campaign (`/edit?id=xx`)

* Update all campaign metadata/content
* Manage editors, media, roadmap, FAQs

---

## SmartDB Framework (Off-Chain Engine)

### Main Components

#### Entity Management System

* ORM-like abstraction for all DB entities
* **Regular entities:** Only exist in DB
* **SmartDB entities:** Synchronized with on-chain datums

#### Synchronization System

* **Blockchain Scanner:** Monitors registered addresses, processes new transactions, updates DB
* **Database Synchronizer:** Batch and real-time updates, conflict resolution

#### Transaction Management

* **Transaction Builder:** Constructs Cardano transactions (with Lucid), manages signatures, script interactions, retry policies
* **Transaction Flow:** Request, build, sign, submit, confirm, update DB, notify frontend

#### UTXO Management (off-chain logic)

* UTXO selection, concurrency controls (syncs with on-chain state)

#### API System

* RESTful endpoint auto-generation per entity
* OpenAPI docs, request validation, authentication

#### Security Layer

* JWT-based authentication
* Role-based access control

#### Frontend Tools

* React hooks for wallet connection, transaction state, data fetching

#### Additional Features

* Performance: query optimization, connection pooling, caching
* Developer Experience: CLI tools for codegen, docs
* Security: input sanitization, CORS, SQL injection prevention

---

## Database Structure (Entities)

### Protocol

Stores global protocol settings, contract references, admin lists, and metadata.

### Protocol-Admin-Wallet

Links protocol and admin users (mirrors on-chain Core Team).

### Campaign

All campaign metadata, state, links to admins/editors/milestones, content, images, roadmap, status, category, funding progress, featured/archived flags.

### Campaign-Category

Campaign categories (name, description).

### Campaign-Status

Possible campaign statuses (Created, Submitted, Approved, Contract Created, Published, Started, Fundraising, Active, Success, Failed, Unreached, etc.).

### Campaign-Content

Text blocks, media, detailed sections per campaign.

### Campaign-FAQs

FAQ text blocks per campaign.

### Campaign-Admin-Wallet

Relates campaign to admin wallet(s).

### Campaign-Editor

Relates campaign to editor emails.

### Milestone

All milestone metadata (name, description, percentage, estimated date, status, order).

### Milestone-Status

Milestone status (Not Started, Started, Submitted, Rejected, Finished, Failed).

### Wallet

Stores user wallet info, email, profile, preferences, linked campaigns.

### Token-Metadata

Token info cache (policy ID, token name, metadata).

### Transactions

History of on-chain transactions (type, hash, status, metadata, associated campaign/wallet).

### Smart UTxO

Tracks all UTxOs managed by the system (for off-chain monitoring, concurrency).

### Address to Follow

Monitors blockchain addresses/types for state sync.

### Site

Global configuration (key, value).

### Job

Long-running or scheduled process tracker.

---

## Off-Chain Interactions & Lifecycle

### Campaign Lifecycle (DB Actions)

1. **Create Campaign:** User connects wallet, defines team/editors, completes campaign info via forms, created in DB only
2. **Submit for Review:** Editors/admins mark as ready for Protocol Team review
3. **Approval/Reject:** Protocol team approves or rejects campaign in DB (triggers contract deployment if approved)
4. **Edit/Update:** Editors/admins update metadata/content any time before or after on-chain deployment
5. **Admin/Editor Management:** Assign/revoke admin wallets and editor emails

### Milestone & Evidence Management (Off-Chain)

* Submit milestone deliverables and evidence (DB, not on-chain)
* Protocol team reviews submissions (updates milestone status in DB, triggers on-chain milestone approval)

### User Management

* Register wallets, emails, set profiles/preferences
* Assign roles, track activity

### Administrative Management

* Feature/Unfeature campaigns (flags for home page)
* Archive/Unarchive campaigns (hidden from public views)
* Sync on-chain/off-chain states
* Monitor blockchain scanner, UTxO management

---

## Security & Synchronization

* **Automatic sync**: Keeps DB in sync with on-chain datums and UTxOs
* **Conflict prevention**: Ensures no lost updates between blockchain and DB
* **Data validation**: All requests checked by SmartDB layer before DB update or blockchain submission

---

## Notes

* **No state is lost**: All campaign, milestone, user, and interaction data are retained, searchable, and queryable via APIs
* **Full auditability**: Every interaction, update, admin action, and user event is logged in the DB for accountability
* **Extensible**: New entities, endpoints, roles, and flows can be added easily through the SmartDB and API layers

