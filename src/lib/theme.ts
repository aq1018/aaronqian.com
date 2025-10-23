export type Theme = 'light' | 'dark' | 'system'

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  return 'system'
}

export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('theme', theme)
}

export function isDark(theme: Theme): boolean {
  if (typeof window === 'undefined') return false

  if (theme === 'dark') return true
  if (theme === 'light') return false

  // System theme - check OS preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return

  const dark = isDark(theme)

  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export function getNextTheme(currentTheme: Theme): Theme {
  if (currentTheme === 'light') return 'dark'
  if (currentTheme === 'dark') return 'system'
  return 'light'
}
