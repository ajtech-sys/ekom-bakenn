export type EkomConfig = {
  appName: string
  port: number
  currency: string
  defaultLocale: string
  databaseUrl: string
  redisUrl?: string
  jwtSecret: string
  paymentProvider: 'none' | 'stripe'
  stripeSecretKey?: string
  logLevel?: string
}

export const config: EkomConfig = {
  appName: process.env.APP_NAME || 'Ekom',
  port: parseInt(process.env.PORT || '3000', 10),
  currency: process.env.CURRENCY || 'HTG',
  defaultLocale: process.env.DEFAULT_LOCALE || 'ht_HT',
  databaseUrl: process.env.DATABASE_URL || '',
  redisUrl: process.env.REDIS_URL,
  jwtSecret: process.env.JWT_SECRET || '',
  paymentProvider: (process.env.PAYMENT_PROVIDER as 'none' | 'stripe') || 'none',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  logLevel: process.env.LOG_LEVEL || 'info',
}

export default config
