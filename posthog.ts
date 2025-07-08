import { PostHog } from "posthog-node"

export default function PostHogClient() {
  // Vérification que les variables d'environnement sont définies
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST
  
  if (!apiKey) {
    console.error('NEXT_PUBLIC_POSTHOG_KEY is not defined')
    throw new Error('PostHog API key is required')
  }

  const posthogClient = new PostHog(
    apiKey,
    {
      host: host || 'https://eu.i.posthog.com',
      flushAt: 1,
      flushInterval: 0,
    }
  )

  return posthogClient
}
