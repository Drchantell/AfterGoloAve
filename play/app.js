import {clubAction, clubRoom, cabView, membershipPanel, tier} from "./club.js";
import { cities, communities, people, conversation } from "./data.js";

const strokes = {
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  diagonal: '<path d="M6 18 18 6M8 6h10v10"/>',
  back: '<path d="M20 12H5m6 6-6-6 6-6"/>',
  pin: '<path d="M20 10c0 5-8 10-8 10S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  video: '<rect x="3" y="6" width="12" height="12" rx="2"/><path d="m15 10 6-3v10l-6-3"/>',
  game: '<path d="M7 8h10c3 0 5.3 6.8 3 8.6-1.7 1.2-3.5-1.6-4.5-1.6h-7c-1 0-2.8 2.8-4.5 1.6C1.7 14.8 4 8 7 8Z"/><path d="M7 10v4m-2-2h4m6 .5h.1m2.9-1h.1"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 19v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2m1-14a3 3 0 0 1 0 6m5 8v-2a4 4 0 0 0-3-4"/>',
  sparkle: '<path d="M12 2c0 6-4 10-10 10 6 0 10 4 10 10 0-6 4-10 10-10-6 0-10-4-10-10Z"/>',
  heart: '<path d="M12 20 4 12a4.5 4.5 0 0 1 6.4-6.4L12 7.2l1.6-1.6A4.5 4.5 0 0 1 20 12Z"/>',
  lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 4v2"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  refresh: '<path d="M20 7v5h-5M4.4 10a8 8 0 1 1 1.6 7"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',
  pause: '<path d="M9 5v14m6-14v14"/>',
  play: '<path d="m8 5 11 7-11 7Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19m0-14-1.5 1.5m-11 11L5 19"/>',
  moon: '<path d="M20 15A8.3 8.3 0 0 1 9 4a8.5 8.5 0 1 0 11 11Z"/>',
  music: '<path d="M9 18V5l12-2v13M9 8l12-2"/><ellipse cx="6" cy="18" rx="3" ry="2"/><ellipse cx="18" cy="16" rx="3" ry="2"/>',
  bookmark: '<path d="M6 4h12v16l-6-4-6 4Z"/>'
};
const icon = (name) => `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${strokes[name]}</svg>`;

const app = document.querySelector("main");
const themeSwitch = document.querySelector("#theme-switch");
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const state = {
  city: "charlotte",
  filter: "all",
  guest: cities.charlotte.people[0],
  game: null,
  call: { phase: "lobby", prompt: 0 },
  exchange: null,
};

let currentView = "";
let cameraStream = null;
let cameraRequest = 0;
let callClock = null;
const soundtrackAudio = new Audio();
soundtrackAudio.loop = true;
soundtrackAudio.preload = "none";
let soundtrackRequest = 0;
let soundtrackCity = null;

function getPreference(name) {
  try { return localStorage.getItem(`face2face-${name}`); } catch { return null; }
}

function setPreference(name, value) {
  try { localStorage.setItem(`face2face-${name}`, value); } catch {}
}

let theme = getPreference("theme") === "light" ? "light" : "dark";
let motion = getPreference("motion");
let savedCities = [];
let datePlans = {};
try {
  const saved = JSON.parse(getPreference("saved-cities") || "[]");
  if (Array.isArray(saved)) savedCities = saved;
  const plans = JSON.parse(getPreference("date-plans") || "{}");
  if (plans && typeof plans === "object" && !Array.isArray(plans)) datePlans = plans;
} catch {}

function syncPreferences() {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content = theme === "light" ? "#faf7ff" : "#0b0910";
  themeSwitch.innerHTML = theme === "light" ? `${icon("moon")}Dark mode` : `${icon("sun")}Light mode`;
  const moving = motion ? motion === "on" : !motionPreference.matches;
  document.documentElement.dataset.motion = moving ? "on" : "off";
  const control = document.querySelector("#motion-control");
  if (control) control.innerHTML = moving ? `${icon("pause")}Pause motion` : `${icon("play")}Play motion`;
}

themeSwitch.addEventListener("click", () => {
  theme = theme === "light" ? "dark" : "light";
  setPreference("theme", theme);
  syncPreferences();
});
motionPreference.addEventListener("change", syncPreferences);

const currentCity = () => cities[state.city];
const currentGuest = () => people[state.guest];
const cityArt = (cityId) => `--city-art:url('assets/${cityId}.webp');--tone:${cities[cityId].tone}`;
const route = (page, city = state.city, guest = "") => `#${page}/${city}${guest ? "/" + guest : ""}`;
const countryFor = (city) => city.country || city.region.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase());
const regionNames = {
  brooklyn: "New York", manhattan: "New York", seoul: "Seoul", london: "England",
  paris: "Île-de-France", tokyo: "Tokyo Metropolis", toronto: "Ontario",
  kingston: "Kingston Parish", "mexico-city": "Mexico City", lagos: "Lagos State",
  rio: "Rio de Janeiro", montreal: "Québec", berlin: "Berlin", amsterdam: "North Holland",
  ibiza: "Balearic Islands", barcelona: "Catalonia", madrid: "Community of Madrid",
  lisbon: "Lisbon District", "buenos-aires": "Autonomous City of Buenos Aires",
  medellin: "Antioquia", cartagena: "Bolívar", "cape-town": "Western Cape",
  johannesburg: "Gauteng", accra: "Greater Accra", bangkok: "Bangkok", bangalore: "Karnataka",
  "washington-dc": "District of Columbia"
};
const regionFor = id => regionNames[id] || cities[id].region.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase());
const alphabetic = new Intl.Collator("en", { sensitivity: "base" }).compare;
const countries = [...new Set(Object.values(cities).map(countryFor))].sort(alphabetic);
const cityIds = Object.keys(cities).sort((a, b) => alphabetic(cities[a].name, cities[b].name));
const options = names => names.map(name => `<option>${name}</option>`).join("");
let savedOnly = false;

