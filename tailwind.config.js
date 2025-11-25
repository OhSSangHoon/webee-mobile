/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
    "./shared/**/*.{js,jsx,ts,tsx}",
    "./widgets/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [
    require('nativewind/preset'),
  ],
  theme: {
    extend: {
      maxWidth: {
        'mobile': '375px',
      },
      colors: {
        primary: '#F59E0B', // webee 메인 컬러
      },
    },
  },
  plugins: [],
}