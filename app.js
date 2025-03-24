// IndexedDB setup for offline data storage
const DB_NAME = "calfDataDB";
const DB_VERSION = 1;
let db;

document.addEventListener("DOMContentLoaded", () => {
  initDB();
  loadCustomizationSettings();
  setupEventListeners();
});

// Initialize IndexedDB
function initDB() {
  let request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = function (event) {
    let db = event.target.result;
    if (!db.objectStoreNames.contains("calfEntries")) {
      let store = db.createObjectStore("calfEntries", { keyPath: "id" });
      store.createIndex("by_date", "date", { unique: false });
    }
    if (!db.objectStoreNames.contains("settings")) {
      db.createObjectStore("settings", { keyPath: "key" });
    }
  };

  request.onsuccess = function (event) {
    db = event.target.result;
  };

  request.onerror = function () {
    console.error("Error opening IndexedDB.");
  };
}

// Save calf data entry, including a comment
function saveCalfEntry() {
  const id = document.getElementById("calf-id").value.trim();
  const weight = document.getElementById("calf-weight").value;
  const height = document.getElementById("calf-height").value;
  const age = document.getElementById("calf-age").value;
  const motherId = document.getElementById("mother-id").value;
  const breed = document.getElementById("calf-breed").value;
  const comment = document.getElementById("calf-comment").value;

  if (!id) {
    alert("Please enter a unique calf ID.");
    return;
  }

  let entry = { id, weight, height, age, motherId, breed, comment, date: new Date().toISOString() };

  let transaction = db.transaction("calfEntries", "readwrite");
  let store = transaction.objectStore("calfEntries");
  store.put(entry);

  transaction.oncomplete = () => {
    alert("Calf data saved successfully!");
    document.getElementById("calf-form").reset();
  };
}

// Load customization settings (breed list & language)
function loadCustomizationSettings() {
  let transaction = db.transaction("settings", "readonly");
  let store = transaction.objectStore("settings");

  // Load breeds
  let breedRequest = store.get("breeds");
  breedRequest.onsuccess = function () {
    let breeds = breedRequest.result ? breedRequest.result.value : ["Angus", "Hereford", "Charolais"];
    populateBreedDropdown(breeds);
  };

  // Load language
  let langRequest = store.get("language");
  langRequest.onsuccess = function () {
    let lang = langRequest.result ? langRequest.result.value : "English";
    document.getElementById("language-selector").value = lang;
  };
}

// Save breed customization from the custom-breeds field
function saveBreeds() {
  let newBreeds = document.getElementById("custom-breeds").value.split(",").map(b => b.trim());
  let transaction = db.transaction("settings", "readwrite");
  let store = transaction.objectStore("settings");
  store.put({ key: "breeds", value: newBreeds });

  transaction.oncomplete = () => {
    alert("Breed list updated!");
    populateBreedDropdown(newBreeds);
  };
}

// Populate breed dropdown with the breed list
function populateBreedDropdown(breeds) {
  let dropdown = document.getElementById("calf-breed");
  dropdown.innerHTML = breeds.map(breed => `<option value="${breed}">${breed}</option>`).join("");
}

// Save language selection from the language-selector field
function saveLanguage() {
  let language = document.getElementById("language-selector").value;
  let transaction = db.transaction("settings", "readwrite");
  let store = transaction.objectStore("settings");
  store.put({ key: "language", value: language });

  transaction.oncomplete = () => {
    alert(`Language set to ${language}`);
  };
}

// Event listeners for saving calf data and customization settings
function setupEventListeners() {
  document.getElementById("save-calf").addEventListener("click", saveCalfEntry);
  document.getElementById("save-breeds").addEventListener("click", saveBreeds);
  document.getElementById("save-language").addEventListener("click", saveLanguage);
}
