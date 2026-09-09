import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem('blogUser')),
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(Boolean(localStorage.getItem('blogUser')))
  }, [location.pathname])

  const handleSignOut = () => {
    localStorage.removeItem('blogUser')
    localStorage.removeItem('userId')
    setIsLoggedIn(false)
    navigate('/auth')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold tracking-tight text-slate-900">
          BlogNest
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link to="/" className="transition hover:text-slate-900">Home</Link>
          <Link to="/blog" className="transition hover:text-slate-900">Blog</Link>
          {isLoggedIn && <Link to="/my-blogs" className="transition hover:text-slate-900">My Blogs</Link>}
          {isLoggedIn && <Link to="/profile" className="transition hover:text-slate-900">Profile</Link>}
        </div>

        {isLoggedIn ? (
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Sign out
          </button>
        ) : (
          <Link
            to="/auth"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Sign in
          </Link>
        )}
      </nav>
    </header>
  )
}

export default Navbar