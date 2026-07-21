import React, { useRef, useEffect, useState } from 'react';
import { useMessages } from './useMessages';
import { useStreamGeneration } from './useStreamGeneration';
import { GenerationParamsDTO, MessageDTO } from '@/types/chat.types';
import { MessageBubble } from './MessageBubble';
import { PromptInput } from './PromptInput';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, FileText, ChevronRight } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ChatThreadProps {
    conversationId?: string;
    currentParams: GenerationParamsDTO;
}

export function ChatThread({ conversationId, currentParams }: ChatThreadProps) {
    const { data: messages, isLoading } = useMessages(conversationId);
    const { generate, isGenerating, abort } = useStreamGeneration();
    const queryClient = useQueryClient();
    const scrollRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Local state for streaming message to show real-time typing
    const [streamingMessage, setStreamingMessage] = useState<string>('');

    // Auto-scroll to bottom behavior
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, streamingMessage]);

    const handleSendPrompt = async (promptText: string) => {
        if (!conversationId) return;

        // Opt-in UI feedback immediately without waiting
        setStreamingMessage('');

        await generate(
            conversationId,
            { ...currentParams, prompt: promptText },
            (chunkText) => {
                setStreamingMessage(prev => prev + chunkText);
            },
            (docId) => {
                // Refresh messages list from backend
                queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
                setStreamingMessage('');
                toast.success("Document généré avec succès !");
            },
            (err) => {
                toast.error("Échec de la génération : " + err.message);
                setStreamingMessage(''); // reset
            }
        );
    };

    if (!conversationId) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-50">
                <EmptyState
                    icon={Bot}
                    title="Sélectionnez une conversation"
                    description="Ouvrez une conversation existante ou créez-en une nouvelle pour commencer à interagir avec l'IA."
                />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative shadow-[inset_1px_0_15px_rgba(0,0,0,0.02)]">
            {/* Header Panel Centre */}
            <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white shrink-0 z-10 shadow-sm">
                <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-slate-800">Thread Principal</h2>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                    <span className="text-sm px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md font-medium border border-indigo-100 flex items-center gap-1.5 shadow-sm">
                        <Bot className="h-3.5 w-3.5" />
                        {currentParams.modelId || 'GPT-4o'}
                    </span>
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate(`/documents/draft/edit`)}>
                    <FileText className="h-4 w-4" />
                    Éditeur visuel
                </Button>
            </div>

            {/* Messages View */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth bg-slate-50/50">
                {isLoading ? (
                    <div className="space-y-6">
                        <div className="flex gap-4 justify-end">
                            <Skeleton className="h-20 w-3/4 rounded-2xl rounded-tr-sm bg-indigo-100" />
                            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                        </div>
                        <div className="flex gap-4">
                            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                            <Skeleton className="h-32 w-3/4 rounded-2xl rounded-tl-sm" />
                        </div>
                    </div>
                ) : messages && messages.length > 0 ? (
                    <>
                        {messages.map((msg, idx) => (
                            <MessageBubble key={msg.id || idx} message={msg} />
                        ))}

                        {/* Streaming Virtual Message */}
                        {isGenerating && (
                            <MessageBubble
                                message={{
                                    id: 'streaming',
                                    conversationId,
                                    role: 'ASSISTANT',
                                    content: streamingMessage,
                                    isComplete: false,
                                    createdAt: new Date().toISOString()
                                }}
                            />
                        )}
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                        <div className="py-12 flex flex-col items-center">
                            <div className="h-24 w-24 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-full flex flex-col items-center justify-center mb-6 shadow-xl ring-8 ring-white">
                                <Bot className="h-10 w-10 text-indigo-600 mb-1" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3 text-center">Comment puis-je vous aider ?</h3>
                            <p className="text-slate-500 text-center max-w-sm mb-8 leading-relaxed">
                                Rédigez votre demande d'extraction de structure ou de génération de contenu ci-dessous.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 sm:px-6 bg-white border-t border-slate-100 shrink-0 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
                <PromptInput
                    onSubmit={handleSendPrompt}
                    isGenerating={isGenerating}
                    onAbort={abort}
                />
                <div className="text-center mt-3">
                    <p className="text-[11px] font-medium text-slate-400">
                        DocuAI peut commettre des erreurs. Vérifiez les documents générés via le panneau de conformité.
                    </p>
                </div>
            </div>
        </div>
    );
}
