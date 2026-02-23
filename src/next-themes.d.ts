declare module 'next-themes' {
  import * as React from 'react'

  export interface ThemeProviderProps extends React.PropsWithChildren {
    themes?: string[]
    forcedTheme?: string
    enableSystem?: boolean
    disableTransitionOnChange?: boolean
    enableColorScheme?: boolean
    storageKey?: string
    defaultTheme?: string
    attribute?: string | string[]
    value?: Record<string, string>
    nonce?: string
  }

  export const ThemeProvider: React.ComponentType<ThemeProviderProps>
  export function useTheme(): {
    theme?: string
    setTheme: React.Dispatch<React.SetStateAction<string>>
    resolvedTheme?: string
    themes: string[]
  }
}
