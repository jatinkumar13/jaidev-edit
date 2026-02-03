import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCcEzGdDs2HlG2G-mK1cSRZRldvsTF1XEI",
  authDomain: "jaidevedit.firebaseapp.com",
  projectId: "jaidevedit",
  storageBucket: "jaidevedit.appspot.com",
  messagingSenderId: "728216514466",
  appId: "1:728216514466:web:11604a54f726be80450cfb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
