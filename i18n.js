const TRANSLATIONS = {
  de: {
    subtitle:
      "Lade deinen Hollow Knight: Silksong Spielstand hoch und sieh sofort, welche Maskenscherben (Mask Shards), Flöhe (Lost Fleas) und Spulenfragmente (Spool Fragments) du schon gefunden hast — mit direktem Link zur passenden Stelle auf der MapGenie-Karte.",
    fileInfoHeading: "Welche Datei muss ich hochladen?",
    fileInfoP1Html:
      "Deine Silksong-Spielstanddatei heißt normalerweise <strong>user1.dat</strong> (bei mehreren Spielständen ggf. <strong>user2.dat</strong>, <strong>user3.dat</strong>, …) und liegt unter Windows/Steam hier:",
    fileInfoHintHtml:
      "Tipp: <kbd>Windows</kbd> + <kbd>R</kbd> drücken, obigen Pfad einfügen und Enter drücken — dann öffnet sich der Ordner direkt. Lade genau diese <strong>.dat</strong>-Datei unten hoch (kein Umbenennen, kein Entpacken nötig). Die Datei verlässt deinen Browser nie — die gesamte Auswertung läuft lokal auf deinem Gerät.",
    dropzoneHtml:
      "<strong>Spielstand (user1.dat) hierher ziehen</strong> oder klicken zum Auswählen",
    missingMapLink: "Alle fehlenden auf der Karte zeigen",
    tableHeaders: {
      num: "#",
      act: "Akt",
      area: "Gebiet",
      location: "Fundort",
      status: "Status",
      map: "Karte",
    },
    statusFound: "✔ Gefunden",
    statusMissing: "✘ Nicht gefunden",
    mapLink: "Karte zeigen",
    summary: (found, total, label) => `${found} / ${total} ${label} gefunden`,
    categories: {
      "mask-shards": "Maskenscherben",
      fleas: "Flöhe",
      "spool-fragments": "Spulenfragmente",
    },
    footerHtml:
      'Inoffizielles Fan-Projekt, nicht von Team Cherry. Standortdaten aus öffentlichen Silksong-Guides. Karten-Links öffnen <a href="https://mapgenie.io/hollow-knight-silksong" target="_blank" rel="noopener noreferrer">MapGenie</a>.',
    errorMessage:
      "Die Spielstanddatei konnte nicht gelesen werden. Stelle sicher, dass du eine Silksong user#.dat-Datei (oder deren entschlüsseltes JSON) ausgewählt hast, und versuch es erneut.",
  },
  en: {
    subtitle:
      "Upload your Hollow Knight: Silksong save file and instantly see which Mask Shards, Lost Fleas, and Spool Fragments you've already found — with a direct link to the right spot on the MapGenie map.",
    fileInfoHeading: "Which file do I need to upload?",
    fileInfoP1Html:
      "Your Silksong save file is usually called <strong>user1.dat</strong> (or <strong>user2.dat</strong>, <strong>user3.dat</strong>, … if you have multiple saves) and lives here on Windows/Steam:",
    fileInfoHintHtml:
      "Tip: press <kbd>Windows</kbd> + <kbd>R</kbd>, paste the path above, and hit Enter — that opens the folder directly. Upload that exact <strong>.dat</strong> file below (no renaming, no unzipping needed). The file never leaves your browser — everything runs locally on your device.",
    dropzoneHtml:
      "<strong>Drag your save (user1.dat) here</strong> or click to choose a file",
    missingMapLink: "Show all missing on the map",
    tableHeaders: {
      num: "#",
      act: "Act",
      area: "Area",
      location: "Location",
      status: "Status",
      map: "Map",
    },
    statusFound: "✔ Found",
    statusMissing: "✘ Not Found",
    mapLink: "View Map",
    summary: (found, total, label) => `${found} / ${total} ${label} found`,
    categories: {
      "mask-shards": "Mask Shards",
      fleas: "Lost Fleas",
      "spool-fragments": "Spool Fragments",
    },
    footerHtml:
      'Fan-made tool, not affiliated with Team Cherry. Location data sourced from public Silksong completion guides. Map links open <a href="https://mapgenie.io/hollow-knight-silksong" target="_blank" rel="noopener noreferrer">MapGenie</a>.',
    errorMessage:
      "Could not read this save file. Make sure you selected a Silksong user#.dat file (or its decrypted JSON) and try again.",
  },
};

const LANG_STORAGE_KEY = "silksong-tracker-lang";

function getLang() {
  return localStorage.getItem(LANG_STORAGE_KEY) === "en" ? "en" : "de";
}

function setLang(lang) {
  localStorage.setItem(LANG_STORAGE_KEY, lang === "en" ? "en" : "de");
}

function t() {
  return TRANSLATIONS[getLang()];
}
