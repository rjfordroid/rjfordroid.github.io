/* ==========================================================
   KÒD OU A (PA GEN CHANJMAN NAN LOJIK)
   ========================================================== */

function checkDevice() {
    const isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const screenWidth = window.innerWidth;
    const content = document.getElementById('app-content');
    const blocker = document.getElementById('desktop-blocker');
    if (content && blocker) {
        if (!isMobileOrTablet || screenWidth > 1024) {
            content.style.display = 'none';
            blocker.style.display = 'flex';
        } else {
            content.style.display = 'block';
            blocker.style.display = 'none';
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    injectBlocker();
    injectHeader();
    injectSidebar();
    injectFooter();
    injectAuthPopup(); // N ap ajoute popup la sèlman
    if (typeof setupSidebarEvents === "function") {
        setupSidebarEvents();
    }
});

function injectBlocker() {
    if (document.getElementById('desktop-blocker')) return;
    const blockerHTML = `<div id="desktop-blocker"><i class="fas fa-mobile-alt"></i><h1>Sèvis Mobil Sèlman</h1><p>RJ4DROID fèt espesyalman pou telefòn ak tablèt Android.</p></div>`;
    document.body.insertAdjacentHTML('afterbegin', blockerHTML);
}

function injectHeader() {
    const appContent = document.getElementById('app-content');
    if (!appContent || document.querySelector('.app-header')) return;
    const pageTitle = document.title.split('-')[0].trim();
    const headerHTML = `<header class="app-header"><button id="menuToggle" class="header-btn"><i class="fas fa-bars"></i></button><h1 style="flex-grow: 1; text-align: center; font-size: 18px;">${pageTitle}</h1><div style="width: 22px;"></div></header>`;
    appContent.insertAdjacentHTML('afterbegin', headerHTML);
}

function injectSidebar() {
    if (document.getElementById('sidebar')) return;
    const isConnected = !!localStorage.getItem("connectedUID");
    
    // NOUVO: Nou modifye bouton yo anndan Sidebar la selon si moun nan konekte
    const authBtn = isConnected 
        ? `<button id="logoutBtn" style="width: 100%; padding: 10px; background: #ff4444; color: white; border: none; border-radius: 5px; cursor: pointer;">Déconnexion</button>`
        : `<button onclick="openAuthPopup('login')" style="width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; margin-bottom:10px;">Connexion</button>
           <button onclick="openAuthPopup('signup')" style="width: 100%; padding: 10px; background: #ff6600; color: white; border: none; border-radius: 5px; cursor: pointer;">S'inscrire</button>`;

    const sidebarHTML = `
        <div id="overlay"></div>
        <div id="sidebar">
          <button id="closeSidebar">&times;</button>
          <div class="sidebar-profile">
            <h3 id="profileName" class="side-name">Visiteur</h3>
            <p id="emailUser" class="side-email" style="font-size: 14px; color: gray;">non connecté</p>
            <p>Crédits: <strong id="credits" class="side-credits">0</strong></p>
          </div>
          <div class="sidebar-links">
            <a href="index.html">Accueil</a>
            <a href="about.html">À propos</a>
            <a href="contact.html">Contact</a>
            <a href="politique.html">Politique</a>
            <a href="adm.html" id="adminPanelBtn" class="hidden">⚙️ Panel Admin</a>
          </div>
          <div style="margin-top: auto; padding-top: 20px;">
            ${authBtn}
          </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', sidebarHTML);
}

function injectFooter() {
    const appContent = document.getElementById('app-content');
    if (!appContent || document.querySelector('.bottom-nav')) return;
    const currentPath = window.location.pathname;
    const footerHTML = `<nav class="bottom-nav"><a href="index.html" class="nav-item ${currentPath.includes('index') ? 'active' : ''}"><i class="fas fa-home"></i>Accueil</a><a href="actus.html" class="nav-item ${currentPath.includes('actus') ? 'active' : ''}"><i class="fas fa-newspaper"></i>Actus</a><a href="profile.html" class="nav-item ${currentPath.includes('profile') ? 'active' : ''}"><i class="fas fa-user"></i>Profil</a><a href="contact.html" class="nav-item ${currentPath.includes('contact') ? 'active' : ''}"><i class="fas fa-envelope"></i>Contact</a></nav>`;
    appContent.insertAdjacentHTML('beforeend', footerHTML);
}

/* ==========================================================
   NOUVO: PATI USER POPUP (SÈLMAN SA N AP AJOUTE)
   ========================================================== */

function injectAuthPopup() {
    if (document.getElementById('authPopupOverlay')) return;
    const popupHTML = `
    <style>
        #authPopupOverlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); display: none; justify-content: center; align-items: center; z-index: 10000; }
        .auth-container { width: 90%; max-width: 400px; background: #1c1c1c; border-radius: 15px; padding: 25px; color: white; position: relative; border: 1px solid #333; }
        .close-popup { position: absolute; top: 10px; right: 15px; font-size: 25px; color: #666; cursor: pointer; background: none; border: none; }
        .auth-tabs { display: flex; margin-bottom: 20px; background: #222; border-radius: 8px; overflow: hidden; }
        .auth-tabs div { flex: 1; text-align: center; padding: 12px; cursor: pointer; color: #aaa; }
        .auth-tabs div.active { background: #ff6600; color: white; }
        .auth-form { display: none; flex-direction: column; }
        .auth-form.active { display: flex; }
        .auth-form input { background: #252525; border: 1px solid #333; padding: 12px; margin-bottom: 12px; border-radius: 8px; color: white; }
        .auth-form button { padding: 12px; background: #ff6600; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
        .auth-msg { display: none; padding: 10px; margin-top: 10px; border-radius: 5px; font-size: 13px; }
    </style>
    <div id="authPopupOverlay">
        <div class="auth-container">
            <button class="close-popup" onclick="closeAuthPopup()">&times;</button>
            <h2 style="text-align:center; margin-bottom:15px; color:#ff6600;">RJ4Droid</h2>
            <div class="auth-tabs">
                <div id="tabL" class="active" onclick="switchTab('login')">Login</div>
                <div id="tabS" onclick="switchTab('signup')">Signup</div>
            </div>
            <form id="loginForm" class="auth-form active">
                <input type="text" id="loginUsername" placeholder="Username ou Email" required>
                <input type="password" id="loginPassword" placeholder="Mot de passe" required>
                <button type="submit">Se connecter</button>
                <div id="loginMessage" class="auth-msg"></div>
            </form>
            <form id="signupForm" class="auth-form">
                <input type="text" id="fullName" placeholder="Nom complet" required>
                <input type="text" id="username" placeholder="Username" required>
                <input type="email" id="email" placeholder="Email" required>
                <input type="password" id="password" placeholder="Mot de passe" required>
                <input type="password" id="confirmPassword" placeholder="Confirmer" required>
                <button type="submit">Créer compte</button>
                <div id="signupMessage" class="auth-msg"></div>
            </form>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
}

window.openAuthPopup = function(mode) {
    document.getElementById('authPopupOverlay').style.display = 'flex';
    switchTab(mode);
    // Fèmen sidebar si l louvri
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("overlay").classList.remove("active");
};

window.closeAuthPopup = function() {
    document.getElementById('authPopupOverlay').style.display = 'none';
};

window.switchTab = function(mode) {
    const isLogin = mode === 'login';
    document.getElementById('tabL').classList.toggle('active', isLogin);
    document.getElementById('tabS').classList.toggle('active', !isLogin);
    document.getElementById('loginForm').classList.toggle('active', isLogin);
    document.getElementById('signupForm').classList.toggle('active', !isLogin);
};

/* ==========================================================
   RETE PATI FIREBASE YO (PA GEN CHANJMAN)
   ========================================================== */

const firebaseConfig = { apiKey: "AIzaSyAQeHWr_vUiQmVVgJJ_cOF9qrCCLd7IJNc", authDomain: "ayiweb.firebaseapp.com", databaseURL: "https://ayiweb-default-rtdb.firebaseio.com", projectId: "ayiweb", storageBucket: "ayiweb.appspot.com", messagingSenderId: "115054504556", appId: "1:115054504556:web:ccd713ba01dd8f02830649" };
if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const database = firebase.database();

document.addEventListener('DOMContentLoaded', async () => {
  checkDevice();
  setupSidebarEvents(); 
  highlightCurrentPage();
  await loadUserData();
  setupOtherEvents();
  setupContactFirebase();
});

function setupSidebarEvents() {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const closeSidebar = document.getElementById("closeSidebar");
  const overlay = document.getElementById("overlay");
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => { sidebar.classList.add("open"); overlay.classList.add("active"); });
  }
  const closeFunc = () => { sidebar.classList.remove("open"); overlay.classList.remove("active"); };
  if (closeSidebar) closeSidebar.addEventListener("click", closeFunc);
  if (overlay) overlay.addEventListener("click", closeFunc);
}

async function loadUserData() {
  const uid = localStorage.getItem("connectedUID");
  if (!uid) return;
  try {
    const snap = await database.ref(`RJFORDROID/USERS/${uid}`).once("value");
    const user = snap.val();
    if (!user) return;
    if(document.getElementById("profileName")) document.getElementById("profileName").textContent = user.fullName || "Utilisateur";
    if(document.getElementById("emailUser")) document.getElementById("emailUser").textContent = user.email || "";
    if(document.getElementById("credits")) document.getElementById("credits").textContent = user.credits ?? 0;
    const sideName = document.querySelector(".side-name");
    const sideEmail = document.querySelector(".side-email");
    const sideCredits = document.querySelector(".side-credits");
    if(sideName) sideName.textContent = user.fullName || "Utilisateur";
    if(sideEmail) sideEmail.textContent = user.email || "";
    if(sideCredits) sideCredits.textContent = user.credits ?? 0;
    if (user.isAdmin === true && document.getElementById("adminPanelBtn")) {
        document.getElementById("adminPanelBtn").classList.remove("hidden");
    }
  } catch (error) { console.error("Erreur Firebase:", error); }
}

function setupOtherEvents() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
        localStorage.removeItem("connectedUID");
        window.location.reload(); // Rafrechi pou mete sidebar a ajou
      }
    };
  }
}

function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href && currentPath.includes(href)) { item.classList.add('active'); }
  });
}

