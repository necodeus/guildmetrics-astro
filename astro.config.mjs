import { defineConfig, envField } from 'astro/config';
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
  env: {
    schema: {
      PORT: envField.number({ context: "server", access: "public", default: 4321 }),
      ASTRO_GUILDMETRICS_BASE_URL: envField.string({ context: "server", access: "secret" }),
      ASTRO_GUILDMETRICS_USER: envField.string({ context: "server", access: "secret", optional: true }),
      ASTRO_GUILDMETRICS_PASS: envField.string({ context: "server", access: "secret", optional: true }),
    }
  },
});