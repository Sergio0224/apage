/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        Poppins: ["Poppins", "sans-serif"]
      },
      screens: {
        "desktop+": "1920px"
      },
      colors: {
        // Configure your color palette here
        'stiletto': {
          '50': '#fcf6f4',
          '100': '#f9ecea',
          '200': '#f4d9d7',
          '300': '#ebbab6',
          '400': '#de948e',
          '500': '#cf6764',
          '600': '#b84647',
          '700': '#a73a3e',
          '800': '#822f35',
          '900': '#702b32',
          '950': '#3d1416',
        },
        'sea-green': {
          '50': '#f3faf3',
          '100': '#e4f4e5',
          '200': '#cae8cc',
          '300': '#a0d5a5',
          '400': '#6fb976',
          '500': '#4b9c53',
          '600': '#3f8d47',
          '700': '#306536',
          '800': '#2a512f',
          '900': '#244328',
          '950': '#0f2412',
        },
        'big-stone': {
          '50': '#f4f7fb',
          '100': '#e8eef6',
          '200': '#cbddec',
          '300': '#9dc1dc',
          '400': '#689fc8',
          '500': '#4583b2',
          '600': '#346995',
          '700': '#2b5479',
          '800': '#274865',
          '900': '#253d55',
          '950': '#19293a',
        },
        'vista-white': {
          '50': '#fffafa',
          '100': '#ffe0e0',
          '200': '#ffc6c6',
          '300': '#ff9e9e',
          '400': '#ff6666',
          '500': '#fd3636',
          '600': '#eb1717',
          '700': '#c60f0f',
          '800': '#a31111',
          '900': '#871515',
          '950': '#4a0505',
        },
        'bunker': {
          '50': '#f5f8fa',
          '100': '#eaeff4',
          '200': '#d0dde7',
          '300': '#a6c1d3',
          '400': '#769eba',
          '500': '#5582a2',
          '600': '#416988',
          '700': '#36546e',
          '800': '#30495c',
          '900': '#2c3f4e',
          '950': '#0f151b',
        },
        //dark mode colors
        'danube': {
          '50': '#f2f7fc',
          '100': '#e1ecf8',
          '200': '#c9dff4',
          '300': '#a4cbec',
          '400': '#79afe1',
          '500': '#5c93d8',
          '600': '#4578cb',
          '700': '#3c65b9',
          '800': '#365397',
          '900': '#304878',
          '950': '#212d4a',
        },

        'well-read': {
          '50': '#fcf4f4',
          '100': '#fae6e6',
          '200': '#f7d1d1',
          '300': '#f1b0b0',
          '400': '#e78282',
          '500': '#d95a5a',
          '600': '#c53d3d',
          '700': '#b03333',
          '800': '#892b2b',
          '900': '#732929',
          '950': '#3e1111',
        },


      },
      backgroundImage: {
        //'Nombre': "url('directorio donde esta el archivo')",
        'homeBg': "url('/src/assets/images/bg.svg')"
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

