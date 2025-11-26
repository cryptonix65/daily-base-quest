const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: ""
  },
  miniapp: {
    version: "2",
    name: "SeerBase",
    subtitle: "Your instant answer Yes or No.",
    description: "Just ask a question and tap the screen.",
    screenshotUrls: [`${ROOT_URL}/screenshot-apple-magic-ball-portrait.png`],
    iconUrl: `${ROOT_URL}/icon-apple-magic-ball.png`,
    splashImageUrl: `${ROOT_URL}/hero-apple-magic-ball.png`,
    splashBackgroundColor: "#1a1a1f",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "utility",
    tags: ["oracle", "predictor", "yes/no", "minimal", "apple", "tool"],
    heroImageUrl: `${ROOT_URL}/hero-apple-magic-ball.png`,
    tagline: "Ask. Touch. Get an answer.",
    ogTitle: "SeerBase",
    ogDescription: "Get an instant Yes or No answer to any of your questions. Just tap on the magic ball!",
    ogImageUrl: `${ROOT_URL}/hero-apple-magic-ball.png`,
  },
} as const;

