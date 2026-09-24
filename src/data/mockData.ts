import {
  BibleBook,
  BibleVerse,
  Sermon,
  MinistryVideo,
  Devotional,
  BibleStudyPlan,
  LiveEvent,
  TeacherProfile,
  Endorsement,
  AISource,
  QuizQuestion,
  Flashcard,
  PrayerItem,
  CommunityPost,
  PlatformAnalytics
} from "../types";

export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament (39 Books)
  { name: "Genesis", testament: "Old", chaptersCount: 50, category: "Pentateuch" },
  { name: "Exodus", testament: "Old", chaptersCount: 40, category: "Pentateuch" },
  { name: "Leviticus", testament: "Old", chaptersCount: 27, category: "Pentateuch" },
  { name: "Numbers", testament: "Old", chaptersCount: 36, category: "Pentateuch" },
  { name: "Deuteronomy", testament: "Old", chaptersCount: 34, category: "Pentateuch" },
  { name: "Joshua", testament: "Old", chaptersCount: 24, category: "History" },
  { name: "Judges", testament: "Old", chaptersCount: 21, category: "History" },
  { name: "Ruth", testament: "Old", chaptersCount: 4, category: "History" },
  { name: "1 Samuel", testament: "Old", chaptersCount: 31, category: "History" },
  { name: "2 Samuel", testament: "Old", chaptersCount: 24, category: "History" },
  { name: "1 Kings", testament: "Old", chaptersCount: 22, category: "History" },
  { name: "2 Kings", testament: "Old", chaptersCount: 25, category: "History" },
  { name: "1 Chronicles", testament: "Old", chaptersCount: 29, category: "History" },
  { name: "2 Chronicles", testament: "Old", chaptersCount: 36, category: "History" },
  { name: "Ezra", testament: "Old", chaptersCount: 10, category: "History" },
  { name: "Nehemiah", testament: "Old", chaptersCount: 13, category: "History" },
  { name: "Esther", testament: "Old", chaptersCount: 10, category: "History" },
  { name: "Job", testament: "Old", chaptersCount: 42, category: "Wisdom" },
  { name: "Psalms", testament: "Old", chaptersCount: 150, category: "Wisdom" },
  { name: "Proverbs", testament: "Old", chaptersCount: 31, category: "Wisdom" },
  { name: "Ecclesiastes", testament: "Old", chaptersCount: 12, category: "Wisdom" },
  { name: "Song of Solomon", testament: "Old", chaptersCount: 8, category: "Wisdom" },
  { name: "Isaiah", testament: "Old", chaptersCount: 66, category: "Prophets" },
  { name: "Jeremiah", testament: "Old", chaptersCount: 52, category: "Prophets" },
  { name: "Lamentations", testament: "Old", chaptersCount: 5, category: "Prophets" },
  { name: "Ezekiel", testament: "Old", chaptersCount: 48, category: "Prophets" },
  { name: "Daniel", testament: "Old", chaptersCount: 12, category: "Prophets" },
  { name: "Hosea", testament: "Old", chaptersCount: 14, category: "Prophets" },
  { name: "Joel", testament: "Old", chaptersCount: 3, category: "Prophets" },
  { name: "Amos", testament: "Old", chaptersCount: 9, category: "Prophets" },
  { name: "Obadiah", testament: "Old", chaptersCount: 1, category: "Prophets" },
  { name: "Jonah", testament: "Old", chaptersCount: 4, category: "Prophets" },
  { name: "Micah", testament: "Old", chaptersCount: 7, category: "Prophets" },
  { name: "Nahum", testament: "Old", chaptersCount: 3, category: "Prophets" },
  { name: "Habakkuk", testament: "Old", chaptersCount: 3, category: "Prophets" },
  { name: "Zephaniah", testament: "Old", chaptersCount: 3, category: "Prophets" },
  { name: "Haggai", testament: "Old", chaptersCount: 2, category: "Prophets" },
  { name: "Zechariah", testament: "Old", chaptersCount: 14, category: "Prophets" },
  { name: "Malachi", testament: "Old", chaptersCount: 4, category: "Prophets" },
  
  // New Testament (27 Books)
  { name: "Matthew", testament: "New", chaptersCount: 28, category: "Gospels" },
  { name: "Mark", testament: "New", chaptersCount: 16, category: "Gospels" },
  { name: "Luke", testament: "New", chaptersCount: 24, category: "Gospels" },
  { name: "John", testament: "New", chaptersCount: 21, category: "Gospels" },
  { name: "Acts", testament: "New", chaptersCount: 28, category: "History" },
  { name: "Romans", testament: "New", chaptersCount: 16, category: "Epistles" },
  { name: "1 Corinthians", testament: "New", chaptersCount: 16, category: "Epistles" },
  { name: "2 Corinthians", testament: "New", chaptersCount: 13, category: "Epistles" },
  { name: "Galatians", testament: "New", chaptersCount: 6, category: "Epistles" },
  { name: "Ephesians", testament: "New", chaptersCount: 6, category: "Epistles" },
  { name: "Philippians", testament: "New", chaptersCount: 4, category: "Epistles" },
  { name: "Colossians", testament: "New", chaptersCount: 4, category: "Epistles" },
  { name: "1 Thessalonians", testament: "New", chaptersCount: 5, category: "Epistles" },
  { name: "2 Thessalonians", testament: "New", chaptersCount: 3, category: "Epistles" },
  { name: "1 Timothy", testament: "New", chaptersCount: 6, category: "Epistles" },
  { name: "2 Timothy", testament: "New", chaptersCount: 4, category: "Epistles" },
  { name: "Titus", testament: "New", chaptersCount: 3, category: "Epistles" },
  { name: "Philemon", testament: "New", chaptersCount: 1, category: "Epistles" },
  { name: "Hebrews", testament: "New", chaptersCount: 13, category: "Epistles" },
  { name: "James", testament: "New", chaptersCount: 5, category: "Epistles" },
  { name: "1 Peter", testament: "New", chaptersCount: 5, category: "Epistles" },
  { name: "2 Peter", testament: "New", chaptersCount: 3, category: "Epistles" },
  { name: "1 John", testament: "New", chaptersCount: 5, category: "Epistles" },
  { name: "2 John", testament: "New", chaptersCount: 1, category: "Epistles" },
  { name: "3 John", testament: "New", chaptersCount: 1, category: "Epistles" },
  { name: "Jude", testament: "New", chaptersCount: 1, category: "Epistles" },
  { name: "Revelation", testament: "New", chaptersCount: 22, category: "Revelation" },
];

