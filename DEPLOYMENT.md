# eCatalog Deployment Guide

## Vercel Deployment

### Prerequisites
- Vercel account (free tier available)
- GitHub repository with your code
- Vercel CLI (optional but recommended)

### Method 1: GitHub Integration (Recommended)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository

3. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Environment Variables** (if using Supabase)
   - Add in Vercel dashboard under Settings > Environment Variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project directory**
   ```bash
   cd /path/to/ectalog
   vercel
   ```

4. **Follow prompts**
   - Link to existing project or create new
   - Set up project settings
   - Deploy

### Automatic Deployments

Once connected to GitHub, Vercel will automatically:
- Deploy on every push to main branch
- Create preview deployments for pull requests
- Run build checks and tests

### Custom Domain (Optional)

1. Go to your project dashboard on Vercel
2. Navigate to Settings > Domains
3. Add your custom domain
4. Configure DNS settings as instructed

### Build Optimization

Your `next.config.js` is already optimized for static generation:
- Pages are pre-rendered at build time
- Automatic code splitting
- Image optimization enabled

### Monitoring

- View deployment logs in Vercel dashboard
- Monitor performance with built-in analytics
- Set up alerts for failed deployments

### Troubleshooting

**Build Failures:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

**Runtime Errors:**
- Check function logs in Vercel dashboard
- Ensure API routes are properly configured
- Verify database connections (if applicable)

### Local Development vs Production

The app uses sample data by default when Supabase is not configured, making it work seamlessly in any environment without additional setup.