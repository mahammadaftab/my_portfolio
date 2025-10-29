const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  lines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    }
  });
}

// Make sure to set your Resend API key in the environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
  try {
    console.log('Testing Resend API connection...');
    
    if (!process.env.RESEND_API_KEY) {
      console.log('RESEND_API_KEY is not set in environment variables');
      return;
    }
    
    if (!process.env.CONTACT_EMAIL) {
      console.log('CONTACT_EMAIL is not set in environment variables');
      return;
    }
    
    console.log('Sending test email to:', process.env.CONTACT_EMAIL);
    
    const result = await resend.emails.send({
      from: process.env.CONTACT_EMAIL,
      to: process.env.CONTACT_EMAIL,
      subject: 'Test Email from Portfolio Contact Form',
      text: 'This is a test email to verify that the Resend API is working correctly.',
    });
    
    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Failed to send test email:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      body: error.body
    });
  }
}

testResend();