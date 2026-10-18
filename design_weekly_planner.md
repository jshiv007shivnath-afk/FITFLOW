# FitFlow — Weekly Workout Planner Design Specification

> **Scope:** Visual design specification for the Weekly Workout Planner feature only. This document defines the page, related UI states, responsive behavior, and motion principles. It is not an implementation plan or a replacement for FitFlow's global design system.

## 1. Design Goal

Design a polished, premium-feeling Weekly Workout Planner for FitFlow that helps users decide what to do each day before the week begins. The experience should feel clear, motivating, calm, and practical rather than crowded or overly gamified.

The primary user goal is simple: **plan the week once, then know what workout is scheduled for each day.**

## 2. Existing Product Design Takes Priority

Before designing this page, inspect the current FitFlow screens and existing global `design.md`.

- Reuse FitFlow's existing brand palette, typography, spacing scale, radii, elevation, icon style, buttons, form controls, and navigation patterns.
- Use the current app's light or dark theme; do not introduce a separate visual identity.
- Treat existing design tokens as authoritative. Do not invent replacement global tokens.
- Match the visual density and hierarchy of the established dashboard and workout screens.
- If any specification below conflicts with the current FitFlow design system, preserve the current system and adapt this page to it.
- Do not redesign unrelated pages or the application's global navigation.

## 3. Visual Direction

Aim for a modern fitness-product interface with strong hierarchy, precise spacing, legible workout information, and restrained visual emphasis.

The design should feel:
- **Focused:** the weekly schedule is the main event.
- **Motivating:** progress is visible but never guilt-driven.
- **Premium:** careful typography, consistent alignment, crisp surfaces, and purposeful details.
- **Efficient:** common actions such as editing a day or adding an exercise are easy to find.
- **Consistent:** the page clearly belongs to FitFlow.

Avoid generic AI-dashboard styling: no unnecessary floating gradient blobs, random accent colors, decorative charts without meaning, excessive glass effects, over-rounded cards everywhere, or oversized headings that waste useful space.

## 4. Page Structure

### 4.1 Main page header

Include:
- Page title: **Weekly Workout Planner**
- Short supporting line: **Plan your week. Focus on showing up.**
- Current week date range.
- A prominent primary action: **Create weekly plan** when no plan exists, or **Edit schedule** when one exists.
- A compact summary such as planned workout days and rest days.

Keep the header compact enough that the schedule remains visible without excessive scrolling. Use the same heading scale and primary-button treatment as other FitFlow pages.

### 4.2 Week navigation

Display Monday through Sunday in a clear weekly selector or seven-day overview.

Each day item should contain:
- Day abbreviation or short name.
- Calendar date.
- A clear selected state.
- A quiet indication when a workout is planned.
- Completion indication only when the workout is genuinely completed.
- A rest-day state that is distinct but not alarming.

The current date must be distinguishable from the selected day. Do not rely on color alone to communicate status; use labels, icons, shape, or other accessible visual cues as appropriate.

Desktop may use a horizontal seven-day strip or a balanced grid, depending on FitFlow's existing layout conventions. Mobile should use a compact horizontal day selector or similarly clear small-screen pattern without forcing the entire schedule into tiny cards.

### 4.3 Selected-day workout detail

Present the selected day's workout as the main content area.

Show:
- Workout name, such as **Upper Body** or **Full Body**.
- Estimated duration only when the data supports a useful estimate.
- Exercise count and meaningful summary information.
- An obvious **Edit workout** action.
- A clearly labeled rest-day state when the selected day is configured as rest.

Exercise rows should be easy to scan. Each row may include the exercise name, sets, reps, duration, or distance as applicable. Align numbers and units consistently. Avoid showing empty or irrelevant metadata.

Example exercise content:
- Push-ups — 3 sets × 12 reps
- Plank — 3 × 45 sec
- Squats — 3 sets × 15 reps

These are sample values for visual reference, not fixed defaults that every user must receive.

