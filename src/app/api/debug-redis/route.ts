import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ? 'SET' : 'NOT SET',
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ? 'SET' : 'NOT SET',
    REDIS_URL: process.env.REDIS_URL ? 'SET' : 'NOT SET',
    KV_REST_API_URL: process.env.KV_REST_API_URL ? 'SET' : 'NOT SET',
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? 'SET' : 'NOT SET',
  };

  let redisStatus = 'NOT AVAILABLE';
  try {
    const { Redis } = require('@upstash/redis');
    
    let redis = null;
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      redis = Redis.fromEnv();
      redisStatus = 'CONNECTED (via UPSTASH env vars)';
    } else if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      redis = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      });
      redisStatus = 'CONNECTED (via KV env vars)';
    } else if (process.env.REDIS_URL && process.env.REDIS_URL.startsWith('https://')) {
      redis = new Redis({ url: process.env.REDIS_URL });
      redisStatus = 'CONNECTED (via REDIS_URL)';
    }

    if (redis) {
      // Test the connection
      try {
        await redis.ping();
        redisStatus += ' - PING SUCCESSFUL';
      } catch (pingError) {
        redisStatus += ` - PING FAILED: ${pingError instanceof Error ? pingError.message : 'Unknown error'}`;
      }
    }
  } catch (error) {
    redisStatus = `ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }

  return NextResponse.json({
    message: 'Redis Debug Information',
    environmentVariables: envVars,
    redisStatus,
    timestamp: new Date().toISOString()
  });
}