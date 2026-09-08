export interface BiblicalSymbol {
  id: string;
  symbol: string;
  category: "Holy Spirit & Anointing" | "Kingdom Authority" | "Purity & Salvation" | "Divine Guidance" | "Spiritual Warfare";
  primaryMeaning: string;
  biblicalContext: string;
  scriptures: {
    ref: string;
    text: string;
    book: string;
    chapter: number;
  }[];
  propheticSignificance: string;
  caution: string;
}

export const BIBLICAL_SYMBOLS: BiblicalSymbol[] = [
  {
    id: "oil",
    symbol: "Oil / Anointing Oil",
    category: "Holy Spirit & Anointing",
    primaryMeaning: "The empowerment, consecration, and abiding presence of the Holy Spirit.",
    biblicalContext: "Used in Scripture to consecrate kings, priests, and prophets, and for healing the sick in the Church.",
    scriptures: [
      {
        ref: "1 Samuel 16:13",
        text: "Then Samuel took the horn of oil and anointed him in the midst of his brothers. And the Spirit of the Lord rushed upon David from that day forward.",
        book: "1 Samuel",
        chapter: 16
      },
      {
        ref: "James 5:14",
        text: "Is anyone among you sick? Let him call for the elders of the church, and let them pray over him, anointing him with oil in the name of the Lord.",
        book: "James",
        chapter: 5
      },
      {
        ref: "Psalm 23:5",
        text: "You anoint my head with oil; my cup overflows.",
        book: "Psalms",
        chapter: 23
      }
    ],
    propheticSignificance: "Indicates divine setting apart, unction for leadership, preservation, and spiritual healing.",
    caution: "The power is in the Holy Spirit and the Name of Jesus, not the physical substance itself."
  },
  {
    id: "river-water",
    symbol: "Living Water / River",
    category: "Holy Spirit & Anointing",
    primaryMeaning: "Continuous flow of the Holy Spirit, divine cleansing, refreshing, and eternal life.",
    biblicalContext: "Ezekiel saw the river flowing from the Temple bringing life to everything it touched. Jesus offered living water to the woman at the well.",
    scriptures: [
      {
        ref: "John 7:38-39",
        text: "Whoever believes in me, as the Scripture has said, 'Out of his heart will flow rivers of living water.' Now this he said about the Spirit...",
        book: "John",
        chapter: 7
      },
      {
        ref: "Ezekiel 47:9",
        text: "And wherever the river goes, every living creature that swarms will live, and there will be very many fish.",
        book: "Ezekiel",
        chapter: 47
      },
      {
        ref: "Revelation 22:1",
        text: "Then the angel showed me the river of the water of life, bright as crystal, flowing from the throne of God and of the Lamb.",
        book: "Revelation",
        chapter: 22
      }
    ],
    propheticSignificance: "A promise of supernatural revival, cleansing from guilt, and soul-deep replenishment.",
    caution: "Distinguish between clear living water (peace, life) and turbulent or muddy water (unrest, confusion)."
  },
  {
    id: "eagle",
    symbol: "Eagle / Wings of an Eagle",
    category: "Kingdom Authority",
    primaryMeaning: "Spiritual elevation, renewal of youth and strength, prophetic acuity, and divine protection.",
    biblicalContext: "God bore Israel on eagles' wings out of Egypt. Those who wait upon the Lord mount up with wings like eagles.",
    scriptures: [
      {
        ref: "Isaiah 40:31",
        text: "They who wait for the Lord shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.",
        book: "Isaiah",
        chapter: 40
      },
      {
        ref: "Exodus 19:4",
        text: "You yourselves have seen what I did to the Egyptians, and how I bore you on eagles' wings and brought you to myself.",
        book: "Exodus",
        chapter: 19
      }
    ],
    propheticSignificance: "Rising above earthly storms through intimacy with God, gaining divine perspective over difficult circumstances.",
    caution: "Pride and false self-exaltation must be guarded against (Obadiah 1:4)."
  },
  {
    id: "white-robes",
    symbol: "White Robes / Garments",
    category: "Purity & Salvation",
    primaryMeaning: "Imputed righteousness of Christ, purity, redemption through the Blood of the Lamb, and bridal readiness.",
    biblicalContext: "The redeemed in Revelation wear white robes washed in the blood of the Lamb. The prodigal son received the finest robe upon returning home.",
    scriptures: [
      {
        ref: "Revelation 19:8",
        text: "It was granted her to clothe herself with fine linen, bright and pure — for the fine linen is the righteous deeds of the saints.",
        book: "Revelation",
        chapter: 19
      },
      {
        ref: "Isaiah 61:10",
        text: "He has clothed me with the garments of salvation; he has covered me with the robe of righteousness.",
        book: "Isaiah",
        chapter: 61
      }
    ],
    propheticSignificance: "Confirmation of spiritual cleansing, moral restoration, and acceptance before the throne of grace.",
    caution: "Righteousness is never self-made; it is the imputed gift of Jesus Christ alone."
  },
  {
    id: "lion",
    symbol: "Lion / The Lion of Judah",
    category: "Kingdom Authority",
    primaryMeaning: "Supreme sovereignty of Jesus Christ, kingly dominion, righteous courage, and triumph over enemies.",
    biblicalContext: "Christ is proclaimed as the Lion of the tribe of Judah who has conquered to open the scroll.",
    scriptures: [
      {
        ref: "Revelation 5:5",
        text: "Weep no more; behold, the Lion of the tribe of Judah, the Root of David, has conquered, so that he can open the scroll and its seven seals.",
        book: "Revelation",
        chapter: 5
      },
      {
        ref: "Proverbs 28:1",
        text: "The wicked flee when no one pursues, but the righteous are bold as a lion.",
        book: "Proverbs",
        chapter: 28
      }
    ],
    propheticSignificance: "Victory in spiritual battles, encouragement to step into apostolic dominion and bold proclamation.",
    caution: "Satan also counterfeits as a roaring lion seeking whom he may devour (1 Peter 5:8); context determines Christ versus adversary."
  },
  {
    id: "fire",
    symbol: "Holy Fire / Altar Fire",
    category: "Holy Spirit & Anointing",
    primaryMeaning: "Divine presence, holiness, purification of heart, and spiritual zeal for the Kingdom.",
    biblicalContext: "God answered Elijah with fire; tongues of fire rested on the disciples at Pentecost; God is described as a consuming fire.",
    scriptures: [
      {
        ref: "Acts 2:3",
        text: "And divided tongues as of fire appeared to them and rested on each one of them. And they were all filled with the Holy Spirit.",
        book: "Acts",
        chapter: 2
      },
      {
        ref: "Hebrews 12:29",
        text: "For our God is a consuming fire.",
        book: "Hebrews",
        chapter: 12
      },
      {
        ref: "Malachi 3:2",
        text: "For he is like a refiner's fire and like fullers' soap.",
        book: "Malachi",
        chapter: 3
      }
    ],
    propheticSignificance: "Purging of ungodly appetites, ignition of prayer life, and burning devotion for the Lord.",
    caution: "Unsanctified fleshly zeal (strange fire) must be avoided (Leviticus 10:1)."
  },
  {
    id: "horn",
    symbol: "Horn / Shofar",
    category: "Kingdom Authority",
    primaryMeaning: "Spiritual authority, apostolic dominion, strength, and prophetic announcement of victory.",
    biblicalContext: "David prayed that God would exalt his horn; horns represented the strength of an altar and royal power.",
    scriptures: [
      {
        ref: "Psalm 89:17",
        text: "For you are the glory of their strength; by your favor our horn is exalted.",
        book: "Psalms",
        chapter: 89
      },
      {
        ref: "Luke 1:69",
        text: "And has raised up a horn of salvation for us in the house of his servant David.",
        book: "Luke",
        chapter: 1
      }
    ],
    propheticSignificance: "Elevation to positions of spiritual influence and triumph over demonic intimidation.",
    caution: "Do not lift up your horn against God in self-glorification (Psalm 75:4-5)."
  },
  {
    id: "rock-stone",
    symbol: "Rock / Cornerstone",
    category: "Divine Guidance",
    primaryMeaning: "Christ the unshakable foundation, covenant stability, shelter in crisis, and immutable truth.",
    biblicalContext: "The wise builder puts his house on the rock. Peter confessed Jesus as the Christ, the foundation of the Church.",
    scriptures: [
      {
        ref: "1 Corinthians 10:4",
        text: "And all drank the same spiritual drink. For they drank from the spiritual Rock that followed them, and the Rock was Christ.",
        book: "1 Corinthians",
        chapter: 10
      },
      {
        ref: "Matthew 7:24",
        text: "Everyone then who hears these words of mine and does them will be like a wise man who built his house on the rock.",
        book: "Matthew",
        chapter: 7
      }
    ],
    propheticSignificance: "A call to ground all doctrine and decisions in Christ's unchanging word, guaranteeing stability.",
    caution: "Beware of stumbling over the Rock through unbelief (1 Peter 2:8)."
  },
  {
    id: "white-stone",
    symbol: "White Stone",
    category: "Purity & Salvation",
    primaryMeaning: "Divine acquittal, intimate covenant relationship, eternal vindication, and new heavenly identity.",
    biblicalContext: "In ancient legal trials, a white stone meant unanimous acquittal; Christ promises a white stone with a secret name to the overcomer.",
    scriptures: [
      {
        ref: "Revelation 2:17",
        text: "To the one who conquers I will give some of the hidden manna, and I will give him a white stone, with a new name written on the stone...",
        book: "Revelation",
        chapter: 2
      }
    ],
    propheticSignificance: "Freedom from past condemnation, reassurance of election, and heavenly destiny.",
    caution: "Conquering is through faith in Christ and perseverance, not worldly striving."
  },
  {
    id: "staff-rod",
    symbol: "Shepherd's Staff / Scepter",
    category: "Divine Guidance",
    primaryMeaning: "Pastoral care, gentle correction, kingdom rule, guidance through dark valleys, and defense against predators.",
    biblicalContext: "David sang 'your rod and your staff, they comfort me'. Moses held the rod of God to part the Red Sea.",
    scriptures: [
      {
        ref: "Psalm 23:4",
        text: "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
        book: "Psalms",
        chapter: 23
      },
      {
        ref: "Micah 7:14",
        text: "Shepherd your people with your staff, the flock of your inheritance...",
        book: "Micah",
        chapter: 7
      }
    ],
    propheticSignificance: "Reassurance of divine protection and pastoral guidance during transitions or hardship.",
    caution: "Correction from God is an act of love; do not despise the Lord's discipline."
  },
  {
    id: "open-door",
    symbol: "Open Door / Gate",
    category: "Divine Guidance",
    primaryMeaning: "Supernatural access, divine opportunity, Gospel breakthrough, and answered prayers.",
    biblicalContext: "Jesus holds the key of David: what He opens no one can shut. Paul asked for prayer that God would open a door for the Word.",
    scriptures: [
      {
        ref: "Revelation 3:8",
        text: "I know your works. Behold, I have set before you an open door, which no one is able to shut. I know that you have but little power, and yet you have kept my word...",
        book: "Revelation",
        chapter: 3
      },
      {
        ref: "1 Corinthians 16:9",
        text: "For a wide door for effective work has opened to me, and there are many adversaries.",
        book: "1 Corinthians",
        chapter: 16
      }
    ],
    propheticSignificance: "An invitation to step forward into ministry, career breakthrough, or heavenly fellowship without fear.",
    caution: "An open door may coincide with opposition; discernment ensures it is of God, not flesh."
  },
  {
    id: "sword",
    symbol: "Two-Edged Sword",
    category: "Spiritual Warfare",
    primaryMeaning: "The living Word of God, discernment between soul and spirit, weapon of truth defeating deception.",
    biblicalContext: "The sword of the Spirit is the Word of God; out of Christ's mouth comes a sharp two-edged sword.",
    scriptures: [
      {
        ref: "Hebrews 4:12",
        text: "For the word of God is living and active, sharper than any two-edged sword, piercing to the division of soul and of spirit...",
        book: "Hebrews",
        chapter: 4
      },
      {
        ref: "Ephesians 6:17",
        text: "And take the helmet of salvation, and the sword of the Spirit, which is the word of God.",
        book: "Ephesians",
        chapter: 6
      }
    ],
    propheticSignificance: "A call to wield Scripture accurately, cut through spiritual confusion, and dismantle enemy strongholds.",
    caution: "The sword must be handled in love and truth, not for personal retaliation."
  }
];
