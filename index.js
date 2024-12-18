const express = require('express');
const bodyParser = require('body-parser');
// const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
// const fs = require('fs');
const dotenv = require("dotenv");
const { log } = require('console');
const multer = require('multer');
dotenv.config()

const app = express();

// If need attachments
// const upload = multer({ dest: 'uploads/' }); 

const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.PASSWORD;
const FROM = process.env.FROM;
const TO = process.env.TO

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(multer().any())


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// upload.array('attachments', 10),  // add this into post req

app.post('/send-email', (req, res) => { // Allow up to 10 files
    const { name, to, message, subject } = req.body;

    console.log("subject post : ", req.body.subject)
    
    if (!name || !to || !message || !subject){
        console.log("Missing required fields in form data.")
        return res.status(400)
    }

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or use your email provider
        auth: {
            user: FROM,
            pass: PASSWORD
        }
    });

    // Setup email data with unicode symbols
    const mailOptions = {
        from: `${name} <${FROM}>`,
        to: TO,
        subject: subject,
        text: message,
        // attachments:files.map(file => ({
        //     filename: file.originalname,
        //     path: file.path
        // }))
    };

    // Send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("error : ", error)
            
            return res.status(500).send(error.toString());
        }
        // Delete the file after sending email
        // files.forEach(file => fs.unlinkSync(file.path));
        res.send('<script>alert("Email sent successfully!"); window.location.href = "/";</script>');
    });

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});