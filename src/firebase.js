// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // 1. Added Database import
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBHxNkZUl8Gh8bQE5PED-hh6qof5IPSwAc",
    authDomain: "operatingmedia-crm.firebaseapp.com",
    // 2. Added your specific Database URL from the previous screenshot
    databaseURL: "https://operatingmedia-crm-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "operatingmedia-crm",
    storageBucket: "operatingmedia-crm.firebasestorage.app",
    messagingSenderId: "392483122293",
    appId: "1:392483122293:web:4dc04088e1a040d03f5c3c",
    measurementId: "G-J58STCSVZB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 3. Initialize and EXPORT the database (Crucial for ChatSystem.jsx)
export const db = getDatabase(app);