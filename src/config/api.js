// API Configuration
// W produkcji użyj URL z Vercel, w dev - localhost
// Możesz ustawić VITE_API_URL w .env.production
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://neurolabs-website.vercel.app'
    : 'http://localhost:3000');

export default API_URL;

