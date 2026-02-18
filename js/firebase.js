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

function getUserId() {
  let id = localStorage.getItem("visitorId");

  if (!id) {
    id = "u-" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("visitorId", id);
  }

  return id;
}


/*********************************
 * CLEAN BROWSER INFO
 *********************************/

function getUserInfo() {
  const ua = navigator.userAgent;

  let browser = "Autre";

  if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari")) browser = "Safari";

  return {
    browser,
    platform: navigator.platform,
    userAgent: ua
  };
}


/*********************************
 * GET IP + COUNTRY (CACHED)
 *********************************/

async function getLocationData() {
  const cache = localStorage.getItem("visitorLocation");

  if (cache) {
    return JSON.parse(cache);
  }

  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();

    const location = {
      ip: data.ip || "Unknown",
      country: data.country_name || "Unknown"
    };

    localStorage.setItem("visitorLocation", JSON.stringify(location));
    return location;

  } catch {
    return {
      ip: "Unknown",
      country: "Unknown"
    };
  }
}


/*********************************
 * PAGE INFO
 *********************************/

function getPageInfo() {
  const params = Object.fromEntries(
    new URLSearchParams(location.search).entries()
  );

  let pageKey = "home";

  if (params.id) pageKey = `article-${params.id}`;
  else if (params.tab) pageKey = `tab-${params.tab}`;
  else pageKey = location.pathname.replace(/\//g, "") || "home";

  return { pageKey, params };
}


/*********************************
 * ANTI RELOAD SPAM (30s)
 *********************************/

function canRegisterVisit() {
  const lastVisit = localStorage.getItem("lastVisitTime");
  const now = Date.now();

  if (lastVisit && now - parseInt(lastVisit) < 30000) {
    return false; // Moins de 30 sec
  }

  localStorage.setItem("lastVisitTime", now);
  return true;
}


/*********************************
 * SAVE VISIT
 *********************************/

async function saveVisit(articleId = null) {

  if (!canRegisterVisit()) return;

  const userId = getUserId();
  const info = getUserInfo();
  const location = await getLocationData();
  const now = Date.now();
  const { pageKey, params } = getPageInfo();

  // 🔹 SAVE INDIVIDUAL VISIT
  const visitRef = db.ref("RJFORDROID/stats/visits").push();

  await visitRef.set({
    userId,
    page: pageKey,
    articleId: articleId || null,
    country: location.country,
    ip: location.ip,
    browser: info.browser,
    platform: info.platform,
    userAgent: info.userAgent,
    timestamp: now,
    params
  });

  // 🔹 AGGREGATED STATS
  db.ref(`stats/pages/${pageKey}/count`)
    .transaction(c => (c || 0) + 1);

  db.ref(`stats/countries/${location.country}/count`)
    .transaction(c => (c || 0) + 1);

  db.ref(`stats/browsers/${info.browser}/count`)
    .transaction(c => (c || 0) + 1);

  if (articleId) {
    db.ref(`stats/articles/${articleId}/views`)
      .transaction(v => (v || 0) + 1);
  }

  // 🔹 USER ONLINE SYSTEM
  const onlineRef = db.ref(`RJFORDROID/stats/online/${userId}`);

  onlineRef.set({
    page: pageKey,
    lastSeen: now
  });

  onlineRef.onDisconnect().remove();
}



/*********************************
 * INIT
 *********************************/

document.addEventListener("DOMContentLoaded", () => {
  saveVisit();
});