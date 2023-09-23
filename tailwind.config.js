/** @type {import('tailwindcss').Config} */
export default {
  // This array defines the files that Tailwind should scan for class names.
  content: [
    "./index.html", // HTML files
    "./src/**/*.{js,ts,jsx,tsx}", // JavaScript/TypeScript files
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    "./node_modules/flowbite/**/*.js" // Flowbite module files
  ],
  // Theme customization
  theme: {
    // Extend the default color palette with custom colors
    extend: {
      colors: {
        primary: {
          "50": "#eff6ff",
          "100": "#dbeafe",
          "200": "#bfdbfe",
          "300": "#93c5fd",
          "400": "#60a5fa",
          "500": "#3b82f6",
          "600": "#2563eb",
          "700": "#1d4ed8",
          "800": "#1e40af",
          "900": "#1e3a8a",
          "950": "#172554",
        },
        secondary : '#ffed4a',
        danger : '#e3342f'
      },
    },
  },
  // Plugins configuration
  plugins: [
    // Using the Flowbite plugin for Tailwind CSS
    require('flowbite/plugin'),
    //require('tailwind-scrollbar')
  ],
}

