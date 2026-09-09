import React, { useEffect, useState } from 'react'
import { createBlog, getBlogs } from '../../api/blogApi'
import { useNavigate } from 'react-router-dom'

interface Blog {
  id?: string
  title: string
  content: string
  author?: string
  authorId?: string
  views?: number
  createdAt?: string
  updatedAt?: string
}

interface BlogFormData {
  title: string
  content: string
  author: string
  authorId: string
}

interface User {
  id?: string
  name?: string
  email?: string
  password?: string
}

function Home() {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    author: '',
    authorId: '',
  })
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [success, setSuccess] = useState<string>('')

  useEffect(() => {
    const savedUser = localStorage.getItem('blogUser')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as User
        setCurrentUser(parsedUser)
        setFormData({
          title: '',
          content: '',
          author: parsedUser.name || parsedUser.email || '',
          authorId: parsedUser.id || '',
        })
      } catch {
        localStorage.removeItem('blogUser')
      }
    }

    const fetchBlogs = async (): Promise<void> => {
      try {
        const data: Blog[] = await getBlogs()
        setBlogs(data)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Failed to load blogs.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  const featuredPosts: Blog[] = blogs.slice(0, 3)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    if (!currentUser) {
      navigate('/auth')
      return
    }

    if (!formData.title || !formData.content || !formData.author || !formData.authorId) {
      setError('Please fill in title, content, author, and author ID.')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      setSuccess('')

      const savedBlog: Blog = await createBlog(formData)
      setBlogs((prev) => [savedBlog, ...prev])
      setFormData({
        title: '',
        content: '',
        author: currentUser?.name || currentUser?.email || '',
        authorId: currentUser?.id || '',
      })
      setSuccess('Blog published successfully.')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to publish blog.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-10">
      {currentUser && (
        <section className="rounded-3xl border border-violet-200 bg-violet-50 p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">Logged in user</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">{currentUser.name || currentUser.email || 'User'}</h2>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              <p><span className="font-medium text-slate-800">Email:</span> {currentUser.email || 'N/A'}</p>
              <p><span className="font-medium text-slate-800">User ID:</span> {currentUser.id || 'N/A'}</p>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900">Write a blog post</h2>
          {currentUser ? (
            <p className="mt-1 text-sm text-slate-500">Create a new article using the blog entity fields.</p>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/auth')}
              className="mt-1 text-sm font-semibold text-violet-600 hover:text-violet-800"
            >
              Sign in first to publish a blog.
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-violet-500 focus:bg-white"
              placeholder="Blog title"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-violet-500 focus:bg-white"
              placeholder="Write your blog content here..."
            />
          </div>

          {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
          {success && <p className="md:col-span-2 text-sm text-green-600">{success}</p>}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Publishing...' : 'Publish blog'}
            </button>
          </div>
        </form>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Featured posts</h2>
          <span className="text-sm text-slate-500">Updated weekly</span>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-6 text-slate-600 shadow-sm">Loading articles...</div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {featuredPosts.map((post) => (
              <article key={post.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <span className="mb-4 inline-block rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700">
                  {post.views || 0} views
                </span>
                <h3 className="mb-3 text-xl font-semibold text-slate-900">{post.title}</h3>
                <p className="text-sm leading-6 text-slate-600">
                  {post.content?.length > 120 ? `${post.content.slice(0, 120)}...` : post.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home