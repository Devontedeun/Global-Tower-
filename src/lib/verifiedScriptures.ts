export interface VerifiedScriptureEntry {
  text: string;
  translation: string;
  source: string;
  license: string;
  book: string;
  chapter: number;
  verse: number;
  themes: string[];
}

export const VERIFIED_SCRIPTURE_MAP: Record<string, VerifiedScriptureEntry> = {
  // Death, Life, Resurrection, Restoration, Revival
  "John 11:25-26": {
    text: "Jesus said to her, 'I am the resurrection and the life. Whoever believes in me, though he die, yet shall he live, and everyone who lives and believes in me shall never die. Do you believe this?'",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "John",
    chapter: 11,
    verse: 25,
    themes: ["death", "life", "resurrection", "eternal life", "faith", "killed", "brought back to life", "revival"]
  },
  "Romans 6:4": {
    text: "We were buried therefore with him by baptism into death, in order that, just as Christ was raised from the dead by the glory of the Father, we too might walk in newness of life.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Romans",
    chapter: 6,
    verse: 4,
    themes: ["death", "burial", "resurrection", "new life", "transformation", "renewal", "baptism"]
  },
  "Romans 8:11": {
    text: "If the Spirit of him who raised Jesus from the dead dwells in you, he who raised Christ Jesus from the dead will also give life to your mortal bodies through his Spirit who dwells in you.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Romans",
    chapter: 8,
    verse: 11,
    themes: ["resurrection", "Holy Spirit", "life", "mortal body", "restoration", "quickening"]
  },
  "Ephesians 2:4-5": {
    text: "But God, being rich in mercy, because of the great love with which he loved us, even when we were dead in our trespasses, made us alive together with Christ—by grace you have been saved—",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Ephesians",
    chapter: 2,
    verse: 4,
    themes: ["dead to alive", "grace", "restoration", "mercy", "salvation", "new life"]
  },
  "2 Corinthians 5:17": {
    text: "Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "2 Corinthians",
    chapter: 5,
    verse: 17,
    themes: ["new creation", "transformation", "renewal", "restoration", "old passed away"]
  },
  "Psalm 30:2-3": {
    text: "O LORD my God, I cried to you for help, and you have healed me. O LORD, you have brought up my soul from Sheol; you restored me to life from among those who go down to the pit.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Psalms",
    chapter: 30,
    verse: 2,
    themes: ["healing", "restoration", "deliverance", "pit", "grave", "brought back to life"]
  },
  "Ezekiel 37:4-5": {
    text: "Then he said to me, 'Prophesy over these bones, and say to them, O dry bones, hear the word of the LORD. Thus says the Lord GOD to these bones: Behold, I will cause breath to enter you, and you shall live.'",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Ezekiel",
    chapter: 37,
    verse: 4,
    themes: ["dry bones", "breath of life", "revival", "restoration", "resurrection", "prophesy"]
  },

  // Water, Rivers, Cleansing, Spiritual Refreshing
  "John 7:38-39": {
    text: "Whoever believes in me, as the Scripture has said, 'Out of his heart will flow rivers of living water.' Now this he said about the Spirit, whom those who believed in him were to receive...",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "John",
    chapter: 7,
    verse: 38,
    themes: ["water", "river", "living water", "Holy Spirit", "refreshing", "cleansing", "flow"]
  },
  "Ezekiel 47:9": {
    text: "And wherever the river goes, every living creature that swarms will live, and there will be very many fish. For this water goes there, that the waters of the sea may become fresh; so everything will live where the river goes.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Ezekiel",
    chapter: 47,
    verse: 9,
    themes: ["river", "temple water", "healing waters", "life", "abundance", "fruitfulness"]
  },
  "Psalm 23:1-3": {
    text: "The LORD is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul. He leads me in paths of righteousness for his name's sake.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Psalms",
    chapter: 23,
    verse: 1,
    themes: ["shepherd", "still waters", "green pastures", "restoration", "peace", "guidance", "water"]
  },
  "Revelation 22:1": {
    text: "Then the angel showed me the river of the water of life, bright as crystal, flowing from the throne of God and of the Lamb.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Revelation",
    chapter: 22,
    verse: 1,
    themes: ["river of life", "crystal", "throne of God", "Lamb", "eternal life", "purity"]
  },

  // Fire, Refining, Presence, Holy Spirit
  "Hebrews 12:28-29": {
    text: "Therefore let us be grateful for receiving a kingdom that cannot be shaken, and thus let us offer to God acceptable worship, with reverence and awe, for our God is a consuming fire.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Hebrews",
    chapter: 12,
    verse: 28,
    themes: ["fire", "consuming fire", "kingdom", "reverence", "awe", "worship", "unshakable"]
  },
  "Acts 2:3-4": {
    text: "And divided tongues as of fire appeared to them and rested on each one of them. And they were all filled with the Holy Spirit and began to speak in other tongues as the Spirit gave them utterance.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Acts",
    chapter: 2,
    verse: 3,
    themes: ["fire", "tongues of fire", "Holy Spirit", "Pentecost", "empowerment", "utterance"]
  },
  "Malachi 3:2-3": {
    text: "For he is like a refiner's fire and like fullers' soap. He will sit as a refiner and purifier of silver, and he will purify the sons of Levi and refine them like gold and silver...",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Malachi",
    chapter: 3,
    verse: 2,
    themes: ["refiner's fire", "purification", "gold", "silver", "sanctification", "fire"]
  },

  // Spiritual Warfare, Protection, Victory
  "Luke 10:19": {
    text: "Behold, I have given you authority to tread on serpents and scorpions, and over all the power of the enemy, and nothing shall hurt you.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Luke",
    chapter: 10,
    verse: 19,
    themes: ["serpent", "snake", "scorpions", "authority", "spiritual warfare", "power of enemy", "victory"]
  },
  "Genesis 3:15": {
    text: "I will put enmity between you and the woman, and between your offspring and her offspring; he shall bruise your head, and you shall bruise his heel.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Genesis",
    chapter: 3,
    verse: 15,
    themes: ["serpent", "snake", "protoevangelium", "crushing enemy", "Christ victory", "enmity"]
  },
  "Romans 16:20": {
    text: "The God of peace will soon crush Satan under your feet. The grace of our Lord Jesus Christ be with you.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Romans",
    chapter: 16,
    verse: 20,
    themes: ["peace", "crush Satan", "victory", "feet", "grace", "spiritual triumph"]
  },
  "Ephesians 6:10-12": {
    text: "Finally, be strong in the Lord and in the strength of his might. Put on the whole armor of God, that you may be able to stand against the schemes of the devil. For we do not wrestle against flesh and blood...",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Ephesians",
    chapter: 6,
    verse: 10,
    themes: ["armor of God", "spiritual warfare", "schemes of devil", "strength in Lord", "warfare"]
  },
  "Psalm 91:1-4": {
    text: "He who dwells in the shelter of the Most High will abide in the shadow of the Almighty. I will say to the LORD, 'My refuge and my fortress, my God, in whom I trust.' For he will deliver you from the snare of the fowler and from the deadly pestilence. He will cover you with his pinions, and under his wings you will find refuge...",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Psalms",
    chapter: 91,
    verse: 1,
    themes: ["protection", "refuge", "fortress", "wings", "shadow of Almighty", "pestilence", "shield"]
  },

  // Eagles, Flying, Supernatural Elevation
  "Isaiah 40:31": {
    text: "But they who wait for the LORD shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Isaiah",
    chapter: 40,
    verse: 31,
    themes: ["eagle", "wings", "fly", "flying", "soar", "strength renewed", "waiting on Lord", "elevation"]
  },
  "Exodus 19:4": {
    text: "You yourselves have seen what I did to the Egyptians, and how I bore you on eagles' wings and brought you to myself.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Exodus",
    chapter: 19,
    verse: 4,
    themes: ["eagles wings", "deliverance", "covenant", "supernatural help", "borne on wings"]
  },

  // Doors, Gates, Keys, Authority
  "Revelation 3:7-8": {
    text: "And to the angel of the church in Philadelphia write: 'The words of the holy one, the true one, who has the key of David, who opens and no one will shut, who shuts and no one opens. I know your works. Behold, I have set before you an open door, which no one is able to shut.'",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Revelation",
    chapter: 3,
    verse: 7,
    themes: ["door", "open door", "key of David", "authority", "access", "opportunity", "gate"]
  },
  "Matthew 16:19": {
    text: "I will give you the keys of the kingdom of heaven, and whatever you bind on earth shall be bound in heaven, and whatever you loose on earth shall be loosed in heaven.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Matthew",
    chapter: 16,
    verse: 19,
    themes: ["keys", "kingdom of heaven", "binding and loosing", "authority", "access"]
  },
  "Psalm 24:7-9": {
    text: "Lift up your heads, O gates! And be lifted up, O ancient doors, that the King of glory may come in. Who is this King of glory? The LORD, strong and mighty, the LORD, mighty in battle!",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Psalms",
    chapter: 24,
    verse: 7,
    themes: ["doors", "gates", "King of glory", "ancient doors", "triumph", "entrance of God"]
  },

  // Faith, Trust, Sovereign Goodness
  "Romans 8:28": {
    text: "And we know that for those who love God all things work together for good, for those who are called according to his purpose.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Romans",
    chapter: 8,
    verse: 28,
    themes: ["providence", "sovereignty", "good", "purpose", "calling", "love God", "trust"]
  },
  "Proverbs 3:5-6": {
    text: "Trust in the LORD with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Proverbs",
    chapter: 3,
    verse: 5,
    themes: ["trust", "guidance", "direction", "heart", "straight paths", "wisdom", "path"]
  },
  "Hebrews 11:1": {
    text: "Now faith is the assurance of things hoped for, the conviction of things not seen.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Hebrews",
    chapter: 11,
    verse: 1,
    themes: ["faith", "assurance", "hope", "unseen", "conviction", "believing"]
  },
  "Hebrews 11:6": {
    text: "And without faith it is impossible to please him, for whoever would draw near to God must believe that he exists and that he rewards those who seek him.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Hebrews",
    chapter: 11,
    verse: 6,
    themes: ["faith", "pleasing God", "reward", "seek him", "draw near"]
  },
  "Jeremiah 29:11": {
    text: "For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Jeremiah",
    chapter: 29,
    verse: 11,
    themes: ["plans", "future", "hope", "welfare", "sovereignty", "destiny", "covenant"]
  },

  // Peace, Anxiety, Stillness
  "Philippians 4:6-7": {
    text: "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Philippians",
    chapter: 4,
    verse: 6,
    themes: ["anxiety", "worry", "peace", "prayer", "thanksgiving", "guard hearts", "mind"]
  },
  "1 Peter 5:7": {
    text: "Casting all your anxieties on him, because he cares for you.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "1 Peter",
    chapter: 5,
    verse: 7,
    themes: ["anxiety", "care", "casting cares", "peace", "humility", "rest"]
  },
  "John 14:27": {
    text: "Peace I leave with you; my peace I give to you. Not as the world gives do I give to you. Let not your hearts be troubled, neither let them be afraid.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "John",
    chapter: 14,
    verse: 27,
    themes: ["peace", "troubled heart", "fear not", "Christ peace", "comfort"]
  },

  // Healing & Restoration
  "Isaiah 53:5": {
    text: "But he was pierced for our transgressions; he was crushed for our iniquities; upon him was the chastisement that brought us peace, and with his wounds we are healed.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Isaiah",
    chapter: 53,
    verse: 5,
    themes: ["healing", "wounds", "atonement", "peace", "transgression", "cross"]
  },
  "1 Peter 2:24": {
    text: "He himself bore our sins in his body on the tree, that we might die to sin and live to righteousness. By his wounds you have been healed.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "1 Peter",
    chapter: 2,
    verse: 24,
    themes: ["healing", "wounds", "righteousness", "cross", "restoration"]
  },
  "James 5:14-15": {
    text: "Is anyone among you sick? Let him call for the elders of the church, and let them pray over him, anointing him with oil in the name of the Lord. And the prayer of faith will save the one who is sick, and the Lord will raise him up.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "James",
    chapter: 5,
    verse: 14,
    themes: ["healing", "sick", "oil", "elders", "prayer of faith", "anointing"]
  },

  // Oil, Anointing, Consecration
  "1 Samuel 16:13": {
    text: "Then Samuel took the horn of oil and anointed him in the midst of his brothers. And the Spirit of the LORD rushed upon David from that day forward.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "1 Samuel",
    chapter: 16,
    verse: 13,
    themes: ["oil", "anointing", "Holy Spirit", "David", "consecration", "calling", "kingship"]
  },
  "Psalm 23:5": {
    text: "You prepare a table before me in the presence of my enemies; you anoint my head with oil; my cup overflows.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Psalms",
    chapter: 23,
    verse: 5,
    themes: ["oil", "anointing", "table", "enemies", "overflow", "blessing", "presence"]
  },

  // Wisdom, Testing, Discernment
  "James 1:5": {
    text: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "James",
    chapter: 1,
    verse: 5,
    themes: ["wisdom", "asking God", "generous", "discernment", "guidance"]
  },
  "1 Thessalonians 5:21": {
    text: "Test everything; hold fast what is good.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "1 Thessalonians",
    chapter: 5,
    verse: 21,
    themes: ["discernment", "testing", "prophecy", "hold fast", "good", "truth"]
  },
  "1 John 4:1": {
    text: "Beloved, do not believe every spirit, but test the spirits to see whether they are from God, for many false prophets have gone out into the world.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "1 John",
    chapter: 4,
    verse: 1,
    themes: ["discernment", "test the spirits", "testing", "truth", "false prophets"]
  },

  // Crown, Rewards, Faithfulness
  "James 1:12": {
    text: "Blessed is the man who remains steadfast under trial, for when he has stood the test he will receive the crown of life, which God has promised to those who love him.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "James",
    chapter: 1,
    verse: 12,
    themes: ["crown", "crown of life", "steadfast", "trials", "reward", "perseverance"]
  },
  "2 Timothy 4:7-8": {
    text: "I have fought the good fight, I have finished the race, I have kept the faith. Henceforth there is laid up for me the crown of righteousness, which the Lord, the righteous judge, will award to me on that day...",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "2 Timothy",
    chapter: 4,
    verse: 7,
    themes: ["crown", "crown of righteousness", "finished race", "kept faith", "reward"]
  },

  // Light, Darkness Dispelled
  "Psalm 119:105": {
    text: "Your word is a lamp to my feet and a light to my path.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Psalms",
    chapter: 119,
    verse: 105,
    themes: ["light", "lamp", "word of God", "path", "feet", "guidance", "direction"]
  },
  "John 8:12": {
    text: "Again Jesus spoke to them, saying, 'I am the light of the world. Whoever follows me will not walk in darkness, but will have the light of life.'",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "John",
    chapter: 8,
    verse: 12,
    themes: ["light", "light of the world", "darkness", "following Jesus", "light of life"]
  },

  // White Robes, Righteousness, Cleansing
  "Isaiah 1:18": {
    text: "'Come now, let us reason together, says the LORD: though your sins are like scarlet, they shall be as white as snow; though they are red like crimson, they shall become like wool.'",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Isaiah",
    chapter: 1,
    verse: 18,
    themes: ["white", "snow", "forgiveness", "cleansing", "scarlet", "purity", "salvation"]
  },
  "Revelation 7:14": {
    text: "They have washed their robes and made them white in the blood of the Lamb.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Revelation",
    chapter: 7,
    verse: 14,
    themes: ["white robes", "blood of Lamb", "cleansing", "purity", "overcoming", "garments"]
  },

  // Salvation, Justification, Grace
  "Romans 10:9-10": {
    text: "If you confess with your mouth that Jesus is Lord and believe in your heart that God raised him from the dead, you will be saved. For with the heart one believes and is justified, and with the mouth one confesses and is saved.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Romans",
    chapter: 10,
    verse: 9,
    themes: ["salvation", "confession", "Lordship", "resurrection", "justification", "saved"]
  },
  "Ephesians 2:8-9": {
    text: "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Ephesians",
    chapter: 2,
    verse: 8,
    themes: ["grace", "saved", "faith", "gift of God", "not of works", "justification"]
  },

  // Prayer, Fasting, Seeking the Lord
  "Matthew 6:33": {
    text: "But seek first the kingdom of God and his righteousness, and all these things will be added to you.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Matthew",
    chapter: 6,
    verse: 33,
    themes: ["seek first", "kingdom of God", "righteousness", "provision", "priority"]
  },
  "Jeremiah 33:3": {
    text: "Call to me and I will answer you, and will tell you great and hidden things that you have not known.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Jeremiah",
    chapter: 33,
    verse: 3,
    themes: ["call to me", "answer", "hidden things", "prayer", "revelation", "wisdom"]
  },
  "Philippians 4:19": {
    text: "And my God will supply every need of yours according to his riches in glory in Christ Jesus.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Philippians",
    chapter: 4,
    verse: 19,
    themes: ["supply", "provision", "riches in glory", "need", "Jehovah Jireh", "faith"]
  },
  "Romans 8:37-39": {
    text: "No, in all these things we are more than conquerors through him who loved us. For I am sure that neither death nor life, nor angels nor rulers, nor things present nor things to come, nor powers, nor height nor depth, nor anything else in all creation, will be able to separate us from the love of God in Christ Jesus our Lord.",
    translation: "ESV",
    source: "Crossway Bibles / Canonical Text",
    license: "Authorized Educational Quotation",
    book: "Romans",
    chapter: 8,
    verse: 37,
    themes: ["more than conquerors", "love of God", "inseparable", "victory", "triumph", "Christ"]
  }
};
