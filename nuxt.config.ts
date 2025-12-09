// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@vueuse/nuxt', 'nuxt-auth-sanctum'],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/api/**': {
      cors: true
    }
  },

  compatibilityDate: '2024-07-11',

  sanctum: {
    mode: 'token',
    baseUrl: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8000",
    redirect: {
      keepRequestedRoute: true,
      onGuestOnly: "/",
      onLogin: "/",
      onLogout: "/login",
    },
    redirectIfAuthenticated: true,
    redirectIfUnauthenticated: true,
    endpoints: {
      login: '/api/auth/login',
      logout: '/api/auth/logout'
    }
  },
})
