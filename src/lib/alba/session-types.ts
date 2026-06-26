// Tipi condivisi tra client (composable, componenti Vue) e server (API endpoints)

export type AbVariant = 'proactive' | 'reactive';

export interface AlbaSessionInit {
  uid: string;
  session_id: string;
  ab_variant: AbVariant;
  is_new_user: boolean;
}

export interface AlbaPageContext {
  url: string;
  section?: string;
  slug?: string;
  title?: string;
}

export interface AlbaChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Tipi degli eventi SSE emessi da /api/alba/chat
export type AlbaChatChunk =
  | { type: 'session'; session_id: string }
  | { type: 'text'; delta: string }
  | { type: 'tool_use'; name: string; input: Record<string, unknown> }
  | { type: 'tool_result'; name: string; output: unknown }
  | { type: 'error'; message: string }
  | { type: 'done'; tokens: { in: number; out: number }; cost_eur: number };
