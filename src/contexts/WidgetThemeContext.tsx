'use client'

import { createContext, useContext, ReactNode } from 'react'

export interface WidgetTheme {
  // Background colors
  backgroundColor: string
  cardBackground: string
  
  // Text colors
  primaryText: string
  secondaryText: string
  labelText: string
  
  // Accent colors
  primaryColor: string
  successColor: string
  errorColor: string
  
  // Input colors
  inputBackground: string
  inputBorder: string
  inputFocusBorder: string
  inputText: string
  inputPlaceholder: string
  
  // Button colors
  primaryButton: string
  primaryButtonHover: string
  primaryButtonText: string
  secondaryButton: string
  secondaryButtonHover: string
  secondaryButtonText: string
  
  // Progress bar
  progressBackground: string
  progressFill: string
  
  // Border colors
  borderColor: string
  borderColorLight: string
}

export const defaultWidgetTheme: WidgetTheme = {
  // Background colors - Dark theme to match website
  backgroundColor: '#000000', // black
  cardBackground: '#1f2937', // gray-800
  
  // Text colors
  primaryText: '#ffffff', // white
  secondaryText: '#9ca3af', // gray-400
  labelText: '#f3f4f6', // gray-100
  
  // Accent colors
  primaryColor: '#60a5fa', // blue-400
  successColor: '#34d399', // emerald-400
  errorColor: '#f87171', // red-400
  
  // Input colors
  inputBackground: '#374151', // gray-700
  inputBorder: '#4b5563', // gray-600
  inputFocusBorder: '#60a5fa', // blue-400
  inputText: '#ffffff', // white
  inputPlaceholder: '#9ca3af', // gray-400
  
  // Button colors
  primaryButton: '#60a5fa', // blue-400
  primaryButtonHover: '#3b82f6', // blue-500
  primaryButtonText: '#ffffff', // white
  secondaryButton: '#374151', // gray-700
  secondaryButtonHover: '#4b5563', // gray-600
  secondaryButtonText: '#f3f4f6', // gray-100
  
  // Progress bar
  progressBackground: '#374151', // gray-700
  progressFill: '#60a5fa', // blue-400
  
  // Border colors
  borderColor: '#4b5563', // gray-600
  borderColorLight: '#374151', // gray-700
}

const WidgetThemeContext = createContext<WidgetTheme>(defaultWidgetTheme)

export const useWidgetTheme = () => useContext(WidgetThemeContext)

interface WidgetThemeProviderProps {
  children: ReactNode
  theme?: Partial<WidgetTheme>
}

export function WidgetThemeProvider({ children, theme = {} }: WidgetThemeProviderProps) {
  const mergedTheme = { ...defaultWidgetTheme, ...theme }
  
  return (
    <WidgetThemeContext.Provider value={mergedTheme}>
      {children}
    </WidgetThemeContext.Provider>
  )
}