function plannedActivity() {
  return currentCity().picks[datePlans[state.city]];
}

function planNote() {
  const activity = plannedActivity();
  return activity ? `<p class="plan-note">${icon("pin")} Your ${currentCity().name} plan includes <strong>${activity}</strong>.</p>` : "";
}

function link(text, href, style = "primary", symbol = "arrow") {
  return `<a class="button button-${style}" href="${href}">${text}${symbol ? icon(symbol) : ""}</a>`;
}

function button(text, action, style = "primary", symbol = "", data = "") {
  return `<button class="button button-${style}" type="button" data-action="${action}" ${data}>${text}${symbol ? icon(symbol) : ""}</button>`;
}

function pageIntro(subtitle, title, copy) {
  return `<div class="page-intro"><p class="eyebrow">${subtitle}</p><h1 tabindex="-1">${title}</h1><p class="lead">${copy}</p></div>`;
}

function cityBack() {
  return `<a class="back" href="${route("city")}">${icon("back")}${currentCity().name}</a>`;
}

function cityCards(featuredOnly = false) {
  const featured = ["charlotte", "houston", "atlanta", "manhattan", "brooklyn"];

  return (featuredOnly ? featured : cityIds).map(id => [id,cities[id]]).map(([id, city]) => `
    <a class="city-card" href="${route("city", id)}" ${featuredOnly ? "" : `data-destination="${id}"`} style="${cityArt(id)}">
      <span class="city-glint" aria-hidden="true"></span>
      <div class="city-card-meta"><span>${icon("pin")}${featuredOnly ? city.region : regionFor(id) + " · " + countryFor(city)}</span><span class="city-arrow">${icon("diagonal")}</span></div>
      <div class="city-card-copy"><h3>${id === "manhattan" ? "NYC · Manhattan" : city.name}</h3><p>${city.description}</p></div>
    </a>`).join("");
}

function steps() {
  return `<section class="how shell" aria-labelledby="how-title">
    <div class="how-head"><p class="eyebrow">A NIGHT ON AfterGlowave.com</p><h2 id="how-title">Make the first move.</h2></div>
    <div class="step-grid">
      <article><div class="step-icon mint">${icon("users")}</div><h3>Find your community</h3><p>Browse guests by community and meet people across genders.</p><a class="text-link" href="#communities">Browse communities ${icon("arrow")}</a></article>
      <article><div class="step-icon turquoise">${icon("game")}</div><h3>Break the ice</h3><p>Play three quick rounds of City Spark and see which plans you both pick.</p><a class="text-link" href="#game">Play for free ${icon("arrow")}</a></article>
      <article><div class="step-icon violet">${icon("video")}</div><h3>Meet face to face</h3><p>Try a practice video date and take turns with conversation prompts.</p><a class="text-link" href="#video">Try the Video Lounge ${icon("arrow")}</a></article>
    </div>
  </section>`;
}

let nightPick = 0;
let venueStop = 0;
const nightRoute = (city, pick) => `#night/${city}/${pick}`;
const nightPrompts = [
  "You get the first song. What are you playing, and who put you onto it?",
  "We have one free hour before the next stop. Where are you taking me?",
  "What little detail would make this a night you would remember?"
];

function nightSpotlight() {
  const now = new Date();
  const day = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000;
  const cards = [["charlotte", "Charlotte"], ["atlanta", "Atlanta"], ["manhattan", "NYC"], ["brooklyn", "Brooklyn"]].map(([id, label]) => {
    const city = cities[id];
    return `<article class="night-card"><img src="assets/${id}.webp" alt="" loading="lazy">
      <div><h2>One night in ${label}.</h2><p>${city.lounge} · ${city.soundtrack.genre}</p>
      ${link("Build a date card", nightRoute(id, day % city.picks.length), "primary", "heart")}</div></article>`;
  });
  return `<section class="shell spotlight city-nights" aria-label="Tonight’s city picks">${cards.join("")}</section>`;
}

function nightView() {
  const city = currentCity();
  return `<section class="shell date-night"><a class="back" href="${route("city")}">${icon("back")} ${city.name}</a>
    <div class="night-card"><img src="assets/${state.city}.webp" alt="" />
    <div><p class="eyebrow">AFTERGLOW DATE CARD · ${city.name.toUpperCase()}</p>
    <h1 tabindex="-1">${city.picks[nightPick]}</h1><p>Meet at ${city.lounge}. Put on some ${city.soundtrack.genre}.</p>
    <blockquote>${nightPrompts[nightPick]}</blockquote>
    <div class="actions">${link("Try the video lounge", route("video"), "primary", "video")}
    ${button("Invite a date", "invite-date", "primary", "heart")}
    ${button("Copy date link", "share-night", "soft", "heart")}</div>
    <p id="share-status" role="status"></p></div></div>
    <h2>Choose your first stop</h2><div class="actions night-picks">${city.picks.map((pick,i) =>
      `<a class="button button-soft" href="${nightRoute(state.city,i)}" ${i === nightPick ? 'aria-current="true"' : ""}>${pick}</a>`).join("")}</div>
    </section>`;
}

