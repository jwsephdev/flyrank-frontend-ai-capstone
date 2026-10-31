import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import SettingsForm from './SettingsForm'

function renderForm(onSave = vi.fn()) {
  const user = userEvent.setup()
  const view = render(<SettingsForm onSave={onSave} />)
  return { user, onSave, ...view }
}

describe('SettingsForm validation', () => {
  it('shows "Name is required" for whitespace-only name on blur', async () => {
    const { user } = renderForm()
    const name = screen.getByLabelText(/display name/i)
    await user.type(name, '   ')
    await user.tab()
    expect(await screen.findByText('Name is required')).toBeInTheDocument()
  })

  it('shows "Name must be 2-50 characters" for a single character on blur', async () => {
    const { user } = renderForm()
    const name = screen.getByLabelText(/display name/i)
    await user.type(name, 'A')
    await user.tab()
    expect(await screen.findByText('Name must be 2-50 characters')).toBeInTheDocument()
  })

  it('shows "Name must be 2-50 characters" for a name longer than 50 on blur', async () => {
    const { user } = renderForm()
    const name = screen.getByLabelText(/display name/i)
    await user.click(name)
    await user.paste('A'.repeat(51))
    await user.tab()
    expect(await screen.findByText('Name must be 2-50 characters')).toBeInTheDocument()
  })

  it('shows "Email is required" when email is empty on blur', async () => {
    const { user } = renderForm()
    const email = screen.getByLabelText(/^email$/i)
    await user.click(email)
    await user.tab()
    expect(await screen.findByText('Email is required')).toBeInTheDocument()
  })

  it('shows "Enter a valid email address" for invalid email on blur', async () => {
    const { user } = renderForm()
    const email = screen.getByLabelText(/^email$/i)
    await user.type(email, 'abc')
    await user.tab()
    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument()
  })

  it('does not show an email error for a valid address like a@b.co', async () => {
    const { user } = renderForm()
    const email = screen.getByLabelText(/^email$/i)
    await user.type(email, 'a@b.co')
    await user.tab()
    expect(screen.queryByText('Enter a valid email address')).not.toBeInTheDocument()
    expect(screen.queryByText('Email is required')).not.toBeInTheDocument()
  })

  it('shows bio max-length error for 161 characters', async () => {
    const { user } = renderForm()
    const bio = screen.getByLabelText(/^bio$/i)
    await user.click(bio)
    await user.paste('x'.repeat(161))
    await user.tab()
    expect(
      await screen.findByText('Bio must be 160 characters or fewer'),
    ).toBeInTheDocument()
  })

  it('allows an empty bio because bio is optional', async () => {
    const { user, onSave } = renderForm()
    await user.type(screen.getByLabelText(/display name/i), 'Ada Lovelace')
    await user.type(screen.getByLabelText(/^email$/i), 'ada@example.com')
    await user.click(screen.getByRole('button', { name: /save settings/i }))

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1)
    })
    expect(onSave).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      bio: '',
      notifications: false,
    })
    expect(screen.queryByText('Bio must be 160 characters or fewer')).not.toBeInTheDocument()
  })

  it('clears a field error as soon as the value becomes valid', async () => {
    const { user } = renderForm()
    const name = screen.getByLabelText(/display name/i)
    await user.type(name, 'A')
    await user.tab()
    expect(await screen.findByText('Name must be 2-50 characters')).toBeInTheDocument()
    await user.clear(name)
    await user.type(name, 'Ada')
    await waitFor(() => {
      expect(screen.queryByText('Name must be 2-50 characters')).not.toBeInTheDocument()
    })
  })
})

describe('SettingsForm submit behavior', () => {
  it('shows name and email errors and focuses name when submitting empty', async () => {
    const { user, container } = renderForm()
    await user.click(screen.getByRole('button', { name: /save settings/i }))

    const form = container.querySelector('form')
    const alerts = within(form).getAllByRole('alert')
    expect(alerts).toHaveLength(2)
    expect(alerts.map((node) => node.textContent)).toEqual([
      'Name is required',
      'Email is required',
    ])
    expect(screen.getByLabelText(/display name/i)).toHaveFocus()
  })

  it('calls onSave with trimmed values and shows status message', async () => {
    const { user, onSave } = renderForm()

    await user.type(screen.getByLabelText(/display name/i), '  Ada Lovelace  ')
    await user.type(screen.getByLabelText(/^email$/i), '  ada@example.com  ')
    await user.type(screen.getByLabelText(/^bio$/i), '  Mathematician  ')
    await user.click(screen.getByLabelText(/email notifications/i))
    await user.click(screen.getByRole('button', { name: /save settings/i }))

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1)
    })
    expect(onSave).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      bio: 'Mathematician',
      notifications: true,
    })
    expect(await screen.findByRole('status')).toHaveTextContent('Settings saved')
  })

  it('disables submit while saving to prevent double submission', async () => {
    let resolveSave
    const onSave = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveSave = resolve
        }),
    )
    const { user } = renderForm(onSave)

    await user.type(screen.getByLabelText(/display name/i), 'Ada Lovelace')
    await user.type(screen.getByLabelText(/^email$/i), 'ada@example.com')

    const submit = screen.getByRole('button', { name: /save settings/i })
    await user.click(submit)

    expect(submit).toBeDisabled()
    expect(onSave).toHaveBeenCalledTimes(1)

    await user.click(submit)
    expect(onSave).toHaveBeenCalledTimes(1)

    resolveSave()
    await waitFor(() => {
      expect(submit).not.toBeDisabled()
    })
  })
})

describe('SettingsForm bio counter and toggle', () => {
  it('shows a live bio character counter', async () => {
    const { user } = renderForm()
    expect(screen.getByText('0 / 160')).toBeInTheDocument()
    await user.type(screen.getByLabelText(/^bio$/i), 'Hello')
    expect(screen.getByText('5 / 160')).toBeInTheDocument()
  })

  it('toggles notifications with Space and Enter', async () => {
    const { user } = renderForm()
    const toggle = screen.getByRole('switch', { name: /email notifications/i })

    expect(toggle).toHaveAttribute('aria-checked', 'false')
    toggle.focus()
    await user.keyboard(' ')
    expect(toggle).toHaveAttribute('aria-checked', 'true')
    await user.keyboard('{Enter}')
    expect(toggle).toHaveAttribute('aria-checked', 'false')
  })
})
