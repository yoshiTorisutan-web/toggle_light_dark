(() => {
  const phone = document.getElementById("phone");
  const toggleWrapper = document.getElementById("toggleWrapper");
  const clock = document.getElementById("clock");
  const toast = document.getElementById("toast");
  const menu = document.getElementById("menu");
  const openMenuBtn = document.getElementById("openMenuBtn");
  const closeMenuBtn = document.getElementById("closeMenuBtn");
  const toggleLockScreen = document.getElementById("toggleLockScreen");
  const lockScreen = document.getElementById("lockScreen");
  let darkMode = false;
  let wallpapers = {
    light: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1525097487452-6278ff080c31?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=400&q=80",
    ],
    dark: [
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=400&q=80",
    ],
  };
  let currentWallpaperIndex = 0;
  let wallpaperMode = "light";
  let toastTimeout;

  // Mise à jour fond écran
  function updateWallpaper() {
    const url = wallpapers[wallpaperMode][currentWallpaperIndex];
    phone.style.backgroundImage = `url('${url}')`;
  }

  // Changer wallpaper suivant/précédent
  function changeWallpaper(step) {
    currentWallpaperIndex += step;
    const arr = wallpapers[wallpaperMode];
    if (currentWallpaperIndex < 0) currentWallpaperIndex = arr.length - 1;
    if (currentWallpaperIndex >= arr.length) currentWallpaperIndex = 0;
    updateWallpaper();
  }

  // Affiche toast notification
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  // Mise à jour mode clair/sombre
  function setMode(isDark, save = true, showNotif = true) {
    darkMode = isDark;
    wallpaperMode = darkMode ? "dark" : "light";
    phone.classList.toggle("dark", darkMode);
    phone.classList.toggle("light", !darkMode);
    menu.classList.toggle("dark", darkMode);
    menu.classList.toggle("light", !darkMode);
    toggleWrapper.classList.toggle("active", darkMode);
    toggleWrapper.classList.toggle("dark-glow", darkMode);

    // Mise à jour fond
    currentWallpaperIndex = 0;
    updateWallpaper();

    // Aria pour accessibilité
    toggleWrapper.setAttribute("aria-checked", darkMode.toString());

    // Animation pop
    toggleWrapper.classList.add("pop");
    setTimeout(() => toggleWrapper.classList.remove("pop"), 300);

    // Sauvegarde
    if (save) localStorage.setItem("darkMode", darkMode ? "true" : "false");

    // Toast
    if (showNotif) {
      showToast(darkMode ? "Mode sombre activé" : "Mode clair activé");
    }

    // Body class pour Tailwind dark mode si besoin
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  // Toggle mode par clic
  toggleWrapper.addEventListener("click", () => {
    setMode(!darkMode);
  });

  // Toggle via clavier (Espace/Entrée)
  toggleWrapper.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setMode(!darkMode);
    }
  });

  // Changer wallpaper boutons
  document
    .getElementById("prevWallpaper")
    .addEventListener("click", () => changeWallpaper(-1));
  document
    .getElementById("nextWallpaper")
    .addEventListener("click", () => changeWallpaper(1));

  // Horloge update chaque seconde
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    clock.textContent = `${h}:${m}:${s}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Gestion écran verrouillage
  toggleLockScreen.addEventListener("change", (e) => {
    if (e.target.checked) {
      lockScreen.classList.add("active");
    } else {
      lockScreen.classList.remove("active");
    }
  });

  // Menu ouvert/fermé
  openMenuBtn.addEventListener("click", () => {
    menu.style.display = "block";
  });
  closeMenuBtn.addEventListener("click", () => {
    menu.style.display = "none";
  });

  // Raccourcis clavier D (clair) / L (dark)
  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key.toLowerCase() === "d") setMode(false);
    if (e.key.toLowerCase() === "l") setMode(true);
  });

  // Swipe tactile pour changer mode
  let touchStartX = 0;
  window.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  });
  window.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) setMode(false);
      else setMode(true);
    }
  });

  // Chargement mode depuis localStorage sinon auto selon heure
  const saved = localStorage.getItem("darkMode");
  if (saved === null) {
    const hour = new Date().getHours();
    setMode(hour >= 19 || hour < 7, false, false);
  } else {
    setMode(saved === "true", false, false);
  }
})();
