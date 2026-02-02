import { db } from "./firebase.js";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const trendingBox = document.getElementById("trendingBox");

async function loadTrending() {
  trendingBox.innerHTML = "Loading...";

  const q = query(
    collection(db, "items"),
    where("featured", "==", true),
    orderBy("createdAt", "desc"),
    limit(6)
  );

  const snapshot = await getDocs(q);
  trendingBox.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();

    const card = document.createElement("div");
    card.className = "trend-card";

    card.innerHTML = `
      <img src="${data.thumbnail}" alt="${data.title}">
      <h4>${data.title}</h4>
      <span class="badge">${data.category}</span>
    `;

    // category page open kare
    card.onclick = () => {
      window.location.href = data.category.toLowerCase() + ".html";
    };

    trendingBox.appendChild(card);
  });
}

loadTrending();