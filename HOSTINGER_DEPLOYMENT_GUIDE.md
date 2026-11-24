# 🚀 Hostinger Deployment Guide for VGM Skill Hub

This project is a full-stack application consisting of:
1. **Frontend:** React 19 + Tailwind CSS + Vite (pre-built in `dist/`)
2. **Backend API:** Node.js Express server with live Course DB & Student Portal (pre-bundled in `server.js`)
3. **Database:** JSON database in `data/db.json`
4. **Apache Rewrite Rules:** Pre-configured `.htaccess` for smooth SPA routing without 404 errors.

---

## 📁 Package Contents for Hostinger
When you upload the project, you need the following files:
```text
├── dist/                     <-- Built Frontend & Assets (with .htaccess)
│   ├── assets/
│   ├── .htaccess             <-- Apache/OpenLiteSpeed SPA rewrite rules
│   ├── index.html
│   ├── robots.txt
│   └── sitemap.xml
├── data/
│   └── db.json               <-- Courses, Enrolments & Coupons DB
├── server.js                 <-- Production Node.js Server (standalone)
├── package.json              <-- Dependencies & start script
└── .env                      <-- Your environment variables & secrets
```

---

## Option 1: Hostinger Cloud / Business Hosting (Recommended — Node.js in hPanel)
Most Hostinger Business and Cloud hosting plans include the **Node.js Application Manager** in hPanel.

### Step 1: Upload Files
1. Log in to **Hostinger hPanel**.
2. Go to **Files** → **File Manager** (or connect via FTP / FileZilla).
3. Open your domain's folder (e.g. `public_html` or create a directory like `vgm-app`).
4. Upload:
   - `dist/` folder
   - `data/` folder
   - `server.js`
   - `package.json`
   - `.env` (create this using `.env.example` with your Razorpay keys and `ADMIN_PASSWORD`)

### Step 2: Configure Node.js in hPanel
1. In hPanel, search for **Node.js** or go to **Advanced** → **Node.js**.
2. Click **Create Application**:
   - **Node.js version:** Select `20.x` (or `18.x`)
   - **Application mode:** `Production`
   - **Application root:** `public_html` (or your folder name)
   - **Application startup file:** `server.js`
3. Click **Create**.
4. Under **npm Actions**, click **Run NPM Install** (or install packages via SSH: `npm install --omit=dev`).
5. Click **Restart Application**.

✅ Your full-stack website is now live with both backend APIs, student portal, and course management active!

---

## Option 2: Hostinger VPS (Ubuntu / Debian + PM2)
If you are using Hostinger VPS:

1. Connect to your VPS via SSH:
   ```bash
   ssh root@your-vps-ip
   ```
2. Navigate to your app directory:
   ```bash
   mkdir -p /var/www/vgm-skill-hub && cd /var/www/vgm-skill-hub
   ```
3. Upload or clone the project and install production dependencies:
   ```bash
   npm install --omit=dev
   ```
4. Start the server using PM2 (for auto-restart on reboot):
   ```bash
   npm install -g pm2
   pm2 start server.js --name "vgm-hub"
   pm2 save
   pm2 startup
   ```
5. Configure Nginx Reverse Proxy (`/etc/nginx/sites-available/default`):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
6. Test & reload Nginx:
   ```bash
   nginx -t && systemctl reload nginx
   ```
7. Enable free SSL with Certbot:
   ```bash
   certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

---

## Option 3: Hostinger Web Hosting (Static Frontend Only in `public_html`)
If your Hostinger plan is a basic shared hosting plan without Node.js support:

1. Open **hPanel** → **File Manager** → `public_html`.
2. Upload the **contents inside the `dist/` directory** directly into `public_html`:
   - `assets/` folder
   - `index.html`
   - `.htaccess`
   - `robots.txt`
   - `sitemap.xml`
3. The `.htaccess` will automatically ensure direct URL visits to `/courses`, `/portal`, `/placements`, and `/admin` don't produce 404 errors.

---

## ⚙️ Environment Variables (`.env`) Checklist
Ensure your `.env` contains:
```env
PORT=3000
NODE_ENV=production
ADMIN_PASSWORD=vgm_admin_2026
RAZORPAY_KEY_ID=your_live_or_test_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
APP_URL=https://yourdomain.com
```

---

## 🔍 Verification After Deployment
After deployment, verify the following pages on your live domain:
- `https://yourdomain.com/` — Homepage
- `https://yourdomain.com/courses` — Dynamic Courses Directory
- `https://yourdomain.com/portal` — Student Learning & Submission Portal
- `https://yourdomain.com/admin` — Staff Admin Console (Default password: `vgm_admin_2026`)
- `https://yourdomain.com/enrol` — Fast-track Enrolment Form
- `https://yourdomain.com/verify-certificate` — Certificate Verification Registry

