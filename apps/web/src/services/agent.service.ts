import { AgentIdentity, AgentMetrics, ChatMessage } from '@/types/models';
import data from '@/features/agent/agent-data.json';

// @TODO: Connect to Supabase 'agent_configs' table
export async function getAgentIdentity(): Promise<AgentIdentity> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return data.identity as AgentIdentity;
}

export async function getAgentMetrics(): Promise<AgentMetrics> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return data.metrics as AgentMetrics;
}

export async function getPreviewConversation(): Promise<ChatMessage[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return data.previewConversation as ChatMessage[];
}

export async function getToneOptions() {
  return data.toneOptions;
}

export async function getTimezoneOptions() {
  return data.timezoneOptions;
}

export async function getLanguageOptions() {
  return data.languageOptions;
}