function setupContactFirebase() {
  const contactForm = document.getElementById("contactFormFirebase");
  if (contactForm) {
    contactForm.addEventListener("submit", async function(e) {
      e.preventDefault();
      const btn = document.getElementById("btnEnvoyer");
      const messageData = { nom: document.getElementById("contactNom").value, email: document.getElementById("contactEmail").value, message: document.getElementById("contactMessage").value, timestamp: Date.now(), status: "nouveau" };
      try {
        btn.disabled = true;
        await database.ref('RJFORDROID/CONTACT').push(messageData);
        alert("Merci ! Message envoyé.");
        contactForm.reset();
      } catch (error) { alert("Erreur."); } finally { btn.disabled = false; }
    });
  }
}



/* ==========================================================
   LOJIK OTANTIFIKASYON (LOGIN / SIGNUP) - RJ4DROID
   ========================================================== */

function initUserAuth() {
  const loginTab      = document.getElementById('tabL'); // ID ki nan popup la
  const signupTab     = document.getElementById('tabS'); // ID ki nan popup la
  const loginForm     = document.getElementById('loginForm');
  const signupForm    = document.getElementById('signupForm');
  const loginMessage  = document.getElementById('loginMessage');
  const signupMessage = document.getElementById('signupMessage');

  if (!loginForm || !signupForm) return;

  /* SWITCH FORM (TABS) */
  if (loginTab) {
    loginTab.onclick = () => {
      switchTab('login');
      clearMessages();
    };
  }

  if (signupTab) {
    signupTab.onclick = () => {
      switchTab('signup');
      clearMessages();
    };
  }

  /* ===== LOGIN ===== */
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const identifier = document.getElementById('loginUsername').value.trim();
    const password   = document.getElementById('loginPassword').value.trim();

    try {
      showMessage(loginMessage, "Connexion...", "info");

      const snap = await database.ref("RJFORDROID/USERS").once("value");
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
      
      // Nou mete done yo nan sidebar a touswit
      await loadUserData(); 

      showMessage(loginMessage, "Connexion réussie", "success");
      setTimeout(() => { redirectUser(); }, 1000);

    } catch (err) {
      console.error(err);
      showMessage(loginMessage, "Erreur serveur", "error");
    }
  });

  /* ===== SIGNUP ===== */
  signupForm.addEventListener('submit', async e => {
    e.preventDefault();
    
    const pass = document.getElementById('password').value;
    const confirmP = document.getElementById('confirmPassword').value;

    if (pass !== confirmP) {
      showMessage(signupMessage, "Mots de passe différents", "error");
      return;
    }

    try {
      showMessage(signupMessage, "Création du compte...", "info");
      
      const ref = database.ref("RJFORDROID/USERS");
      const snap = await ref.once("value");
      const users = snap.val() || {};

      const userVal = document.getElementById('username').value.trim();
      const emailVal = document.getElementById('email').value.trim();

      for (const k in users) {
        if (users[k].username === userVal || users[k].email === emailVal) {
          showMessage(signupMessage, "Utilisateur ou email déjà existant", "error");
          return;
        }
      }

      const newRef = ref.push();
      const userData = {
        uid: newRef.key,
        fullName: document.getElementById('fullName').value,
        username: userVal,
        email: emailVal,
        password: pass,
        credits: 10,
        isAdmin: false,
        createdAt: Date.now()
      };

      await newRef.set(userData);
      localStorage.setItem("connectedUID", newRef.key);
      
      await loadUserData();

      showMessage(signupMessage, "Compte créé avec succès", "success");
      setTimeout(() => { redirectUser(); }, 1500);

    } catch (err) {
      showMessage(signupMessage, "Erreur d'inscription", "error");
    }
  });
}

