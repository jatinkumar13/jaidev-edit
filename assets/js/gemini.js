import { db } from "./firebase.js";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const list = document.getElementById("geminiList");
const searchInput = document.getElementById("searchInput");

let allItems = [];

async function loadGemini() {
  list.innerHTML = "Loading...";

  const q = query(
    collection(db, "items"),
    where("category", "==", "Gemini"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  list.innerHTML = "";
  allItems = [];

  snapshot.forEach(doc => {
    allItems.push(doc.data());
  });

  renderItems(allItems);
}

function renderItems(items) {
  list.innerHTML = "";

  if (items.length === 0) {
    list.innerHTML = "No Gemini prompts found ❌";
    return;
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "video-card";

    card.innerHTML = `
      <div class="thumb">
        <img src="${item.thumbnail}" alt="${item.title}">
      </div>
      <h4>${item.title}</h4>
      ${item.featured ? `<span class="badge">🔥 Trending</span>` : ""}
      <button class="download-btn">📋 Copy Prompt</button>
    `;

    card.querySelector(".download-btn").onclick = () => {
      navigator.clipboard.writeText(item.video);
      alert("Prompt copied to clipboard ✅");
    };

    list.appendChild(card);
  });
}

// 🔍 Search
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = allItems.filter(item =>
    item.title.toLowerCase().includes(value)
  );
  renderItems(filtered);
});

loadGemini();