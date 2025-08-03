import { akshitKnowledgeBase, KnowledgeBase } from './knowledge-base';
import { InferenceClient } from '@huggingface/inference';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  confidence: number;
  source?: string;
}

class ChatbotService {
  private client: InferenceClient | null = null;
  private apiKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || '';

  constructor() {
    if (this.apiKey && this.apiKey !== 'your_huggingface_api_key_here') {
      this.client = new InferenceClient(this.apiKey);
    }
  }

  // Smart context retrieval based on question type
  private getRelevantContext(userMessage: string): string {
    const message = userMessage.toLowerCase();
    let relevantSections: any[] = [];
    
    // Skills and capabilities
    if (message.includes('skill') || message.includes('strength') || message.includes('good at') || message.includes('capable') || message.includes('expert')) {
      relevantSections.push(akshitKnowledgeBase.skills, akshitKnowledgeBase.professional);
    }
    
    // Projects and work
    if (message.includes('project') || message.includes('built') || message.includes('work') || message.includes('portfolio')) {
      relevantSections.push(akshitKnowledgeBase.projects, akshitKnowledgeBase.professional);
    }
    
    // Personality and traits
    if (message.includes('personality') || message.includes('person') || message.includes('like') || message.includes('attitude') || message.includes('behavior') || message.includes('character')) {
      relevantSections.push(akshitKnowledgeBase.personality, akshitKnowledgeBase.workStyle);
    }
    
    // Background and personal
    if (message.includes('background') || message.includes('who') || message.includes('about') || message.includes('from') || message.includes('personal')) {
      relevantSections.push(akshitKnowledgeBase.personal, akshitKnowledgeBase.education);
    }
    
    // Experience and professional
    if (message.includes('experience') || message.includes('career') || message.includes('professional') || message.includes('job') || message.includes('role')) {
      relevantSections.push(akshitKnowledgeBase.professional, akshitKnowledgeBase.achievements);
    }
    
    // Education
    if (message.includes('education') || message.includes('study') || message.includes('degree') || message.includes('school') || message.includes('university')) {
      relevantSections.push(akshitKnowledgeBase.education);
    }
    
    // Interests and hobbies
    if (message.includes('interest') || message.includes('hobby') || message.includes('fun') || message.includes('free time') || message.includes('enjoy')) {
      relevantSections.push(akshitKnowledgeBase.interests);
    }
    
    // Contact and hiring
    if (message.includes('contact') || message.includes('hire') || message.includes('email') || message.includes('reach') || message.includes('available')) {
      relevantSections.push(akshitKnowledgeBase.contact, akshitKnowledgeBase.workStyle);
    }
    
    // Weaknesses (special case)
    if (message.includes('weakness') || message.includes('bad at') || message.includes('struggle') || message.includes('challenge')) {
      relevantSections.push(akshitKnowledgeBase.personality, akshitKnowledgeBase.workStyle);
    }
    
    // If no specific match, provide general overview
    if (relevantSections.length === 0) {
      relevantSections.push(akshitKnowledgeBase.personal, akshitKnowledgeBase.professional, akshitKnowledgeBase.skills);
    }
    
    // Remove duplicates and stringify
    const uniqueSections = [...new Set(relevantSections)];
    return JSON.stringify(uniqueSections, null, 2);
  }

