// Mock Data for Seasons and Episodes
const translations = {
  ar: {
    siteTitle: "المؤسس أورهان",
    season: "الموسم",
    episode: "الحلقة",
    next: "التالي",
    prev: "السابق",
    langBtn: "English",
  },
  en: {
    siteTitle: "Founder Orhan",
    season: "Season",
    episode: "Episode",
    next: "Next",
    prev: "Previous",
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
        url: "https://qq.okprime.site/embed-vn8imcfz4xdv.html?autoplay=1&muted=1",
      },
      {
        id: 2,
        title: "الحلقة 2",
        url: "https://rty1.film77.xyz/embed-a1h1tdocywyz.html?autoplay=1&muted=1",
      },
      {
        id: 3,
        title: "الحلقة 3",
        url: "https://qq.okprime.site/embed-lf6g6wqvjatx.html?autoplay=1&muted=1",
      },
      {
        id: 4,
        title: "الحلقة 4",
        url: "https://qq.okprime.site/embed-bumhoflejl04.html?autoplay=1&muted=1",
      },
      {
        id: 5,
        title: "الحلقة 5",
        url: "https://rty1.film77.xyz/embed-arvcmo1bibfj.html?autoplay=1&muted=1",
      },
      {
        id: 6,
        title: "الحلقة 6",
        url: "https://qq.okprime.site/embed-zm17axlmx11j.html?autoplay=1&muted=1",
      },
      {
        id: 7,
        title: "الحلقة 7",
        url: "https://qq.okprime.site/embed-za8gtfrzf0qb.html?autoplay=1&muted=1",
      },
      {
        id: 8,
        title: "الحلقة 8",
        url: "https://rty1.film77.xyz/embed-ruh8cl82vjl4.html?autoplay=1&muted=1",
      },
      {
        id: 9,
        title: "الحلقة 9",
        url: "https://qq.okprime.site/embed-7xxo1vm1dia0.html?autoplay=1&muted=1",
      },
      {
        id: 10,
        title: "الحلقة 10",
        url: "https://qq.okprime.site/embed-2ezbdj3m37um.html?autoplay=1&muted=1",
      },
      {
        id: 11,
        title: "الحلقة 11",
        url: "https://qq.okprime.site/embed-wrr9gqv8cqgg.html?autoplay=1&muted=1",
      },
      {
        id: 12,
        title: "الحلقة 12",
        url: "https://qq.okprime.site/embed-2b33coh6okq4.html?autoplay=1&muted=1",
      },
      {
        id: 13,
        title: "الحلقة 13",
        url: "https://qq.okprime.site/embed-r9vtaaal8gzq.html?autoplay=1&muted=1",
      },
      {
        id: 14,
        title: "الحلقة 14",
        url: "https://qq.okprime.site/embed-pmnz36mfvd87.html?autoplay=1&muted=1",
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

  // Update Buttons
  // Note: Icons should swap position or just be consistent?
  // In RTL: "Текст <icon>" (flex-row). In LTR: "Text <icon>" (flex-row).
  // Current HTML: Text <i> for Next, <i> Text for Prev.
  // We can update HTML innerHTML for buttons to match direction perfectly or just change text string if structure is simple.
  // Next Btn: id="next-btn". innerHTML was `التالي <i class="..."></i>`
  // Prev Btn: id="prev-btn". innerHTML was `<i class="..."></i> السابق`

  const nextIcon = '<i class="fas fa-chevron-left"></i>';
  const prevIcon = '<i class="fas fa-chevron-right"></i>';

  if (lang === "ar") {
    nextBtn.innerHTML = `${t.next} ${nextIcon}`;
    prevBtn.innerHTML = `${prevIcon} ${t.prev}`;
    langText.textContent = "English"; // Btn shows target language
  } else {
    // In English/LTR, Next is typically on the right with arrow pointing right >
    // But here "Next" moves to next episode (sequence).
    // Visual arrow: Next (Left arrow? No, typically Right arrow for next).
    // Current Arabic: Next (Left Arrow) -> Logic: Next item in list?
    // Let's stick to logical icons.
    // Arabic: Next (Left in RTL is "Forward"?) No, usually Left is Back in RTL, Right is Forward.
    // Wait, standard UI:
    // RTL: Right -> Start, Left -> End.
    // Next Episode -> usually "Left" direction?
    // Let's keep the icons as they were for now to avoid confusion, or flip them if needed.
    // Original: Next [Chevron Left]. Prev [Chevron Right].
    // If RTL, Left = Flow direction?
    // Let's just swap text and keep specific icons if they match the visual flow.
    // English: Next text. Icon? usually Right >.
    // Arabic: Next text. Icon? usually Left <.

    // Let's simply update text and keep structure.
    // For English:
    nextBtn.innerHTML = `${t.next} <i class="fas fa-chevron-right"></i>`; // Standard LTR Next
    prevBtn.innerHTML = `<i class="fas fa-chevron-left"></i> ${t.prev}`; // Standard LTR Prev
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
  // Optionally load the first episode of the new season automatically
  // loadEpisode(0);
  // User asked: "when I choose season it brings its episodes". Use renderEpisodes to show them.
  // Assuming user wants to continue watching or pick one.
  // But if we switched context, maybe we should update the player?
  // Let's load the first episode of the new season to be safe/standard.
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

langToggle.addEventListener("click", () => {
  const newLang = currentLang === "ar" ? "en" : "ar";
  updateLanguage(newLang);
});

// Run Init
init();
