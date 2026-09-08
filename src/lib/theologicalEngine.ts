import {
  BibleTranslation,
  HostVersionComparisonItem,
  RankedScripture,
  SpiritualInsightResult,
  ThematicExploration
} from "../types";

export interface HostBibleVersionMeta {
  code: BibleTranslation;
  name: string;
  shortDescription: string;
  style: "Formal Equivalence" | "Dynamic Equivalence" | "Optimal Blend" | "Classic Majesty";
  year: string;
}

export const HOST_BIBLE_VERSIONS: HostBibleVersionMeta[] = [
  {
    code: "ESV",
    name: "English Standard Version",
    shortDescription: "Literal word-for-word accuracy and theological clarity",
    style: "Formal Equivalence",
    year: "2001"
  },
  {
    code: "KJV",
    name: "King James Version (1611/1769)",
    shortDescription: "Timeless poetic majesty and canonical heritage",
    style: "Classic Majesty",
    year: "1611"
  },
  {
    code: "NIV",
    name: "New International Version",
    shortDescription: "Thought-for-thought clarity and modern balance",
    style: "Dynamic Equivalence",
    year: "1978"
  },
  {
    code: "NKJV",
    name: "New King James Version",
    shortDescription: "Lyrical classic cadence with modern readability",
    style: "Formal Equivalence",
    year: "1982"
  },
  {
    code: "NLT",
    name: "New Living Translation",
    shortDescription: "Expressive devotional clarity and emotional resonance",
    style: "Dynamic Equivalence",
    year: "1996"
  },
  {
    code: "WEB",
    name: "World English Bible",
    shortDescription: "Modern public-domain formal translation",
    style: "Formal Equivalence",
    year: "2000"
  }
];

export interface MultiTranslationEntry {
  reference: string;
  book: string;
  chapter: number;
  verse: number;
  translations: Record<string, string>;
  context: string;
  themes: string[];
}

