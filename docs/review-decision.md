# Review Decision — Exercise 7

After running the `requirements-reviewer` Skill (see
`docs/requirements-review.md`), I evaluated the findings rather than accepting
them all. I did not treat every finding as correct.

## Most important finding

> **AC6 empty-state behavior is unverified in the repo.** The feature's most
> important acceptance criterion — that filtering never loses data, including
> when a filter matches nothing — is not demonstrated by the shipped seed data
> (every priority is populated and there is no delete action) or by any
> automated test.

## Decision: **Accept (and respond)**

I accept this finding. The evidence supports it:

- The seed in `app.js` (`SEED_REQUESTS`) contains 2 High, 2 Medium, and 2 Low
  requests, and the app has no delete action, so a grader using the app as
  shipped can never make the list empty under a priority filter.
- The spec's Verification Results were recorded as **manual** steps, so there is
  no committed evidence protecting AC6 from regression.

I did **not** accept the finding's implied suggestion to also "disable empty
priority options," because that conflicts with the AI Decision Log choice to
keep all options selectable and show a reassuring empty state. So this is an
accept-with-modification of the *remedy*, not of the behavior.

## Response (what I changed)

Added an automated test, `tests/priority-filter.test.js`, that:

1. Seeds a single-priority request set, selects a priority with no matches,
   asserts the empty-state message appears, then selects **All** and asserts
   every request returns — directly exercising **AC6** and proving no data loss.
2. Also covers **AC1–AC5** and **AC7** so the full acceptance set is protected
   from regression.

I also updated the spec's Verification Results to reference the automated test
alongside the manual steps.

## Finding I did NOT act on (rejected, with explanation preserved here)

The review listed input escaping and guarded storage parsing as informational.
It did not ask for changes, and I made none — removing or "simplifying" them
would reintroduce risk. Preserving this note so the reasoning is visible in the
pull request.
