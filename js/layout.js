document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM chargé, injection des éléments...");

  // ==================== INJECTION DU HEADER ====================
  const headerContainer = document.getElementById("header");
  if (headerContainer) {
    headerContainer.innerHTML = `
      <div class="header-left">
        <button class="menu-btn" id="menuToggle">
          <i class="fas fa-bars"></i>
        </button>
        <div class="logo-small">
          <h2>RJ4DROID</h2>
        </div>
      </div>

      <div id="menuBtn" class="dev-icon-small">
        <i class="fa-brands fa-android"></i>
      </div>

      <div id="contextMenu" class="context-menu">
        <a href="index.html">Accueil</a>
        <a href="blog.html">Blog</a>
        <a href="terms.html">Terme</a>
        <a href="privacy.html">Privacy</a>
        <a href="contact.html">Contact</a>
        <a href="about.html">About</a>
      </div>
    `;
    console.log("Header injecté");
  } else {
    console.warn("Header container non trouvé");
  }

  // ==================== INJECTION DE LA SIDEBAR ====================
  const sidebarContainer = document.getElementById("sidebar");
  if (sidebarContainer) {
    sidebarContainer.innerHTML = `
      <div class="sidebar-header">
        <h3>Profile</h3>
        <button class="close-sidebar" id="closeSidebar"><i class="fas fa-times"></i></button>
      </div>

      <div class="user-profile-sidebar">
        <div class="avatar-side">
          <i class="fas fa-user-astronaut"></i>
        </div>
        <h4 id="profileName"></h4>
        <div class="user-title">
          <span id="username"></span>@rj4droid
        </div>
        <div class="user-title">
          <strong>Credits </strong><span id="credits"></span> RJ
        </div>

        <div class="detail-row">
          <i class="fas fa-calendar-alt"></i> 
          <span id="createdAt"></span>
        </div>

        <div class="detail-row">
          <i class="fas fa-envelope"></i> <span id="emailUser"></span>
        </div>
        <div class="detail-row">
          <i class="fas fa-phone-alt"></i> <span id="phone"></span>
        </div>
        <div class="detail-row">
          <i class="fas fa-map-marker-alt"></i> <span id="adresse"></span>
        </div>
        
        <div class="admin-btn hidden" id="adminPanelBtn">
          <i class="fas fa-crown"></i> Admin Panel
        </div>
        
        <div class="stats-side">
          <div class="stat-side-item">
            <div class="stat-side-num">27</div>
            <div class="stat-side-label">projets</div>
          </div>
          <div class="stat-side-item">
            <div class="stat-side-num">4.9</div>
            <div class="stat-side-label">notes</div>
          </div>
          <div class="stat-side-item">
            <div class="stat-side-num">8</div>
            <div class="stat-side-label">ans</div>
          </div>
        </div>

        <div class="logout-btn" id="logoutBtn">
          <i class="fas fa-sign-out-alt"></i> déconnexion
        </div>
      </div>

      <div style="color:#8ba9cc; padding:0.6rem; font-size:0.8rem; border-top: 1px solid #1f3d5a; margin-top: 0.5rem;">
        <i class="fas fa-cog"></i> Paramètres · version 2.1.0
      </div>
    `;
    console.log("Sidebar injectée");
  } else {
    console.warn("Sidebar container non trouvé");
  }

  // ==================== FONCTION DE VÉRIFICATION DE CONNEXION ====================
  function isUserLoggedIn() {
    const uid = localStorage.getItem("connectedUID");
    return uid !== null && uid !== "";
  }

  // ==================== FONCTION D'INJECTION DU FOOTER ====================
  function injectFooter() {
    const footerContainer = document.getElementById("footer");
    if (!footerContainer) {
      console.warn("Footer container non trouvé");
      return;
    }

    const isLoggedIn = isUserLoggedIn();
    const profileLink = isLoggedIn ? "../profile.html" : "../user.html";
    
    footerContainer.innerHTML = `
      <a href="../index.html" class="footer-item">
        <div data-page="accueil">
          <i class="fas fa-home"></i><br>
          <span>Accueil</span>
        </div>
      </a>
      
      <a href="../blog.html" class="footer-item">
        <div data-page="blog">
          <i class="fas fa-search"></i><br>
          <span>Blog</span>
        </div>
      </a>
      
      <a href="cours.html" class="footer-item">
        <div data-page="cours">
          <i class="fas fa-plus-circle"></i><br>
          <span>Cours</span>
        </div>
      </a>

      <a href="#" class="footer-item" data-page="actus">
        <div>
          <i class="fas fa-bell"></i><br>
          <span>Actus</span>
        </div>
      </a>
      
      <a href="${profileLink}" class="footer-item">
        <div data-page="profil">
          <i class="fas fa-user"></i><br>
          <span>${isLoggedIn ? 'Profil' : 'Connexion'}</span>
        </div>
      </a>
    `;
    
    console.log(`Footer injecté avec lien ${isLoggedIn ? 'profile.html' : 'user.html'}`);
    
    // Activer l'élément du footer correspondant à la page courante
    highlightCurrentPage();
  }

  // ==================== FONCTION POUR SURBRILLER LA PAGE ACTIVE ====================
  function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const footerItems = document.querySelectorAll('.footer-item');
    
    footerItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href && currentPath.includes(href.replace('../', ''))) {
        item.classList.add('active');
      } else if (!href && item.getAttribute('data-page') === 'actus') {
        // Pour les liens sans href (Actus)
        if (currentPath.includes('actus')) {
          item.classList.add('active');
        }
      }
    });
  }

  // ==================== FONCTION DE CHARGEMENT DES DONNÉES UTILISATEUR ====================
  async function loadUserData() {
    const uid = localStorage.getItem("connectedUID");
    
    // Éléments de la sidebar
    const nameEl = document.getElementById("profileName");
    const usernameEl = document.getElementById("username");
    const emailEl = document.getElementById("emailUser");
    const phoneEl = document.getElementById("phone");
    const creditEl = document.getElementById("credits");
    const adresseEl = document.getElementById("adresse");
    const createdAtEl = document.getElementById("createdAt");
    const adminBtn = document.getElementById("adminPanelBtn");
    
    if (!uid) {
      // Utilisateur non connecté - afficher des valeurs par défaut ou vides
      if (nameEl) nameEl.textContent = "Visiteur";
      if (usernameEl) usernameEl.textContent = "invité";
      if (emailEl) emailEl.textContent = "non connecté";
      if (phoneEl) phoneEl.textContent = "-";
      if (creditEl) creditEl.textContent = "0";
      if (adresseEl) adresseEl.textContent = "Non renseignée";
      if (createdAtEl) createdAtEl.textContent = "";
      if (adminBtn) adminBtn.classList.add("hidden");
      return;
    }

    try {
      const snap = await firebase.database()
        .ref(`RJFORDROID/USERS/${uid}`)
        .once("value");

      const user = snap.val();
      if (!user) return;

      console.log("Données utilisateur chargées:", user);

      // Mise à jour de la sidebar
      if (nameEl) nameEl.textContent = user.fullName || "Utilisateur";
      if (usernameEl) usernameEl.textContent = user.username || "";
      if (emailEl) emailEl.textContent = user.email || "";
      if (phoneEl) phoneEl.textContent = user.phone || "+509 XX XX XXXX";
      if (creditEl) creditEl.textContent = user.credits ?? 0;
      if (adresseEl) adresseEl.textContent = user.adresse || "Jacmel, Haïti";
      
      if (user.createdAt && createdAtEl) {
        const date = new Date(user.createdAt);
        const formattedDate = date.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        });
        createdAtEl.textContent = "Inscrit le " + formattedDate;
      }

      // Vérification Admin
      if (user.isAdmin === true && adminBtn) {
        adminBtn.classList.remove("hidden");
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données utilisateur:", error);
    }
  }

  // ==================== GESTION DU MENU CONTEXTUEL ====================
  setTimeout(function() {
    const menuBtn = document.getElementById("menuBtn");
    const contextMenu = document.getElementById("contextMenu");

    if (menuBtn && contextMenu) {
      console.log("Menu contextuel trouvé, ajout des événements");
      
      menuBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        contextMenu.classList.toggle("active");
        console.log("Menu cliqué, active:", contextMenu.classList.contains("active"));
      });

      document.addEventListener("click", function(e) {
        if (!contextMenu.contains(e.target) && !menuBtn.contains(e.target)) {
          contextMenu.classList.remove("active");
        }
      });
    } else {
      console.warn("MenuBtn ou contextMenu non trouvé", {menuBtn, contextMenu});
    }
  }, 100);

  // ==================== GESTION DE LA SIDEBAR ====================
  setTimeout(function() {
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const closeSidebar = document.getElementById("closeSidebar");
    const overlay = document.getElementById("overlay");

    console.log("Sidebar elements:", {menuToggle, sidebar, closeSidebar, overlay});

    if (menuToggle && sidebar && closeSidebar && overlay) {
      function openSidebar() {
        sidebar.classList.add("open");
        overlay.classList.add("active");
        console.log("Sidebar ouverte");
      }

      function closeSidebarFunc() {
        sidebar.classList.remove("open");
        overlay.classList.remove("active");
        console.log("Sidebar fermée");
      }

      menuToggle.addEventListener("click", openSidebar);
      closeSidebar.addEventListener("click", closeSidebarFunc);
      overlay.addEventListener("click", closeSidebarFunc);
    } else {
      console.warn("Éléments de la sidebar manquants");
    }
  }, 100);

  // ==================== CHARGEMENT DES DONNÉES UTILISATEUR ====================
  // Injecter d'abord le footer
  injectFooter();
  
  // Puis charger les données utilisateur
  setTimeout(async () => {
    await loadUserData();
  }, 200);

  // ==================== GESTION DU FORMULAIRE DE CONTACT ====================
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();
      
      const formData = {
        name: document.getElementById("name")?.value || "",
        email: document.getElementById("contactEmail")?.value || "",
        phone: document.getElementById("contactPhone")?.value || "",
        service: document.getElementById("service-select")?.value || "",
        message: document.getElementById("message")?.value || ""
      };

      console.log("Formulaire soumis :", formData);
      alert("Message envoyé avec succès ! Nous vous répondrons dans les 24h.");
      contactForm.reset();
    });
    console.log("Gestionnaire de formulaire ajouté");
  }

  // ==================== GESTION DE LA DÉCONNEXION ====================
  setTimeout(function() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function() {
        if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
          localStorage.removeItem("connectedUID");
          window.location.href = "login.html";
        }
      });
      console.log("Gestionnaire de déconnexion ajouté");
    }
  }, 200);

  // ==================== ÉCOUTEUR POUR LES CHANGEMENTS DE CONNEXION ====================
  window.addEventListener("storage", function(e) {
    if (e.key === "connectedUID") {
      console.log("Changement détecté dans connectedUID, mise à jour...");
      injectFooter();
      loadUserData();
    }
  });

  console.log("Initialisation terminée");
});