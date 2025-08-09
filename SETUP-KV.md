# Upstash Redis Setup Guide

## Setup Instructions

1. **Install the package:**
   ```bash
   npm install @upstash/redis
   ```

2. **Create an Upstash Redis Database:**
   
   **Option A: Via Vercel Marketplace (Recommended)**
   - Go to your Vercel project dashboard
   - Navigate to "Storage" tab → "Browse All"
   - Find "Upstash" and click "Add Integration"
   - Create a new Redis database (free tier: 500K commands/month)
   - Environment variables will be auto-configured

   **Option B: Direct Upstash Setup**
   - Go to [upstash.com](https://upstash.com)
   - Sign up/Login → Create Database
   - Choose "Global" region for best performance
   - Copy the connection details

3. **Add Environment Variables:**
   If using Option B, create a `.env.local` file with:
   ```
   UPSTASH_REDIS_REST_URL=your_redis_rest_url_here
   UPSTASH_REDIS_REST_TOKEN=your_redis_rest_token_here
   ```

4. **Deploy to Vercel:**
   - Push your changes to Git
   - Vercel will automatically deploy with the new Redis integration
   - Questions will start being logged immediately

## How it Works

- **Questions Storage**: Each question is stored as a hash with ID, timestamp, and content
- **Timeline Index**: A sorted set maintains chronological order for easy retrieval
- **Auto-cleanup**: Keeps only the last 1000 questions to prevent storage bloat
- **Fallback**: If Redis fails, questions are logged to console as backup

## Benefits

- ✅ **Generous Free Tier**: 500K commands/month (vs Vercel KV's limited offering)
- ✅ **Always On**: No sleep/pause like other free databases
- ✅ **Multiple Databases**: No 1-database limit per account
- ✅ **Fast**: Global edge locations for low latency
- ✅ **Persistent**: Data survives deployments unlike filesystem logs
- ✅ **Vercel Integration**: Easy setup through marketplace

## Monitoring Usage

- Check your Upstash dashboard for command usage
- 500K commands = ~16K questions per month (very generous for a portfolio)
- Console logs provide backup if you ever hit limits

## Alternative Options

If you prefer not to use Upstash, you can:

1. **Console Logging Only**: Questions logged to Vercel function logs (current fallback)
2. **Other Redis Providers**: Railway, Render, etc.
3. **Different Database**: But avoid Supabase (pauses after 7 days) for portfolio sites