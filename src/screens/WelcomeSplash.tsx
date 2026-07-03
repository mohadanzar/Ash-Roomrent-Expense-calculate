import { useEffect, useState } from 'react'

interface WelcomeSplashProps {
  onComplete: () => void
}

export function WelcomeSplash({ onComplete }: WelcomeSplashProps) {
  const [exiting, setExiting] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 100)
    const exitTimer = setTimeout(() => {
      setExiting(true)
      setTimeout(onComplete, 700)
    }, 4000)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(exitTimer)
    }
  }, [onComplete])

  const handleSkip = () => {
    setExiting(true)
    setTimeout(onComplete, 500)
  }

  return (
    <div
      className={`splash-screen ${exiting ? 'splash-exit' : ''} ${visible ? 'splash-visible' : ''}`}
      onClick={handleSkip}
      onKeyDown={(e) => e.key === 'Enter' && handleSkip()}
      role="button"
      tabIndex={0}
      aria-label="Welcome splash, tap to continue"
    >
      <div className="splash-bg-glow splash-glow-1" />
      <div className="splash-bg-glow splash-glow-2" />
      <div className="splash-grid" />

      <div className="splash-scene">
        <div className="splash-orbit-ring splash-ring-1" />
        <div className="splash-orbit-ring splash-ring-2" />

        <div className="splash-card-3d">
          <div className="splash-card-face splash-card-front">
            <p className="splash-eyebrow">Welcome to</p>
            <h1 className="splash-brand">
              <span className="splash-brand-ash">ASH</span>
              <span className="splash-brand-rest"> Website</span>
            </h1>
            <div className="splash-divider" />
            <p className="splash-tagline">Rent &amp; Expense Calculator</p>
          </div>
        </div>
      </div>

      <p className="splash-tap-hint">Tap anywhere to continue</p>
    </div>
  )
}
