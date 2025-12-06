# How to Start the Server

## Quick Start (Easiest Method)

### Option 1: Double-click the batch file
1. Double-click `START_SERVER.bat`
2. If Node.js is not installed, it will open the download page
3. Install Node.js, then run `START_SERVER.bat` again

### Option 2: Use PowerShell script
1. Right-click `setup-and-run.ps1`
2. Select "Run with PowerShell"
3. Follow the prompts

### Option 3: Manual start
1. Open terminal in this folder
2. Run: `npm install` (first time only)
3. Run: `npm start`

## Requirements

- **Node.js** must be installed
  - Download from: https://nodejs.org/
  - Choose the LTS version
  - After installation, restart your terminal

## Email Configuration

1. Create a `.env` file in this folder (or edit the existing one)
2. Add your Gmail credentials:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   PORT=3000
   ```

3. **Gmail App Password Setup:**
   - Go to: https://myaccount.google.com/
   - Enable 2-Step Verification
   - Go to Security → App passwords
   - Generate password for "Mail"
   - Use that 16-character password (NOT your regular Gmail password)

## Access the Website

Once the server is running:
- Homepage: http://localhost:3000
- Booking Form: http://localhost:3000/booking.html
- Contact Form: http://localhost:3000/contact.html

## Troubleshooting

**"Node.js not found"**
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

**"Failed to fetch" error**
- Make sure the server is running
- Access pages through http://localhost:3000 (not file://)

**Email not sending**
- Check that `.env` file has correct credentials
- Verify you're using an App Password (not regular password)
- Check server console for error messages

