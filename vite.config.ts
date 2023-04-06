import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    resolve: {
        alias: {
            '~': '/resources/ts'
        }
    },
    plugins: [
        laravel({
            input: ['resources/ts/app.ts'],
            refresh: true,
        }),
    ],
});
