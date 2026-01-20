# Quadrant Layout Quick Reference

## 🎯 What Changed

### New Files
- `src/lib/layout.ts` - Layout calculation engine

### Modified Files
- `src/components/global/SignalFeedTerminal.tsx` - Quadrant orchestration + resize logic
- `src/styles/glass.css` - Resizer handle styles

## 🏗️ Architecture

```
┌─────────────────────────────────┐
│         Menu Bar (48px)         │
├────────┬────────┬────────────────┤
│   TL   │        │       TR       │
│ Topic1 │ Center │    Topic2      │
│        │Terminal│                │
├────────┤        ├────────────────┤
│   BL   │        │       BR       │
│ Topic3 │        │    Topic4      │
│        │        │                │
├────────┴────────┴────────────────┤
│    OVERFLOW (Topic5+)            │
│      ▣ ▣ ▣ (cascading)           │
├──────────────────────────────────┤
│         Dock (90px)              │
└──────────────────────────────────┘
```

## 📋 Window State

```typescript
interface WindowData {
  x, y: number;           // position
  w, h: number;           // size (NEW)
  quadrant?: Quadrant;    // 'TL'|'TR'|'BL'|'BR'|'OVERFLOW' (NEW)
  // ... existing fields
}
```

## 🔧 Key Functions

### Layout Engine
```typescript
// Calculate quadrant rects
const rects = computeLayoutRects(vw, vh, centerRect, gap=16);
// → { TL, TR, BL, BR, OVERFLOW_ORIGIN, bounds }

// Map index to quadrant
const quad = snapToQuadrant(index); // 0→TL, 1→TR, 2→BL, 3→BR, 4+→OVERFLOW

// Clamp to bounds
const clamped = clampToBounds(win, bounds, minW=360, minH=220);
```

### Component Methods
```typescript
reflowWindows()        // Recalculate all positions (called on resize)
createPanel(topic, i)  // Spawn window in next quadrant
moveWindow(id, dx, dy) // Drag with bounds clamping
resizeWindow(id, w, h) // Resize via handle
```

## 🎨 Resize Handle

### HTML Structure
```tsx
<div className='yn-resizer' onMouseDown={handleResizeStart} />
```

### CSS
```css
.yn-resizer {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 16px;
  height: 16px;
  cursor: nwse-resize;
  background: rgba(255, 255, 255, 0.12);
}
```

### Interaction
1. User hovers → cursor changes to nwse-resize
2. User drags → width/height increase
3. Size clamped to min (360×220) and viewport bounds

## 🚀 Usage Examples

### Spawn 4 Windows
```bash
# In terminal input
trump, climate, switzerland, g7
```
**Result**: Windows auto-snap to TL, TR, BL, BR

### Spawn 5+ Windows
```bash
biden, tech, crypto, stocks, inflation
```
**Result**: First 4 in quadrants, 5th in overflow strip

### Resize Window
1. Move cursor to bottom-right corner
2. Drag to resize
3. Size updates in real-time, clamped to bounds

## 📐 Layout Math

### Quadrant Widths
```typescript
leftW  = Math.max(360, center.x - gap*2)
rightW = Math.max(360, vw - (center.x + center.w) - gap*2)
```

### Quadrant Heights
```typescript
topH = Math.max(260, center.y - gap*2)
botH = Math.max(260, vh - (center.y + center.h) - safeBottom - gap*2)
```

### Overflow Position
```typescript
x = OVERFLOW_ORIGIN.x + (index - 4) * 24
y = OVERFLOW_ORIGIN.y + (index - 4) * 8
w = 420
h = 280
```

## 🔄 Reflow Behavior

### When It Happens
- Window resize event
- New window spawn (initial placement only)

### What It Does
1. Measures viewport (vw, vh)
2. Measures center terminal rect
3. Calculates quadrant dimensions
4. Maps each window to a quadrant
5. Preserves user-resized dimensions
6. Clamps positions to bounds

