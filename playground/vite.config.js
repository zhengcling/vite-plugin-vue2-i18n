import { defineConfig } from 'vite';
import { createVuePlugin } from '@yfwz100/vite-plugin-vue2';
import { createI18nPlugin } from '../dist';

export default defineConfig({
  plugins: [createVuePlugin(), createI18nPlugin()],
});
