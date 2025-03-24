// Global variables and temporary storage for comments
const DB_NAME = "calfDataDB";
const DB_VERSION = 1;
let db;
let tempComments = {
  unique: "",
  data: "",
  multipleChoice: ""
};
let focusedInput = null; // for digital keyboard

document.addEventListener("DOMContentLoaded", () => {
  initDB();
  loadCustomizationSettings();
  setupScreenNavigation();
  setupEventListeners();
  setupDigitalKeyboard();
  window.addEventListener("online", syncData);
});

/////////////////////
// IndexedDB Setup //
/////////////////////
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

/////////////////////////////
// Screen Navigation Logic //
/////////////////////////////
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

function setupScreenNavigation() {
  document.getElementById("next-from-unique").addEventListener("click", () => {
    // First check for duplicates before moving on
    checkDuplicate(() => showScreen("screen-data-entry"));
  });
  document.getElementById("prev-from-data").addEventListener("click", () => {
    showScreen("screen-unique-id");
  });
  document.getElementById("next-from-data").addEventListener("click", () => {
    // Basic validation for data entry screen
    if (validateDataEntry()) {
      showScreen("screen-multiple-choice");
    }
  });
  document.getElementById("prev-from-mc").addEventListener("click", () => {
    showScreen("screen-data-entry");
  });
  document.getElementById("next-from-mc").addEventListener("click", () => {
    showScreen("screen-customization");
  });
  document.getElementById("prev-from-custom").addEventListener("click", () => {
    showScreen("screen-multiple-choice");
  });
}

////////////////////////////
// Event Listeners Setup  //
////////////////////////////
function setupEventListeners() {
  // Comment functionality: prompt user and store comment
  document.getElementById("comment-unique").addEventListener("click", () => {
    const comment = prompt("Enter comment for Unique ID Screen:");
    if (comment) {
      tempComments.unique = comment;
      alert("Comment saved.");
    }
  });
  document.getElementById("comment-data").addEventListener("click", () => {
    const comment = prompt("Enter comment for Data Entry Screen:");
    if (comment) {
      tempComments.data = comment;
      alert("Comment saved.");
    }
  });
  document.getElementById("comment-mc").addEventListener("click", () => {
    const comment = prompt("Enter comment for Multiple Choice Screen:");
    if (comment) {
      tempComments.multipleChoice = comment;
      alert("Comment saved.");
    }
  });
  // Breed and Language customization
  document.getElementById("save-breeds").addEventListener("click", saveBreeds);
  document.getElementById("save-language").addEventListener("click", saveLanguage);
  // JSON Export button for Download Data
  document.getElementById("download-data").addEventListener("click", exportData);
  // Duplicate check button
  document.getElementById("check-duplicate").addEventListener("click", () => {
    checkDuplicate(() => alert("No duplicate found."));
  });
  
  // Set up focus listeners for digital keyboard on numeric inputs
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener("focus", () => {
      focusedInput = input;
      showDigitalKeyboard();
    });
    input.addEventListener("blur", () => {
      // Delay hiding to allow keyboard button click processing
      setTimeout(hideDigitalKeyboard, 100);
    });
  });
}

//////////////////////////
// Digital Keyboard Code //
//////////////////////////
function setupDigitalKeyboard() {
  const keys = document.querySelectorAll("#digital-keyboard .key");
  keys.forEach(key => {
    key.addEventListener("click", () => {
      if (!focusedInput) return;
      const keyVal = key.textContent;
      if (keyVal === "Del") {
        focusedInput.value = focusedInput.value.slice(0, -1);
      } else if (keyVal === "Enter") {
        hideDigitalKeyboard();
        focusedInput.blur();
      } else {
        focusedInput.value += keyVal;
      }
    });
  });
}

function showDigitalKeyboard() {
  document.getElementById("digital-keyboard").classList.remove("hidden");
}

function hideDigitalKeyboard() {
  document.getElementById("digital-keyboard").classList.add("hidden");
}

///////////////////////////
// Duplicate Check Logic //
///////////////////////////
function checkDuplicate(callback) {
  const id = document.getElementById("calf-id").value.trim();
  if (!id) {
    document.getElementById("error-unique").textContent = "Calf ID cannot be empty.";
    return;
  }
  let transaction = db.transaction("calfEntries", "readonly");
  let store = transaction.objectStore("calfEntries");
  let request = store.get(id);
  request.onsuccess = function () {
    if (request.result) {
      document.getElementById("error-unique").textContent = "Duplicate ID found!";
    } else {
      document.getElementById("error-unique").textContent = "";
      callback();
    }
  };
  request.onerror = function () {
    console.error("Error checking duplicate.");
  };
}

