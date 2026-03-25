Prism Agro
Prism Agro is a high-trust, decentralized agricultural marketplace designed to eliminate middlemen and reduce post-harvest loss in the Nigerian supply chain. By integrating a secure Escrow "Handshake" system, we ensure that farmers get paid fairly and buyers receive only the freshest produce.

Live Demo
MVP Link: https://prism-agro-site.onrender.com/

Note: Optimized for mobile-first usage by farmers and logistics drivers.

The Problem
Nigerian farmers often face high post-harvest losses and payment defaults from buyers. Simultaneously, buyers struggle with food quality and "trust gaps" when dealing with rural suppliers.

The Solution: The "Prism Vault" Protocol
We use a 3-Step Lock & Release mechanism powered by Interswitch:

The Lock: Buyer payment is captured and held in a secure Interswitch-backed Escrow vault.

The Handshake: Upon delivery, the Buyer inspects the goods and provides a unique 6-digit code to the Driver.

The Release: The Driver inputs the code into the app, which instantly triggers the disbursement of funds to the Farmer’s wallet.

Team Contributions & Roles
As per the Buildathon requirements, here is the breakdown of the contributions from the Prism Agro team:

Amos Gloria (Team Lead & Product Manager)
Product Strategy: Defined the "Prism Vault" Escrow protocol and mapped the user journeys for Buyer, Farmer, and Logistics roles.

Project Management: Managed the 3-day build sprint, handled documentation, and ensured alignment between design and engineering.

Frontend Development: Assisted with building the UI of the Next.js App.

Riches Arise Kolizibe (Backend Developer)
Escrow Engine: Developed the core API for fund management (/escrow/hold, /release, and /refund).

Payment Integration: Implemented the Interswitch/Quickteller payment initialization and verification webhooks.

Database Architecture: Designed the MongoDB schema to handle complex order states (Paid, Shipped, In-Transit, Released).

Security: Implemented role-based access control (RBAC) to protect Admin and Farmer sensitive data.

Tochukwu (Frontend Developer)
Dashboard Implementation: Built the highly responsive Buyer and Logistics dashboards using Next.js and Tailwind CSS.

Handshake UI: Developed the logic-driven "6-digit code" input system and the real-time transaction state machine.

API Integration: Connected the frontend to the backend endpoints, ensuring smooth redirects between the app and the Interswitch gateway.

Opeyemi (Product Designer)
UI/UX Design: Created the high-fidelity Figma prototype using the brand palette (#39AA44, #0B390C, #F5F5F5).

Material Design 3: Applied Material 3 principles to ensure accessibility for farmers and drivers working in high-glare, outdoor environments.

User Research: Designed the "Glanceable" logistics interface with large tap targets for mobile-first usability.

Technical Stack
Frontend: Next.js 16.2.1 (App Router), Tailwind CSS v4, Lucide React

Backend: Node.js, Express, Java

Database: MongoDB

Fintech Integration: Interswitch / Quickteller API

State Management: Custom React Hooks for Escrow Logic

Getting Started
Prerequisites
Node.js 18.x or higher

MongoDB connection string

Installation
Clone the repo:

Bash
git clone https://github.com/AmosGloria/prism-agro/
Install dependencies:

Bash
npm install
Run the development server:

Bash
npm run dev
Security Features
NIN Verification: All stakeholders are verified via API to prevent marketplace fraud.

Encrypted Handshake: The 6-digit release code is hashed and only accessible to the Buyer until the moment of delivery.

Audit Trail: Every movement of funds is logged in the Admin Ledger for dispute resolution.

Built with ❤️ for the Enyata x Interswitch Buildathon 2026.
