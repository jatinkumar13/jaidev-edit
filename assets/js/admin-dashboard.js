import { auth, db, storage } from "./firebase.js";
import { onAuthStateChanged, signOut } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection, addDoc, getDocs,
  deleteDoc, doc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

/* 🔐 Protect */
onAuthStateChanged(auth, user => {
  if (!user) location.href = "admin-login.html";
  document.getElementById("adminEmail").innerText = user.email;
  loadItems();
});

/* 🚪 Logout */
window.logout = () => signOut(auth).then(() => {
  location.href = "admin-login.html";
});

/* ⬆ Upload */
window.uploadItem = async () => {
  const title = title.value;
  const category = category.value;
  const thumbFile = thumbnailFile.files[0];
  const videoFile = videoFileEl.files[0];

  if (!title || !thumbFile) {
    alert("Title + Image required");
    return;
  }

  // Upload image
  const thumbRef = ref(storage, `thumbs/${Date.now()}_${thumbFile.name}`);
  await uploadBytes(thumbRef, thumbFile);
  const thumbnailURL = await getDownloadURL(thumbRef);

  // Upload video (optional)
  let videoURL = "";
  if (videoFile) {
    const videoRef = ref(storage, `videos/${Date.now()}_${videoFile.name}`);
    await uploadBytes(videoRef, videoFile);
    videoURL = await getDownloadURL(videoRef);
  }

  await addDoc(collection(db, "items"), {
    title,
    category,
    thumbnail: thumbnailURL,
    video: videoURL,
    featured: featured.checked,
    createdAt: serverTimestamp()
  });

  alert("Uploaded ✅");
  loadItems();
};

/* 📋 Load items */
async function loadItems() {
  const snap = await getDocs(collection(db, "items"));
  itemsList.innerHTML = "";
  stats.innerText = `Total items: ${snap.size}`;

  snap.forEach(d => {
    const i = d.data();
    itemsList.innerHTML += `
      <div class="item-row">
        <img src="${i.thumbnail}">
        <div>
          <b>${i.title}</b><br>
          ${i.video ? `<video src="${i.video}" controls></video>` : ""}
        </div>
        <button onclick="deleteItem('${d.id}')">🗑</button>
      </div>`;
  });
}

/* 🗑 Delete */
window.deleteItem = async id => {
  if (!confirm("Delete item?")) return;
  await deleteDoc(doc(db, "items", id));
  loadItems();
};
