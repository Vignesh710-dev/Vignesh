const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Create email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vigneshpk710@gmail.com', // Your Gmail address
        pass: 'czdi jcuf ibmx lxvd' // Gmail app-specific password
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const { name, phone, email, city } = req.body;
        console.log('Received form data:', { name, phone, email, city });

        // Email content
        const mailOptions = {
            from: 'vigneshpk710@gmail.com',
            to: 'vigneshvcoder@gmail.com', // Your email where you want to receive notifications
            subject: 'New Gym Registration',
            text: `
                New Registration Details:
                
                Name: ${name}
                Email: ${email}
                Phone: ${phone}
                City: ${city}
                
                Time: ${new Date().toLocaleString()}
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Email notification sent');

        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to process registration'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});