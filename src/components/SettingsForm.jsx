import { useRef, useState } from 'react'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const BIO_MAX = 160

const fieldOrder = ['name', 'email', 'bio']

const inputClassName =
  'mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-sky-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100'

function validateField(name, values) {
  if (name === 'name') {
    const trimmed = values.name.trim()
    if (!trimmed) return 'Name is required'
    if (trimmed.length < 2 || trimmed.length > 50) {
      return 'Name must be 2-50 characters'
    }
    return ''
  }

  if (name === 'email') {
    const trimmed = values.email.trim()
    if (!trimmed) return 'Email is required'
    if (!EMAIL_PATTERN.test(trimmed)) return 'Enter a valid email address'
    return ''
  }

  if (name === 'bio') {
    if (values.bio.length > BIO_MAX) {
      return 'Bio must be 160 characters or fewer'
    }
    return ''
  }

  return ''
}

function validateAll(values) {
  const errors = {}
  for (const field of fieldOrder) {
    const message = validateField(field, values)
    if (message) errors[field] = message
  }
  return errors
}

export default function SettingsForm({ onSave }) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    bio: '',
    notifications: false,
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const bioRef = useRef(null)

  const refs = {
    name: nameRef,
    email: emailRef,
    bio: bioRef,
  }

  function updateValue(name, value) {
    const nextValues = { ...values, [name]: value }
    setValues(nextValues)
    setSaved(false)

    if (errors[name]) {
      const message = validateField(name, nextValues)
      setErrors((prev) => {
        if (!message) {
          const { [name]: _removed, ...rest } = prev
          return rest
        }
        return { ...prev, [name]: message }
      })
    }
  }

  function handleChange(event) {
    const { name, type, checked, value } = event.target
    updateValue(name, type === 'checkbox' ? checked : value)
  }

  function handleBlur(event) {
    const { name, type, checked, value } = event.target
    const nextValues = {
      ...values,
      [name]: type === 'checkbox' ? checked : value,
    }
    const message = validateField(name, nextValues)
    setErrors((prev) => {
      if (!message) {
        const { [name]: _removed, ...rest } = prev
        return rest
      }
      return { ...prev, [name]: message }
    })
  }

  function handleToggle() {
    updateValue('notifications', !values.notifications)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting) return

    const nextErrors = validateAll(values)
    setErrors(nextErrors)

    const firstInvalid = fieldOrder.find((field) => nextErrors[field])
    if (firstInvalid) {
      refs[firstInvalid].current?.focus()
      return
    }

    setSubmitting(true)
    setSaved(false)

    const trimmed = {
      name: values.name.trim(),
      email: values.email.trim(),
      bio: values.bio.trim(),
      notifications: values.notifications,
    }

    try {
      await Promise.resolve(onSave?.(trimmed))
      setSaved(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <label
          htmlFor="settings-name"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Display name
        </label>
        <input
          ref={nameRef}
          id="settings-name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="name"
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'settings-name-error' : undefined}
          className={inputClassName}
        />
        {errors.name && (
          <p
            id="settings-name-error"
            role="alert"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="settings-email"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Email
        </label>
        <input
          ref={emailRef}
          id="settings-email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="email"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'settings-email-error' : undefined}
          className={inputClassName}
        />
        {errors.email && (
          <p
            id="settings-email-error"
            role="alert"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="settings-bio"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Bio
        </label>
        <textarea
          ref={bioRef}
          id="settings-bio"
          name="bio"
          rows={4}
          value={values.bio}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={errors.bio ? 'true' : 'false'}
          aria-describedby={
            errors.bio ? 'settings-bio-error settings-bio-count' : 'settings-bio-count'
          }
          className={inputClassName}
        />
        <p
          id="settings-bio-count"
          className="mt-1 text-sm text-slate-500 dark:text-slate-400"
        >
          {values.bio.length} / {BIO_MAX}
        </p>
        {errors.bio && (
          <p
            id="settings-bio-error"
            role="alert"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {errors.bio}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          id="settings-notifications"
          type="button"
          role="switch"
          aria-checked={values.notifications}
          onClick={handleToggle}
          className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-slate-300 bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 aria-checked:bg-sky-600 dark:border-slate-600 dark:bg-slate-700 dark:focus:ring-offset-slate-950"
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block size-5 translate-y-px rounded-full bg-white shadow transition ${
              values.notifications ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
          <span className="sr-only">Email notifications</span>
        </button>
        <label
          htmlFor="settings-notifications"
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Email notifications
        </label>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-950"
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
  )
}
