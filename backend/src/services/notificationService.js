const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

let firebaseInitialized = false;

const initFirebase = () => {
  if (firebaseInitialized) {
    return;
  }

  const firebaseConfig = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : null;

  if (!firebaseConfig) {
    console.warn('Firebase service account not configured');
    return;
  }

  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });

  firebaseInitialized = true;
};

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('SendGrid API key not configured; email notifications disabled');
}

const notificationService = {
  sendReminderNotifications: async (tokens, intakes) => {
    initFirebase();

    if (!firebaseInitialized) {
      console.warn('Skipping push notifications; Firebase not initialized');
      return;
    }

    const messages = tokens.map((token) => ({
      token: token.token,
      notification: {
        title: 'Medicine Reminder',
        body: `You have ${intakes.length} scheduled intake(s) now`,
      },
      data: {
        intakeIds: intakes.map((i) => i.id).join(','),
      },
    }));

    await Promise.all(messages.map((message) => admin.messaging().send(message)));
  },

  sendThresholdEmail: async ({ to, subject, text }) => {
    if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_SENDER_EMAIL) {
      console.warn('SendGrid credentials missing; skipping email');
      return false;
    }

    try {
      await sgMail.send({
        to,
        from: process.env.SENDGRID_SENDER_EMAIL,
        subject,
        text,
      });
      return true;
    } catch (error) {
      console.error('Failed to send threshold email:', error);
      return false;
    }
  },
};

module.exports = {
  notificationService,
};
