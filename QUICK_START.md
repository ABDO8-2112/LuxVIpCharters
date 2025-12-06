# 🚀 Quick Start Guide

## Step 1: Install Node.js

**You have 3 options:**

### Option A: Auto-Install (Requires Admin)
1. Right-click `install-nodejs.ps1`
2. Select "Run as Administrator"
3. Wait for installation to complete
4. Restart your terminal

### Option B: Manual Install (Recommended)
1. Go to: https://nodejs.org/
2. Download the **LTS version** (recommended)
3. Run the installer
4. Follow the installation wizard
5. Restart your terminal/PowerShell

### Option C: Use Batch File
1. Double-click `START_SERVER.bat`
2. It will check for Node.js and guide you if needed

## Step 2: Start the Server

After Node.js is installed:

1. **Double-click:** `START_SERVER.bat`
   
   OR

2. **Open terminal** in this folder and run:
   ```bash
   npm install
   npm start
   ```

## Step 3: Configure Email (Optional)

1. Edit the `.env` file
2. Add your Gmail credentials:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

   **To get Gmail App Password:**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification
   - Go to App passwords
   - Generate password for "Mail"
   - Use that 16-character password

## Step 4: Access Your Website

Open your browser and go to:
- **Homepage:** http://localhost:3000
- **Booking Form:** http://localhost:3000/booking.html
- **Contact Form:** http://localhost:3000/contact.html

## ✅ That's It!

The server is now running. Forms will send emails to: **aamirbhattido8@gmail.com**

---

## Need Help?

- Check `README_SERVER.md` for detailed instructions
- Make sure Node.js is installed: `node --version`
- Make sure server is running: Check terminal for "Server running at http://localhost:3000"

