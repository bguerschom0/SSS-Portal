import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();
  export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme || 'light';
    });

    const [colorScheme, setColorSchemeState] = useState(() => {
      const savedColor = localStorage.getItem('colorScheme');
      return savedColor || 'emerald';
    });

    useEffect(() => {
      document.documentElement.className = theme;
      localStorage.setItem('theme', theme);
    }, [theme]);

    const setColorScheme = (newColor) => {
      document.documentElement.setAttribute('data-color', newColor);
      localStorage.setItem('colorScheme', newColor);
      setColorSchemeState(newColor);
      // Force re-render of components
      window.dispatchEvent(new Event('colorschemechange'));
    };

    // Add color scheme effect
    useEffect(() => {
      document.documentElement.setAttribute('data-color', colorScheme);
    }, [colorScheme]);

    const updateTheme = (newTheme) => {
      if (newTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(systemTheme);
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(systemTheme);
      } else {
        setTheme(newTheme);
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(newTheme);
      }
    
      // Apply theme to body
      document.body.className = newTheme === 'dark' ? darkModeClasses.background : lightModeClasses.background;
    };

    const value = {
      theme,
      colorScheme,
      updateTheme,
      setColorScheme
    };

    return (
      <ThemeContext.Provider value={value}>
        {children}
      </ThemeContext.Provider>
    );
  };

  export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
      throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
  };
