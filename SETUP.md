# SeerBase - Quick Setup Guide

## Overview
SeerBase is a magic oracle Mini App that provides instant Yes/No answers to your questions.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Get your API key from: https://portal.cdp.coinbase.com/
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here

# Leave empty for local development
NEXT_PUBLIC_URL=
```

### 3. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

### 4. Build for Production
```bash
npm run build
npm start
```

## Configuration

All app settings are in `minikit.config.ts`:

```typescript
export const minikitConfig = {
  accountAssociation: {
    header: "",      // Fill after signing manifest
    payload: "",     // Fill after signing manifest
    signature: ""    // Fill after signing manifest
  },
  miniapp: {
    version: "2",
    name: "SeerBase",
    subtitle: "Your instant answer Yes or No.",
    description: "Just ask a question and tap the screen.",
    // ... more settings
  },
}
```

## Required Images

The following images must exist in `/public`:
- ✅ `icon-apple-magic-ball.png` - App icon (512x512px recommended)
- ✅ `hero-apple-magic-ball.png` - Hero/splash image (1200x630px recommended)
- ✅ `screenshot-apple-magic-ball-portrait.png` - App screenshot (portrait orientation)

## Deployment to Vercel

### Step 1: Deploy
```bash
npm install -g vercel
vercel --prod
```

### Step 2: Set Environment Variables
```bash
vercel env add NEXT_PUBLIC_ONCHAINKIT_API_KEY production
vercel env add NEXT_PUBLIC_URL production
```

### Step 3: Sign Your Manifest

1. Go to [Farcaster Manifest Tool](https://farcaster.xyz/~/developers/mini-apps/manifest)
2. Enter your domain (e.g., `your-app.vercel.app`)
3. Click "Generate account association"
4. Follow the signing instructions
5. Copy the `accountAssociation` object into `minikit.config.ts`
6. Deploy again: `vercel --prod`

### Step 4: Test Your App

Visit [base.dev/preview](https://base.dev/preview) and:
- Test your app URL
- Verify account association
- Check metadata

### Step 5: Publish

Share your app URL in a Farcaster post to make it live!

## Troubleshooting

### Build fails
- Make sure all dependencies are installed: `npm install`
- Check that Node.js version is 18+ : `node --version`

### App doesn't load in Base/Farcaster
- Verify your manifest is signed correctly
- Check that NEXT_PUBLIC_URL matches your deployed domain
- Ensure all images exist in `/public`

### Authentication errors
- Verify your OnchainKit API key is valid
- Check that the domain in JWT verification matches your deployment

## Features Explained

### Magic Ball Logic (`app/page.tsx`)
- User types a question
- Clicks the ball (or presses Enter)
- Ball shakes for 1.5 seconds
- Random answer appears from predefined list

### Available Answers
The app provides 15 different responses:
- Positive: Yes, Definitely, Absolutely, Without a doubt, etc.
- Negative: No, Absolutely not, Don't count on it, etc.
- Uncertain: Maybe, Ask again later, etc.

### Share Functionality (`app/success/page.tsx`)
After consulting the oracle, users can:
- Share on Farcaster using `composeCast`
- Return to ask another question

## API Endpoints

### GET/POST `/api/auth`
Authenticates users via Farcaster Quick Auth
- Verifies JWT tokens
- Returns user FID (Farcaster ID)

### GET/POST `/api/webhook`
Receives Farcaster webhook events:
- `app.installed` - User installed the app
- `app.uninstalled` - User uninstalled the app
- `app.notification` - Notification events

## Customization Ideas

1. **Add more answers**: Edit the `ANSWERS` array in `app/page.tsx`
2. **Change colors**: Update CSS in `app/page.module.css`
3. **Add animations**: Enhance the shake animation or add new effects
4. **Track questions**: Store questions in a database via webhook
5. **Add categories**: Different answer types (love, career, money)

## Support

For questions and issues:
- [Base Documentation](https://docs.base.org/)
- [OnchainKit Docs](https://onchainkit.xyz/)
- [Farcaster Mini Apps](https://miniapps.farcaster.xyz/)

Happy fortune telling! 🔮


















