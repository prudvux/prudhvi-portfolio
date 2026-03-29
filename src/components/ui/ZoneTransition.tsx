import type { ZoneTransitionVariant } from '../../types'

interface ZoneTransitionProps {
  variant: ZoneTransitionVariant
}

export default function ZoneTransition({ variant }: ZoneTransitionProps) {
  return <div className={`zone-transition ${variant}`} />
}