function partyStage(cityId) {
  return `<section class="shell ave-stage" aria-label="Rooftop DJ booth" style="${cityArt(cityId)}">
    <ave-party></ave-party>
    <div class="ave-console"><h2>Rooftop DJ</h2>
    ${button("Play the Ave mashup", "soundtrack", "ghost", "music", 'data-track-city="ave-mix"')}
    <small role="status" data-mix-status></small></div></section>`;
}

function homeView() {
  return `<section class="hero" aria-labelledby="home-heading">
    <div class="club-effects" aria-hidden="true">
      <i class="club-beam"></i><i class="club-beam"></i><i class="club-beam"></i>
      <i class="club-orb"></i><i class="club-orb"></i><i class="club-orb"></i>
    </div>
    <div class="shell hero-inner">
      <div class="hero-copy">
        <p class="eyebrow hero-kicker">${icon("sparkle")} THE VIDEO-FIRST DATING CLUB</p>
        <h1 id="home-heading" tabindex="-1">Meet me on <em>the Ave.</em></h1>
        <p>Pick a city. Meet face to face. Plan a rooftop night, trade icebreakers, and try the video lounge.</p>
        <div class="actions">${link("Explore the cities", "#explore")}${link("Play together", "#club", "ghost", "game")}</div>

      </div>
      <button class="motion-control" type="button" id="motion-control" data-action="toggle-motion">Pause motion</button>
    </div>
  </section>
  ${partyStage("charlotte")}
  ${nightSpotlight()}
  <section class="shell destinations" id="destinations" aria-labelledby="destinations-title">
    <div class="section-head">
      <div><p class="eyebrow">EXPLORE THE WORLD</p><h2 id="destinations-title" tabindex="-1">Where to tonight?</h2></div>
      <p>Every city has its own spots to play, meet, and start a video conversation.</p>
    </div>
    <div class="city-grid featured-destinations">${cityCards(true)}</div>
    <details class="destination-directory"><summary>Browse nightlife by country</summary>
    <div class="location-fields">
      <label>Country<select id="directory-country" aria-controls="directory-region city-grid"><option value="">All countries</option>${options(countries)}</select></label>
      <label>State or region<select id="directory-region" aria-controls="city-grid" disabled><option value="">Choose a country first</option></select></label>
    </div>
    <div class="destination-tools">
      <input id="destination-search" type="search" placeholder="Search cities, regions or countries" aria-label="Search cities, regions or countries" aria-controls="city-grid">
      ${button("Surprise me", "random-city", "soft", "sparkle")}
      ${button("Saved cities", "saved-only", "soft", "bookmark", 'aria-pressed="false"')}
    </div>
    <div class="country-soundtracks" id="country-soundtracks" hidden></div>
    <p class="destination-count" id="destination-count" role="status">${Object.keys(cities).length} destinations</p>
    <div class="city-grid" id="city-grid">${cityCards()}</div>
    </details>
  </section>${steps()}`;
}

function cityView() {
  const city = currentCity();
  return `<section class="city-hero" style="${cityArt(state.city)}"><div class="shell">
    <a class="back" href="#explore">${icon("back")} All cities</a>
    <p class="eyebrow">${city.region} / ${city.zone}</p><h1 tabindex="-1">${city.name}</h1><p class="lead">${city.story}</p>
    <div class="actions">${link("Ride the elevator", route("club",state.city,"0"), "primary", "arrow")}${link("Take a city cab", route("cab"), "ghost", "pin")}
      ${link("Make a date card", nightRoute(state.city, datePlans[state.city] || 0), "soft", "heart")}
      ${button(savedCities.includes(state.city) ? "Saved city" : "Save city", "save-city", "ghost", "bookmark", `aria-pressed="${savedCities.includes(state.city)}"`)}</div>
    ${city.soundtrack ? `<div class="city-sound">
      ${button("Play soundtrack", "soundtrack", "ghost", "music", `data-track-city="${state.city}"`)}
      <span>${city.soundtrack.genre}</span><small data-soundtrack-status role="status"></small>
    </div>` : ""}
  </div></section>
  <section class="shell sub-section" aria-labelledby="spots-title">
    <div class="section-head"><div><p class="eyebrow">FIND YOUR SPOT</p><h2 id="spots-title">Places to go</h2></div></div>
    <div class="step-grid">
      <article><div class="step-icon turquoise">${icon("video")}</div><h3>${city.lounge}</h3><p>Start a practice video date with a demo guest.</p><a class="text-link" href="${route("video")}">Enter lounge ${icon("arrow")}</a></article>
      <article><div class="step-icon mint">${icon("game")}</div><h3>${city.arcade}</h3><p>Play a free icebreaker with date picks made for ${city.name}.</p><a class="text-link" href="${route("game")}">Play City Spark ${icon("arrow")}</a></article>
      <article><div class="step-icon violet">${icon("pin")}</div><h3>${city.hangout}</h3><p>${city.hangoutCopy}</p><a class="text-link" href="${route("communities")}">Find company ${icon("arrow")}</a></article>
    </div>
    <div class="plan-panel">
      <div><p class="eyebrow">PLAN A DATE</p><h2>Pick your first stop</h2><p>Choose a city activity to bring into your game and video date.</p></div>
      <div class="plan-choices" role="group" aria-label="Choose a date activity">
        ${city.picks.map((pick, index) => button(pick, "plan", "soft", "", `data-index="${index}" aria-pressed="${Number(datePlans[state.city]) === index}"`)).join("")}
      </div>
      <p id="plan-status" class="plan-status" role="status">${plannedActivity() ? `Saved for your date: ${plannedActivity()}.` : ""}</p>
    </div>
  </section>`;
}

