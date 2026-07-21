import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { chatPromptSchema, ChatPromptFormData } from './chat.schema';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Paperclip, Square, SendHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PromptInputProps {
    onSubmit: (text: string) => void;
    isGenerating?: boolean;
    onAbort?: () => void;
}

export function PromptInput({ onSubmit, isGenerating, onAbort }: PromptInputProps) {
    const form = useForm<ChatPromptFormData>({
        resolver: zodResolver(chatPromptSchema),
        defaultValues: { prompt: '' }
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            form.handleSubmit((data) => {
                onSubmit(data.prompt);
                form.reset();
            })();
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) => { onSubmit(data.prompt); form.reset(); })}
                className="relative max-w-4xl mx-auto rounded-2xl bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:border-indigo-300 focus-within:shadow-md transition-all duration-300"
            >
                <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Demandez une génération documentaire ou décrivez la structure attendue..."
                                    className={cn(
                                        "min-h-[56px] w-full resize-none bg-transparent border-0 focus-visible:ring-0 px-4 py-4 text-base",
                                        isGenerating && "opacity-60 cursor-not-allowed"
                                    )}
                                    onKeyDown={handleKeyDown}
                                    disabled={isGenerating}
                                    rows={2}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex items-center justify-between px-3 pb-3">
                    <div className="flex items-center gap-1">
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full" disabled={isGenerating}>
                            <Paperclip className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        {isGenerating ? (
                            <Button type="button" onClick={onAbort} variant="destructive" size="icon" className="h-9 w-9 rounded-full shadow-lg hover:scale-105 transition-transform animate-in fade-in zoom-in">
                                <Square className="h-3.5 w-3.5 fill-current" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                size="icon"
                                disabled={form.watch('prompt').length === 0}
                                className={cn(
                                    "h-9 w-9 rounded-full shadow-md transition-all",
                                    form.watch('prompt').length > 0 ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-slate-200 text-slate-400"
                                )}
                            >
                                <SendHorizontal className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </form>
        </Form>
    );
}
