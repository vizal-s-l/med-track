import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const messagingPromise = (async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
})();

export const requestFirebaseToken = async () => {
  const messaging = await messagingPromise;

  if (!messaging) {
    console.warn('Firebase messaging not supported in this browser');
    return null;
  }

  try {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported in this browser');
      return null;
    }

    const registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js')
      ?? await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    return token;
  } catch (error) {
    console.error('Error getting Firebase token', error);
    return null;
  }
};

export const subscribeToMessages = async (callback: (payload: any) => void) => {
  const messaging = await messagingPromise;

  if (!messaging) {
    console.warn('Messaging not available; skipping subscribe');
    return;
  }

  onMessage(messaging, callback);
};