///////////////////////////////
// Data Entry Validation Code//
///////////////////////////////
function validateDataEntry() {
  let weight = document.getElementById("calf-weight").value;
  let height = document.getElementById("calf-height").value;
  let age = document.getElementById("calf-age").value;
  let motherId = document.getElementById("mother-id").value.trim();
  let errorMsg = "";
  
  if (!weight || weight <= 0) errorMsg += "Weight must be a positive number. ";
  if (!height || height <= 0) errorMsg += "Height must be a positive number. ";
  if (!age || age <= 0) errorMsg += "Age must be a positive number. ";
  if (!motherId) errorMsg += "Mother ID is required.";
  
  document.getElementById("error-data").textContent = errorMsg;
  return errorMsg === "";
}

/////////////////////////////
// Save Calf Data Function //
/////////////////////////////
function saveCalfEntry() {
  const id = document.getElementById("calf-id").value.trim();
  if (!id) {
    alert("Calf ID is required.");
    return;
  }
  // Gather all data from different screens
  const entry = {
    id,
    weight: document.getElementById("calf-weight").value,
    height: document.getElementById("calf-height").value,
    age: document.getElementById("calf-age").value,
    motherId: document.getElementById("mother-id").value,
    sex: document.getElementById("calf-sex").value,
    calvingEase: document.getElementById("calving-ease").value,
    breed: document.getElementById("calf-breed").value,
    comments: {
      unique: tempComments.unique,
      data: tempComments.data,
      multipleChoice: tempComments.multipleChoice
    },
    date: new Date().toISOString()
  };
  let transaction = db.transaction("calfEntries", "readwrite");
  let store = transaction.objectStore("calfEntries");
  store.put(entry);
  transaction.oncomplete = () => {
    alert("Calf data saved successfully!");
  };
}

//////////////////////////////
// Customization Functions  //
//////////////////////////////
function loadCustomizationSettings() {
  let transaction = db.transaction("settings", "readonly");
  let store = transaction.objectStore("settings");

  let breedRequest = store.get("breeds");
  breedRequest.onsuccess = function () {
    let breeds = breedRequest.result ? breedRequest.result.value : ["Angus", "Hereford", "Charolais"];
    populateBreedDropdown(breeds);
  };

  let langRequest = store.get("language");
  langRequest.onsuccess = function () {
    let lang = langRequest.result ? langRequest.result.value : "English";
    document.getElementById("language-selector").value = lang;
  };
}

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

function populateBreedDropdown(breeds) {
  let dropdown = document.getElementById("calf-breed");
  dropdown.innerHTML = breeds.map(breed => `<option value="${breed}">${breed}</option>`).join("");
}

function saveLanguage() {
  let language = document.getElementById("language-selector").value;
  let transaction = db.transaction("settings", "readwrite");
  let store = transaction.objectStore("settings");
  store.put({ key: "language", value: language });
  transaction.oncomplete = () => {
    alert(`Language set to ${language}`);
  };
}

//////////////////////////
// Offline Sync Function//
//////////////////////////
function syncData() {
  console.log("Network online. Attempting to sync data...");
  // For each entry in IndexedDB, send to server (simulate with a log)
  let transaction = db.transaction("calfEntries", "readonly");
  let store = transaction.objectStore("calfEntries");
  store.openCursor().onsuccess = function (event) {
    let cursor = event.target.result;
    if (cursor) {
      // Simulate sync - in a real app, you'd use fetch() to send data
      console.log("Syncing entry:", cursor.value);
      cursor.continue();
    } else {
      console.log("All entries checked for sync.");
    }
  };
}

/////////////////////////////
// JSON Export Functionality//
/////////////////////////////
function exportData() {
  let transaction = db.transaction("calfEntries", "readonly");
  let store = transaction.objectStore("calfEntries");
  let allData = [];
  store.openCursor().onsuccess = function (event) {
    let cursor = event.target.result;
    if (cursor) {
      allData.push(cursor.value);
      cursor.continue();
    } else {
      let dataStr = JSON.stringify(allData, null, 2);
      let blob = new Blob([dataStr], { type: "application/json" });
      let url = URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = url;
      a.download = "calf_data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
}