  // Generate AI response using Hugging Face Inference client
  private async generateAIResponse(userMessage: string, context: string): Promise<string> {
    if (!this.client) {
      return this.getFallbackResponse(userMessage);
    }

    try {
      const stream = this.client.chatCompletionStream({
        provider: "novita",
        model: "deepseek-ai/DeepSeek-R1",
        messages: [
          {
            role: "system",
            content: context
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      });

      let response = "";
      for await (const chunk of stream) {
        if (chunk.choices && chunk.choices.length > 0) {
          const newContent = chunk.choices[0].delta.content;
          if (newContent) {
            response += newContent;
          }
        }
      }

      // Clean the response
      const cleanedResponse = this.cleanAIResponse(response.trim());
      return cleanedResponse || this.getFallbackResponse(userMessage);
    } catch (error) {
      console.error('AI generation error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  // Extract response from <response> tags
  private cleanAIResponse(response: string): string {
    if (!response) return '';

    // First, try to extract content from <response> tags
    const responseMatch = response.match(/<response>([\s\S]*?)<\/response>/);
    if (responseMatch) {
      let cleaned = responseMatch[1].trim();
      
      // Remove any remaining XML-like tags within the response
      cleaned = cleaned.replace(/<[^>]*>/g, '');
      
      // Clean up whitespace
      cleaned = cleaned.replace(/\s+/g, ' ').trim();
      
      if (cleaned.length > 10) {
        return cleaned;
      }
    }
    
    // Fallback: If no <response> tags found, try to clean the raw response
    let cleaned = response;
    
    // Remove think tags and their content
    cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/g, '');
    
    // Remove any remaining XML-like tags
    cleaned = cleaned.replace(/<[^>]*>/g, '');
    
    // Remove thinking patterns
    cleaned = cleaned.replace(/(Let me think about this|I need to consider|Based on the information|According to the context|Looking at this question).*?(\.|,)/gi, '');
    
    // Clean up whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    // If still empty or too short, return fallback
    if (cleaned.length < 10) {
      return this.getFallbackResponse('');
    }
    
    return cleaned;
  }

  private getFallbackResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();

    if (message.includes('help') || message.includes('what can you')) {
      return "I can tell you about Akshit's background, skills, projects, education, work experience, and personality. Try asking me things like 'What are his skills?' or 'Tell me about his projects' or 'What kind of person is he?'";
    }

    if (message.includes('thank') || message.includes('thanks')) {
      return "You're welcome! Is there anything else you'd like to know about Akshit?";
    }

    return "I'd love to help you learn more about Akshit! Try asking me about his skills, projects, work experience, education, or what kind of person he is. I have lots of information to share!";
  }

  // Main method to get response
  async getResponse(userMessage: string): Promise<ChatResponse> {
    // Check if question is outside knowledge base scope
    const message = userMessage.toLowerCase();
    const personalQuestions = ['married', 'dating', 'girlfriend', 'boyfriend', 'single', 'relationship', 'family drama', 'personal life', 'private', 'salary', 'money', 'income', 'politics', 'religion'];
    
    if (personalQuestions.some(word => message.includes(word))) {
      return {
        message: "I can't answer personal questions like that. I can tell you about Akshit's professional background, skills, projects, and work-related topics though!",
        confidence: 1.0,
        source: 'fallback'
      };
    }

    // Get relevant context based on the question
    const relevantContext = this.getRelevantContext(userMessage);

    // Build the system prompt with relevant context
    const context = `You are Akshit Dayal's AI assistant. Answer questions about Akshit using the provided context.

CRITICAL RULES:
- Always wrap your final answer in <response></response> tags
- Give balanced, informative answers (2-5 sentences)
- Be professional and confident
- Answer based ONLY on the provided context
- If the context doesn't contain enough information, say "I don't have enough information about that specific topic"
- Show Akshit in a positive light but be authentic

CONTEXT:
${relevantContext}

Example format:
<response>
Akshit's main strengths include full-stack development expertise and rapid learning ability. He has proven experience with multiple startups and excels at integrating AI into practical solutions.
</response>`;

    const aiResponse = await this.generateAIResponse(userMessage, context);

    return {
      message: aiResponse,
      confidence: 0.9,
      source: 'ai'
    };
  }

  // Get knowledge base data for specific queries
  getKnowledgeData(query: string): any {
    const queryLower = query.toLowerCase();

    if (queryLower.includes('project') || queryLower.includes('work')) {
      return akshitKnowledgeBase.projects;
    }

    if (queryLower.includes('skill') || queryLower.includes('technology')) {
      return akshitKnowledgeBase.skills;
    }

    if (queryLower.includes('personality') || queryLower.includes('style')) {
      return akshitKnowledgeBase.personality;
    }

    if (queryLower.includes('education') || queryLower.includes('degree')) {
      return akshitKnowledgeBase.education;
    }

    return null;
  }
}

export const chatbotService = new ChatbotService(); 