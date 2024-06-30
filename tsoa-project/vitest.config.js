import { defineConfig } from './vite.config';

export default defineConfig({
    // Use Vite's configuration file
    // This assumes that Vitest is being configured in a project that also uses Vite
    vite: {
        plugins: [
            // eslint-disable-next-line no-undef
            myCustomPlugin()
        ]
    }
});