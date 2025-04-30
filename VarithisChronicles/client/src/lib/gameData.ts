import { 
  Location, 
  Faction, 
  DialogueChoice, 
  LoreRegion, 
  TimelineEvent,
  CharacterBackground
} from './types';

// Faction data
export const factions: Faction[] = [
  {
    id: "frostholm",
    name: "Frostholm",
    description: "The resilient people of Northern Varithis who embrace warrior traditions, ancestral reverence, and survival against the harsh frozen environment.",
    focus: "Warrior traditions, resilience, survival",
    influence: "High in Northern Alliance",
    iconColor: "text-blue-300",
    image: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?q=80&w=500&auto=format&fit=crop",
    symbolImage: "https://images.unsplash.com/photo-1516035071-ad5eaca7ecfb?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: "stoneridge",
    name: "Stoneridge",
    description: "The disciplined people of Western Varithis known for their resilience, craftsmanship, and strong sense of honor and duty.",
    focus: "Discipline, craftsmanship, honor",
    influence: "Strong in Industrial Pact",
    iconColor: "text-stone-500",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=500&auto=format&fit=crop",
    symbolImage: "https://images.unsplash.com/photo-1566066053148-51b0544d4dfe?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: "ravenhold",
    name: "Ravenhold",
    description: "The enigmatic faction of Eastern Varithis that practices dark magic and thrives on political intrigue and ruthless ambition.",
    focus: "Dark magic, political intrigue",
    influence: "Powerful in Shadow Triumvirate",
    iconColor: "text-purple-800",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=500&auto=format&fit=crop",
    symbolImage: "https://images.unsplash.com/photo-1614935151651-0bea6508db74?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: "brightforge",
    name: "Brightforge",
    description: "The innovative craftsmen of Central Varithis who harness the Infernal Core's power for technological advancement and progress.",
    focus: "Innovation, craftsmanship, progress",
    influence: "Central in Industrial Pact",
    iconColor: "text-amber-500",
    image: "https://images.unsplash.com/photo-1562592306-42161f1ade8d?q=80&w=500&auto=format&fit=crop",
    symbolImage: "https://images.unsplash.com/photo-1518133227682-c0e3e34de21b?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: "elderwood",
    name: "Elderwood",
    description: "The nature-aligned dwellers of Southern Varithis who venerate the Ancient Grove and maintain a deep spiritual connection with the land.",
    focus: "Nature reverence, harmony, balance",
    influence: "Foundation of Northern Alliance",
    iconColor: "text-accent-green",
    image: "https://images.unsplash.com/photo-1500964757637-c85e8c8bf334?q=80&w=500&auto=format&fit=crop",
    symbolImage: "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: "gravewater",
    name: "Gravewater",
    description: "The secretive necromancers of Western Varithis who dwell in the Wailing Fen and pursue forbidden powers beyond mortal understanding.",
    focus: "Necromancy, forbidden knowledge",
    influence: "Growing in Shadow Triumvirate",
    iconColor: "text-emerald-800",
    image: "https://images.unsplash.com/photo-1572463473745-95b01fa177b7?q=80&w=500&auto=format&fit=crop",
    symbolImage: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: "sundermire",
    name: "Sundermire",
    description: "The dark magic practitioners of Southwestern Varithis who have adapted to the hostile swamps and follow ancient shadowed traditions.",
    focus: "Dark magic, swamp resilience",
    influence: "Volatile in Shadow Triumvirate",
    iconColor: "text-teal-800",
    image: "https://images.unsplash.com/photo-1604537372136-89b3dae196e3?q=80&w=500&auto=format&fit=crop",
    symbolImage: "https://images.unsplash.com/photo-1567359549573-dd14af2b7b25?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: "stormharbor",
    name: "Stormharbor",
    description: "The seafaring pirates and traders of Eastern Varithis who control the Tempest Isles and embrace maritime freedom and chaos.",
    focus: "Maritime trade, piracy",
    influence: "Independent Power",
    iconColor: "text-accent-blue",
    image: "https://images.unsplash.com/photo-1439405326854-014607f694d7?q=80&w=500&auto=format&fit=crop",
    symbolImage: "https://images.unsplash.com/photo-1633332755350-5f1b0eb64ae3?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: "highmoor",
    name: "Highmoor",
    description: "The disciplined military society of Central Varithis who maintain order and justice from their commanding position on the Skyreach Plateau.",
    focus: "Military discipline, order, justice",
    influence: "Independent Power",
    iconColor: "text-accent-red",
    image: "https://images.unsplash.com/photo-1587582345426-bf07d078f893?q=80&w=500&auto=format&fit=crop",
    symbolImage: "https://images.unsplash.com/photo-1519978428592-eadea5bdb2be?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: "ironwell",
    name: "Ironwell",
    description: "The industrial innovators of Western Varithis who extract and transform the resources of the Ironcrag Mountains through advanced technology.",
    focus: "Industry, innovation, technology",
    influence: "Rising in Industrial Pact",
    iconColor: "text-neutral-500",
    image: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?q=80&w=500&auto=format&fit=crop",
    symbolImage: "https://images.unsplash.com/photo-1537122567645-f995f9e8fe9a?w=100&auto=format&fit=crop&q=60"
  },
  {
    id: "timberholt",
    name: "Timberholt",
    description: "The forest guardians of Northeastern Varithis who protect the Whispering Woods and maintain deep spiritual connections with nature.",
    focus: "Nature guardians, spirituality",
    influence: "Key in Northern Alliance",
    iconColor: "text-lime-700",
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=500&auto=format&fit=crop",
    symbolImage: "https://images.unsplash.com/photo-1566808907623-9fc1ce748645?w=100&auto=format&fit=crop&q=60"
  }
];

