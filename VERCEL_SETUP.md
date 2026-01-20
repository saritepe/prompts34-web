# Vercel Deployment Setup

This guide will help you deploy the Prompts34 web application to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your API backend running at `https://api.prompts34.com`
- Git repository pushed to GitHub/GitLab/Bitbucket

## Step 1: Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your Git repository
4. Select the `prompts34-web` directory (or root if this is the only project)

## Step 2: Configure Project Settings

### Framework Preset
- Vercel should auto-detect **Next.js**
- If not, select it manually

### Build Settings
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

## Step 3: Environment Variables

Add these environment variables in the Vercel dashboard:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://api.prompts34.com` | Your backend API URL |
| `NEXT_PUBLIC_APP_URL` | `https://prompts34.com` | Your app URL (custom domain) |

### How to Add Environment Variables:

1. In your Vercel project settings, go to **Settings → Environment Variables**
2. Add each variable:
   - Enter variable name (e.g., `NEXT_PUBLIC_API_URL`)
   - Enter value (e.g., `https://api.prompts34.com`)
   - Select environments: **Production**, **Preview**, and **Development**
3. Click **Save**

## Step 4: Deploy

1. Click **Deploy**
2. Wait for the build to complete
3. Your app will be live at `https://your-project.vercel.app`

## Step 5: Custom Domain Setup

To use `prompts34.com` as your domain:

1. Go to **Settings → Domains** in your Vercel project
2. Add your domain: `prompts34.com`
3. Configure DNS records as instructed by Vercel:
   - Add an A record pointing to Vercel's IP: `76.76.21.21`
   - Or add a CNAME record pointing to `cname.vercel-dns.com`
4. Wait for DNS propagation (can take up to 48 hours, usually faster)
5. Vercel will automatically issue SSL certificate

## Step 6: Backend CORS Configuration

Make sure your backend API allows requests from your Vercel domain:

```python
# In your FastAPI backend
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",           # Local development
        "https://prompts34.com",            # Production domain
        "https://*.vercel.app",             # Preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches or pull requests

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check backend CORS settings
- Ensure API is accessible from Vercel's servers

### Environment Variables Not Working
- Make sure variable names start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding/changing environment variables
- Check that variables are set for the correct environment (Production/Preview/Development)

## Local Development with Production API

To test with production API locally:

```bash
NEXT_PUBLIC_API_URL=https://api.prompts34.com npm run dev
```

Or update `.env.local`:
```
NEXT_PUBLIC_API_URL=https://api.prompts34.com
```

## Useful Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from CLI
vercel

# Deploy to production
vercel --prod

# Check deployment logs
vercel logs

# Pull environment variables from Vercel
vercel env pull
```

## Security Checklist

- ✅ Environment variables properly set
- ✅ API using HTTPS (not HTTP)
- ✅ CORS configured on backend
- ✅ No sensitive data in client-side code
- ✅ `.env.local` in `.gitignore`

## Next Steps

After successful deployment:
1. Test authentication flow
2. Verify prompt creation/viewing
3. Check responsive design on mobile
4. Monitor error logs in Vercel dashboard
5. Set up analytics (optional)

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
