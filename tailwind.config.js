/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lms: {
          // Text Colors
          'text-primary': 'rgb(61, 229, 52)',    // Green text
          'text-secondary': 'rgb(255, 255, 255)', // White text
          
          // Accent/UI Elements
          'accent-primary': 'rgb(238, 255, 0)',   // Bright yellow
          'accent-light': 'rgba(238, 255, 0, 0.2)', // Transparent yellow
          'neutral': 'rgb(135, 136, 137)',        // Medium gray
          'dark': 'rgb(24, 24, 24)',              // Near black
          
          // Background Colors
          'bg-primary': 'rgb(21, 21, 21)',        // Dark background
          'bg-secondary': 'rgb(204, 204, 204)',   // Light gray background
          'bg-tertiary': 'rgb(31, 31, 31)',       // Slightly lighter dark background
          
          // Border Colors
          'border': 'rgb(77, 77, 77)'            // Dark gray border
        }
      },
      gridTemplateColumns: {
        'auto': 'repeat(auto-fit, minmax(200px, 1fr))'
      },
      spacing: {
        'section-height': '500px',
      },
      fontSize: {
        'default': ['15px', '21px'],
        'course-deatails-heading-small': ['26px', '36px'],
        'course-deatails-heading-large': ['36px', '44px'],
        'home-heading-small': ['28px', '34px'],
        'home-heading-large': ['48px', '56px'],
      },
      maxWidth: {
        'course-card': '424px',
      },
      boxShadow: {
        'custom-card': '0px 4px 15px 2px rgba(0, 0, 0, 0.1)',
        'lms-card': '0px 4px 15px 2px rgba(61, 229, 52, 0.1)',
      },
    },
  },
  plugins: [],
}