// Locations
export const locations: Location[] = [
  {
    id: "frostholmCity",
    name: "Frostholm - The Frozen Citadel",
    region: "Northern Varithis",
    description: [
      "Massive walls of bluish ice and stone rise against the backdrop of snow-capped mountains. Smoke rises from countless hearths within, a testament to life thriving in the harshest conditions.",
      "Warriors clad in furs and steel train in open courtyards, their breath forming clouds in the frigid air. Ancient banners bearing clan symbols flutter from towers etched with runes of protection.",
      "The Council of Elders' fortress stands at the highest point, its ice-crystal dome capturing and refracting the northern lights that dance across the night sky - a symbol of the ancestors' watchful gaze."
    ],
    image: "https://images.unsplash.com/photo-1610555356070-d0efbf3f0b1b?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "brightforgeCore",
    name: "Brightforge - The Crucible",
    region: "Central Varithis - Infernal Core",
    description: [
      "A wonder of engineering rises from the volcanic caldera - a city of brass, steel and glass that harnesses the raw power beneath. Steam vents punctuate the landscape, powering countless machines.",
      "Artificers and alchemists work tirelessly in workshops that line the terraced streets, creating innovations that blend magic and technology. The air vibrates with energy and possibility.",
      "At the center stands the Eternal Forge, a massive foundry containing a controlled fragment of the Infernal Core itself, its pulsing orange-red glow visible for miles in every direction."
    ],
    image: "https://images.unsplash.com/photo-1520034475321-cbe63696469a?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "elderwoodHeart",
    name: "Elderwood - The Great Oak",
    region: "Southern Varithis - Ancient Grove",
    description: [
      "Living architecture seamlessly blends with ancient trees that tower hundreds of feet overhead. Bridges of root and vine connect dwellings nestled among branches that have witnessed millennia.",
      "Druids and nature shamans tend to sacred groves where magical creatures roam freely. The air is rich with the scent of flowers that bloom regardless of season, sustained by primal magic.",
      "At the heart stands the Great Oak, a tree of impossible size whose roots are said to touch every corner of Varithis. The Circle of Elders convenes within its hollow, communing with ancient spirits."
    ],
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "gravewaterDepths",
    name: "Gravewater - The Sunken Necropolis",
    region: "Western Varithis - Wailing Fen",
    description: [
      "Half-submerged ruins of an ancient civilization emerge from the mist-shrouded marsh. Eerie lights glow from within structures of black stone, marking the presence of necromantic workings.",
      "Pale figures move silently along elevated walkways connecting the scattered islands, attended by animated servants that require neither rest nor air. The boundaries between life and death blur here.",
      "The Council of Shades presides from a palace of bone and obsidian, where the veil between worlds is thinnest and the whispers of the dead guide their pursuit of forbidden knowledge."
    ],
    image: "https://images.unsplash.com/photo-1572463473745-95b01fa177b7?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "ravenholdSpires",
    name: "Ravenhold - The Dark Citadel",
    region: "Eastern Varithis",
    description: [
      "Slender towers of shadow-black stone pierce the perpetually overcast sky, connected by bridges that seem impossibly delicate. Ravens circle continuously, serving as the eyes and messengers of the Dark Council.",
      "The streets below are a maze of intrigue, where hooded figures trade secrets as valuable as gold. Hidden libraries contain texts forbidden elsewhere in Varithis, drawing scholars willing to risk their souls.",
      "At the heart of the city stands the Veil Sanctum, where the most powerful mages conduct rituals that warp reality itself, their ambitions known only to those within the innermost circle."
    ],
    image: "https://images.unsplash.com/photo-1564769625905-65e952bebe10?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "ironwellForge",
    name: "Ironwell - The Mountain Heart",
    region: "Western Varithis - Ironcrag Mountains",
    description: [
      "The mountain face is carved with massive doors and ventilation shafts, beyond which lies a city largely built within the stone itself. The rhythmic sound of hammers echoes throughout day and night.",
      "Vast mining operations extend deep below, while refineries and factories rise along the terraced exterior. Railways carry ore and finished goods, powered by steam engines of ingenious design.",
      "The Iron Council chamber sits atop a massive pillar of untouched ore at the cavern's center - a symbol of the wealth that remains to be claimed and the ingenious spirit that will extract it."
    ],
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "stormharborDocks",
    name: "Stormharbor - The Tempest Haven",
    region: "Eastern Varithis - Tempest Isles",
    description: [
      "A sprawling port built around a natural bay, protected from the worst of the perpetual storms by massive sea walls. Ships of all designs crowd the docks, from sleek raiders to massive trading vessels.",
      "The city itself is a chaotic blend of architectural styles plundered from across Varithis and beyond. Taverns and trading houses do business alongside fence shops and smugglers' dens without pretense.",
      "The Council of Captains meets in a grand hall built from the salvaged hulls of legendary ships, where the constant sound of the sea reminds all that their true loyalty is to the freedom of the waves."
    ],
    image: "https://images.unsplash.com/photo-1520349211898-59384efafa23?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "highmoorCitadel",
    name: "Highmoor - The Sentinel Fortress",
    region: "Central Varithis - Skyreach Plateau",
    description: [
      "A city built for defense rises from the elevated plateau, its concentric walls designed to repel any assault. Military precision is evident in every aspect, from the grid-like streets to the uniform architecture.",
      "Training grounds occupy much of the outer rings, where soldiers drill in formation under the watchful eyes of veterans. The sound of marching and commands fills the air from dawn until dusk.",
      "The Council of Commanders governs from a central keep that offers views of all surrounding lands, allowing them to respond swiftly to any threat to the order they have dedicated themselves to maintaining."
    ],
    image: "https://images.unsplash.com/photo-1596825205290-82b7188543c5?q=80&w=600&auto=format&fit=crop"
  }
];

