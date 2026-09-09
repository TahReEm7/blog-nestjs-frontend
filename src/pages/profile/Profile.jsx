import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteUser, updateUser } from '../../api/userApi'

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem('blogUser')

    if (!savedUser) {
      navigate('/auth', { replace: true })
      return
    }

    try {
      const parsedUser = JSON.parse(savedUser)
      if (!parsedUser.id) {
        throw new Error('Invalid user session')
      }

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(parsedUser)
      setFormData({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        password: '',
      })
    } catch {
      localStorage.removeItem('blogUser')
      navigate('/auth', { replace: true })
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    try {
      setSaving(true)
      const changes = {
        name: formData.name,
        email: formData.email,
      }

      if (formData.password) {
        changes.password = formData.password
      }

      const updatedUser = await updateUser(user.id, changes)
      const nextUser = { ...user, ...changes, ...updatedUser }
      setUser(nextUser)
      localStorage.setItem('blogUser', JSON.stringify(nextUser))
      setFormData((current) => ({ ...current, password: '' }))
      setMessage('Profile updated successfully.')
    } catch (updateError) {
      setError(updateError.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete your profile and account permanently?')) return

    try {
      setDeleting(true)
      setError('')
      await deleteUser(user.id)
      localStorage.removeItem('blogUser')
      localStorage.removeItem('userId')
      navigate('/', { replace: true })
    } catch (deleteError) {
      setError(deleteError.message || 'Failed to delete profile')
      setDeleting(false)
    }
  }

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 text-slate-600 shadow-sm">Loading profile...</div>
  }

  if (!user) return null

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">Account</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Your profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="name">Name</label>
          <input id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-violet-500 focus:bg-white" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-violet-500 focus:bg-white" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">New password</label>
          <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current password" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-violet-500 focus:bg-white" />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}

        <button type="submit" disabled={saving} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>

      <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-bold text-red-900">Delete profile</h2>
        <p className="mt-1 text-sm text-red-700">This permanently deletes your account.</p>
        <button type="button" onClick={handleDelete} disabled={deleting} className="mt-4 rounded-full border border-red-300 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60">
          {deleting ? 'Deleting...' : 'Delete my profile'}
        </button>
      </div>
    </section>
  )
}

export default Profile
