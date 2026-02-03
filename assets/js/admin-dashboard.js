import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 🔐 Protect dashboard */
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "admin-login.html";
  } else {
    document.getElementById("adminEmail").innerText =
      "Logged in as: " + user.email;
  }
});

/* ➕ Add item */
window.addItem = async function () {
  const title = document.getElementById("title").value;
  const thumbnail = document.getElementById("thumbnail").value;
  const video = document.getElementById("video").value;
  const category = document.getElementById("category").value;
  const featured = document.getElementById("featured").checked;

  if (!title || !thumbnail || !video) {
    alert("All fields required ❌");
    return;
  }

  await addDoc(collection(db, "items"), {
    title,
    thumbnail,
    video,
    category,
    featured,
    createdAt: serverTimestamp()
  });

  alert("Data added ✅");

  document.getElementById("title").value = "";
  document.getElementById("thumbnail").value = "";
  document.getElementById("video").value = "";
  document.getElementById("featured").checked = false;
};

/* 🚪 Logout */
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "admin-login.html";
  });
};