### What It Preserves
- User-resized w/h (if exists)
- Window z-index stacking
- Minimized state
- Data/content

## 🎬 Interaction Flow

### Drag
```
mousedown on titlebar
→ setIsDragging(true)
→ mousemove: moveWindow(id, dx, dy)
→ clampToBounds
→ setWindows (update x, y)
→ mouseup: setIsDragging(false)
```

### Resize
```
mousedown on .yn-resizer
→ setIsResizing(true)
→ document.body.userSelect = 'none'
→ mousemove: resizeWindow(id, newW, newH)
→ clampToBounds (min 360×220)
→ setWindows (update w, h)
→ mouseup: restore userSelect
```

## 📱 Small Screen Mode

### Trigger
```typescript
vw < 1024 || vh < 720
```

### Behavior
- Use `compute2UpLayout()` instead of `computeLayoutRects()`
- First 2 windows: side-by-side
- Next 2 windows: below first row
- 5+: Overflow with 2-column wrapping

## 🐛 Debugging

### Check Center Rect
```javascript
console.log(centerRectRef.current);
// { x: 400, y: 200, w: 700, h: 360 }
```

### Check Window Quadrants
```javascript
windows.map(w => ({ topic: w.topic, quad: w.quadrant }))
// [{ topic: 'trump', quad: 'TL' }, ...]
```

### Check Layout Rects
```javascript
const rects = computeLayoutRects(window.innerWidth, window.innerHeight, centerRectRef.current);
console.log(rects.TL, rects.TR, rects.BL, rects.BR);
```

## ✅ Testing Scenarios

### Basic Flow
1. **Load page** → Terminal appears in center
2. **Type "trump, climate"** → Two windows in TL, TR
3. **Type "biden, tech"** → Two more in BL, BR
4. **Type "stocks"** → Fifth window in overflow
5. **Resize browser** → All windows reflow, center preserved

### Resize Testing
1. **Hover bottom-right** → Cursor changes
2. **Drag corner** → Window resizes smoothly
3. **Drag small** → Stops at 360×220 min
4. **Drag large** → Stops at viewport bounds

### Drag Testing
1. **Drag titlebar** → Window moves
2. **Drag outside bounds** → Clamped to viewport
3. **Click window** → Brought to front (z-index)

## 🚨 Common Issues

### Windows Overlapping Center
**Cause**: centerRectRef not measured
**Fix**: Ensure terminalRef is set and useEffect runs

### Windows Too Small
**Cause**: Viewport too small for quadrants
**Fix**: Small screen mode should activate (check `isSmallScreen()`)

### Resize Not Working
**Cause**: Missing onResize prop or handler
**Fix**: Verify `handleResizeStart` is bound to `.yn-resizer`

### Reflow Not Happening
**Cause**: Resize listener not attached
**Fix**: Check useEffect with window.addEventListener('resize')

## 📊 Performance

### Layout Calculations
- **O(n)** where n = number of windows
- **Memoized** in centerRectRef
- **Triggered** only on resize, not every render

### Clamping
- **O(1)** per window
- **Runs** on move/resize, not on idle

### Render Optimization
- Only affected window re-renders during move/resize
- All windows re-render on reflow (acceptable for small n)

## 🎁 Preserved Features

✅ Glass morphism styling
✅ Traffic light controls (close/minimize/maximize)
✅ Drag to move
✅ Click to bring to front
✅ AI-powered insights/tags
✅ Markdown summaries
✅ Live status indicators
✅ Keyboard shortcuts (Cmd+K, Esc)
✅ API status monitoring

## 🔮 Future Ideas

- [ ] Snap zones with visual guides
- [ ] Double-click titlebar to maximize to quadrant
- [ ] Keyboard shortcuts for quadrant navigation
- [ ] localStorage persistence of positions/sizes
- [ ] Grid overlay toggle for debugging
- [ ] Touch/mobile drag/resize support