// Character Backgrounds
export const backgrounds: CharacterBackground[] = [
  {
    id: "frostwarrior",
    name: "Frostholm Warrior",
    description: "Raised in the harsh Northern traditions of Frostholm, you are skilled in combat and survival with a deep respect for ancestral wisdom."
  },
  {
    id: "artifex",
    name: "Brightforge Artifex",
    description: "Trained in the innovative traditions of Brightforge, you blend technology and magic in unique ways that push the boundaries of what's possible."
  },
  {
    id: "druid",
    name: "Elderwood Guardian",
    description: "Initiated into the ancient nature magic of Elderwood, you commune with spirits and draw power from the land itself."
  },
  {
    id: "necromancer",
    name: "Gravewater Disciple",
    description: "You've studied the forbidden arts of Gravewater, gaining insights into death magic that both empower and isolate you."
  },
  {
    id: "shadowmage",
    name: "Ravenhold Adept",
    description: "Trained in the secretive arcane traditions of Ravenhold, you navigate political intrigue while wielding dark magic."
  },
  {
    id: "engineer",
    name: "Ironwell Engineer",
    description: "Your technical genius was honed in the industrial complexes of Ironwell, where you learned to create and control mechanical marvels."
  },
  {
    id: "corsair",
    name: "Stormharbor Corsair",
    description: "Life on the Tempest Isles has taught you maritime skills and opportunistic tactics that serve well both in trade and raid."
  },
  {
    id: "sentinel",
    name: "Highmoor Sentinel",
    description: "Disciplined military training from Highmoor has instilled in you a sense of duty, tactical thinking, and unwavering resolve."
  },
  {
    id: "occultist",
    name: "Sundermire Occultist",
    description: "The shadowed swamps of Sundermire have taught you esoteric magical practices unknown to most, blending elements of dark shamanism."
  },
  {
    id: "forester",
    name: "Timberholt Warden",
    description: "As a guardian of the Whispering Woods, you've learned to move unseen, commune with forest spirits, and use nature's own weapons."
  },
  {
    id: "diplomat",
    name: "Varithian Diplomat",
    description: "Your training in navigating the complex relationships between factions has made you adept at negotiation and reading people."
  }
];

