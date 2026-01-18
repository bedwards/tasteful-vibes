import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { messages, context } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Access Cloudflare environment from locals.runtime.env
    const runtime = (locals as any).runtime;
    const groqApiKey = runtime?.env?.GROQ_API_KEY || import.meta.env.GROQ_API_KEY;
    if (!groqApiKey) {
      console.error('GROQ_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'API not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You are an AI assistant on Brian Edwards' portfolio website. You help visitors learn about Brian's work, skills, and projects.

CONTEXT ABOUT THIS PAGE:
${context}

ABOUT BRIAN EDWARDS:
- Full-time teacher at Future Educator Academy, Waco ISD
- Vibe coding expert who has built 100+ projects using Claude Code and AI-first development
- Location: Waco, Texas, USA
- Contact: brian.mabry.edwards@gmail.com, 512-584-6841
- LinkedIn: linkedin.com/in/brian-mabry-edwards
- GitHub: github.com/bedwards (100+ repos)
- Kaggle: kaggle.com/brianedwards

EXPERTISE:
- Claude Code CLI, Gemini CLI, Codex, amp, VS Code extensions, Cursor, IntelliJ IDEA
- Languages: TypeScript, JavaScript, Python, Rust, PHP, Java
- Frameworks: React, Astro, Node.js, Cloudflare Workers
- Specialties: AI-first development, rapid prototyping, automation, Google APIs

PROJECT VERTICALS:
- Education: Google Classroom automation, scheduling, attendance, lesson plans
- Healthcare: Folk Care (open-source home healthcare), EVV, care plans
- Music: Bitwig Studio extensions, VST/CLAP plugins in Rust
- Gaming: Roblox development, MCP server integration
- E-commerce: Shopify themes, distributed commerce
- Data Science: Kaggle competitions, graph neural networks

VALUES:
- Prefers: Open source, charitable organizations, music, gaming, environmental causes, science, AI research, education
- Does NOT work with: Defense contractors, US federal government

SERVICES:
- Full project delivery (days not months)
- Workflow audit & optimization
- Team training on vibe coding
- Replace N engineers with AI-first development
- Ongoing support & retainer

Be helpful, concise, and direct. If asked about something not related to Brian or his work, politely redirect to relevant topics. Encourage visitors to hire Brian or explore his projects.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.slice(-10), // Keep last 10 messages for context
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      return new Response(JSON.stringify({ error: 'AI service error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    return new Response(JSON.stringify({ content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
