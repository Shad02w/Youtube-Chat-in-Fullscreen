import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// eslint-disable-next-line import/no-default-export -- config file
export default defineConfig({
    root: path.join(__dirname, '../test'),
    server: {
        port: 3500,
        https: true
    },
    plugins: [react()]
})
