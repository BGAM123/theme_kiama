import React, { useState } from 'react';
import { GenerationParamsDTO } from '@/types/chat.types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { SlidersHorizontal, FileText, Languages, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDocumentTypes } from '../document-types/useDocumentTypes';

interface GenerationParamsProps {
    params: GenerationParamsDTO;
    onChange: (params: GenerationParamsDTO) => void;
}

export function GenerationParams({ params, onChange }: GenerationParamsProps) {
    const [isOpen, setIsOpen] = useState(true);

    // NOTE: mock call here to allow compilation, actual layout handled via mocking.
    // const { data: docTypes } = useDocumentTypes({ status: 'ACTIVE' });

    const update = (key: keyof GenerationParamsDTO, value: any) => {
        onChange({ ...params, [key]: value });
    };

    const tones = [
        { id: 'FORMAL', label: 'Formel' },
        { id: 'NEUTRAL', label: 'Neutre' },
        { id: 'DIRECT', label: 'Direct' }
    ];

    const lengths = [
        { id: 'SHORT', label: 'Court' },
        { id: 'MEDIUM', label: 'Moyen' },
        { id: 'LONG', label: 'Long' }
    ];

    return (
        <div className={cn("flex flex-col bg-white border-l border-slate-200 transition-all duration-300 z-20 shadow-[0_4px_30px_rgba(0,0,0,0.03)]", isOpen ? "w-72 sm:w-80" : "w-12")}>
            <div className="flex h-16 items-center justify-between border-b border-slate-100 px-3 cursor-pointer select-none shrink-0" onClick={() => setIsOpen(!isOpen)}>
                {isOpen && (
                    <div className="flex items-center gap-2 pl-1 animate-in fade-in">
                        <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
                        <span className="font-semibold text-slate-800 text-sm">Paramètres</span>
                    </div>
                )}
                <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 hover:bg-slate-100 ml-auto text-slate-400">
                    <ChevronRight className={cn("h-4 w-4 transition-transform duration-300", isOpen ? "rotate-0" : "rotate-180")} />
                </Button>
            </div>

            {isOpen && (
                <div className="flex-1 overflow-y-auto p-5 space-y-8 animate-in slide-in-from-right-4 duration-300 custom-scrollbar">

                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500 font-bold mb-3"><FileText className="h-3.5 w-3.5" /> Document Type</Label>
                        <Select value={params.documentTypeId} onValueChange={(val) => update('documentTypeId', val)}>
                            <SelectTrigger className="w-full bg-slate-50 border-slate-200 hover:border-indigo-300 transition-colors shadow-sm">
                                <SelectValue placeholder="Sélectionnez..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dt_1">Contrat de Travail</SelectItem>
                                <SelectItem value="dt_2">Accord de Confidentialité</SelectItem>
                                <SelectItem value="dt_3">Bilan Financier</SelectItem>
                            </SelectContent>
                        </Select>
                        <a href={`/document-types/${params.documentTypeId}/structure`} className={cn("text-[11px] font-semibold flex items-center justify-end mt-1.5 transition-opacity", params.documentTypeId ? "text-indigo-600 hover:text-indigo-800" : "opacity-0 pointer-events-none")}>
                            Prévisualiser la structure <ChevronRight className="h-3 w-3 ml-0.5" />
                        </a>
                    </div>

                    <div className="h-px w-full bg-slate-100" />

                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500 font-bold mb-3"><Languages className="h-3.5 w-3.5" /> Langue cible</Label>
                        <Select value={params.language} onValueChange={(val) => update('language', val)}>
                            <SelectTrigger className="w-full shadow-sm bg-slate-50 hover:bg-white transition-colors border-slate-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Français">Français</SelectItem>
                                <SelectItem value="Anglais">Anglais</SelectItem>
                                <SelectItem value="Espagnol">Espagnol</SelectItem>
                                <SelectItem value="Allemand">Allemand</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Ton éditorial</Label>
                        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                            {tones.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => update('tone', t.id)}
                                    className={cn(
                                        "text-xs py-1.5 rounded-lg transition-all font-medium",
                                        params.tone === t.id ? "bg-white shadow-sm text-indigo-700" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Longueur attendue</Label>
                        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                            {lengths.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => update('targetLength', t.id)}
                                    className={cn(
                                        "text-xs py-1.5 rounded-lg transition-all font-medium",
                                        params.targetLength === t.id ? "bg-white shadow-sm text-indigo-700 flex items-center justify-center gap-1" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    {params.targetLength === t.id && <Check className="h-3 w-3" />}
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Modèle IA</Label>
                        <Select value={params.modelId} onValueChange={(val) => update('modelId', val)}>
                            <SelectTrigger className="w-full shadow-sm bg-slate-50 hover:bg-white transition-colors border-slate-200">
                                <SelectValue placeholder="Choisir un modèle..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mod_1">GPT-4o (Par défaut)</SelectItem>
                                <SelectItem value="mod_2">Claude 3.5 Sonnet</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                </div>
            )}
        </div>
    );
}
