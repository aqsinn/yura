import Stripe from 'stripe'

let stripeSingleton: Stripe | null = null

export function getStripe() {
  if (stripeSingleton) return stripeSingleton
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }

  stripeSingleton = new Stripe(secretKey, {
    apiVersion: '2026-04-22.dahlia',
    appInfo: {
      name: 'Yura',
      version: '0.1.0',
    },
  })

  return stripeSingleton
}
