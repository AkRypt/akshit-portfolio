import { NextResponse } from 'next/server';

// Type for Redis instance
interface RedisInstance {
  zrange: (key: string, start: number, stop: number, options?: { rev?: boolean }) => Promise<string[]>;
  hgetall: (key: string) => Promise<Record<string, string> | null>;
}

// Initialize Redis connection
async function getRedisClient(): Promise<RedisInstance | null> {
  try {
    const { Redis } = await import('@upstash/redis');
    
    // Try different environment variable configurations
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      // Standard Upstash variables from Vercel integration
      return Redis.fromEnv() as RedisInstance;
    } else if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      // Vercel KV variables (should work with Upstash REST API)
      return new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      }) as RedisInstance;
    // Note: REDIS_URL alone is not supported as Upstash requires both url and token
    } else {
      console.warn('No compatible Redis environment variables found');
      return null;
    }
  } catch {
    console.warn('Upstash Redis not available for reading logs');
    return null;
  }
}

export async function GET() {
  try {
    // Try to get Redis client
    const redis = await getRedisClient();
    if (!redis) {
      return NextResponse.json({ 
        questions: [],
        total: 0,
        message: 'Upstash Redis not configured. Questions are logged to console only. See SETUP-UPSTASH.md for setup instructions.'
      });
    }
    
    // Get question IDs from timeline (most recent first)
    const questionIds = await redis.zrange('questions:timeline', 0, 99, { rev: true }); // Get last 100 questions
    
    if (!questionIds || questionIds.length === 0) {
      return NextResponse.json({ 
        questions: [],
        total: 0,
        message: 'No questions logged yet'
      });
    }
    
    // Fetch question data for each ID
    const questions = [];
    for (const id of questionIds) {
      try {
        const questionData = await redis.hgetall(`question:${id}`);
        if (questionData && questionData.question) {
          questions.push({
            id: questionData.id,
            timestamp: questionData.timestamp,
            question: questionData.question
          });
        }
      } catch (err) {
        console.error(`Failed to fetch question ${id}:`, err);
      }
    }
    
    return NextResponse.json({
      questions,
      total: questions.length,
      message: `Found ${questions.length} questions`
    });
    
  } catch (error) {
    console.error('Error reading questions from Redis:', error);
    return NextResponse.json({ 
      error: 'Failed to read questions',
      questions: [],
      total: 0,
      message: 'Error fetching questions from database'
    }, { status: 500 });
  }
} 