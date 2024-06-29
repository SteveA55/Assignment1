import { defineConfig } from 'vite';
import myCustomPlugin from './vitest-openapi-plugin';

export default defineConfig({
    plugins: [myCustomPlugin()]
});