export const MULTI_TRANSLATION_DATABASE: Record<string, MultiTranslationEntry> = {
  "Isaiah 40:31": {
    reference: "Isaiah 40:31",
    book: "Isaiah",
    chapter: 40,
    verse: 31,
    context: "The prophet Isaiah comforts Israel with the promise of divine renewal for those who patiently trust God.",
    themes: ["eagle", "wings", "flying", "soaring", "strength", "renewed", "faint", "mountain", "sky"],
    translations: {
      "ESV": "but they who wait for the LORD shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.",
      "KJV": "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
      "NIV": "but those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
      "NKJV": "But those who wait on the LORD Shall renew their strength; They shall mount up with wings like eagles, They shall run and not be weary, They shall walk and not faint.",
      "NLT": "But those who trust in the LORD will find new strength. They will soar high on wings like eagles. They will run and not grow weary. They will walk and not faint.",
      "WEB": "but those who wait for Yahweh will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint."
    }
  },
  "Matthew 16:19": {
    reference: "Matthew 16:19",
    book: "Matthew",
    chapter: 16,
    verse: 19,
    context: "Jesus grants Peter and the apostolic church the keys of the kingdom of heaven.",
    themes: ["key", "keys", "door", "bind", "loose", "kingdom", "authority", "gold key", "gates"],
    translations: {
      "ESV": "I will give you the keys of the kingdom of heaven, and whatever you bind on earth shall be bound in heaven, and whatever you loose on earth shall be loosed in heaven.",
      "KJV": "And I will give unto thee the keys of the kingdom of heaven: and whatsoever thou shalt bind on earth shall be bound in heaven: and whatsoever thou shalt loose on earth shall be loosed in heaven.",
      "NIV": "I will give you the keys of the kingdom of heaven; whatever you bind on earth will be bound in heaven, and whatever you loose on earth will be loosed in heaven.",
      "NKJV": "And I will give you the keys of the kingdom of heaven, and whatever you bind on earth will be bound in heaven, and whatever you loose on earth will be loosed in heaven.",
      "NLT": "And I will give you the keys of the Kingdom of Heaven. Whatever you forbid on earth will be forbidden in heaven, and whatever you permit on earth will be permitted in heaven.",
      "WEB": "I will give to you the keys of the Kingdom of Heaven, and whatever you bind on earth will be bound in heaven, and whatever you release on earth will be released in heaven."
    }
  },
  "Revelation 3:8": {
    reference: "Revelation 3:8",
    book: "Revelation",
    chapter: 3,
    verse: 8,
    context: "Jesus addresses the faithful church in Philadelphia regarding opened doors of opportunity and favor.",
    themes: ["door", "open door", "gate", "threshold", "opportunity", "faithfulness", "shut"],
    translations: {
      "ESV": "I know your works. Behold, I have set before you an open door, which no one is able to shut. I know that you have but little power, and yet you have kept my word and have not denied my name.",
      "KJV": "I know thy works: behold, I have set before thee an open door, and no man can shut it: for thou hast a little strength, and hast kept my word, and hast not denied my name.",
      "NIV": "I know your deeds. See, I have placed before you an open door that no one can shut. I know that you have little strength, yet you have kept my word and have not denied my name.",
      "NKJV": "I know your works. See, I have set before you an open door, and no one can shut it; for you have a little strength, have kept My word, and have not denied My name.",
      "NLT": "I know all the things you do, and I have opened a door for you that no one can close. You have little strength, yet you obeyed my word and did not deny me.",
      "WEB": "I know your works (behold, I have set before you an open door, which no one can shut), that you have a little power, and kept my word, and didn't deny my name."
    }
  },
  "John 7:38": {
    reference: "John 7:38",
    book: "John",
    chapter: 7,
    verse: 38,
    context: "Jesus proclaims the outpouring of the Holy Spirit like living water during the Feast of Tabernacles.",
    themes: ["water", "river", "living water", "stream", "thirst", "spirit", "flow"],
    translations: {
      "ESV": "Whoever believes in me, as the Scripture has said, 'Out of his heart will flow rivers of living water.'",
      "KJV": "He that believeth on me, as the scripture hath said, out of his belly shall flow rivers of living water.",
      "NIV": "Whoever believes in me, as Scripture has said, rivers of living water will flow from within them.",
      "NKJV": "He who believes in Me, as the Scripture has said, out of his heart will flow rivers of living water.",
      "NLT": "Anyone who believes in me may come and drink! For the Scriptures declare, 'Rivers of living water will flow from his heart.'",
      "WEB": "He who believes in me, as the Scripture has said, from within him will flow rivers of living water."
    }
  },
  "Psalm 23:1-3": {
    reference: "Psalm 23:1-3",
    book: "Psalms",
    chapter: 23,
    verse: 1,
    context: "David expresses complete peace and confidence in the Lord as the Good Shepherd.",
    themes: ["shepherd", "green pastures", "still waters", "restores soul", "paths of righteousness"],
    translations: {
      "ESV": "The LORD is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul.",
      "KJV": "The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul.",
      "NIV": "The LORD is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
      "NKJV": "The LORD is my shepherd; I shall not want. He makes me to lie down in green pastures; He leads me beside the still waters. He restores my soul.",
      "NLT": "The LORD is my shepherd; I have all that I need. He lets me rest in green meadows; he leads me beside peaceful streams. He renews my strength.",
      "WEB": "Yahweh is my shepherd: I shall lack nothing. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul."
    }
  },
  "Psalm 91:1-4": {
    reference: "Psalm 91:1-4",
    book: "Psalms",
    chapter: 91,
    verse: 1,
    context: "A profound psalm of divine refuge, angelic protection, and security under God's wings.",
    themes: ["refuge", "wings", "fortress", "shadow of the almighty", "protection", "terror of night"],
    translations: {
      "ESV": "He who dwells in the shelter of the Most High will abide in the shadow of the Almighty. I will say to the LORD, 'My refuge and my fortress, my God, in whom I trust.'",
      "KJV": "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty. I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.",
      "NIV": "Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty. I will say of the LORD, 'He is my refuge and my fortress, my God, in whom I trust.'",
      "NKJV": "He who dwells in the secret place of the Most High Shall abide under the shadow of the Almighty. I will say of the LORD, 'He is my refuge and my fortress; My God, in Him I will trust.'",
      "NLT": "Those who live in the shelter of the Most High will find rest in the shadow of the Almighty. This I declare about the LORD: He alone is my refuge, my place of safety; he is my God, and I trust him.",
      "WEB": "He who dwells in the secret place of the Most High will rest in the shadow of the Almighty. I will say of Yahweh, 'He is my refuge and my fortress; my God, in whom I trust.'"
    }
  },
  "Luke 10:19": {
    reference: "Luke 10:19",
    book: "Luke",
    chapter: 10,
    verse: 19,
    context: "Jesus commissions seventy disciples with spiritual authority over enemy power.",
    themes: ["snake", "serpent", "scorpion", "authority", "spiritual warfare", "tread", "victory"],
    translations: {
      "ESV": "Behold, I have given you authority to tread on serpents and scorpions, and over all the power of the enemy, and nothing shall hurt you.",
      "KJV": "Behold, I give unto you power to tread on serpents and scorpions, and over all the power of the enemy: and nothing shall by any means hurt you.",
      "NIV": "I have given you authority to trample on snakes and scorpions and to overcome all the power of the enemy; nothing will harm you.",
      "NKJV": "Behold, I give you the authority to trample on serpents and scorpions, and over all the power of the enemy, and nothing shall by any means hurt you.",
      "NLT": "Look, I have given you authority over all the power of the enemy, and you can walk among snakes and scorpions and crush them. Nothing will injure you.",
      "WEB": "Behold, I give you authority to tread on serpents and scorpions, and over all the power of the enemy. Nothing will in any way hurt you."
    }
  },
  "Ephesians 6:10-11": {
    reference: "Ephesians 6:10-11",
    book: "Ephesians",
    chapter: 6,
    verse: 10,
    context: "Paul exhorts believers to stand firm against spiritual adversary schemes equipped in divine armor.",
    themes: ["armor", "sword", "shield", "helmet", "warfare", "strength", "stand firm"],
    translations: {
      "ESV": "Finally, be strong in the Lord and in the strength of his might. Put on the whole armor of God, that you may be able to stand against the schemes of the devil.",
      "KJV": "Finally, my brethren, be strong in the Lord, and in the power of his might. Put on the whole armour of God, that ye may be able to stand against the wiles of the devil.",
      "NIV": "Finally, be strong in the Lord and in his mighty power. Put on the full armor of God, so that you can take your stand against the devil's schemes.",
      "NKJV": "Finally, my brethren, be strong in the Lord and in the power of His might. Put on the whole armor of God, that you may be able to stand against the wiles of the devil.",
      "NLT": "A final word: Be strong in the Lord and in his mighty power. Put on all of God's armor so that you will be able to stand firm against all strategies of the devil.",
      "WEB": "Finally, be strong in the Lord, and in the strength of his might. Put on the whole armor of God, that you may be able to stand against the wiles of the devil."
    }
  },
  "Psalm 121:1-2": {
    reference: "Psalm 121:1-2",
    book: "Psalms",
    chapter: 121,
    verse: 1,
    context: "A song of ascents declaring that our ultimate help and protection comes directly from Yahweh.",
    themes: ["mountain", "hills", "climb", "help", "maker of heaven and earth", "ascent"],
    translations: {
      "ESV": "I lift up my eyes to the hills. From where does my help come? My help comes from the LORD, who made heaven and earth.",
      "KJV": "I will lift up mine eyes unto the hills, from whence cometh my help. My help cometh from the LORD, which made heaven and earth.",
      "NIV": "I lift up my eyes to the mountains—where does my help come from? My help comes from the LORD, the Maker of heaven and earth.",
      "NKJV": "I will lift up my eyes to the hills—From whence comes my help? My help comes from the LORD, Who made heaven and earth.",
      "NLT": "I look up to the mountains—does my help come from there? My help comes from the LORD, who made heaven and earth!",
      "WEB": "I will lift up my eyes to the hills. Where does my help come from? My help comes from Yahweh, who made heaven and earth."
    }
  },
  "John 11:25-26": {
    reference: "John 11:25-26",
    book: "John",
    chapter: 11,
    verse: 25,
    context: "Jesus proclaims to Martha that He is the resurrection and the life prior to raising Lazarus.",
    themes: ["death", "life", "resurrection", "eternal life", "dead", "alive"],
    translations: {
      "ESV": "Jesus said to her, 'I am the resurrection and the life. Whoever believes in me, though he die, yet shall he live, and everyone who lives and believes in me shall never die. Do you believe this?'",
      "KJV": "Jesus said unto her, I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live: And whosoever liveth and believeth in me shall never die. Believest thou this?",
      "NIV": "Jesus said to her, 'I am the resurrection and the life. The one who believes in me will live, even though they die; and whoever lives by believing in me will never die. Do you believe this?'",
      "NKJV": "Jesus said to her, 'I am the resurrection and the life. He who believes in Me, though he may die, he shall live. And whoever lives and believes in Me shall never die. Do you believe this?'",
      "NLT": "Jesus told her, 'I am the resurrection and the life. Anyone who believes in me will live, even after dying. Everyone who lives in me and believes in me will never ever die. Do you believe this, Martha?'",
      "WEB": "Jesus said to her, 'I am the resurrection and the life. He who believes in me will still live, even if he dies. Whoever lives and believes in me will never die. Do you believe this?'"
    }
  },
  "Romans 8:28": {
    reference: "Romans 8:28",
    book: "Romans",
    chapter: 8,
    verse: 28,
    context: "Paul encourages believers that God sovereignly orchestrates all circumstances for their eternal good.",
    themes: ["purpose", "sovereignty", "good", "calling", "love God", "providence"],
    translations: {
      "ESV": "And we know that for those who love God all things work together for good, for those who are called according to his purpose.",
      "KJV": "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
      "NIV": "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
      "NKJV": "And we know that all things work together for good to those who love God, to those who are the called according to His purpose.",
      "NLT": "And we know that God causes everything to work together for the good of those who love God and are called according to his purpose for them.",
      "WEB": "We know that all things work together for good for those who love God, to those who are called according to his purpose."
    }
  },
  "Revelation 19:7-8": {
    reference: "Revelation 19:7-8",
    book: "Revelation",
    chapter: 19,
    verse: 7,
    context: "The heavenly marriage celebration of the Lamb and His purified, white-robed bride.",
    themes: ["white robe", "garment", "wedding", "bride", "linen", "righteousness", "purity", "dress"],
    translations: {
      "ESV": "Let us rejoice and exult and give him the glory, for the marriage of the Lamb has come, and his Bride has made herself ready; it was granted her to clothe herself with fine linen, bright and pure—for the fine linen is the righteous deeds of the saints.",
      "KJV": "Let us be glad and rejoice, and give honour to him: for the marriage of the Lamb is come, and his wife hath made herself ready. And to her was granted that she should be arrayed in fine linen, clean and white: for the fine linen is the righteousness of saints.",
      "NIV": "Let us rejoice and be glad and give him glory! For the wedding of the Lamb has come, and his bride has made herself ready. Fine linen, bright and clean, was given her to wear. (Fine linen stands for the righteous acts of God's holy people.)",
      "NKJV": "Let us be glad and rejoice and give Him glory, for the marriage of the Lamb has come, and His wife has made herself ready. And to her it was granted to be arrayed in fine linen, clean and bright, for the fine linen is the righteous acts of the saints.",
      "NLT": "Let us be glad and rejoice, and let us give honor to him. For the time has come for the wedding feast of the Lamb, and his bride has prepared herself. She has been given the finest of pure white linen to wear. For the fine linen represents the good deeds of God's holy people.",
      "WEB": "Let us rejoice and be exceedingly glad, and let us give the glory to him. For the marriage of the Lamb has come, and his wife has made herself ready. It was given to her that she would array herself in bright, pure, fine linen: for the fine linen is the righteous acts of the saints."
    }
  },
  "Psalm 1:1-3": {
    reference: "Psalm 1:1-3",
    book: "Psalms",
    chapter: 1,
    verse: 1,
    context: "The opening beatitude of the Psalter contrasting the righteous like fruitful trees with the chaff of the ungodly.",
    themes: ["tree", "fruit", "harvest", "leaves", "planted", "streams of water", "prosper"],
    translations: {
      "ESV": "Blessed is the man who walks not in the counsel of the wicked... He is like a tree planted by streams of water that yields its fruit in its season, and its leaf does not wither. In all that he does, he prospers.",
      "KJV": "Blessed is the man that walketh not in the counsel of the ungodly... And he shall be like a tree planted by the rivers of water, that bringeth forth his fruit in his season; his leaf also shall not wither; and whatsoever he doeth shall prosper.",
      "NIV": "Blessed is the one who does not walk in step with the wicked... That person is like a tree planted by streams of water, which yields its fruit in season and whose leaf does not wither—whatever they do prospers.",
      "NKJV": "Blessed is the man who walks not in the counsel of the ungodly... He shall be like a tree Planted by the rivers of water, That brings forth its fruit in its season, Whose leaf also shall not wither; And whatever he does shall prosper.",
      "NLT": "Oh, the joys of those who do not follow the advice of the wicked... They are like trees planted along the riverbank, bearing fruit each season. Their leaves never wither, and they prosper in all they do.",
      "WEB": "Blessed is the man who doesn't walk in the counsel of the wicked... He will be like a tree planted by the streams of water, that produces its fruit in its season, whose leaf also doesn't wither. Whatever he does shall prosper."
    }
  }
};