export const BIBLE_VERSES_DATABASE: Record<string, Record<number, { [trans: string]: { num: number; text: string }[] }>> = {
  "John": {
    1: {
      "KJV": [
        { num: 1, text: "In the beginning was the Word, and the Word was with God, and the Word was God." },
        { num: 2, text: "The same was in the beginning with God." },
        { num: 3, text: "All things were made by him; and without him was not any thing made that was made." },
        { num: 4, text: "In him was life; and the life was the light of men." },
        { num: 5, text: "And the light shineth in darkness; and the darkness comprehended it not." },
        { num: 14, text: "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth." }
      ],
      "NIV": [
        { num: 1, text: "In the beginning was the Word, and the Word was with God, and the Word was God." },
        { num: 2, text: "He was with God in the beginning." },
        { num: 3, text: "Through him all things were made; without him nothing was made that has been made." },
        { num: 4, text: "In him was life, and that life was the light of all mankind." },
        { num: 5, text: "The light shines in the darkness, and the darkness has not overcome it." },
        { num: 14, text: "The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth." }
      ],
      "ESV": [
        { num: 1, text: "In the beginning was the Word, and the Word was with God, and the Word was God." },
        { num: 2, text: "He was in the beginning with God." },
        { num: 3, text: "All things were made through him, and without him was not any thing made that was made." },
        { num: 4, text: "In him was life, and the life was the light of men." },
        { num: 5, text: "The light shines in the darkness, and the darkness has not overcome it." },
        { num: 14, text: "And the Word became flesh and dwelt among us, and we have seen his glory, glory as of the only Son from the Father, full of grace and truth." }
      ]
    },
    3: {
      "KJV": [
        { num: 16, text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
        { num: 17, text: "For God sent not his Son into the world to condemn the world; but that the world through him might be saved." },
        { num: 18, text: "He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God." }
      ],
      "NIV": [
        { num: 16, text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." },
        { num: 17, text: "For God did not send his Son into the world to condemn the world, but to save the world through him." },
        { num: 18, text: "Whoever believes in him is not condemned, but whoever does not believe stands condemned already because they have not believed in the name of God's one and only Son." }
      ],
      "ESV": [
        { num: 16, text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life." },
        { num: 17, text: "For God did not send his Son into the world to condemn the world, but in order that the world might be saved through him." },
        { num: 18, text: "Whoever believes in him is not condemned, but whoever does not believe is condemned already, because he has not believed in the name of the only Son of God." }
      ]
    },
    14: {
      "ESV": [
        { num: 1, text: "Let not your hearts be troubled. Believe in God; believe also in me." },
        { num: 6, text: "Jesus said to him, 'I am the way, and the truth, and the life. No one comes to the Father except through me.'" },
        { num: 26, text: "But the Helper, the Holy Spirit, whom the Father will send in my name, he will teach you all things and bring to your remembrance all that I have said to you." },
        { num: 27, text: "Peace I leave with you; my peace I give to you. Not as the world gives do I give to you. Let not your hearts be troubled, neither let them be afraid." }
      ],
      "KJV": [
        { num: 1, text: "Let not your heart be troubled: ye believe in God, believe also in me." },
        { num: 6, text: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me." },
        { num: 26, text: "But the Comforter, which is the Holy Ghost, whom the Father will send in my name, he shall teach you all things, and bring all things to your remembrance, whatsoever I have said unto you." },
        { num: 27, text: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid." }
      ],
      "NIV": [
        { num: 1, text: "Do not let your hearts be troubled. You believe in God; believe also in me." },
        { num: 6, text: "Jesus answered, 'I am the way and the truth and the life. No one comes to the Father except through me.'" },
        { num: 26, text: "But the Advocate, the Holy Spirit, whom the Father will send in my name, will teach you all things and will remind you of everything I have said to you." },
        { num: 27, text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid." }
      ]
    }
  },
  "Psalms": {
    23: {
      "KJV": [
        { num: 1, text: "The LORD is my shepherd; I shall not want." },
        { num: 2, text: "He maketh me to lie down in green pastures: he leadeth me beside the still waters." },
        { num: 3, text: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake." },
        { num: 4, text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me." },
        { num: 5, text: "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over." },
        { num: 6, text: "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever." }
      ],
      "NIV": [
        { num: 1, text: "The LORD is my shepherd, I lack nothing." },
        { num: 2, text: "He makes me lie down in green pastures, he leads me beside quiet waters," },
        { num: 3, text: "he refreshes my soul. He guides me along the right paths for his name's sake." },
        { num: 4, text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me." },
        { num: 5, text: "You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows." },
        { num: 6, text: "Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the LORD forever." }
      ],
      "ESV": [
        { num: 1, text: "The LORD is my shepherd; I shall not want." },
        { num: 2, text: "He makes me lie down in green pastures. He leads me beside still waters." },
        { num: 3, text: "He restores my soul. He leads me in paths of righteousness for his name's sake." },
        { num: 4, text: "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me." },
        { num: 5, text: "You prepare a table before me in the presence of my enemies; you anoint my head with oil; my cup overflows." },
        { num: 6, text: "Surely goodness and mercy shall follow me all the days of my life, and I shall dwell in the house of the LORD forever." }
      ]
    },
    91: {
      "ESV": [
        { num: 1, text: "He who dwells in the shelter of the Most High will abide in the shadow of the Almighty." },
        { num: 2, text: "I will say to the LORD, 'My refuge and my fortress, my God, in whom I trust.'" },
        { num: 4, text: "He will cover you with his pinions, and under his wings you will find refuge; his faithfulness is a shield and buckler." },
        { num: 11, text: "For he will command his angels concerning you to guard you in all your ways." }
      ],
      "KJV": [
        { num: 1, text: "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty." },
        { num: 2, text: "I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust." },
        { num: 4, text: "He shall cover thee with his feathers, and under his wings shalt thou trust: his truth shall be thy shield and buckler." },
        { num: 11, text: "For he shall give his angels charge over thee, to keep thee in all thy ways." }
      ],
      "NIV": [
        { num: 1, text: "Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty." },
        { num: 2, text: "I will say of the LORD, 'He is my refuge and my fortress, my God, in whom I trust.'" },
        { num: 4, text: "He will cover you with his feathers, and under his wings you will find refuge; his faithfulness will be your shield and rampart." },
        { num: 11, text: "For he will command his angels concerning you to guard you in all your ways;" }
      ]
    }
  },
  "Romans": {
    8: {
      "ESV": [
        { num: 1, text: "There is therefore now no condemnation for those who are in Christ Jesus." },
        { num: 28, text: "And we know that for those who love God all things work together for good, for those who are called according to his purpose." },
        { num: 31, text: "What then shall we say to these things? If God is for us, who can be against us?" },
        { num: 37, text: "No, in all these things we are more than conquerors through him who loved us." },
        { num: 38, text: "For I am sure that neither death nor life, nor angels nor rulers, nor things present nor things to come, nor powers," },
        { num: 39, text: "nor height nor depth, nor anything else in all creation, will be able to separate us from the love of God in Christ Jesus our Lord." }
      ],
      "KJV": [
        { num: 1, text: "There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit." },
        { num: 28, text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose." },
        { num: 31, text: "What shall we then say to these things? If God be for us, who can be against us?" },
        { num: 37, text: "Nay, in all these things we are more than conquerors through him that loved us." },
        { num: 38, text: "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come," },
        { num: 39, text: "Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord." }
      ],
      "NIV": [
        { num: 1, text: "Therefore, there is now no condemnation for those who are in Christ Jesus," },
        { num: 28, text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose." },
        { num: 31, text: "What, then, shall we say in response to these things? If God is for us, who can be against us?" },
        { num: 37, text: "No, in all these things we are more than conquerors through him who loved us." },
        { num: 38, text: "For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers," },
        { num: 39, text: "neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord." }
      ]
    }
  },
  "Ephesians": {
    6: {
      "ESV": [
        { num: 10, text: "Finally, be strong in the Lord and in the strength of his might." },
        { num: 11, text: "Put on the whole armor of God, that you may be able to stand against the schemes of the devil." },
        { num: 12, text: "For we do not wrestle against flesh and blood, but against the rulers, against the authorities, against the cosmic powers over this present darkness, against the spiritual forces of evil in the heavenly places." },
        { num: 13, text: "Therefore take up the whole armor of God, that you may be able to withstand in the evil day, and having done all, to stand firm." }
      ],
      "KJV": [
        { num: 10, text: "Finally, my brethren, be strong in the Lord, and in the power of his might." },
        { num: 11, text: "Put on the whole armour of God, that ye may be able to stand against the wiles of the devil." },
        { num: 12, text: "For we wrestle not against flesh and blood, but against principalities, against powers, against the rulers of the darkness of this world, against spiritual wickedness in high places." },
        { num: 13, text: "Wherefore take unto you the whole armour of God, that ye may be able to withstand in the evil day, and having done all, to stand." }
      ],
      "NIV": [
        { num: 10, text: "Finally, be strong in the Lord and in his mighty power." },
        { num: 11, text: "Put on the full armor of God, so that you can take your stand against the devil’s schemes." },
        { num: 12, text: "For our struggle is not against flesh and blood, but against the rulers, against the authorities, against the powers of this dark world and against the spiritual forces of evil in the heavenly realms." },
        { num: 13, text: "Therefore put on the full armor of God, so that when the day of evil comes, you may be able to stand your ground, and after you have done everything, to stand." }
      ]
    }
  },
  "Proverbs": {
    3: {
      "ESV": [
        { num: 5, text: "Trust in the LORD with all your heart, and do not lean on your own understanding." },
        { num: 6, text: "In all your ways acknowledge him, and he will make straight your paths." },
        { num: 7, text: "Be not wise in your own eyes; fear the LORD, and turn away from evil." },
        { num: 8, text: "It will be healing to your flesh and refreshment to your bones." }
      ],
      "KJV": [
        { num: 5, text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding." },
        { num: 6, text: "In all thy ways acknowledge him, and he shall direct thy paths." },
        { num: 7, text: "Be not wise in thine own eyes: fear the LORD, and depart from evil." },
        { num: 8, text: "It shall be health to thy navel, and marrow to thy bones." }
      ],
      "NIV": [
        { num: 5, text: "Trust in the LORD with all your heart and lean not on your own understanding;" },
        { num: 6, text: "in all your ways submit to him, and he will make your paths straight." },
        { num: 7, text: "Do not be wise in your own eyes; fear the LORD and shun evil." },
        { num: 8, text: "This will bring health to your body and nourishment to your bones." }
      ]
    }
  }
};

export const TEACHERS_LIST: TeacherProfile[] = [
  {
    id: "deyvin-sango",
    name: "Apostle R.Sango",
    title: "Founder & Lead Minister",
    ministry: "Global Tower of Christ",
    bio: "Passionate servant of Christ dedicated to preaching the uncompromised Word, equipping believers for spiritual dominion, victory, and global kingdom impact.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    verified: true,
    socialLinks: {
      youtube: "https://youtube.com",
      website: "mailto:info@globaltowerofchrist.com"
    },
    totalTeachings: 48,
    totalSermons: 36
  },
  {
    id: "pastor-david-adeyemi",
    name: "Pastor David Adeyemi",
    title: "Senior Bible Expositor",
    ministry: "Faith & Dominion Fellowship",
    bio: "Biblical scholar focusing on New Testament grace, the Holy Spirit, and the practical application of Kingdom righteousness in daily life.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    verified: true,
    totalTeachings: 32,
    totalSermons: 28
  },
  {
    id: "rev-grace-kamau",
    name: "Rev. Grace Kamau",
    title: "Director of Prayer & Spiritual Discernment",
    ministry: "Living Waters Global",
    bio: "Spiritual mentor specializing in intercessory prayer, biblical dream interpretation principles, and spiritual warfare through worship.",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    verified: true,
    totalTeachings: 41,
    totalSermons: 25
  },
  {
    id: "dr-emmanuel-mensah",
    name: "Dr. Emmanuel Mensah",
    title: "Professor of Systematic Theology",
    ministry: "Kingdom Doctrine Institute",
    bio: "Author and teacher committed to defending Christian orthodoxy, Christology, and educating youth in sound biblical doctrine.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    verified: true,
    totalTeachings: 55,
    totalSermons: 40
  }
];

export const SERMONS_DATABASE: Sermon[] = [
  {
    id: "sermon-1",
    title: "Worship, Dominion & Victory in Christ Jesus",
    speaker: "Apostle R.Sango",
    speakerRole: "Founder & Lead Minister",
    speakerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    category: "Dominion",
    duration: "45 mins",
    durationSeconds: 2700,
    playbackUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    storagePath: "/videos/sermons/worship_dominion_victory_2026.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&auto=format&fit=crop&q=80",
    qualities: {
      "1080p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "720p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "480p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "360p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    },
    description: "Discover the foundational truths of spiritual authority, entering true worship in Spirit and Truth, and overcoming every adversary through Christ.",
    scriptureReferences: ["Romans 8:37", "Ephesians 1:19-23", "John 4:23-24"],
    takeaways: [
      "Worship is the highest spiritual posture that releases divine dominion.",
      "In Christ, you operate from a place of victory, not striving for victory.",
      "The authority of the believer is rooted in the finished work of the Cross."
    ],
    transcript: "Beloved in Christ, welcome to Global Tower of Christ. Today we anchor our hearts in Romans 8:37: 'In all these things we are more than conquerors through Him who loved us.' When you understand who Christ is and your covenant in His blood, fear dissolves. True dominion is not arrogant self-reliance; it is total reliance upon King Jesus...",
    publishedDate: "2026-08-10",
    viewsCount: 3420,
    savesCount: 890,
    approvalStatus: "published"
  },
  {
    id: "sermon-2",
    title: "Discerning God's Voice in Dreams and Visions",
    speaker: "Rev. Grace Kamau",
    speakerRole: "Director of Prayer & Spiritual Discernment",
    speakerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    category: "Prophecy",
    duration: "38 mins",
    durationSeconds: 2280,
    playbackUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    storagePath: "/videos/prophecy/discerning_gods_voice_dreams.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=1200&auto=format&fit=crop&q=80",
    qualities: {
      "1080p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "720p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "480p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    },
    description: "A solid, biblically balanced teaching on how God spoke through dreams in Scripture, how to test impressions, and the absolute primacy of the written Word.",
    scriptureReferences: ["Joel 2:28", "1 Thessalonians 5:21", "Hebrews 1:1-2"],
    takeaways: [
      "The written Scripture is the supreme and final plumbline for all spiritual experiences.",
      "Never build doctrine on subjective impressions; build upon Christ and His Word.",
      "Seek pastoral counsel and prayerful discernment for recurring spiritual prompts."
    ],
    transcript: "Grace and peace to you saints. In 1 Thessalonians 5:21, the Apostle Paul instructs us clearly: 'Test everything; hold fast what is good.' God is alive and works in the hearts of His children, but we must never elevate any vision, dream, or personal prophecy above the inspired, infallible 66 books of the Bible...",
    publishedDate: "2026-08-04",
    viewsCount: 2890,
    savesCount: 654,
    approvalStatus: "published"
  },
  {
    id: "sermon-3",
    title: "Kingdom Stewardship & Divine Financial Wisdom",
    speaker: "Dr. Emmanuel Mensah",
    speakerRole: "Professor of Systematic Theology",
    speakerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    category: "Finances",
    duration: "42 mins",
    durationSeconds: 2520,
    playbackUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    storagePath: "/videos/finance/kingdom_stewardship_wisdom.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80",
    qualities: {
      "1080p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "720p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    },
    description: "Biblical economics for believers: breaking debt cycles, generous giving, faithful stewardship, and honoring God with our resources.",
    scriptureReferences: ["Proverbs 3:9-10", "2 Corinthians 9:6-8", "Luke 16:10-12"],
    takeaways: [
      "God entrusts wealth to establish His covenant and bless the needy.",
      "Integrity in little things qualifies you for greater kingdom assignments.",
      "Tithing and sacrificial generosity reflect our trust in God as Provider."
    ],
    transcript: "Saints of God, money in the hands of a believer is a tool for kingdom expansion. In 2 Corinthians 9, Paul explains that God loves a cheerful giver because generosity mirrors the heart of the Father...",
    publishedDate: "2026-07-28",
    viewsCount: 1950,
    savesCount: 420,
    approvalStatus: "published"
  },
  {
    id: "sermon-4",
    title: "The Ministry of the Holy Spirit & Praying in Tongues",
    speaker: "Pastor David Adeyemi",
    speakerRole: "Senior Bible Expositor",
    speakerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    category: "Holy Spirit",
    duration: "50 mins",
    durationSeconds: 3000,
    playbackUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    storagePath: "/videos/teaching/holy_spirit_ministry_edification.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1200&auto=format&fit=crop&q=80",
    qualities: {
      "1080p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      "720p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    },
    description: "An in-depth study on 1 Corinthians 12-14, Pentecost, personal edification, and order in the local church.",
    scriptureReferences: ["Acts 2:1-4", "1 Corinthians 14:2-4", "Romans 8:26-27"],
    takeaways: [
      "The Holy Spirit is our Comforter, Advocate, and Power for ministry.",
      "Spiritual gifts are given for the common good and the edification of the Body.",
      "Love is the supreme context in which all spiritual gifts operate."
    ],
    transcript: "When the Day of Pentecost came, they were all together in one place. The Holy Spirit was poured out not for show, but to empower ordinary men and women to be witnesses of Jesus Christ to the ends of the earth...",
    publishedDate: "2026-07-15",
    viewsCount: 4120,
    savesCount: 1120,
    approvalStatus: "published"
  }
];

export const MINISTRY_VIDEOS_DATABASE: MinistryVideo[] = [
  {
    id: "vid-worship-1",
    title: "Night of Glory: High Worship & Prophetic Thanksgiving",
    description: "An extraordinary gathering of believers lifting consecrated praise and adoration to Jesus Christ. Experience pure, unhindered worship in Spirit and Truth.",
    speaker: "Apostle R.Sango",
    speakerRole: "Founder & Lead Minister",
    speakerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    category: "worship",
    storagePath: "/videos/worship/night_of_glory_worship_2026.mp4",
    playbackUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80",
    duration: "58 mins",
    durationSeconds: 3480,
    fileSize: 620 * 1024 * 1024,
    fileSizeFormatted: "620 MB",
    mimeType: "video/mp4",
    createdAt: "2026-08-12T18:00:00Z",
    publishedAt: "2026-08-12T19:30:00Z",
    visibility: "public",
    status: "published",
    viewsCount: 5240,
    savesCount: 1420,
    scriptureReferences: ["John 4:23-24", "Psalms 100:1-5"],
    takeaways: ["True worship invites the sovereign manifested glory of God."]
  },
  {
    id: "vid-bible-study-1",
    title: "Exposition of Romans: Seated in Heavenly Authority",
    description: "Deep verse-by-verse theological analysis of Romans Chapters 6, 7, and 8, revealing our deliverance from the law of sin and our eternal adoption in Christ.",
    speaker: "Pastor David Adeyemi",
    speakerRole: "Senior Bible Expositor",
    speakerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    category: "bible-studies",
    storagePath: "/videos/bible-studies/romans_authority_exposition.mp4",
    playbackUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&auto=format&fit=crop&q=80",
    duration: "44 mins",
    durationSeconds: 2640,
    fileSize: 480 * 1024 * 1024,
    fileSizeFormatted: "480 MB",
    mimeType: "video/mp4",
    createdAt: "2026-08-08T14:00:00Z",
    publishedAt: "2026-08-08T15:00:00Z",
    visibility: "public",
    status: "published",
    viewsCount: 3180,
    savesCount: 780,
    scriptureReferences: ["Romans 6:1-14", "Romans 8:1-17"],
    takeaways: ["There is now no condemnation for those who are in Christ Jesus."]
  },
  {
    id: "vid-interview-1",
    title: "Founder's Vision: The Global Mission of Tower of Christ",
    description: "An intimate interview with Apostle R.Sango exploring the divine mandate for spiritual dominion, digital global discipleship, and revival across nations.",
    speaker: "Apostle R.Sango",
    speakerRole: "Founder & Lead Minister",
    speakerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    category: "interviews",
    storagePath: "/videos/interviews/founder_vision_interview_2026.mp4",
    playbackUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&auto=format&fit=crop&q=80",
    duration: "32 mins",
    durationSeconds: 1920,
    fileSize: 340 * 1024 * 1024,
    fileSizeFormatted: "340 MB",
    mimeType: "video/mp4",
    createdAt: "2026-08-02T10:00:00Z",
    publishedAt: "2026-08-02T11:00:00Z",
    visibility: "public",
    status: "published",
    viewsCount: 4620,
    savesCount: 930,
    scriptureReferences: ["Matthew 28:18-20", "Habakkuk 2:2-3"],
    takeaways: ["Reaching the unreached through spirit-led digital media and sound doctrine."]
  },
  {
    id: "vid-healing-1",
    title: "Divine Healing & The Power of Faith",
    description: "A faith-building service examining the healing covenant provided in the stripes of Jesus. Praying in faith for the sick and declaring complete wholeness.",
    speaker: "Rev. Grace Kamau",
    speakerRole: "Director of Prayer & Spiritual Discernment",
    speakerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    category: "healing",
    storagePath: "/videos/healing/divine_healing_covenant.mp4",
    playbackUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&auto=format&fit=crop&q=80",
    duration: "40 mins",
    durationSeconds: 2400,
    fileSize: 420 * 1024 * 1024,
    fileSizeFormatted: "420 MB",
    mimeType: "video/mp4",
    createdAt: "2026-07-20T17:00:00Z",
    publishedAt: "2026-07-20T18:00:00Z",
    visibility: "public",
    status: "published",
    viewsCount: 3890,
    savesCount: 890,
    scriptureReferences: ["Isaiah 53:5", "1 Peter 2:24", "James 5:14-15"],
    takeaways: ["By His wounds we are healed; believe and receive God's promise."]
  },
  {
    id: "vid-youth-1",
    title: "Unashamed: Youth Living for Christ in a Modern Age",
    description: "Equipping young people to stand courageously for Jesus, navigate culture without compromise, and unleash their spiritual gifts for the Kingdom.",
    speaker: "Dr. Emmanuel Mensah",
    speakerRole: "Professor of Systematic Theology",
    speakerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    category: "youth",
    storagePath: "/videos/youth/unashamed_youth_dominion.mp4",
    playbackUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80",
    duration: "35 mins",
    durationSeconds: 2100,
    fileSize: 370 * 1024 * 1024,
    fileSizeFormatted: "370 MB",
    mimeType: "video/mp4",
    createdAt: "2026-07-10T15:00:00Z",
    publishedAt: "2026-07-10T16:00:00Z",
    visibility: "public",
    status: "published",
    viewsCount: 2750,
    savesCount: 510,
    scriptureReferences: ["1 Timothy 4:12", "Romans 1:16"],
    takeaways: ["Let no one despise your youth, but set an example in speech and conduct."]
  }
];


export const DEVOTIONAL_TODAY: Devotional = {
  id: "devo-2026-08-17",
  title: "Standing Firm in Spiritual Dominion",
  date: "Monday, August 17, 2026",
  author: "Apostle R.Sango",
  theme: "Victory & Covenant Faith",
  scriptureRef: "Romans 8:37",
  scriptureText: "No, in all these things we are more than conquerors through him who loved us.",
  reflection: "Life often presents situations that seem overwhelming to human strength. Yet the Scripture does not say we will avoid trials; it promises that IN all these things, we are more than conquerors. Notice the source of this victory: 'through Him who loved us.' Your victory is not earned through your own perfection, but inherited through the finished work of Jesus on Calvary.",
  prayer: "Heavenly Father, thank You for the unshakable victory I have in Christ Jesus. When challenges arise today, help me stand in worship, declare Your Word, and walk in kingdom dominion. In Jesus' mighty name, Amen.",
  practicalApplication: "Identify one situation causing you anxiety today. Speak Romans 8:37 over it aloud three times and release it to the Lord in praise."
};

import { BIBLE_STUDY_PLANS } from "./studyPlansData";
export { BIBLE_STUDY_PLANS };

export const LIVE_EVENTS_DATABASE: LiveEvent[] = [
  {
    id: "event-1",
    title: "Global Dominion & Worship Summit 2026",
    speaker: "Apostle R.Sango",
    speakerRole: "Founder & Lead Minister",
    speakerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    type: "worship",
    date: "Happening Now",
    time: "7:00 PM EST (Live Broadcast)",
    status: "live_now",
    attendeesCount: 428,
    youtubeId: "dQw4w9WgXcQ",
    recordingStatus: "recording",
    recordingDuration: "24 mins live",
    recordingDurationSeconds: 1440,
    recordedAt: "2026-08-18T11:00:00Z",
    replayApproved: true,
    category: "Worship & Dominion",
    tags: ["Live Worship", "Dominion", "Prophetic Prayer", "Deliverance"],
    scriptureReferences: ["Romans 8:37", "Ephesians 2:6", "John 4:23-24"],
    description: "Join thousands of believers worldwide for an anointed night of deep intercessory prayer, prophetic worship, and preaching on Kingdom Victory.",
    isRegistered: false,
    chatArchive: [
      { id: "c1", user: "Sister Marie (Paris)", role: "Member", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100", text: "Connecting from France. Glory to Jesus for this broadcast!", time: "18:02" },
      { id: "c2", user: "Pastor Emmanuel (Lagos)", role: "Speaker", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100", text: "Praying in agreement for supernatural breakthroughs and deliverance tonight.", time: "18:04", pinned: true },
      { id: "c3", user: "David S. (London)", role: "Member", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", text: "Amen! Worshiping the Lord in spirit and truth from the UK.", time: "18:05" },
      { id: "c4", user: "Grace K. (Nairobi)", role: "Moderator", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100", text: "The Holy Spirit is moving powerfully. Drop your prayer requests in the chat!", time: "18:08" }
    ],
    qaArchive: [
      { id: "q1", user: "Brother Joshua (Atlanta)", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100", question: "How can we maintain our posture of worship during severe spiritual resistance?", votes: 14, isAnswered: true, answeredBy: "Apostle R.Sango", time: "18:10" },
      { id: "q2", user: "Eunice M. (Toronto)", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", question: "Could Apostle R.Sango explain the difference between striving and resting in covenant righteousness?", votes: 9, isAnswered: false, time: "18:15" }
    ],
    reactionsCount: { amen: 184, pray: 142, fire: 98, love: 165, worship: 120, praise: 88 }
  },
  {
    id: "event-replay-1",
    title: "The Covenant Authority of Believers (Full Service Replay)",
    speaker: "Apostle R.Sango",
    speakerRole: "Founder & Lead Minister",
    speakerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    type: "sermon",
    date: "Sunday, Aug 16, 2026",
    time: "Streamed Live at 10:00 AM EST",
    status: "completed",
    attendeesCount: 1840,
    youtubeId: "LXb3EKWsInQ",
    recordingStatus: "ready",
    recordingDuration: "52 mins",
    recordingDurationSeconds: 3120,
    recordedAt: "2026-08-16T15:00:00Z",
    replayApproved: true,
    requiresAdminReview: false,
    category: "Dominion & Victory",
    tags: ["Authority", "Ephesians", "Faith", "Replay Available"],
    scriptureReferences: ["Ephesians 1:19-23", "Ephesians 2:6", "Colossians 2:15"],
    description: "Full unedited recorded replay of the live Sunday service on overcoming spiritual defeat and walking in apostolic power.",
    isRegistered: false,
    chatArchive: [
      { id: "rc1", user: "Sister Angela (Dallas)", text: "This message transformed my prayer life!", time: "10:14" },
      { id: "rc2", user: "Minister Caleb (Accra)", text: "Hallelujah! Christ has disarmed principalities and powers.", time: "10:28" }
    ],
    qaArchive: [
      { id: "rq1", user: "Nathan T.", question: "What is the practical daily routine for declaring God's Word over our homes?", votes: 22, isAnswered: true, answeredBy: "Apostle R.Sango", time: "10:35" }
    ],
    reactionsCount: { amen: 512, pray: 380, fire: 290, love: 440, worship: 310, praise: 260 }
  },
  {
    id: "event-2",
    title: "Bible Study: Understanding Romans Chapter 8",
    speaker: "Pastor David Adeyemi",
    speakerRole: "Senior Bible Expositor",
    speakerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    type: "bible_study",
    date: "Wednesday, Aug 19, 2026",
    time: "6:00 PM EST (23:00 UTC)",
    status: "upcoming",
    attendeesCount: 215,
    recordingStatus: "none",
    category: "Bible Exposition",
    tags: ["Romans 8", "Holy Spirit", "Sanctification"],
    scriptureReferences: ["Romans 8:1-39"],
    description: "Verse-by-verse exposition of life in the Spirit, overcoming condemnation, and the eternal security of believers.",
    isRegistered: false
  },
  {
    id: "event-3",
    title: "Youth Prophetic Discernment & Q&A Forum",
    speaker: "Rev. Grace Kamau",
    speakerRole: "Director of Prayer & Spiritual Discernment",
    speakerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    type: "qa",
    date: "Friday, Aug 21, 2026",
    time: "5:00 PM EST",
    status: "upcoming",
    attendeesCount: 160,
    recordingStatus: "none",
    category: "Youth & Discernment",
    tags: ["Youth", "Discernment", "Q&A", "Dreams & Visions"],
    scriptureReferences: ["Joel 2:28", "1 Thessalonians 5:21", "1 John 4:1"],
    description: "Interactive session addressing young people's questions on dreams, spiritual gifts, biblical discernment, and holy living.",
    isRegistered: false
  }
];

export const ENDORSEMENTS_LIST: Endorsement[] = [
  {
    id: "end-1",
    name: "Bishop Arthur Sterling",
    title: "Presiding Prelate",
    ministry: "International Apostolic Council",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
    quote: "Global Tower of Christ represents the future of Bible-centred digital discipleship. Apostle R.Sango's commitment to sound doctrine, spiritual excellence, and Christ-centered technology is a blessing to the global Body.",
    verified: true,
    approvalStatus: "approved"
  },
  {
    id: "end-2",
    name: "Dr. Rebecca Thorne",
    title: "Chancellor",
    ministry: "Berean Theological Seminary",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    quote: "What impresses me most is the platform's uncompromising fidelity to Scripture. The AI Spiritual Insight Engine refuses to fabricate verses and consistently points believers back to the Bible and pastoral discernment.",
    verified: true,
    approvalStatus: "approved"
  }
];

export const AI_SOURCES_LIST: AISource[] = [
  {
    id: "src-1",
    name: "Holy Bible (KJV, NIV, ESV, NASB, NLT Textus Receptus & Critical Text)",
    url: "https://biblegateway.com",
    description: "Canonical 66 books of the Old and New Testaments used as the primary source of truth.",
    category: "scripture",
    isApproved: true,
    lastChecked: "2026-08-15"
  },
  {
    id: "src-2",
    name: "Global Tower of Christ Ministerial Archive",
    url: "https://globaltowerofchrist.org/teachings",
    description: "Approved transcripts and theological publications authored by Apostle R.Sango and ministry teachers.",
    category: "sermons",
    isApproved: true,
    lastChecked: "2026-08-16"
  },
  {
    id: "src-3",
    name: "Historical Christian Creeds (Nicene, Apostles', Chalcedonian)",
    url: "https://creeds.org",
    description: "Orthodox Christian doctrinal benchmarks ensuring theological integrity and alignment with historical faith.",
    category: "doctrine",
    isApproved: true,
    lastChecked: "2026-08-10"
  },
  {
    id: "src-4",
    name: "Matthew Henry's Complete Commentary on the Whole Bible",
    url: "https://ccel.org/ccel/henry/mhc",
    description: "Classic biblical commentary for historical context and theological reflections.",
    category: "commentary",
    isApproved: true,
    lastChecked: "2026-08-12"
  }
];

export const YOUTH_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q-1",
    question: "According to Ephesians 6:17, what is the 'Sword of the Spirit'?",
    options: [
      "Our personal intellect",
      "The Word of God",
      "Human traditions",
      "Physical strength"
    ],
    correctIndex: 1,
    scriptureRef: "Ephesians 6:17",
    explanation: "Ephesians 6:17 explicitly states: 'and take the helmet of salvation, and the sword of the Spirit, which is the word of God.'",
    category: "Spiritual Armor"
  },
  {
    id: "q-2",
    question: "What does 1 Thessalonians 5:21 instruct believers to do regarding spiritual experiences and teachings?",
    options: [
      "Accept everything without question",
      "Test everything; hold fast what is good",
      "Ignore all spiritual gifts completely",
      "Rely solely on personal feelings"
    ],
    correctIndex: 1,
    scriptureRef: "1 Thessalonians 5:21",
    explanation: "Paul commands believers to test all spiritual impressions and teachings against the standard of God's Word.",
    category: "Discernment"
  },
  {
    id: "q-3",
    question: "In John 14:6, what three titles does Jesus claim for Himself?",
    options: [
      "The King, The Judge, and The Law",
      "The Way, The Truth, and The Life",
      "The Teacher, The Prophet, and The Priest",
      "The Shepherd, The Vine, and The Door"
    ],
    correctIndex: 1,
    scriptureRef: "John 14:6",
    explanation: "Jesus said to him, 'I am the way, and the truth, and the life. No one comes to the Father except through me.'",
    category: "Christology"
  },
  {
    id: "q-4",
    question: "In Romans 8:37, what does Paul say believers are through Christ who loved us?",
    options: [
      "Helpless victims",
      "More than conquerors",
      "Mere spectators",
      "Doubtful seekers"
    ],
    correctIndex: 1,
    scriptureRef: "Romans 8:37",
    explanation: "Paul declares: 'No, in all these things we are more than conquerors through him who loved us.'",
    category: "Dominion & Victory"
  }
];

export const FLASHCARDS_LIST: Flashcard[] = [
  {
    id: "fc-1",
    front: "Proverbs 3:5-6 (Memory Verse)",
    back: "Trust in the LORD with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.",
    scriptureRef: "Proverbs 3:5-6",
    category: "Trust & Guidance"
  },
  {
    id: "fc-2",
    front: "Philippians 4:6-7",
    back: "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God... will guard your hearts and minds.",
    scriptureRef: "Philippians 4:6-7",
    category: "Prayer & Peace"
  },
  {
    id: "fc-3",
    front: "Romans 8:1",
    back: "There is therefore now no condemnation for those who are in Christ Jesus.",
    scriptureRef: "Romans 8:1",
    category: "Grace & Victory"
  }
];

export const COMMUNITY_POSTS_INITIAL: CommunityPost[] = [
  {
    id: "post-1",
    authorName: "Apostle R.Sango",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    authorRole: "Founder & Lead Minister",
    title: "Welcome to Global Tower of Christ! Worship. Dominion. Victory.",
    content: "Grace and peace family! Our prayer is that this platform equips you to study Scripture deeply, listen to the Holy Spirit with biblical discernment, and walk in the victory purchased on the Cross. Feel free to share your testimonies and prayer requests here.",
    category: "Ministry Announcement",
    likesCount: 142,
    commentsCount: 28,
    isPinned: true,
    createdAt: "2026-08-16T10:00:00Z",
    comments: [
      {
        id: "c-1",
        authorName: "Sister Sarah M.",
        content: "Amen! So blessed by this vision. The Spiritual Insight engine helped me understand Joel 2 so much better.",
        createdAt: "2026-08-16T11:20:00Z"
      }
    ]
  },
  {
    id: "post-2",
    authorName: "Brother Joshua T.",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    authorRole: "Study Group Leader",
    title: "Romans 8 Study Group: Questions on Verse 28",
    content: "When Paul writes that 'all things work together for good to those who love God', how does this give us comfort when facing sudden illness or financial struggle? Share your insights below.",
    category: "Bible Study",
    likesCount: 38,
    commentsCount: 14,
    createdAt: "2026-08-17T08:30:00Z"
  }
];

export const PRAYER_ITEMS_INITIAL: PrayerItem[] = [
  {
    id: "pray-1",
    title: "Healing & Peace for Sister Maria's Family",
    description: "Please stand with our family in faith for divine healing, strength, and complete restoration.",
    category: "Healing",
    isAnswered: false,
    isPrivate: false,
    scriptures: ["Jeremiah 30:17", "Isaiah 53:5"],
    prayedCount: 84,
    hasUserPrayed: false,
    authorName: "Maria K.",
    createdAt: "2026-08-16T14:00:00Z"
  },
  {
    id: "pray-2",
    title: "Praise Report: University Admission & Financial Provision!",
    description: "God proved faithful! After weeks of prayer, I received a full scholarship for theological studies.",
    category: "Testimony",
    isAnswered: true,
    answeredDate: "2026-08-15",
    testimony: "The Lord made a way where there seemed to be no way. All glory to Jesus!",
    isPrivate: false,
    scriptures: ["Philippians 4:19"],
    prayedCount: 120,
    hasUserPrayed: false,
    authorName: "Caleb N.",
    createdAt: "2026-08-14T09:00:00Z"
  }
];

export const INITIAL_ANALYTICS: PlatformAnalytics = {
  totalUsers: 1420,
  activeUsersToday: 412,
  newRegistrationsWeek: 94,
  sermonPlaysTotal: 18450,
  bibleSearchesTotal: 31200,
  aiSearchesTotal: 8420,
  liveAttendeesTotal: 3950,
  first20UsersList: [
    { id: "u-1", name: "Apostle R.Sango", email: "sangorichard@gmail.com", date: "2026-08-01", lastActive: "Just now", totalActivity: 450 },
    { id: "u-2", name: "Pastor David Adeyemi", email: "david.adeyemi@gtcministry.org", date: "2026-08-01", lastActive: "15 mins ago", totalActivity: 320 },
    { id: "u-3", name: "Rev. Grace Kamau", email: "grace.kamau@gtcministry.org", date: "2026-08-02", lastActive: "1 hr ago", totalActivity: 280 },
    { id: "u-4", name: "Dr. Emmanuel Mensah", email: "e.mensah@theology.edu", date: "2026-08-02", lastActive: "2 hrs ago", totalActivity: 310 },
    { id: "u-5", name: "Sarah Mutua", email: "sarah.m@gmail.com", date: "2026-08-03", lastActive: "Yesterday", totalActivity: 195 },
    { id: "u-6", name: "Joshua Taylor", email: "joshua.t@outlook.com", date: "2026-08-03", lastActive: "3 hrs ago", totalActivity: 140 },
    { id: "u-7", name: "Deborah Vance", email: "deborah.v@gmail.com", date: "2026-08-04", lastActive: "4 hrs ago", totalActivity: 165 },
    { id: "u-8", name: "Michael Obi", email: "m.obi@icloud.com", date: "2026-08-04", lastActive: "Today", totalActivity: 180 },
    { id: "u-9", name: "Rachel Adams", email: "rachel.a@yahoo.com", date: "2026-08-05", lastActive: "Yesterday", totalActivity: 110 },
    { id: "u-10", name: "Samuel Kimani", email: "samuel.k@gtc.org", date: "2026-08-05", lastActive: "Today", totalActivity: 220 },
    { id: "u-11", name: "Hannah Lewis", email: "hannah.l@gmail.com", date: "2026-08-06", lastActive: "Today", totalActivity: 95 },
    { id: "u-12", name: "Ezekiel Ndirangu", email: "ezekiel.n@gmail.com", date: "2026-08-06", lastActive: "2 days ago", totalActivity: 85 },
    { id: "u-13", name: "Priscilla Wong", email: "priscilla.w@gmail.com", date: "2026-08-07", lastActive: "Today", totalActivity: 130 },
    { id: "u-14", name: "Barnabas Clarke", email: "barnabas.c@minister.net", date: "2026-08-07", lastActive: "3 days ago", totalActivity: 75 },
    { id: "u-15", name: "Esther Morales", email: "esther.m@gmail.com", date: "2026-08-08", lastActive: "Yesterday", totalActivity: 105 },
    { id: "u-16", name: "Timothy Johnson", email: "timothy.j@youth.org", date: "2026-08-08", lastActive: "Today", totalActivity: 160 },
    { id: "u-17", name: "Lydia Dupont", email: "lydia.dupont@fr.ministry.com", date: "2026-08-09", lastActive: "Today", totalActivity: 145 },
    { id: "u-18", name: "Titus Becker", email: "titus.b@gmail.com", date: "2026-08-09", lastActive: "Yesterday", totalActivity: 90 },
    { id: "u-19", name: "Miriam Al-Hassan", email: "miriam.h@gmail.com", date: "2026-08-10", lastActive: "Today", totalActivity: 115 },
    { id: "u-20", name: "Nathaniel Vance", email: "nathaniel.v@gmail.com", date: "2026-08-10", lastActive: "Today", totalActivity: 175 }
  ]
};