function stopSoundtrack() {
  soundtrackRequest++;
  soundtrackAudio.pause();
  soundtrackCity = null;
  updateSoundtrackButtons();
}

function updateSoundtrackButtons() {
  app.querySelectorAll("[data-track-city]").forEach(control => {
    const playing = control.dataset.trackCity === soundtrackCity;
    const countryPreview = control.hasAttribute("data-country-track");
    const city = cities[control.dataset.trackCity];
    const label = control.dataset.trackCity === "ave-mix" ? "the Ave mashup" : countryPreview ? city.name + " · " + city.soundtrack.genre : "soundtrack";
    control.innerHTML = `${playing ? "Pause" : "Play"} ${label}${icon(playing ? "pause" : "music")}`;
  });
}

async function toggleSoundtrack(control) {
  const cityId = control.dataset.trackCity;
  const track = cityId === "ave-mix" ? { file: "ave-mashup.mp3" } : cities[cityId].soundtrack;
  if (soundtrackCity === cityId) {
    stopSoundtrack();
    return;
  }
  const request = ++soundtrackRequest;
  if (!soundtrackAudio.src.endsWith("/" + track.file)) soundtrackAudio.src = "assets/" + track.file;
  const status = app.querySelector(cityId === "ave-mix" ? "[data-mix-status]" : "[data-soundtrack-status]");
  status.textContent = "";
  control.disabled = true;
  try {
    await soundtrackAudio.play();
    if (request === soundtrackRequest) {
      soundtrackCity = cityId;
      updateSoundtrackButtons();
    }
  } catch {
    if (request === soundtrackRequest) {
      stopSoundtrack();
      status.textContent = "Soundtrack unavailable. Try again.";
    }
  } finally {
    control.disabled = false;
  }
}

function profileCard(id) {
  const person = people[id];
  return `<article class="profile-card">
    <div class="profile-image"><img src="assets/${id}.webp" alt="" decoding="async"><span>Demo guest</span></div>
    <div class="profile-info">
      <h2>${person.name}, ${person.age}</h2><p class="pronouns">${person.pronouns}</p>
      <div class="labels">${person.labels.map((label) => `<span>${label}</span>`).join("")}</div>
      <p class="bio">${person.bio}</p>
      ${link("Try a video date", route("video", state.city, id), "soft", "video")}
    </div>
  </article>`;
}

function communityView() {
  const active = communities.find(({id}) => id === state.filter);
  const lineup = state.filter === "all"
    ? [...new Set([...currentCity().people, ...Object.keys(people)])]
    : Object.keys(people).filter((id) => people[id].tags.includes(state.filter));
  return `<section class="shell page">
    ${cityBack()}
    ${pageIntro("COMMUNITIES", "Meet as you are.", "Explore demo guests who identify with the communities below. Choose any space and switch whenever you like. All genders are welcome.")}
    <div class="filters" role="group" aria-label="Filter by community">
       ${communities.map((tag) => `<button class="filter" type="button" aria-pressed="${tag.id === active.id}" data-action="filter" data-id="${tag.id}">${tag.name}</button>`).join("")}
    </div>
    <p class="result-note" role="status">${active.intro} <span>${lineup.length} demo ${lineup.length === 1 ? "guest" : "guests"}</span></p>
    <div class="profile-grid">${lineup.map(profileCard).join("")}</div>
  </section>`;
}

function gameQuestions() {
  return [
    { question: `Your first stop in ${currentCity().name}?`, options: currentCity().picks },
    { question: "Pick the soundtrack for the night.", options: ["Old-school R&B", "Indie mix", "Whatever’s live"] },
    { question: "How are you ending the evening?", options: ["Dessert for two", "A long walk", "One more game"] }
  ];
}

