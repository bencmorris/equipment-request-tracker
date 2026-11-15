# Requirements Review — Priority Filter

Produced by the `requirements-reviewer` Skill.

**Invocation:** `$requirements-reviewer Review the priority-filter feature against docs/priority-filter-spec.md. Do not change files.`

**Reviewed:** `docs/priority-filter-spec.md` against `index.html`, `styles.css`,
and `app.js`. No files were changed by the review.

## Summary

The implementation meets all seven acceptance criteria in behavior, stays within
the stated constraints, and adds no unsupported behavior. The main weakness is
evidence quality: verification is manual only, and the AC6 empty-state path
cannot be reached through the UI with the default seed data, so the most
important acceptance criterion is not demonstrated by anything that ships in the
repository.

## Satisfied acceptance criteria

- **AC1 — Default view.** `activeFilter` is initialized to `"All"` and the
  "All" chip carries `is-active` in `index.html`; `render()` runs on load.
  Evidence: `app.js` `var activeFilter = "All";` and the initial `render()` call.
- **AC2 — Filter to one priority.** `getVisibleRequests()` returns
  `requests.filter(r => r.priority === activeFilter)` for a non-"All" filter.
  Evidence: `app.js` `getVisibleRequests()`.
- **AC3 — Reversible.** When `activeFilter === "All"`, `getVisibleRequests()`
  returns the full `requests` array unchanged, so all requests return.
  Evidence: `app.js` `if (activeFilter === "All") return requests;`.
- **AC4 — Active indicator.** The click handler toggles `is-active` and
  `aria-pressed` on exactly the clicked chip. Evidence: `app.js` filter click
  handler loop over `.chip`.
- **AC5 — Accurate count.** `countEl.textContent` is built from
  `visible.length` and `requests.length` with the active label. Evidence:
  `app.js` `"Showing " + visible.length + " of " + requests.length + ...`.
- **AC6 — Empty state without data loss.** `emptyEl.hidden = visible.length !== 0;`
  and filtering never mutates `requests`. Evidence: `app.js` `render()`.
  (See Gaps: reachability.)
- **AC7 — Non-destructive add.** The submit handler pushes to `requests`,
  persists, and re-renders; filtering is a read-only view. Evidence: `app.js`
  form submit handler and `getVisibleRequests()`.

## Gaps

1. **AC6 is not observable with the shipped seed data.** The seed in `app.js`
   contains at least one request of every priority (2 High, 2 Medium, 2 Low),
   and the app has no delete action. A reviewer cannot reach the empty state by
   using the UI as shipped — it only appears when storage holds requests of
   *some* priorities but not others. The criterion is correct and the code is
   correct, but nothing in the repo demonstrates it. (Spec AC6; `app.js`
   `SEED_REQUESTS`.)
2. **No automated regression tests are committed.** The spec's Verification
   Results are recorded as manual steps. There is no test file in the repo, so
   the acceptance criteria are not protected against future regressions.
   (Spec "Verification Results"; repository has no `tests/`.)

## Unsupported behavior

None found. The code implements exactly the four-option filter, count, and empty
state described. It does not sort, search, add combined filters, or persist the
filter across reloads — all consistent with the spec's Out of Scope.

## Data or security concerns

- **Low risk — input is escaped.** User-entered `item` and `requester` are run
  through `escapeHtml()` before being inserted via `innerHTML`, which prevents
  stored-input HTML/script injection. Evidence: `app.js` `escapeHtml()` and its
  use in `render()`. This is a strength, noted so it is not later removed.
- **Low risk — storage parsing is guarded.** `loadRequests()` wraps
  `JSON.parse` in try/catch and falls back to seed data, so corrupt
  `localStorage` will not break the app. Evidence: `app.js` `loadRequests()`.
- No server or database is used, so there is no network or injection surface
  beyond the browser, consistent with the Constraints.

## Tests still needed

- An automated test for **AC6** that seeds a single-priority request set, selects
  an empty priority, asserts the empty state shows, then selects **All** and
  asserts every request returns (proving no data loss).
- Automated coverage for **AC1–AC5** and **AC7** so the criteria are protected
  from regression.

## Prioritized findings (most important first)

1. **AC6 empty-state behavior is unverified in the repo** — the most important
   acceptance criterion (no data loss) is not demonstrated by shipped data or any
   test.
2. **No automated regression tests** for the acceptance criteria.
3. (Informational) Input escaping and guarded storage parsing are present and
   should be preserved.
