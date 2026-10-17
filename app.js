\
"use strict";

const STORAGE = {
  resources: "klakzweb.resources.v1",
  users: "klakzweb.users.v1",
  session: "klakzweb.session.v1",
  theme: "klakzweb.theme.v1"
};

const starterResources = [
  {id:"starter-1",title:"Minecraft Performans Rehberi",game:"Minecraft",category:"Rehber",description:"Daha akıcı bir oyun deneyimi için temel ayarlar, performans ipuçları ve kontrol listesi.",symbol:"M",color:"#9df5c3",author:"KLAKZWEB",link:"",created:Date.now()-60000},
  {id:"starter-2",title:"Arayüz Mod Koleksiyonu",game:"Minecraft",category:"Mod",description:"Oyun arayüzünü kişiselleştirmek isteyenler için topluluk seçkisi ve kurulum notları.",symbol:"✦",color:"#b6a0ff",author:"KLAKZWEB",link:"",created:Date.now()-120000},
  {id:"starter-3",title:"Oyun Dosyaları Düzenleyici",game:"Genel",category:"Araç",description:"Klasörlerini daha düzenli tutmak için örnek iş akışı ve pratik dosya yönetimi önerileri.",symbol:"⌘",color:"#8bd7ff",author:"KLAKZWEB",link:"",created:Date.now()-180000},
  {id:"starter-4",title:"Yeni Başlayanlar İçin Roblox",game:"Roblox",category:"Rehber",description:"Proje kurulumuna, güvenli kaynak seçimine ve temel oyun geliştirme kavramlarına giriş.",symbol:"R",color:"#ffb78a",author:"KLAKZWEB",link:"",created:Date.now()-240000},
  {id:"starter-5",title:"Minimal HUD Tasarımları",game:"Çoklu oyun",category:"Mod",description:"Daha sade bir görünüm için ilham veren HUD fikirleri ve arayüz tasarım notları.",symbol:"◈",color:"#f5a8d2",author:"KLAKZWEB",link:"",created:Date.now()-300000},
  {id:"starter-6",title:"Kısayol ve Kontrol İpuçları",game:"PC",category:"Araç",description:"Günlük kullanımda işini kolaylaştırabilecek genel kısayollar ve küçük yardımcılar.",symbol:"⌁",color:"#f1d27c",author:"KLAKZWEB",link:"",created:Date.now()-360000}
];

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const safeParse = (value, fallback) => { try { return JSON.parse(value) ?? fallback; } catch { return fallback; } };

let resources = safeParse(localStorage.getItem(STORAGE.resources), null);
if (!Array.isArray(resources)) {
  resources = starterResources;
  localStorage.setItem(STORAGE.resources, JSON.stringify(resources));
}
let activeCategory = "Tümü";
let authMode = "login";
let toastTimer;

const resourceGrid = $("#resourceGrid");
const searchInput = $("#searchInput");

