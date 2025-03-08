import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),

    NEXTAUTH_SECRET: z.string(),
    JWT_SECRET_KEY: z.string(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  },
  emptyStringAsUndefined: true,
})
