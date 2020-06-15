import React, { useContext, createContext } from 'react'

export const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee',
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222',
  }
}

const ThemeContext = createContext(themes.light)

export const useTheme = () => {
  const theme = useContext(ThemeContext)

  return { theme }
}


export const ThemeProvider = ({ children, theme }) => 
  <ThemeContext.Provider value={theme}>
    {children}
  </ThemeContext.Provider>
