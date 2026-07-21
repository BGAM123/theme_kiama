import React from 'react';
import { MessageDTO } from '@/types/chat.types';
import { Avatar } from '@/components/shared/Avatar';
import { cn } from '@/lib/utils';
import { Bot, Edit3, Copy, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function MessageBubble({ message }: { message: MessageDTO }) {
    const isUser = message.role === 'USER';
    const navigate = useNavigate();

    return (
        <div className={cn("flex gap-3 max-w-4xl mx-auto w-full", isUser ? "flex-row-reverse" : "flex-row")}>
            {isUser ? (
                <Avatar firstName="Admin" lastName="User" className="bg-slate-200 text-slate-700 h-8 w-8 text-xs shrink-0" />
            ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shrink-0 shadow-md ring-2 ring-white">
                    <Bot className="h-4 w-4 text-white" />
                </div>
            )}

            <div className={cn(
                "flex flex-col gap-2 max-w-[85%]", // Prevent extremely wide bubbles
                isUser ? "items-end" : "items-start"
            )}>
                <div className={cn(
                    "px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm transition-all duration-300",
                    isUser
                        ? "bg-indigo-600 text-white rounded-tr-sm"
                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm ring-1 ring-slate-900/5",
                    // Streaming visual effect
                    (!message.isComplete && !isUser) && "border-indigo-200 bg-indigo-50/30"
                )}>
                    {/* Simple basic markdown rendering simulation replacing \n with <br/> */}
                    {message.content ? (
                        <div dangerouslySetInnerHTML={{ __html: message.content.replace(/\n\n/g, '<br/><br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/### (.*?)\n/g, '<h3 class="font-bold text-lg mt-3 mb-1">$1</h3>') }} />
                    ) : (
                        <div className="flex items-center gap-2 text-indigo-500 h-6">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm font-medium animate-pulse">Génération en cours...</span>
                        </div>
                    )}

                    {/* Blink cursor for streaming */}
                    {!message.isComplete && message.content.length > 0 && (
                        <span className="inline-block w-2h-4 ml-1 bg-indigo-500 animate-[pulse_0.75s_infinite]">&nbsp;</span>
                    )}
                </div>

                {/* Bubble footer for assistant */}
                {!isUser && message.isComplete && message.generatedDocumentId && (
                    <div className="flex items-center gap-3 mt-1.5 pl-2">
                        {message.conformityScore !== undefined && (
                            <div className="flex items-center gap-1.5 border border-emerald-200 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
                                <CheckCircle2 className="h-3 w-3" />
                                Score : {message.conformityScore}%
                            </div>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs bg-white hover:bg-slate-50 border-slate-200 shadow-sm transition-all text-slate-600"
                            onClick={() => navigate(`/documents/${message.generatedDocumentId}/edit`)}
                        >
                            <Edit3 className="h-3 w-3 mr-1.5" /> Éditeur
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs px-2 text-slate-500 hover:text-slate-700 transition-colors">
                            <Copy className="h-3 w-3 mr-1.5" /> Copier
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
