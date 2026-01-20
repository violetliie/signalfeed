# Contributing to SignalFeed

Thank you for your interest in contributing! 🎉

## Development Setup

1. **Fork and clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/signalfeed.git
   cd signalfeed/astro-theme
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Start development**
   ```bash
   npm run dev
   ```

## Development Scripts

- `npm run dev` - Start dev server with hot reload
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - TypeScript type checking
- `npm run check` - Full validation (lint + typecheck + build)

## Code Quality Standards

### Before Committing

Always run:
```bash
npm run check
```

This ensures your code:
- ✅ Passes ESLint checks
- ✅ Has no TypeScript errors
- ✅ Builds successfully

### Code Style

- Use **TypeScript** for all new code
- Follow existing patterns in the codebase
- Use **Prettier** for formatting (auto-format on save recommended)
- Add JSDoc comments for public APIs
- **No double hyphens** in copy (use em dash — or single hyphen -)

### Naming Conventions

- **Components**: PascalCase (`SignalFeedTerminal.tsx`)
- **Files**: camelCase for utils, PascalCase for components
- **Functions**: camelCase (`fetchGoogleNews`)
- **Constants**: UPPER_SNAKE_CASE (`OPENAI_API_KEY`)

## Project Structure

```
astro-theme/
├── src/
│   ├── pages/
│   │   ├── index.astro           # Main page
│   │   └── api/                  # API endpoints
│   ├── components/               # React components
│   ├── layouts/                  # Page layouts
│   ├── server/                   # Server-side logic
│   │   ├── rss.ts               # RSS fetching
│   │   ├── rank.ts              # Ranking algorithm
│   │   ├── digest.ts            # AI summarization
│   │   └── time.ts              # Time utilities
│   ├── lib/                      # Utilities
│   │   ├── prefs.ts             # Preferences
│   │   └── env.ts               # Environment config
│   └── styles/                   # Global CSS
└── public/                       # Static assets
```

## Adding Features

### New Profile

1. Add to `RankProfileName` type in `src/server/rank.ts`
2. Add keywords/domains in `getRankFocus()`
3. Add profile config in `getRankProfile()`
4. Update `PROFILE_NAMES` in `src/types/preferences.ts`

### New API Endpoint

1. Create file in `src/pages/api/`
2. Export `GET` or `POST` function
3. Use Zod for request validation
4. Add error handling

### New Preference

1. Update `AppPrefs` in `src/types/preferences.ts`
2. Add field in `SettingsModal.tsx`
3. Update `loadPrefs()` defaults in `src/lib/prefs.ts`
4. Pass preference to API in search call

## Testing

Manual testing checklist:

- [ ] Search works for various queries
- [ ] Profile focus filters correctly
- [ ] Settings persist after page reload
- [ ] AI summaries generate (when API key present)
- [ ] Fallback works (when no API key)
- [ ] Draggable windows work smoothly
- [ ] Mobile responsive
- [ ] No double hyphens in user-facing text

## Pull Request Process

1. **Create descriptive PR title**
   - ✅ "feat: add sports profile keywords"
   - ❌ "fix stuff"

2. **Describe changes**
   - What problem does this solve?
   - How did you test it?
   - Any breaking changes?

3. **Ensure CI passes**
   - All checks must be green

4. **Request review**
   - Tag maintainers if urgent

## Bug Reports

Use GitHub Issues with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS info
- Screenshots (if UI bug)

## Questions?

Open a GitHub Discussion or issue!

---

Happy coding! 🚀

