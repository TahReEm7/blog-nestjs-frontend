import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { blogByUser } from '../../api/userApi'
import { deleteBlog, updateBlog } from '../../api/blogApi'

function MyBlogs() {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingBlog, setEditingBlog] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem('blogUser') || '{}')
        const userId = savedUser.id || localStorage.getItem('userId')

        if (!userId) {
          navigate('/auth')
          return
        }

        const userBlogs = await blogByUser(userId)
        setBlogs(userBlogs)
      } catch (error) {
        setError(error.message || 'Failed to fetch blogs')
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [navigate])

  const handleUpdate = async (event) => {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')
      const changes = {
        title: editingBlog.title,
        content: editingBlog.content,
      }
      const updatedBlog = await updateBlog(editingBlog.id, changes)
      setBlogs((currentBlogs) => currentBlogs.map((blog) => (
        blog.id === editingBlog.id ? { ...blog, ...changes, ...updatedBlog } : blog
      )))
      setEditingBlog(null)
    } catch (error) {
      setError(error.message || 'Failed to update blog')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (blogId) => {
    if (!window.confirm('Delete this blog permanently?')) return

    try {
      setError('')
      await deleteBlog(blogId)
      setBlogs((currentBlogs) => currentBlogs.filter((blog) => blog.id !== blogId))
    } catch (error) {
      setError(error.message || 'Failed to delete blog')
    }
  }

  if (loading) return <p>Loading your blogs...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <section className="space-y-5">
      <h1 className="text-3xl font-bold">My Blogs</h1>

      {blogs.length === 0 ? (
        <p>You have not published any blogs yet.</p>
      ) : (
        <div className="grid gap-5">
          {blogs.map((blog) => (
            <article key={blog.id} className="rounded-xl border p-5 shadow-sm">
              {editingBlog?.id === blog.id ? (
                <form onSubmit={handleUpdate} className="space-y-3">
                  <input
                    value={editingBlog.title}
                    onChange={(event) => setEditingBlog({ ...editingBlog, title: event.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xl font-bold"
                    required
                  />
                  <textarea
                    value={editingBlog.content}
                    onChange={(event) => setEditingBlog({ ...editingBlog, content: event.target.value })}
                    className="min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-600"
                    required
                  />
                  <div className="flex gap-2">
                    <button type="submit" disabled={saving} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                      {saving ? 'Saving...' : 'Save changes'}
                    </button>
                    <button type="button" onClick={() => setEditingBlog(null)} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="text-xl font-bold">{blog.title}</h2>
                  <p className="mt-2 text-slate-600">{blog.content}</p>
                  <div className="mt-4 flex gap-2">
                    <button type="button" onClick={() => setEditingBlog({ ...blog })} className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">
                      Update
                    </button>
                    <button type="button" onClick={() => handleDelete(blog.id)} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                      Delete
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default MyBlogs