const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// API Endpoint for Contact Form
app.post('/api/contact', (req, res) => {
    const { name, phone, email, service, date, message } = req.body;

    // In a real application, you would send an email here using Nodemailer or similar
    // For now, we'll log the data to the console
    console.log('--- New Booking Request ---');
    console.log(`Name: ${name}`);
    console.log(`Phone: ${phone}`);
    console.log(`Email: ${email}`);
    console.log(`Service: ${service}`);
    console.log(`Date: ${date}`);
    console.log(`Message: ${message}`);
    console.log('---------------------------');

    // Send a success response
    res.status(200).json({ message: 'Booking request received successfully!' });
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
