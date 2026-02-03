import { db } from "./firebase.js";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const list = document.getElementById("capcutList");
const searchInput = document.getElementById("searchInput");

let allItems = [];

/* 🔥 Load CapCut items */
async function loadCapCut() {
  list.innerHTML = "Loading...";

  const q = query(
    collection(db, "items"),
    where("category", "==", "CapCut"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  list.innerHTML = "";
  allItems = [];

  snap.forEach(doc => {
    allItems.push(doc.data());
  });

  renderItems(allItems);
}

/* 🎬 Render cards with VIDEO preview */
function renderItems(items) {
  list.innerHTML = "";

  if (items.length === 0) {
    list.innerHTML = "No CapCut templates found ❌";
    return;
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "video-card";

    card.innerHTML = `
      <video
        src="${item.video}"
        muted
        loop
        preload="metadata"
      ></video>

      <h4>${item.title}</h4>

      ${item.featured ? `<span class="badge">🔥 Trending</span>` : ""}

      <button class="download-btn">⬇ Use Template</button>
    `;

    const video = card.querySelector("video");

    /* ▶ Play / Pause on tap */
    card.onclick = () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    };

    /* ⬇ Open CapCut template link */
    card.querySelector(".download-btn").onclick = (e) => {
      e.stopPropagation();
      window.open(item.video, "_blank");
    };

    list.appendChild(card);
  });
}

/* 🔍 Search */
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = allItems.filter(item =>
    item.title.toLowerCase().includes(value)
  );
  renderItems(filtered);
});

loadCapCut();
