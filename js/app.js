// Mock Data for Seasons and Episodes
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

// Initialize
function init() {
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

// Render Seasons Strip
function renderSeasons() {
  if (!seasonsStrip) return;
  seasonsStrip.innerHTML = "";

  seasons.forEach((season, index) => {
    const seasonEl = document.createElement("div");
    seasonEl.classList.add("season-item");
    seasonEl.textContent = season.title;

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
  const episodes = seasons[currentSeasonIndex].episodes;

  episodes.forEach((episode, index) => {
    const episodeEl = document.createElement("div");
    episodeEl.classList.add("episode-item");
    episodeEl.textContent = episode.title;
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
  updateHeader(seasons[currentSeasonIndex].title, episode.title);

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

function updateHeader(seasonTitle, episodeTitle) {
  const fullTitle = `المؤسس أورهان ${seasonTitle} : ${episodeTitle}`;

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

// Run Init
init();
