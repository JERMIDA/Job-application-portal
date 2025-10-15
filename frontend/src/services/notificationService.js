import api from './api';

export const sendApplicationNotification = async (applicationId, message) => {
  if (!applicationId || !message) {
    console.error('Invalid parameters for sendApplicationNotification:', { applicationId, message });
    throw new Error('Application ID and message are required');
  }
  try {
    await api.post('/notifications', {
      applicationId,
      message,
      type: 'application-update',
    });
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};

export const sendInterviewInvitation = async (applicationId, interviewDetails) => {
  if (!applicationId || !interviewDetails) {
    console.error('Invalid parameters for sendInterviewInvitation:', { applicationId, interviewDetails });
    throw new Error('Application ID and interview details are required');
  }
  try {
    await api.post('/notifications', {
      applicationId,
      type: 'interview-invite',
      details: interviewDetails,
    });
  } catch (error) {
    console.error('Failed to send interview invitation:', error);
  }
};

const sendNotification = async (email, subject, body) => {
  try {
    await api.post('/notifications/send', { email, subject, body });
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};

export default sendNotification;