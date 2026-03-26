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
