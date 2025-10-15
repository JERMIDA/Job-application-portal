import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

// filepath: c:\Users\jerem\Videos\debo-engineering-job-portal\backend\utils\emailService.js
const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: 465, // back to 465 for SSL
  secure: true, // true for 465
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false // Add this line to help with some TLS handshake issues
  }
});

const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail({
      from: `"DEBO Engineering" <${env.EMAIL_FROM}>`,
      ...mailOptions
    });
  } catch (error) {
    console.error('Email sending failed:', error.message); // Log the error message
    throw new Error('Failed to send email. Please check SMTP configuration.');
  }
};

export const sendApplicationNotification = async ({ user, job }) => {
  const mailOptions = {
    to: user.email,
    subject: `Application Received for ${job.title}`,
    html: `<p>Dear ${user.name},</p>
           <p>Your application for the position of <strong>${job.title}</strong> has been received. We will review your application and get back to you soon.</p>
           <p>Best regards,<br/>DEBO Engineering</p>`,
  };

  await sendEmail(mailOptions);
};

export const sendInternClassification = async (intern, newLevelName) => {
  const mailOptions = {
    to: intern.email,
    subject: `Congratulations on Your New Level: ${newLevelName}`,
    html: `<p>Dear ${intern.name},</p>
           <p>Congratulations! You have been promoted to the level of <strong>${newLevelName}</strong> in the DEBO Engineering program. Keep up the great work!</p>
           <p>Best regards,<br/>DEBO Engineering</p>`,
  };

  await sendEmail(mailOptions);
};

export const sendInterviewInvitation = async (user, job, interviewDetails) => {
  // Ensure interviewDetails is a string before calling replace
  let detailsString = '';
  if (typeof interviewDetails === 'string') {
    detailsString = interviewDetails;
  } else if (interviewDetails && typeof interviewDetails === 'object') {
    // Format object details into a readable string
    detailsString = Object.entries(interviewDetails)
      .filter(([key, value]) => key && value)
      .map(([key, value]) => `<b>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</b> ${value}`)
      .join('<br/>');
  }
  const mailOptions = {
    to: user.email,
    subject: `Interview Invitation for ${job.title}`,
    html: `<p>Dear ${user.name},</p>
           <p>You are invited for an interview for the position of <strong>${job.title}</strong>. Details are as follows:</p>
           <p>${detailsString.replace(/\n/g, '<br/>')}</p>
           <p>Best regards,<br/>DEBO Engineering</p>`,
  };

  await sendEmail(mailOptions);
};

export const sendFeedbackEmail = async (user, feedback) => {
  const mailOptions = {
    to: user.email,
    subject: 'Application Feedback',
    html: `<p>Dear ${user.name},</p>
           <p>${feedback.replace(/\n/g, '<br/>')}</p>
           <p>Best regards,<br/>DEBO Engineering</p>`,
  };

  await sendEmail(mailOptions);
};

export default sendEmail;