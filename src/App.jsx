import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layout'
import Home from './pages/home/Home'
import Blog from './pages/blog/Blog'
import Auth from './pages/auth/Auth'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/auth" element={<Auth />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App