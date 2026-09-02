import { useEffect, useState } from 'react'
import { getBlogs } from '../../api/blogApi'
import { Link } from 'react-router-dom'

function Blog() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getBlogs()
        setBlogs(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 text-slate-600 shadow-sm">Loading articles...</div>
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">Error: {error}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">Blog</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Latest stories</h1>
      </div>

      <div className="grid gap-4">
        {blogs.map((blog) => (
          <article key={blog.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="rounded-full bg-violet-100 px-2 py-1 text-violet-700">{blog.views || 0} views</span>
              <span>By {blog.author || 'Unknown author'}</span>
              <span>•</span>
              <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Recently'}</span>
            </div>

            <h2 className="mb-3 text-2xl font-semibold text-slate-900">{blog.title}</h2>
            <p className="mb-4 text-slate-600">
              {blog.content?.length > 180 ? `${blog.content.slice(0, 180)}...` : blog.content || 'A thoughtful article from the editorial desk.'}
            </p>

            <Link
              to={`/blog/${blog.id}`}
              className="inline-block rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Read article
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Blog