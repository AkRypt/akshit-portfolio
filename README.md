# Akshit's Portfolio

A modern, fast Next.js portfolio website with an AI chatbot that can answer questions about Akshit Dayal.

## ✨ Features

- **Modern Design**: Beautiful, responsive UI with gradient animations
- **AI Chatbot**: Interactive AI assistant that knows everything about Akshit
- **Fast Performance**: Built with Next.js 15 and optimized for speed
- **SEO Optimized**: Meta tags, structured data, and performance optimizations
- **Dark Theme**: Sleek dark design with gradient accents
- **Mobile Responsive**: Perfect on all devices

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.1
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI**: Hugging Face Inference API
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd akshit-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   ```

4. **Get your free Hugging Face API key**
   - Go to [Hugging Face](https://huggingface.co/settings/tokens)
   - Create a free account
   - Generate a new API token (select "Read" permission)
   - Add it to your `.env.local` file

   **Note**: The chatbot will work immediately with pre-written responses even without an API key!

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🤖 AI Chatbot Setup

The AI chatbot works immediately with pre-written contextual responses and can optionally use Hugging Face's free inference API for enhanced responses.

### Basic Setup (Works Without API Key):
- The chatbot has comprehensive pre-written responses for common questions
- Works offline and responds instantly
- Covers all aspects of Akshit's background, skills, and experience

### Enhanced Setup (With API Key):
1. **Get API Key**: Sign up at [Hugging Face](https://huggingface.co/settings/tokens) and get a free API key
2. **Add to Environment**: Add your API key to `.env.local`
3. **Automatic Fallback**: If API fails, it gracefully falls back to contextual responses

### Current AI Model:
The chatbot uses the **DeepSeek-R1** model via Hugging Face's official Inference client, which provides:
- **High-quality responses** with streaming support
- **Reliable API** with proper error handling
- **Professional tone** that matches Akshit's personality
- **Fast responses** with real-time streaming

### Changing the AI Model:
If you want to use a different model, edit `src/lib/chatbot-service.ts`:

```typescript
const stream = this.client.chatCompletionStream({
  provider: "novita", // or another provider
  model: "your-model-name", // change this
  messages: [...]
});
```

**Recommended Models:**
- `deepseek-ai/DeepSeek-R1` (current) - High quality, fast
- `meta-llama/Llama-2-7b-chat-hf` - Good for chat
- `microsoft/DialoGPT-medium` - Conversational AI

### Chatbot Features:
- **Contextual Responses**: Pre-written responses for common questions
- **AI Generation**: Dynamic responses using Hugging Face models
- **Knowledge Base**: Comprehensive data about Akshit's background, skills, projects, and experience
- **Professional Personality**: Confident, helpful, and showcases Akshit's capabilities

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and Tailwind config
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx            # Main portfolio page
├── components/
│   └── chat-widget.tsx     # AI chatbot component
├── config/
│   └── site.ts             # Site configuration and data
└── lib/
    ├── knowledge-base.ts   # AI chatbot knowledge base
    ├── chatbot-service.ts  # AI chatbot service
    └── utils.ts           # Utility functions
```

## 🎨 Customization

### Updating Content
Edit `src/config/site.ts` to update:
- Personal information
- Projects and skills
- Contact details
- Social media links

### Updating AI Knowledge Base
Edit `src/lib/knowledge-base.ts` to update:
- Personal background
- Professional experience
- Skills and capabilities
- Project details
- Personality traits

### Styling
- **Colors**: Update gradient colors in `tailwind.config.ts`
- **Fonts**: Modify font settings in `globals.css`
- **Animations**: Adjust Framer Motion animations in components

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

### Environment Variables for Production
Add these to your Vercel project settings:
```
NEXT_PUBLIC_HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS v3.4.1 with custom:
- Color palette with gradients
- Custom animations
- Responsive design utilities
- Custom font (Space Mono)

### SEO Optimization
- Meta tags for social sharing
- Open Graph images
- Structured data
- Performance optimizations

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for speed
- **Bundle Size**: Minimal and optimized
- **Loading Speed**: Fast initial load and interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you need help:
1. Check the [Issues](https://github.com/yourusername/akshit-portfolio/issues) page
2. Create a new issue with detailed information
3. Contact Akshit directly through the portfolio

## 🎯 Roadmap

- [ ] Add Three.js 3D elements
- [ ] Enhanced AI capabilities
- [ ] Blog section
- [ ] Dark/Light theme toggle
- [ ] More interactive animations
- [ ] Performance optimizations

---

**Built with ❤️ by Akshit Dayal**
