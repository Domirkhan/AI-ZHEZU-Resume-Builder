// API URLs configuration
const config = {
  development: {
    apiUrl: 'http://localhost:4000'
  },
  production: {
    // When frontend and API are deployed together on Vercel, use relative paths.
    apiUrl: 'https://aizhezu-resume-builder.vercel.app/' // production will use relative `/api` endpoints
  }
};

export const apiUrl = import.meta.env.PROD ? config.production.apiUrl : config.development.apiUrl;