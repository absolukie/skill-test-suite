# Case: before-after-slider

Skill under test: `before-after-slider` (~/workspace/skills/before-after-slider/SKILL.md)

## Task (identical wording both arms)

Build a single self-contained HTML file: a before/after photo comparison slider. Use two
inline SVG gradient scenes as the "photos" (no external images). A draggable divider starts
at 50%, the before state on the left and the after state on the right, with small
"Unedited"/"Edited" labels. Keyboard accessible. No external resources, no libraries.
Write the file and stop.

## Rubric (10 binary checks, frozen 2026-10-12 before any run)

1. Container has `role="slider"` with `aria-valuemin="0"`, `aria-valuemax="100"`, and an `aria-valuenow` that starts at 50.
2. The before layer is revealed with `clip-path: inset(...)` (not width changes or a second container resizing).
3. The divider moves via `transform: translateX` (pixel space, no layout changes).
4. Travel is clamped to 2% and 98% (both constants present in the logic).
5. Keyboard: ArrowLeft/ArrowRight nudge by 4%, Home/End jump to the extremes (behavior + code check).
6. `touch-action: none` on the slider so it owns its gestures.
7. `setPointerCapture` is used on pointerdown.
8. Tap-to-glide: a short press animates the divider to the tap point (transition or rAF animation toward a target).
9. The handle is a slim notch, roughly 6px wide and 24px tall (not a big circle).
10. `aria-valuenow` updates as the divider moves (behavior check via keyboard).

## Behavior spot-check (browser)

Focus the slider, press ArrowRight twice: aria-valuenow goes 50 to 58. Press End: 98.
Press Home: 2.
