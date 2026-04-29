# Bharat Kumbh Backend – Deploy to Vercel

Step-by-step guide to push your backend to GitHub and deploy it on Vercel.

---

## Prerequisites

- [Git](https://git-scm.com/) installed
- [GitHub](https://github.com/) account
- [Vercel](https://vercel.com/) account (free tier works)
- PostgreSQL database (e.g. [Neon](https://neon.tech/) or [Supabase](https://supabase.com/))

---

## Part 1: Push Backend to GitHub

### 1.1 Initialize Git (if not already)

```bash
cd d:\Projects\BharatKumbh
git status
```

If you see "not a git repository", run:

```bash
git init
```

### 1.2 Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it `BharatKumbh` (or any name)
3. Choose **Public**
4. Do **not** initialize with README (you already have code)
5. Click **Create repository**

### 1.3 Push to GitHub

```bash
cd d:\Projects\BharatKumbh

# Add all files
git add .

# Commit
git commit -m "Backend ready for Vercel deployment"

# Add remote (replace YOUR_USERNAME and YOUR_REPO with your GitHub username and repo name)
git remote add origin https://github.com/YOUR_USERNAME/BharatKumbh.git

# Push
git branch -M main
git push -u origin main
```

---

## Part 2: Deploy on Vercel

### 2.1 Import Project from GitHub

1. Go to [vercel.com](https://vercel.com) and sign in (use GitHub)
2. Click **Add New** → **Project**
3. Import your **BharatKumbh** repository
4. Vercel will detect it as a monorepo

### 2.2 Configure Root Directory

1. In **Project Settings**, set **Root Directory** to `server`
2. Or during import, click **Edit** next to Root Directory and choose `server`

### 2.3 Build Settings (Vercel auto-detects)

| Setting        | Value                    |
|----------------|--------------------------|
| Framework      | Other                    |
| Root Directory | `server`                 |
| Build Command  | (leave empty or `npm run vercel-build`) |
| Output Directory | (leave default)        |
| Install Command | `npm install`          |

### 2.4 Environment Variables

In Vercel: **Project → Settings → Environment Variables**

Add these for **Production** (and Preview if needed):

| Name         | Value                    | Notes                          |
|--------------|--------------------------|--------------------------------|
| `JWT_SECRET` | `your-long-random-secret` | Use a strong random string     |
| `DATABASE_URL` | `postgresql://...`      | Your Neon/Supabase connection  |
| `CORS_ORIGIN` | `*` or your app URL     | `*` for dev; restrict in prod  |

**Example DATABASE_URL (Neon):**
```
postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.5 Deploy

1. Click **Deploy**
2. Wait for the build to finish
3. Your API will be live at: `https://your-project.vercel.app`

---

## Part 3: Update Mobile App to Use Live API

Edit `client/src/config/api.js`:

```javascript
const USE_LOCAL_SERVER = false;  // Change to false for production
```

If your Vercel project has a different URL (e.g. `https://bharat-kumbh-backend.vercel.app`), update the fallback URL in `getBaseURL()`:

```javascript
if (!USE_LOCAL_SERVER) return 'https://YOUR-PROJECT.vercel.app';
```

---

## Part 4: Database Setup (First-Time)

If your PostgreSQL database is empty:

1. Run the schema locally with your production `DATABASE_URL`:
   ```bash
   cd server
   # Set DATABASE_URL in .env to your Neon/Supabase URL
   psql $DATABASE_URL -f db/schema.sql
   ```
   Or use Neon/Supabase SQL editor to run `db/schema.sql`

2. (Optional) Seed users:
   ```bash
   npm run db:seed
   ```

---

## Important Notes

### Socket.IO on Vercel

- **Socket.IO does not work on Vercel** (serverless, no persistent connections)
- REST API (auth, SOS, lost-found, medical, QR, etc.) works normally
- For real-time SOS alerts, consider:
  - Polling from the app
  - A separate WebSocket service (e.g. Railway, Render)

### Deployment Protection

- If you see "Deployment protection" errors, go to **Vercel → Project → Settings → Deployment Protection**
- Disable "Vercel Authentication" for public API access, or add your app’s origin to allowed list

### CORS

- Set `CORS_ORIGIN` to your app’s URL in production
- For React Native, you may need `*` or your Expo/debug URL during testing

---

## Quick Checklist

- [ ] Backend pushed to GitHub
- [ ] Vercel project created with Root Directory = `server`
- [ ] `JWT_SECRET` and `DATABASE_URL` set in Vercel
- [ ] Database schema applied
- [ ] `client/src/config/api.js` → `USE_LOCAL_SERVER = false`
- [ ] Test `/api/health` on your Vercel URL

---

## Test Your Deployment

```bash
curl https://your-project.vercel.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Bharat Kumbh Backend API is running",
  "database": "connected",
  "platform": "Vercel"
}
```
