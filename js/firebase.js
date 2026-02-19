/*********************************
 * FIREBASE INIT
 *********************************/
const firebaseConfig = {
  apiKey: "AIzaSyAQeHWr_vUiQmVVgJJ_cOF9qrCCLd7IJNc",
  authDomain: "ayiweb.firebaseapp.com",
  databaseURL: "https://ayiweb-default-rtdb.firebaseio.com",
  projectId: "ayiweb",
  storageBucket: "ayiweb.appspot.com",
  messagingSenderId: "115054504556",
  appId: "1:115054504556:web:ccd713ba01dd8f02830649"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();
const db = firebase.database();


/*********************************
 * UNIQUE USER ID (PERSISTENT)
 *********************************/

// ==============================
// 1️⃣ BROWSER ID PÈMANAN
// ==============================
function getBrowserID() {
  var id = localStorage.getItem("BrowserID");
  if (!id) {
    id = "ID-Browser-" + Math.floor(Math.random() * 100000000);
    localStorage.setItem("BrowserID", id);
  }
  return id;
}


// ==============================
// 2️⃣ ANTI-SPAM 30 SEGONN
// ==============================
function canRegisterVisit() {
  var lastVisit = localStorage.getItem("lastVisitTime");
  var now = Date.now();

  if (!lastVisit || (now - lastVisit) > 30000) {
    localStorage.setItem("lastVisitTime", now);
    return true;
  }

  return false;
}


// ==============================
// 3️⃣ FILTRE BOT
// ==============================
function isBot() {
  var ua = navigator.userAgent.toLowerCase();
  return ua.includes("bot") ||
         ua.includes("crawl") ||
         ua.includes("spider") ||
         ua.includes("facebookexternalhit") ||
         ua.includes("whatsapp");
}


// ==============================
// 4️⃣ ENREGISTRER VISITE
// ==============================
function enregistrerVisite() {

  if (isBot()) {
    console.log("Bot détecté ❌");
    return;
  }

  if (!canRegisterVisit()) {
    console.log("Anti-spam actif ⏳");
    return;
  }

  // API IP + Pays
  fetch("https://ipapi.co/json/")
    .then(response => response.json())
    .then(function(locationData) {

      var visitesRef = database.ref("RJFORDROID/VISITES");

      var data = {
        BrowserID: getBrowserID(),
        Date_visite: new Date().toLocaleString(),
        Path: window.location.pathname,
        Pays: locationData.country_name,
        ip: locationData.ip,
        Usernavigater: navigator.userAgent,
        Visit: document.title
      };

      visitesRef.push(data);

      // ==============================
      // 5️⃣ KONTE VISIT INIK
      // ==============================
      var uniqueRef = database.ref("RJFORDROID/UNIQUE_VISITORS/" + getBrowserID());

      uniqueRef.once("value", function(snapshot) {
        if (!snapshot.exists()) {
          uniqueRef.set({
            firstVisit: new Date().toLocaleString(),
            ip: locationData.ip,
            Pays: locationData.country_name
          });
        }
      });

      console.log("Visite enregistrée ✔");

    })
    .catch(function(error) {
      console.log("Erreur API IP :", error);
    });
}


// 🚀 Lanse
enregistrerVisite();