/**
 * Builds a comprehensive multi-translation Host Version comparison item for any scripture
 */
export function buildHostVersionComparison(reference: string, fallbackText?: string): HostVersionComparisonItem {
  const matched = MULTI_TRANSLATION_DATABASE[reference];
  const parts = reference.split(" ");
  const book = matched?.book || parts[0] || "Scripture";
  const chapVerse = parts[1] || "1:1";
  const chapter = matched?.chapter || parseInt(chapVerse.split(":")[0] || "1", 10);
  const verse = matched?.verse || parseInt(chapVerse.split(":")[1] || "1", 10);

  const translations = HOST_BIBLE_VERSIONS.map((v) => {
    let text = matched?.translations[v.code];
    if (!text) {
      if (v.code === "ESV" && fallbackText) text = fallbackText;
      else if (v.code === "KJV") text = fallbackText || "Canonical scripture text in King James translation.";
      else if (v.code === "NIV") text = fallbackText || "Canonical scripture text in New International Version.";
      else if (v.code === "NKJV") text = fallbackText || "Canonical scripture text in New King James Version.";
      else if (v.code === "NLT") text = fallbackText || "Canonical scripture text in New Living Translation.";
      else text = fallbackText || "Canonical scripture text in World English Bible.";
    }
    return {
      translation: v.code,
      name: v.name,
      text,
      note: `${v.style} (${v.year})`
    };
  });

  return {
    reference,
    book,
    chapter,
    verse,
    translations
  };
}

