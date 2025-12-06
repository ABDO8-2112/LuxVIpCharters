require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware (allow requests from same origin)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Serve static files from the current directory
app.use(express.static(__dirname));

// Test endpoint to verify server is running
app.get('/api/test', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: 'Server is running!',
        timestamp: new Date().toISOString()
    });
});

// Configure Nodemailer
// For Gmail, you'll need to use an App Password: https://support.google.com/accounts/answer/185833
let transporter = null;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (emailUser && emailPass && emailUser !== 'your-email@gmail.com' && emailPass !== 'your-app-password') {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPass
        }
    });
    
    // Test the connection
    transporter.verify(function(error, success) {
        if (error) {
            console.error('❌ Email service configuration error:', error.message);
            console.error('   Make sure you are using a Gmail App Password, not your regular password');
            console.error('   Get App Password: https://myaccount.google.com/apppasswords');
        } else {
            console.log('✅ Email service configured and verified');
            console.log('   Sending emails to: aamirbhattido8@gmail.com');
        }
    });
} else {
    console.warn('⚠️  Email credentials not configured. Emails will not be sent.');
    console.warn('   Please set EMAIL_USER and EMAIL_PASS in .env file');
}

// API Endpoint for Contact Form
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: 'aamirbhattido8@gmail.com',
            subject: `Contact Form: ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><em>This email was sent from the Lux VIP Charters contact form.</em></p>
            `
        };

        // Send email if transporter is configured
        if (transporter) {
            try {
                const info = await transporter.sendMail(mailOptions);
                console.log('✅ Contact email sent successfully');
                console.log('   Message ID:', info.messageId);
            } catch (emailError) {
                console.error('❌ Failed to send contact email:', emailError.message);
                console.error('   Error details:', emailError);
                // Still return success to user, but log the error
            }
        } else {
            console.log('📧 Contact form submission (email not sent - credentials not configured):', { name, email, subject });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Your message has been sent successfully!' 
        });
    } catch (error) {
        console.error('❌ Error processing contact form:', error);
        res.status(500).json({ 
            success: false, 
            message: `Failed to send message: ${error.message}` 
        });
    }
});

// API Endpoint for Booking Form
app.post('/api/booking', async (req, res) => {
    try {
        const { 
            name, 
            email, 
            phone, 
            date, 
            time, 
            service, 
            vehicle, 
            passengers, 
            luggage, 
            'return-trip': returnTrip, 
            'return-date': returnDate, 
            'return-time': returnTime, 
            message 
        } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !date || !time || !service || !vehicle || !passengers || !luggage) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please fill in all required fields' 
            });
        }

        // Format return journey info
        let returnJourneyInfo = 'No';
        if (returnTrip === 'on' || returnTrip === true) {
            returnJourneyInfo = `Yes<br>
                <strong>Return Date:</strong> ${returnDate || 'Not specified'}<br>
                <strong>Return Time:</strong> ${returnTime || 'Not specified'}`;
        }

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: 'aamirbhattido8@gmail.com',
            subject: `New Booking Request: ${service} - ${name}`,
            html: `
                <h2>New Booking Request</h2>
                <h3>Customer Information</h3>
                <p><strong>Full Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone Number:</strong> ${phone}</p>
                
                <h3>Booking Details</h3>
                <p><strong>Service Type:</strong> ${service}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Vehicle Type:</strong> ${vehicle}</p>
                <p><strong>Number of Passengers:</strong> ${passengers}</p>
                <p><strong>Luggage Count:</strong> ${luggage}</p>
                <p><strong>Return Journey:</strong> ${returnJourneyInfo}</p>
                
                ${message ? `<h3>Additional Details</h3><p>${message.replace(/\n/g, '<br>')}</p>` : ''}
                
                <hr>
                <p><em>This booking request was submitted from the Lux VIP Charters booking form.</em></p>
                <p><em>Submitted on: ${new Date().toLocaleString()}</em></p>
            `
        };

        // Send email if transporter is configured
        if (transporter) {
            try {
                const info = await transporter.sendMail(mailOptions);
                console.log('✅ Booking email sent successfully');
                console.log('   Message ID:', info.messageId);
                console.log('   To: aamirbhattido8@gmail.com');
            } catch (emailError) {
                console.error('❌ Failed to send booking email:', emailError.message);
                console.error('   Error details:', emailError);
                // Still return success to user, but log the error
            }
        } else {
            console.log('📧 Booking request received (email not sent - credentials not configured):', { 
                name, 
                email, 
                service, 
                vehicle,
                date,
                time
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Your booking request has been submitted successfully! We will contact you shortly to confirm your reservation.' 
        });
    } catch (error) {
        console.error('❌ Error processing booking form:', error);
        console.error('Error details:', error.stack);
        res.status(500).json({ 
            success: false, 
            message: `Failed to submit booking request: ${error.message}` 
        });
    }
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`\n🚀 Server running at http://localhost:${port}`);
    console.log('📧 Email notifications will be sent to: aamirbhattido8@gmail.com');
    console.log('📝 API Endpoints:');
    console.log('   POST /api/contact - Contact form submissions');
    console.log('   POST /api/booking - Booking form submissions\n');
});