function escapeHTML(value="") {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function getSession() { return safeParse(localStorage.getItem(STORAGE.session), null); }
function saveResources() {
  localStorage.setItem(STORAGE.resources, JSON.stringify(resources));
  renderResources();
}
function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}
function updateAccountButton() {
  const session = getSession();
  $("#loginOpen").textContent = session ? "Hesabım" : "Giriş yap";
  $("#uploadOpen").innerHTML = "<span>＋</span> Paylaş";
  $("#statResources").textContent = String(resources.length).padStart(2, "0");
}
function renderResources() {
  const query = searchInput.value.trim().toLocaleLowerCase("tr-TR");
  const visible = resources.filter(item => {
    const matchesCategory = activeCategory === "Tümü" || item.category === activeCategory;
    const haystack = `${item.title} ${item.game} ${item.category} ${item.description} ${item.author}`.toLocaleLowerCase("tr-TR");
    return matchesCategory && haystack.includes(query);
  });
  resourceGrid.innerHTML = visible.map((item, index) => `
    <article class="resource-card">
      <div class="resource-cover" style="--cover:${escapeHTML(item.color || "#b8a3ff")}">
        <span class="cover-badge">${escapeHTML(item.category.toLocaleUpperCase("tr-TR"))}</span>
        <span class="cover-symbol">${escapeHTML(item.symbol || "✦")}</span>
        <span class="cover-index">KW / ${String(index+1).padStart(2,"0")}</span>
      </div>
      <div class="resource-content">
        <div class="resource-meta"><span class="category">${escapeHTML(item.category)}</span><span>${escapeHTML(item.author || "Topluluk")}</span></div>
        <h3>${escapeHTML(item.title)}</h3>
        <p>${escapeHTML(item.description)}</p>
        <div class="resource-footer"><span class="game-tag">◉ ${escapeHTML(item.game)}</span>
          ${item.link ? `<a class="resource-open" href="${escapeHTML(item.link)}" target="_blank" rel="noopener noreferrer">İçeriği aç ↗</a>` : `<button class="resource-open" data-details="${escapeHTML(item.id)}">Detaylar ↗</button>`}
        </div>
      </div>
    </article>`).join("");
  $("#emptyState").classList.toggle("hidden", visible.length > 0);
  resourceGrid.classList.toggle("hidden", visible.length === 0);
  $("#resultCount").textContent = `${visible.length} içerik`;
  $("#resultsLabel").textContent = activeCategory === "Tümü" ? "Tüm içerikler" : `${activeCategory} kategorisi`;
  $$(".filter-chip").forEach(button => button.classList.toggle("selected", button.dataset.category === activeCategory));
  $("#statResources").textContent = String(resources.length).padStart(2, "0");
}
function openModal(id) {
  $("#" + id).classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
function closeModal(id) {
  $("#" + id).classList.add("hidden");
  if ($$(".modal-backdrop:not(.hidden)").length === 0) document.body.style.overflow = "";
}
function setAuthMode(mode) {
  authMode = mode;
  $$(".tab").forEach(tab => tab.classList.toggle("active", tab.dataset.authTab === mode));
  $("#authSubmit").innerHTML = mode === "login" ? 'Giriş yap <span>↗</span>' : 'Hesap oluştur <span>↗</span>';
  $("#authPassword").autocomplete = mode === "login" ? "current-password" : "new-password";
  $("#authMessage").textContent = "";
}
function openAuth() {
  $("#authMessage").textContent = "";
  setAuthMode("login");
  const session = getSession();
  if (session) {
    if (confirm(`${session.email} hesabından çıkış yapmak istiyor musun?`)) {
      localStorage.removeItem(STORAGE.session);
      updateAccountButton();
      toast("Oturum kapatıldı.");
    }
    return;
  }
  openModal("loginModal");
}
function renderAdmin() {
  const host = $("#adminContent");
  if (!resources.length) {
    host.innerHTML = "<p class='modal-subtitle'>Henüz içerik yok.</p>";
    return;
  }
  host.innerHTML = resources.map(item => `
    <div class="admin-row"><div><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.game)} · ${escapeHTML(item.category)} · ${escapeHTML(item.author || "Topluluk")}</small></div><button class="delete-button" data-delete="${escapeHTML(item.id)}">Kaldır</button></div>
  `).join("");
}

$$("[data-close]").forEach(button => button.addEventListener("click", () => closeModal(button.dataset.close)));
$$(".modal-backdrop").forEach(backdrop => backdrop.addEventListener("click", event => {
  if (event.target === backdrop) closeModal(backdrop.id);
}));
$("#loginOpen").addEventListener("click", openAuth);
["uploadOpen","heroUpload","bannerUpload"].forEach(id => $("#" + id).addEventListener("click", () => {
  $("#uploadMessage").textContent = "";
  openModal("uploadModal");
}));
$("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem(STORAGE.theme, document.body.classList.contains("light") ? "light" : "dark");
});
if (localStorage.getItem(STORAGE.theme) === "light") document.body.classList.add("light");
searchInput.addEventListener("input", renderResources);
$$(".filter-chip").forEach(button => button.addEventListener("click", () => {
  activeCategory = button.dataset.category;
  renderResources();
}));
$("#resetFilters").addEventListener("click", () => {
  searchInput.value = "";
  activeCategory = "Tümü";
  renderResources();
});
$("#mobileMenu").addEventListener("click", () => {
  const nav = $(".desktop-nav");
  const open = nav.style.display === "flex";
  nav.style.display = open ? "" : "flex";
  if (!open) {
    nav.style.position = "absolute";
    nav.style.top = "69px";
    nav.style.left = "0";
    nav.style.right = "0";
    nav.style.padding = "20px";
    nav.style.background = "var(--panel)";
    nav.style.borderBottom = "1px solid var(--line)";
    nav.style.justifyContent = "center";
  }
});
$$("[data-auth-tab]").forEach(tab => tab.addEventListener("click", () => setAuthMode(tab.dataset.authTab)));
$("#authForm").addEventListener("submit", event => {
  event.preventDefault();
  const email = $("#authEmail").value.trim().toLowerCase();
  const password = $("#authPassword").value;
  const users = safeParse(localStorage.getItem(STORAGE.users), []);
  const message = $("#authMessage");
  if (authMode === "register") {
    if (users.some(user => user.email === email)) {
      message.textContent = "Bu e-posta zaten kayıtlı.";
      return;
    }
    users.push({email, password});
    localStorage.setItem(STORAGE.users, JSON.stringify(users));
    localStorage.setItem(STORAGE.session, JSON.stringify({email}));
    message.textContent = "Demo hesabın oluşturuldu.";
  } else {
    const user = users.find(entry => entry.email === email && entry.password === password);
    if (!user) {
      message.textContent = "E-posta veya şifre yanlış. Önce hesap oluşturmayı deneyebilirsin.";
      return;
    }
    localStorage.setItem(STORAGE.session, JSON.stringify({email}));
    message.textContent = "Giriş başarılı.";
  }
  updateAccountButton();
  setTimeout(() => closeModal("loginModal"), 650);
});
$("#uploadForm").addEventListener("submit", event => {
  event.preventDefault();
  const session = getSession();
  const item = {
    id: `user-${Date.now()}`,
    title: $("#resourceTitle").value.trim(),
    game: $("#resourceGame").value.trim(),
    category: $("#resourceCategory").value,
    description: $("#resourceDescription").value.trim(),
    link: $("#resourceLink").value.trim(),
    author: session?.email || "Misafir",
    symbol: $("#resourceCategory").value === "Mod" ? "✦" : $("#resourceCategory").value === "Araç" ? "⌘" : "↗",
    color: ["#b6a0ff","#8bd7ff","#9df5c3","#f5a8d2"][Math.floor(Math.random()*4)],
    created: Date.now()
  };
  resources.unshift(item);
  saveResources();
  $("#uploadForm").reset();
  $("#uploadMessage").textContent = "İçerik bu tarayıcıya eklendi.";
  toast("İçerik eklendi!");
  setTimeout(() => closeModal("uploadModal"), 700);
});
resourceGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-details]");
  if (!button) return;
  const item = resources.find(entry => entry.id === button.dataset.details);
  if (item) alert(`${item.title}\n\n${item.description}\n\nOyun: ${item.game}\nKategori: ${item.category}\nPaylaşan: ${item.author || "Topluluk"}${item.link ? "\nBağlantı: " + item.link : ""}`);
});
$("#adminContent").addEventListener("click", event => {
  const button = event.target.closest("[data-delete]");
  if (!button) return;
  const item = resources.find(entry => entry.id === button.dataset.delete);
  if (!item || !confirm(`"${item.title}" içeriği kaldırılsın mı?`)) return;
  resources = resources.filter(entry => entry.id !== button.dataset.delete);
  saveResources();
  renderAdmin();
  toast("İçerik kaldırıldı.");
});
document.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape") $$(".modal-backdrop:not(.hidden)").forEach(modal => closeModal(modal.id));
  if (event.key === "F2") {
    event.preventDefault();
    renderAdmin();
    openModal("adminModal");
  }
});
$("#year").textContent = new Date().getFullYear();
updateAccountButton();
renderResources();
