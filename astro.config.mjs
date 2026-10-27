// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // The floating dev toolbar overlaps the bottom of the hero and shows up in
  // every design-comparison screenshot.
  devToolbar: { enabled: false },
  // The Automotive case study is NxtDealer now; the old address was live, so
  // it keeps working and forwards to the new one.
  redirects: {
    "/work/automotive-marketplace": "/work/nxtdealer",
  },
});
