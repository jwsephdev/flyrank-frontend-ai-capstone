import { NavLink, Route, Routes } from 'react-router-dom'
import SettingsForm from './components/SettingsForm'
import Home from './pages/Home'

const linkClass = ({ isActive }) =>
  [
    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
  ].join(' ')

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <nav className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
          <span className="mr-4 text-sm font-semibold tracking-tight">Capstone</span>
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/settings" className={linkClass}>
            Settings
          </NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/settings"
            element={
              <div className="mx-auto max-w-lg px-4 py-12">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  Settings
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Update your profile and preferences.
                </p>
                <div className="mt-8">
                  <SettingsForm onSave={() => {}} />
                </div>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  )
}
