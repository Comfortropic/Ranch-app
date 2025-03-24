// Global Variables and Temporary Comment Storage
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
    let database = event.target.result;
    if (!database.objectStoreNames.contains("calfEntries")) {
      let store = database.createObjectStore("calfEntries", { keyPath: "id" });
      store.createIndex("by_date", "date", { unique: false });
    }
    if (!database.objectStoreNames.contains("settings")) {
      database.createObjectStore("settings", { keyPath: "key" });
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
    if (!db) {
      alert("Database not ready; proceeding without duplicate check.");
      showScreen("screen-data-entry");
      return;
    }
    checkDuplicate(() => showScreen("screen-data-entry"));
  });
  document.getElementById("prev-from-data").addEventListener("click", () => {
    showScreen("screen-unique-id");
  });
  document.getElementById("next-from-data").addEventListener("click", () => {
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
  // Comment Functionality: Prompt user and store comment
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
  
  // Breed and Language Customization
  document.getElementById("save-breeds").addEventListener("click", saveBreeds);
  document.getElementById("save-language").addEventListener("click", saveLanguage);
  // JSON Export for Download Data
  document.getElementById("download-data").addEventListener("click", exportData);
  // Duplicate Check Button
  document.getElementById("check-duplicate").addEventListener("click", () => {
    checkDuplicate(() => alert("No duplicate found."));
  });
  
  // Digital Keyboard Focus for Numeric Inputs
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener("focus", () => {
      focusedInput = input;
      showDigitalKeyboard();
    });
    input.addEventListener("blur", () => {
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

//////////////////////////
// Duplicate Check Logic //
//////////////////////////
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
  if (!age || age
