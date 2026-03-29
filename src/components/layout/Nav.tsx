import { scrollToSection } from '../../utils/scrollTo'

const NAV_LINKS = [
  { href: '#projects', label: 'Islands' },
  { href: '#case-studies', label: 'Shells' },
  { href: '#about', label: 'Cove' },
  { href: '#contact', label: 'Bottle' },
]

interface NavProps {
  hidden: boolean
}

export default function Nav({ hidden }: NavProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    scrollToSection(href)
  }

  return (
    <nav className={hidden ? 'hidden' : ''}>
      <a href="#hero" className="nav-logo" onClick={e => handleClick(e, '#hero')}>
        OCEANA
      </a>
      <ul className="nav-links">
        {NAV_LINKS.map(({ href, label }) => (
          <li key={href}>
            <a href={href} onClick={e => handleClick(e, href)}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
