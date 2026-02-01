import { memo } from 'react'

// Static decoration component - memoized to prevent unnecessary re-renders
export const GridDecoration = memo(function GridDecoration() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {/* Top-left */}
      <svg
        className="absolute top-4 left-4 sm:top-8 sm:left-8 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground"
        viewBox="0 0 16 16"
      >
        <line x1="8" y1="0" x2="8" y2="16" stroke="currentColor" strokeWidth="2" />
        <line x1="0" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="2" />
      </svg>

      {/* Top-right */}
      <svg
        className="hidden sm:block absolute top-8 right-8 w-5 h-5 text-muted-foreground"
        viewBox="0 0 16 16"
      >
        <line x1="8" y1="0" x2="8" y2="16" stroke="currentColor" strokeWidth="2" />
        <line x1="0" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="2" />
      </svg>

      {/* Bottom-left */}
      <svg
        className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground"
        viewBox="0 0 16 16"
      >
        <line x1="8" y1="0" x2="8" y2="16" stroke="currentColor" strokeWidth="2" />
        <line x1="0" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="2" />
      </svg>

      {/* Bottom-right */}
      <svg
        className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground"
        viewBox="0 0 16 16"
      >
        <line x1="8" y1="0" x2="8" y2="16" stroke="currentColor" strokeWidth="2" />
        <line x1="0" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  )
})
