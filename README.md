# silksong-mask-shard-finder

Eine kleine, rein clientseitige Webapp: Spielstand (`user#.dat`) von
**Hollow Knight: Silksong** hochladen, und sofort in Tabellen sehen, welche
Sammelobjekte bereits gefunden wurden — mit Umschalter zwischen drei
Kategorien:

- **Mask Shards** (20) – Maskenscherben (mehr max. Leben)
- **Lost Fleas** (30) – die zu rettenden Flöhe
- **Spool Fragments** (18) – Fragmente, die deine Seiden-/Spulenkapazität erhöhen

Zu jedem noch fehlenden Objekt gibt es einen Link zur passenden Stelle auf der
interaktiven [MapGenie](https://mapgenie.io/hollow-knight-silksong)-Karte.

Die Datei wird **nie hochgeladen** — alles (Entschlüsselung + Auswertung)
läuft direkt im Browser via JavaScript.

## Nutzung

1. Seite öffnen (siehe GitHub Pages Link nach dem Deploy).
2. Spielstand-Datei per Drag&Drop reinziehen oder auswählen. Typischer Pfad
   unter Windows/Steam:
   `%userprofile%\AppData\LocalLow\Team Cherry\Hollow Knight Silksong\user1.dat`
3. Oben die Kategorie wählen (Mask Shards / Lost Fleas / Spool Fragments).
   Die Tabelle zeigt Fundstatus (✔/✘) und "View Map"-Link pro Objekt.

## Deploy

Automatisch via `.github/workflows/deploy.yml` (GitHub Actions →
GitHub Pages) bei jedem Push auf `main`. Einmalig in den Repo-Settings unter
**Settings → Pages → Source** auf **GitHub Actions** stellen.

## Technische Hinweise

- Speicherformat-Entschlüsselung (C#-Header strippen, Base64, AES-256-ECB
  mit PKCS7-Padding, fester Schlüssel `UKu52ePUBwetZ9wNX88o54dnfKRu0T1l`)
  basiert auf öffentlich dokumentiertem Reverse-Engineering des
  Silksong-Speicherformats (identisch zu Hollow Knight).
- Die Objektdaten liegen pro Kategorie in eigenen Dateien
  (`data/mask-shards.js`, `data/fleas.js`, `data/spool-fragments.js`). Jeder
  Eintrag referenziert, welches Save-Feld geprüft wird:
  - `{ type: "flag" }` → `playerData[flag] === true`
  - `{ type: "sceneBool", scene, flag }` → szenengebundenes Bool/Int-Item
  - `{ type: "quest", flag }` → `playerData.QuestCompletionData` mit `IsCompleted`
- Stimmt bei einem Objekt der Fundstatus mal nicht, lässt sich der
  `detect`-Wert in der jeweiligen Datendatei mit einer Zeile korrigieren.
- Die "View Map"-Links springen per `?locationIds=<markerId>` direkt zum
  jeweiligen Pin auf der MapGenie-Pharloom-Karte. Zusätzlich gibt es einen
  Sammel-Link, der alle noch fehlenden Objekte der aktiven Kategorie
  gleichzeitig auf der Karte markiert.
- Save-Flag-Zuordnung und MapGenie-Marker-IDs stammen aus den öffentlichen
  Projekten `langstonstewart/silksong-completion-analyzer` (Mask Shards,
  Fleas, Spool Fragments) und `mikkerlo/silksong-flea`.
