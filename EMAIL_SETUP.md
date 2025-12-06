# Email Setup Instructions

## Configuration Required

To enable email notifications, you need to set up email credentials.

### Step 1: Create a `.env` file

Create a file named `.env` in the root directory with the following content:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=3000
```

### Step 2: Gmail App Password Setup

Since we're using Gmail, you need to create an App Password:

1. Go to your Google Account: https://myaccount.google.com/
2. Enable **2-Step Verification** (if not already enabled)
3. Go to **Security** → **2-Step Verification** → **App passwords**
4. Generate a new App Password for "Mail"
5. Copy the 16-character password
6. Use this password as `EMAIL_PASS` in your `.env` file

**Important:** Use the App Password, NOT your regular Gmail password!

### Step 3: Install Dependencies

Run the following command to install required packages:

```bash
npm install
```

### Step 4: Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

## Email Recipient

All form submissions (Contact and Booking) will be sent to:
**aamirbhattido8@gmail.com**

## Testing

1. Fill out the contact form at `/contact.html`
2. Fill out the booking form at `/booking.html`
3. Check the email inbox at `aamirbhattido8@gmail.com`

## Troubleshooting

- If emails aren't sending, check the server console for error messages
- Make sure you're using an App Password, not your regular Gmail password
- Verify that 2-Step Verification is enabled on your Google Account
- Check that the `.env` file is in the root directory and has correct values

