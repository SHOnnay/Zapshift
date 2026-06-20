# ZapShift ⚡

A modern parcel delivery and logistics management platform that streamlines parcel booking, rider management, shipment tracking, and payment processing.

🌐 **Live Demo:** [https://zap-shift-8e3a6.web.app/](https://zap-shift-8e3a6.web.app/)
🔗 **Repository:** [https://github.com/SHOnnay/Zapshift](https://github.com/SHOnnay/Zapshift)

---

## 📖 Overview

ZapShift is a full-stack logistics management application designed to simplify parcel delivery operations for customers, riders, and administrators.

Users can create delivery requests, track parcels in real time, manage shipments, and securely complete payments. Administrators can oversee users, riders, parcels, and delivery operations from a centralized dashboard.

---

## ✨ Features

### Customer Features
- User registration and secure Firebase login
- Create parcel delivery requests with dynamic pricing
- Real-time parcel tracking and status updates
- Payment integration using Stripe Gateway
- Comprehensive delivery history management

### Rider Features
- Rider application and onboarding system
- Assigned delivery management panel
- Real-time delivery status updates
- Integrated parcel pickup and completion workflow

### Admin Features
- Centralized User & Rider management
- Comprehensive parcel monitoring and lifecycle control
- Dynamic delivery assignment system
- Advanced search and filter matching for users
- Strict Role-Based Access Control (RBAC)

### Tracking System
- Unique tracking ID generation algorithm
- Real-time parcel lifecycle tracking
- Delivery progress monitoring with timeline logs

---

## 🛠️ Tech Stack

### Frontend
- React.js & React Router
- Tailwind CSS (Responsive Design)
- Firebase Authentication
- React Query & Axios (Data Fetching & State Synchronization)
- Framer Motion (Smooth UI Transitions)
- Recharts (Data Visualization)
- React Hook Form

### Backend & Database
- Node.js & Express.js (RESTful API)
- MongoDB Atlas
- Firebase Admin SDK
- Stripe Payment Gateway

### Deployment
- **Frontend:** Firebase Hosting
- **Backend:** Node.js environment (Vercel)

---

## 🔐 Authentication & Security

- Firebase Authentication integration
- JSON Web Token (JWT) verification architecture
- Explicit role-based authorization
- Protected routes on the frontend
- Secure custom API middleware layers

---

## 📦 Main Modules

- Authentication & Authorization System
- Parcel Booking Engine
- Lifecycle Tracking System
- Rider Management & Delivery Assignment
- Secure Payment Processing (Stripe)
- Multi-tier Administrative & User Dashboards

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SHOnnay/Zapshift.git
cd Zapshift
```

### 2. Client setup

```bash
cd client
npm install
npm run dev
```

### 3. Server setup

Open a new terminal from the project root:

```bash
cd server
npm install
npm start
```

> **Note:** Both `client` and `server` require their own `.env` file — see `.env.example` in each folder for the required keys (Firebase config, MongoDB URI, Stripe keys, JWT secret).

---

## 🎯 Future Improvements

- Real-time push notifications via WebSockets
- Advanced delivery analytics metrics panel
- Dedicated mobile application wrapper
- Live GPS rider location tracking map
- Automated route optimization for delivery scheduling

---

## 👨‍💻 Developer

**Sakibul Huda Onnay**
[Portfolio](https://shonnay.github.io/onnay-portfolio/) · [LinkedIn](https://www.linkedin.com/in/sakibul-huda-onnay/) · [GitHub](https://github.com/SHOnnay)

If you find this project useful, consider giving it a ⭐ on GitHub!
