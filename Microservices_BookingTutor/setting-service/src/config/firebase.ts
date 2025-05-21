import admin from "firebase-admin";

export function initializeFirebase() {
  console.log(
    "Service Account Path:",
    process.env.GOOGLE_APPLICATION_CREDENTIALS
  );

  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    console.log("Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    process.exit(1);
  }
}