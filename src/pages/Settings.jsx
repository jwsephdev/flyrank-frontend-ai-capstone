import { useState } from 'react'
import { applyTheme, loadSettings, saveSettings } from '../lib/settings'

function validate(values) {
  const errors = {}
  if (!values.name.trim()) {
    errors.name = 'Name is required'
  }
  if (!values.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address'
  }
  return errors
}

export default function Settings() {
  const [values, setValues] = useState(() => loadSettings())
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setSaved(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const next = {
      name: values.name.trim(),
      email: values.email.trim(),
      theme: values.theme,
      notifications: values.notifications,
    }
    saveSettings(next)
    applyTheme(next.theme)
    setValues(next)
    setSaved(true)
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        Settings
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Update your profile and preferences. Saved to local storage.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Display name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            autoComplete="name"
            className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-sky-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            autoComplete="email"
            className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-sky-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="theme"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Theme
          </label>
          <select
            id="theme"
            name="theme"
            value={values.theme}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-sky-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="notifications"
            name="notifications"
            type="checkbox"
            checked={values.notifications}
            onChange={handleChange}
            className="size-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          />
          <label
            htmlFor="notifications"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Email notifications
          </label>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
          >
            Save settings
          </button>
          {saved && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400" role="status">
              Settings saved
            </p>
          )}
        </div>
      </form>
    </div>
  )
}