function gameStage() {
  const game = state.game;
  if (!game) {
    return `<div class="game-panel game-idle">
      <div class="game-symbol">${icon("game")}</div><p class="eyebrow">FREE ICEBREAKER</p>
      <h2>Three rounds. Three picks.</h2><p>Guess what your demo guest would choose, or just go with your gut.</p>
      ${button("Start the game", "start-game", "primary", "arrow")}
    </div>`;
  }

  const guest = currentGuest();
  const questions = gameQuestions();
  if (game.round >= questions.length) {
    const shared = questions.flatMap(({options}, index) => {
      const pick = game.picks[index];
      return pick === guest.tastes[index] ? [options[pick]] : [];
    });
    const recap = shared.length ? `You both picked ${shared.join(" · ")}.` : "You picked different things. Ask your guest what made their choices stand out.";
    return `<div class="game-panel game-idle">
      <div class="game-symbol">${icon("sparkle")}</div><p class="eyebrow">GAME COMPLETE</p>
      <h2 tabindex="-1" id="game-focus">${shared.length} of 3 picks matched</h2><p>${recap}</p>
      <div class="actions">${link("Try a video date", route("video", state.city, state.guest), "primary", "video")}${button("Play again", "start-game", "ghost", "refresh")}</div>
    </div>`;
  }

  const question = questions[game.round];
  const answer = game.picks[game.round];
  const guestPick = guest.tastes[game.round];
  return `<div class="game-panel game-round">
    <div class="round-progress"><p class="eyebrow">ROUND ${game.round + 1} / ${questions.length}</p>
      <div class="progress-dots" aria-hidden="true">${questions.map((_, i) => `<span class="${i <= game.round ? "filled" : ""}"></span>`).join("")}</div>
    </div>
    <h2 tabindex="-1" id="game-focus">${question.question}</h2>
    <div class="choices">${question.options.map((option, index) => {
      const style = answer === index ? "chosen" : "";
      return `<button class="choice ${style}" type="button" data-action="pick" data-index="${index}" ${answer === undefined ? "" : "disabled"}><span>${option}</span>${icon(answer === index ? "check" : "arrow")}</button>`;
    }).join("")}</div>
    ${answer === undefined ? "" : `<div class="game-feedback" role="status"><p>${answer === guestPick ? "Same pick!" : "Different picks!"} ${guest.name} chose <strong>${question.options[guestPick]}</strong>.</p>
    ${button(game.round < questions.length - 1 ? "Next round" : "See results", "next-round", "soft", "arrow", 'id="game-next"')}</div>`}
  </div>`;
}

function guestSelect(page) {
  const ids = [...new Set([...currentCity().people, ...Object.keys(people)])];
  return `<label class="select-label" for="guest-picker">Demo guest</label>
    <select id="guest-picker" data-page="${page}">${ids.map((id) => `<option value="${id}" ${id === state.guest ? "selected" : ""}>${people[id].name} (${people[id].pronouns})</option>`).join("")}</select>`;
}

function gameView() {
  return `<section class="shell page">
    ${cityBack()}
    ${pageIntro("FREE GAME / " + currentCity().name.toUpperCase(), "City Spark", "Pick a date plan, a soundtrack, and a way to wind down. Compare your choices with a demo guest.")}
    ${planNote()}
    <div class="side-layout">
      ${gameStage()}
      <aside class="side-panel">
        <p class="eyebrow">YOUR GAME PARTNER</p><img class="guest-avatar" src="assets/${state.guest}.webp" alt="">
        <h2>${currentGuest().name}</h2><p>${currentGuest().bio}</p>
        ${guestSelect("game")}
        <p class="panel-note">You can play the full game for free. Changing guests starts a new game.</p>
      </aside>
    </div>
  </section>`;
}

function timeLabel() {
  const number = Math.max(0, Math.floor((Date.now() - state.call.started) / 1000));
  return `${String(Math.floor(number / 60)).padStart(2, "0")}:${String(number % 60).padStart(2, "0")}`;
}

function videoStage() {
  const { phase, prompt } = state.call;
  const guest = currentGuest();
  if (phase === "complete") {
    return `<div class="game-panel game-idle">
      <div class="game-symbol">${icon("check")}</div><p class="eyebrow">PRACTICE DATE COMPLETE</p>
      <h2 id="video-focus" tabindex="-1">Thanks for meeting ${guest.name}.</h2>
      <p>You can explore the optional contact exchange or head back into the lounge.</p>
      <div class="actions">${link("See contact exchange", route("plus"), "primary", "lock")}${button("Back to lobby", "back-lobby", "ghost", "arrow")}</div>
    </div>`;
  }

  const active = phase === "active";
  const caption = active ? [guest.prompt, ...conversation][prompt] : "Your guest is ready for a practice date.";
  return `<div class="video-stage">
    <div class="screen ${active ? "is-active" : ""}">
      <img class="video-portrait" src="assets/${state.guest}.webp" alt="">
      <div class="screen-top"><span><b></b>${active ? "PRACTICE DATE" : "VIDEO LOBBY"}</span>${active ? `<span id="call-clock">${timeLabel()}</span>` : ""}</div>
      <div class="screen-bottom"><div><strong>${guest.name}</strong><small>Demo guest · ${guest.pronouns}</small></div>
        <div class="self-preview">
          <video id="self-video" autoplay muted playsinline hidden></video>
          <div id="camera-placeholder">${icon("video")}</div>
          <span>You</span>
        </div>
      </div>
    </div>
    <div class="video-bar">
      ${button(cameraStream ? "Turn camera off" : "Preview my camera", "camera", "ghost", "video", 'id="camera-button"')}
      ${active ? button("End practice date", "end-call", "danger", "close") : button("Start practice date", "start-call", "primary", "video")}
    </div>
    <p id="camera-status" class="panel-note camera-note" role="status">Camera is optional and visible only to you.</p>
    <div class="conversation" ${active ? 'aria-live="polite"' : ""}><div class="step-icon mint">${icon("sparkle")}</div><div><p class="eyebrow">${active ? "CONVERSATION PROMPT" : "IN THE LOBBY"}</p><p id="call-prompt">${caption}</p></div>
      ${active ? button("Next prompt", "next-prompt", "soft", "arrow", 'id="prompt-next"') : ""}
    </div>
  </div>`;
}

