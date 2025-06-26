/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fefce8',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'glow': '0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)',
        'glow-md': '0 4px 14px 0 rgba(59, 130, 246, 0.15)',
        'glow-lg': '0 10px 40px rgba(59, 130, 246, 0.15), 0 4px 25px rgba(59, 130, 246, 0.06)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 2s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-out-right': 'slideOutRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        fadeOut: {
          '0%': {
            opacity: '1',
          },
          '100%': {
            opacity: '0',
          },
        },
        slideInRight: {
          '0%': {
            transform: 'translateX(100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        slideOutRight: {
          '0%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateX(100%)',
            opacity: '0',
          },
        },
        scaleIn: {
          '0%': {
            transform: 'scale(0.9)',
            opacity: '0',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        scaleOut: {
          '0%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(0.9)',
            opacity: '0',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
        'gradient-success': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        'gradient-warning': 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
        'gradient-error': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
        '5000': '5000ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      minHeight: {
        '96': '24rem',
        'screen-1/2': '50vh',
        'screen-3/4': '75vh',
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
      },
    },
  },
  plugins: [
    function({ addUtilities, addComponents }) {
      // Add custom utility classes
      addUtilities({
        '.text-gradient': {
          'background': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.glass-effect': {
          'background': 'rgba(255, 255, 255, 0.25)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.18)',
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#cbd5e1 #f1f5f9',
        },
        '.scrollbar-thin::-webkit-scrollbar': {
          'width': '6px',
        },
        '.scrollbar-thin::-webkit-scrollbar-track': {
          'background': '#f1f5f9',
        },
        '.scrollbar-thin::-webkit-scrollbar-thumb': {
          'background': '#cbd5e1',
          'border-radius': '3px',
        },
        '.scrollbar-thin::-webkit-scrollbar-thumb:hover': {
          'background': '#94a3b8',
        },
      });

      // Add custom component classes
      addComponents({
        // Button Components
        '.btn': {
          '@apply inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200': {},
        },
        '.btn-primary': {
          '@apply bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500': {},
        },
        '.btn-secondary': {
          '@apply bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500': {},
        },
        '.btn-success': {
          '@apply bg-success-600 text-white hover:bg-success-700 focus:ring-success-500': {},
        },
        '.btn-warning': {
          '@apply bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500': {},
        },
        '.btn-danger': {
          '@apply bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500': {},
        },
        '.btn-outline': {
          '@apply bg-transparent border-secondary-300 text-secondary-700 hover:bg-secondary-50': {},
        },
        '.btn-lg': {
          '@apply px-6 py-3 text-base': {},
        },
        '.btn-sm': {
          '@apply px-3 py-1.5 text-xs': {},
        },
        '.btn-disabled': {
          '@apply opacity-50 cursor-not-allowed': {},
        },

        // Card Components
        '.card': {
          '@apply bg-white rounded-lg shadow-md border border-secondary-200 overflow-hidden': {},
        },
        '.card-header': {
          '@apply px-6 py-4 border-b border-secondary-200 bg-secondary-50': {},
        },
        '.card-body': {
          '@apply px-6 py-4': {},
        },
        '.card-footer': {
          '@apply px-6 py-4 border-t border-secondary-200 bg-secondary-50': {},
        },
        '.card-hover': {
          '@apply transition-shadow duration-300 hover:shadow-lg': {},
        },

        // Form Components
        '.form-group': {
          '@apply mb-4': {},
        },
        '.form-label': {
          '@apply block text-sm font-medium text-secondary-700 mb-2': {},
        },
        '.form-input': {
          '@apply block w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500': {},
        },
        '.form-input-error': {
          '@apply border-error-300 focus:ring-error-500 focus:border-error-500': {},
        },
        '.form-error': {
          '@apply mt-1 text-sm text-error-600': {},
        },
        '.form-help': {
          '@apply mt-1 text-sm text-secondary-500': {},
        },

        // Alert Components
        '.alert': {
          '@apply px-4 py-3 rounded-md border': {},
        },
        '.alert-success': {
          '@apply bg-success-50 text-success-800 border-success-200': {},
        },
        '.alert-warning': {
          '@apply bg-warning-50 text-warning-800 border-warning-200': {},
        },
        '.alert-error': {
          '@apply bg-error-50 text-error-800 border-error-200': {},
        },
        '.alert-info': {
          '@apply bg-primary-50 text-primary-800 border-primary-200': {},
        },

        // Badge Components
        '.badge': {
          '@apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': {},
        },
        '.badge-primary': {
          '@apply bg-primary-100 text-primary-800': {},
        },
        '.badge-success': {
          '@apply bg-success-100 text-success-800': {},
        },
        '.badge-warning': {
          '@apply bg-warning-100 text-warning-800': {},
        },
        '.badge-danger': {
          '@apply bg-danger-100 text-danger-800': {},
        },

        // Modal Components
        '.modal-overlay': {
          '@apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50': {},
        },
        '.modal-content': {
          '@apply bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-auto': {},
        },
        '.modal-header': {
          '@apply px-6 py-4 border-b border-secondary-200': {},
        },
        '.modal-body': {
          '@apply px-6 py-4': {},
        },
        '.modal-footer': {
          '@apply px-6 py-4 border-t border-secondary-200 flex justify-end space-x-3': {},
        },

        // Table Components
        '.table': {
          '@apply min-w-full divide-y divide-secondary-200': {},
        },
        '.table-header': {
          '@apply bg-secondary-50': {},
        },
        '.table-header-cell': {
          '@apply px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider': {},
        },
        '.table-body': {
          '@apply bg-white divide-y divide-secondary-200': {},
        },
        '.table-row': {
          '@apply hover:bg-secondary-50': {},
        },
        '.table-cell': {
          '@apply px-6 py-4 whitespace-nowrap text-sm text-secondary-900': {},
        },

        // Navigation Components
        '.nav': {
          '@apply flex space-x-8': {},
        },
        '.nav-link': {
          '@apply text-secondary-500 hover:text-secondary-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200': {},
        },
        '.nav-link-active': {
          '@apply text-primary-600 bg-primary-50': {},
        },

        // Sidebar Components
        '.sidebar': {
          '@apply bg-white shadow-lg border-r border-secondary-200 h-full': {},
        },
        '.sidebar-header': {
          '@apply px-6 py-4 border-b border-secondary-200': {},
        },
        '.sidebar-nav': {
          '@apply mt-6': {},
        },
        '.sidebar-nav-item': {
          '@apply flex items-center px-6 py-3 text-sm font-medium text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 transition-colors duration-200': {},
        },
        '.sidebar-nav-item-active': {
          '@apply text-primary-600 bg-primary-50 border-r-2 border-primary-600': {},
        },

        // Progress Components
        '.progress': {
          '@apply w-full bg-secondary-200 rounded-full h-2': {},
        },
        '.progress-bar': {
          '@apply bg-primary-600 h-2 rounded-full transition-all duration-300': {},
        },
        '.progress-success': {
          '@apply bg-success-600': {},
        },
        '.progress-warning': {
          '@apply bg-warning-600': {},
        },
        '.progress-danger': {
          '@apply bg-danger-600': {},
        },

        // Loading Components
        '.loading-spinner': {
          '@apply animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600': {},
        },
        '.loading-dots': {
          '@apply flex space-x-1': {},
        },
        '.loading-dot': {
          '@apply w-2 h-2 bg-primary-600 rounded-full animate-pulse': {},
        },

        // Spinner component
        '.spinner': {
          'border': '2px solid #f1f5f9',
          'border-top': '2px solid #3b82f6',
          'border-radius': '50%',
          'width': '20px',
          'height': '20px',
          'animation': 'spin 1s linear infinite',
        },
      });
    },
  ],
  darkMode: 'media',
}
