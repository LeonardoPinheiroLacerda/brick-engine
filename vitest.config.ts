import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@client-game': path.resolve(__dirname, './src/core/Game.ts'),
        },
    },
    test: {
        globals: true,
        environment: 'node',
    },
});
