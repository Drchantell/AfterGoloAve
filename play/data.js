export const cities = {
  charlotte: {
    name: "Charlotte", region: "NORTH CAROLINA", country: "United States", zone: "QUEEN CITY", tone: "#43ead9",
    description: "Rooftops & skyline lights",
    story: "Take the elevator up to a skyline terrace, stop for an icebreaker, or pick a quiet corner for a face-to-face conversation.",
    lounge: "Skyline Lounge", arcade: "Queen City Arcade", hangout: "The Rooftop Garden",
    hangoutCopy: "Warm lights, garden seats, and a skyline worth lingering over.",
    soundtrack: { genre: "Hip-hop / trap", file: "charlotte-trap.mp3" },
    picks: ["Skyline picnic", "Gallery crawl", "Live jazz"],
    people: ["imani", "avery", "dev"]
  },
  brooklyn: {
    name: "Brooklyn", region: "NEW YORK CITY", country: "United States", zone: "THE BOROUGH", tone: "#ccafff",
    description: "Brownstones & late-night beats",
    story: "Follow the train past the brownstones to an after-hours record shop and a booth made for a first conversation.",
    lounge: "Brownstone Booth", arcade: "Undertrack Arcade", hangout: "The Record Room",
    hangoutCopy: "A crate of vinyl, a listening booth, and room to trade favorite songs.",
    soundtrack: { genre: "Reggae", file: "brooklyn-reggae.mp3" },
    picks: ["Record shop", "Night market", "Comedy show"],
    people: ["marisol", "avery", "june"]
  },
  manhattan: {
    name: "Manhattan", region: "NEW YORK CITY", country: "United States", zone: "MIDTOWN", tone: "#b48aff",
    description: "City lights & rooftop views",
    story: "Wander past theater lights and up to a terrace floating above the skyline. Make it a game night or settle into a video booth.",
    lounge: "The Penthouse Booth", arcade: "Midtown Arcade", hangout: "Marquee Terrace",
    hangoutCopy: "Lights from the theater district reach a rooftop terrace with little tables for two.",
    soundtrack: { genre: "House", file: "manhattan-house.mp3" },
    picks: ["Rooftop cinema", "Museum night", "Dessert crawl"],
    people: ["dev", "june", "imani"]
  },
  seoul: {
    name: "Seoul", region: "SOUTH KOREA", zone: "AFTER HOURS", tone: "#67f0e4",
    description: "Night markets & café corners",
    story: "Try the lantern-lit market or take the long way to a tucked-away café before stepping into your video lounge.",
    lounge: "Lantern Video Café", arcade: "Moonlight Arcade", hangout: "Lantern Market",
    hangoutCopy: "Lanterns, little cafés, and enough food stalls to make a whole evening of it.",
    soundtrack: { genre: "K-pop-inspired dance", file: "seoul-dance.mp3" },
    picks: ["Night market", "Karaoke booth", "Late-night café"],
    people: ["jinu", "marisol", "avery"]
  },
  london: {
    name: "London", region: "UNITED KINGDOM", zone: "THAMES AFTER DARK", tone: "#c7aeff",
    description: "Late trains & riverside lights",
    story: "Follow the Thames to a velvet booth overlooking the river, or head out for a late-night game.",
    lounge: "The Thames Booth", arcade: "South Bank Arcade", hangout: "Riverwalk Terrace",
    hangoutCopy: "Bridges, reflections, and a spot with enough room to talk.",
    soundtrack: { genre: "UK garage", file: "london-garage.mp3" },
    picks: ["Riverside walk", "Late-night theater", "Rooftop DJ set"],
    people: ["avery", "dev", "marisol"]
  },
  paris: {
    name: "Paris", region: "FRANCE", zone: "LEFT BANK", tone: "#67f0e4",
    description: "Terraces & Seine-side nights",
    story: "Take the long way along the Seine and find a café corner for your video date.",
    lounge: "Seine Side Studio", arcade: "Left Bank Arcade", hangout: "The Midnight Terrace",
    hangoutCopy: "A little terrace with warm light and room to stay for another conversation.",
    soundtrack: { genre: "French house", file: "paris-house.mp3" },
    picks: ["Dessert café", "Seine stroll", "Jazz cellar"],
    people: ["marisol", "june", "imani"]
  },
  tokyo: {
    name: "Tokyo", region: "JAPAN", zone: "SHIBUYA", tone: "#c7aeff",
    description: "Neon crossings & karaoke",
    story: "Cross under the city lights and choose between a bright arcade and a private booth above the streets.",
    lounge: "Shibuya Sky Booth", arcade: "Neon Crossing Arcade", hangout: "The Listening Bar",
    hangoutCopy: "A corner booth, a great sound system, and a chance to trade favorite tracks.",
    soundtrack: { genre: "City pop-inspired", file: "tokyo-city-pop.mp3" },
    picks: ["Karaoke booth", "Late ramen", "Record bar"],
    people: ["jinu", "june", "dev"]
  },
  toronto: {
    name: "Toronto", region: "CANADA", zone: "THE WATERFRONT", tone: "#67f0e4",
    description: "Harbour lights & live music",
    story: "Walk the waterfront, play a round with your guest, and meet for a video date by the harbour.",
    lounge: "Harbourfront Lounge", arcade: "Lakeside Arcade", hangout: "The Harbour Deck",
    hangoutCopy: "Watch lights from the skyline stretch across the water.",
    soundtrack: { genre: "Late-night R&B", file: "toronto-rnb.mp3" },
    picks: ["Waterfront stroll", "Live show", "Dessert crawl"],
    people: ["avery", "imani", "dev"]
  },
  kingston: {
    name: "Kingston", region: "JAMAICA", zone: "DOWNTOWN", tone: "#c7aeff",
    description: "Courtyards & sound systems",
    story: "Start with a courtyard full of music, then take your conversation to a lounge above the city.",
    lounge: "Blue Mountain Lounge", arcade: "Courtyard Arcade", hangout: "Sound System Yard",
    hangoutCopy: "An open-air stop to talk music and imagine your perfect night out.",
    soundtrack: { genre: "Dub-inspired reggae", file: "kingston-dub.mp3" },
    picks: ["Outdoor music set", "Art walk", "Harbour hangout"],
    people: ["imani", "jinu", "marisol"]
  },
  "mexico-city": {
    name: "Mexico City", region: "MEXICO", zone: "CENTRO HISTÓRICO", tone: "#67f0e4",
    description: "Plazas & after-hours bites",
    story: "Follow the lights through Centro Histórico and find a spot for games, food, or a video date.",
    lounge: "Centro Rooftop Lounge", arcade: "Alameda Arcade", hangout: "The Plaza Terrace",
    hangoutCopy: "Courtyard lights and a view of people passing through the plaza.",
    soundtrack: { genre: "Cumbia-inspired dance", file: "mexico-city-cumbia.mp3" },
    picks: ["Taco stop", "Plaza walk", "Rooftop cinema"],
    people: ["marisol", "dev", "june"]
  },
  lagos: {
    name: "Lagos", region: "NIGERIA", zone: "LAGOON LIGHTS", tone: "#c7aeff",
    description: "Bridge lights & late sets",
    story: "Start by the lagoon, choose a late-night music stop, and meet a guest in the waterfront lounge.",
    lounge: "Lagoon Lights Lounge", arcade: "Bridgeview Arcade", hangout: "The Waterfront Deck",
    hangoutCopy: "An open-air meetup above the water with a view of the bridge lights.",
    soundtrack: { genre: "Afrobeats-inspired dance", file: "lagos-afrobeats.mp3" },
    picks: ["Waterfront dinner", "Afrobeats night", "Gallery opening"],
    people: ["dev", "imani", "avery"]
  },
  rio: {
    name: "Rio de Janeiro", region: "BRAZIL", zone: "BOTAFOGO BAY", tone: "#67f0e4",
    description: "Bay views & music outdoors",
    story: "Follow the boardwalk at dusk, pick a place to dance, and step into a video lounge with a bay view.",
    lounge: "Sugarloaf View Lounge", arcade: "Bayfront Arcade", hangout: "The Boardwalk",
    hangoutCopy: "A lively stretch by the bay with a view of the city as the sky gets dark.",
    soundtrack: { genre: "Samba-inspired dance", file: "rio-samba.mp3" },
    picks: ["Samba night", "Boardwalk date", "Sunset lookout"],
    people: ["june", "jinu", "marisol"]
  }
};

