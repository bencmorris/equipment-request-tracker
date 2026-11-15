/* Equipment Request Tracker
 * No login, no server, no database. Requests live in memory and are
 * persisted to the browser's localStorage so they survive a page reload.
 */

(function () {
  "use strict";

  var STORAGE_KEY = "equipment-requests";
  var PRIORITIES = ["High", "Medium", "Low"];

  // Seed data used the first time the app runs (nothing in storage yet).
  var SEED_REQUESTS = [
    { id: 1, item: "Projector bulb", requester: "Dana Lee", priority: "High" },
    { id: 2, item: "Standing desk", requester: "Sam Ortiz", priority: "Low" },
    { id: 3, item: "Laptop dock", requester: "Priya Nair", priority: "Medium" },
    { id: 4, item: "Safety goggles (x12)", requester: "Marco Reyes", priority: "High" },
    { id: 5, item: "Label printer", requester: "Jo Kim", priority: "Medium" },
    { id: 6, item: "Desk chair", requester: "Avery Tran", priority: "Low" }
  ];

  // ---- State ----------------------------------------------------------------
  var requests = loadRequests();
  var activeFilter = "All"; // Exercise 6 feature: current priority filter.

  // ---- Elements -------------------------------------------------------------
  var form = document.getElementById("request-form");
  var listEl = document.getElementById("request-list");
  var countEl = document.getElementById("result-count");
  var emptyEl = document.getElementById("empty-state");
  var filterEl = document.getElementById("priority-filter");

  // ---- Persistence ----------------------------------------------------------
  function loadRequests() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        var parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      // Storage unavailable or corrupt: fall back to seed data in memory.
    }
    return SEED_REQUESTS.slice();
  }

  function saveRequests() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch (e) {
      // If storage is unavailable the app still works for this session.
    }
  }

  function nextId() {
    return requests.reduce(function (max, r) {
      return r.id > max ? r.id : max;
    }, 0) + 1;
  }

  // ---- Rendering ------------------------------------------------------------
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Exercise 6 feature: return the requests that match the active filter.
  // Non-destructive — this reads `requests` and never changes it.
  function getVisibleRequests() {
    if (activeFilter === "All") return requests;
    return requests.filter(function (r) {
      return r.priority === activeFilter;
    });
  }

  function render() {
    var visible = getVisibleRequests();

    listEl.innerHTML = visible
      .map(function (r) {
        return (
          '<li class="request-item">' +
          '<div class="request-main">' +
          '<span class="item-name">' + escapeHtml(r.item) + "</span>" +
          '<span class="requester">Requested by ' + escapeHtml(r.requester) + "</span>" +
          "</div>" +
          '<span class="badge ' + escapeHtml(r.priority) + '">' + escapeHtml(r.priority) + "</span>" +
          "</li>"
        );
      })
      .join("");

    // Result count reflects the filtered view against the full total.
    var label = activeFilter === "All" ? "" : " (" + activeFilter + ")";
    countEl.textContent =
      "Showing " + visible.length + " of " + requests.length + " requests" + label;

    // Empty state appears only when a filter hides everything; data is kept.
    emptyEl.hidden = visible.length !== 0;
  }

  // ---- Events ---------------------------------------------------------------
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var item = form.item.value.trim();
    var requester = form.requester.value.trim();
    var priority = form.priority.value;
    if (!item || !requester) return;
    if (PRIORITIES.indexOf(priority) === -1) priority = "Medium";

    requests.push({
      id: nextId(),
      item: item,
      requester: requester,
      priority: priority
    });
    saveRequests();
    render();
    form.reset();
    form.priority.value = "Medium";
    form.item.focus();
  });

  // Exercise 6 feature: priority filter controls.
  filterEl.addEventListener("click", function (e) {
    var btn = e.target.closest(".chip");
    if (!btn) return;

    activeFilter = btn.getAttribute("data-priority");

    // Update the pressed/active state on the chips.
    var chips = filterEl.querySelectorAll(".chip");
    for (var i = 0; i < chips.length; i++) {
      var isActive = chips[i] === btn;
      chips[i].classList.toggle("is-active", isActive);
      chips[i].setAttribute("aria-pressed", isActive ? "true" : "false");
    }

    render();
  });

  // ---- Init -----------------------------------------------------------------
  render();
})();
