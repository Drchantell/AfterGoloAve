const decks = {
  duet: {
    name: "Same wavelength", symbol: "♥",
    intro: "Make two secret picks on one screen. Reveal what you agree on.",
    cards: [
      ["Our reservation fell through. What now?", "Find a food truck", "Cook together"],
      ["We get the rooftop to ourselves. First move?", "Slow dance", "Count the stars"],
      ["Pick the soundtrack home.", "Old-school favorites", "A brand-new playlist"],
      ["One more stop before home?", "Late-night dessert", "A quiet walk"],
      ["Choose a Saturday surprise.", "A train to somewhere new", "Breakfast in bed"]
    ]
  },
  mime: {
    name: "Silent cinema", symbol: "✦",
    intro: "One of you acts, the other guesses. Trade roles each round.",
    cards: ["Trying to carry six coffees into an elevator", "Teaching a penguin to salsa", "A DJ whose headphones are tangled", "Hailing a cab in the pouring rain", "Singing karaoke while the lyrics disappear", "Sneaking snacks into a movie"]
  }
};
const floors = ["Street lobby", "Couples’ arcade", "Rooftop lounge", "Closet", "City bar", "Open mic", "Smoke shop"];
let play = null;
function shuffled(cards) {
  const out = [...cards];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out.slice(0, 3);
}
const action = (label, id, value = "") => `<button class="button button-soft" type="button" data-action="club-${id}" data-value="${value}">${label}</button>`;
const door = (label, href) => `<a class="button button-primary" href="${href}">${label} <span aria-hidden="true">↗</span></a>`;
function games(cityId) {
  if (!play) return `<div class="duo-grid">${Object.entries(decks).map(([key,g])=>`<article><span class="duo-icon" aria-hidden="true">${g.symbol}</span><h2>${g.name}</h2><p>${g.intro}</p>${action("Play together","start",key)}</article>`).join("")}</div><a class="text-link" href="#game/${cityId}">Playing solo? Try City Spark →</a>`;
  const {key, round, phase, cards, score, picks} = play;
  const g = decks[key];
  const card = cards[round];
  let content;
  if (!card) content = `<h2>That’s a wrap.</h2><p>${score} of 3 ${key === "duet" ? "matching picks" : "correct guesses"}.</p>${action("Play again","start",key)}`;
  else if (key === "duet") {
    const choice = (i) => action(card[i+1], "pick", String(i));
    if (phase === "pass") content = `<h2>Pass to Partner 2</h2><p>The first pick is hidden.</p>${action("I’m ready","ready")}`;
    else if (phase === "result") content = `<h2>${picks[0] === picks[1] ? "A perfect match." : "Two ways to spend the night."}</h2><p>Partner 1 · ${card[1+picks[0]]}<br>Partner 2 · ${card[1+picks[1]]}</p>${action(round === 2 ? "See results" : "Next round","next")}`;
    else content = `<p class="eyebrow">PARTNER ${picks.length+1} PICKS</p><h2>${card[0]}</h2><div class="actions">${choice(0)}${choice(1)}</div>`;
  } else {
    const who = round % 2 + 1;
    if (phase === "first") content = `<h2>Partner ${who}, you’re acting.</h2><p>Let your partner look away before you reveal the scene.</p>${action("Peek at my scene","peek")}`;
    else if (phase === "peek") content = `<h2>${card}</h2>${action("Hide it and act","act")}`;
    else content = `<h2>Lights, camera, action!</h2><p>Partner ${3-who}, guess the scene out loud.</p><div class="actions">${action("Got it!","guess","yes")}${action("Pass","guess","no")}</div>`;
  }
  return `<article class="play-stage"><p class="eyebrow">${g.name} · ${card ? "Round "+(round+1)+" of 3" : "Final score"}</p>${content}</article>${action("Game menu","menu")}`;
}
export const membershipPlans = {
  free: {name:"Free", monthly:0, yearly:0, looks:1},
  plus: {name:"Plus", monthly:5.99, yearly:59.99, looks:3},
  vip: {name:"AGA VIP", monthly:44.99, yearly:null, looks:4}
};
function readLocal(key,fallback) {
  try {return JSON.parse(localStorage.getItem("afterglow-"+key)) ?? fallback;} catch {return fallback;}
}
function saveLocal(key,value) {
  try {localStorage.setItem("afterglow-"+key,JSON.stringify(value));} catch {}
}
const savedTier = readLocal("tier", "free");
export let tier = Object.hasOwn(membershipPlans, savedTier) ? savedTier : "free";
let cycle = readLocal("cycle","monthly") === "yearly" ? "yearly" : "monthly";
const looks = [
  {name:"Rooftop denim",color:"#738fb8",cut:"jacket"},
  {name:"Midnight velvet",color:"#aa76cb",cut:"dress"},
  {name:"Turquoise knit",color:"#37c6ba",cut:"top"},
  {name:"Copper satin",color:"#da9577",cut:"dress"}
];
const validLook = n => Number.isInteger(n) && Boolean(looks[n]);
let worn = readLocal("worn",0);
if (!validLook(worn)) worn=0;
let savedLooks=readLocal("looks",[]);
savedLooks=Array.isArray(savedLooks)?[...new Set(savedLooks.filter(validLook))]:[];
let closetNote="";
let pours={};
let shelfItem=0;
let micMode=0, micActive=false, micPrompt=0, applause=0;
const acts=[
  ["Spoken word","Start with the last train home.","Give your city a voice.","Write a love letter to a street corner."],
  ["Comedy","Tell us your worst first-date advice.","Give an ordinary object a dramatic backstory.","Pitch a very unnecessary dating app."],
  ["Music","Hum a chorus your partner can echo.","Make a rhythm with just three notes.","Sing one line about tonight’s city."]
];
const merch=[
  ["Glass display","A violet swirl catches the light inside the hand-blown glass sculpture.","◉"],
  ["Rolling trays","Turquoise enamel with a gold skyline around the rim.","▱"],
  ["Pocket cases","A brushed copper finish and a clasp that snaps shut.","▣"]
];
export function membershipPanel() {
  return `<div class="membership"><p class="eyebrow">SUBSCRIPTION PREVIEW · USD</p><div class="actions">${["monthly","yearly"].map(c=>selectButton(c==="monthly"?"Monthly":"Yearly","cycle",c,cycle===c)).join("")}</div><div class="duo-grid">${Object.entries(membershipPlans).map(([key,p])=>`<article><h2>${p.name}</h2><strong>$${p[cycle] ?? p.monthly} / ${cycle==="yearly" && p.yearly !== null ? "year" : "month"}</strong>${cycle==="yearly" && key==="plus" ? `<p>Save $${(12*p.monthly-p.yearly).toFixed(2)} compared with 12 monthly payments.</p>` : ""}${cycle==="yearly" && p.yearly===null ? "<p>Available monthly only.</p>" : ""}<p>${p.looks} saved ${p.looks===1?"look":"looks"} · All club floors and games${key!=="free"?" · Mutual contact exchange after a practice date":""}</p>${tier===key?"<strong>Current preview plan</strong>":action("Try "+p.name,"tier",key)}</article>`).join("")}</div><p>Sample pricing. Switching plans is a free preview.</p></div>`;
}
function selectButton(label,id,v,selected) {
  return `<button class="button button-soft" type="button" data-action="club-${id}" data-value="${v}" aria-pressed="${selected}">${label}</button>`;
}
function closet() {
  const look=looks[worn];
  return `<article class="play-stage"><div class="garment ${look.cut}" style="--fabric:${look.color}" aria-hidden="true"></div><h2>${look.name}</h2><p>Choose an outfit to wear around the club.</p><div class="actions">${looks.map((l,i)=>selectButton(l.name,"wear",i,i===worn)).join("")}</div>
  ${action(savedLooks.includes(worn)?"Remove saved look":"Save this look","save-look")}<p role="status">${closetNote || "Saved on this device: "+savedLooks.length+" / "+membershipPlans[tier].looks}</p>
  ${savedLooks.length?`<div><p class="eyebrow">SAVED LOOKS</p><div class="actions">${savedLooks.map(i=>action(looks[i].name,"wear",i)).join("")}</div></div>`:""}<a class="text-link" href="#plus">Membership options →</a></article>`;
}
const drinks=["Blackberry fizz","Ginger lime spritz","Sparkling water"];
function bar(cityId,city) {
  return `<article class="play-stage bar-room"><p class="eyebrow">${city.name} · ZERO-PROOF MENU</p><h2>The Violet Hour</h2><p>Pick a virtual drink for your table.</p><div class="actions">${drinks.map((d,i)=>selectButton(d,"pour",i,pours[cityId]===i)).join("")}</div><p role="status">${drinks[pours[cityId]]?"On your table: "+drinks[pours[cityId]]+".":"Your table is open."}</p>${door("Head to open mic","#club/"+cityId+"/5")}</article>`;
}
function mic() {
  const act=acts[micMode];
  return `<article class="play-stage mic-room"><p class="eyebrow">LOCAL PRACTICE STAGE</p><h2>The Velvet Mic</h2><p>Perform aloud together on one device. This stage runs locally.</p>${micActive?`<strong>${act[0]} · On stage</strong><blockquote>${act[1+micPrompt]}</blockquote><div class="actions">${action("New prompt","prompt")}${action("Applaud · "+applause,"clap")}${action("Finish set","finish")}</div>`:`<div class="actions">${acts.map((a,i)=>selectButton(a[0],"act-type",i,i===micMode)).join("")}</div>${action("Take the mic","perform")}`}</article>`;
}
function smokeShop() {
  const item=merch[shelfItem];
  return `<article class="play-stage shop-room"><p class="eyebrow">VIRTUAL ACCESSORY GALLERY</p><h2>Smoke &amp; Glass</h2><div class="actions">${merch.map((m,i)=>selectButton(m[0],"shelf",i,shelfItem===i)).join("")}</div><div class="shelf-item" aria-hidden="true">${item[2]}</div><h3>${item[0]}</h3><p>${item[1]}</p></article>`;
}
export function clubAction(id,value,cityId) {
  const i=Number(value);
  if (id==="tier" && Object.hasOwn(membershipPlans,value)) { tier=value; saveLocal("tier",tier); closetNote=""; return; }
  if (id==="cycle" && ["monthly","yearly"].includes(value)) { cycle=value; saveLocal("cycle",cycle); return; }
  if (id==="wear" && validLook(i)) {worn=i; saveLocal("worn",i); closetNote="Wearing "+looks[i].name+"."; return;}
  if (id==="save-look") {
    if(savedLooks.includes(worn)) savedLooks=savedLooks.filter(n=>n!==worn);
    else if(savedLooks.length<membershipPlans[tier].looks) savedLooks.push(worn);
    else {closetNote="Your saved slots are full. Remove a saved look to make room.";return;}
    saveLocal("looks",savedLooks);closetNote="Saved looks: "+savedLooks.length+".";return;
  }
  if (id==="pour" && drinks[i]) {pours[cityId]=i;return;}
  if (id==="shelf" && merch[i]) {shelfItem=i;return;}
  if (id==="act-type" && acts[i]) {micMode=i;return;}
  if (id==="perform") {micActive=true;micPrompt=0;applause=0;return;}
  if (id==="prompt") {micPrompt=(micPrompt+1)%3;return;}
  if (id==="clap") {applause++;return;}
  if (id==="finish") {micActive=false;return;}
  if (id === "start" && Object.hasOwn(decks,value)) {
    play = {key:value, round:0, phase:"first", cards:shuffled(decks[value].cards), score:0, picks:[]};
  } else if (id === "menu") play = null;
  else if (play && play.round < 3) {
    if (id === "pick" && play.key === "duet" && ["first","second"].includes(play.phase) && ["0","1"].includes(value)) {
      play.picks.push(Number(value));
      play.phase = play.picks.length === 1 ? "pass" : "result";
      if (play.phase === "result" && play.picks[0] === play.picks[1]) play.score++;
    } else if (id === "ready" && play.phase === "pass") play.phase = "second";
    else if (id === "peek" && play.key === "mime" && play.phase === "first") play.phase = "peek";
    else if (id === "act" && play.phase === "peek") play.phase = "act";
    else if ((id === "guess" && play.phase === "act") || (id === "next" && play.phase === "result")) {
      if (id === "guess" && value === "yes") play.score++;
      play.round++; play.phase="first"; play.picks=[];
    }
  }
}
export function clubRoom(cityId,city,floor) {
  const rooms = [
    () => `<article class="play-stage"><h2>${city.hangout}</h2><p>${city.hangoutCopy}</p>${door("Catch a city cab","#cab/"+cityId)}</article>`,
    () => games(cityId),
    () => `<article class="play-stage"><h2>${city.lounge}</h2><p>Take a seat upstairs for a practice video date or make a date card together.</p><div class="actions">${door("Enter video lounge","#video/"+cityId)}${door("Build a date card","#night/"+cityId+"/0")}</div></article>`
  ];
  rooms.push(closet,()=>bar(cityId,city),mic,smokeShop);
  return `<section class="shell page"><a class="back" href="#city/${cityId}">← ${city.name}</a><p class="eyebrow">THE CLUB · ${city.name}</p><h1 tabindex="-1" id="club-focus">${floors[floor]}</h1>
    <div class="club-layout"><nav class="lift-panel" aria-label="Club elevator"><p class="eyebrow">CLUB ELEVATOR</p><div class="lift-shaft" aria-hidden="true"><span style="--level:${floor}">↕</span></div>
    ${[6,5,4,3,2,1,0].map(i=>`<a href="#club/${cityId}/${i}" ${i===floor?'aria-current="page"':''}><b>${i || "G"}</b>${floors[i]}</a>`).join("")}</nav>
    <div class="club-room"><p class="wear-tag">Wearing · ${looks[worn].name}</p>${rooms[floor]()}</div></div></section>`;
}
export function cabView(cityId, city, stop) {
  const stops = [
    ["Club entrance", "#club/"+cityId+"/0"],
    [city.arcade, "#club/"+cityId+"/1"],
    [city.lounge, "#club/"+cityId+"/2"],
    ["The Violet Hour", "#club/"+cityId+"/4"],
    ["The Velvet Mic", "#club/"+cityId+"/5"],
    ["Smoke & Glass", "#club/"+cityId+"/6"]
  ];
  return `<section class="shell page"><a class="back" href="#city/${cityId}">← ${city.name}</a><p class="eyebrow">${city.name} · CITY CAB</p><h1 tabindex="-1">Where to?</h1>
    <div class="cab-scene" style="background-image:url('assets/${cityId}.webp')"><div class="cab-road" aria-hidden="true"><span style="left:${(6+stop*16)}%">🚕</span><i>🚙</i></div></div>
    <div class="cab-stops" aria-label="Cab destinations">${stops.map(([name],i)=>`<a class="button button-soft" href="#cab/${cityId}/${i}" ${i===stop?'aria-current="location"':''}>${name}</a>`).join("")}</div>
    <div class="cab-arrival"><div><p class="eyebrow">YOUR STOP</p><h2>${stops[stop][0]}</h2></div>${door("Step inside",stops[stop][1])}</div></section>`;
}