const additionalDestinations = [
  ["houston", {"name": "Houston", "region": "TEXAS", "country": "United States", "zone": "THIRD WARD", "tone": "#fadba2", "description": "Third Ward · Slab parade", "story": "Start with slab parade in Third Ward, then meet at Bayou Bass Lounge for your virtual date.", "lounge": "Bayou Bass Lounge", "arcade": "Third Ward Arcade", "hangout": "Third Ward Terrace", "hangoutCopy": "Pick a spot together before heading out for late-night tacos.", "picks": ["Slab parade", "Late-night tacos", "Chopped-and-slow listening booth"], "people": ["imani", "avery", "dev"], "track": "charlotte"}],
  ["atlanta", {"name": "Atlanta", "region": "GEORGIA", "country": "United States", "zone": "EDGEWOOD", "tone": "#e7a2fa", "description": "Edgewood · Trap beat battle", "story": "Start with trap beat battle in Edgewood, then meet at Peachtree Sound Room for your virtual date.", "lounge": "Peachtree Sound Room", "arcade": "Edgewood Arcade", "hangout": "Edgewood Terrace", "hangoutCopy": "Pick a spot together before heading out for patio dance-off.", "picks": ["Trap beat battle", "Patio dance-off", "Late-night wings"], "people": ["imani", "avery", "dev"], "track": "charlotte"}],
  ["miami", {"name": "Miami", "region": "FLORIDA", "country": "United States", "zone": "LITTLE HAVANA", "tone": "#a2faf8", "description": "Little Havana · Salsa lesson", "story": "Start with salsa lesson in Little Havana, then meet at Palm Neon Terrace for your virtual date.", "lounge": "Palm Neon Terrace", "arcade": "Little Havana Arcade", "hangout": "Little Havana Terrace", "hangoutCopy": "Pick a spot together before heading out for domino doubles.", "picks": ["Salsa lesson", "Domino doubles", "Cafecito walk"], "people": ["imani", "avery", "dev"], "track": "mexico-city"}],
  ["las-vegas", {"name": "Las Vegas", "region": "NEVADA", "country": "United States", "zone": "DOWNTOWN", "tone": "#faada2", "description": "Downtown · Neon photo walk", "story": "Start with neon photo walk in Downtown, then meet at Desert Neon Booth for your virtual date.", "lounge": "Desert Neon Booth", "arcade": "Downtown Arcade", "hangout": "Downtown Terrace", "hangoutCopy": "Pick a spot together before heading out for magic show.", "picks": ["Neon photo walk", "Magic show", "Midnight diner"], "people": ["imani", "avery", "dev"], "track": "manhattan"}],
  ["new-orleans", {"name": "New Orleans", "region": "LOUISIANA", "country": "United States", "zone": "FRENCHMEN STREET", "tone": "#a2fada", "description": "Frenchmen Street · Brass band set", "story": "Start with brass band set in Frenchmen Street, then meet at Brass Balcony for your virtual date.", "lounge": "Brass Balcony", "arcade": "Frenchmen Street Arcade", "hangout": "Frenchmen Street Terrace", "hangoutCopy": "Pick a spot together before heading out for beignet break.", "picks": ["Brass band set", "Beignet break", "Courtyard two-step"], "people": ["imani", "avery", "dev"], "track": "toronto"}],
  ["chicago", {"name": "Chicago", "region": "ILLINOIS", "country": "United States", "zone": "WEST LOOP", "tone": "#a7faa2", "description": "West Loop · House dance lesson", "story": "Start with house dance lesson in West Loop, then meet at Lakefront Sound Booth for your virtual date.", "lounge": "Lakefront Sound Booth", "arcade": "West Loop Arcade", "hangout": "West Loop Terrace", "hangoutCopy": "Pick a spot together before heading out for late pizza stop.", "picks": ["House dance lesson", "Late pizza stop", "Riverwalk stroll"], "people": ["imani", "avery", "dev"], "track": "manhattan"}],
  ["detroit", {"name": "Detroit", "region": "MICHIGAN", "country": "United States", "zone": "DOWNTOWN", "tone": "#ebfaa2", "description": "Downtown · Techno set", "story": "Start with techno set in Downtown, then meet at Motor City Listening Room for your virtual date.", "lounge": "Motor City Listening Room", "arcade": "Downtown Arcade", "hangout": "Downtown Terrace", "hangoutCopy": "Pick a spot together before heading out for vinyl swap.", "picks": ["Techno set", "Vinyl swap", "Riverfront lookout"], "people": ["imani", "avery", "dev"], "track": "manhattan"}],
  ["los-angeles", {"name": "Los Angeles", "region": "CALIFORNIA", "country": "United States", "zone": "HOLLYWOOD", "tone": "#faa2fa", "description": "Hollywood · Rooftop screening", "story": "Start with rooftop screening in Hollywood, then meet at Sunset Screening Room for your virtual date.", "lounge": "Sunset Screening Room", "arcade": "Hollywood Arcade", "hangout": "Hollywood Terrace", "hangoutCopy": "Pick a spot together before heading out for taco truck stop.", "picks": ["Rooftop screening", "Taco truck stop", "Comedy club"], "people": ["imani", "avery", "dev"], "track": "toronto"}],
  ["oakland", {"name": "Oakland", "region": "CALIFORNIA", "country": "United States", "zone": "UPTOWN", "tone": "#d3faa2", "description": "Uptown · DJ showcase", "story": "Start with dj showcase in Uptown, then meet at Town Vinyl Lounge for your virtual date.", "lounge": "Town Vinyl Lounge", "arcade": "Uptown Arcade", "hangout": "Uptown Terrace", "hangoutCopy": "Pick a spot together before heading out for lake stroll.", "picks": ["DJ showcase", "Lake stroll", "Gallery night"], "people": ["imani", "avery", "dev"], "track": "charlotte"}],
  ["austin", {"name": "Austin", "region": "TEXAS", "country": "United States", "zone": "RED RIVER", "tone": "#faa5a2", "description": "Red River · Guitar showcase", "story": "Start with guitar showcase in Red River, then meet at Violet Amp Room for your virtual date.", "lounge": "Violet Amp Room", "arcade": "Red River Arcade", "hangout": "Red River Terrace", "hangoutCopy": "Pick a spot together before heading out for breakfast tacos.", "picks": ["Guitar showcase", "Breakfast tacos", "Two-step lesson"], "people": ["imani", "avery", "dev"], "track": "toronto"}],
  ["dallas", {"name": "Dallas", "region": "TEXAS", "country": "United States", "zone": "DEEP ELLUM", "tone": "#a2e8fa", "description": "Deep Ellum · Mural hunt", "story": "Start with mural hunt in Deep Ellum, then meet at Neon Spur Lounge for your virtual date.", "lounge": "Neon Spur Lounge", "arcade": "Deep Ellum Arcade", "hangout": "Deep Ellum Terrace", "hangoutCopy": "Pick a spot together before heading out for live blues set.", "picks": ["Mural hunt", "Live blues set", "Patio picnic"], "people": ["imani", "avery", "dev"], "track": "toronto"}],
  ["nashville", {"name": "Nashville", "region": "TENNESSEE", "country": "United States", "zone": "LOWER BROADWAY", "tone": "#faa2d3", "description": "Lower Broadway · Songwriter round", "story": "Start with songwriter round in Lower Broadway, then meet at Backstage Booth for your virtual date.", "lounge": "Backstage Booth", "arcade": "Lower Broadway Arcade", "hangout": "Lower Broadway Terrace", "hangoutCopy": "Pick a spot together before heading out for line dance.", "picks": ["Songwriter round", "Line dance", "Hot chicken stop"], "people": ["imani", "avery", "dev"], "track": "toronto"}],
  ["philadelphia", {"name": "Philadelphia", "region": "PENNSYLVANIA", "country": "United States", "zone": "FISHTOWN", "tone": "#dafaa2", "description": "Fishtown · Soul listening party", "story": "Start with soul listening party in Fishtown, then meet at The B-Side Room for your virtual date.", "lounge": "The B-Side Room", "arcade": "Fishtown Arcade", "hangout": "Fishtown Terrace", "hangoutCopy": "Pick a spot together before heading out for bowling date.", "picks": ["Soul listening party", "Bowling date", "Late sandwich run"], "people": ["imani", "avery", "dev"], "track": "toronto"}],
  ["washington-dc", {"name": "Washington, DC", "region": "DISTRICT OF COLUMBIA", "country": "United States", "zone": "U STREET", "tone": "#faa2b1", "description": "U Street · Go-go dance break", "story": "Start with go-go dance break in U Street, then meet at Pocket Groove Lounge for your virtual date.", "lounge": "Pocket Groove Lounge", "arcade": "U Street Arcade", "hangout": "U Street Terrace", "hangoutCopy": "Pick a spot together before heading out for poetry set.", "picks": ["Go-go dance break", "Poetry set", "Half-smoke stop"], "people": ["imani", "avery", "dev"], "track": "charlotte"}],
  ["san-juan", {"name": "San Juan", "region": "PUERTO RICO", "country": "United States", "zone": "SANTURCE", "tone": "#faa2ab", "description": "Santurce · Salsa social", "story": "Start with salsa social in Santurce, then meet at Isla Sound Terrace for your virtual date.", "lounge": "Isla Sound Terrace", "arcade": "Santurce Arcade", "hangout": "Santurce Terrace", "hangoutCopy": "Pick a spot together before heading out for mural walk.", "picks": ["Salsa social", "Mural walk", "Plaza dance"], "people": ["imani", "avery", "dev"], "track": "mexico-city"}],
  ["montreal", {"name": "Montréal", "region": "QUEBEC", "country": "Canada", "zone": "QUARTIER DES SPECTACLES", "tone": "#fabba2", "description": "Quartier des spectacles · Outdoor light walk", "story": "Start with outdoor light walk in Quartier des spectacles, then meet at The Encore Room for your virtual date.", "lounge": "The Encore Room", "arcade": "Quartier des spectacles Arcade", "hangout": "Quartier des spectacles Terrace", "hangoutCopy": "Pick a spot together before heading out for late poutine.", "picks": ["Outdoor light walk", "Late poutine", "Indie dance night"], "people": ["imani", "avery", "dev"], "track": "paris"}],
  ["berlin", {"name": "Berlin", "region": "GERMANY", "country": "Germany", "zone": "FRIEDRICHSHAIN", "tone": "#a2a4fa", "description": "Friedrichshain · Warehouse set", "story": "Start with warehouse set in Friedrichshain, then meet at Concrete Echo Room for your virtual date.", "lounge": "Concrete Echo Room", "arcade": "Friedrichshain Arcade", "hangout": "Friedrichshain Terrace", "hangoutCopy": "Pick a spot together before heading out for photo booth.", "picks": ["Warehouse set", "Photo booth", "Canal walk"], "people": ["imani", "avery", "dev"], "track": "manhattan"}],
  ["amsterdam", {"name": "Amsterdam", "region": "NETHERLANDS", "country": "Netherlands", "zone": "REMBRANDTPLEIN", "tone": "#eda2fa", "description": "Rembrandtplein · Canal-side dance", "story": "Start with canal-side dance in Rembrandtplein, then meet at Canal Lights Lounge for your virtual date.", "lounge": "Canal Lights Lounge", "arcade": "Rembrandtplein Arcade", "hangout": "Rembrandtplein Terrace", "hangoutCopy": "Pick a spot together before heading out for late fries.", "picks": ["Canal-side dance", "Late fries", "DJ booth"], "people": ["imani", "avery", "dev"], "track": "paris"}],
  ["ibiza", {"name": "Ibiza Town", "region": "IBIZA, SPAIN", "country": "Spain", "zone": "MARINA", "tone": "#a2fad8", "description": "Marina · Sunset set", "story": "Start with sunset set in Marina, then meet at Balearic Sunset Deck for your virtual date.", "lounge": "Balearic Sunset Deck", "arcade": "Marina Arcade", "hangout": "Marina Terrace", "hangoutCopy": "Pick a spot together before heading out for marina stroll.", "picks": ["Sunset set", "Marina stroll", "Open-air dance"], "people": ["imani", "avery", "dev"], "track": "paris"}],
  ["barcelona", {"name": "Barcelona", "region": "SPAIN", "country": "Spain", "zone": "EL RAVAL", "tone": "#fac8a2", "description": "El Raval · Tapas crawl", "story": "Start with tapas crawl in El Raval, then meet at Mosaic Terrace for your virtual date.", "lounge": "Mosaic Terrace", "arcade": "El Raval Arcade", "hangout": "El Raval Terrace", "hangoutCopy": "Pick a spot together before heading out for plaza concert.", "picks": ["Tapas crawl", "Plaza concert", "Late gallery"], "people": ["imani", "avery", "dev"], "track": "paris"}],
  ["madrid", {"name": "Madrid", "region": "SPAIN", "country": "Spain", "zone": "MALASAÑA", "tone": "#faa2aa", "description": "Malasaña · Courtyard concert", "story": "Start with courtyard concert in Malasaña, then meet at Midnight Vermilion Room for your virtual date.", "lounge": "Midnight Vermilion Room", "arcade": "Malasaña Arcade", "hangout": "Malasaña Terrace", "hangoutCopy": "Pick a spot together before heading out for churros stop.", "picks": ["Courtyard concert", "Churros stop", "Indie dance floor"], "people": ["imani", "avery", "dev"], "track": "paris"}],
  ["lisbon", {"name": "Lisbon", "region": "PORTUGAL", "country": "Portugal", "zone": "BAIRRO ALTO", "tone": "#fae4a2", "description": "Bairro Alto · Fado evening", "story": "Start with fado evening in Bairro Alto, then meet at Hilltop Listening Room for your virtual date.", "lounge": "Hilltop Listening Room", "arcade": "Bairro Alto Arcade", "hangout": "Bairro Alto Terrace", "hangoutCopy": "Pick a spot together before heading out for lookout walk.", "picks": ["Fado evening", "Lookout walk", "Pastry stop"], "people": ["imani", "avery", "dev"], "track": "toronto"}],
  ["buenos-aires", {"name": "Buenos Aires", "region": "ARGENTINA", "country": "Argentina", "zone": "PALERMO", "tone": "#fac7a2", "description": "Palermo · Tango lesson", "story": "Start with tango lesson in Palermo, then meet at Luna Courtyard for your virtual date.", "lounge": "Luna Courtyard", "arcade": "Palermo Arcade", "hangout": "Palermo Terrace", "hangoutCopy": "Pick a spot together before heading out for late supper.", "picks": ["Tango lesson", "Late supper", "Record fair"], "people": ["imani", "avery", "dev"], "track": "mexico-city"}],
  ["medellin", {"name": "Medellín", "region": "COLOMBIA", "country": "Colombia", "zone": "EL POBLADO", "tone": "#d1a2fa", "description": "El Poblado · Dance lesson", "story": "Start with dance lesson in El Poblado, then meet at Orquídea Terrace for your virtual date.", "lounge": "Orquídea Terrace", "arcade": "El Poblado Arcade", "hangout": "El Poblado Terrace", "hangoutCopy": "Pick a spot together before heading out for arepa stop.", "picks": ["Dance lesson", "Arepa stop", "Rooftop duet"], "people": ["imani", "avery", "dev"], "track": "mexico-city"}],
  ["cartagena", {"name": "Cartagena", "region": "COLOMBIA", "country": "Colombia", "zone": "GETSEMANÍ", "tone": "#faf0a2", "description": "Getsemaní · Champeta dance", "story": "Start with champeta dance in Getsemaní, then meet at Lantern Patio for your virtual date.", "lounge": "Lantern Patio", "arcade": "Getsemaní Arcade", "hangout": "Getsemaní Terrace", "hangoutCopy": "Pick a spot together before heading out for plaza stroll.", "picks": ["Champeta dance", "Plaza stroll", "Courtyard concert"], "people": ["imani", "avery", "dev"], "track": "mexico-city"}],
  ["cape-town", {"name": "Cape Town", "region": "SOUTH AFRICA", "country": "South Africa", "zone": "LONG STREET", "tone": "#fabea2", "description": "Long Street · Sunset lookout", "story": "Start with sunset lookout in Long Street, then meet at Mountain View Lounge for your virtual date.", "lounge": "Mountain View Lounge", "arcade": "Long Street Arcade", "hangout": "Long Street Terrace", "hangoutCopy": "Pick a spot together before heading out for jazz night.", "picks": ["Sunset lookout", "Jazz night", "Open-air dance"], "people": ["imani", "avery", "dev"], "track": "lagos"}],
  ["johannesburg", {"name": "Johannesburg", "region": "SOUTH AFRICA", "country": "South Africa", "zone": "BRAAMFONTEIN", "tone": "#cefaa2", "description": "Braamfontein · Amapiano dance", "story": "Start with amapiano dance in Braamfontein, then meet at Gold City Deck for your virtual date.", "lounge": "Gold City Deck", "arcade": "Braamfontein Arcade", "hangout": "Braamfontein Terrace", "hangoutCopy": "Pick a spot together before heading out for gallery night.", "picks": ["Amapiano dance", "Gallery night", "Late grill"], "people": ["imani", "avery", "dev"], "track": "lagos"}],
  ["accra", {"name": "Accra", "region": "GHANA", "country": "Ghana", "zone": "OSU", "tone": "#f3a2fa", "description": "Osu · Highlife listening session", "story": "Start with highlife listening session in Osu, then meet at Gold Coast Sound Yard for your virtual date.", "lounge": "Gold Coast Sound Yard", "arcade": "Osu Arcade", "hangout": "Osu Terrace", "hangoutCopy": "Pick a spot together before heading out for street food stop.", "picks": ["Highlife listening session", "Street food stop", "Courtyard set"], "people": ["imani", "avery", "dev"], "track": "lagos"}],
  ["bangkok", {"name": "Bangkok", "region": "THAILAND", "country": "Thailand", "zone": "THONG LO", "tone": "#faa2cb", "description": "Thong Lo · Night market", "story": "Start with night market in Thong Lo, then meet at Neon Orchid Room for your virtual date.", "lounge": "Neon Orchid Room", "arcade": "Thong Lo Arcade", "hangout": "Thong Lo Terrace", "hangoutCopy": "Pick a spot together before heading out for skyline terrace.", "picks": ["Night market", "Skyline terrace", "Karaoke duet"], "people": ["imani", "avery", "dev"], "track": "tokyo"}],
  ["bangalore", {"name": "Bengaluru", "region": "INDIA", "country": "India", "zone": "INDIRANAGAR", "tone": "#faa2c4", "description": "Indiranagar · Indie gig", "story": "Start with indie gig in Indiranagar, then meet at Garden City Amp Room for your virtual date.", "lounge": "Garden City Amp Room", "arcade": "Indiranagar Arcade", "hangout": "Indiranagar Terrace", "hangoutCopy": "Pick a spot together before heading out for late dosa.", "picks": ["Indie gig", "Late dosa", "Open mic duet"], "people": ["imani", "avery", "dev"], "track": "london"}],
];
// Local genres are discovery suggestions, not claims that a shared demo loop is a local artist recording.
const localGenres = {
  houston: "Houston hip-hop / chopped-and-screwed",
  atlanta: "Atlanta trap / hip-hop",
  miami: "Miami bass / Latin dance",
  "las-vegas": "Las Vegas dance / EDM",
  "new-orleans": "New Orleans brass / bounce",
  chicago: "Chicago house / footwork",
  detroit: "Detroit techno / Motown",
  "los-angeles": "West Coast hip-hop / funk",
  oakland: "Bay Area hip-hop / hyphy",
  austin: "Austin blues / live indie",
  dallas: "Dallas blues / Texas hip-hop",
  nashville: "Nashville country / singer-songwriter",
  philadelphia: "Philly soul / hip-hop",
  "washington-dc": "D.C. go-go",
  "san-juan": "Salsa / reggaetón",
  montreal: "Montréal indie / dance",
  berlin: "Berlin techno",
  amsterdam: "Dutch house / dance",
  ibiza: "Balearic house / dance",
  barcelona: "Catalan pop / dance",
  madrid: "Madrid indie / flamenco fusion",
  lisbon: "Lisbon fado / Afro-house",
  "buenos-aires": "Buenos Aires tango / electronic",
  medellin: "Medellín reggaetón",
  cartagena: "Cartagena champeta / cumbia",
  "cape-town": "Cape Town jazz / amapiano",
  johannesburg: "Johannesburg amapiano / house",
  accra: "Ghanaian highlife / Afrobeats",
  bangkok: "Thai pop / dance",
  bangalore: "Bengaluru indie / Indian pop"
};
for (const [id, {track, ...destination}] of additionalDestinations) {
  cities[id] = {
    ...destination,
    soundtrack: { ...cities[track].soundtrack, genre: localGenres[id] || cities[track].soundtrack.genre }
  };
}

