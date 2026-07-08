const AES_KEY = "UKu52ePUBwetZ9wNX88o54dnfKRu0T1l";
const CSHARP_HEADER = new Uint8Array([
  0, 1, 0, 0, 0, 255, 255, 255, 255, 1, 0, 0, 0, 0, 0, 0, 0, 6, 1, 0, 0, 0,
]);
const MAPGENIE_BASE_URL = "https://mapgenie.io/hollow-knight-silksong/maps/pharloom";

function normalize(value) {
  return String(value).trim().toLowerCase();
}

function normalizeKey(value) {
  return normalize(value).replace(/[^a-z0-9]+/g, "_");
}

// Strips the C# BinaryFormatter header/length-prefix/footer that wraps the
// base64 ciphertext inside a Silksong .dat save file.
function stripSaveEnvelope(bytes) {
  let offset = CSHARP_HEADER.length;

  let length = 0;
  let shift = 0;
  let lengthBytes = 0;
  for (let i = 0; i < 5 && offset + i < bytes.length; i++) {
    const byte = bytes[offset + i];
    length |= (byte & 0x7f) << shift;
    lengthBytes++;
    if ((byte & 0x80) === 0) break;
    shift += 7;
  }
  offset += lengthBytes;

  return bytes.slice(offset, bytes.length - 1);
}

function decodeSilksongSave(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  const base64Bytes = stripSaveEnvelope(bytes);
  const base64String = new TextDecoder("utf-8")
    .decode(base64Bytes)
    .replace(/[\r\n]/g, "")
    .trim();

  const encrypted = CryptoJS.enc.Base64.parse(base64String);
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: encrypted },
    CryptoJS.enc.Utf8.parse(AES_KEY),
    { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 },
  );

  const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
  return JSON.parse(jsonString);
}

// Recursively walks the save file for `{ SceneName, ID, Value }` triples
// (Silksong's scene-persistent bool/int items) and flattens them into
// flags[normalizedSceneName][normalizedId] = boolean.
function extractSceneFlags(root) {
  const flags = {};

  function mark(sceneName, id, value) {
    const scene = normalizeKey(sceneName);
    const key = normalizeKey(id);
    if (!flags[scene]) flags[scene] = {};
    flags[scene][key] = Boolean(value);
  }

  function walk(node) {
    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }
    if (node && typeof node === "object") {
      const { SceneName, ID, Value } = node;
      if (
        typeof SceneName === "string" &&
        typeof ID === "string" &&
        (typeof Value === "number" || typeof Value === "boolean")
      ) {
        mark(SceneName, ID, Value);
      }
      for (const value of Object.values(node)) walk(value);
    }
  }

  walk(root);
  return flags;
}

function findQuestEntry(playerData, flag) {
  const questData = playerData && playerData.QuestCompletionData;
  const savedData = questData && questData.savedData;
  if (!Array.isArray(savedData)) return undefined;
  return savedData.find((entry) => normalize(entry.Name) === normalize(flag));
}

function isItemCollected(saveData, sceneFlags, item) {
  const playerData = saveData.playerData || {};
  const { detect } = item;

  switch (detect.type) {
    case "flag":
      return playerData[detect.flag] === true;

    case "sceneBool": {
      const scene = sceneFlags[normalizeKey(detect.scene)];
      if (!scene) return false;
      return scene[normalizeKey(detect.flag)] === true;
    }

    case "quest": {
      const entry = findQuestEntry(playerData, detect.flag);
      return Boolean(entry && entry.Data && entry.Data.IsCompleted === true);
    }

    default:
      return false;
  }
}

function mapGenieUrl(item) {
  const url = new URL(MAPGENIE_BASE_URL);
  if (item.mapGenieId) {
    url.searchParams.set("locationIds", item.mapGenieId);
  } else if (item.mapSearch) {
    url.searchParams.set("search", item.mapSearch);
  }
  return url.toString();
}

function mapGenieMissingUrl(results) {
  const missingIds = results
    .filter((r) => !r.collected && r.item.mapGenieId)
    .map((r) => r.item.mapGenieId);
  if (missingIds.length === 0) return null;
  // Join with literal commas (not %2C) to match the URL format MapGenie uses.
  return `${MAPGENIE_BASE_URL}?locationIds=${missingIds.join(",")}`;
}

// The three collectible categories, each with its own dataset. Labels come
// from the active translation (see i18n.js) so they switch with the language.
const CATEGORIES = [
  { id: "mask-shards", items: MASK_SHARDS },
  { id: "fleas", items: FLEAS },
  { id: "spool-fragments", items: SPOOL_FRAGMENTS },
];

// Parsed save state, kept so switching category tabs re-renders without a
// re-upload.
let currentSaveData = null;
let currentSceneFlags = null;
let activeCategoryId = CATEGORIES[0].id;

function computeResults(category) {
  return category.items.map((item) => ({
    item,
    collected: isItemCollected(currentSaveData, currentSceneFlags, item),
  }));
}

function itemDescription(item) {
  const lang = getLang();
  return typeof item.description === "object"
    ? item.description[lang] || item.description.en
    : item.description;
}

