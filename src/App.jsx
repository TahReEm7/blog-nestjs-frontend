import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layout'
import Home from './pages/home/Home'
import Blog from './pages/blog/Blog'
import Auth from './pages/auth/Auth'
import BlogDetails from './pages/blog/BlogDetails';
import MyBlogs from './pages/blog/MyBlogs';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/my-blogs" element={<MyBlogs />} />
          <Route path="/auth" element={<Auth />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App