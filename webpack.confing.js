import { DefinePlugin } from 'webpack'

export const plugins = [
  new DefinePlugin({
    'process.env.NEXT_PUBLIC_API_KEY': JSON.stringify(
      process.env.NEXT_PUBLIC_API_KEY,
    ),
    'process.env.NEXT_PUBLIC_AUTH_DOMAIN': JSON.stringify(
      process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    ),
    'process.env.NEXT_PUBLIC_PROJECT_ID': JSON.stringify(
      process.env.NEXT_PUBLIC_PROJECT_ID,
    ),
    'process.env.NEXT_PUBLIC_STORAGE_BUCKET': JSON.stringify(
      process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    ),
    'process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID': JSON.stringify(
      process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    ),
    'process.env.NEXT_PUBLIC_APP_ID': JSON.stringify(
      process.env.NEXT_PUBLIC_APP_ID,
    ),
  }),
]