export const communities = [
  {id: "all", name: "Everyone", intro: "Explore the full demo lineup."},
  {id: "gay", name: "Gay", intro: "Meet demo guests who identify as gay across genders."},
  {id: "lesbian", name: "Lesbian", intro: "Explore connections with demo guests who identify as lesbian."},
  {id: "asexual", name: "Asexual", intro: "Get to know ace demo guests and explore connection at your own pace."},
  {id: "trans", name: "Transgender", intro: "A space to meet trans demo guests across different orientations."},
  {id: "bisexual", name: "Bisexual", intro: "Explore connections with bi demo guests across genders."},
  {id: "straight", name: "Heterosexual", intro: "Meet straight demo guests across genders."}
];

export const people = {
  imani: { name:"Imani", age:30, pronouns:"she/her", labels:["Bisexual", "Woman"], tags:["bisexual"], bio:"I make playlists for people I like. Pick the first song.", tastes:[2,0,1], prompt:"I always bring a playlist. What song would be on yours?", consent:true },
  marisol: { name:"Marisol", age:29, pronouns:"she/her", labels:["Lesbian", "Trans woman"], tags:["lesbian","trans"], bio:"My ideal evening has an art walk and something sweet.", tastes:[1,1,2], prompt:"What would you pick for us to do if we had the whole night free?", consent:true },
  jinu: { name:"Jin-u", age:31, pronouns:"he/him", labels:["Gay", "Man"], tags:["gay"], bio:"Night markets, record stores, and a soft spot for bad puns.", tastes:[0,1,0], prompt:"Give me your best bad pun. The worse, the better.", consent:false },
  avery: { name:"Avery", age:28, pronouns:"they/them", labels:["Asexual", "Nonbinary", "Trans"], tags:["asexual","trans"], bio:"Let’s get coffee and see how the conversation feels.", tastes:[0,2,1], prompt:"What helps you feel comfortable when you’re getting to know somebody?", consent:false },
  dev: { name:"Dev", age:32, pronouns:"he/him", labels:["Heterosexual", "Man"], tags:["straight"], bio:"I’m always down for a board game and a late-night snack.", tastes:[2,2,0], prompt:"What’s the one board game you get way too competitive about?", consent:true },
  june: { name:"June", age:29, pronouns:"she/her", labels:["Heterosexual", "Woman"], tags:["straight"], bio:"Give me an old movie, a window seat, and a rainy night.", tastes:[1,0,2], prompt:"What movie do you wish you could watch again for the first time?", consent:true }
};

export const conversation = [
  "What's one small thing that always makes your day?",
  "What place would you show someone visiting your hometown?",
  "What do you wish people asked you on a first date?",
  "What's a hobby you’d love to try with somebody?"
];
