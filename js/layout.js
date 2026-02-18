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

  // ==================== INJECTION DU FOOTER ====================
  const footerContainer = document.getElementById("footer");
  if (footerContainer) {
    footerContainer.innerHTML = `
      <div class="footer-item active" data-page="accueil">
        <i class="fas fa-home"></i>
        <span>Accueil</span>
      </div>
        
        <a href="../blog.html" class="footer-item">
                <div data-page="profile">
        <i class="fas fa-search"></i>
       <br> <span>Blog</span>
      </div>
        </a>
       
       <a href="cours.html" class="footer-item">
                <div class="footer-item" data-page="services">
        <i class="fas fa-plus-circle"></i>
        <span>Cours</span>
      </div>
       </a>

      <div class="footer-item" data-page="actus">
        <i class="fas fa-bell"></i>
        <span>Actus</span>
      </div>
      <div class="footer-item" data-page="profil">
        <i class="fas fa-user"></i>
        <span>Profil</span>
      </div>
    `;
    console.log("Footer injecté");
  } else {
    console.warn("Footer container non trouvé");
  }

  // ==================== GESTION DU MENU CONTEXTUEL ====================
  // Note: On doit attendre que les éléments soient injectés
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
  setTimeout(function() {
    // Simulation de données utilisateur
    const userData = {
      profileName: "",
      username: "",
      credits: "",
      createdAt: "",
      emailUser: "@rj4droid.com",
      phone: "+509 42 77 29 70",
      adresse: "Jacmel, Haïti"
    };

    // Mise à jour des éléments dans la sidebar
    Object.keys(userData).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        element.textContent = userData[key];
        console.log(`Élément ${key} mis à jour:`, userData[key]);
      }
    });
  }, 200);

  // ==================== GESTION DU FORMULAIRE DE CONTACT ====================
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();
      
      // Récupération des données du formulaire
      const formData = {
        name: document.getElementById("name")?.value || "",
        email: document.getElementById("contactEmail")?.value || "",
        phone: document.getElementById("contactPhone")?.value || "",
        service: document.getElementById("service-select")?.value || "",
        message: document.getElementById("message")?.value || ""
      };

      console.log("Formulaire soumis :", formData);
      
      // Simulation d'envoi réussi
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
          window.location.href = "login.html";
        }
      });
      console.log("Gestionnaire de déconnexion ajouté");
    }
  }, 200);

  console.log("Initialisation terminée");
});