/* ===== REDIRECTION INTELLIGENTE ===== */
function redirectUser() {
  const redirectPage = localStorage.getItem("redirectAfterLogin");
  if (redirectPage && !redirectPage.includes("login")) {
    localStorage.removeItem("redirectAfterLogin");
    window.location.href = redirectPage;
  } else {
    // Si nou sou index, jis fèmen popup la epi rafrechi sidebar
    if(window.location.pathname.includes("index") || window.location.pathname === "/") {
       closeAuthPopup();
       window.location.reload(); 
    } else {
       window.location.href = "index.html";
    }
  }
}

/* ===== UTILS ===== */
function clearMessages() {
  if(document.getElementById("loginMessage")) document.getElementById("loginMessage").style.display = "none";
  if(document.getElementById("signupMessage")) document.getElementById("signupMessage").style.display = "none";
}

function showMessage(el, msg, type) {
  if(!el) return;
  el.textContent = msg;
  el.style.display = "block";
  el.style.padding = "10px";
  el.style.borderRadius = "5px";
  el.style.marginTop = "10px";
  el.style.fontSize = "13px";
  
  if(type === "error") { el.style.background = "#ff4444"; el.style.color = "white"; }
  else if(type === "success") { el.style.background = "#00c851"; el.style.color = "white"; }
  else { el.style.background = "#33b5e5"; el.style.color = "white"; }
}

