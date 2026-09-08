export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  scriptureRef: string;
}

export interface QuizItem {
  id: string;
  quizNumber: number;
  title: string;
  category: string;
  audience: "Kids" | "Adults";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  keyScripture: string;
  questions: QuizQuestion[];
}

export const MASTER_20_QUIZZES: QuizItem[] = [
  // ================= KIDS QUIZZES (1 to 10) =================
  {
    id: "quiz-1",
    quizNumber: 1,
    title: "Creation & The Garden of Eden",
    category: "Origins & Faith",
    audience: "Kids",
    difficulty: "Beginner",
    description: "Discover how God created the heavens, the earth, the animals, and people in six days!",
    keyScripture: "Genesis 1:1",
    questions: [
      {
        id: "q1-1",
        question: "What did God create on the very first day of Creation?",
        options: ["The Sun and Moon", "Light ('Let there be light')", "Fish and birds", "Trees and flowers"],
        correctIndex: 1,
        explanation: "Genesis 1:3 records God saying, 'Let there be light,' and there was light on Day One.",
        scriptureRef: "Genesis 1:3"
      },
      {
        id: "q1-2",
        question: "On which day did God make all the land animals and human beings?",
        options: ["Day 4", "Day 5", "Day 6", "Day 7"],
        correctIndex: 2,
        explanation: "Genesis 1:24-31 states that on Day 6, God created cattle, creeping things, and mankind in His image.",
        scriptureRef: "Genesis 1:26-31"
      },
      {
        id: "q1-3",
        question: "What did God do on the seventh day after finishing His creation work?",
        options: ["He went to sleep", "He rested from all His work and made it holy", "He created dinosaurs", "He started over"],
        correctIndex: 1,
        explanation: "Genesis 2:2-3 explains that God rested on the seventh day from all His work, setting an example of Sabbath rest.",
        scriptureRef: "Genesis 2:2-3"
      },
      {
        id: "q1-4",
        question: "What were the names of the first man and woman in the Garden of Eden?",
        options: ["Abraham and Sarah", "Moses and Zipporah", "Adam and Eve", "David and Abigail"],
        correctIndex: 2,
        explanation: "God created Adam from the dust of the ground and formed Eve to be his helper in Eden.",
        scriptureRef: "Genesis 2:7, 21-22"
      }
    ]
  },
  {
    id: "quiz-2",
    quizNumber: 2,
    title: "Noah's Ark & The Rainbow Covenant",
    category: "Old Testament Stories",
    audience: "Kids",
    difficulty: "Beginner",
    description: "Learn how Noah obeyed God, built a massive ark, and saw God's rainbow of promise.",
    keyScripture: "Genesis 9:13",
    questions: [
      {
        id: "q2-1",
        question: "Why did God choose to save Noah and his family in the Ark?",
        options: ["Noah was a righteous man who walked faithfully with God", "Noah was the richest king", "Noah was the strongest fighter", "Noah built a stone castle"],
        correctIndex: 0,
        explanation: "Genesis 6:9 reveals that Noah was a righteous man, blameless among the people of his time, and walked with God.",
        scriptureRef: "Genesis 6:9"
      },
      {
        id: "q2-2",
        question: "What kind of bird brought back an olive leaf to let Noah know the floodwaters were drying up?",
        options: ["An eagle", "A dove", "A raven", "A sparrow"],
        correctIndex: 1,
        explanation: "Genesis 8:11 says when the dove returned to Noah in the evening, in its beak was a freshly plucked olive leaf!",
        scriptureRef: "Genesis 8:11"
      },
      {
        id: "q2-3",
        question: "What sign did God put in the clouds as a promise never to destroy the earth with a flood again?",
        options: ["A shooting star", "A rainbow", "A bright thunderbolt", "A solar eclipse"],
        correctIndex: 1,
        explanation: "Genesis 9:13 declares: 'I have set my rainbow in the clouds, and it will be the sign of the covenant between me and the earth.'",
        scriptureRef: "Genesis 9:13"
      }
    ]
  },
  {
    id: "quiz-3",
    quizNumber: 3,
    title: "Baby Moses & The Parting of the Red Sea",
    category: "Miracles of God",
    audience: "Kids",
    difficulty: "Beginner",
    description: "Witness how God protected baby Moses in a basket and parted the mighty sea with a staff!",
    keyScripture: "Exodus 14:21",
    questions: [
      {
        id: "q3-1",
        question: "Where did Moses' mother hide him when he was a baby to keep him safe from Pharaoh?",
        options: ["Inside a mountain cave", "In a waterproof basket among the reeds of the Nile River", "In a palace bedroom", "In the desert sand"],
        correctIndex: 1,
        explanation: "Jochebed made a papyrus basket coated with tar and pitch and placed baby Moses among the Nile reeds.",
        scriptureRef: "Exodus 2:3"
      },
      {
        id: "q3-2",
        question: "Through what miraculous object did God first speak to Moses in the wilderness of Midian?",
        options: ["A golden horn", "A bush that was burning but not burning up", "A giant thunderstorm", "A stone tablet"],
        correctIndex: 1,
        explanation: "Exodus 3:2 says the angel of the Lord appeared to Moses in flames of fire from within a bush that was not consumed.",
        scriptureRef: "Exodus 3:2"
      },
      {
        id: "q3-3",
        question: "What happened when Moses stretched out his hand with his staff over the Red Sea?",
        options: ["The sea turned into ice", "God drove the sea back with a strong east wind and divided the waters on dry ground", "Boats fell from the sky", "The Israelites swam across"],
        correctIndex: 1,
        explanation: "Exodus 14:21 describes God dividing the waters so the children of Israel could walk across on dry ground.",
        scriptureRef: "Exodus 14:21-22"
      }
    ]
  },
  {
    id: "quiz-4",
    quizNumber: 4,
    title: "David & The Giant Goliath",
    category: "Faith & Courage",
    audience: "Kids",
    difficulty: "Beginner",
    description: "See how a young shepherd boy defeated a 9-foot warrior with five smooth stones and mighty faith in God.",
    keyScripture: "1 Samuel 17:45",
    questions: [
      {
        id: "q4-1",
        question: "What was young David's job before he visited his brothers on the battlefield?",
        options: ["A royal soldier", "A shepherd caring for his father's sheep", "A fisherman on Galilee", "A temple priest"],
        correctIndex: 1,
        explanation: "David tended his father Jesse's sheep in Bethlehem, defending them from lions and bears through God's power.",
        scriptureRef: "1 Samuel 17:15, 34-36"
      },
      {
        id: "q4-2",
        question: "What weapon did David carry when he confronted Goliath?",
        options: ["King Saul's heavy bronze armor", "A sling and five smooth stones from the stream", "A large iron sword", "A chariot of fire"],
        correctIndex: 1,
        explanation: "David rejected heavy human armor and took his shepherd's staff, sling, and five smooth stones.",
        scriptureRef: "1 Samuel 17:40"
      },
      {
        id: "q4-3",
        question: "In whose name did David declare he was fighting against Goliath?",
        options: ["In his own strength", "In the name of the Lord Almighty, the God of the armies of Israel", "In King Saul's name", "In the name of angels"],
        correctIndex: 1,
        explanation: "1 Samuel 17:45 says: 'You come against me with sword and spear... but I come against you in the name of the Lord Almighty!'",
        scriptureRef: "1 Samuel 17:45"
      }
    ]
  },
  {
    id: "quiz-5",
    quizNumber: 5,
    title: "Daniel & The Secret of the Lions' Den",
    category: "Courage & Prayer",
    audience: "Kids",
    difficulty: "Intermediate",
    description: "Explore how daily prayer protected Daniel from hungry lions and caused the King to praise God.",
    keyScripture: "Daniel 6:22",
    questions: [
      {
        id: "q5-1",
        question: "How many times a day did Daniel kneel and pray toward Jerusalem, thanking God?",
        options: ["Once a week", "Three times a day", "Only at midnight", "Once a year on his birthday"],
        correctIndex: 1,
        explanation: "Daniel 6:10 states that three times a day he got down on his knees and prayed, giving thanks to his God as was his habit.",
        scriptureRef: "Daniel 6:10"
      },
      {
        id: "q5-2",
        question: "Why did the lions not harm Daniel when he was thrown into their den all night?",
        options: ["The lions were already full of meat", "God sent His angel to shut the mouths of the lions", "Daniel was wearing armor", "The lions were asleep for winter"],
        correctIndex: 1,
        explanation: "Daniel 6:22 affirms: 'My God sent his angel, and he shut the mouths of the lions. They have not hurt me.'",
        scriptureRef: "Daniel 6:22"
      }
    ]
  },
  {
    id: "quiz-6",
    quizNumber: 6,
    title: "Jonah & The Great Fish",
    category: "Obedience & Mercy",
    audience: "Kids",
    difficulty: "Beginner",
    description: "Learn why running from God never works and how God gives second chances when we repent.",
    keyScripture: "Jonah 2:9",
    questions: [
      {
        id: "q6-1",
        question: "To which city did God originally send Jonah to preach repentance?",
        options: ["Tarshish", "Nineveh", "Jerusalem", "Babylon"],
        correctIndex: 1,
        explanation: "The Lord told Jonah to go to the great city of Nineveh and preach against it, but Jonah boarded a ship to Tarshish instead.",
        scriptureRef: "Jonah 1:1-3"
      },
      {
        id: "q6-2",
        question: "How long was Jonah inside the belly of the great fish praying to God?",
        options: ["1 hour", "3 days and 3 nights", "7 days", "40 days"],
        correctIndex: 1,
        explanation: "Jonah 1:17 records that Jonah was in the belly of the fish three days and three nights before being vomited onto dry land.",
        scriptureRef: "Jonah 1:17"
      }
    ]
  },
  {
    id: "quiz-7",
    quizNumber: 7,
    title: "The Birth & Youth of Jesus Christ",
    category: "Gospels & Salvation",
    audience: "Kids",
    difficulty: "Beginner",
    description: "Celebrate the birth of our Savior in Bethlehem, the star of the Magi, and angels singing glory in the highest!",
    keyScripture: "Luke 2:11",
    questions: [
      {
        id: "q7-1",
        question: "In what town was Jesus Christ born as prophesied in Micah 5:2?",
        options: ["Nazareth", "Bethlehem", "Jerusalem", "Rome"],
        correctIndex: 1,
        explanation: "Luke 2:4-7 tells how Mary and Joseph traveled to Bethlehem where baby Jesus was wrapped in swaddling cloths.",
        scriptureRef: "Luke 2:4-7"
      },
      {
        id: "q7-2",
        question: "What gifts did the wise men (Magi) bring to worship the young King Jesus?",
        options: ["Gold, frankincense, and myrrh", "Silver, bronze, and copper", "Bread, honey, and olive oil", "Robes, crowns, and jewels"],
        correctIndex: 0,
        explanation: "Matthew 2:11 states the Magi opened their treasures and presented Him with gold, frankincense, and myrrh.",
        scriptureRef: "Matthew 2:11"
      }
    ]
  },
  {
    id: "quiz-8",
    quizNumber: 8,
    title: "Miracles of Jesus: Loaves, Fishes & Walking on Water",
    category: "Miracles & Power",
    audience: "Kids",
    difficulty: "Intermediate",
    description: "Witness the miraculous power of Jesus calming storms, feeding thousands, and healing the sick.",
    keyScripture: "Matthew 14:27",
    questions: [
      {
        id: "q8-1",
        question: "What small lunch from a boy did Jesus multiply to feed over 5,000 people?",
        options: ["Five barley loaves and two small fish", "Seven melons and roast lamb", "Three apples and goat cheese", "A basket of figs"],
        correctIndex: 0,
        explanation: "John 6:9-13 tells of a young boy's five barley loaves and two fish being multiplied by Jesus with 12 baskets left over!",
        scriptureRef: "John 6:9-13"
      },
      {
        id: "q8-2",
        question: "Which disciple stepped out of the boat to walk on the water toward Jesus?",
        options: ["John", "Peter", "Thomas", "Andrew"],
        correctIndex: 1,
        explanation: "Matthew 14:29 records: 'Then Peter got down out of the boat, walked on the water and came toward Jesus.'",
        scriptureRef: "Matthew 14:29"
      }
    ]
  },
  {
    id: "quiz-9",
    quizNumber: 9,
    title: "The Fruit of the Spirit & Loving Others",
    category: "Christian Living",
    audience: "Kids",
    difficulty: "Beginner",
    description: "Learn the nine supernatural fruits that grow in our hearts when the Holy Spirit lives inside us.",
    keyScripture: "Galatians 5:22-23",
    questions: [
      {
        id: "q9-1",
        question: "Which of the following is listed in Galatians 5:22-23 as Fruit of the Spirit?",
        options: ["Pride, jealousy, and anger", "Love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control", "Money, popularity, and physical strength", "Fear, doubt, and worry"],
        correctIndex: 1,
        explanation: "Galatians 5:22-23 outlines the nine virtues produced by the Holy Spirit in every believer.",
        scriptureRef: "Galatians 5:22-23"
      },
      {
        id: "q9-2",
        question: "According to Jesus in John 13:35, how will everyone know we are His disciples?",
        options: ["If we have the biggest building", "If we love one another", "If we never make a mistake", "If we wear special clothes"],
        correctIndex: 1,
        explanation: "Jesus commanded: 'By this everyone will know that you are my disciples, if you love one another.'",
        scriptureRef: "John 13:35"
      }
    ]
  },
  {
    id: "quiz-10",
    quizNumber: 10,
    title: "The Armor of God: Equipping Young Champions",
    category: "Spiritual Victory",
    audience: "Kids",
    difficulty: "Intermediate",
    description: "Put on the belt of truth, helmet of salvation, and wield the sword of the Spirit every single day.",
    keyScripture: "Ephesians 6:11",
    questions: [
      {
        id: "q10-1",
        question: "What is the only offensive weapon listed in the Armor of God in Ephesians 6?",
        options: ["The Shield of Faith", "The Sword of the Spirit, which is the Word of God", "The Breastplate of Righteousness", "The Helmet of Salvation"],
        correctIndex: 1,
        explanation: "Ephesians 6:17 specifies: '...and take the helmet of salvation, and the sword of the Spirit, which is the word of God.'",
        scriptureRef: "Ephesians 6:17"
      },
      {
        id: "q10-2",
        question: "What does the Shield of Faith protect you against according to Paul?",
        options: ["Physical rain", "All the flaming arrows (fiery darts) of the evil one", "Cold weather", "Arguments with friends"],
        correctIndex: 1,
        explanation: "Ephesians 6:16 declares: 'Take up the shield of faith, with which you can extinguish all the flaming arrows of the evil one.'",
        scriptureRef: "Ephesians 6:16"
      }
    ]
  },

  // ================= ADULTS QUIZZES (11 to 20) =================
  {
    id: "quiz-11",
    quizNumber: 11,
    title: "Justification by Faith & The Book of Romans",
    category: "Theology & Doctrine",
    audience: "Adults",
    difficulty: "Intermediate",
    description: "Deep dive into Paul's masterwork on grace, imputed righteousness, and freedom from condemnation.",
    keyScripture: "Romans 5:1",
    questions: [
      {
        id: "q11-1",
        question: "According to Romans 5:1, what immediate blessing do believers possess because they are justified by faith?",
        options: ["Financial prosperity", "Peace with God through our Lord Jesus Christ", "Immunity from earthly trials", "Physical perfection"],
        correctIndex: 1,
        explanation: "Romans 5:1 establishes: 'Therefore, since we have been justified through faith, we have peace with God through our Lord Jesus Christ.'",
        scriptureRef: "Romans 5:1"
      },
      {
        id: "q11-2",
        question: "What does Romans 8:1 declare regarding those who are in Christ Jesus?",
        options: ["They must perform penance", "There is now no condemnation for those who are in Christ Jesus", "They are under strict judgment", "They must earn salvation daily"],
        correctIndex: 1,
        explanation: "Romans 8:1 eliminates fear and guilt: 'There is therefore now no condemnation for those who are in Christ Jesus.'",
        scriptureRef: "Romans 8:1"
      },
      {
        id: "q11-3",
        question: "In Romans 4, whom does Paul cite as the primary Old Testament example of righteousness credited through faith without works?",
        options: ["King David", "Abraham", "Moses", "Elijah"],
        correctIndex: 1,
        explanation: "Romans 4:3 cites Genesis 15:6: 'Abraham believed God, and it was credited to him as righteousness.'",
        scriptureRef: "Romans 4:3"
      }
    ]
  },
  {
    id: "quiz-12",
    quizNumber: 12,
    title: "Spiritual Warfare & Divine Authority in Christ",
    category: "Dominion & Victory",
    audience: "Adults",
    difficulty: "Advanced",
    description: "Master biblical authority, demolishing spiritual strongholds, and exercising dominion through Christ.",
    keyScripture: "Luke 10:19",
    questions: [
      {
        id: "q12-1",
        question: "According to 2 Corinthians 10:4, what characterizes the weapons of our Christian warfare?",
        options: ["They are political and legal", "They are not of the flesh, but have divine power to destroy strongholds", "They rely on physical armies", "They are psychological techniques"],
        correctIndex: 1,
        explanation: "2 Corinthians 10:4-5 teaches that our weapons are divinely empowered to destroy ideological and demonic strongholds.",
        scriptureRef: "2 Corinthians 10:4"
      },
      {
        id: "q12-2",
        question: "What authority did Jesus confer upon the seventy disciples in Luke 10:19?",
        options: ["Authority to collect taxes", "Authority to trample on snakes and scorpions, and to overcome all the power of the enemy", "Authority over Roman governors", "Authority to write secular laws"],
        correctIndex: 1,
        explanation: "Jesus declared: 'I have given you authority to trample on snakes and scorpions and to overcome all the power of the enemy; nothing will harm you.'",
        scriptureRef: "Luke 10:19"
      }
    ]
  },
  {
    id: "quiz-13",
    quizNumber: 13,
    title: "Prophetic Dreams, Visions & Biblical Discernment",
    category: "Prophetic & Discernment",
    audience: "Adults",
    difficulty: "Advanced",
    description: "Explore the scriptural rules for testing night revelations, prophetic impressions, and dreams against the Bible.",
    keyScripture: "1 Thessalonians 5:21",
    questions: [
      {
        id: "q13-1",
        question: "What command does 1 Thessalonians 5:20-21 give regarding prophetic utterances and impressions?",
        options: ["Accept all revelations uncritically", "Do not treat prophecies with contempt, but test them all; hold on to what is good", "Ban all spiritual gifts completely", "Only trust dreams after midnight"],
        correctIndex: 1,
        explanation: "Apostle Paul commands believers never to despise prophecy, but to rigorously test all things against the canon of Scripture.",
        scriptureRef: "1 Thessalonians 5:20-21"
      },
      {
        id: "q13-2",
        question: "According to Job 33:14-17, what is one key reason God speaks to mortals in dreams and visions of the night?",
        options: ["To satisfy human curiosity", "To turn them from wrongdoing and keep them from pride, preserving their soul from the pit", "To foretell lottery numbers", "To replace the written Scriptures"],
        correctIndex: 1,
        explanation: "Elihu explains in Job 33:14-18 that God reveals secrets in sleep to preserve human lives from destruction and pride.",
        scriptureRef: "Job 33:14-18"
      }
    ]
  },
  {
    id: "quiz-14",
    quizNumber: 14,
    title: "The Biblical Covenants: Abraham to Calvary",
    category: "Covenant Theology",
    audience: "Adults",
    difficulty: "Advanced",
    description: "Trace the unfolding redemptive covenants from Abrahamic promise to the New Covenant sealed in Christ's blood.",
    keyScripture: "Hebrews 8:6",
    questions: [
      {
        id: "q14-1",
        question: "What was the universal promise given to Abraham in Genesis 12:3 that finds its fulfillment in Christ?",
        options: ["Only Israel would prosper", "All peoples on earth will be blessed through you", "The Law of Moses would be eternal", "The earth would never change"],
        correctIndex: 1,
        explanation: "Genesis 12:3 and Galatians 3:8 show that the Gospel was preached beforehand to Abraham: 'All nations will be blessed through you.'",
        scriptureRef: "Genesis 12:3; Galatians 3:8"
      },
      {
        id: "q14-2",
        question: "In Jeremiah 31:31-34, what distinct characteristic separates the New Covenant from the Mosaic Covenant?",
        options: ["It requires animal sacrifices", "God puts His law in their minds and writes it on their hearts, forgiving their iniquity forever", "It only applies to Levites", "It is written on stone tablets"],
        correctIndex: 1,
        explanation: "Jeremiah 31:33 prophesied the internal transformation of the heart through the Holy Spirit under the New Covenant.",
        scriptureRef: "Jeremiah 31:33"
      }
    ]
  },
  {
    id: "quiz-15",
    quizNumber: 15,
    title: "The Tabernacle, Priesthood & Christ Our High Priest",
    category: "Old Testament Typology",
    audience: "Adults",
    difficulty: "Advanced",
    description: "Understand the deep prophetic shadows of the Ark of the Covenant, Mercy Seat, and the heavenly sanctuary in Hebrews.",
    keyScripture: "Hebrews 9:11-12",
    questions: [
      {
        id: "q15-1",
        question: "What took place in the Jerusalem temple veil at the exact moment Jesus breathed His last on the cross?",
        options: ["The veil caught fire", "The curtain of the temple was torn in two from top to bottom", "The priests rebuilt the altar", "Nothing happened to the veil"],
        correctIndex: 1,
        explanation: "Matthew 27:51 records that the temple veil was torn from top to bottom, signifying direct access to God through Christ's sacrifice.",
        scriptureRef: "Matthew 27:51; Hebrews 10:19-20"
      },
      {
        id: "q15-2",
        question: "According to Hebrews 7:24-25, why is Jesus able to save completely those who come to God through Him?",
        options: ["He lives in earthly temples", "Because He holds His priesthood permanently and always lives to intercede for them", "Because of genealogical descent from Levi", "Because He offers bulls and goats"],
        correctIndex: 1,
        explanation: "Hebrews 7:25 declares Jesus is able to save completely because He lives forever to make intercession for us.",
        scriptureRef: "Hebrews 7:25"
      }
    ]
  },
  {
    id: "quiz-16",
    quizNumber: 16,
    title: "Acts of the Apostles & The Holy Spirit's Fire",
    category: "Early Church History",
    audience: "Adults",
    difficulty: "Intermediate",
    description: "Examine the Day of Pentecost, signs and wonders, apostolic boldly in persecution, and missionary expansion.",
    keyScripture: "Acts 1:8",
    questions: [
      {
        id: "q16-1",
        question: "What promise did Jesus give His disciples in Acts 1:8 prior to His Ascension?",
        options: ["You will avoid all persecution", "You will receive power when the Holy Spirit comes on you; and you will be my witnesses", "You will establish a physical empire in Rome", "You will immediately enter heaven"],
        correctIndex: 1,
        explanation: "Acts 1:8 is the Great Commission mandate: divine power through the Holy Spirit to witness to the ends of the earth.",
        scriptureRef: "Acts 1:8"
      },
      {
        id: "q16-2",
        question: "On the Day of Pentecost in Acts 2, what physical manifestations accompanied the arrival of the Holy Spirit?",
        options: ["A great earthquake and lightning", "A sound like the blowing of a violent wind and tongues of fire that separated and rested on each of them", "A dark cloud over Mount Sinai", "A solar eclipse"],
        correctIndex: 1,
        explanation: "Acts 2:2-3 describes the sound of a rushing wind from heaven and divided tongues like fire resting on the disciples.",
        scriptureRef: "Acts 2:2-3"
      }
    ]
  },
  {
    id: "quiz-17",
    quizNumber: 17,
    title: "Apostolic Wisdom & The Book of Proverbs",
    category: "Wisdom Literature",
    audience: "Adults",
    difficulty: "Intermediate",
    description: "Apply divine wisdom to speech, diligence, integrity, financial stewardship, and discerning deception.",
    keyScripture: "Proverbs 3:5-6",
    questions: [
      {
        id: "q17-1",
        question: "According to Proverbs 9:10, what is the beginning of wisdom?",
        options: ["Higher academic education", "The fear of the Lord, and knowledge of the Holy One is understanding", "Accumulating vast wealth", "Reading philosophical treatises"],
        correctIndex: 1,
        explanation: "Proverbs 9:10 establishes that reverent awe of the Lord God is the true foundational fountain of wisdom.",
        scriptureRef: "Proverbs 9:10"
      },
      {
        id: "q17-2",
        question: "What does Proverbs 18:21 declare regarding the spiritual power of speech?",
        options: ["Words have no lasting effect", "The tongue has the power of life and death, and those who love it will eat its fruit", "Only written words matter", "Silence is always mandatory"],
        correctIndex: 1,
        explanation: "Proverbs 18:21 reveals the supernatural creative and destructive capacity of our spoken words under God.",
        scriptureRef: "Proverbs 18:21"
      }
    ]
  },
  {
    id: "quiz-18",
    quizNumber: 18,
    title: "The Covenant Names & Attributes of God Almighty",
    category: "Theology & Worship",
    audience: "Adults",
    difficulty: "Intermediate",
    description: "Discover the revelation of Yahweh Rapha, Yahweh Jireh, Yahweh Nissi, El Shaddai, and the Holiness of God.",
    keyScripture: "Exodus 3:14",
    questions: [
      {
        id: "q18-1",
        question: "Which compound Hebrew name of God was revealed on Mount Moriah in Genesis 22:14 meaning 'The Lord Will Provide'?",
        options: ["Yahweh Shalom", "Yahweh Jireh (Yireh)", "Yahweh Tsidkenu", "El Roi"],
        correctIndex: 1,
        explanation: "Abraham called that place 'The Lord Will Provide' (Yahweh Jireh), prefiguring God providing His own Son on Calvary.",
        scriptureRef: "Genesis 22:14"
      },
      {
        id: "q18-2",
        question: "What name did God reveal to Moses at the burning bush in Exodus 3:14?",
        options: ["I AM WHO I AM (Ehyeh Asher Ehyeh)", "The Creator of Stars", "The King of Kings", "The Sovereign Judge"],
        correctIndex: 0,
        explanation: "God declared to Moses: 'I AM WHO I AM. Say to the Israelites: I AM has sent me to you.'",
        scriptureRef: "Exodus 3:14"
      }
    ]
  },
  {
    id: "quiz-19",
    quizNumber: 19,
    title: "Parables of the Kingdom & Eschatology",
    category: "Gospel Parables",
    audience: "Adults",
    difficulty: "Advanced",
    description: "Analyze the Parables of the Sower, the Ten Virgins, the Talents, and watchfulness for Christ's return.",
    keyScripture: "Matthew 25:13",
    questions: [
      {
        id: "q19-1",
        question: "In the Parable of the Ten Virgins (Matthew 25:1-13), what distinguished the five wise virgins from the five foolish virgins?",
        options: ["The wise virgins were richer", "The wise took oil in jars along with their lamps, while the foolish brought no extra oil", "The wise arrived in chariots", "The wise virgins did not sleep"],
        correctIndex: 1,
        explanation: "Matthew 25:4 explains that the wise prepared for delay with extra oil (symbolizing spiritual readiness and the Holy Spirit).",
        scriptureRef: "Matthew 25:1-4"
      },
      {
        id: "q19-2",
        question: "In the Parable of the Sower (Matthew 13), what does the 'good soil' represent?",
        options: ["Those who never hear the Word", "Those who hear the Word, understand it, and produce a crop yielding a hundred, sixty, or thirty times what was sown", "Those choked by thorns of wealth", "Those who quickly fall away during persecution"],
        correctIndex: 1,
        explanation: "Matthew 13:23 explains that good soil represents a receptive, obedient heart producing fruit unto eternal life.",
        scriptureRef: "Matthew 13:23"
      }
    ]
  },
  {
    id: "quiz-20",
    quizNumber: 20,
    title: "Kingdom Dominion & Walking in Apostle R.Sango's Teachings",
    category: "Apostolic Ministry",
    audience: "Adults",
    difficulty: "Advanced",
    description: "Comprehensive review of spiritual authority, faith, holiness, prayer, and victorious dominion in Jesus Christ.",
    keyScripture: "Romans 8:37",
    questions: [
      {
        id: "q20-1",
        question: "According to the apostolic doctrine taught by Apostle R.Sango and Scripture, what is the ultimate source of the believer's victory?",
        options: ["Human self-discipline alone", "The finished work of Christ at the Cross and the power of the resurrected Lord", "Religious rituals and ceremonies", "Material prosperity"],
        correctIndex: 1,
        explanation: "Apostle R.Sango teaches that our triumph rests solely in Christ's shed blood, the resurrection, and abiding in His Word.",
        scriptureRef: "Romans 8:37; 1 Corinthians 15:57"
      },
      {
        id: "q20-2",
        question: "What instruction does James 4:7 provide for overcoming demonic opposition in daily life?",
        options: ["Submit yourselves, then, to God. Resist the devil, and he will flee from you", "Negotiate with the enemy", "Live in constant panic", "Ignore spiritual reality"],
        correctIndex: 0,
        explanation: "James 4:7 outlines the divine protocol: total submission to God first, then active resistance in faith, causing the devil to flee.",
        scriptureRef: "James 4:7"
      },
      {
        id: "q20-3",
        question: "What does Apostle Paul describe as the 'anchor for the soul, firm and secure' in Hebrews 6:19?",
        options: ["Worldly savings", "Our hope in God's immutable oath and promise through Jesus Christ", "Human friendships", "Physical health"],
        correctIndex: 1,
        explanation: "Hebrews 6:19 declares our hope in Christ's covenant promises as an unshakable anchor entering into the inner sanctuary behind the curtain.",
        scriptureRef: "Hebrews 6:18-19"
      }
    ]
  }
];
