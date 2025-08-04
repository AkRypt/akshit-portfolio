import { NextRequest, NextResponse } from 'next/server';
import { chatbotService } from '@/lib/chatbot-service';
import fs from 'fs';
import path from 'path';

// Function to log questions
function logQuestion(question: string, timestamp: string) {
  try {
    const logDir = path.join(process.cwd(), 'logs');
    const logFile = path.join(logDir, 'chatbot-questions.log');
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    const logEntry = `[${timestamp}] ${question}\n`;
    fs.appendFileSync(logFile, logEntry);
  } catch (error) {
    console.error('Failed to log question:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    
    // Log the question
    const timestamp = new Date().toISOString();
    logQuestion(message, timestamp);
    
    const response = await chatbotService.getResponse(message);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 