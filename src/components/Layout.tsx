import type { ReactNode } from 'react'

interface LayoutProps {
  title: string
  onBack?: () => void
  onHome?: () => void
  children: ReactNode
  footer?: ReactNode
}

export function Layout({ title, onBack, onHome, children, footer }: LayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 bg-brand px-4 py-3.5 shadow-[0_2px_12px_rgba(21,42,69,0.25)]">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white active:bg-white/20"
                aria-label="Go back"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h1 className="truncate text-[1.05rem] font-semibold tracking-tight text-white">{title}</h1>
          </div>
          {onHome && (
            <button
              type="button"
              onClick={onHome}
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-white/12 px-3 text-sm font-medium text-white active:bg-white/20"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-5 pb-28">{children}</main>

      {footer && (
        <footer className="fixed bottom-0 left-0 right-0 border-t border-border bg-white/95 px-4 py-3.5 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] backdrop-blur-md">
          <div className="mx-auto flex max-w-lg gap-3">{footer}</div>
        </footer>
      )}
    </div>
  )
}