function videoView() {
  return `<section class="shell page">
    ${cityBack()}
    ${pageIntro("VIDEO LOUNGE / " + currentCity().name.toUpperCase(), currentCity().lounge, "Try a video-first date at your own pace. Your guest and conversation prompts are simulated.")}
    ${planNote()}
    <div class="side-layout">
      ${videoStage()}
      <aside class="side-panel">
        <p class="eyebrow">MEET THE DEMO GUEST</p><img class="guest-avatar" src="assets/${state.guest}.webp" alt="">
        <h2>${currentGuest().name}</h2><p>${currentGuest().bio}</p>
        ${guestSelect("video")}
        <p class="panel-note">Start when you’re ready, skip prompts, or end the practice date anytime.</p>
      </aside>
    </div>
  </section>`;
}

function exchangeStage() {
  const exchange = state.exchange;
  if (tier === "free") {
    return `<h2>Contact exchange stays locked</h2><p>Preview the upgrade to see how a request works after a date.</p>${button("Preview the upgrade", "preview-plus", "primary", "arrow")}`;
  }
  if (!exchange) {
    return `<h2>Try a practice date first</h2><p>After the date, return here to test a contact request with your demo guest.</p>${link("Go to the Video Lounge", route("video"), "primary", "video")}`;
  }

  const guest = people[exchange.id];
  if (exchange.decision === "yes") {
    return `<h2>Both guests opted in</h2><p>You and ${guest.name} agreed in this demo. Here’s what a contact reveal could look like.</p><div class="demo-contact"><span>Example contact</span><strong>${exchange.id}@example.com</strong></div>${button("Reset exchange demo", "reset-exchange", "ghost", "refresh")}`;
  }
  if (exchange.decision === "no") {
    return `<h2>${guest.name} passed</h2><p>The exchange stays locked. Either guest can decide to keep the conversation in AfterGlowave.com.</p>${button("Reset exchange demo", "reset-exchange", "ghost", "refresh")}`;
  }

  return `<h2>Ask ${guest.name} to exchange contacts</h2>
    <p>You’ve finished a practice date. Choose whether to send a simulated request.</p>
    <div class="actions">${button("Send demo request", "request-contact", "primary", "arrow")}${link("Keep chatting in the app", route("video", exchange.city, exchange.id), "ghost", "video")}</div>`;
}

function plusView() {
  return `<section class="shell page">
    <a class="back" href="${route("video")}">${icon("back")} Video Lounge</a>
    ${pageIntro("OPTIONAL UPGRADE", "AfterGlowAve memberships", "See how a paid upgrade could let two people exchange contact information after a video date.")}
    ${membershipPanel()}
    <div class="play-stage"><div id="exchange-result" tabindex="-1" aria-live="polite">${exchangeStage()}</div></div>
  </section>`;
}

function cameraUI(message) {
  const video = document.querySelector("#self-video");
  if (!video) return;
  const cameraButton = document.querySelector("#camera-button");
  video.srcObject = cameraStream;
  video.hidden = !cameraStream;
  document.querySelector("#camera-placeholder").hidden = Boolean(cameraStream);
  cameraButton.firstChild.textContent = cameraStream ? "Turn camera off" : "Preview my camera";
  cameraButton.disabled = false;
  if (message) document.querySelector("#camera-status").textContent = message;
}

function stopCamera() {
  cameraRequest++;
  cameraStream?.getTracks().forEach((track) => track.stop());
  cameraStream = null;
}

async function toggleCamera() {
  if (cameraStream) {
    stopCamera();
    cameraUI("Camera is off.");
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    cameraUI("Camera preview needs a secure browser connection. You can still try the practice date.");
    return;
  }

  const request = ++cameraRequest;
  document.querySelector("#camera-button").disabled = true;
  document.querySelector("#camera-status").textContent = "Waiting for camera permission…";
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
    if (request !== cameraRequest || currentView !== "video") {
      stream.getTracks().forEach((track) => track.stop());
      return;
    }
    cameraStream = stream;
    cameraUI("Camera preview is on. Only you can see it.");
  } catch {
    if (request === cameraRequest) cameraUI("Camera is unavailable. You can continue the practice date with it off.");
  }
}

function resetCall() {
  clearInterval(callClock);
  stopCamera();
  state.call = { phase: "lobby", prompt: 0 };
}

