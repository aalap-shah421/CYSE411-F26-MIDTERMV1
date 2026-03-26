// CYSE 411 Exam Application
// WARNING: This code contains security vulnerabilities.
// Students must repair the implementation.

const loadBtn = document.getElementById("loadBtn");
const saveBtn = document.getElementById("saveSession");
const loadSessionBtn = document.getElementById("loadSession");

loadBtn.addEventListener("click", loadProfile);
saveBtn.addEventListener("click", saveSession);
loadSessionBtn.addEventListener("click", loadSession);

let currentProfile = null;

// ---- Helper: show safe notification in page (not alert) ----
function showMessage(msg) {
  // Fallback if container missing
  const container = document.getElementById("message");
  if (!container) {
    alert(msg);
    return;
  }
  container.textContent = msg;
}

/* -------------------------
JSON validation helpers
-------------------------- */

function isValidProfile(obj) {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  // Required field: username (string)
  if (typeof obj.username !== "string" || obj.username.trim() === "") {
    return false;
  }

  // Required field: notifications (array of strings)
  if (!Array.isArray(obj.notifications)) {
    return false;
  }
  for (const n of obj.notifications) {
    if (typeof n !== "string") {
      return false;
    }
  }

  // Ignore unexpected fields by not relying on them anywhere
  return true;
}

/* -------------------------
Load Profile
-------------------------- */

function loadProfile() {
  const text = document.getElementById("profileInput").value;

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    currentProfile = null;
    showMessage("Invalid JSON: unable to parse profile.");
    return; // Fail safely for malformed JSON
  }

  if (!isValidProfile(parsed)) {
    currentProfile = null;
    showMessage("Invalid profile structure.");
    return; // Fail safely for invalid or unexpected structure
  }

  // Use only validated object
  currentProfile = {
    username: parsed.username,
    notifications: parsed.notifications.slice()
  };

  renderProfile(currentProfile);
}

/* -------------------------
Render Profile
-------------------------- */

function renderProfile(profile) {
  // Extra guard in case function is called with bad data
  if (!isValidProfile(profile)) {
    showMessage("Cannot render invalid profile.");
    return;
  }

  const usernameEl = document.getElementById("username");
  if (usernameEl) {
    // Render as text, never HTML
    usernameEl.textContent = profile.username;
  }

  const list = document.getElementById("notifications");
  if (!list) {
    return;
  }
  list.innerHTML = "";

  for (let n of profile.notifications) {
    const li = document.createElement("li");
    // Render notification as text, never HTML, to prevent script execution
    li.textContent = n;
    list.appendChild(li);
  }
}

/* -------------------------
Browser Storage
-------------------------- */

function saveSession() {
  // Only store minimal, validated profile data
  if (!currentProfile || !isValidProfile(currentProfile)) {
    showMessage("No valid profile to save.");
    return;
  }

  const safeProfile = {
    username: currentProfile.username,
    notifications: currentProfile.notifications.slice()
  };

  try {
    localStorage.setItem("profile", JSON.stringify(safeProfile));
    showMessage("Session saved.");
  } catch (e) {
    showMessage("Unable to save session.");
  }
}

function loadSession() {
  let stored;
  try {
    stored = localStorage.getItem("profile");
  } catch (e) {
    showMessage("Unable to access stored session.");
    return;
  }

  if (!stored) {
    showMessage("No saved session found.");
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(stored);
  } catch (e) {
    showMessage("Stored session is corrupted (invalid JSON).");
    // Optionally clear corrupted data
    try {
      localStorage.removeItem("profile");
    } catch (_) {}
    return;
  }

  if (!isValidProfile(parsed)) {
    showMessage("Stored session is invalid.");
    // Optionally clear invalid data
    try {
      localStorage.removeItem("profile");
    } catch (_) {}
    return;
  }

  currentProfile = {
    username: parsed.username,
    notifications: parsed.notifications.slice()
  };

  renderProfile(currentProfile);
}
