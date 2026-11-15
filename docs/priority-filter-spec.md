# Priority Filter — Feature Specification

> Specification-driven development (Exercise 6). This document was written and
> reviewed **before** any feature code. The implementation follows this spec,
> not the original one-line business request.

## Clarifying questions and answers

Before writing the spec, the vague request was turned into testable detail by
answering five questions. Reasonable business decisions were made rather than
leaving them to the AI.

1. **Who uses this and what are they trying to do?**
   Managers reviewing the request list. They want to narrow the list to a
   single priority level so they can act on the most urgent requests first.
2. **What should the filter act on?**
   The `priority` value already stored on each request (`High`, `Medium`,
   `Low`). No new data is introduced.
3. **What options does the control offer?**
   Four choices: `All`, `High`, `Medium`, `Low`. `All` is the default on load.
4. **Is filtering destructive?**
   No. Filtering only changes what is *shown*. Every request stays stored, and
   switching back to `All` must bring them all back.
5. **What happens when a filter matches nothing?**
   Show a clear empty-state message that also reassures the user the data is
   still saved. No request is deleted.

## Goal

Let a manager quickly narrow the equipment-request list to one priority level
so urgent requests are easy to focus on, without changing or losing any
existing request data.

## User Need

> "I have a long list of requests and I only want to look at the urgent ones
> right now — but I don't want to lose track of everything else."

Managers need a fast, reversible way to view requests by priority. The current
list shows everything at once, which makes it slow to spot what needs
attention.

## Functional Rules

1. A priority filter control is shown above the request list with four options:
   **All**, **High**, **Medium**, **Low**.
2. On initial page load, the filter is set to **All** and every request is
   visible.
3. Selecting a priority shows only the requests whose `priority` equals the
   selected value; all others are hidden (not deleted).
4. Selecting **All** shows every stored request again.
5. The filter control shows which option is currently active.
6. A result count shows how many requests are visible out of the total (for
   example, "Showing 2 of 6 requests (High)").
7. Filtering is purely a view operation. It never adds, edits, reorders, or
   removes stored request data.
8. Adding a new request while a filter is active saves the request normally; it
   appears in the list when its priority matches the active filter (or under
   **All**).

## Constraints

- Works with **no login and no database** — requests remain in memory and in
  the browser's `localStorage`, consistent with the existing app.
- **Preserves all existing requests.** No migration, deletion, or schema change.
- Uses the **existing priority field**; introduces no new request data.
- No new third-party libraries or build tooling; plain HTML/CSS/JS only.
- Existing behavior (adding requests, persistence) is unchanged.

## Acceptance Criteria

Each criterion describes behavior that can be observed and tested in the browser.

- **AC1 — Default view:** On first load, the filter shows **All** as active and
  every stored request is listed.
- **AC2 — Filter to one priority:** Clicking **High** shows only High-priority
  requests; Medium and Low requests are not shown.
- **AC3 — Reversible:** After filtering to any single priority, clicking **All**
  shows every request again, with none missing.
- **AC4 — Active indicator:** Exactly one filter option is marked active at a
  time, matching the current view.
- **AC5 — Accurate count:** The result count matches the number of visible
  requests and names the active filter (e.g. "Showing 2 of 6 requests (High)").
- **AC6 — Empty state without data loss:** Selecting a priority that matches no
  requests shows the empty-state message, and selecting **All** afterward still
  lists every request (nothing was deleted).
- **AC7 — Non-destructive add:** Adding a new request while a filter is active
  stores it; it is visible under **All** and under its own priority.

## Out of Scope

- Filtering by any field other than priority (requester, date, status).
- Sorting, searching, or multi-select / combined filters.
- Editing or deleting requests through the filter.
- Saving the selected filter across page reloads.
- Any login, server, or database work.

## Verification Results

Every criterion was exercised in a browser against the seeded request list
(6 requests: 2 High, 2 Medium, 2 Low). All passed.

| Criterion | Result | Notes |
|-----------|--------|-------|
| AC1 — Default view | **Pass** | On load, **All** is active and all 6 requests are listed. |
| AC2 — Filter to one priority | **Pass** | **High** shows only "Projector bulb" and "Safety goggles (x12)"; Medium/Low hidden. |
| AC3 — Reversible | **Pass** | After any single-priority filter, **All** restores all 6 requests. |
| AC4 — Active indicator | **Pass** | Exactly one chip is marked active, matching the current view. |
| AC5 — Accurate count | **Pass** | Count reads "Showing 2 of 6 requests (High)" and tracks the visible list. |
| AC6 — Empty state without data loss | **Pass** | Filtering a priority with no matches shows the empty-state message; **All** afterward still lists every request. |
| AC7 — Non-destructive add | **Pass** | A request added while **High** is active is saved and appears under both **High** and **All**. |

_How to reproduce:_ open `index.html` in a browser, then click each priority
chip and confirm the list, the active chip, and the count. To test AC6, filter
to a priority you have no requests for; to test AC7, filter to a priority and
add a new request of that priority. A screenshot of the feature (filtered to
**High**) is saved at `docs/feature-screenshot.png`.

_Automated tests:_ `tests/priority-filter.test.js` covers AC1–AC7 and is the
regression guard added in Exercise 7 in response to the requirements review
(`node tests/priority-filter.test.js`; result: 7 passed, 0 failed).
