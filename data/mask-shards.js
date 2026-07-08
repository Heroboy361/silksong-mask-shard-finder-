// Data for all 20 Mask Shard locations in Hollow Knight: Silksong.
//
// `detect` describes how to read the collected/not-collected state out of a
// decrypted save file:
//   - { type: "flag", flag: "SomeBool" }       -> playerData[flag] === true
//   - { type: "sceneBool", scene, flag }       -> scene-persistent bool/int
//                                                 keyed by (SceneName, ID)
//                                                 found anywhere in sceneData
//   - { type: "quest", flag }                  -> playerData.QuestCompletionData
//                                                 entry with Data.IsCompleted
//
// mapGenieId is the numeric marker id on MapGenie's Pharloom map; opening
// mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=<id> jumps
// straight to that pin. mapSearch is kept as a search-box fallback for any
// entry that ever loses its id.
const MASK_SHARDS = [
  {
    id: "mask-shard-1",
    mapGenieId: "477840",
    number: 1,
    act: 1,
    area: "Bone Bottom",
    name: "Bone Bottom – Pebb's Shop",
    description:
      "Bought from Pebb for 300 Rosaries. If not purchased before Act 3 begins, it moves to Grindle's shop in Blasted Steps for 320 Rosaries.",
    detect: { type: "flag", flag: "PurchasedBonebottomHeartPiece" },
    mapSearch: "Bone Bottom",
  },
  {
    id: "mask-shard-2",
    mapGenieId: "478091",
    number: 2,
    act: 1,
    area: "Wormways",
    name: "Wormways – Lower Passage",
    description:
      "In lower Wormways, accessed through Mosshome. Behind a breakable wall, just before the door requiring a Simple Key.",
    detect: { type: "sceneBool", scene: "Crawl_02", flag: "Heart Piece" },
    mapSearch: "Wormways",
  },
  {
    id: "mask-shard-3",
    mapGenieId: "477901",
    number: 3,
    act: 1,
    area: "The Marrow / Deep Docks",
    name: "The Marrow – Deep Docks Passage",
    description:
      "In a passageway between The Marrow and Deep Docks, accessed from The Marrow. Cling Grip recommended.",
    detect: { type: "sceneBool", scene: "Dock_08", flag: "Heart Piece" },
    mapSearch: "The Marrow",
  },
  {
    id: "mask-shard-4",
    mapGenieId: "477975",
    number: 4,
    act: 1,
    area: "Far Fields",
    name: "Far Fields – Above Seamstress's Home",
    description:
      "In the area above the Seamstress's home in Far Fields. Requires the Drifter's Cloak.",
    detect: { type: "sceneBool", scene: "Bone_East_20", flag: "Heart Piece" },
    mapSearch: "Far Fields",
  },
  {
    id: "mask-shard-5",
    mapGenieId: "478177",
    number: 5,
    act: 1,
    area: "Shellwood",
    name: "Shellwood – Platforming Challenge",
    description:
      "In the centre of Shellwood, at the end of a platforming challenge behind a breakable wall.",
    detect: { type: "sceneBool", scene: "Shellwood_14", flag: "Heart Piece" },
    mapSearch: "Shellwood",
  },
  {
    id: "mask-shard-6",
    mapGenieId: "478233",
    number: 6,
    act: 1,
    area: "Weavenest Atla",
    name: "Weavenest Atla – East Wall",
    description:
      "In east Weavenest Atla, behind a breakable wall. Requires Cling Grip.",
    detect: { type: "sceneBool", scene: "Weave_05b", flag: "Heart Piece" },
    mapSearch: "Weavenest Atla",
  },
  {
    id: "mask-shard-7",
    mapGenieId: "478879",
    number: 7,
    act: 2,
    area: "Songclave",
    name: "Songclave – Jubilana's Shop",
    description:
      "Sold by Jubilana in Songclave for 750 Rosaries after completing the Wandering Merchant wish.",
    detect: { type: "flag", flag: "MerchantEnclaveShellFragment" },
    mapSearch: "Songclave",
  },
  {
    id: "mask-shard-8",
    mapGenieId: "478615",
    number: 8,
    act: 2,
    area: "Cogwork Core",
    name: "Cogwork Core – West Gauntlet",
    description:
      "In west Cogwork Core, past an enemy gauntlet accessible after defeating the Cogwork Dancers.",
    detect: { type: "sceneBool", scene: "Song_09", flag: "Heart Piece" },
    mapSearch: "Cogwork Core",
  },
  {
    id: "mask-shard-9",
    mapGenieId: "478671",
    number: 9,
    act: 2,
    area: "Whispering Vaults",
    name: "Whispering Vaults – Box Puzzle",
    description:
      "Behind a moving box puzzle in central Whispering Vaults.",
    detect: { type: "sceneBool", scene: "Library_05", flag: "Heart Piece" },
    mapSearch: "Whispering Vaults",
  },
  {
    id: "mask-shard-10",
    mapGenieId: "478800",
    number: 10,
    act: 2,
    area: "Hunter's March / Songclave",
    name: "Savage Beastfly Grand Hunt Reward",
    description:
      "Reward for the Savage Beastfly wish: defeat the Fourth Chorus and Savage Beastfly in Hunter's March, then return to Songclave.",
    detect: { type: "quest", flag: "Beastfly Hunt" },
    mapSearch: "Hunter's March",
  },
  {
    id: "mask-shard-11",
    mapGenieId: "478841",
    number: 11,
    act: 2,
    area: "Far Fields",
    name: "Far Fields – East Bone Building",
    description:
      "Inside a bone building in east Far Fields. Requires Clawline and the Drifter's Cloak.",
    detect: {
      type: "sceneBool",
      scene: "Bone_East_LavaChallenge",
      flag: "Heart Piece (1)",
    },
    mapSearch: "Far Fields",
  },
  {
    id: "mask-shard-12",
    mapGenieId: "479038",
    number: 12,
    act: 2,
    area: "Mount Fay",
    name: "Mount Fay – Southwest of the Bench",
    description:
      "In southwest Mount Fay, west of the bench. Requires the Faydown Cloak.",
    detect: { type: "sceneBool", scene: "Peak_04c", flag: "Heart Piece" },
    mapSearch: "Mount Fay",
  },
  {
    id: "mask-shard-13",
    mapGenieId: "479001",
    number: 13,
    act: 2,
    area: "The Slab",
    name: "The Slab – Northeast Cell",
    description:
      "In the northeast part of The Slab. Requires the Key of Apostate and the Faydown Cloak (the challenge can be skipped with Silk Soar).",
    detect: { type: "sceneBool", scene: "Slab_17", flag: "Heart Piece" },
    mapSearch: "The Slab",
  },
  {
    id: "mask-shard-14",
    mapGenieId: "478849",
    number: 14,
    act: 2,
    area: "Bilewater",
    name: "Bilewater – Slubberlug Hallway",
    description: "In east Bilewater, in a hallway filled with Slubberlugs.",
    detect: { type: "sceneBool", scene: "Shadow_13", flag: "Heart Piece" },
    mapSearch: "Bilewater",
  },
  {
    id: "mask-shard-15",
    mapGenieId: "479151",
    number: 15,
    act: 2,
    area: "Wisp Thicket",
    name: "Wisp Thicket – East Nook",
    description: "In east Wisp Thicket. Requires the Faydown Cloak.",
    detect: { type: "sceneBool", scene: "Wisp_07", flag: "Heart Piece" },
    mapSearch: "Wisp Thicket",
  },
  {
    id: "mask-shard-16",
    mapGenieId: "478498",
    number: 16,
    act: 2,
    area: "Blasted Steps",
    name: "Blasted Steps – West Challenge",
    description:
      "In west Blasted Steps. Requires Clawline and the Faydown Cloak (the challenge can be skipped with Silk Soar).",
    detect: { type: "sceneBool", scene: "Coral_19b", flag: "Heart Piece" },
    mapSearch: "Blasted Steps",
  },
  {
    id: "mask-shard-17",
    mapGenieId: "479460",
    number: 17,
    act: 3,
    area: "Brightvein",
    name: "Brightvein – Silk Soar Ledge",
    description: "In Brightvein. Requires Silk Soar.",
    detect: { type: "sceneBool", scene: "Peak_06", flag: "Heart Piece" },
    mapSearch: "Brightvein",
  },
  {
    id: "mask-shard-18",
    mapGenieId: "479194",
    number: 18,
    act: 3,
    area: "Far Fields",
    name: "Sprintmaster's Fastest in Pharloom Reward",
    description:
      "In east Far Fields. Reward from the Sprintmaster's Fastest in Pharloom wish.",
    detect: { type: "quest", flag: "Sprintmaster Race" },
    mapSearch: "Far Fields",
  },
  {
    id: "mask-shard-19",
    mapGenieId: "479449",
    number: 19,
    act: 3,
    area: "Bellhart",
    name: "Bellhart Wishwall – Dark Hearts Reward",
    description: "In the Bellhart Wishwall. Reward from the Dark Hearts wish.",
    detect: { type: "quest", flag: "Destroy Thread Cores" },
    mapSearch: "Bellhart",
  },
  {
    id: "mask-shard-20",
    mapGenieId: "479447",
    number: 20,
    act: 3,
    area: "Bellhart",
    name: "Bellhart Wishwall – The Hidden Hunter Reward",
    description:
      "In the Bellhart Wishwall. Reward from The Hidden Hunter wish.",
    detect: { type: "quest", flag: "Ant Trapper" },
    mapSearch: "Bellhart",
  },
];
