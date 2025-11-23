// plugins/vuetify.js
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          dark: true,
          colors: {
            primary: '#22D3EE', // cyan-400
            secondary: '#334155', // slate-700
            accent: '#22D3EE',
            background: '#0F172A', // slate-900
            surface: '#1E293B', // slate-800
            error: '#EF4444',
            info: '#3B82F6',
            success: '#10B981',
            warning: '#F59E0B',
          },
        },
        light: {
          dark: false,
          colors: {
            primary: '#06B6D4', // cyan-500
            secondary: '#E2E8F0', // slate-200
            accent: '#06B6D4',
            background: '#F8FAFC', // slate-50
            surface: '#FFFFFF',
            error: '#EF4444',
            info: '#3B82F6',
            success: '#10B981',
            warning: '#F59E0B',
          },
        },
      },
    },
  })
  app.vueApp.use(vuetify)
})
