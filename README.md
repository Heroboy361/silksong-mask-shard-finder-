# silksong-mask-shard-finder

Eine kleine, rein clientseitige Webapp: Spielstand (`user#.dat`) von
**Hollow Knight: Silksong** hochladen, und sofort in einer Tabelle sehen,
welche der 20 Maskenscherben (Mask Shards) bereits gefunden wurden — inklusive
Link zur passenden Stelle auf der interaktiven [MapGenie](https://mapgenie.io/hollow-knight-silksong)-Karte
für alle noch fehlenden.

Die Datei wird **nie hochgeladen** — alles (Entschlüsselung + Auswertung)
läuft direkt im Browser via JavaScript.

## Nutzung

1. Seite öffnen (siehe GitHub Pages Link nach dem Deploy).
2. Spielstand-Datei per Drag&Drop reinziehen oder auswählen. Typischer Pfad
   unter Windows/Steam:
   `%userprofile%\AppData\LocalLow\Team Cherry\Hollow Knight Silksong\user1.dat`
3. Tabelle zeigt Fundstatus (✔/✘) und "View Map"-Link pro Location.

## Deploy

Automatisch via `.github/workflows/deploy.yml` (GitHub Actions →
GitHub Pages) bei jedem Push auf `main`. Einmalig in den Repo-Settings unter
**Settings → Pages → Source** auf **GitHub Actions** stellen.

## Technische Hinweise

- Speicherformat-Entschlüsselung (C#-Header strippen, Base64, AES-256-ECB
  mit PKCS7-Padding, fester Schlüssel `UKu52ePUBwetZ9wNX88o54dnfKRu0T1l`)
  basiert auf öffentlich dokumentiertem Reverse-Engineering des
  Silksong-Speicherformats (identisch zu Hollow Knight).
- Die 20 Location-Einträge (`data/mask-shards.js`) referenzieren pro Eintrag,
  welches Save-Feld geprüft wird (`playerData`-Flag, szenengebundenes
  Bool/Int-Item, oder Quest-Completion-Eintrag).
- Die 4 quest-basierten Shards (#10, #18, #19, #20) werden über
  `playerData.QuestCompletionData` gematcht — sollte ein Name nicht exakt
  stimmen, einfach in `data/mask-shards.js` den `detect.flag`-Wert anpassen.
- Die "View Map"-Links springen per `?locationIds=<markerId>` direkt zum
  jeweiligen Pin auf der MapGenie-Pharloom-Karte. Zusätzlich gibt es einen
  Sammel-Link, der alle noch fehlenden Shards gleichzeitig auf der Karte
  markiert. Die Marker-IDs stammen aus dem öffentlichen
  silksong-completion-analyzer-Projekt.
