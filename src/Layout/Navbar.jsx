import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold tracking-tight text-slate-900">
          BlogNest
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link to="/" className="transition hover:text-slate-900">Home</Link>
          <Link to="/blog" className="transition hover:text-slate-900">Blog</Link>
        </div>

        <Link
          to="/auth"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Sign in
        </Link>
      </nav>
    </header>
  )
}

export default Navbar