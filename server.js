const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const app = express();
const port = 3000;

// Get local IP address
const { networkInterfaces } = require('os');
const nets = networkInterfaces();
const localIP = Object.values(nets)
    .flat()
    .filter(item => !item.internal && item.family === 'IPv4')
    [0].address;

// Twilio Configuration
const twilioClient = twilio(
    'AC905534ff99d346039e209ba729728a1a',
     '9193e58363b05b477723ac3cc84f5bee'
);

app.use(express.static('.'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle contact form submissions
app.post('/contact', async (req, res) => {
    const { name, email, phone, city } = req.body;
    
    try {
        const message = await twilioClient.messages.create({
            body: `New Gym Inquiry:
Name: ${name}
Email: ${email}
Phone: ${phone}
City: ${city}`,
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+919080700642'
        });
        
        console.log('Message sent successfully:', message.sid);
        res.json({ success: true });
    } catch (error) {
        console.error('Twilio Error:', error.message);
        console.error('Error Code:', error.code);
        console.error('More Info:', error.moreInfo);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Listen on all network interfaces
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at:`);
    console.log(`- http://localhost:${port}`);
    console.log(`- http://${localIP}:${port}`);
});