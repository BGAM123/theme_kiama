import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useGeneratedDocument, useSaveDocument, useExportDocument } from './useGeneratedDocument';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save, Download, FileText, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { EditorToolbar } from './EditorToolbar';
import { toast } from 'sonner';

export function EditorPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data, isLoading } = useGeneratedDocument(id);
    const { mutate: saveDoc, isPending: isSaving } = useSaveDocument();
    const { mutate: exportDoc, isPending: isExporting } = useExportDocument();

    const editor = useEditor({
        extensions: [StarterKit], // Simplified, assumes StarterKit provides bold/italic/headings
        content: data?.content || '',
        editorProps: {
            attributes: {
                class: 'prose prose-slate prose-indigo max-w-none focus:outline-none min-h-[800px] bg-white p-12 sm:p-16 shadow-[0_4px_40px_rgba(0,0,0,0.06)] ring-1 ring-slate-200/50 mx-auto transition-shadow',
            },
        },
        onUpdate: ({ editor }) => {
            // Debounce simulation logic in a real app would be here
            // For this spec, we trigger save on explicit action or debounced timeout via hook wrapper
        }
    });

    useEffect(() => {
        if (editor && data?.content && !editor.isFocused) {
            // Update content when fetched
            editor.commands.setContent(data.content, false);
        }
    }, [data?.content, editor]);

    const handleManualSave = () => {
        if (editor && data) {
            saveDoc({ id: data.id, content: editor.getHTML() }, {
                onSuccess: () => toast.success("Document enregistré.")
            });
        }
    };

    const handleExport = (format: 'DOCX' | 'PDF' | 'MARKDOWN') => {
        if (data) {
            exportDoc({ id: data.id, format }, {
                onSuccess: () => toast.success(`Export ${format} initié.`)
            });
        }
    };

    if (isLoading || !data) {
        return (
            <div className="h-screen flex flex-col p-8 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-full w-full" />
            </div>
        );
    }

    return (
        <div className="h-screen -m-8 flex flex-col bg-slate-100 overflow-hidden selection:bg-indigo-100 selection:text-indigo-900 animate-in fade-in duration-500">

            {/* HEADER */}
            <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-20">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-slate-500 hover:bg-slate-100">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="font-bold text-slate-800 tracking-tight">{data.title}</h1>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                            {isSaving ? <><Loader2 className="h-3 w-3 animate-spin" /> Enregistrement...</> : <><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Enregistré</>}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleManualSave} disabled={isSaving} className="border-slate-200 shadow-sm text-slate-700">
                        <Save className="h-4 w-4 mr-2" /> {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                    <div className="h-6 w-px bg-slate-200 mx-1" />
                    <Button variant="outline" size="sm" onClick={() => handleExport('PDF')} disabled={isExporting} className="shadow-sm border-slate-200 text-slate-700">PDF</Button>
                    <Button variant="outline" size="sm" onClick={() => handleExport('DOCX')} disabled={isExporting} className="shadow-sm border-slate-200 text-slate-700">DOCX</Button>
                    <Button variant="outline" size="sm" onClick={() => handleExport('MARKDOWN')} disabled={isExporting} className="shadow-sm border-slate-200 text-slate-700">MD</Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">

                {/* TIP TAP EDITOR */}
                <div className="flex-1 flex flex-col relative">
                    <div className="h-12 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-center shrink-0 z-10 sticky top-0 shadow-sm">
                        <EditorToolbar editor={editor} />
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 sm:p-12 pb-32">
                        <div className="max-w-[210mm] mx-auto animate-in slide-in-from-bottom-8 duration-500">
                            <EditorContent editor={editor} />
                        </div>
                    </div>
                </div>

                {/* CONFORMITY PANEL */}
                <div className="w-80 border-l border-slate-200 bg-white shrink-0 flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.03)] z-10 transition-transform">
                    <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-indigo-600" />
                            Conformité
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        <div className="text-center space-y-2 relative">
                            <svg className="w-32 h-32 mx-auto rotate-[-90deg]">
                                <circle cx="64" cy="64" r="56" className="text-slate-100 stroke-current" strokeWidth="12" fill="transparent" />
                                <circle cx="64" cy="64" r="56" className="text-emerald-500 stroke-current transition-all duration-1000 ease-out" strokeWidth="12" fill="transparent" strokeDasharray="351.858" strokeDashoffset={351.858 - (351.858 * (data.conformityScore / 100))} />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">{data.conformityScore}%</span>
                            </div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mt-4">Score de correspondance</p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Vérifications structurelles</h4>
                            <div className="space-y-3">
                                {data.conformityDetails?.map((item, idx) => (
                                    <div key={idx} className="flex gap-3 items-start group">
                                        {item.present ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                                        ) : (
                                            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                                        )}
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-slate-700">{item.sectionLabel}</p>
                                            {!item.present && item.message && (
                                                <p className="text-xs font-medium text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-100">{item.message}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
