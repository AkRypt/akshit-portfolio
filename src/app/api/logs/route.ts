import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const logFile = path.join(process.cwd(), 'logs', 'chatbot-questions.log');
    
    if (!fs.existsSync(logFile)) {
      return NextResponse.json({ 
        questions: [],
        total: 0,
        message: 'No questions logged yet'
      });
    }
    
    const logContent = fs.readFileSync(logFile, 'utf-8');
    const lines = logContent.trim().split('\n').filter(line => line.trim());
    
    const questions = lines.map(line => {
      const match = line.match(/\[(.*?)\]\s*(.*)/);
      if (match) {
        return {
          timestamp: match[1],
          question: match[2]
        };
      }
      return null;
    }).filter(Boolean);
    
    return NextResponse.json({
      questions: questions.reverse(), // Most recent first
      total: questions.length,
      message: `Found ${questions.length} questions`
    });
    
  } catch (error) {
    console.error('Error reading logs:', error);
    return NextResponse.json({ error: 'Failed to read logs' }, { status: 500 });
  }
} 