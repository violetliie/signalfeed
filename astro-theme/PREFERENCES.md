# User Preferences Implementation

## ✅ Completed Features

### 1. UI Components
- **SettingsModal** (`src/components/SettingsModal.tsx`)
  - Three tabs: Search | Ranking | Display
  - Modal opens with Settings button in top bar or **Cmd/Ctrl+,**
  - Esc to close modal
  - Backdrop blur with click-outside to close

- **MacToolbar** Updated (`src/components/global/MacToolbar.tsx`)
  - Simplified menu: Apple logo, SignalFeed, Settings
  - Settings icon on right side
  - Date/time display preserved
  - Removed unused File/Edit/View/Go/Window/Help menus

- **PrefField** (`src/components/PrefField.tsx`)
  - Reusable component for preference controls
  - Label, input, and hint text support

### 2. Preferences System
- **PrefsContext** (`src/contexts/PrefsContext.tsx`)
  - React Context with `usePrefs()` hook
  - Persists to localStorage under `yn_prefs`
  - Merges saved values with defaults on load

- **Types** (`src/types/preferences.ts`)
  - Full TypeScript interfaces for all preference categories
  - DEFAULT_PREFS exported for consistency

### 3. Preference Categories

#### Search Preferences
- `timeWindowHours`: 72 (default) - How far back to search
- `maxLinks`: 12 - Maximum articles to fetch
- `summaryStyle`: 'short' | 'medium' | 'long'
- `useOpenAI`: true - Enable AI summaries
- `sourcesMode`: 'all' | 'allowlist'
- `allowlist`: [] - Array of allowed domains

#### Ranking Preferences
- `recencyAlpha`: 0.2 - Weight for recent articles (0-1)
- `perDomainCap`: 2 - Max articles per source
- `bm25Weight`: 1 - Text relevance weight
- `profileAlpha`: 0 - Personalization weight (0-1)
- `dedupeNearDupes`: true - Remove similar articles

#### Display Preferences (Client-only)
- `linksToShow`: 7 - Number of article links per window
- `showImages`: true - Display thumbnails (reserved for future)
- `showMeta`: true - Show source and timestamp
- `showDebugScores`: false - Show ranking scores

### 4. Backend Integration
- **SignalFeedTerminal** sends preferences in API call:
  ```typescript
  POST /search/panels
  {
    query: "topic",
    preferences: {
      search: {...},
      ranking: {...},
      display: {...}
    }
  }
  ```

- **Display preferences** respected in UI:
  - `linksToShow`: Slices article array before rendering
  - `showMeta`: Conditionally shows source/timestamp
  - `showDebugScores`: Shows score if available

### 5. Keyboard Shortcuts
- **Cmd/Ctrl+,** - Open/close Settings modal
- **Cmd/Ctrl+K** - Focus search input (preserved)
- **Esc** - Close front window or Settings modal
- **"clear"** - Close all windows (preserved)

## 🔌 Backend Contract

The backend receives preferences but may ignore them if not implemented:
```typescript
{
  query: string,
  preferences?: {
    search: {
      timeWindowHours: number,
      maxLinks: number,
      summaryStyle: string,
      useOpenAI: boolean,
      sourcesMode: string,
      allowlist: string[]
    },
    ranking: {
      recencyAlpha: number,
      perDomainCap: number,
      bm25Weight: number,
      profileAlpha: number,
      dedupeNearDupes: boolean
    },
    display: {
      linksToShow: number,
      showImages: boolean,
      showMeta: boolean,
      showDebugScores: boolean
    }
  }
}
```

## 🎯 Testing

1. **Open Settings**: Click Settings in menu bar or press **Cmd+,**
2. **Change timeWindowHours**: Set to 24 to get fresher articles
3. **Change perDomainCap**: Set to 1 to see more diverse sources
4. **Change linksToShow**: Set to 3 to show fewer links per window
5. **Toggle showMeta**: Turn off to hide source/timestamp
6. **Toggle showDebugScores**: Turn on to see ranking scores (if backend provides)
7. **Save & Search**: Changes persist across sessions

## 📁 File Structure

```
astro-theme/
├── src/
│   ├── types/
│   │   └── preferences.ts          # Type definitions & defaults
│   ├── contexts/
│   │   └── PrefsContext.tsx        # React Context + localStorage
│   ├── components/
│   │   ├── PrefField.tsx           # Reusable preference field
│   │   ├── SettingsModal.tsx       # Settings UI with tabs
│   │   └── global/
│   │       ├── MacToolbar.tsx      # Simplified toolbar with Settings
│   │       └── SignalFeedTerminal.tsx # Terminal with prefs integration
│   └── layouts/
│       └── AppLayout.tsx           # Wrapped with PrefsProvider
```

## ⚡ Performance Notes

- Preferences load once from localStorage on mount
- Changes save immediately to localStorage
- Modal state managed locally before saving
- No unnecessary re-renders - only affected components update

## 🎨 Styling

- Modal: `fixed inset-0 bg-black/60 backdrop-blur-sm`
- Panel: `bg-black/90 border border-white/10 rounded-2xl`
- Tabs: Active tab highlighted with cyan accent
- Inputs: `bg-white/5 border border-white/10 rounded-lg`
- Consistent with macOS Terminal theme aesthetic
