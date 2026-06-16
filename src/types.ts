export type BusinessType = 'education' | 'services' | 'retail';
export type ResponseStyle = 'friendly' | 'formal' | 'technical';
export type ChannelType = 'web' | 'whatsapp' | 'telegram' | 'ticket';
export type ConversationStatus = 'active' | 'escalated' | 'resolved';

export interface Business {
  id: string;
  name: string;
  type: BusinessType;
  field: string;
  contact: string;
  workingHours: string;
  welcomeMessage: string;
  responseStyle: ResponseStyle;
  maxTokens: number;
  apiKey: string;
  isActive: boolean;
  brandColor?: string;
}

export interface KnowledgeDetail {
  key: string;
  value: string;
  title: string;
}

export interface CustomQA {
  id: string;
  question: string;
  answer: string;
}

export interface Message {
  id: string;
  sender: 'customer' | 'ai' | 'system';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  customerName: string;
  channel: ChannelType;
  status: ConversationStatus;
  lastMessage: string;
  lastMessageTime: string;
  messagesCount: number;
  updatedAt: string;
  messages: Message[];
}

export interface TokenUsageHistory {
  date: string;
  count: number;
  conversations: number;
}

export interface TokenUsage {
  current: number;
  limit: number;
  resetDate: string;
  history: TokenUsageHistory[];
}
