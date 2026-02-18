function initUserAuth() {

  const loginTab      = document.getElementById('loginTab');
  const signupTab     = document.getElementById('signupTab');
  const loginForm     = document.getElementById('loginForm');
  const signupForm    = document.getElementById('signupForm');
  const loginMessage  = document.getElementById('loginMessage');
  const signupMessage = document.getElementById('signupMessage');
  const logoutBtn     = document.getElementById('logoutBtn');
  const container     = document.querySelector('.container');

  if (!loginTab || !signupTab) return;

  /* SWITCH FORM */
  loginTab.onclick = () => {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    clearMessages();
  };

  signupTab.onclick = () => {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
    clearMessages();
  };

  /* ===== LOGIN ===== */
loginForm.addEventListener('submit', async e => {
  e.preventDefault();

  try {

    const identifier = loginUsername.value.trim();
    const password   = loginPassword.value.trim();

    showMessage(loginMessage, "Connexion...", "info");

    const snap = await firebase.database().ref("RJFORDROID/USERS").once("value");
    const users = snap.val() || {};

    let uid = null;

    for (const k in users) {
      const u = users[k];
      if ((u.username === identifier || u.email === identifier) && u.password === password) {
        uid = k;
        break;
      }
    }

    if (!uid) {
      showMessage(loginMessage, "Identifiants incorrects", "error");
      return;
    }

    localStorage.setItem("connectedUID", uid);

    if (typeof loadUserInSidebar === "function") {
      await loadUserInSidebar();
    }

    showMessage(loginMessage, "Connexion réussie", "success");

    redirectUser();

  } catch (err) {
    console.error(err);
    showMessage(loginMessage, "Erreur serveur", "error");
  }

});

  /* ===== SIGNUP ===== */
  signupForm.addEventListener('submit', async e => {
    e.preventDefault();

    if (password.value !== confirmPassword.value) {
      showMessage(signupMessage, "Mots de passe différents", "error");
      return;
    }

    const ref = firebase.database().ref("RJFORDROID/USERS");
    const snap = await ref.once("value");
    const users = snap.val() || {};

    for (const k in users) {
      if (users[k].username === username.value || users[k].email === email.value) {
        showMessage(signupMessage, "Utilisateur existant", "error");
        return;
      }
    }

   const newRef = ref.push();

await newRef.set({
  fullName: fullName.value,
  username: username.value,
  email: email.value,
  phone: phone.value,
  password: password.value,
  credits: 10,
  isAdmin: false,
  createdAt: Date.now()
});

localStorage.setItem("connectedUID", newRef.key);

if (typeof loadUserInSidebar === "function") {
  await loadUserInSidebar();
}

showMessage(signupMessage, "Compte créé avec succès", "success");

setTimeout(() => {
  redirectUser();
}, 1500);
  });

  /* ===== LOGOUT ===== */
  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem("connectedUID");
    localStorage.removeItem("redirectAfterLogin");
    window.location.href = "index.html";
  });

}


/* ===== REDIRECTION INTELLIGENTE ===== */
function redirectUser() {

  const redirectPage = localStorage.getItem("redirectAfterLogin");

  if (redirectPage && !redirectPage.includes("login")) {
    localStorage.removeItem("redirectAfterLogin");
    window.location.href = redirectPage;
  } else {
    window.location.href = "index.html";
  }
}


/* ===== UTILS ===== */
function clearMessages() {
  document.getElementById("loginMessage").style.display = "none";
  document.getElementById("signupMessage").style.display = "none";
}

function showMessage(el, msg, type) {
  el.textContent = msg;
  el.className = `message ${type}`;
  el.style.display = "block";
}

document.addEventListener("DOMContentLoaded", initUserAuth);