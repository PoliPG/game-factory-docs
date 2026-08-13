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
  build: {
    rollupOptions: {
      output: {
        // Nombres de archivo estables, sin hash de contenido. GitHub Pages
        // cachea el HTML diez minutos: con hash, un index.html cacheado pide
        // un bundle que el despliegue siguiente ya ha borrado, y la pagina se
        // queda cargando para siempre. Con nombres fijos el archivo existe
        // siempre; como mucho se sirve una version cacheada durante unos
        // minutos, que es un problema mucho menor.
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
