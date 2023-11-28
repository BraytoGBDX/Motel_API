/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/views/**/*.pug',],
  theme: {
    extend: {colors: {

      Fondo: '#c06500',
      Titulos: '#333',
      Texto: '#853400',
      Botones: '#48cae4'

      
     },
     fontFamily:{
      'Custom':['Roboto', 'Arial', 'sans-serif']
     }
    },
  },
  plugins: [],
}
