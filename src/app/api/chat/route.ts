import { NextRequest, NextResponse } from 'next/server';
import { chatbotService } from '@/lib/chatbot-service';

// Type for Redis instance
interface RedisInstance {
  hset: (key: string, data: Record<string, unknown>) => Promise<number>;
  zadd: (key: string, options: { score: number; member: string }) => Promise<number>;
  zcard: (key: string) => Promise<number>;
  zrange: (key: string, start: number, stop: number) => Promise<string[]>;
  del: (...keys: string[]) => Promise<number>;
  zremrangebyrank: (key: string, start: number, stop: number) => Promise<number>;
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
    console.warn('Upstash Redis not available, questions will only be logged to console and analytics');
    return null;
  }
}

// Function to log questions to Upstash Redis
async function logQuestion(question: string, timestamp: string) {
  // Always log to console as backup
  console.log(`[${timestamp}] Question: ${question}`);
  
  // Try to get Redis client
  const redis = await getRedisClient();
  if (!redis) {
    console.log('Redis not available, question logged to console only');
    return;
  }
  
  try {
    const questionData = {
      question,
      timestamp,
      id: Date.now().toString()
    };
    
    // Store individual question
    await redis.hset(`question:${questionData.id}`, questionData);
    
    // Add to sorted set for easy retrieval (score = timestamp for ordering)
    await redis.zadd('questions:timeline', { score: Date.now(), member: questionData.id });
    
    // Keep only last 1000 questions to avoid storage bloat
    const count = await redis.zcard('questions:timeline');
    if (count > 1000) {
      const toRemove = await redis.zrange('questions:timeline', 0, count - 1001);
      if (toRemove.length > 0) {
        // Remove old question data
        for (const id of toRemove) {
          await redis.del(`question:${id}`);
        }
        // Remove from timeline
        await redis.zremrangebyrank('questions:timeline', 0, count - 1001);
      }
    }
    console.log(`Question successfully logged to Redis: ${questionData.id}`);
  } catch (error) {
    console.error('Failed to log question to Redis:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    
    // Log the question (async, don't wait for it)
    const timestamp = new Date().toISOString();
    logQuestion(message, timestamp).catch(err => 
      console.error('Logging failed:', err)
    );
    
    const response = await chatbotService.getResponse(message);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 