function render(view) {
  const pages = { home: homeView, city: cityView, communities: communityView, game: gameView, video: videoView, plus: plusView, night: nightView, club: () => clubRoom(state.city,currentCity(),venueStop), cab: () => cabView(state.city,currentCity(),venueStop) };
  app.innerHTML = pages[view]() + (view === "club" ? partyStage(state.city) : "");
  const stage = app.querySelector("ave-party");
  if (stage) stage.player = soundtrackAudio;
  updateSoundtrackButtons();
  const title = app.querySelector("h1").textContent;
  document.title = view === "home" ? "AfterGlowave.com — City Dates" : `${title} · AfterGlowave.com`;
  const selected = ["home", "city"].includes(view) ? "explore" : view;
  document.querySelectorAll("[data-nav]").forEach((item) => {
    if (item.dataset.nav === selected) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });
  if (cameraStream) cameraUI("Camera preview is on. Only you can see it.");
  syncPreferences();
}

function readRoute(initial = false) {
  const [section, city, guest] = location.hash.slice(1).split("/");
  const isExplore = section === "explore";
  const view = ["city","communities","game","video","plus","night","club","cab"].includes(section) ? section : "home";
  const nextCity = Object.hasOwn(cities, city) ? city : state.city;
  const validGuest = Object.hasOwn(people, guest) ? guest : null;
  const changingCity = nextCity !== state.city;
  if (changingCity) {
    state.city = nextCity;
    state.guest = currentCity().people[0];
    state.game = null;
  }
  if (validGuest && validGuest !== state.guest && ["video", "game"].includes(view)) {
    state.guest = validGuest;
    state.game = null;
  }
  if (view === "club") venueStop = /^[0-6]$/.test(guest || "") ? Number(guest) : 1;
  if (view === "cab") venueStop = /^[0-5]$/.test(guest || "") ? Number(guest) : 0;
  if (view === "night") nightPick = /^[0-2]$/.test(guest || "") ? Number(guest) : 0;
  if (currentView === "video") resetCall();
  stopSoundtrack();
  currentView = view;
  savedOnly = false;
  render(view);
  if (!isExplore) app.firstElementChild.classList.add("route-enter");
  if (isExplore) {
    app.querySelector(".destination-directory").open = true;
    const target = document.querySelector("#destinations-title");
    target.focus({preventScroll:true});
    document.querySelector("#destinations").scrollIntoView({block:"start"});
  } else {
    window.scrollTo(0, 0);
    if (!initial) app.querySelector("h1").focus({preventScroll:true});
  }
}

function redraw(focusSelector) {
  render(currentView);
  if (focusSelector) app.querySelector(focusSelector)?.focus({preventScroll:true});
}

function updateDestinations() {
  const normalize = text => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const query = normalize(app.querySelector("#destination-search").value.trim());
  const cards = [...app.querySelectorAll("[data-destination]")];
  const destinationCountry = app.querySelector("#directory-country").value;
  const region = app.querySelector("#directory-region").value;
  let count = 0;
  for (const card of cards) {
    const city = cities[card.dataset.destination];
    const country = countryFor(city);
    const matchesSearch = normalize(`${city.name} ${city.region} ${regionFor(card.dataset.destination)} ${country} ${city.zone} ${card.dataset.destination}`).includes(query);
    card.hidden = !matchesSearch || (destinationCountry !== "" && destinationCountry !== country)
      || (region && region !== regionFor(card.dataset.destination)) || (savedOnly && !savedCities.includes(card.dataset.destination));
    if (!card.hidden) count++;
  }
  const emptyMessage = savedOnly && savedCities.length === 0
    ? "Save a city from its destination page to find it here."
    : "No matching destinations. Try a different city or country.";
  app.querySelector("#destination-count").textContent = count ? `${count} ${count === 1 ? "destination" : "destinations"}` : emptyMessage;
  app.querySelector('[data-action="random-city"]').disabled = count === 0;
}

app.addEventListener("input", (event) => {
  if (event.target.id === "destination-search") updateDestinations();
});

