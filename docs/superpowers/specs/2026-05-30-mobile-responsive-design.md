# Mobile Responsive Design Spec
**Date:** 2026-05-30  
**Status:** Approved

## Goal
Make the dashboard fully usable on mobile without changing anything on desktop. Breakpoint: ≤ 768px.

## Section 1 — Navigation (Hamburger Menu)

**Desktop:** unchanged — sidebar always visible on left.

**Mobile:**
- Sidebar hidden off-screen (`transform: translateX(-100%)`)
- Topbar gains a `☰` hamburger button on the far left
- Tapping opens the sidebar as a slide-in overlay (dark backdrop behind)
- Tapping the backdrop or any nav link closes the sidebar
- Sidebar state managed in `Sidebar.tsx` or passed via prop from `App.tsx`

## Section 2 — Layout Reflow

**Breakpoint:** `@media (max-width: 768px)`

- `.two-col` and `.two-col-wide` → `grid-template-columns: 1fr` (stack vertically)
- `.content` padding → 12px (down from 24px)
- `.dr-row` (5 day rings) → `overflow-x: auto`, no-wrap, so rings scroll horizontally
- Overview rings row → `overflow-x: auto`, horizontal scroll
- AP unit tracker columns → single column
- All cards → full width naturally (already block-level)
- Topbar → condense: hide "Day N" text if space is tight, smaller font on date chip

## Section 3 — Schedule Timeline Touch Support

Add touch event handlers alongside existing mouse handlers in `ScheduleTimeline.tsx`:

- `onTouchStart` on block body → same logic as `onMouseDown` (mode: 'move'), use `touch.clientY`
- `onTouchStart` on resize handle → same logic as `onMouseDown` (mode: 'resize')
- `onTouchMove` on `.tl-grid` → same logic as `onMouseMove`, use `touch.clientY`
- `onTouchEnd` on `.tl-grid` → same logic as `onMouseUp`, use last known Y
- Add `touch-action: none` CSS on `.tl-grid` to prevent page scroll interfering with drag

## Files Changed

| File | Change |
|------|--------|
| `src/components/layout/Sidebar.tsx` | Accept `isOpen`/`onClose` props, add mobile overlay + backdrop |
| `src/components/layout/Topbar.tsx` | Add hamburger button, wire open state |
| `src/App.tsx` | Manage `sidebarOpen` state, pass to Sidebar + Topbar |
| `src/components/today/ScheduleTimeline.tsx` | Add touch event handlers |
| `src/styles/layout.css` | Mobile sidebar overlay styles, hamburger button |
| `src/styles/components.css` | Mobile reflow for `.two-col`, `.dr-row`, rings row |
| `src/styles/today.css` | `touch-action: none` on `.tl-grid`, mobile padding |
| `src/styles/overview.css` | Horizontal scroll on rings row, unit tracker reflow |