### 4.4 Weekly summary

Include a restrained summary of the plan, for example:
- Workout days planned.
- Rest days.
- Completed workouts for the current week.
- Remaining scheduled workouts.

Use progress indicators only when they communicate genuine data. Planned workouts must not appear completed merely because they are on the schedule. Avoid a large analytics dashboard inside this page; the weekly plan remains the central focus.

## 5. Create and Edit States

Design the exercise editor using FitFlow's existing interaction pattern, whether that is a modal, side drawer, bottom sheet, or dedicated route. Do not introduce a new interaction pattern without a clear usability reason.

The editor should visually support:
- Workout title.
- Adding an exercise.
- Exercise name.
- Appropriate target details such as sets, repetitions, duration, or distance.
- Reordering and removing exercises.
- Marking the day as a rest day.
- Saving or cancelling changes.

Use readable form labels and clear separation between repeated exercise items. Keep primary and secondary actions visually distinct. Destructive actions should not be styled like primary actions.

Provide an empty-day state that makes the next action obvious, such as **Add a workout** or **Mark as rest day**. Avoid making an empty day look like an error.

## 6. New-Week Choice Dialog

When the user needs to set up a new week, show a focused dialog or screen that feels consistent with FitFlow's existing modal patterns.

**Heading:** Ready for a new week?

**Description:** How would you like to plan your workouts this week?

Present two equally understandable choices:

### Repeat Last Week's Plan
Supporting text: *Keep the same exercises and targets for this week.*

### Create a New Schedule
Supporting text: *Build a different workout plan for this week.*

Design requirements:
- Make the two choices easy to compare at a glance.
- Use clear title, description, and selection feedback.
- Do not make either option look destructive.
- Provide a clear close, back, or defer action if supported by the established flow.
- Do not visually imply that a previous plan will be deleted.
- On narrow screens, stack the choices with comfortable tap targets.

This is a design requirement only; the application’s product logic determines when the dialog appears and how the decision is saved.

## 7. Essential UI States

Define visual treatments for the following states so the page looks complete, not just attractive in its ideal state.

### First-time / no saved plan
A friendly empty state with a concise explanation and one clear **Create weekly plan** action. Use existing FitFlow illustrations or icons if already available; do not add decorative imagery just to fill space.

### Loading
Use the loading pattern already established in FitFlow. Preserve the overall page geometry where practical to prevent sudden layout shifts.

### Save success
Show a brief, subtle confirmation consistent with existing success feedback. Do not interrupt the user with an unnecessary large modal.

### Save failure
Keep the user's entered information visible and show an actionable, readable error near the relevant action or form. Do not present technical stack traces.

### Planned workout
Show exercise details, schedule status, and available edit actions.

### Completed workout
Clearly communicate completion using FitFlow's existing success language and icon conventions. Keep the scheduled exercise information readable.

### Rest day
Use a calm, intentional presentation such as **Rest day** and a concise supporting line. It should not resemble a missing-data warning.

### Partially configured week
Show which days have a plan and which remain unconfigured without shaming or pressuring the user. Empty days should remain easy to edit.

## 8. Responsive Design

### Desktop
- Use the established app content width and navigation shell.
- Keep the weekly selector and selected-day details visually connected.
- Prefer a balanced page with the schedule as the primary focal point and summary information as supporting content.
- Avoid oversized cards and excessive empty space.

### Tablet
- Maintain the weekly selector's readability and keep exercise actions accessible.
- Reduce secondary spacing before shrinking essential text or controls.

### Mobile
- Prioritize the selected day and its next action.
- Use an easy-to-scan horizontal day selector or an equally usable compact layout.
- Stack secondary summary information where needed.
- Ensure buttons and day targets are comfortably tappable.
- Keep editor actions accessible above the keyboard where possible.
- Avoid horizontal overflow, tiny seven-column cards, and dense tables.

Follow the project's actual responsive breakpoints if they already exist. Do not create a competing breakpoint system.

