export const backendPrefix = import.meta.env.VITE_API_URL || 'https://viralmotion-backend-ghxi.onrender.com';
export const remotion_lambda_serve_url = "https://remotionlambda-useast1-ov4ef5yc3h.s3.us-east-1.amazonaws.com/sites/viral-motion/index.html";
export const remotion_lambda_site_name = "viral-motion";

// Stripe Configuration
export const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

// Debug: Log if Stripe key is loaded (remove in production)
if (!stripePublishableKey) {
  console.warn('⚠️ Stripe publishable key is not set. Check your .env file for VITE_STRIPE_PUBLISHABLE_KEY');
}
