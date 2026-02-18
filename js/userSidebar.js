async function loadUserInSidebar() {

  const uid = localStorage.getItem("connectedUID");
  if (!uid) return;

  const snap = await firebase.database()
    .ref(`RJFORDROID/USERS/${uid}`)
    .once("value");

  const user = snap.val();
  if (!user) return;

  console.log(user);

  const nameEl      = document.getElementById("name");
  const usernameEl  = document.getElementById("username");
  const phoneEl     = document.getElementById("phone");
  const creditEl    = document.getElementById("credits");
  const emailEl     = document.getElementById("emailUser");
  const adminBtn    = document.getElementById("adminPanelBtn");
  const createdEl = document.getElementById("createdAt");

  nameEl.textContent     = user.fullName || "";
  usernameEl.textContent = user.username || "";
  emailEl.textContent    = user.email || "";
  phoneEl.textContent    = user.phone || "";
  creditEl.textContent   = user.credits ?? 0;
  
if (user.createdAt) {
  const date = new Date(user.createdAt);

  const formattedDate = date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  createdEl.textContent = "Inscrit le " + formattedDate;
}

  // 🔥 Vérification Admin
   if (user.isAdmin === true) {
  adminBtn.classList.remove("hidden");
}
}

window.addEventListener("load", loadUserInSidebar);