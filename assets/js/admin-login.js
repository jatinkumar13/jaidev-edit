import { auth, ADMINS } from "./firebase.js";
import { signInWithEmailAndPassword }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.getElementById("loginBtn").onclick = async () => {
  const email = email.value.trim();
  const password = password.value.trim();

  if (!ADMINS.includes(email)) {
    error.innerText = "Not an admin ❌";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    location.href = "admin-dashboard.html";
  } catch (e) {
    error.innerText = e.message;
  }
};
