/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/views/**/*.pug',],
  theme: {
    extend: {colors: {

      Fondo: '#68B2A0',
      Titulos: '#003785',
      Texto: '1465bb',
      Botones: '#A1C9F1'

      
     },
     fontFamily:{
      'Custom':['Roboto', 'Arial', 'sans-serif']
     }
    },
  },
  plugins: [],
}