import { auth, db, storage, ADMINS } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  addDoc, collection, getDocs,
  deleteDoc, doc, updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

let editId = null;

/* 🔐 Auth check */
onAuthStateChanged(auth, user => {
  if (!user || !ADMINS.includes(user.email)) {
    location.href = "admin-login.html";
  } else {
    loadItems();
  }
});

/* 📊 Load items */
async function loadItems() {
  const box = itemsList;
  box.innerHTML = "";
  const snap = await getDocs(collection(db, "items"));
  totalItems.innerText = snap.size;

  snap.forEach(d => {
    const i = d.data();
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${i.thumbnail}">
      <b>${i.title}</b> (${i.category})
      <video src="${i.video}" muted loop></video>
      <button onclick="editItem('${d.id}', '${i.title}', '${i.thumbnail}', '${i.video}', '${i.category}', ${i.featured})">✏️</button>
      <button onclick="deleteItem('${d.id}')">❌</button>
    `;
    box.appendChild(div);
  });
}

/* ➕ Save */
saveBtn.onclick = async () => {
  const file = imageFile.files[0];
  let imgURL = "";

  if (file) {
    const r = ref(storage, "images/" + Date.now());
    await uploadBytes(r, file);
    imgURL = await getDownloadURL(r);
  }

  if (editId) {
    await updateDoc(doc(db, "items", editId), {
      title: title.value,
      video: video.value,
      category: category.value,
      featured: featured.checked,
      ...(imgURL && { thumbnail: imgURL })
    });
    editId = null;
  } else {
    await addDoc(collection(db, "items"), {
      title: title.value,
      thumbnail: imgURL,
      video: video.value,
      category: category.value,
      featured: featured.checked,
      createdAt: serverTimestamp()
    });
  }

  title.value = video.value = "";
  imageFile.value = "";
  featured.checked = false;
  loadItems();
};

/* ❌ Delete */
window.deleteItem = async id => {
  if (confirm("Delete?")) {
    await deleteDoc(doc(db, "items", id));
    loadItems();
  }
};

/* ✏️ Edit */
window.editItem = (id, t, th, v, c, f) => {
  editId = id;
  title.value = t;
  video.value = v;
  category.value = c;
  featured.checked = f;
};

/* 🚪 Logout */
logoutBtn.onclick = () => signOut(auth);
