// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
const firebaseConfig = {
    apiKey: "AIzaSyDfbXBOcGjzqWEOwF0vzts_DdRbAkkiZU4",
    authDomain: "nail-war-app-2025.firebaseapp.com",
    projectId: "nail-war-app-2025",
    storageBucket: "nail-war-app-2025.firebasestorage.app",
    messagingSenderId: "994635612004",
    appId: "1:994635612004:web:0a0861c4eeec6dfe0a8471",
    measurementId: "G-12X9QHNRNQ"
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message ", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/images/logo.png", // Replace with your logo
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
