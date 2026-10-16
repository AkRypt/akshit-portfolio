# Chatbot setup

The assistant answers from `src/lib/akshit-profile.ts`. Edit that file to change what it knows.

It tries providers in this order and uses the first one that has a key and responds:

| Env var | Provider | Default model | Get a free key |
| --- | --- | --- | --- |
| `GROQ_API_KEY` | Groq | `openai/gpt-oss-20b` (free) | https://console.groq.com/keys |
| `GEMINI_API_KEY` | Google Gemini | `gemini-2.5-flash` | https://aistudio.google.com/apikey |
| `HF_TOKEN` | Hugging Face router | `meta-llama/Llama-3.3-70B-Instruct` | https://huggingface.co/settings/tokens |

Override a model with `GROQ_MODEL`, `GEMINI_MODEL` or `HF_MODEL` if a default gets retired.

Add the keys to `.env.local` for local dev and to the Vercel project's environment variables for production.
