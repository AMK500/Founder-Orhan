// Mock Data for Seasons and Episodes
const translations = {
  ar: {
    siteTitle: "المؤسس أورهان",
    season: "الموسم",
    episode: "الحلقة",
    next: "التالي",
    prev: "السابق",
    share: "مشاركة",
    copied: "تم نسخ الرابط!",
    langBtn: "English",
  },
  en: {
    siteTitle: "Founder Orhan",
    season: "Season",
    episode: "Episode",
    next: "Next",
    prev: "Previous",
    share: "Share",
    copied: "Link copied!",
    langBtn: "العربية",
  },
};

let currentLang = localStorage.getItem("lang") || "ar";

const seasons = [
  {
    id: 1,
    title: "الموسم 1",
    episodes: [
      {
        id: 1,
        title: "الحلقة 1",
        url: "https://qq.okprime.site/embed-vn8imcfz4xdv.html",
      },
      {
        id: 2,
        title: "الحلقة 2",
        url: "https://rty1.film77.xyz/embed-a1h1tdocywyz.html",
      },
      {
        id: 3,
        title: "الحلقة 3",
        url: "https://qq.okprime.site/embed-lf6g6wqvjatx.html",
      },
      {
        id: 4,
        title: "الحلقة 4",
        url: "https://qq.okprime.site/embed-bumhoflejl04.html",
      },
      {
        id: 5,
        title: "الحلقة 5",
        url: "https://rty1.film77.xyz/embed-arvcmo1bibfj.html",
      },
      {
        id: 6,
        title: "الحلقة 6",
        url: "https://qq.okprime.site/embed-zm17axlmx11j.html",
      },
      {
        id: 7,
        title: "الحلقة 7",
        url: "https://qq.okprime.site/embed-za8gtfrzf0qb.html",
      },
      {
        id: 8,
        title: "الحلقة 8",
        url: "https://rty1.film77.xyz/embed-ruh8cl82vjl4.html",
      },
      {
        id: 9,
        title: "الحلقة 9",
        url: "https://qq.okprime.site/embed-7xxo1vm1dia0.html",
      },
      {
        id: 10,
        title: "الحلقة 10",
        url: "https://qq.okprime.site/embed-2ezbdj3m37um.html",
      },
      {
        id: 11,
        title: "الحلقة 11",
        url: "https://qq.okprime.site/embed-wrr9gqv8cqgg.html",
      },
      {
        id: 12,
        title: "الحلقة 12",
        url: "https://qq.okprime.site/embed-2b33coh6okq4.html",
      },
      {
        id: 13,
        title: "الحلقة 13",
        url: "https://qq.okprime.site/embed-r9vtaaal8gzq.html",
      },
      {
        id: 14,
        title: "الحلقة 14",
        url: "https://qq.okprime.site/embed-pmnz36mfvd87.html",
      },
      {
        id: 15,
        title: "الحلقة 15",
        url: "https://qq.okprime.site/embed-2x524d3cck6g.html",
      },
    ],
  },
  {
    id: 2,
    title: "الموسم 2",
    episodes: [],
  },
];

let currentSeasonIndex = 0;
let currentEpisodeIndex = 0;

// DOM Elements
const videoFrame = document.getElementById("video-frame");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const shareBtn = document.getElementById("share-btn");
const episodesStrip = document.getElementById("episodes-strip");
const seasonsStrip = document.getElementById("seasons-strip");
const episodeHeader = document.getElementById("episode-header");
const langToggle = document.getElementById("lang-toggle");
const langText = document.getElementById("lang-text");

// Initialize
function init() {
  updateLanguage(currentLang); // Set initial language/direction

  const savedSeasonIndex = localStorage.getItem("lastSeasonIndex");
  const savedEpisodeIndex = localStorage.getItem("lastEpisodeIndex");

  if (savedSeasonIndex !== null) {
    currentSeasonIndex = parseInt(savedSeasonIndex, 10);
    if (currentSeasonIndex < 0 || currentSeasonIndex >= seasons.length) {
      currentSeasonIndex = 0;
    }
  }

  if (savedEpisodeIndex !== null) {
    currentEpisodeIndex = parseInt(savedEpisodeIndex, 10);
    const episodes = seasons[currentSeasonIndex].episodes;
    if (currentEpisodeIndex < 0 || currentEpisodeIndex >= episodes.length) {
      currentEpisodeIndex = 0;
    }
  }

  // Initial Render
  renderSeasons();
  loadEpisode(currentEpisodeIndex, false); // false to avoid immediate scrolling on init if desired, but we handle scrolling inside
}

function updateLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  document.dir = lang === "ar" ? "rtl" : "ltr";

  // Update static text
  const t = translations[currentLang];
  document.title = t.siteTitle;

  const nextIcon = '<i class="fas fa-chevron-left"></i>';
  const prevIcon = '<i class="fas fa-chevron-right"></i>';
  const shareIcon = '<i class="fas fa-share-nodes"></i>';

  if (lang === "ar") {
    nextBtn.innerHTML = `${t.next} ${nextIcon}`;
    prevBtn.innerHTML = `${prevIcon} ${t.prev}`;
    shareBtn.innerHTML = `${t.share} ${shareIcon}`;
    langText.textContent = "English"; // Btn shows target language
  } else {
    nextBtn.innerHTML = `${t.next} <i class="fas fa-chevron-right"></i>`; // Standard LTR Next
    prevBtn.innerHTML = `<i class="fas fa-chevron-left"></i> ${t.prev}`; // Standard LTR Prev
    shareBtn.innerHTML = `${t.share} ${shareIcon}`;
    langText.textContent = "العربية";
  }

  renderSeasons();
  renderEpisodes();

  // Update Header if episode loaded
  if (
    seasons[currentSeasonIndex] &&
    seasons[currentSeasonIndex].episodes[currentEpisodeIndex]
  ) {
    const season = seasons[currentSeasonIndex];
    const episode = season.episodes[currentEpisodeIndex];
    updateHeader(season.id, episode.id); // Passing IDs to generate title
  }
}

// Render Seasons Strip
function renderSeasons() {
  if (!seasonsStrip) return;
  seasonsStrip.innerHTML = "";
  const t = translations[currentLang];

  seasons.forEach((season, index) => {
    const seasonEl = document.createElement("div");
    seasonEl.classList.add("season-item");
    // Generate Title
    seasonEl.textContent = `${t.season} ${season.id}`;

    if (index === currentSeasonIndex) {
      seasonEl.classList.add("active");
    }

    seasonEl.addEventListener("click", () => {
      if (currentSeasonIndex !== index) {
        selectSeason(index);
      }
    });

    seasonsStrip.appendChild(seasonEl);
  });
}

function selectSeason(index) {
  currentSeasonIndex = index;
  currentEpisodeIndex = 0; // Reset episode when changing season? Or keep same index? Usually reset or 0.
  localStorage.setItem("lastSeasonIndex", currentSeasonIndex);

  renderSeasons();
  renderEpisodes();
  loadEpisode(0);
}

// Render Episodes Strip
function renderEpisodes() {
  episodesStrip.innerHTML = "";
  const episodes = seasons[currentSeasonIndex]?.episodes || []; // Safety check
  const t = translations[currentLang];

  episodes.forEach((episode, index) => {
    const episodeEl = document.createElement("div");
    episodeEl.classList.add("episode-item");
    // Generate Title
    episodeEl.textContent = `${t.episode} ${episode.id}`;
    if (index === currentEpisodeIndex) {
      episodeEl.classList.add("active");
    }

    episodeEl.addEventListener("click", () => {
      loadEpisode(index);
    });

    episodesStrip.appendChild(episodeEl);
  });
}

// Load Episode
function loadEpisode(index, autoScroll = true) {
  const episodes = seasons[currentSeasonIndex].episodes;
  if (index < 0 || index >= episodes.length) return;

  currentEpisodeIndex = index;
  localStorage.setItem("lastSeasonIndex", currentSeasonIndex);
  localStorage.setItem("lastEpisodeIndex", currentEpisodeIndex);

  const episode = episodes[currentEpisodeIndex];

  // Update Iframe
  videoFrame.src = episode.url;

  // Update Header
  updateHeader(seasons[currentSeasonIndex].id, episode.id);

  // Update UI
  renderEpisodes();
  updateButtons();

  // Scroll active episode into view
  if (autoScroll) {
    const activeEl = episodesStrip.children[currentEpisodeIndex];
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }
}

function updateHeader(seasonId, episodeId) {
  const t = translations[currentLang];
  const fullTitle = `${t.siteTitle} ${t.season} ${seasonId} : ${t.episode} ${episodeId}`;

  if (episodeHeader) {
    episodeHeader.textContent = fullTitle;
  }

  document.title = fullTitle;
}

// Update Button States
function updateButtons() {
  const episodes = seasons[currentSeasonIndex].episodes;
  prevBtn.disabled = currentEpisodeIndex === 0;
  nextBtn.disabled = currentEpisodeIndex === episodes.length - 1;
}

async function handleShare() {
  const t = translations[currentLang];
  const season = seasons[currentSeasonIndex];
  const episode = season.episodes[currentEpisodeIndex];
  const shareTitle = `${t.siteTitle} - ${t.season} ${season.id} : ${t.episode} ${episode.id}`;
  const shareUrl = episode.url;

  if (navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareTitle,
        url: shareUrl,
      });
    } catch (err) {
      console.log("Error sharing:", err);
    }
  } else {
    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert(t.copied);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  }
}

// Event Listeners
prevBtn.addEventListener("click", () => {
  if (currentEpisodeIndex > 0) {
    loadEpisode(currentEpisodeIndex - 1);
  }
});

nextBtn.addEventListener("click", () => {
  const episodes = seasons[currentSeasonIndex].episodes;
  if (currentEpisodeIndex < episodes.length - 1) {
    loadEpisode(currentEpisodeIndex + 1);
  }
});

shareBtn.addEventListener("click", handleShare);

langToggle.addEventListener("click", () => {
  const newLang = currentLang === "ar" ? "en" : "ar";
  updateLanguage(newLang);
});

// Run Init
init();
