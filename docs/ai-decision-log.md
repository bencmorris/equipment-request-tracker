# AI Decision Log — Exercise 6

**Entry: Overrode an AI design choice for the "no match" behavior.**

- **Choice modified:** How the feature behaves when a selected priority matches
  zero requests (a design/requirements choice, formalized in **AC6** and
  Functional Rule 5).
- **What the AI proposed:** During the clarifying step, the assistant's default
  leaned toward simply disabling a priority option when it had no requests, so a
  manager couldn't select an empty view at all.
- **What I decided instead:** Keep all four options always selectable and, when
  a filter matches nothing, show an explicit empty-state message that also tells
  the user their data is still saved ("Existing requests are still saved — choose
  All to see them again").
- **Why:** Disabling options hides information — a manager wouldn't know a
  priority level exists but is currently empty, and option buttons appearing and
  disappearing is disorienting. More importantly, the business requirement says
  the feature must *preserve all existing requests*. An explicit, reassuring
  empty state communicates that nothing was lost, which disabling the control
  does not. This made the behavior observable and testable, so it became
  acceptance criterion AC6 rather than a vague "handle empty gracefully."

This is the one requirement choice I changed from the AI's initial direction;
the rest of the specification followed from my answers to the clarifying
questions.
