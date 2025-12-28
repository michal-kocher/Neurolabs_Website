// API Configuration
// W produkcji użyj URL z Vercel, w dev - localhost
// Możesz ustawić VITE_API_URL w .env.production
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://your-api.vercel.app'  // TODO: Zmień na prawdziwy URL po deploy na Vercel
    : 'http://localhost:3000');

export default API_URL;

