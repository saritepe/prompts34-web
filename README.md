# prompts34-web

`prompts34-web` is the Next.js frontend for Prompts34. It renders the public prompt pages, authentication flow, topic pages, and prompt interaction UI, and talks to the separate API backend via `NEXT_PUBLIC_API_URL`.

## Requirements

- Node.js 20+
- npm
- A running Prompts34 API instance

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://0.0.0.0:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Start the dev server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Environment Variables

Only public client-side variables are used in this repo:

- `NEXT_PUBLIC_API_URL`: Base URL for the Prompts34 API
- `NEXT_PUBLIC_APP_URL`: Public frontend URL used for callback flows

Do not commit local `.env` files. Keep real environment values in Vercel project settings.

Production values typically look like this:

```env
NEXT_PUBLIC_API_URL=https://api.prompts34.com
NEXT_PUBLIC_APP_URL=https://prompts34.com
```

## Auth Callback Setup

This frontend expects email verification and auth callback redirects to return to:

- `http://localhost:3000/auth/callback` for local development
- `https://yourdomain.com/auth/callback` for production

If your backend uses Supabase for signup or email verification, configure the backend redirect target with your frontend URL and add the callback URLs in Supabase Authentication URL settings.

The callback page verifies the returned token with `/auth/me`, stores the session in local storage, and redirects the user back into the app.

## Deployment

This project is deployed with Vercel Git integration.

- Vercel watches the connected repository and deploys automatically from the configured default branch
- Preview deployments are created for non-default branches and pull requests
- There is no GitHub Actions deployment workflow in this repo

For Vercel:

- Import the repository and select the `prompts34-web` project directory if needed
- Let Vercel detect Next.js
- Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_APP_URL` in Vercel Environment Variables
- Add your production domain in Vercel Domains

Backend note:

- The API must allow requests from your frontend domain and preview domains
- The backend frontend URL setting should point to your public app URL so auth redirects return to `/auth/callback`
