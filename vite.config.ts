import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    server: {
        host: '0.0.0.0',
    },
    plugins: [
        react(),
        tailwindcss(),
        babel({ presets: [reactCompilerPreset()] })
    ],
})
