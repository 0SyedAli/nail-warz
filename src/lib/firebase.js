// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDfbXBOcGjzqWEOwF0vzts_DdRbAkkiZU4",
    authDomain: "nail-war-app-2025.firebaseapp.com",
    projectId: "nail-war-app-2025",
    storageBucket: "nail-war-app-2025.firebasestorage.app",
    messagingSenderId: "994635612004",
    appId: "1:994635612004:web:0a0861c4eeec6dfe0a8471",
    measurementId: "G-12X9QHNRNQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics (conditionally initialize as it might not be supported in some environments/browsers)
export const analytics = typeof window !== "undefined" ? isAnalyticsSupported().then(yes => yes ? getAnalytics(app) : null) : null;

// Initialize Messaging
export const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

// Function to request notification permission and get the FCM token
export const requestForToken = async () => {
    if (typeof window === "undefined" || !messaging) return null;

    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            const currentToken = await getToken(messaging, {
                vapidKey: "BOqU_LNzEJtcz1QqrdJDifLW0EFodHUVNrE9KQXBYmTGh-5hbNCCzSuzf4la3PM4VWq_m1G0_JAZBJr_T6fGOpU" // Replace with your actual VAPID key
            });
            if (currentToken) {
                return currentToken;
            } else {
                console.log("No registration token available. Request permission to generate one.");
            }
        } else {
            console.log("Notification permission denied");
        }
    } catch (err) {
        console.log("An error occurred while retrieving token. ", err);
    }
    return null;
};

// Listen for messages when the app is in the foreground
export const onMessageListener = () =>
    new Promise((resolve) => {
        if (!messaging) return;
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });

export default app;
