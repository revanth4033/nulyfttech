// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // The floating dev toolbar overlaps the bottom of the hero and shows up in
  // every design-comparison screenshot.
  devToolbar: { enabled: false },
});
