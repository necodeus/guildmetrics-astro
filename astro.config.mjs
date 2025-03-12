import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import react from "@astrojs/react";

const isProduction = process.env.NODE_ENV === 'production';

const extra = isProduction ? {
  ssr: {
    noExternal: true
  }
} : {};

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    ...extra,
  },
  adapter: node({
    mode: "standalone"
  }),
});