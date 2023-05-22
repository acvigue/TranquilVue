/** @type {import('tailwindcss').Config} */
import FormKitVariants from '@formkit/themes/tailwindcss'
import Typography from '@tailwindcss/typography'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.grey.100'),
          },
        },
      }),
      animation: {
        wiggle: 'wiggle 0.25s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-0.2deg)' },
          '50%': { transform: 'rotate(0.2deg)' },
        }
      }
    },

  },
  plugins: [Typography, FormKitVariants],
}