// Portrait image options
export const portraitImages = {
  // Northern Alliance portraits
  frostwarrior: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=400&auto=format&fit=crop&q=60",
  druid: "https://images.unsplash.com/photo-1551006917-3b4c078c47c9?w=400&auto=format&fit=crop&q=60",
  forester: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&auto=format&fit=crop&q=60",
  
  // Industrial Pact portraits
  artifex: "https://images.unsplash.com/photo-1607990283143-2c5e98371f24?w=400&auto=format&fit=crop&q=60",
  engineer: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=400&auto=format&fit=crop&q=60",
  sentinel: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=60",
  
  // Shadow Triumvirate portraits
  necromancer: "https://images.unsplash.com/photo-1626197351117-be49d5c258cd?w=400&auto=format&fit=crop&q=60",
  shadowmage: "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=400&auto=format&fit=crop&q=60",
  occultist: "https://images.unsplash.com/photo-1627893292288-38aa809accc2?w=400&auto=format&fit=crop&q=60",
  
  // Independent Powers portraits
  corsair: "https://images.unsplash.com/photo-1577639673457-a0dd62d701cd?w=400&auto=format&fit=crop&q=60",
  diplomat: "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=400&auto=format&fit=crop&q=60"
};

// Dialogue choices for the starting scene
export const startingChoices: DialogueChoice[] = [
  {
    id: "curious",
    text: "I'm listening. What does the Network want with me?",
    description: "Show cautious interest",
    requirements: null,
    consequences: { faction: { shadow: 1 } }
  },
  {
    id: "suspicious",
    text: "The Shadow Network has a dangerous reputation. Why should I trust you?",
    description: "Express suspicion",
    requirements: { intelligence: 6 },
    consequences: { faction: { shadow: 0 } }
  },
  {
    id: "hostile",
    text: "I don't deal with spies and assassins. Leave me be.",
    description: "Reject the offer",
    requirements: null,
    consequences: { faction: { shadow: -2 } }
  },
  {
    id: "eager",
    text: "I've been hoping to make connections with the Network. What's the pay?",
    description: "Show enthusiasm",
    requirements: { previousContact: "shadow" },
    consequences: { faction: { shadow: 2 } }
  }
];

// Lore regions
export const loreRegions: LoreRegion[] = [
  {
    id: "frozenNorth",
    name: "Northern Varithis",
    description: "The frost-covered lands of Northern Varithis, home to Frostholm. A harsh land of resilient people, ancient traditions, and warrior clans bound by honor and survival.",
    territory: "Frostholm Territory",
    location: "Northern Varithis",
    image: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "infernalCore",
    name: "The Infernal Core",
    description: "The volcanic heart of Central Varithis where Brightforge harnesses the power of natural thermal vents and rare minerals for their technological innovations and magical experiments.",
    territory: "Brightforge Territory",
    location: "Central Varithis",
    image: "https://images.unsplash.com/photo-1554232682-b9ef9c92f8de?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "ancientGrove",
    name: "The Ancient Grove",
    description: "The mystical forests of Southern Varithis where the Elderwood faction communes with ancient spirits and nurtures the primal magic that flows from the heart of the continent.",
    territory: "Elderwood Territory",
    location: "Southern Varithis",
    image: "https://images.unsplash.com/photo-1516825907352-1d27e9e0a544?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "wailingFen",
    name: "The Wailing Fen",
    description: "The eerie marshlands of Western Varithis where Gravewater's necromancers practice their forbidden arts among the ruins of a fallen civilization, surrounded by restless spirits.",
    territory: "Gravewater Territory",
    location: "Western Varithis",
    image: "https://images.unsplash.com/photo-1516125073169-9e3ecdee83e7?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "ironcragMountains",
    name: "The Ironcrag Mountains",
    description: "The mineral-rich mountain range of Western Varithis, where Ironwell's industrial facilities and mining operations extract precious resources to fuel technological advancement.",
    territory: "Ironwell Territory",
    location: "Western Varithis",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "skyreachPlateau",
    name: "The Skyreach Plateau",
    description: "The elevated highlands of Central Varithis where Highmoor's disciplined military society trains and maintains order, overlooking the lands below from their impregnable fortresses.",
    territory: "Highmoor Territory",
    location: "Central Varithis",
    image: "https://images.unsplash.com/photo-1472068113808-609faf3a6cf1?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "tempestIsles",
    name: "The Tempest Isles",
    description: "The storm-battered archipelago of Eastern Varithis where Stormharbor's seafaring pirates and traders navigate the treacherous waters and build their wealth through both legitimate and illicit means.",
    territory: "Stormharbor Territory",
    location: "Eastern Varithis",
    image: "https://images.unsplash.com/photo-1518450757801-26b08ea4f8bf?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "shadowedSwamps",
    name: "The Shadowed Swamps",
    description: "The mysterious wetlands of Southwestern Varithis where Sundermire's dark magic practitioners have adapted to the hostile environment and guard ancient secrets in their isolated communities.",
    territory: "Sundermire Territory",
    location: "Southwestern Varithis",
    image: "https://images.unsplash.com/photo-1634918466321-a6eb4de207c4?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "whisperingWoods",
    name: "The Whispering Woods",
    description: "The enchanted forests of Northeastern Varithis where Timberholt's guardians protect ancient trees said to contain the wisdom of the ages and maintain the balance of natural energies.",
    territory: "Timberholt Territory",
    location: "Northeastern Varithis",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=500&auto=format&fit=crop&q=60"
  }
];

