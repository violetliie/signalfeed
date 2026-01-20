import { useState, useEffect, useRef } from 'react';
import SignalFeedTerminal from './global/SignalFeedTerminal';
import FeedDeck from './FeedDeck';

type ViewMode = 'terminal' | 'feed';

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * ViewDeck - Parent controller for the revolver UI
 * Manages the animated transition between terminal and feed views
 */
export default function ViewDeck() {
  const [mode, setMode] = useState<ViewMode>('terminal');
  const [hasPanels, setHasPanels] = useState(false);
  const terminalRef = useRef<{ focusInput: () => void } | null>(null);

  // Listen for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (or Ctrl+K) → focus terminal
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setMode('terminal');
        setTimeout(() => {
          terminalRef.current?.focusInput();
        }, 100);
      }
      
      // Escape → return to terminal (only if in feed mode)
      if (e.key === 'Escape' && mode === 'feed') {
        e.preventDefault();
        setMode('terminal');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  const handleSubmit = (args: { query: string; profile?: string; preferences?: any }) => {
    console.log('[ViewDeck] Search submitted:', args);
    setHasPanels(true);
    // Animate to feed view after search
    setTimeout(() => {
      setMode('feed');
    }, 100);
  };

  const handleToggle = () => {
    setMode(prev => prev === 'terminal' ? 'feed' : 'terminal');
  };

  return (
    <div className='deck'>
      {/* Terminal Layer */}
      <div className={cn('deck-terminal', mode === 'feed' && 'deck-terminal--feed')}>
        <div className='relative z-0 flex items-center justify-center' style={{ height: 'calc(100vh - 1.5rem)' }}>
          <SignalFeedTerminal 
            ref={terminalRef}
            onSubmit={handleSubmit}
            onPanelUpdate={(count) => setHasPanels(count > 0)}
          />
        </div>
      </div>

      {/* Feed Layer */}
      <div className={cn('deck-feed', mode === 'feed' && 'deck-feed--active')}>
        <FeedDeck>
          {/* Panels are rendered by SignalFeedTerminal in portal-style */}
        </FeedDeck>
      </div>

      {/* Toggle Button - only show when there are panels */}
      {hasPanels && (
        <button
          className='deck-toggle'
          onClick={handleToggle}
          aria-label={mode === 'terminal' ? 'Show Feed' : 'Show Terminal'}
          title={mode === 'terminal' ? 'Show Feed' : 'Show Terminal (Esc)'}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2.5}
            stroke='currentColor'
            style={{
              transform: mode === 'terminal' ? 'rotate(0deg)' : 'rotate(180deg)',
            }}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M8.25 4.5l7.5 7.5-7.5 7.5'
            />
          </svg>
        </button>
      )}
    </div>
  );
}
