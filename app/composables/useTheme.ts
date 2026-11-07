type Theme = 'light' | 'dark'

/** Light/dark theme with system default and persisted user choice. */
export function useTheme() {
  const theme = useState<Theme>('theme', () => 'light')

  const apply = (value: Theme) => {
    theme.value = value
    document.documentElement.dataset.theme = value
    try { localStorage.setItem('theme', value) } catch { /* storage unavailable */ }
  }

  const init = () => {
    const explicit = document.documentElement.dataset.theme
    if (explicit === 'light' || explicit === 'dark') {
      theme.value = explicit
    } else {
      theme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
  }

  const toggle = () => apply(theme.value === 'dark' ? 'light' : 'dark')

  return { theme, init, toggle }
}