## 9. Typography and Spacing

Use the exact font family, type scale, weights, line heights, and spacing tokens already defined by FitFlow.

Apply the following hierarchy through existing tokens:
1. Page heading.
2. Section or workout title.
3. Exercise name and key numeric target.
4. Supporting labels, date ranges, and metadata.
5. Helper text and secondary descriptions.

Use consistent spacing between page sections, day controls, exercise rows, and form fields. Align card edges and text baselines carefully. Do not introduce arbitrary per-component spacing values when equivalent design tokens exist.

## 10. Color, Surfaces, and Contrast

Use FitFlow's existing semantic colors for primary actions, selected states, completion, warnings, and errors.

- Use the main brand accent primarily for key actions and meaningful active states.
- Use neutral surfaces for most schedule content.
- Reserve success colors for actual completion or successful actions.
- Reserve error colors for genuine problems.
- Do not use color as the only status indicator.
- Preserve appropriate text contrast in the current theme.
- Use gradients only if they already have a clear role in the existing FitFlow visual system.
- Use glassmorphism only if it is already an established FitFlow pattern and remains legible.

Do not invent hex values in this page specification. Derive colors from the real project tokens and existing screens.

## 11. Icons and Imagery

Reuse the project's existing icon library and icon sizing conventions. Keep icons consistent in stroke, visual weight, and alignment.

Use icons to reinforce meaning—for example, calendar, edit, add exercise, completion, or rest day—not as decoration. Avoid mixing multiple icon styles or adding stock fitness imagery that conflicts with FitFlow's existing visual direction.

## 12. Motion and Animation

Use the locally installed `motion` skill's guidance and the project's existing animation system when designing motion details.

Motion should clarify state changes and make the interface feel responsive, not distract from workout planning.

Recommended behavior:
- Subtle feedback when selecting a day.
- Smooth but restrained opening and closing of the new-week dialog or editor.
- Short transitions for expanding or collapsing workout details.
- Immediate visual feedback when adding, removing, or reordering exercises.
- A subtle confirmation transition after saving.
- Clear state changes when a workout becomes completed.

Motion rules:
- Keep movement short, purposeful, and consistent across components.
- Avoid excessive bounce, parallax, constantly moving elements, or long decorative entrance sequences.
- Avoid animations that delay an important action.
- Prevent content from jumping during loading or day changes.
- Respect the user's reduced-motion preference.
- Keep the page usable when motion is disabled.

## 13. Accessibility and Usability

- Follow semantic structure and the established component accessibility patterns.
- Ensure keyboard users can navigate day selection, exercise editing, and dialog controls.
- Make focus states visible.
- Provide meaningful labels for icon-only actions.
- Keep text readable and controls sufficiently large.
- Pair status colors with text, icons, or other cues.
- Ensure dialogs have a clear title and accessible focus behavior.
- Keep error and success messages understandable.

## 14. Design Quality Checklist

Before approving the design, verify:

- The page looks unmistakably like FitFlow.
- The weekly schedule is the strongest visual element.
- Users can identify today's workout quickly.
- All seven days are represented clearly.
- Workout days, completed days, and rest days are visually distinct.
- Editing and creating plans have clear entry points.
- The repeat-versus-new-schedule decision is easy to understand.
- Empty, loading, success, and error states are designed.
- Desktop, tablet, and mobile layouts are all considered.
- Motion is purposeful and respects reduced-motion settings.
- There are no unnecessary visual effects or decorative metrics.
- No global design tokens are replaced without a product-wide decision.

## 15. Deliverable

Produce a page-specific design specification and corresponding UI design for the FitFlow Weekly Workout Planner. Keep the existing global `design.md` intact. If this document is added to the repository, save it as a separate feature specification unless the project's documentation structure explicitly calls for a global design update.

**Design principle:** Make weekly planning feel effortless: one glance to understand the week, one clear action to adjust a day, and no visual clutter between the user and the workout.
