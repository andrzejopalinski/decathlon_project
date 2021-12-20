import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { Database, getDatabase } from "firebase/database";
import React from "react";

const firebaseConfig = {
  apiKey: "AIzaSyAPneA---4KqN4ohafuiREKmJnTRzxNvds",

  authDomain: "decathlon-5b8d0.firebaseapp.com",

  databaseURL:
    "https://decathlon-5b8d0-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "decathlon-5b8d0",

  storageBucket: "decathlon-5b8d0.appspot.com",

  messagingSenderId: "46756431462",

  appId: "1:46756431462:web:a6191ecc05d9ed32c80fa7",

  measurementId: "G-Q5YL214MZW",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const auth = getAuth(app);
export default database;
