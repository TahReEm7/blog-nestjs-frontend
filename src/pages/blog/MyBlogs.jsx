import { useEffect, useState } from 'react'
import { blogByUser } from '../../api/userApi'

function MyBlogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem('blogUser') || '{}')
        const userId = savedUser.id || localStorage.getItem('userId')

        if (!userId) {
          throw new Error('User ID not found')
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
  }, [])

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
              <h2 className="text-xl font-bold">{blog.title}</h2>
              <p className="mt-2 text-slate-600">{blog.content}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default MyBlogs