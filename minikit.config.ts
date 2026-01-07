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
    header: "eyJmaWQiOjE1MzkxMjMsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg2YkFkMTE1NmZGMjI2RTgxMWMzMDgzQWRlMTI4RjFDNEJGQkIzRDZmIn0",
    payload: "eyJkb21haW4iOiJzZWVyYmFzZTEtYWxla3NleXMtcHJvamVjdHMtY2E5OGRlYzEudmVyY2VsLmFwcCJ9",
    signature: "EcvQgF6dCDm/w+tyBRmnMBYqMtvUOGBG29cialy2mS4TCUdq8Kxg+CmkORR0xT1LyKnjBiYyCZkRbOgrAXZgBBw="
  },
  miniapp: {
    version: "1",
    name: "Daily Base Quest",
    subtitle: "Daily quests. Streaks. Points.",
    description: "Complete 3–5 daily quests in the Base ecosystem. Build your streak, earn points, climb the leaderboard.",
    screenshotUrls: [`${ROOT_URL}/screenshot.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#1a1a1f",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "utility",
    tags: ["quests", "streak", "points", "base", "daily"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "3 quests a day. One streak to rule them all.",
    ogTitle: "Daily Base Quest",
    ogDescription: "Complete daily Base quests, earn points, keep your streak, and climb the leaderboard.",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
  baseBuilder: {
    // TODO: replace with the owner address for the account that will publish this mini app
    ownerAddress: "0x476a4bd984714e970Eb8330Bc46A52469C0A57Dd"
  }
} as const;