// Nou ajoute l nan DOMContentLoaded la
document.addEventListener("DOMContentLoaded", () => {
    initUserAuth();
});



window.addEventListener('resize', checkDevice);







/* ==========================================================
   SISTÈM ANALYTICS AVANSE - RJ4DROID
   ========================================================== */
/* ==========================================================
   SISTÈM ANALYTICS AVANSE - RJ4DROID (SEKIRIZE POU ADSENSE)
   ========================================================== */

/* ==========================================================
   SISTÈM ANALYTICS SEKIRIZE - RJ4DROID
   ========================================================== */

async function trackVisitor() {
    // A. Pòt Sekrè pou Mèt Sit la (Android/PC)
    if (window.location.search.includes("admin=rj4droid")) {
        localStorage.setItem('rj_admin_ignore', 'true');
        alert("🛡️ Mod Admin Aktive: Sistèm nan ap inyore navigatè sa a kounye a.");
    }

    // B. Verifikasyon Eskizyon (AdSense Safe)
    const isAdmin = localStorage.getItem('rj_admin_ignore') === 'true';
    const isLocal = location.hostname === "localhost" || 
                    location.hostname === "127.0.0.1" || 
                    location.hostname.startsWith("192.168.") ||
                    location.protocol === "file:";

    if (isAdmin || isLocal) {
        console.log("Analytics RJ4DROID: Filtre aktive (Admin oswa Lokal).");
        return; 
    }

    // --- RÈS KÒD LA (PA CHANJE) ---
    const statsRef = database.ref('RJFORDROID/ANALYTICS');
    const onlineRef = database.ref('RJFORDROID/ONLINE_USERS');
    
    let visitorID = localStorage.getItem('rj_visitor_id') || ('visitor_' + Math.random().toString(36).substr(2, 9));
    if (!localStorage.getItem('rj_visitor_id')) {
        localStorage.setItem('rj_visitor_id', visitorID);
        statsRef.child('GLOBAL/total_unique_visitors').transaction(c => (c || 0) + 1);
    }

    const userAgent = navigator.userAgent;
    let browser = "Chrome"; // Default
    if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Edg")) browser = "Edge";
    else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari";

    let country = "Haiti";
    try {
        const geoRes = await fetch('https://ipapi.co/json/');
        const geoData = await geoRes.json();
        country = geoData.country_name || "Haiti";
    } catch (e) {}

    const currentPage = window.location.pathname.split('/').pop() || "index.html";

    // Mizajou Visiteurs
    statsRef.child('VISITORS').child(visitorID).transaction((curr) => {
        if (!curr) return { firstVisit: Date.now(), lastVisit: Date.now(), visitCount: 1, browser, country, pages: [currentPage] };
        curr.lastVisit = Date.now();
        curr.visitCount = (curr.visitCount || 0) + 1;
        if (!curr.pages.includes(currentPage)) curr.pages.push(currentPage);
        return curr;
    });

    // Moun an liy
    const myPresenceRef = onlineRef.child(visitorID);
    myPresenceRef.set({ lastActive: firebase.database.ServerValue.TIMESTAMP, page: currentPage });
    myPresenceRef.onDisconnect().remove();

    // Vues globales
    statsRef.child('GLOBAL/total_page_views').transaction(c => (c || 0) + 1);
}

document.addEventListener('DOMContentLoaded', trackVisitor);
