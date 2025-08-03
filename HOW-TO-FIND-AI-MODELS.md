# Using DeepSeek-R1 with Hugging Face Inference Client

## ✅ Current Setup (Recommended)

Your chatbot now uses the **DeepSeek-R1** model via Hugging Face's official Inference client, which is much more reliable than the previous approach.

### What's Different:
- ✅ **Official SDK**: Uses `@huggingface/inference` package
- ✅ **Streaming Support**: Real-time response streaming
- ✅ **Better Error Handling**: Graceful fallbacks
- ✅ **Professional Quality**: High-quality responses
- ✅ **Reliable API**: No more model availability issues

### Step 1: Visit Hugging Face Models
Go to: https://huggingface.co/models

### Step 2: Filter Models
Use these filters on the left sidebar:
- **Task**: Select "Text Generation" or "Conversational"
- **Library**: Select "Transformers" 
- **Sort**: "Most downloads" or "Trending"

### Step 3: Look for Inference API Support
Models that work with free inference API will show:
- 🚀 "Inference API" button on the model page
- "Deploy" button 
- "Use this model" section with API examples

### Step 4: Test the Model
1. Click on a model (e.g., `microsoft/DialoGPT-small`)
2. Look for "Inference API" section
3. If you see "This model can be loaded on the Inference API" - it works!

## Recommended Models for Chatbots

### Small & Fast (Good for free tier):
- `microsoft/DialoGPT-small` - Conversational AI, small and fast
- `facebook/blenderbot-400M-distill` - Optimized chatbot model
- `microsoft/DialoGPT-medium` - Balanced size and performance

### Larger Models (May have rate limits):
- `microsoft/DialoGPT-large` - Better responses but slower
- `facebook/blenderbot-1B-distill` - Larger conversational model

## How to Update Your Chatbot Model

1. **Choose a model** from the list above
2. **Copy the model path** (e.g., `microsoft/DialoGPT-small`)
3. **Edit** `src/lib/chatbot-service.ts`
4. **Replace** the `modelUrl` with your new model:

```typescript
private modelUrl = 'https://api-inference.huggingface.co/models/YOUR_MODEL_HERE';
```

Example:
```typescript
private modelUrl = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';
```

## Testing If a Model Works

### Method 1: Check the Model Page
- Visit the model page on Hugging Face
- Look for "Inference API" section
- If present, the model should work

### Method 2: Test via API
Try this in your browser console or terminal:
```bash
curl https://api-inference.huggingface.co/models/microsoft/DialoGPT-small \
  -X POST \
  -d '{"inputs": "Hello, how are you?"}' \
  -H "Content-Type: application/json"
```

If you get a JSON response (not an error), the model works!

## What to Avoid

❌ **Models that won't work:**
- Models without "Inference API" support
- Very large models (>7B parameters) - often unavailable on free tier
- Models marked as "Gated" (require special access)
- Models that say "This model isn't deployed by any Inference Provider"

✅ **Models that will work:**
- Models with "Inference API" button
- Models under 1-2B parameters
- Models with many downloads/stars
- Models with recent activity

## Backup Strategy

Your chatbot is already configured with multiple backup models:
1. Primary model (currently `DialoGPT-small`)
2. Backup models (BlenderBot, etc.)
3. Fallback to contextual responses (always works!)

This ensures your chatbot **always responds**, even if all AI models fail.

## API Key Setup

1. Go to: https://huggingface.co/settings/tokens
2. Create a free account
3. Click "New token"
4. Select "Read" permissions
5. Copy the token
6. Add to `.env.local`:
```
NEXT_PUBLIC_HUGGINGFACE_API_KEY=hf_your_token_here
```

## Troubleshooting

### "Model loading" error:
- The model is initializing (wait a few minutes)
- Try a smaller model

### "Rate limit" error:
- You've exceeded free quota
- Try a different model
- Wait and try again later

### No API key:
- Chatbot still works with contextual responses!
- Add API key for enhanced responses

## Remember

The chatbot has comprehensive **contextual responses** that work perfectly without any AI API. The Hugging Face integration is just an enhancement for dynamic responses to unusual questions!