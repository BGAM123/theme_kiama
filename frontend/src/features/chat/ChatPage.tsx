import React, { useState } from 'react';
import { ConversationList } from './ConversationList';
import { ChatThread } from './ChatThread';
import { GenerationParams } from './GenerationParams';
import { useParams } from 'react-router-dom';
import { GenerationParamsDTO } from '@/types/chat.types';

export function ChatPage() {
    const { conversationId } = useParams<{ conversationId: string }>();

    // Shared state for the configuration panel logic vs chat dispatch
    const [generationParams, setGenerationParams] = useState<GenerationParamsDTO>({
        documentTypeId: '',
        language: 'Français',
        tone: 'FORMAL',
        targetLength: 'SHORT',
        modelId: '',
        referenceDocumentIds: [],
        prompt: '',
    });

    return (
        <div className="h-full -m-8 flex rounded-xl border border-slate-200 overflow-hidden bg-white shadow-xl animate-in zoom-in-95 duration-500">
            {/* PANEL GAUCHE */}
            <ConversationList activeId={conversationId} />

            {/* PANEL CENTRE */}
            <ChatThread
                conversationId={conversationId}
                currentParams={generationParams}
            />

            {/* PANEL DROIT */}
            <GenerationParams
                params={generationParams}
                onChange={setGenerationParams}
            />
        </div>
    );
}
