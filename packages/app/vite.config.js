// app/vite.config.js
export default {
  publicDir: "../proto/public",
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/auth": "http://localhost:3000",
      "/images": "http://localhost:3000",
      "/login": "http://localhost:3000",
      "/register": "http://localhost:3000",
      "/trails": "http://localhost:3000",
      "/scripts": "http://localhost:3000"
    }
  }
};