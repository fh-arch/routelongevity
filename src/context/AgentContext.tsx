import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getAgentProfile, saveAgentProfile, sendAgentMessage } from '../api';
import { ChatMessage, HealthProfile, RouteSuggestion } from '../types';
import { useLanguage } from './LanguageContext';

interface AgentContextValue {
  messages: ChatMessage[];
  sessionId: string;
  isOpen: boolean;
  isLoading: boolean;
  error: string;
  userProfile: HealthProfile | null;
  profileLoaded: boolean;
  showWizard: boolean;
  suggestions: RouteSuggestion[];
  openAgent: () => void;
  closeAgent: () => void;
  sendMessage: (text: string) => Promise<void>;
  startWithQuery: (text: string) => Promise<void>;
  clearSession: () => void;
  saveProfile: (profile: HealthProfile) => Promise<void>;
  dismissWizard: () => void;
}

const AgentContext = createContext<AgentContextValue | null>(null);

const sessionKey = 'route_longevity_agent_session_id';
const messagesKey = 'route_longevity_agent_messages';

function createSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `agent-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function initialSessionId() {
  const saved = sessionStorage.getItem(sessionKey);
  if (saved) return saved;
  const next = createSessionId();
  sessionStorage.setItem(sessionKey, next);
  return next;
}

function initialMessages() {
  try {
    const saved = sessionStorage.getItem(messagesKey);
    return saved ? JSON.parse(saved) as ChatMessage[] : [];
  } catch (error) {
    return [];
  }
}

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [sessionId, setSessionId] = useState(initialSessionId);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState<HealthProfile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [showWizard, setShowWizard] = useState(false);

  const persistMessages = (nextMessages: ChatMessage[]) => {
    setMessages(nextMessages);
    sessionStorage.setItem(messagesKey, JSON.stringify(nextMessages));
  };

  useEffect(() => {
    if (!isOpen || profileLoaded) return;
    getAgentProfile()
      .then(({ profile }) => {
        setUserProfile(profile);
        setProfileLoaded(true);
        if (!profile) setShowWizard(true);
      })
      .catch(() => {
        setProfileLoaded(true);
      });
  }, [isOpen, profileLoaded]);

  const saveProfile = async (profile: HealthProfile) => {
    const { profile: saved } = await saveAgentProfile(profile);
    setUserProfile(saved);
    setShowWizard(false);
  };

  const dismissWizard = () => setShowWizard(false);

  const clearSession = () => {
    const nextSessionId = createSessionId();
    setSessionId(nextSessionId);
    sessionStorage.setItem(sessionKey, nextSessionId);
    persistMessages([]);
    setError('');
  };

  const sendMessage = async (text: string) => {
    const content = text.trim();
    if (!content || isLoading) return;

    setIsOpen(true);
    setError('');
    setIsLoading(true);

    const userMessage: ChatMessage = {
      id: createSessionId(),
      role: 'user',
      type: 'text',
      content,
      timestamp: new Date().toISOString(),
    };

    const loadingMessage: ChatMessage = {
      id: createSessionId(),
      role: 'agent',
      type: 'loading',
      content: language === 'tr' ? 'Rota ajanı düşünüyor...' : 'Route agent is thinking...',
      timestamp: new Date().toISOString(),
    };

    const baseMessages = [...messages, userMessage, loadingMessage];
    persistMessages(baseMessages);

    try {
      const response = await sendAgentMessage({
        message: content,
        sessionId,
        language,
      });

      const agentMessage = response.message || {
        id: createSessionId(),
        role: 'agent' as const,
        type: response.suggestions.length ? 'route_suggestion' as const : 'text' as const,
        content: response.reply,
        suggestions: response.suggestions,
        timestamp: new Date().toISOString(),
      };

      persistMessages([...baseMessages.filter((message) => message.type !== 'loading'), agentMessage]);
    } catch (apiError) {
      const message = apiError instanceof Error ? apiError.message : 'Agent request failed.';
      setError(message);
      persistMessages([
        ...baseMessages.filter((item) => item.type !== 'loading'),
        {
          id: createSessionId(),
          role: 'agent',
          type: 'text',
          content: message,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startWithQuery = async (text: string) => {
    setIsOpen(true);
    await sendMessage(text);
  };

  const suggestions = useMemo(
    () => messages.flatMap((message) => message.suggestions || []),
    [messages],
  );

  const value = useMemo<AgentContextValue>(() => ({
    messages,
    sessionId,
    isOpen,
    isLoading,
    error,
    userProfile,
    profileLoaded,
    showWizard,
    suggestions,
    openAgent: () => setIsOpen(true),
    closeAgent: () => setIsOpen(false),
    sendMessage,
    startWithQuery,
    clearSession,
    saveProfile,
    dismissWizard,
  }), [messages, sessionId, isOpen, isLoading, error, userProfile, profileLoaded, showWizard, suggestions]);

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used inside AgentProvider');
  }
  return context;
}