// Timeline events
export const timelineEvents: TimelineEvent[] = [
  {
    year: "847 Years Ago",
    title: "The Great Cataclysm",
    description: "A magical disaster of unprecedented scale reshapes portions of the continent, creating the Shattered Isles and the Wound – a massive chasm filled with chaotic magical energies."
  },
  {
    year: "765 Years Ago",
    title: "Rise of the Necromancers",
    description: "The first necromantic schools emerge in what would later become the Wailing Fen, establishing the foundations for the Gravewater faction."
  },
  {
    year: "640 Years Ago",
    title: "The Northern Pact",
    description: "The ancestors of Frostholm, Elderwood, and Timberholt form the first Northern Alliance, establishing trade routes and mutual defense against southern threats."
  },
  {
    year: "512 Years Ago",
    title: "Founding of the Empire",
    description: "Caelus the Unifier completes his campaign to bring the warring kingdoms under a single banner, establishing the Varithian Empire with its capital at Emperium."
  },
  {
    year: "430 Years Ago",
    title: "The Brightforge Discovery",
    description: "Engineers discover the potential of harnessing the Infernal Core's energy, leading to a technological revolution and the founding of Brightforge."
  },
  {
    year: "350 Years Ago",
    title: "The Iron War",
    description: "Conflict erupts between Ironwell and forest factions over resource extraction, ultimately establishing current territorial boundaries and lasting tensions."
  },
  {
    year: "215 Years Ago",
    title: "Rise of the Ravenhold",
    description: "The Dark Council seizes power in Eastern Varithis, establishing Ravenhold and beginning their accumulation of forbidden knowledge and political influence."
  },
  {
    year: "180 Years Ago",
    title: "The Tempest Conquest",
    description: "Pirate Captain Maeran unites the warring fleets of the eastern archipelago to form Stormharbor, creating an economic and naval power that defies imperial control."
  },
  {
    year: "140 Years Ago",
    title: "Highmoor Rebellion",
    description: "Military leaders on the Skyreach Plateau overthrow imperial governance, establishing the Council of Commanders and Highmoor's martial society."
  },
  {
    year: "103 Years Ago",
    title: "The Succession Crisis",
    description: "The death of Emperor Meridian IV without an heir leads to political fragmentation and the decline of central imperial authority, cementing the faction-dominated landscape of modern Varithis."
  }
];

// Game features
export const gameFeatures = [
  {
    icon: "book-open",
    title: "Rich Storytelling",
    description: "Immerse yourself in deep narrative arcs with branching storylines affected by your choices."
  },
  {
    icon: "users",
    title: "Complex Factions",
    description: "Align with powerful factions, each with unique philosophies, abilities, and conflicts."
  },
  {
    icon: "map-marked-alt",
    title: "Epic World",
    description: "Explore diverse regions with their own cultures, dangers, and opportunities for adventure."
  }
];
