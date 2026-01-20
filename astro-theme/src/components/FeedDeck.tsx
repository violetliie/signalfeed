import type { ReactNode } from 'react';

interface FeedDeckProps {
  children?: ReactNode;
}

/**
 * FeedDeck - Thin wrapper for the panel feed layer
 * Simply renders children (the panel windows) without any additional logic
 */
export default function FeedDeck({ children }: FeedDeckProps) {
  return (
    <div className='relative z-0 flex items-center justify-center' style={{ height: '100vh' }}>
      {children}
    </div>
  );
}
