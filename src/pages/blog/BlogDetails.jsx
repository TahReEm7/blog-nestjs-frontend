import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBlogById } from '../../api/blogApi'

function BlogDetails() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogById(id)
        setBlog(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBlog()
    }
  }, [id])

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 text-slate-600 shadow-sm">Loading article...</div>
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">Error: {error}</div>
  }

  if (!blog) {
    return <div className="rounded-2xl bg-white p-6 text-slate-600 shadow-sm">Blog not found.</div>
  }

  return (
    <article className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span className="rounded-full bg-violet-100 px-2.5 py-1 font-medium text-violet-700">{blog.views || 0} views</span>
        <span>By {blog.author || 'Unknown author'}</span>
        <span>•</span>
        <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Recently'}</span>
      </div>

      <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900">{blog.title}</h1>

      <div className="mb-8 rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">
        <p><strong>Author ID:</strong> {blog.authorId || 'N/A'}</p>
        <p><strong>Blog ID:</strong> {blog.id || 'N/A'}</p>
      </div>

      <div className="prose max-w-none text-lg leading-8 text-slate-700">
        {blog.content ? (
          blog.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-5">
              {paragraph || ' '}
            </p>
          ))
        ) : (
          <p>No content available.</p>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
        <span className="text-sm text-slate-500">
          Updated: {blog.updatedAt ? new Date(blog.updatedAt).toLocaleDateString() : 'N/A'}
        </span>
        <Link to="/blog" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
          Back to blog
        </Link>
      </div>
    </article>
  )
}

export default BlogDetails;