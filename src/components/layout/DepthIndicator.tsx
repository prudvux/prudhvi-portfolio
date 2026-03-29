import { Fragment } from 'react'
import { scrollToSection } from '../../utils/scrollTo'

const SECTION_IDS = ['hero', 'projects', 'case-studies', 'about', 'contact']

interface DepthIndicatorProps {
  activeSection: number
}

export default function DepthIndicator({ activeSection }: DepthIndicatorProps) {
  return (
    <div className="depth-indicator">
      {SECTION_IDS.map((id, i) => (
        <Fragment key={id}>
          <div
            className={`depth-dot${activeSection === i ? ' active' : ''}`}
            data-section={i}
            onClick={() => scrollToSection(`#${id}`)}
          />
          {i < SECTION_IDS.length - 1 && <div className="depth-line" />}
        </Fragment>
      ))}
    </div>
  )
}