app.addEventListener("click", async (event) => {
  const control = event.target.closest("[data-action]");
  if (!control) return;
  const action = control.dataset.action;
  if (action.startsWith("club-")) {
    clubAction(action.slice(5), control.dataset.value,state.city);
    redraw(currentView === "plus" ? ".page-intro h1" : "#club-focus");
    return;
  }
  switch (action) {
    case "invite-date": {
      const city = currentCity();
      const title = `One night in ${city.name}`;
      const message = `Meet me on the Ave for a night in ${city.name}. My pick is ${city.picks[nightPick]}. What would you pick?`;
      const url = new URL(location.href);
      url.search = "";
      const preview = !["afterglowave.com", "play.afterglowave.com", "www.afterglowave.com"].includes(url.hostname);
      const invitation = preview ? message : message + " " + url.href;
      const status = app.querySelector("#share-status");
      if (navigator.share) {
        try {
          await navigator.share(preview ? { title, text: message } : { title, text: message, url: url.href });
          status.textContent = "Invitation shared.";
          break;
        } catch (error) {
          if (error.name === "AbortError") break;
        }
      }
      try {
        await navigator.clipboard.writeText(invitation);
        status.textContent = "Invitation copied.";
      } catch {
        status.textContent = invitation;
      }
      break;
    }
    case "share-night": {
      const status = document.querySelector("#share-status");
      const url = location.href;
      try {
        await navigator.clipboard.writeText(url);
        status.textContent = "Date link copied.";
      } catch {
        status.textContent = url;
      }
      break;
    }
    case "random-city": {
      const choices = [...app.querySelectorAll("[data-destination]:not([hidden])")].map(card => card.dataset.destination);
      const destinations = choices.length > 1 ? choices.filter(id => id !== state.city) : choices;
      if (destinations.length) location.hash = route("city", destinations[Math.floor(Math.random() * destinations.length)]);
      break;
    }
    case "saved-only":
      savedOnly = !savedOnly;
      control.setAttribute("aria-pressed", String(savedOnly));
      updateDestinations();
      break;
    case "save-city": {
      const alreadySaved = savedCities.includes(state.city);
      savedCities = alreadySaved ? savedCities.filter(id => id !== state.city) : [...savedCities, state.city];
      setPreference("saved-cities", JSON.stringify(savedCities));
      control.setAttribute("aria-pressed", String(!alreadySaved));
      control.innerHTML = `${alreadySaved ? "Save city" : "Saved city"}${icon("bookmark")}`;
      break;
    }
    case "plan": {
      const index = Number(control.dataset.index);
      const clearing = datePlans[state.city] === index;
      if (clearing) delete datePlans[state.city];
      else datePlans[state.city] = index;
      setPreference("date-plans", JSON.stringify(datePlans));
      app.querySelectorAll('[data-action="plan"]').forEach(choice => choice.setAttribute("aria-pressed", String(!clearing && choice === control)));
      app.querySelector("#plan-status").textContent = clearing ? "Date plan cleared." : `Saved for your date: ${plannedActivity()}.`;
      break;
    }
    case "toggle-motion":
      motion = document.documentElement.dataset.motion === "on" ? "off" : "on";
      setPreference("motion", motion);
      syncPreferences();
      break;
    case "soundtrack":
      toggleSoundtrack(control);
      break;
    case "filter":
      state.filter = control.dataset.id;
      redraw(`[data-id="${state.filter}"]`);
      break;
    case "start-game":
      state.game = { round: 0, picks: [] };
      redraw("#game-focus");
      break;
    case "pick":
      state.game.picks[state.game.round] = Number(control.dataset.index);
      redraw("#game-next");
      break;
    case "next-round":
      state.game.round++;
      redraw("#game-focus");
      break;
    case "camera":
      toggleCamera();
      break;
    case "start-call":
      state.call = { phase: "active", prompt: 0, started: Date.now() };
      redraw("#prompt-next");
      callClock = setInterval(() => {
        const clock = document.querySelector("#call-clock");
        if (clock) clock.textContent = timeLabel();
      }, 1000);
      break;
    case "next-prompt":
      state.call.prompt = (state.call.prompt + 1) % (conversation.length + 1);
      document.querySelector("#call-prompt").textContent = [currentGuest().prompt, ...conversation][state.call.prompt];
      break;
    case "end-call":
      resetCall();
      state.call.phase = "complete";
      state.exchange = { id: state.guest, city: state.city, decision: null };
      redraw("#video-focus");
      break;
    case "back-lobby":
      resetCall();
      redraw('[data-action="start-call"]');
      break;
    case "preview-plus":
      clubAction("tier","plus",state.city);
      redraw("#exchange-result");
      break;
    case "request-contact":
      state.exchange.decision = people[state.exchange.id].consent ? "yes" : "no";
      redraw("#exchange-result");
      break;
    case "reset-exchange":
      state.exchange.decision = null;
      redraw("#exchange-result");
      break;
  }
});

app.addEventListener("change", (event) => {
  if (["directory-country", "directory-region"].includes(event.target.id)) {
    stopSoundtrack();
    const country = app.querySelector("#directory-country").value;
    const region = app.querySelector("#directory-region");
    const ids = cityIds.filter(id => countryFor(cities[id]) === country);
    if (event.target.id === "directory-country") {
      region.disabled = !country;
      region.innerHTML = `<option value="">${country ? "All states and regions" : "Choose a country first"}</option>` +
        options([...new Set(ids.map(regionFor))].sort(alphabetic));
    }
    const tracks = ids.filter(id => (!region.value || regionFor(id) === region.value) && cities[id].soundtrack);
    const panel = app.querySelector("#country-soundtracks");
    panel.hidden = !tracks.length;
    panel.innerHTML = tracks.length ? `<details><summary>Play local soundtracks</summary><div class="actions">${tracks.map(id =>
      button(cities[id].name + " · " + cities[id].soundtrack.genre, "soundtrack", "soft", "music", `data-track-city="${id}" data-country-track`)
    ).join("")}</div><small data-soundtrack-status role="status"></small></details>` : "";
    updateDestinations();
    return;
  }
  const picker = event.target.closest("#guest-picker");
  if (!picker || !Object.hasOwn(people, picker.value)) return;
  if (currentView === "video") resetCall();
  state.guest = picker.value;
  state.game = null;
  history.replaceState(null, "", route(picker.dataset.page, state.city, state.guest));
  redraw("#guest-picker");
});

document.querySelector(".skip").addEventListener("click", (event) => {
  event.preventDefault();
  app.focus();
});

window.addEventListener("hashchange", () => readRoute());
window.addEventListener("pagehide", () => {
  resetCall();
  stopSoundtrack();
});
window.addEventListener("pageshow", (event) => {
  if (event.persisted && ["video", "city"].includes(currentView)) redraw();
});
readRoute(true);
