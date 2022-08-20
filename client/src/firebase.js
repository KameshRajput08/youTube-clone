import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCKg4-bhtMiO-sjRi-pIlgnjsoTCnnLt-w",
  authDomain: "ytclone-dcb54.firebaseapp.com",
  projectId: "ytclone-dcb54",
  storageBucket: "ytclone-dcb54.appspot.com",
  messagingSenderId: "33456252464",
  appId: "1:33456252464:web:0519f85af57a60a60beff5",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();

export const provider = new GoogleAuthProvider();

export default app;
