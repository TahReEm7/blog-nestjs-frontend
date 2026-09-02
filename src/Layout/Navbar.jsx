import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="flex gap-4">
      <Link to="/">Home</Link>
      <Link to="/blog">Blog</Link>
      <Link to="/auth">Auth</Link>
    </nav>
  )
}

export default Navbar