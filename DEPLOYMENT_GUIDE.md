# ZapShift — Deployment Guide

## What Was Fixed

### Client (`zap-shift-client`)

| # | File | Issue | Fix |
|---|------|-------|-----|
| 1 | `src/hooks/useAxios.jsx` | Hardcoded `http://localhost:3000` — would break in production | Now reads from `VITE_API_URL` env variable |
| 2 | `src/hooks/useAxiosSecure.jsx` | Same hardcoded localhost issue | Same fix |
| 3 | `index.html` | Generic title "zap-shift-client" | Updated to "ZapShift - Fast Parcel Delivery" |
| 4 | `vite.config.js` | Missing explicit build config | Added `outDir` and `sourcemap` settings |
| 5 | `.gitignore` | `.env.example` would be excluded | Fixed to allow `.env.example` |
| 6 | `.env.example` | Did not exist | Created with all required variables |

### Server (`zap-shift-server`)

| # | File | Issue | Fix |
|---|------|-------|-----|
| 7 | `index.js` | `cors()` with no options — allows ALL origins in production | Now allows only `localhost:5173` and `SITE_DOMAIN` |
| 8 | `index.js` | Unused `require('fs')`, `require('domain')`, `require('console')` | Removed |
| 9 | `package.json` | `dotenv ^17`, `express ^5`, `firebase-admin ^13`, `mongodb ^7`, `stripe ^20` — very latest unstable versions | Pinned to stable LTS versions |
| 10 | `package.json` | Missing `engines` field (Vercel needs to know Node version) | Added `"engines": { "node": ">=18.x" }` |
| 11 | Folder | Nested `zap_shift_server/` folder + zip inside server — leftover junk | Removed |
| 12 | Folder | Raw `zap-shift-firebase-adminsdk.json` in server root — security risk | Removed (it's already base64-encoded in env) |
| 13 | `keyconvert.js` | One-time utility script committed to repo | Removed |
| 14 | `.gitignore` | Did not exclude `*firebase-adminsdk*.json` | Added exclusion |
| 15 | `.env.example` | Did not exist | Created with all required variables |

---

## Deployment Steps

### Step 1 — Deploy the Server to Vercel

**Prerequisites:** Install Vercel CLI if you haven't — `npm i -g vercel`

```bash
cd zap-shift-server
npm install
vercel login
vercel
# Follow prompts → pick your scope → "y" to set up project → defaults are fine
vercel --prod
```

After deployment, Vercel will give you a URL like:
```
https://zap-shift-server.vercel.app
```

Copy this URL. You'll need it in the next step.

**Set environment variables on Vercel dashboard** (`vercel.com` → your project → Settings → Environment Variables):

```
DB_USER           = 
DB_PASSWORD       = 
STRIPE_SECRET     = 
SITE_DOMAIN       = 
FB_SERVICE_KEY    = 
```

> **Tip:** You already have all these values in your local `.env` file. Just paste them.

After adding env vars, redeploy:
```bash
vercel --prod
```

**Test your server is live:**
```
https://zap-shift-server.vercel.app/
# Should return: "Zap is shifting to a new domain!"
```

---

### Step 2 — Prepare the Client

Create your `.env` file in `zap-shift-client/`:

```env
VITE_apiKey=
VITE_authDomain=
VITE_projectId=
VITE_storageBucket=
VITE_messagingSenderId=
VITE_appId=
VITE_image_host_key=

# ← This is the Vercel server URL from Step 1
VITE_API_URL=https://zap-shift-server.vercel.app
```

---

### Step 3 — Deploy the Client to Firebase Hosting

**Prerequisites:** Install Firebase CLI if you haven't — `npm i -g firebase-tools`

```bash
cd zap-shift-client
npm install
npm run build
firebase login
firebase deploy
```

Firebase will give you:
```
Hosting URL: https://zap-shift-8e3a6.web.app
```

---

### Step 4 — Update SITE_DOMAIN on Vercel

Go back to Vercel → your server project → Environment Variables → update:
```
SITE_DOMAIN = https://zap-shift-8e3a6.web.app
```

Then redeploy server once more:
```bash
cd zap-shift-server
vercel --prod
```

This is needed so Stripe redirects after payment go to your live Firebase URL instead of localhost.

---

### Step 5 — Enable Firebase Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com) → your project → Authentication → Settings → Authorized domains
2. Add: `zap-shift-server.vercel.app` (your Vercel server domain)

This prevents Firebase token verification from rejecting requests originating from Vercel.

---

### Step 6 — MongoDB Atlas Network Access

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) → Network Access
2. Add IP Address → Allow access from anywhere (`0.0.0.0/0`)

This is required because Vercel serverless functions use dynamic IPs.

---

## Quick Reference

| Service | URL |
|---------|-----|
| Frontend (Firebase) | `https://zap-shift-8e3a6.web.app` |
| Backend (Vercel) | `https://zap-shift-server.vercel.app` |
| MongoDB Atlas | `cluster0.8in39f0.mongodb.net` |

---

## Environment Variable Summary

### Client (`zap-shift-client/.env`)
```
VITE_apiKey
VITE_authDomain
VITE_projectId
VITE_storageBucket
VITE_messagingSenderId
VITE_appId
VITE_image_host_key
VITE_API_URL          ← NEW (points to your Vercel server)
```

### Server (Vercel dashboard)
```
DB_USER
DB_PASSWORD
STRIPE_SECRET
SITE_DOMAIN           ← UPDATE to Firebase Hosting URL
FB_SERVICE_KEY
```

---

## Common Errors After Deployment

**Blank page on Firebase / refresh gives 404**
→ Already handled — `firebase.json` has the SPA rewrite rule for React Router.

**API calls failing / CORS error in browser**
→ Make sure `SITE_DOMAIN` on Vercel matches your Firebase Hosting URL exactly (no trailing slash).

**Payment redirect goes to localhost after payment**
→ `SITE_DOMAIN` is wrong on Vercel. Update it and redeploy.

**Firebase auth token rejected**
→ Add your Vercel domain to Firebase Authorized Domains.

**MongoDB connection timeout**
→ Set MongoDB Atlas network access to allow all IPs (`0.0.0.0/0`).
