# Case: carousel

Skill under test: `carousel` (~/workspace/skills/carousel/SKILL.md)

## Task (identical wording both arms)

Build a single self-contained HTML file: a card carousel showing 5 neighborhood coffee
spots, one card visible at a time, swipeable, with prev/next arrow buttons, a counter, and
tap-a-card to select it (selection shows the spot name in a readout line above the carousel).
Mobile-first at 390px wide. No external resources, no libraries. Write the file and stop.

## Rubric (10 binary checks, frozen 2026-10-12 before any run)

1. Track uses `scroll-snap-type: x mandatory` (or `scroll-snap-type:x mandatory`).
2. Slides use `scroll-snap-stop: always`.
3. Track has `overscroll-behavior-x: contain`.
4. Every slide carries its own counter in `N/5` form (5 counters in the DOM or generated per slide).
5. Arrow navigation moves the track instantly: no `behavior: 'smooth'` / `"smooth"` anywhere in the file.
6. Equal-height logic exists: JS measures card heights and pins them (max height applied), or CSS grid stretch with a stated equalization mechanism (grader: look for height measurement code).
7. `touch-action: manipulation` appears on tap targets.
8. Wrap-around navigation: modulo arithmetic on the index (prev from first goes to last).
9. Prev/next are real `<button>` elements with aria-labels.
10. No external requests (no http:// or https:// references to assets; anchor hrefs excluded).

## Behavior spot-check (browser)

Clicking Next changes the visible counter/readout; tapping a card does not change window.scrollY.
