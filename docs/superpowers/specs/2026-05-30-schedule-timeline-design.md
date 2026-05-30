# Schedule Timeline Design
**Date:** 2026-05-30  
**Status:** Approved

## Goal
Replace the flat read-only schedule list with a Google Calendar-style proportional timeline that supports drag-to-move, drag-to-resize, and click-to-edit.

## Data Model

Update `ScheduleBlock` in `src/types.ts`:
```ts
interface ScheduleBlock {
  id: string
  startTime: string   // "HH:MM" 24h
  endTime: string     // "HH:MM" 24h
  label: string
  type: BlockType
}
```
`getDefaultSchedule` computes each block's `endTime` from the next block's `startTime`. Last block ends at `22:00`.

## Timeline Layout

- Scrollable column in the existing card
- Range: 6:00 AM – 11:00 PM (17 hrs)
- Scale: 60px per hour = 1px per minute
- Hour labels on the left, thin grid lines across
- Blocks absolutely positioned: `top = (startMin - 360)px`, `height = durationMin * 1px`
- Color-coded by type (build=orange, study=blue, gym=green, routine=gray, break=muted)
- Current-time red line + circle, updates every 60s
- `[+ Add]` button in card header

## Block Interactions

**Drag to move:** mousedown on block body → drag vertically → snaps to 15-min grid → saves on mouseup.

**Drag to resize:** mousedown on 8px resize handle at block bottom → drag → changes `endTime` only, min 15 min → snaps to 15-min grid → saves on mouseup.

**Click to edit:** mousedown + mouseup with < 5px movement → opens edit panel with fields: label, type, startTime, endTime. Delete + Save buttons. Closes on outside click or Escape.

**Add new block:** Click `[+ Add]` or click empty timeline space → new 1hr block at that time, type=`study`, label=`New Event`, edit panel opens.

## Files Changed

1. `src/types.ts` — update `ScheduleBlock`
2. `src/lib/schedule.ts` — add `endTime` to all default blocks
3. `src/components/today/ScheduleCard.tsx` → replaced by `src/components/today/ScheduleTimeline.tsx`
4. `src/pages/Today.tsx` — import `ScheduleTimeline` instead of `ScheduleCard`
5. `src/styles/today.css` — add timeline + edit panel styles
6. `src/context/AppContext.tsx` — verify `SET_SCHEDULE` case handles new shape