function renderTable(results) {
  const strings = t();
  const tbody = document.querySelector("#shard-table tbody");
  tbody.innerHTML = "";

  for (const { item, collected } of results) {
    const tr = document.createElement("tr");
    tr.className = collected ? "found" : "missing";

    tr.innerHTML = `
      <td class="col-num">${item.number}</td>
      <td class="col-act">${strings.tableHeaders.act} ${item.act}</td>
      <td class="col-area">${item.area}</td>
      <td class="col-name">
        <div class="shard-name">${item.name}</div>
        <div class="shard-desc">${itemDescription(item)}</div>
      </td>
      <td class="col-status">
        <span class="status-badge ${collected ? "status-found" : "status-missing"}">
          ${collected ? strings.statusFound : strings.statusMissing}
        </span>
      </td>
      <td class="col-map">
        <a class="map-link" href="${mapGenieUrl(item)}" target="_blank" rel="noopener noreferrer">${strings.mapLink}</a>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

function renderSummary(results, category) {
  const strings = t();
  const found = results.filter((r) => r.collected).length;
  const total = results.length;
  document.querySelector("#summary").textContent = strings.summary(
    found,
    total,
    strings.categories[category.id],
  );
  document.querySelector("#progress-bar-fill").style.width =
    total === 0 ? "0%" : `${(found / total) * 100}%`;

  const missingLink = document.querySelector("#missing-map-link");
  missingLink.textContent = strings.missingMapLink;
  const missingUrl = mapGenieMissingUrl(results);
  if (missingUrl) {
    missingLink.href = missingUrl;
    missingLink.classList.remove("hidden");
  } else {
    missingLink.classList.add("hidden");
  }
}

function renderActiveCategory() {
  if (!currentSaveData) return;
  const category =
    CATEGORIES.find((c) => c.id === activeCategoryId) || CATEGORIES[0];
  const results = computeResults(category);
  renderSummary(results, category);
  renderTable(results);

  for (const button of document.querySelectorAll(".category-tab")) {
    button.classList.toggle("active", button.dataset.category === category.id);
  }
}

function renderCategoryTabs() {
  const strings = t();
  const container = document.querySelector("#category-tabs");
  container.innerHTML = "";
  for (const category of CATEGORIES) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-tab";
    button.dataset.category = category.id;
    button.textContent = strings.categories[category.id];
    button.addEventListener("click", () => {
      activeCategoryId = category.id;
      renderActiveCategory();
    });
    container.appendChild(button);
  }
}

function renderStaticText() {
  const strings = t();
  document.documentElement.lang = getLang();

  document.querySelector("#subtitle").textContent = strings.subtitle;
  document.querySelector("#file-info-heading").textContent = strings.fileInfoHeading;
  document.querySelector("#file-info-p1").innerHTML = strings.fileInfoP1Html;
  document.querySelector("#file-info-hint").innerHTML = strings.fileInfoHintHtml;
  document.querySelector("#dropzone-text").innerHTML = strings.dropzoneHtml;
  document.querySelector("#footer-text").innerHTML = strings.footerHtml;

  document.querySelector(".th-num").textContent = strings.tableHeaders.num;
  document.querySelector(".th-act").textContent = strings.tableHeaders.act;
  document.querySelector(".th-area").textContent = strings.tableHeaders.area;
  document.querySelector(".th-location").textContent = strings.tableHeaders.location;
  document.querySelector(".th-status").textContent = strings.tableHeaders.status;
  document.querySelector(".th-map").textContent = strings.tableHeaders.map;

  for (const button of document.querySelectorAll(".lang-btn")) {
    button.classList.toggle("active", button.dataset.lang === getLang());
  }
}

function applyLanguage() {
  renderStaticText();
  renderCategoryTabs();
  renderActiveCategory();
}

function showError(message) {
  const el = document.querySelector("#error-message");
  el.textContent = message;
  el.classList.toggle("hidden", !message);
}

async function handleFile(file) {
  showError("");
  try {
    const buffer = await file.arrayBuffer();
    const isJson = file.name.toLowerCase().endsWith(".json");

    let saveData;
    try {
      saveData = isJson
        ? JSON.parse(new TextDecoder("utf-8").decode(buffer))
        : decodeSilksongSave(buffer);
    } catch (primaryError) {
      // Fall back to the other format in case the extension is misleading.
      saveData = isJson
        ? decodeSilksongSave(buffer)
        : JSON.parse(new TextDecoder("utf-8").decode(buffer));
    }

    if (!saveData || typeof saveData.playerData !== "object") {
      throw new Error("This doesn't look like a Silksong save file.");
    }

    currentSaveData = saveData;
    currentSceneFlags = extractSceneFlags(saveData);

    renderActiveCategory();
    document.querySelector("#results").classList.remove("hidden");
  } catch (error) {
    console.error(error);
    showError(t().errorMessage);
    document.querySelector("#results").classList.add("hidden");
  }
}

function init() {
  const input = document.querySelector("#file-input");
  const dropzone = document.querySelector("#dropzone");

  applyLanguage();

  for (const button of document.querySelectorAll(".lang-btn")) {
    button.addEventListener("click", () => {
      setLang(button.dataset.lang);
      applyLanguage();
    });
  }

  input.addEventListener("change", () => {
    if (input.files[0]) handleFile(input.files[0]);
  });

  dropzone.addEventListener("click", () => input.click());

  dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropzone.classList.remove("dragover");
    const file = event.dataTransfer.files[0];
    if (file) handleFile(file);
  });
}

document.addEventListener("DOMContentLoaded", init);
