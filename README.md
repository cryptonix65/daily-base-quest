# SeerBase - Magic Oracle Mini App

SeerBase is a mystical oracle Mini App built using OnchainKit and the Farcaster SDK. Get instant Yes or No answers to your burning questions by consulting the magic ball. Just ask a question and tap the screen to reveal your answer!

This app can be published to the Base app and Farcaster as a fully functional Mini App.

## Prerequisites

Before getting started, make sure you have:

* Base app account
* A [Farcaster](https://farcaster.xyz/) account
* [Vercel](https://vercel.com/) account for hosting the application
* [Coinbase Developer Platform](https://portal.cdp.coinbase.com/) Client API Key

## Features

- 🔮 Interactive magic ball interface
- ✨ Random yes/no answers to your questions
- 🎨 Beautiful, minimal Apple-inspired design
- 📱 Fully responsive mobile-first UI
- 🔗 Integration with Farcaster for sharing
- ⚡ Built on Base with OnchainKit

## Getting Started

### 1. Install dependencies:

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file and add your environment variables:

```bash
NEXT_PUBLIC_ONCHAINKIT_API_KEY=<Replace-WITH-YOUR-CDP-API-KEY>
NEXT_PUBLIC_URL=
```

### 3. Run locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the magic ball in action!

## How It Works

1. **Ask a Question**: Type any yes/no question in the input field
2. **Tap the Ball**: Click on the magic ball (or press Enter)
3. **Get Your Answer**: Watch the ball shake and reveal your answer
4. **Ask Again**: Reset and ask another question anytime
5. **Share**: Share your experience on Farcaster

## Customization

### Update Manifest Configuration

The `minikit.config.ts` file configures your manifest located at `app/.well-known/farcaster.json`.

You can customize:
- **name**: The app name displayed to users
- **subtitle**: Short tagline
- **description**: Full description of your app
- **tags**: Categories and keywords
- **images**: Icon, hero image, and screenshots
- **splashBackgroundColor**: The background color shown on launch

All images are located in the `/public` folder and referenced in the config.

## Deployment

### 1. Deploy to Vercel

```bash
vercel --prod
```

You should have a URL deployed to a domain similar to: `https://your-vercel-project-name.vercel.app/`

### 2. Update environment variables

Add your production URL to your local `.env` file:

```bash
NEXT_PUBLIC_PROJECT_NAME="Your App Name"
NEXT_PUBLIC_ONCHAINKIT_API_KEY=<Replace-WITH-YOUR-CDP-API-KEY>
NEXT_PUBLIC_URL=https://your-vercel-project-name.vercel.app/
```

### 3. Upload environment variables to Vercel

Add environment variables to your production environment:

```bash
vercel env add NEXT_PUBLIC_PROJECT_NAME production
vercel env add NEXT_PUBLIC_ONCHAINKIT_API_KEY production
vercel env add NEXT_PUBLIC_URL production
```

## Account Association

### 1. Sign Your Manifest

1. Navigate to [Farcaster Manifest tool](https://farcaster.xyz/~/developers/mini-apps/manifest)
2. Paste your domain in the form field (ex: your-vercel-project-name.vercel.app)
3. Click the `Generate account association` button and follow the on-screen instructions for signing with your Farcaster wallet
4. Copy the `accountAssociation` object

### 2. Update Configuration

Update your `minikit.config.ts` file to include the `accountAssociation` object:

```ts
export const minikitConfig = {
    accountAssociation: {
        "header": "your-header-here",
        "payload": "your-payload-here",
        "signature": "your-signature-here"
    },
    frame: {
        // ... rest of your frame configuration
    },
}
```

### 3. Deploy Updates

```bash
vercel --prod
```

## Testing and Publishing

### 1. Preview Your App

Go to [base.dev/preview](https://base.dev/preview) to validate your app:

1. Add your app URL to view the embeds and click the launch button to verify the app launches as expected
2. Use the "Account association" tab to verify the association credentials were created correctly
3. Use the "Metadata" tab to see the metadata added from the manifest and identify any missing fields

### 2. Publish to Base App

To publish your app, create a post in the Base app with your app's URL and watch your Mini App come to life!

## Tech Stack

- **Next.js 15** - React framework
- **OnchainKit** - Coinbase's toolkit for onchain apps
- **Farcaster SDK** - Integration with Farcaster protocol
- **TypeScript** - Type-safe development
- **CSS Modules** - Scoped styling

## API Routes

### `/api/auth`
Handles Farcaster authentication using Quick Auth. Verifies JWT tokens and returns user information.

### `/api/webhook`
Receives webhook events from Farcaster for app installations, uninstalls, and notifications.

## File Structure

```
seer_base1/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoint
│   │   └── webhook/       # Webhook handler
│   ├── success/           # Success/share page
│   ├── page.tsx           # Main magic ball interface
│   ├── layout.tsx         # Root layout with metadata
│   └── rootProvider.tsx   # OnchainKit provider setup
├── public/                # Static assets (images)
├── minikit.config.ts      # Mini app configuration
└── package.json
```

## Learn More

For detailed step-by-step instructions, see the official guides:
- [Create a Mini App tutorial](https://docs.base.org/mini-apps/quickstart/create-new-miniapp/)
- [OnchainKit Documentation](https://onchainkit.xyz/)
- [Farcaster Mini Apps](https://miniapps.farcaster.xyz/)

## License

MIT
