import { NavLink } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/blogs', label: 'Blogs' },
  { to: '/contact', label: 'Contact' },
]

interface NavProps {
  hidden: boolean
}

export default function Nav({ hidden }: NavProps) {
  return (
    <nav className={hidden ? 'hidden' : ''}>
      <NavLink to="/" className="nav-logo">
        prudhvi.
      </NavLink>
      <ul className="nav-links">
        {NAV_LINKS.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
