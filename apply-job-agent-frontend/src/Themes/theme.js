/**
 * theme.js
 * Central file for managing color themes across the application
 */

// Warm & Welcoming (Human-centered / job Focused) Theme
export const WARM_THEME = {
    primary: '#F7F3E9',      // Warm Beige - Used for main backgrounds, headers
    accent: '#F46036',       // Burnt Orange - Used for borders, icons, highlights
    text: '#3E3E3E',         // Deep Brown - Main text color
    background: '#FFFFFF',   // White - Used for content backgrounds, cards
    cta: '#FF6B6B',          // Soft Red - Used for buttons, calls to action
    
    // Additional derived colors for various states and components
    primaryLight: 'rgba(247, 243, 233, 0.3)',  // Light version of primary (30% opacity)
    accentLight: 'rgba(244, 96, 54, 0.2)',     // Light version of accent (20% opacity)
    accentMedium: 'rgba(244, 96, 54, 0.5)',    // Medium version of accent (50% opacity)
    textSecondary: 'rgba(62, 62, 62, 0.8)',    // Secondary text (80% opacity)
    textTertiary: 'rgba(62, 62, 62, 0.7)',     // Tertiary text (70% opacity)
    disabledBg: '#E5E5E5',                     // Background for disabled elements
    disabledText: '#9E9E9E',                   // Text for disabled elements
    borderColor: 'rgba(244, 96, 54, 0.2)',     // Default border color
    shadowColor: 'rgba(0, 0, 0, 0.1)',         // Default shadow color
  };
  
  // Professional & Corporate Theme (for reference if you want to switch)
  export const CORPORATE_THEME = {
    primary: '#1A365D',      // Navy Blue - Used for main elements
    accent: '#2B6CB0',       // Medium Blue - Used for accents, highlights
    text: '#2D3748',         // Dark Gray - Main text color
    background: '#FFFFFF',   // White - Used for backgrounds
    cta: '#3182CE',          // Bright Blue - Used for calls to action
    
    // Additional derived colors
    primaryLight: 'rgba(26, 54, 93, 0.1)',     // Light version of primary (10% opacity)
    accentLight: 'rgba(43, 108, 176, 0.2)',    // Light version of accent (20% opacity)
    accentMedium: 'rgba(43, 108, 176, 0.5)',   // Medium version of accent (50% opacity)
    textSecondary: 'rgba(45, 55, 72, 0.8)',    // Secondary text (80% opacity)
    textTertiary: 'rgba(45, 55, 72, 0.6)',     // Tertiary text (60% opacity)
    disabledBg: '#E2E8F0',                     // Background for disabled elements
    disabledText: '#A0AEC0',                   // Text for disabled elements
    borderColor: 'rgba(43, 108, 176, 0.2)',    // Default border color
    shadowColor: 'rgba(0, 0, 0, 0.1)',         // Default shadow color
  };
  
  // Tech & Modern Theme (for reference if you want to switch)
  export const TECH_THEME = {
    primary: '#1A202C',      // Dark Gray - Used for main elements
    accent: '#6B46C1',       // Purple - Used for accents, highlights
    text: '#2D3748',         // Dark Gray - Main text color
    background: '#FFFFFF',   // White - Used for backgrounds
    cta: '#805AD5',          // Bright Purple - Used for calls to action
    
    // Additional derived colors
    primaryLight: 'rgba(26, 32, 44, 0.05)',    // Light version of primary (5% opacity)
    accentLight: 'rgba(107, 70, 193, 0.2)',    // Light version of accent (20% opacity)
    accentMedium: 'rgba(107, 70, 193, 0.5)',   // Medium version of accent (50% opacity)
    textSecondary: 'rgba(45, 55, 72, 0.8)',    // Secondary text (80% opacity)
    textTertiary: 'rgba(45, 55, 72, 0.6)',     // Tertiary text (60% opacity)
    disabledBg: '#E2E8F0',                     // Background for disabled elements
    disabledText: '#A0AEC0',                   // Text for disabled elements
    borderColor: 'rgba(107, 70, 193, 0.2)',    // Default border color
    shadowColor: 'rgba(0, 0, 0, 0.1)',         // Default shadow color
  };
  
  // Set the active theme - change this to switch themes
  export const activeTheme = WARM_THEME;
  
  // Function to get CSS variables for injecting into styles
  export const getCssVariables = (theme) => {
    return {
      '--color-primary': theme.primary,
      '--color-accent': theme.accent,
      '--color-text': theme.text,
      '--color-background': theme.background,
      '--color-cta': theme.cta,
      '--color-primary-light': theme.primaryLight,
      '--color-accent-light': theme.accentLight,
      '--color-accent-medium': theme.accentMedium,
      '--color-text-secondary': theme.textSecondary,
      '--color-text-tertiary': theme.textTertiary,
      '--color-disabled-bg': theme.disabledBg,
      '--color-disabled-text': theme.disabledText,
      '--color-border': theme.borderColor,
      '--color-shadow': theme.shadowColor,
    };
  };
  
  // Utility function to convert theme colors to Tailwind compatible class names
  // This is for dynamically creating classnames based on theme values
  export const getColorClass = (colorType, variant = 'default') => {
    const theme = activeTheme;
    
    // Map of color types to their variants
    const colorMap = {
      bg: {
        default: theme.background,
        primary: theme.primary,
        'primary-light': theme.primaryLight,
        accent: theme.accent,
        'accent-light': theme.accentLight,
        cta: theme.cta,
        disabled: theme.disabledBg,
      },
      text: {
        default: theme.text,
        secondary: theme.textSecondary,
        tertiary: theme.textTertiary,
        accent: theme.accent,
        cta: theme.cta,
        disabled: theme.disabledText,
        white: '#FFFFFF',
      },
      border: {
        default: theme.borderColor,
        accent: theme.accent,
        'accent-medium': theme.accentMedium,
        cta: theme.cta,
      },
    };
  
    // Return the appropriate color value or fallback to default
    return colorMap[colorType]?.[variant] || colorMap[colorType]?.default || '';
  };
  
  export default activeTheme;