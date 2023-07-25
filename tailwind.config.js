function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`
    }
    return `rgb(var(${variable}), ${opacityValue})`
  }
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      textColor: {
        skin: {
          base: withOpacityValue('--color-text-base'),
          muted: withOpacityValue('--color-text-muted'),
          inverted: withOpacityValue('--color-text-inverted'),
          'text-body': withOpacityValue('--color-text-body'),
          'text-body-muted': withOpacityValue('--color-text-body-muted'),
        },
      },
      backgroundColor: {
        skin: {
          fill: withOpacityValue('--color-fill'),
          'button-accent': withOpacityValue('--color-button-accent'),
          'button-accent-hover': withOpacityValue('--color-button-accent-hover'),
          'button-muted': withOpacityValue('--color-button-muted'),
        }
      },
      colors: {
        skin: {
          base: withOpacityValue('--color-text-base'),
          muted: withOpacityValue('--color-text-muted'),
          inverted: withOpacityValue('--color-text-inverted'),
          'text-body': withOpacityValue('--color-text-body'),
          'text-body-muted': withOpacityValue('--color-text-body-muted'),
          fill: withOpacityValue('--color-fill'),
          'button-accent': withOpacityValue('--color-button-accent'),
          'button-accent-hover': withOpacityValue('--color-button-accent-hover'),
          'button-muted': withOpacityValue('--color-button-muted'),

          'seat-available': withOpacityValue('--color-seat-available'),
          'seat-selected': withOpacityValue('--color-seat-selected'),
          'seat-booked': withOpacityValue('--color-seat-booked'),
          'seat-reserved': withOpacityValue('--color-seat-reserved'),
        }
      }
    },
  },
  plugins: [],
}