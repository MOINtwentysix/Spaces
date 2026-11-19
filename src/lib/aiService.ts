import type { AIProviderKeys } from './types/space';

export type AIAssistAction = 
  | 'improve_bio'
  | 'generate_tagline'
  | 'draft_blog_post'
  | 'suggest_quote'
  | 'curate_room_objects';

export interface AIRequest {
  action: AIAssistAction;
  topic?: string;
  context?: string;
  tone?: 'minimal' | 'poetic' | 'executive' | 'academic';
}

export async function runAIAssistant(req: AIRequest, keys: AIProviderKeys): Promise<string> {
  // If user provided an OpenAI key:
  if (keys.openai && keys.openai.trim().length > 5) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${keys.openai.trim()}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are the creative architectural copywriter for Spaces by Oria, a calm, Apple-inspired personal publishing platform. Write in a thoughtful, dignified, minimalist voice. Avoid corporate buzzwords, exclamation points, and hollow marketing jargon.'
            },
            {
              role: 'user',
              content: getPromptForAction(req)
            }
          ],
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content.trim();
      }
    } catch (e) {
      console.warn('OpenAI request error, falling back to local heuristic', e);
    }
  }

  // If user provided Gemini key:
  if (keys.gemini && keys.gemini.trim().length > 5) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keys.gemini.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are the creative copywriter for Spaces by Oria (a calm, Apple-inspired personal website platform). ${getPromptForAction(req)}`
            }]
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text.trim();
      }
    } catch (e) {
      console.warn('Gemini request error, falling back to local heuristic', e);
    }
  }

  // Graceful offline simulated intelligence (works out of the box without requiring real keys)
  return getCuratedFallback(req);
}

function getPromptForAction(req: AIRequest): string {
  switch (req.action) {
    case 'improve_bio':
      return `Refine this bio into a 2-sentence poetic, elegant personal introduction for a digital room: "${req.context || req.topic}". Tone: ${req.tone || 'minimal'}.`;
    case 'generate_tagline':
      return `Generate 3 short, evocative taglines for a personal website about: "${req.topic}". Tone: calm, confident, understated.`;
    case 'draft_blog_post':
      return `Write a short, reflective personal essay (300 words) formatted in markdown on the subject: "${req.topic}". Include an opening reflection, two short analytical points, and a closing aphorism.`;
    case 'suggest_quote':
      return `Provide a timeless, inspiring architectural or philosophical quote about space, craft, solitude or creativity related to: "${req.topic || 'minimalism'}". Format: "Quote" — Author.`;
    case 'curate_room_objects':
      return `Suggest 4 thoughtful objects or blocks a creator in "${req.topic}" should place inside their personal digital room.`;
    default:
      return req.topic || 'Generate thoughtful personal content.';
  }
}

function getCuratedFallback(req: AIRequest): string {
  switch (req.action) {
    case 'improve_bio':
      return `Crafting quiet digital artifacts and physical tools in the intersection of hardware and human memory. Spending mornings observing light and afternoons building spaces on the web.`;

    case 'generate_tagline':
      return `1. An architecture of quiet thoughts on the internet.
2. Building instruments for focused human attention.
3. A personal sanctuary for essays, tools, and visual studies.`;

    case 'draft_blog_post':
      return `### On the Necessity of Private Corners

Every generation seeks its own refuge. In the twentieth century, writers looked for quiet studios with north-facing windows and heavy wooden doors. Today, our creative struggle is no longer physical isolation, but shielding our interior monologue from the constant hum of network notifications.

#### Intentional Spaces
When we furnish our own websites with care—choosing typography that breathes, placing images with deliberate restraint—we offer visitors something rare: a space that asks nothing in return.

#### The Return to Craft
The future of the internet does not belong to endless feeds designed to optimize dwell time. It belongs to individuals creating digital spaces that feel like home.`;

    case 'suggest_quote':
      return `"Simplicity is not the lack of clutter, that's a consequence of simplicity. Simplicity somehow essentially describes the purpose and place of an object and what it is." — Jony Ive`;

    case 'curate_room_objects':
      return `1. Ambient Soundtrack Block: A curated 4-track field recording of rain and ambient piano.
2. Studio Sketchbook: A 3-column photo grid documenting raw prototypes.
3. Quiet Library: Direct bookmarks to three foundational books that formed your perspective.
4. Dispatch Note: An invitation for thoughtful correspondence via email.`;

    default:
      return 'Refined digital thought generated by Spaces by Oria.';
  }
}