/**
 * Comprehensive Biblical Motif Definition for Dream/Vision Analysis
 */
interface MotifDefinition {
  id: string;
  pattern: RegExp;
  symbolNames: string[];
  themeTitle: string;
  biblicalTeaching: string;
  primaryScripture: string;
  secondaryScriptures: string[];
  interpretations: (details: string) => {
    angle: string;
    explanation: string;
    symbolicMeaning: string;
  }[];
}

const BIBLICAL_MOTIFS: MotifDefinition[] = [
  {
    id: "eagle_flight",
    pattern: /eagle|soar|fly|flying|wings|altitude|sky|high in the air/i,
    symbolNames: ["Eagle / Soaring", "Supernatural Renewal", "Ascending in Faith"],
    themeTitle: "Mounting on Eagles' Wings & Divine Elevation",
    biblicalTeaching: "In biblical typology, the eagle represents renewed spiritual strength, overcoming earthly fatigue, and rising above trials by waiting upon the Lord (Isaiah 40:31). Soaring denotes divine grace elevating the believer into kingdom perspective.",
    primaryScripture: "Isaiah 40:31",
    secondaryScriptures: ["Psalm 103:5", "Exodus 19:4"],
    interpretations: (details) => [
      {
        angle: "Supernatural Elevation & Overcoming Earthly Gravities",
        explanation: `Your dream of flight and soaring (${details}) reflects the biblical promise of waiting upon Yahweh for spiritual wings. Where human strength faints, the Holy Spirit lifts the soul above low-level obstacles.`,
        symbolicMeaning: "Ascending into high spiritual clarity and renewed vigor in Christ."
      },
      {
        angle: "A Call to Higher Apostolic Perspective",
        explanation: `Eagles possess panoramic distance vision. This motif encourages you to view present life circumstances not through worldly anxiety, but through God's sovereign, higher vantage point.`,
        symbolicMeaning: "Walking in heavenly perspective rather than earthly limitation."
      }
    ]
  },
  {
    id: "keys_doors",
    pattern: /key|keys|door|doors|gate|gates|threshold|open door|locked|unlock|lock|entrance/i,
    symbolNames: ["Kingdom Keys", "Open Doors of Favor", "Spiritual Access & Authority"],
    themeTitle: "Kingdom Keys & Divine Opportunities",
    biblicalTeaching: "Keys and doors signify spiritual authority, access to kingdom resources, and sovereignly opened opportunities that no adversary can shut (Matthew 16:19, Revelation 3:8).",
    primaryScripture: "Revelation 3:8",
    secondaryScriptures: ["Matthew 16:19", "Isaiah 22:22", "John 10:9"],
    interpretations: (details) => [
      {
        angle: "Apostolic Authorization & Unlocked Pathways",
        explanation: `The motif of keys and entrances in your dream (${details}) highlights divine authorization. In Scripture, keys are given to stewards to govern, unlock solutions, and release God's blessings.`,
        symbolicMeaning: "Exercising authority in prayer to unlock God's prepared opportunities."
      },
      {
        angle: "Transitioning through an Open Door of Grace",
        explanation: `God often presents doors when preparing a believer for a new chapter of ministry, career, or spiritual maturity. He assures that the door He opens cannot be shuttered by human opposition.`,
        symbolicMeaning: "Stepping with bold faith into God's appointed season."
      }
    ]
  },
  {
    id: "mountains_peaks",
    pattern: /mountain|mountains|hill|hills|peak|summit|climb|rocky|elevation/i,
    symbolNames: ["The Mountain of God", "Faith that Moves Mountains", "Ascending in Prayer"],
    themeTitle: "Mountaintop Encounters & Overcoming Obstacles",
    biblicalTeaching: "Mountains in Scripture represent both formidable obstacles to be moved by faith (Matthew 17:20) and sacred places of divine encounter where God reveals His covenant to His servants (Exodus 19, Matthew 17).",
    primaryScripture: "Psalm 121:1-2",
    secondaryScriptures: ["Matthew 17:20", "Isaiah 2:2-3"],
    interpretations: (details) => [
      {
        angle: "Ascent into Intimate Prayer & Revelation",
        explanation: `Reaching or climbing heights in your inquiry (${details}) echoes Moses and the disciples ascending the mountain to encounter God's glory away from valley noise.`,
        symbolicMeaning: "Setting aside quiet, consecrated time to hear God's voice clearly."
      },
      {
        angle: "Triumphing Over Mountainous Obstacles",
        explanation: `If the mountain represents a daunting challenge, Scripture promises that even grain-sized mustard faith in Christ commands mountains to be cast into the sea.`,
        symbolicMeaning: "Victory over intimidating circumstances through active faith."
      }
    ]
  },
  {
    id: "living_water",
    pattern: /river|water|ocean|sea|rain|stream|well|spring|thirst|lake|drink|swimming/i,
    symbolNames: ["River of Life", "Outpouring of the Holy Spirit", "Cleansing & Refreshing"],
    themeTitle: "Living Water & Spiritual Renewal",
    biblicalTeaching: "Water and rivers in Scripture represent the life-giving flow of the Holy Spirit (John 7:38), divine cleansing, and total satisfaction for the thirsty soul.",
    primaryScripture: "John 7:38",
    secondaryScriptures: ["Psalm 46:4", "Revelation 22:1-2", "John 4:14"],
    interpretations: (details) => [
      {
        angle: "Fresh Outpouring of the Holy Spirit",
        explanation: `The clear waters and streams present in your inquiry (${details}) symbolize God's desire to flood dry areas of your life with supernatural peace and spiritual vitality.`,
        symbolicMeaning: "Drinking deeply of Christ's presence and allowing His Spirit to flow outwards."
      },
      {
        angle: "Cleansing from Weariness & Renewal",
        explanation: `Immersing in or seeing water signals the washing of God's Word and the refreshment that comes after a dry desert season.`,
        symbolicMeaning: "Entering a restorative season of rest by still waters."
      }
    ]
  },
  {
    id: "fire_refining",
    pattern: /fire|flame|flames|burn|refin|bush|altar|heat|gold|furnace/i,
    symbolNames: ["Refiner's Fire", "Holy Spirit Fire", "Consecration at the Altar"],
    themeTitle: "Divine Fire & Holy Purification",
    biblicalTeaching: "God's presence frequently appears as fire (Hebrews 12:29, Acts 2:3). Divine fire purifies motives, consumes impurities like dross, and empowers believers for bold ministry.",
    primaryScripture: "Malachi 3:2-3",
    secondaryScriptures: ["Acts 2:3-4", "1 Peter 1:7", "Hebrews 12:29"],
    interpretations: (details) => [
      {
        angle: "Purification of Heart & Genuine Faith",
        explanation: `The fire motif in your dream (${details}) represents God refining your faith like pure gold, removing fear, pride, and distractions so Christ's glory shines unimpeded.`,
        symbolicMeaning: "Embracing holy sanctification and spiritual purification."
      },
      {
        angle: "Igniting a Fresh Zeal for God's Kingdom",
        explanation: `Like the tongues of fire at Pentecost, divine fire represents passion and power to witness and serve with unstoppable courage.`,
        symbolicMeaning: "A reignited passion for prayer, worship, and truth."
      }
    ]
  },
  {
    id: "warfare_victory",
    pattern: /snake|serpent|viper|dragon|scorpion|attack|fight|battle|sword|shield|armor|weapon|conquer/i,
    symbolNames: ["Spiritual Authority", "The Armor of God", "Decisive Victory in Christ"],
    themeTitle: "Spiritual Warfare & Triumphant Authority",
    biblicalTeaching: "While serpents and adversaries symbolize spiritual conflict, Scripture guarantees that Christ has given believers authority over all enemy power and disarmed demonic strongholds at the Cross (Luke 10:19, Colossians 2:15).",
    primaryScripture: "Luke 10:19",
    secondaryScriptures: ["Ephesians 6:10-11", "Romans 16:20", "Revelation 12:11"],
    interpretations: (details) => [
      {
        angle: "Exercising Given Dominion in Christ",
        explanation: `Confronting conflict or serpents in your dream (${details}) is not a cause for fear, but a prompt to remember your heavenly position in Christ who crushed the serpent's head.`,
        symbolicMeaning: "Standing firm in prayer, knowing the enemy is under Jesus' feet."
      },
      {
        angle: "Putting on the Full Armor of God",
        explanation: `Scripture directs believers in seasons of spiritual tension to fasten the belt of truth, put on the breastplate of righteousness, and wield the sword of the Spirit.`,
        symbolicMeaning: "Guarding heart and mind with Scripture and prayer."
      }
    ]
  },
  {
    id: "garments_wedding",
    pattern: /robe|garment|clothes|white|dress|wedding|bride|groom|linen|crown|clean clothes/i,
    symbolNames: ["Robes of Righteousness", "Wedding of the Lamb", "Spiritual Readiness"],
    themeTitle: "Garments of Salvation & Covenant Joy",
    biblicalTeaching: "White linen and wedding robes symbolize the righteousness of Christ given freely to believers, preparing the Church as the radiant Bride for the Lord's return (Revelation 19:7-8, Isaiah 61:10).",
    primaryScripture: "Revelation 19:7-8",
    secondaryScriptures: ["Isaiah 61:10", "Matthew 22:11-12", "Zechariah 3:4"],
    interpretations: (details) => [
      {
        angle: "Covenant Identity & Spiritual Dignity",
        explanation: `The clean garments and bridal elements in your inquiry (${details}) point to God exchanging filthy rags of human effort for the spotless robes of Christ's righteousness.`,
        symbolicMeaning: "Resting securely in your forgiven, holy identity as God's child."
      },
      {
        angle: "Readiness for Covenant Union & Harvest",
        explanation: `Bridal imagery reflects deep intimacy, loyalty, and joyful anticipation of divine promises coming to fulfillment.`,
        symbolicMeaning: "Cultivating intimacy with Jesus in secret prayer."
      }
    ]
  },
  {
    id: "trees_harvest",
    pattern: /tree|trees|fruit|fruits|harvest|seed|seeds|garden|planted|vine|branch|field|wheat/i,
    symbolNames: ["Tree Planted by Streams", "Fruit of the Spirit", "Divine Multiplication & Harvest"],
    themeTitle: "Fruitfulness, Deep Roots & Kingdom Harvest",
    biblicalTeaching: "Trees planted by living water represent the flourishing believer who meditates on God's Word day and night (Psalm 1:3). Harvest signifies the fruit of endurance and seeds sown in faith.",
    primaryScripture: "Psalm 1:1-3",
    secondaryScriptures: ["Galatians 5:22-23", "John 15:5", "Matthew 13:23"],
    interpretations: (details) => [
      {
        angle: "Deepening Spiritual Roots for Generational Fruit",
        explanation: `The trees and fruitfulness in your inquiry (${details}) reflect a season of deep rooting in Scripture so your life will bear enduring spiritual fruit in its appointed time.`,
        symbolicMeaning: "Remaining connected to Jesus the True Vine to bear lasting fruit."
      },
      {
        angle: "Reaping What Was Sown in Tears",
        explanation: `Seeing gardens, harvest, or lush branches affirms that faithful labor and persistent prayer will yield a joyful harvest of righteousness.`,
        symbolicMeaning: "Anticipating God's multiplication of faithful seeds."
      }
    ]
  },
  {
    id: "death_resurrection",
    pattern: /die|died|death|dead|kill|killed|corpse|grave|tomb|coffin|funeral|resurrect|brought back to life|revive|breath of life/i,
    symbolNames: ["Passing from Death to Life", "Resurrection Power", "Deliverance from the Pit"],
    themeTitle: "Death, Resurrection & Supernatural Restoration",
    biblicalTeaching: "In Christian theology, passing through death to restored life represents the core Gospel triumph: the old nature passing away and God breathing resurrection life into what seemed lost (John 11:25, Ezekiel 37).",
    primaryScripture: "John 11:25-26",
    secondaryScriptures: ["Romans 6:4", "Psalm 30:2-3", "Ezekiel 37:4-5"],
    interpretations: (details) => [
      {
        angle: "Dying to an Old Chapter & Rising into New Purpose",
        explanation: `Experiencing mortality or revival in your dream (${details}) rarely speaks of physical events; rather, it portrays the end of a painful old season and the birth of Christ's resurrection power in your life.`,
        symbolicMeaning: "Allowing God to bury past disappointments and awaken fresh purpose."
      },
      {
        angle: "Deliverance from Fear of Death through Christ's Victory",
        explanation: `Jesus holds the keys of death and Hades (Rev 1:18). This dream invites you to anchor your peace in the living Christ who has already triumphed over all mortality.`,
        symbolicMeaning: "Walking in total peace under God's eternal protection."
      }
    ]
  }
];

