import { useState } from 'react'
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom'
import { useScrollTracking } from './hooks/useScrollTracking'
import CursorSystem from './components/cursor/CursorSystem'
import Nav from './components/layout/Nav'
import DepthIndicator from './components/layout/DepthIndicator'
import Footer from './components/layout/Footer'
import BubblesLayer from './components/effects/BubblesLayer'
import SplashScreen from './components/splash/SplashScreen'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Blogs from './pages/Blogs'
import Contact from './pages/Contact'

function Layout() {
  const { navHidden, activeSection } = useScrollTracking(6)
  const location = useLocation()
  const isHome = location.pathname === '/'

  // Show splash once per session, only on the home route
  const [splashDone, setSplashDone] = useState(() => {
    return !isHome || sessionStorage.getItem('splashSeen') === 'true'
  })

  const handleSplashComplete = () => {
    sessionStorage.setItem('splashSeen', 'true')
    setSplashDone(true)
  }

  return (
    <>
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}
      <CursorSystem />
      <BubblesLayer />
      <Nav hidden={navHidden} />
      {isHome && <DepthIndicator activeSection={activeSection} />}
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'projects', element: <Projects /> },
      { path: 'blogs', element: <Blogs /> },
      { path: 'contact', element: <Contact /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
