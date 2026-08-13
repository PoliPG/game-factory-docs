import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * En GitHub Pages el sitio cuelga de /<repo>/, asi que el workflow pasa
 * BASE_PATH y el HTML enlaza los assets con ruta absoluta: de ese modo la
 * pagina carga igual se entre con barra final o sin ella. Sin esa variable
 * (desarrollo, `npm run preview`, o servir dist/ desde cualquier carpeta) se
 * usan rutas relativas.
 */
const base = process.env.BASE_PATH || './';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
});
