# Production Setup Guide

## Environment Variables

### Frontend (Next.js)

Create `.env.local` for development or set in hosting platform for production:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Important:** In production, update `NEXT_PUBLIC_APP_URL` to your actual domain!

### Backend Configuration

Set in your backend:

```python
# Use environment variable for flexibility
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# In signup endpoint
supabase.auth.sign_up({
    "email": email,
    "password": password,
    "options": {
        "email_redirect_to": f"{FRONTEND_URL}/auth/callback"
    }
})
```

## Supabase Dashboard Configuration

1. Go to: **Supabase Dashboard > Authentication > URL Configuration**
2. Add to **Redirect URLs**:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`
   - Add both if you need both environments

## Deployment Checklist

### Vercel Deployment
1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL` = your backend URL
   - `NEXT_PUBLIC_APP_URL` = your Vercel domain
4. Deploy

### Backend Deployment
1. Set `FRONTEND_URL` environment variable to your frontend domain
2. Redeploy backend

### Test Flow
1. Sign up with email
2. Check email for verification link
3. Click link → should redirect to `yourdomain.com/auth/callback`
4. Should auto-login and redirect to home

## Why Callback is Needed

When user clicks email verification link:
1. Supabase redirects: `supabase.co → yourdomain.com/auth/callback?token=xxx`
2. Callback page extracts token from URL
3. Calls `/auth/me` to verify token and get user data
4. Saves token to localStorage
5. Redirects to home page (now logged in)

Without callback page, the token would be lost and user wouldn't be logged in automatically.
