import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: 'jeremydamena98@gmail.com',
    pass: 'dknb zgfy vqtg xzuj'
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection failed:', error);
  } else {
    console.log('SMTP connection successful:', success);
  }
});