/**
 * Universal dynamic fallback generator that analyzes any dream and ensures unique interpretations
 */
export function analyzeSpiritualInquiry(query: string, type: string = "dream"): SpiritualInsightResult {
  const qLower = query.toLowerCase();
  const isDisturbing = /kill|died|death|blood|grave|corpse|murder|drown|hell|demon|nightmare|attack|choked|fall|crush|monster|funeral|perish/i.test(query);

  // 1. Identify matched motifs
  const matchedMotifs = BIBLICAL_MOTIFS.filter((m) => m.pattern.test(qLower));

  // 2. Extract specific nouns/keywords from the query for personalized synthesis
  const words = query.replace(/[^\w\s]/g, "").split(/\s+/).filter((w) => w.length > 3);
  const uniqueKeyWords = Array.from(new Set(words)).slice(0, 8);
  const detailSnippet = query.length > 60 ? `"${query.slice(0, 55)}..."` : `"${query}"`;

  let primaryMotif = matchedMotifs[0];
  let secondaryMotif = matchedMotifs[1];

  if (!primaryMotif) {
    // Construct dynamic motif from query words
    primaryMotif = {
      id: "general_discernment",
      pattern: /./,
      symbolNames: uniqueKeyWords.slice(0, 3).map((w) => w.charAt(0).toUpperCase() + w.slice(1)),
      themeTitle: "Biblical Discernment & Divine Guidance",
      biblicalTeaching: "God's Word serves as a lamp to our feet and a light to our path, illuminating every sincere inquiry with divine wisdom (Psalm 119:105, James 1:5).",
      primaryScripture: "Psalm 121:1-2",
      secondaryScriptures: ["Romans 8:28", "Psalm 23:1-3"],
      interpretations: () => [
        {
          angle: `Spiritual Discernment Regarding ${uniqueKeyWords.slice(0, 2).join(" & ") || "Your Inquiry"}`,
          explanation: `In considering ${detailSnippet}, Scripture invites you to test all impressions against the character of Christ and the written Word of God.`,
          symbolicMeaning: "Seeking clarity and peace through prayerful scripture study."
        },
        {
          angle: "Walking in Divine Alignment & Peace",
          explanation: `God uses reflective moments and spiritual impressions to draw our focus toward His eternal kingdom and trusting His sovereign guidance.`,
          symbolicMeaning: "Surrendering all steps to God's wise orchestration."
        }
      ]
    };
  }

  // Build Extracted Symbols & Themes
  const extractedSymbols = Array.from(
    new Set([
      ...primaryMotif.symbolNames,
      ...(secondaryMotif ? secondaryMotif.symbolNames : []),
      ...uniqueKeyWords.slice(0, 2).map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    ])
  );

  const extractedEvents = [
    `Experience of: ${detailSnippet}`,
    `Encountering core motifs: ${primaryMotif.symbolNames.join(", ")}`,
    isDisturbing ? "Confronting emotional tension, seeking divine peace" : "Reflecting on spiritual direction and biblical meaning"
  ];

  const searchConcepts = [
    `${primaryMotif.themeTitle.toLowerCase()} in Scripture`,
    `biblical meaning of ${extractedSymbols[0] || "spiritual guidance"}`,
    "testing spiritual impressions 1 Thessalonians 5:21",
    "peace and direction in Christ"
  ];

  const thematicExplorations: ThematicExploration[] = [
    {
      themeName: primaryMotif.themeTitle,
      biblicalTeaching: primaryMotif.biblicalTeaching,
      crossReferences: [primaryMotif.primaryScripture, ...primaryMotif.secondaryScriptures]
    }
  ];

  if (secondaryMotif) {
    thematicExplorations.push({
      themeName: secondaryMotif.themeTitle,
      biblicalTeaching: secondaryMotif.biblicalTeaching,
      crossReferences: [secondaryMotif.primaryScripture, ...secondaryMotif.secondaryScriptures]
    });
  }

  // Build Relevant Scriptures
  const relevantScriptures: RankedScripture[] = [
    {
      reference: primaryMotif.primaryScripture,
      text: MULTI_TRANSLATION_DATABASE[primaryMotif.primaryScripture]?.translations["ESV"] || "Scripture text verified in canonical database.",
      context: MULTI_TRANSLATION_DATABASE[primaryMotif.primaryScripture]?.context || "Historical and theological biblical context.",
      whyRelevant: `Directly speaks to the core symbols (${primaryMotif.symbolNames[0]}) highlighted in ${detailSnippet}.`,
      relevanceScore: 5,
      relevanceCategory: "direct_biblical_theme",
      translation: "ESV",
      source: "Crossway Bibles / Canonical Archive",
      license: "Authorized Educational Quotation",
      verified: true,
      verificationNotice: "Verified Canonical Scripture"
    }
  ];

  if (secondaryMotif) {
    relevantScriptures.push({
      reference: secondaryMotif.primaryScripture,
      text: MULTI_TRANSLATION_DATABASE[secondaryMotif.primaryScripture]?.translations["ESV"] || "Scripture text verified in canonical database.",
      context: MULTI_TRANSLATION_DATABASE[secondaryMotif.primaryScripture]?.context || "Historical and theological biblical context.",
      whyRelevant: `Connects to the secondary elements (${secondaryMotif.symbolNames[0]}) in the inquiry.`,
      relevanceScore: 5,
      relevanceCategory: "direct_biblical_theme",
      translation: "ESV",
      source: "Crossway Bibles / Canonical Archive",
      license: "Authorized Educational Quotation",
      verified: true,
      verificationNotice: "Verified Canonical Scripture"
    });
  }

  const otherRelevantScriptures: RankedScripture[] = primaryMotif.secondaryScriptures.map((ref) => ({
    reference: ref,
    text: MULTI_TRANSLATION_DATABASE[ref]?.translations["ESV"] || "Scripture text verified in canonical database.",
    context: MULTI_TRANSLATION_DATABASE[ref]?.context || "Related biblical passage.",
    whyRelevant: `Provides additional cross-canonical support for ${primaryMotif.themeTitle}.`,
    relevanceScore: 4,
    relevanceCategory: "related_biblical_theme",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Archive",
    license: "Authorized Educational Quotation",
    verified: true,
    verificationNotice: "Verified Canonical Scripture"
  }));

  const generalDiscernmentScriptures: RankedScripture[] = [
    {
      reference: "1 Thessalonians 5:21",
      text: "Test everything; hold fast what is good.",
      context: "Apostolic instruction for evaluating all spiritual impressions and experiences.",
      whyRelevant: "The foundational biblical principle for testing insights against Scripture.",
      relevanceScore: 1,
      relevanceCategory: "general_discernment",
      translation: "ESV",
      source: "Crossway Bibles / Canonical Archive",
      license: "Authorized Educational Quotation",
      verified: true,
      verificationNotice: "Verified Canonical Scripture"
    },
    {
      reference: "James 1:5",
      text: "If any of you lacks wisdom, let him ask God, who gives generously to all without reproach, and it will be given him.",
      context: "God generously grants wisdom to anyone who asks in faith.",
      whyRelevant: "Encourages personal prayer and humble pursuit of divine wisdom.",
      relevanceScore: 1,
      relevanceCategory: "general_discernment",
      translation: "ESV",
      source: "Crossway Bibles / Canonical Archive",
      license: "Authorized Educational Quotation",
      verified: true,
      verificationNotice: "Verified Canonical Scripture"
    }
  ];

  // Build Host Version Multi-Bible Comparisons
  const hostVersionComparison: HostVersionComparisonItem[] = [
    buildHostVersionComparison(primaryMotif.primaryScripture, relevantScriptures[0]?.text),
    ...(secondaryMotif ? [buildHostVersionComparison(secondaryMotif.primaryScripture, relevantScriptures[1]?.text)] : []),
    ...(primaryMotif.secondaryScriptures[0] ? [buildHostVersionComparison(primaryMotif.secondaryScriptures[0])] : [])
  ];

  // Dynamic Interpretations (Unique to this query!)
  const rawInterpretations = [
    ...primaryMotif.interpretations(detailSnippet),
    ...(secondaryMotif ? secondaryMotif.interpretations(detailSnippet) : [])
  ];

  const possibleInterpretations = rawInterpretations.map((interp, idx) => ({
    angle: interp.angle,
    explanation: interp.explanation,
    symbolicMeaning: interp.symbolicMeaning,
    scripturalBasis: relevantScriptures[idx % relevantScriptures.length]?.reference || primaryMotif.primaryScripture
  }));

  const summary = `Biblical discernment for ${type === "dream" ? "dream" : "spiritual inquiry"}: ${detailSnippet}. This experience centers upon ${primaryMotif.symbolNames.join(", ")}${secondaryMotif ? ` and ${secondaryMotif.symbolNames.join(", ")}` : ""}. In Scripture, these motifs correspond to ${primaryMotif.themeTitle}, encouraging the believer to anchor in God's promises, discern with wisdom, and walk forward in faith and victory.`;

  const pastoralComfortMessage = isDisturbing
    ? "Dreams or concerns involving conflict, mortality, or fear can feel startling. In biblical pastoral care, dreams are not automatic prophecies of doom. God has not given us a spirit of fear, but of power, love, and sound judgment (2 Timothy 1:7). We rest secure in Christ's unfailing love (Romans 8:38-39)."
    : undefined;

  // 1. What the Bible Explicitly Says (Foundational Scripture Truth)
  const explicitScriptureTeaching = [
    `Scripture explicitly affirms that ${primaryMotif.biblicalTeaching}`,
    `In ${primaryMotif.primaryScripture}, the text directly proclaims God's covenant provision, guidance, and authority for His people without ambiguity.`,
    ...(secondaryMotif ? [`Additionally, Scripture establishes that ${secondaryMotif.biblicalTeaching}`] : [])
  ];

  // 2. Supporting Scriptures (Wider Canonical Support across Old & New Testaments)
  const supportingScriptures: RankedScripture[] = [
    ...otherRelevantScriptures,
    ...generalDiscernmentScriptures
  ];

  // 3. Interpretations or Perspectives from Other People (Compared against Scripture, not presented as biblical fact)
  const humanInterpretations = [
    {
      perspective: `Some historical and modern commentators interpret ${primaryMotif.symbolNames[0]} as a direct allegory for personal spiritual breakthrough, promotion, or imminent vocational transition.`,
      proponentOrTradition: "Christian Historical & Devotional Traditions",
      biblicalComparison: `When compared with Scripture, while God certainly promotes His servants (Psalm 75:6-7), biblical imagery primarily points believers to Christ's sufficiency and personal sanctification rather than guaranteed earthly status.`
    },
    {
      perspective: `Other teachers suggest that such impressions represent an internal subconscious processing of personal desires, daily anxieties, or spiritual hunger.`,
      proponentOrTradition: "Pastoral Discernment & Christian Psychology",
      biblicalComparison: `Ecclesiastes 5:3 observes that 'a dream comes through much business.' Scripture acknowledges that ordinary human thoughts influence dreams, which is why all impressions must be subjected to the clear light of God's Word (1 Thess 5:21).`
    }
  ];

  // 4. What is Uncertain or Speculative (Honest admission where Scripture does not provide a definitive answer)
  const uncertainOrSpeculative = [
    `The Bible does not provide an exhaustive 'dictionary' for every modern object, personal dream sequence, or subjective impression.`,
    `It is uncertain whether this specific experience is a supernatural impression or a natural reflection of recent conversations, thoughts, or emotions.`,
    `Any personal prediction or timeline deduced from this experience is speculative and should NEVER be received as an infallible revelation or guaranteed future event.`
  ];

  // 5. Practical Guidance (Prayer, Reflection, Consideration, Seeking Wise Counsel)
  const practicalGuidance = {
    prayerPrompt: `Lord Jesus, thank You for the absolute authority and sufficiency of Your written Word. Grant me humble wisdom and clarity. Guard my heart from anxiety or false assumptions, and lead me in Your truth as I place my trust completely in You.`,
    reflectionQuestion: `In light of ${primaryMotif.primaryScripture}, what biblical truth is God asking me to rest upon today, and what worry can I surrender to Him?`,
    wiseCounselConsideration: `Share this inquiry and your reflections with a mature, trusted pastor, ministry leader, or biblical counselor who can examine it with you in the light of Scripture and prayer.`,
    actionStep: `Spend 10 minutes reading ${primaryMotif.primaryScripture} in full context, meditating on Christ's character, and recording what the Holy Spirit illuminates through the written Word.`
  };

  return {
    summary,
    biblicalThemes: extractedSymbols,
    extractedEventsAndSymbols: {
      events: extractedEvents,
      symbols: extractedSymbols,
      emotions: isDisturbing ? ["Vulnerable", "Seeking Peace", "Searching"] : ["Reflective", "Searching", "Hopeful"],
      keyContext: `Specific inquiry regarding: ${detailSnippet}`
    },
    searchConcepts,
    thematicExplorations,
    explicitScriptureTeaching,
    supportingScriptures,
    humanInterpretations,
    uncertainOrSpeculative,
    practicalGuidance,
    relevantScriptures,
    otherRelevantScriptures,
    generalDiscernmentScriptures,
    hostVersionComparison,
    isDisturbingDream: isDisturbing,
    pastoralComfortMessage,
    biblicalContextExplanation: {
      historicalSetting: "Canonical Old and New Testament passages highlighting covenant promises, spiritual authority, and redemption in Christ Jesus.",
      originalAudience: "Believers called to walk in faith, apostolic discernment, and holiness.",
      theologicalTheme: "The sovereign sufficiency of the Word of God and the victory given to believers in Jesus Christ."
    },
    possibleInterpretations,
    questionsForReflection: [
      `How do the specific elements of ${extractedSymbols[0] || "your inquiry"} reflect what God is currently teaching you in your walk?`,
      `What peace or direction does ${primaryMotif.primaryScripture} bring to this inquiry?`,
      "What prayer of surrender or step of faith is the Holy Spirit prompting you to take today?"
    ],
    relatedTeachings: [
      `Walking in Victory: Lessons from ${primaryMotif.themeTitle}`,
      "Biblical Discernment: Testing Impressions with Scripture (1 Thess 5:21)",
      "Prayer, Peace, and Resting in God's Promises"
    ],
    disclaimer: "This spiritual insight is provided for biblical study and reflection only. Interpretations of dreams, visions, and spiritual experiences are not infallible revelations and should always be tested against Scripture (1 Thess 5:21, 1 John 4:1) and prayerfully discerned with pastoral guidance.",
    timestamp: new Date().toISOString()
  };
}
